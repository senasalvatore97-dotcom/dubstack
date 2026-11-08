# DUBTRACK — Anime tracker (Italian dub first)

**Your anime. Your progress. Italian dub only.**

Tracker personale con una nuova identità anime/esports e grafica mobile. Il logo è incorporato direttamente in `index.html`, quindi funziona anche come file HTML autonomo. Pubblicato tramite GitHub Pages:

**https://senasalvatore97-dotcom.github.io/dubstack/**

## Funzioni

- Libreria di anime, ricerca, filtri, copertine e stato di visione.
- Progressi episodio per episodio, episodi acquistati, note e audio italiano **verificato manualmente**.
- Backup e ripristino JSON, esportazione CSV.
- Importazioni manuali di Watchlist e cronologia.
- **NUOVO, sperimentale:** importazione diretta in sola lettura da Crunchyroll tramite l'estensione personale **DUBTRACK Bridge** per Chrome/Edge desktop.

## Collegamento Crunchyroll (sperimentale, solo computer)

Crunchyroll non mette a disposizione un accesso OAuth pubblico per siti personali. Per questo l'app statica **non può sincronizzarsi automaticamente** da sola con l'account.

L'estensione [`extension/`](extension/) sfrutta la sessione Crunchyroll **già autenticata nello stesso browser** e legge Watchlist e cronologia da API interne non ufficiali. Non chiede password o cookie a DUBTRACK; non trasferisce token al sito. Le API possono cambiare e potrebbero essere soggette a limitazioni d'uso. Nessun accesso con un account reale è stato verificato in fase di sviluppo.

### Installazione rapida

1. Su PC/Mac, da questa repo premi **Code → Download ZIP**, poi estrai.
2. Apri **`chrome://extensions`** (Edge: `edge://extensions`), abilita **Modalità sviluppatore**, poi **Carica estensione non pacchettizzata / Load unpacked** e seleziona la cartella **`extension`**.
3. Accedi al tuo account su [crunchyroll.com](https://www.crunchyroll.com) nello stesso browser e verifica il profilo selezionato.
4. Apri [DUBTRACK](https://senasalvatore97-dotcom.github.io/dubstack/) → **Account → Sync diretta (PC)** → **Sincronizza ora**.
5. Conferma l'importazione quando DUBTRACK mostra la quantità di dati letti.

L'estensione non modifica la Watchlist o la cronologia sul sito Crunchyroll. Gli episodi sono contrassegnati come visti solo se la cronologia offre un progresso sufficientemente alto (almeno 80% o `fully_watched=true`) e numeri di stagione/episodio affidabili. Se non c'è una numerazione precisa, DUBTRACK non inventa progressi. Il doppiaggio italiano resta **da verificare episodio per episodio**.

**Importante per iPhone:** l'estensione non funziona con l'app Crunchyroll o con Chrome/Safari su iPhone. L'importazione diretta è possibile soltanto dal browser desktop con estensione installata. Per portare i progressi su iPhone esporta un **Backup JSON** da DUBTRACK desktop e importalo dal pannello Backup del sito aperto su iPhone. Non c'è una sincronizzazione automatica cloud tra dispositivi.

Leggi il [README dell'estensione](extension/README.md) per limitazioni e sicurezza.

## Dati e privacy

- I progressi DUBTRACK restano nel `localStorage` del browser. La repository GitHub non contiene i tuoi dati personali.
- La funzione di sincronizzazione è **solo in lettura** e avviata dal pulsante dell'utente; non effettua controlli continui in background.
- Non inserire password, cookie, token o codici di sessione in DUBTRACK.
- Le informazioni *ITA verificato* sono indicazioni locali: l'API Watchlist/History **non prova che esista il doppiaggio italiano**.
- Salva frequentemente backup JSON: la pulizia dei dati del browser può eliminare le modifiche.

## Sviluppo e test

L'app è standalone e funziona aprendo `index.html`; non serve una build. Test estensione senza dipendenze esterne:

```bash
node --test tests/bridge.test.mjs
```

I test verificano il parsing di dati simulati e l'assenza di credenziali nel messaggio diretto alla pagina. **Non sono test con un account Crunchyroll reale.**

## Struttura

```text
index.html                   App per GitHub Pages, inclusi logo e grafica
extension/manifest.json      Estensione Chrome/Edge MV3
extension/background.js      API non ufficiali (solo lettura)
extension/bridge.js          Collegamento locale alla pagina DUBTRACK
extension/README.md          Installazione e limiti
tests/bridge.test.mjs        Test con dati simulati
.nojekyll                    Marker GitHub Pages
```

### Riferimenti

- [WatchBridge](https://github.com/TaylanTatli/watchbridge): API history tramite sessione del browser.
- [crunchy-api](https://github.com/HarshitKumar9030/crunchyroll-api): client non ufficiale per watchlist, cronologia e altre funzioni.

DUBTRACK è indipendente e non affiliato a Crunchyroll.