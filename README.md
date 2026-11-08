# DUBTRACK — Anime tracker (Italian dub first)

**Your anime. Your progress. Italian dub only.**

Anime tracker personale: lista, progressi e controllo puntuale del doppiaggio italiano. La nuova identità è monocromatica, minimal e leggibile su desktop e smartphone, con un simbolo anime costituito solo dall’espressione degli occhi. Pubblicato tramite GitHub Pages:

**https://senasalvatore97-dotcom.github.io/dubstack/**

## Funzioni

- Libreria di anime, ricerca, filtri, copertine e stato di visione.
- Progressi episodio per episodio, episodi acquistati, note e audio italiano **verificato manualmente**.
- **Segna prossimo episodio visto** direttamente dalla home per tutte le serie in corso. Calcola il prossimo episodio in ordine di stagione, gestisce i salti nella sequenza e permette di **annullare** il tap per alcuni secondi.
- Dopo la prima puntata vista, una serie entra automaticamente in «In corso», salvo che sia esplicitamente in pausa o completata.
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
index.html                   App per GitHub Pages
assets/dubtrack-logo.svg     Wordmark monocromatico DUBTRACK
assets/dubtrack-icon.svg     Occhi anime minimali / icona app / favicon
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


## Chiedi a Chat (v4)

Nel dettaglio di ciascun episodio il pulsante **Chiedi a Chat** apre ChatGPT tramite il collegamento `https://chatgpt.com/?q=...` con anime, stagione, episodio e richiesta di evitare spoiler già nel testo. Nella home, le serie in corso mostrano anche il link per l'ultimo episodio visto. È disponibile **Copia contesto episodio** se il browser o l'app ChatGPT non conservano il prompt precompilato.

I poster sono mostrati a colori; il resto dell'interfaccia resta monocromatico. Il salvataggio rimane locale al browser. La precompilazione tramite parametro URL è una funzionalità non garantita da API pubbliche e può cambiare.


## Catalogo anime doppiati in italiano (9 novembre 2026)

Inseriti 18 nuovi titoli (15 serie + 3 film) con pagine ufficiali Crunchyroll che indicano l'audio Italiano.

Per rigore, il flag `ITA verificato` è impostato soltanto sugli episodi con riscontro individuale diretto oppure su film con pagina audio specifica. Gli altri episodi non sono dichiarati doppiati in automatico: il catalogo di una serie può avere differenze tra stagioni, speciali ed episodi.

I nuovi anime vengono importati **una sola volta** anche negli account con progressi in localStorage, senza sovrascrivere i dati esistenti. I film sono rappresentati come una stagione da 1 episodio; per Re:ZERO si usa la prima stagione Director's Cut (13 episodi lunghi) e la quarta stagione ha conteggio provvisorio.