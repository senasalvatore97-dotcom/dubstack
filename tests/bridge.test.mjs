import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';

const code = readFileSync(new URL('../extension/background.js', import.meta.url), 'utf8');

function setup() {
  const calls = [];
  let handler;
  const respond = (url, body, type = 'json') => ({
    status: 200, ok: true, url,
    async text() { return type === 'text' ? body : JSON.stringify(body); },
    async json() { return body; }
  });
  const fetch = async (url, options = {}) => {
    calls.push({ url, method: options.method || 'GET', headers: options.headers });
    const u = new URL(url);
    if (u.pathname === '/home/history') return respond(url, '<script>window.config={accountAuthClientId:"browser-public"}</script>', 'text');
    if (u.pathname === '/auth/v1/token') return respond(url, { access_token: 'HIGHLY_SECRET_TOKEN', account_id: 'account-1', profile_id: 'profile-1' });
    if (u.pathname.includes('/watchlist')) return respond(url, { data: [{ panel: { type: 'series', title: 'Gachiakuta', id: 'series-g', series_metadata: { series_id: 'series-g' } } }] });
    if (u.pathname.includes('/watch-history')) return respond(url, { items: [
      { fully_watched: true, panel: { episode_metadata: { series_title: 'Gachiakuta', series_id: 'series-g', season_display_number: 1, episode_number: 3 } } },
      { fully_watched: false, playhead: 20, panel: { episode_metadata: { series_title: 'Gachiakuta', series_id: 'series-g', season_display_number: 1, episode_number: 4, duration_ms: 1500000 } } }
    ] });
    throw Error(`Unexpected route: ${url}`);
  };
  const chrome = { runtime: { onMessage: { addListener(fn) { handler = fn; } } } };
  runInNewContext(code, { chrome, fetch, URL, URLSearchParams, AbortController, crypto: globalThis.crypto ?? { randomUUID: ()=>'uuid-1' }, btoa, setTimeout, clearTimeout });
  return { calls, handler: (...args) => handler(...args) };
}

test('imports Watchlist and watched episodes but never exposes credentials', async () => {
  const { handler, calls } = setup();
  const result = await new Promise(resolve => {
    const keepAlive = handler({ type: 'DUBTRACK_FETCH_CR' }, { tab: { url: 'https://senasalvatore97-dotcom.github.io/dubstack/' } }, resolve);
    assert.equal(keepAlive, true);
  });
  assert.equal(result.ok, true);
  assert.deepEqual(JSON.parse(JSON.stringify(result.payload.watchlist)), [{ title: 'Gachiakuta', seriesId: 'series-g' }]);
  assert.equal(result.payload.history.length, 1);
  assert.equal(result.payload.history[0].episode, 3);
  assert.equal(JSON.stringify(result).includes('HIGHLY_SECRET_TOKEN'), false);
  assert.equal(calls.every(c => c.url.startsWith('https://www.crunchyroll.com/')), true);
  assert.equal(calls.every(c => ['POST', 'GET'].includes(c.method)), true);
  assert.equal(calls.filter(c => c.method === 'POST').length, 1); // auth exchange only, never data mutation
});

test('refuses requests from other websites', () => {
  const { handler } = setup();
  const accepted = handler({ type: 'DUBTRACK_FETCH_CR' }, { tab: { url: 'https://evil.example/dubstack/' } }, () => { throw Error('Wrong origin'); });
  assert.equal(accepted, false);
});
