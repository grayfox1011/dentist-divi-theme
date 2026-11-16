# Tour 3D della Toasteria

Visita virtuale in 3D del locale, ricostruita dal video girato all'interno. Si apre nel browser e
si naviga come su Google Street View: **frecce sul pavimento** per andare avanti e indietro,
**trascinamento** per guardarsi intorno, **Avanti / Indietro** per seguire il giro guidato,
**mini-mappa** dei due piani per saltare a un punto.

![Anteprima del tour](renders/tour-preview.jpg)

## Cosa contiene

| Percorso | Contenuto |
| --- | --- |
| `index.html`, `tour.js`, `tour.css` | Il visualizzatore (three.js, nessun servizio esterno). |
| `vendor/` | three.js r170 e i suoi moduli in locale (licenza MIT in `THREE-LICENSE.txt`). |
| `assets/toasteria.glb` | Il modello 3D con le texture. |
| `assets/lm_*.webp`, `assets/lightmaps.json` | La luce calcolata in Blender (lightmap) per le quattro zone: piano terra, scala, sala della Primavera, sala del divanetto. |
| `renders/` | Otto immagini renderizzate con Cycles (1600 × 900), utili anche per il sito e i social: `piano-terra`, `nascita-di-venere`, `scala`, `primavera`, `dettaglio-tavolo`, `sala-divanetto`, `muro-di-cassette`, `vetrata`. |
| `source/` | Script Blender e Python per rigenerare tutto (vedi `source/README.md`). |

Il giro tocca 12 punti: ingresso, la *Nascita di Venere*, la scala, il pianerottolo con i poster,
l'arrivo al primo piano, la *Primavera*, la vetrata, il passaggio tra le sale, la sala del
divanetto, il muro di cassette e la seconda vetrata.

## Come metterlo sul sito (WordPress + Divi)

1. Carica l'intera cartella `toasteria-tour-3d` sul server, per esempio con FTP o con il file
   manager dell'hosting dentro `wp-content/uploads/`, così l'indirizzo diventa
   `https://tuosito.it/wp-content/uploads/toasteria-tour-3d/index.html`. Le cartelle `source/` e
   `renders/` non servono al tour: puoi non caricarle.
2. Nella pagina, aggiungi un modulo **Codice** di Divi e incolla:

   ```html
   <div style="position:relative;width:100%;aspect-ratio:16/9;min-height:440px;border-radius:14px;overflow:hidden">
     <iframe src="/wp-content/uploads/toasteria-tour-3d/index.html"
             title="Tour 3D del locale"
             style="position:absolute;inset:0;width:100%;height:100%;border:0"
             allow="fullscreen" allowfullscreen loading="lazy"></iframe>
   </div>
   ```

3. Per aprire il tour già su un punto preciso aggiungi `?punto=` all'indirizzo, per esempio
   `index.html?punto=primavera`. I nomi dei punti sono: `ingresso`, `venere`, `piedi-scala`,
   `scala`, `pianerottolo`, `arrivo`, `primavera`, `vetrata`, `passaggio`, `divanetto`,
   `cassette`, `vetrata-2`.

Il tour va aperto da un indirizzo web (http/https): se fai doppio clic su `index.html` dal disco il
browser blocca il caricamento del modello. Per provarlo sul computer apri un terminale nella
cartella e lancia `python3 -m http.server 8000`, poi vai su <http://localhost:8000>.

Peso da scaricare: circa 6,6 MB (modello 4,6 MB, luce 1,2 MB, three.js 0,9 MB), con barra di
avanzamento durante il caricamento. Funziona su Chrome, Safari, Firefox ed Edge, anche da telefono
(trascina con un dito, pizzica per zoomare).

## Comandi

| Azione | Mouse / touch | Tastiera |
| --- | --- | --- |
| Guardarsi intorno | trascina | ← → |
| Spostarsi | clic sulla freccia o sul pavimento | ↑ ↓ (o W, S) |
| Giro guidato | pulsanti Avanti / Indietro | N, P |
| Zoom | rotella o pizzico | — |

## Da dove viene il realismo

- **Luce vera**: l'illuminazione è calcolata in Blender con Cycles (path tracing), partendo dai
  faretti sui binari e dalla luce che entra dalle vetrate. Ombre morbide sotto tavoli e sedie,
  macchie di luce dei faretti sulle pareti, il rosso delle pareti che tinge il soffitto: tutto è
  salvato nelle lightmap, quindi sul sito non pesa.
- **Materiali**: parquet a lamelle, legno verniciato dei tavoli, ghisa, pelle del divanetto, vetro
  e acciaio hanno ciascuno la propria lucidità e il proprio rilievo.
- **Riflessi**: finestre e luci si riflettono su pavimento, tavoli, vetri e metalli. Il tour li
  ricava da quattro foto a 360° che scatta da solo all'avvio.
- **Resa fotografica**: bagliore attorno alle luci forti, curva di tono da fotocamera, leggera
  vignettatura e grana; l'esposizione cambia passando dal piano terra alle vetrate.
- **Dettagli**: spigoli smussati, sedie pieghevoli con schienale curvo, basi dei tavoli in ghisa,
  poltrone acapulco a corde, piante con foglie curve, menu e bottigliette sui tavoli, scatole con
  il sigillo stampato.

Su telefoni lenti il tour abbassa da solo la risoluzione e, se serve, rinuncia al bagliore. Per
forzare la versione leggera: `index.html?qualita=base`.

## Cosa è fedele e cosa è ricostruito

- **Fedele al video**: i due murales (*La Nascita di Venere* al piano terra e *La Primavera* al
  primo piano) sono stati ricomposti unendo decine di frame e raddrizzati; i testi degli otto
  poster del pianerottolo sono quelli reali; colori delle pareti, parquet, scala con ringhiera
  a cavi, tavoli con la scritta "Toasteria Italiana", sedie pieghevoli bianche con cuscino rosso,
  poltrone acapulco, divanetto rosso con profilo bianco, muro di scatole con la consolle nera,
  piante, binari con i faretti (bianchi sotto, neri sopra).
- **Stimato**: le misure (non c'è un rilievo: le proporzioni vengono dai murales, dai gradini e
  dagli arredi) e le parti che il video non inquadra, come la parete destra del piano terra, che
  è bianca con tre poster e la lavagna del menu.
- **Ridisegnato**: il video è in bassa risoluzione, quindi poster, menu, sigillo sulle scatole e
  insegna rotonda sono rifatti in grafica pulita e non sono copie esatte degli originali. Il logo
  vero si può sostituire nelle texture `logo_sign.jpg` e `menu_cover.jpg`.
- **Semplificato**: la vista sulla strada dalle finestre è una foto presa dal video, sfocata come
  uno sfondo.

Per cambiare nomi, posizione o esposizione dei punti di vista basta modificare l'elenco `NODES` in
`tour.js`; i valori della resa (bagliore, contrasto, lucidità del parquet) sono in `LOOK`.

Se il server non serve i file `.glb`, si può caricare il modello come glTF in formato JSON: basta
definire `window.TOUR_MODEL = 'assets/toasteria.gltf.json'` prima di `tour.js` (la conversione è
descritta in `source/README.md`).
