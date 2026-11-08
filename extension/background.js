/* DUBTRACK Bridge (experimental) — READ ONLY.
   Not affiliated with Crunchyroll; private API details may change.
   Credentials are taken ONLY from the browser's own Crunchyroll session;
   access tokens are ephemeral inside this worker and never sent to DUBTRACK. */
'use strict';
const ROOT = 'https://www.crunchyroll.com';
const DASHBOARD = 'https://senasalvatore97-dotcom.github.io/dubstack/';
const PAGE_SIZE = 100;
const MAX_WATCHLIST_PAGES = 20;
const MAX_HISTORY_PAGES = 25;
let activeRequest = false;

function asItems(body) {
  if (Array.isArray(body)) return body;
  const candidate = body?.data?.items ?? body?.items ?? body?.data ?? body?.result?.items;
  return Array.isArray(candidate) ? candidate : null;
}
function text(value, max = 150) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}
function positiveInt(value) {
  if (value === '' || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}
function payloadError(error) {
  const message = String(error?.message || error).slice(0, 350);
  // No response bodies, tokens, cookie values, or request headers are logged or returned.
  return message.replace(/Bearer\s+\S+/gi, 'Bearer [hidden]');
}
async function request(url, options = {}) {
  const u = new URL(url, ROOT);
  if (u.origin !== ROOT) throw Error('Bloccata richiesta verso un dominio non consentito.');
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 17000);
  try {
    const response = await fetch(u.href, {
      ...options,
      signal: controller.signal,
      credentials: 'include',
      redirect: 'follow',
      headers: { Accept: 'application/json', ...(options.headers || {}) }
    });
    if (!response.ok) throw Error(`Crunchyroll HTTP ${response.status} (${u.pathname})`);
    return response;
  } catch (error) {
    if (error.name === 'AbortError') throw Error('Crunchyroll non ha risposto entro 17 secondi.');
    throw error;
  } finally {
    clearTimeout(id);
  }
}
async function json(url, options) { return (await request(url, options)).json(); }
function uuid() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return [...crypto.getRandomValues(new Uint8Array(16))].map(n => n.toString(16).padStart(2, '0')).join('');
}
async function getSession() {
  const page = await request(`${ROOT}/home/history`, { headers: { Accept: 'text/html' } });
  if (new URL(page.url).pathname.includes('/login')) throw Error('Accedi a Crunchyroll in questo browser e riprova.');
  const html = await page.text();
  const match = html.match(/accountAuthClientId["']?\s*[:=]\s*["']([^"']+)["']/i);
  if (!match) throw Error('Impossibile leggere la configurazione web di Crunchyroll. L’API potrebbe essere cambiata.');
  const token = await json(`${ROOT}/auth/v1/token`, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + btoa(match[1] + ':'),
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: new URLSearchParams({ grant_type: 'etp_rt_cookie', device_id: uuid(), device_type: 'Chrome on Desktop' })
  });
  if (!token.access_token || !token.account_id) throw Error('La sessione Crunchyroll non è valida o è scaduta.');
  const session = {
    bearer: 'Bearer ' + token.access_token,
    account: text(token.account_id, 120),
    profile: text(token.profile_id, 120) || text(token.account_id, 120)
  };
  if (!token.profile_id) {
    try {
      const profiles = await json(`${ROOT}/accounts/v1/me/multiprofile`, { headers: { Authorization: session.bearer } });
      const list = asItems(profiles) || profiles.profiles || [];
      const selected = list.find(p => p.is_selected || p.selected || p.isSelected);
      if (selected) session.profile = text(selected.profile_id || selected.id, 120) || session.profile;
    } catch (_) { /* Older accounts can lack multiprofile: fall back to account ID. */ }
  }
  return session;
}
function watchlistEntry(entry) {
  const panel = entry?.panel ?? entry?.content ?? entry ?? {};
  const meta = panel.series_metadata ?? entry?.series_metadata ?? panel.episode_metadata ?? {};
  const title = text(panel.title || meta.series_title || entry?.title);
  const seriesId = text(meta.series_id || (panel.type === 'series' ? panel.id : '') || entry.series_id || entry.id, 90);
  return title ? { title, seriesId } : null;
}
function watchHistoryEntry(entry) {
  const panel = entry?.panel ?? entry?.content ?? {};
  const meta = panel.episode_metadata ?? entry?.episode_metadata ?? {};
  const title = text(meta.series_title || entry?.series_title || panel.series_title);
  if (!title) return null;
  const durationMs = Number(meta.duration_ms ?? panel.duration_ms ?? 0);
  const playhead = Number(entry.playhead ?? entry.playhead_seconds ?? -1);
  const watched = entry.fully_watched === true || (durationMs > 0 && playhead >= 0 && (playhead * 1000 / durationMs) >= 0.8);
  if (!watched) return null;
  return {
    title,
    seriesId: text(meta.series_id || entry.series_id, 90),
    season: positiveInt(meta.season_display_number ?? meta.season_number),
    episode: positiveInt(meta.episode_number)
  };
}
async function fetchPaged(session, path, params, maxPages, kind) {
  const items = [], errors = [];
  let partial = false, previousFirst = '', endpoint = path;
  for (let n = 0; n < maxPages; n++) {
    const query = new URLSearchParams({ locale: 'it-IT', ...params });
    if (kind === 'watchlist') { query.set('n', String(PAGE_SIZE)); query.set('start', String(n * PAGE_SIZE)); }
    else { query.set('page_size', String(PAGE_SIZE)); query.set('page', String(n + 1)); }
    let records;
    try {
      let response;
      try { response = await json(ROOT + endpoint + '?' + query, { headers: { Authorization: session.bearer } }); }
      catch (error) {
        if (n === 0 && /HTTP 404/.test(error.message)) {
          endpoint = kind === 'watchlist' ? `/content/v2/${encodeURIComponent(session.account)}/watchlist` : `/content/v1/watch-history/${encodeURIComponent(session.account)}`;
          response = await json(ROOT + endpoint + '?' + query, { headers: { Authorization: session.bearer } });
        } else throw error;
      }
      records = asItems(response);
      if (!records) throw Error(`Crunchyroll ha cambiato il formato della ${kind}.`);
    } catch (error) {
      if (n === 0) throw error;
      partial = true; errors.push(payloadError(error)); break;
    }
    if (!records.length) break;
    const firstId = text(records[0]?.id ?? records[0]?.panel?.id, 90);
    if (firstId && firstId === previousFirst) break;
    previousFirst = firstId;
    items.push(...records);
    if (records.length < PAGE_SIZE) break;
    if (n === maxPages - 1) partial = true;
  }
  return { items, partial, errors };
}
async function sync() {
  const session = await getSession();
  const problems = [];
  let watchlist = [], history = [], partial = false;
  try {
    const found = await fetchPaged(session, `/content/v2/discover/${encodeURIComponent(session.profile)}/watchlist`, { order: 'desc' }, MAX_WATCHLIST_PAGES, 'watchlist');
    watchlist = found.items.map(watchlistEntry).filter(Boolean);
    partial ||= found.partial; problems.push(...found.errors);
  } catch (error) { problems.push('Watchlist: ' + payloadError(error)); partial = true; }
  try {
    const found = await fetchPaged(session, `/content/v2/${encodeURIComponent(session.account)}/watch-history`, {}, MAX_HISTORY_PAGES, 'history');
    history = found.items.map(watchHistoryEntry).filter(Boolean);
    partial ||= found.partial; problems.push(...found.errors);
  } catch (error) { problems.push('Cronologia: ' + payloadError(error)); partial = true; }
  if (problems.length >= 2 && !watchlist.length && !history.length) throw Error(problems.join(' / '));
  // Deduplicate and only expose series/episode metadata. NEVER forward auth material.
  const wlSeen = new Set();
  watchlist = watchlist.filter(x => { const key = x.seriesId || x.title.toLowerCase(); if (wlSeen.has(key)) return false; wlSeen.add(key); return true; });
  const epSeen = new Set();
  history = history.filter(x => { const key = `${x.seriesId || x.title}|${x.season}|${x.episode}`; if (epSeen.has(key)) return false; epSeen.add(key); return true; });
  return { watchlist, history, partial, problems };
}
chrome.runtime.onMessage.addListener((message, sender, respond) => {
  const url = sender?.tab?.url || '';
  if (message?.type !== 'DUBTRACK_FETCH_CR' || !url.startsWith(DASHBOARD)) return false;
  if (activeRequest) { respond({ ok: false, error: 'È già in corso una sincronizzazione.' }); return false; }
  activeRequest = true;
  (async () => {
    try { respond({ ok: true, payload: await sync() }); }
    catch (error) { respond({ ok: false, error: payloadError(error) }); }
    finally { activeRequest = false; }
  })();
  return true;
});
