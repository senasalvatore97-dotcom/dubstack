# DUBTRACK Bridge (sperimentale)

Estensione personale **Chrome/Edge per computer**. Legge Watchlist e cronologia dal tuo account Crunchyroll già aperto nel browser. Usa API private/non ufficiali; **non è un'app approvata da Crunchyroll**. Le API possono cambiare o bloccare le richieste e l'automazione potrebbe essere limitata dalle condizioni del servizio. Funziona solo se Crunchyroll accetta la sessione corrente; non è stato possibile provarla con un account reale in fase di sviluppo.

## Installazione (PC/Mac)

1. Scarica il repository `dubstack` come ZIP dal pulsante **Code → Download ZIP** su GitHub ed estrailo.
2. In **Chrome** apri `chrome://extensions` (in **Edge**, `edge://extensions`).
3. Attiva **Modalità sviluppatore**.
4. Premi **Carica estensione non pacchettizzata / Load unpacked** e scegli la cartella **`extension`** estratta.
5. Accedi normalmente a [Crunchyroll](https://www.crunchyroll.com) nello stesso browser e seleziona il profilo da sincronizzare.
6. Apri [DUBTRACK](https://senasalvatore97-dotcom.github.io/dubstack/), vai su **Account → Sync diretta (PC) → Sincronizza ora**.
7. Prima dell'importazione, DUBTRACK mostrerà una conferma. Gli episodi già segnati e le tue note restano salvati.

## Come funziona

- L'estensione richiede **solo in lettura** i dati della Watchlist e della cronologia tramite endpoint usati dai client Crunchyroll. Non aggiunge né elimina contenuti dall'account.
- Autenticazione: utilizza temporaneamente la sessione già attiva nel browser. **Non chiede password, non memorizza cookie, token o dati di accesso** e non li passa al sito DUBTRACK.
- Al sito arrivano soltanto titolo, ID della serie, stagione ed episodio (quando disponibili). Nessun episodio viene segnato come visto se il progresso risulta inferiore all'80% o non è determinabile.
- Se un episodio non ha numeri affidabili, DUBTRACK lo ignora. Non suppone mai il doppiaggio italiano sulla base della Watchlist.
- I dati importati finiscono nel `localStorage` del browser dove è aperto DUBTRACK. Non vengono caricati su GitHub, né sincronizzati automaticamente con altri dispositivi.
- Nessuna richiesta viene avviata in background: il recupero parte solo quando premi **Sincronizza ora**.

## Limiti

- **Non funziona nell'app Crunchyroll né su Safari/iPhone**; non si può installare come estensione Chrome su iOS.
- Le API non sono documentate ufficialmente e il test di integrazione reale richiede un utente autenticato. Le modifiche da parte di Crunchyroll possono interrompere la procedura.
- La prima importazione legge fino a 2.000 elementi Watchlist e 2.500 eventi della cronologia. In caso di risultato parziale viene mostrato un avviso.
- Se visualizzi le serie sull'iPhone, dal PC puoi esportare il **Backup JSON** di DUBTRACK e importarlo manualmente su iPhone.

**Sicurezza:** nessun codice di sessione, cookie o password deve essere incollato sul sito DUBTRACK. L'estensione ha accesso alle pagine di Crunchyroll per leggere dati e richiede un'autorizzazione del browser durante l'installazione. Installa soltanto il codice che hai controllato.

### Riferimenti tecnici

- [WatchBridge](https://github.com/TaylanTatli/watchbridge) (flusso da sessione browser e cronologia)
- [crunchy-api](https://github.com/HarshitKumar9030/crunchyroll-api) (watchlist e cronologia, API private)

Il codice di DUBTRACK Bridge è sviluppato per questo progetto senza incorporare le librerie esterne. Non è affiliato a Crunchyroll.
