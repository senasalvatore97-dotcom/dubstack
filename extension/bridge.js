/* Runs only on DUBTRACK's GitHub Pages URL. No Crunchyroll secrets enter the page. */
(() => {
  'use strict';
  const PAGE_ORIGIN = 'https://senasalvatore97-dotcom.github.io';
  if (location.origin !== PAGE_ORIGIN || !location.pathname.startsWith('/dubstack/')) return;

  function reply(action, fields = {}) {
    window.postMessage({ source: 'DUBTRACK_EXTENSION_V1', action, ...fields }, PAGE_ORIGIN);
  }

  window.addEventListener('message', (event) => {
    if (event.source !== window || event.origin !== PAGE_ORIGIN) return;
    const message = event.data;
    if (!message || message.source !== 'DUBTRACK_WEB_V1') return;
    if (message.action === 'PING') return reply('READY');
    if (message.action !== 'SYNC') return;
    const requestId = String(message.requestId || '').slice(0, 120);
    if (!requestId) return;
    chrome.runtime.sendMessage({ type: 'DUBTRACK_FETCH_CR', requestId }, (result) => {
      const error = chrome.runtime.lastError;
      if (error) return reply('SYNC_ERROR', { requestId, error: 'Estensione non disponibile: ' + error.message });
      if (!result?.ok) return reply('SYNC_ERROR', { requestId, error: String(result?.error || 'Errore dell’estensione').slice(0, 240) });
      reply('SYNC_RESULT', { requestId, payload: result.payload });
    });
  });
  reply('READY');
})();
