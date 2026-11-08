# DUBTRACK 2.0

**Your anime. Your progress. Italian dub only.**

Un tracker personale per gli anime, con interfaccia scura/arancione, pensato per desktop e iPhone.

![Anteprima desktop](assets/desktop-preview.png)

## Funzioni

- Libreria anime con ricerca, filtri, stato di visione e copertine.
- Progressi per stagione ed episodio; episodi visti e acquistati.
- Stato del doppiaggio italiano registrabile a livello di singolo episodio.
- Importazione **manuale** dei titoli presenti nella Watchlist Crunchyroll.
- Importazione **manuale** della cronologia nel formato `Titolo | Stagione | Ultimo episodio visto`.
- Backup JSON e CSV; ripristino da backup JSON.
- Layout responsive per dispositivi mobili.

## Avvio rapido

Apri `index.html` in un browser moderno. Non richiede build, framework o server per l'uso di base.

Per la pubblicazione su GitHub Pages, crea una repository e configura **Settings → Pages → Deploy from a branch** scegliendo la branch principale e la directory `/ (root)`. GitHub Pages deve essere abilitato e disponibile per il piano e le impostazioni della repository.

## Salvataggio dei dati

I progressi sono salvati localmente nel browser tramite `localStorage`. **Non vengono sincronizzati automaticamente tra dispositivi** e la cancellazione dei dati del sito/browser può eliminarli. Esporta regolarmente un backup JSON dalla sezione *Account / Backup*.

## Collegamento a Crunchyroll

Questa versione **non è collegata all'account Crunchyroll** e non accede automaticamente a Watchlist o cronologia. Le funzioni di importazione sono manuali. Non inserire password o cookie di Crunchyroll nell'app.

Le etichette sull'audio italiano sono dati del tracker, **non una verifica in tempo reale** della disponibilità di streaming. Verifica la traccia Audio Italiano sulla piattaforma prima di iniziare la visione.

## Struttura

```
index.html                 # Applicazione autonoma
assets/desktop-preview.png # Anteprima desktop
assets/mobile-preview.png  # Anteprima mobile
README.md                  # Documentazione
.nojekyll                  # Compatibilità con GitHub Pages
```

Il progetto non è affiliato a Crunchyroll.