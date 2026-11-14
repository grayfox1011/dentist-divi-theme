# Perla – tema Divi 5 per studi dentistici

Child theme per **Divi 5** pensato per essere venduto come template (Etsy). Si installa come un
normale tema e **costruisce da solo il sito demo**: pagine, header, footer, menu, colori,
fotografie e articoli di esempio. Tutto il design è fatto con **soli moduli standard di Divi 5**:
chi lo compra modifica ogni cosa dal Visual Builder, senza plugin aggiuntivi e senza codice. Le
pagine hanno **animazioni allo scorrimento fatte con GSAP** e **scorrimento fluido con Lenis**,
che si spengono con una casella.

Il sito demo è scritto e illustrato come quello di uno studio vero: fotografie al posto dei
segnaposto, testi concreti, una pagina diversa per ogni trattamento, articoli completi.

Il nome "Perla" e lo studio demo "Perla Dental Studio" sono segnaposto: si cambiano in
`src/tokens.js` (nome, colori, font, contatti) e `src/assets/logo.png` (logo dell'header).

## Cosa contiene

| Cartella | Contenuto |
| --- | --- |
| `theme/perla-child/` | Il child theme da installare su WordPress. |
| `theme/perla-child/inc/` | L'installazione automatica del sito demo, la schermata "Perla Setup", il caricamento delle animazioni. |
| `theme/perla-child/assets/js/` | Lo script delle animazioni (`perla-motion.js`), GSAP e Lenis (`vendor/`). |
| `theme/perla-child/demo/` | I layout Divi e i contenuti che il tema installa (generati da `src/`). |
| `theme/perla-child/demo/images/` | Le 18 foto demo e `CREDITS.txt` con autore e fonte di ciascuna. |
| `src/` | Il generatore dei layout: colori, variabili, sezioni, pagine, testi, elenco delle foto. |
| `tools/` | Validatore dello schema Divi, script che prepara le foto, controlli di compatibilità, script WP-CLI per l'ambiente locale. |
| `bin/` | `setup.sh` (ambiente di sviluppo), `package.sh` (file da caricare su Etsy), `compat.sh` (prova con una versione di Divi). |
| `docs/` | Guida per l'acquirente, consigli di vendita, anteprime. |

### Pagine e template inclusi

- **Home** – hero, numeri, servizi, perché sceglierci, primi passi, galleria prima/dopo, team,
  recensioni, ultimi articoli, FAQ, invito all'azione.
- **About**, **Services**, **Blog**, **Contact** (modulo + mappa).
- **Sei pagine servizio**, una per trattamento, sotto `/services/`: General Dentistry, Cosmetic
  Dentistry, Dental Implants (con tabella prezzi), Teeth Whitening, Orthodontics, Emergency Care.
- **Theme Builder**: header globale (barra info + menu fisso), footer globale, template
  articolo del blog, pagina 404.

Anteprime del sito reale in [`docs/previews/`](docs/previews/).

### Come è fatto il design

- **Colori globali** e **variabili di design** di Divi 5 (Variable Manager): colori, raggi,
  spaziature, dimensioni dei testi, nome dello studio, telefono, email, indirizzo, orari. Si
  cambiano una volta e si aggiornano ovunque: header, footer, schede sotto la hero, pagina
  Contatti.
- Un campo contiene **o testo o una variabile, mai tutti e due**. Sul sito Divi sostituisce la
  variabile anche in mezzo a una frase, ma nel Visual Builder (5.15.1) mostra solo la variabile e
  perde le parole intorno: il generatore quindi non li mescola.
- **Colori principali e font** (primario, secondario, titoli, testo, link, i due font): Divi li
  tiene nel Theme Customizer. Li imposta il child theme (`theme/perla-child/defaults.php`,
  generato da `src/tokens.js`), sostituendo solo i valori vuoti o ancora uguali a quelli di serie
  di Divi: colori e font scelti dal proprietario del sito non vengono toccati.
- Font: Plus Jakarta Sans (titoli) e Inter (testi), entrambi Google Fonts già presenti in Divi.
- Dimensioni fluide con `clamp()`: il layout si adatta da solo a tablet e telefono.
- Le recensioni mostrano le **iniziali** in un cerchio invece di una foto: non servono volti di
  pazienti, e non si mette la faccia di una persona reale accanto a una frase inventata.

## Foto demo

Le 18 foto sono in `theme/perla-child/demo/images/` (circa 1 MB in tutto): hero, studio, team,
una per ogni pagina trattamento, la coppia prima/dopo, quattro ritratti, tre immagini per gli
articoli. Quasi tutte vengono dallo stesso servizio fotografico, così lo studio, la dentista e la
luce sono gli stessi da una pagina all'altra, come nel sito di una clinica vera.

**Da dove vengono.** Tutte da Pexels. La pagina della licenza (<https://www.pexels.com/license/>)
dice che le foto sono gratuite, che l'attribuzione non è richiesta, che si possono modificare, e
tra gli usi di esempio cita "a template you sell". Vieta di rivendere copie non modificate, di
ripubblicarle su altri siti di foto, di mostrare persone riconoscibili in modo offensivo e di
far sembrare che persone o marchi raccomandino il tuo prodotto. Ho controllato la pagina di ogni
foto: tutte risultano con licenza "Free", nessuna è indicata come editoriale o sponsorizzata.
Autore e indirizzo di ciascuna sono in `demo/images/CREDITS.txt` (generato dalla build) e nella
descrizione di ogni immagine nella Libreria media.

**Come arrivano sul sito.** I layout puntano al file dentro la cartella del tema
(`/wp-content/themes/perla-child/demo/images/…`) e ne riportano larghezza e altezza. Quando il
tema installa il sito demo copia ogni foto nella **Libreria media** e riscrive l'indirizzo e l'ID
nei moduli immagine: WordPress aggiunge così il caricamento differito e la priorità alla foto
della hero. Non vengono generate miniature (le foto sono già della misura giusta), quindi
l'installazione resta veloce. Se la cartella `uploads` non è scrivibile la pagina mostra la foto
dalla cartella del tema e la schermata di setup lo segnala.

**Cambiarne una.** L'elenco è `src/photos.json`: file, misura, numero della foto su Pexels,
autore, titolo, punto da tenere al centro e ingrandimento. `python3 tools/photos.py` scarica gli
originali (in `.photos-cache/`, non versionata), li ritaglia e li esporta; poi `npm run build`
riscrive i layout e i crediti. Servono Pillow e NumPy. Oppure basta sostituire il file con uno
dello stesso nome e della stessa misura.

**Due cose da sapere.**

- La coppia **prima/dopo** è una sola foto: nel "prima" i denti sono stati scuriti con un
  ritocco. Serve a far vedere lo slider, non è un caso clinico. La guida per l'acquirente lo dice
  e chiede di sostituirla.
- Le persone ritratte sono modelli di foto stock presentati come il team di uno studio
  inventato. È l'uso normale di queste foto nei template, ma Pexels non pubblica le liberatorie
  e io non posso verificarle: se preferisci non rischiare, sostituisci hero, team e ritratti con
  foto tue o generate. Nelle recensioni non ci sono volti apposta.

## Testi demo

Lo studio è inventato ("Perla Dental Studio", Springfield, aperto nel 2010, quattro
professionisti), ma i testi sono scritti come li scriverebbe uno studio vero: frasi concrete,
orari, prezzi, cosa succede durante la visita. Ogni pagina trattamento ha il suo contenuto
("What to expect", motivi per prenotare, dati in breve), il team ha una riga di presentazione a
testa, le recensioni hanno lunghezze diverse, i tre articoli del blog sono completi (consigli
generali e prudenti di igiene orale). Indirizzo, prefisso telefonico e mappa sono coerenti tra
loro. Tutto si cambia in `src/content.js` e `src/tokens.js`.

Recensioni, valutazione e numeri sono esempi: la guida chiede all'acquirente di sostituirli con
dati veri prima di pubblicare.

## Installazione automatica del sito demo

Chi compra carica `perla-child.zip` in **Aspetto → Temi → Aggiungi → Carica tema** e lo attiva.
Alla prima apertura della bacheca il tema:

- su un **sito nuovo** (al massimo la pagina e l'articolo di esempio di WordPress, nessuna
  pagina iniziale statica, Theme Builder vuoto) installa subito tutto e mostra il resoconto
  nella schermata **Aspetto → Perla Setup**;
- su un **sito che ha già contenuti** non tocca nulla e mostra la stessa schermata con il
  pulsante **Install the demo site**.

L'importazione aggiunge solo ciò che manca e non sovrascrive né cancella mai: una pagina che
esiste già allo stesso indirizzo, il menu principale, i template del Theme Builder, gli articoli
e i valori delle variabili restano come sono. Le foto vengono copiate nella Libreria media solo
per le pagine che il tema crea davvero, e una foto già copiata viene riusata. Si può rilanciare quando si vuole (ricrea quello
che è stato cancellato). Se WordPress è in una sottocartella o usa i permalink semplici, i link
dei pulsanti vengono adattati agli indirizzi reali delle pagine.

Il codice è in `theme/perla-child/inc/`: `demo-import.php` (l'importazione, con le funzioni di
WordPress e di Divi) e `setup.php` (primo avvio, schermata e pulsante).

## Compatibilità con le versioni di Divi 5

Divi 5 esce circa una volta a settimana: dalla 5.0.0 (26 febbraio 2026) alla 5.19.0 (6 novembre
2026) ci sono 45 versioni stabili. Non le ho potute provare tutte: ho la copia 5.15.1 e l'accesso
al builder pubblico di Elegant Themes, che gira sulla 5.4.0.

| Versione di Divi | Cosa è stato provato | Come |
| --- | --- | --- |
| 5.0 – 5.3 | Non supportate. Il tema lo dice nella schermata di setup e non installa nulla | Controllo sul numero di versione, provato simulando la 5.3.3 |
| **5.4.0** | Tutti i 15 layout, comprese foto con ID e misure, classi delle animazioni e ancore | Builder pubblico `demo.elegantthemes.com`: solo il builder, non l'installazione né il sito pubblico |
| 5.5 – 5.14 | Non provate una per una | Vedi sotto: le coprono le conversioni di Divi |
| **5.15.1** | Tutto: installazione, sito pubblico, builder, animazioni, aggiornamenti | Installazione reale (vedi "Verifiche fatte") |
| 5.16 – 5.19 | **Non provate** | Ho letto il changelog ufficiale: correzioni e funzioni nuove, nessuna modifica dichiarata come incompatibile su ciò che Perla usa |

### Perché un aggiornamento non fa perdere contenuti

- **I contenuti stanno nel database di WordPress**, non nei file del tema: pagine, template del
  Theme Builder, menu, variabili, foto. Aggiornare Divi sostituisce solo la cartella di Divi;
  aggiornare Perla sostituisce solo la cartella di Perla. Nessuno dei due tocca il database.
- **Le pagine sono moduli standard di Divi 5**, senza moduli propri: restano leggibili da Divi
  anche a tema Perla disattivato (si perdono solo le animazioni).
- **Divi converte da solo i contenuti più vecchi.** Ogni modulo porta la versione con cui è
  stato scritto (`builderVersion`, per Perla 5.4.0) e Divi ha una catena di conversioni, ognuna
  legata a una versione, che applica quando mostra la pagina, quando la apre nel builder e
  quando importa un layout. La pagina salvata non viene riscritta finché non la si salva dal
  builder. Sulla 5.15.1 le conversioni successive alla 5.4.0 sono sei; quelle che toccano i
  layout di Perla sono due, e nessuna perde impostazioni:

  | Conversione di Divi | Effetto sui layout di Perla |
  | --- | --- |
  | Maiuscolo dei testi (5.8.1) | Le 43 etichette in maiuscolo passano dal vecchio campo `style` al nuovo `capitalization` |
  | Gruppo immagine (5.4.2) | Nel template dell'articolo, l'opzione che nasconde l'immagine in evidenza cambia nome |
  | Spessore del testo, griglie, toggle, moduli globali | Nessun effetto: 1056 moduli su 1100 restano identici |

### Prove fatte sugli aggiornamenti (Divi 5.15.1)

| Prova | Esito |
| --- | --- |
| Conversioni di Divi applicate a tutti i 15 layout (`tools/wp/migration-report.php`) | 1100 moduli prima e dopo, nessuna impostazione persa |
| Tutte le 11 pagine aperte e salvate nel Visual Builder | 987 moduli su 1028 identici, 41 etichette convertite, nessuna impostazione persa. 9 pagine identiche pixel per pixel; nelle altre due cambiano solo il captcha del modulo e la mappa |
| File di Divi sostituiti con una copia nuova, a tema Perla attivo (quello che fa un aggiornamento) | Impronta del sito identica: 48 voci tra pagine, layout, template, menu, foto, colori, variabili |
| Passaggio al tema Divi e ritorno a Perla | Impronta identica; l'installazione non riparte |
| Tema Perla aggiornato da 1.4.0 a 1.4.1 caricando lo zip, su un sito con titolo, telefono e colore cambiati dal proprietario | Impronta identica, le modifiche restano |
| "Restore the demo pages" (l'unica azione che sovrascrive, dietro conferma) | WordPress conserva la versione precedente di ogni pagina tra le revisioni |

L'impronta è l'uscita di `tools/wp/fingerprint.php`: una riga per ogni cosa creata da Perla, con
un codice calcolato sul contenuto.

### Cosa succede se una versione futura di Divi cambia qualcosa

- L'installazione automatica usa poche funzioni PHP di Divi (opzioni del tema, colori e
  variabili globali, Theme Builder). Vengono controllate **tutte prima di creare qualsiasi
  cosa**: se ne manca una il tema spiega che l'installazione non è partita, che nulla è stato
  modificato e come aggiungere le pagine a mano con i due file JSON.
- Un errore imprevisto durante l'installazione viene intercettato e mostrato nella schermata di
  setup, senza bloccare la bacheca.
- Le pagine già installate non dipendono da quelle funzioni: le mostra Divi.
- Lo script delle animazioni usa di Divi solo la funzione per lo scorrimento verso le ancore, e
  solo se esiste.

Questo non è una garanzia sulle versioni future: è ciò che limita i danni se Divi cambia.

### Riprovare con un'altra versione di Divi

```bash
./bin/compat.sh percorso/di/Divi.zip   # oppure: npm run compat
```

Lo script crea un WordPress usa e getta (non tocca il sito di sviluppo), installa quel Divi e il
child theme, fa partire l'installazione come per un acquirente e controlla: resoconto del setup,
tutte le pagine, un articolo e la 404 sul sito pubblico, che cosa converte quella versione di
Divi e che non perda impostazioni, che sostituire Divi non cambi nulla, che un secondo setup non
duplichi nulla, il log degli errori PHP. Sulla 5.15.1 passano tutti e 20 i controlli. Non apre
un browser: builder e animazioni vanno guardati a mano.

Con `ET_USERNAME` e `ET_API_KEY` in `.env` accetta anche un numero di versione
(`./bin/compat.sh 5.19.0`) e scarica quella versione con la stessa richiesta che usa Divi per
tornare alla versione precedente. Questa parte non l'ho potuta provare: servono le credenziali.

## Animazioni

Sono fatte con GSAP 3.15.1 (con ScrollTrigger e SplitText), incluso nel tema in
`theme/perla-child/assets/js/vendor/`, e si agganciano a classi CSS sui moduli:

| Classe | Dove | Effetto |
| --- | --- | --- |
| `perla-hero` | prima sezione della pagina | All'apertura i contenuti entrano in sequenza; scorrendo, su schermi da 981 px in su, la sezione si rimpicciolisce in una scheda arrotondata. |
| `perla-split` | titoli | Il testo compare riga per riga (SplitText). |
| `perla-stagger` | righe, colonne, gruppi | I figli diretti entrano uno dopo l'altro. |
| `perla-reveal` | qualsiasi modulo | Dissolvenza con un leggero movimento verso l'alto. |
| `perla-image` | immagini grandi | L'immagine si scopre dal basso mentre lo zoom rientra. |
| `perla-pop` | pannelli (invito all'azione) | Il pannello cresce fino alla dimensione piena mentre entra nello schermo. |

Le classi le assegna il generatore con l'opzione `motion` dei moduli (`motion: 'stagger'`,
`motion: 'image'`…): i titoli h1 e h2 e le griglie di card le ricevono da sole, il resto è
indicato in `src/sections.js`. Nel builder compaiono in **Advanced → Attributes** come attributo
`class`, quindi chi compra può aggiungerle o toglierle da qualsiasi modulo.

Tempi, distanze e curve sono le costanti in cima a `assets/js/perla-motion.js`.

### Scorrimento fluido (Lenis)

Con mouse o trackpad la pagina scorre in modo graduale grazie a Lenis 1.3.27 (licenza MIT),
incluso in `assets/js/vendor/`. Lo avvia lo stesso script delle animazioni:

- solo sui dispositivi con puntatore preciso (`(hover: hover) and (pointer: fine)`): telefoni e
  tablet tengono lo scorrimento del sistema;
- GSAP fa da orologio a Lenis e Lenis aggiorna ScrollTrigger, così gli effetti legati allo
  scroll (hero, pannello finale) seguono la posizione senza ritardo aggiuntivo;
- le aree con una barra di scorrimento propria (campi di testo lunghi, pop-up) continuano a
  scorrere da sole (`allowNestedScroll`);
- se qualcosa blocca la pagina con `overflow: hidden` su `<html>` o `<body>` (un pop-up, una
  lightbox), la rotella torna al browser, quindi la pagina dietro non si muove;
- durante il salto a un'ancora Lenis si fa da parte e riparte alla fine.

La morbidezza è la costante `SMOOTH` in cima allo script. Si spegne da sola con "riduci
movimento", e a mano con la seconda casella in **Aspetto → Perla Setup** (opzione
`perla_child_smooth`) o con il filtro `perla_child_smooth_scroll_enabled`. Dipende dalle
animazioni: se quelle sono spente, è spento anche lo scorrimento fluido.

Come sono protette le pagine:

- Gli elementi in attesa sono nascosti solo mentre `<html>` ha la classe `perla-motion`, che il
  tema aggiunge nel `<head>`. Senza JavaScript, con "riduci movimento" attivo o se gli script
  vengono ritardati da un plugin di ottimizzazione, la classe non c'è e la pagina è visibile
  com'è. Se lo script non parte entro 4 secondi la classe viene tolta.
- Nel Visual Builder e nel Customizer gli script non vengono caricati.
- Le animazioni si spengono in **Aspetto → Perla Setup** (opzione `perla_child_motion`) o con il
  filtro `perla_child_motion_enabled`.
- Con le animazioni attive lo scorrimento verso le ancore (`#pricing`) usa la funzione di Divi
  resa animata; la regola CSS `scroll-behavior: smooth` resta solo quando sono spente, perché
  non va d'accordo con ScrollTrigger.
- Una pagina aperta direttamente su un'ancora lascia lo spazio dell'header fisso
  (`:target { scroll-margin-top }` in `style.css`). Senza questa regola, alla seconda visita Divi
  lasciava il titolo della sezione sotto l'header, anche a tema senza animazioni.

Le pagine già installate non cambiano quando si aggiorna il tema: per portarle ai layout nuovi
c'è **Restore the demo pages** nella stessa schermata, che sovrascrive le pagine e i layout
creati da Perla (non colori, variabili, menu né pagine proprie).

## Ambiente di sviluppo

Servono Docker e una copia di Divi (è un prodotto a pagamento: non sta nel repository).
Salva lo zip del tema come `divi/Divi.zip`, poi:

```bash
./bin/setup.sh
```

Lo script avvia WordPress e il database, installa Divi, attiva il child theme e lancia la stessa
importazione che riceve l'acquirente. Il sito è su <http://localhost:8080> (utente `admin`,
password `admin`). Rilanciare lo script aggiorna pagine, layout e variabili con l'ultima build.

In alternativa allo zip puoi copiare `.env.example` in `.env` e inserire `ET_USERNAME` e
`ET_API_KEY`: lo script prova a scaricare Divi da solo (vedi le verifiche più sotto).

Comandi utili:

```bash
docker compose run --rm cli wp eval-file /project/tools/check-pages.php   # controlla le pagine
docker compose down                                                       # ferma tutto
docker compose down -v                                                    # ferma e cancella i dati
```

## Modificare il tema

```bash
npm run validate   # confronta i moduli con lo schema di Divi 5.4
npm run build      # rigenera theme/perla-child/demo/ e theme/perla-child/defaults.php
./bin/setup.sh     # aggiorna il sito locale
npm run package    # crea in dist/ i file da caricare su Etsy
```

| File | Cosa cambi |
| --- | --- |
| `src/tokens.js` | Nome del tema, colori, font, variabili, contatti. |
| `src/assets/logo.png` | Logo dell'header (PNG trasparente, alto 120 px). |
| `src/content.js` | Testi demo: servizi (con i testi di ogni pagina servizio), team, recensioni, FAQ, articoli del blog. |
| `src/photos.json` | Le foto demo: file, misure, fonte, ritaglio (vedi "Foto demo"). |
| `src/sections.js` | Le sezioni (hero, servizi, footer…). |
| `src/pages.js` | Quali sezioni compongono ogni pagina e il menu. |
| `src/ui.js` | Lo stile dei singoli moduli (pulsanti, card, titoli…). |

Le modifiche fatte a mano nel Visual Builder restano nel sito in cui le fai: `npm run build`
rigenera i layout da `src/` e `./bin/setup.sh` li riscrive sulle pagine del sito locale. Quello
che deve finire nel prodotto va quindi riportato nel generatore.

`npm run package` crea in `dist/`:

| File | A cosa serve |
| --- | --- |
| `perla-child.zip` | Il tema, da caricare così com'è in WordPress. È il file principale. |
| `Perla-Setup-Guide.pdf` / `.md` | La guida per l'acquirente (`docs/BUYER-GUIDE.md`). |
| `Perla-Pages-for-Divi-Library.json` | Facoltativo: i layout delle pagine per la Divi Library. |
| `Perla-Theme-Builder-Templates.json` | Facoltativo: header, footer e template per il Theme Builder. |

Il PDF della guida si rigenera con `bash tools/guide-pdf.sh` (servono `pandoc` e Chrome o
Chromium).

## Verifiche fatte

Su un'installazione reale: WordPress 7.1 in Docker con **Divi 5.15.1** e PHP 8.3. Il percorso
dell'acquirente è stato eseguito dal pannello di WordPress con un browser automatico, su un
secondo sito pulito in cui il tema non è montato ma caricato come zip.

| Verifica | Esito |
| --- | --- |
| Sito nuovo: carico lo zip, clic su Attiva | Sito demo completo in circa 3 secondi, foto comprese, schermata "Your site is ready" |
| Contenuti salvati | I 4 layout del Theme Builder sono identici ai file del tema; nelle 11 pagine cambia solo l'indirizzo delle foto, che punta alla Libreria media |
| Resa del sito pubblico: tutte le pagine, articolo, 404; pagine servizio anche su tablet e telefono | Controllata con schermate |
| Menu a tendina su telefono, header fisso, mappa incorporata | Controllati |
| Pagina creata dall'installazione aperta nel Visual Builder | Tutti i moduli, i colori e le variabili presenti |
| Schermata Divi → Theme Builder dopo l'installazione | I tre template risultano salvati |
| Sito con contenuti propri | Niente viene toccato all'attivazione; il pulsante aggiunge solo ciò che manca |
| Seconda e terza esecuzione | Nessun duplicato; telefono, colori e pagine modificati dal proprietario restano; una pagina cestinata viene ricreata |
| Sito con permalink semplici (`?page_id=…`) | Pulsanti e menu puntano alle pagine giuste |
| Sito Divi con colori e font di serie già salvati | Sostituiti con quelli di Perla; quelli scelti dal proprietario restano |
| Versione precedente del tema già attiva, sostituita caricando il nuovo zip | L'installazione parte alla prima apertura della bacheca |
| Anteprima dal vivo nel Customizer, senza attivare | Non viene installato né salvato nulla |
| Tema genitore che non è Divi | Messaggio chiaro, nessun errore |
| Importazione manuale del file per la Divi Library | Gli 11 layout compaiono nella libreria |
| Importazione manuale del file del Theme Builder, su sito pulito e sopra template già presenti | Riuscita; i template sostituiti restano come "Unassigned" |
| `./bin/setup.sh` da zero e rilanciato | Riuscito |
| Errori PHP nel log di WordPress durante tutte le prove | Nessuno |
| Moduli conformi allo schema di Divi 5.4 (`npm run validate`) | 1100 moduli in 15 layout, nessun errore |

Foto e contenuti demo (versione 1.4):

| Verifica | Esito |
| --- | --- |
| Libreria media dopo l'installazione | 18 immagini con titolo, testo alternativo e credito; nessuna miniatura rotta |
| Immagini nelle pagine | Indirizzo della Libreria media, `width` e `height`, classe `wp-image-…`, caricamento differito; la foto della hero ha `fetchpriority="high"` |
| Seconda esecuzione e "Restore the demo pages" | Le foto già copiate vengono riusate: restano 18 |
| Cartella `uploads` non scrivibile (simulata) | Le pagine mostrano le foto dalla cartella del tema; la schermata di setup lo segnala |
| Sito con la versione 1.3 aggiornato caricando lo zip | Resta com'era; dopo "Restore the demo pages" arrivano testi e foto nuovi. Dati dello studio e articoli già presenti non vengono toccati |
| File per la Divi Library importato a mano | Gli 11 layout compaiono; una pagina creata da un layout mostra le foto dalla cartella del tema, con le misure |
| Pagina aperta nel Visual Builder | Foto, schede con orari, telefono e indirizzo mostrano le stesse cose del sito |
| Tutte le pagine su desktop; home, About e una pagina servizio su telefono; home su tablet | Controllate con schermate |
| `tools/photos.py` | Rigenera i 18 file identici byte per byte, anche riscaricando l'originale |
| Animazioni e scorrimento fluido rilanciati con foto e testi nuovi | 15 + 11 controlli superati |

Animazioni (Chromium, sul sito di sviluppo e su un sito pulito installato dallo zip):

| Verifica | Esito |
| --- | --- |
| Tutte le pagine, articolo e 404: scorrendo fino in fondo | Nessun elemento resta nascosto, nessun errore JavaScript, i titoli tornano testo normale |
| Sequenza di apertura, hero che si rimpicciolisce, titoli, card, immagini, pannello finale | Controllati fotogramma per fotogramma su desktop e telefono (vedi `docs/previews/animations.mp4`) |
| "Riduci movimento" attivo | Nessuna animazione, tutto visibile |
| JavaScript spento, oppure file di GSAP non caricabile | Tutto visibile (nel secondo caso dopo il timer di sicurezza) |
| Pagina lenta, con la foto della hero trattenuta 7 secondi | I testi della hero partono subito, lo spazio della foto resta riservato e le sezioni compaiono scorrendo |
| Pagina aperta su un'ancora e clic su "See pricing" | Arriva alla sezione giusta, con scorrimento animato |
| Finestra ridimensionata sopra e sotto 981 px | L'effetto della hero si toglie e si rimette senza residui |
| Visual Builder | Nessuno script di animazione caricato, pagina modificabile, le classi risultano negli attributi dei moduli |
| Script eseguiti in ritardo, come fanno i plugin di ottimizzazione | Niente viene nascosto e niente viene animato |
| Casella "Play the scroll animations" e pulsante "Restore the demo pages" | Provati dal pannello |
| Sito con la versione 1.1 aggiornato caricando lo zip | Il sito resta com'era; dopo "Restore the demo pages" le animazioni compaiono |
| Costo durante lo scorrimento (traccia del browser) | Circa 3 ms di JavaScript per fotogramma in media, nessun blocco lungo del thread principale |

Scorrimento fluido (Chromium):

| Verifica | Esito |
| --- | --- |
| Rotella del mouse | La pagina raggiunge la nuova posizione gradualmente e si ferma dove deve |
| Hero e header fisso durante lo scorrimento fluido | Seguono la posizione esatta |
| Rotella fino in fondo alla pagina, anche da utente collegato con la barra di amministrazione | Tutte le animazioni partono, niente resta nascosto |
| Clic su "See pricing" e pagina aperta su `#pricing` (prima e seconda visita, desktop e telefono, animazioni accese e spente) | La sezione arriva sotto l'header; dopo il salto la rotella riprende a funzionare |
| Campo di testo con barra di scorrimento propria | Scorre da solo, la pagina resta ferma |
| Pagina bloccata con `overflow: hidden` | La rotella non la muove; tolto il blocco riprende |
| Mappa incorporata | Utilizzabile a pagina ferma |
| Tasto Pag↓ | Funziona |
| Telefono (schermo touch) e "riduci movimento" | Lenis non parte, scorrimento del sistema |
| Visual Builder | Lenis non viene caricato |
| Le due caselle in Perla Setup | Provate dal pannello: lo scorrimento fluido si spegne da solo o insieme alle animazioni |
| Costo sul thread principale con la rotella (traccia) | Attività più lunga 26 ms, circa 2,4 ms di JavaScript per fotogramma |

I layout sono scritti nel formato di Divi 5.4. Le versioni successive aggiornano da sole i
contenuti più vecchi: su 5.15.1, aprendo e salvando la home nel builder, l'unica modifica è stata
la conversione del maiuscolo delle etichette nel nuovo campo dedicato.

Non verificato:

- **Licenza delle foto.** Ho letto la pagina della licenza di Pexels e la pagina di ogni foto
  (vedi "Foto demo"), ma non è un parere legale. Le liberatorie delle persone ritratte non sono
  pubbliche e non le ho potute controllare.
- **Larghezza e altezza delle foto nei layout su Divi 5.4–5.14.** Su 5.15.1 Divi le salva così
  quando si sceglie un'immagine dalla libreria; sulle versioni precedenti non è stato provato.
  Le misure arrivano comunque da WordPress tramite l'ID dell'immagine.
- **Foto su un sito in una sottocartella.** Gli indirizzi vengono da `wp_get_attachment_url()`,
  quindi dovrebbero essere giusti ovunque, ma è stato provato solo su siti alla radice. I layout
  importati a mano dalla Divi Library, invece, cercano le foto in
  `/wp-content/themes/perla-child/`: in una sottocartella, o con la cartella del tema rinominata,
  non le trovano finché non si sostituiscono.

- **Fluidità delle animazioni su dispositivi veri.** Questo ambiente non ha una scheda grafica:
  il browser disegna via software e i tempi di disegno non sono indicativi. È misurato solo il
  lavoro dello script. Vanno guardate su un computer e su un telefono veri.
- **Safari e Firefox.** Animazioni e scorrimento fluido sono stati provati solo in Chromium. GSAP
  e Lenis li supportano, ma non l'ho verificato su questo tema.
- **Trackpad e mouse veri.** La rotella è simulata dal browser automatico: la sensazione dello
  scorrimento fluido con un trackpad (che ha già la sua inerzia) va giudicata a mano.
- **Pop-up di altri plugin con lo scorrimento fluido.** Sono coperti i casi generali (aree con
  scroll proprio, pagina bloccata con `overflow: hidden`), non plugin specifici.
- **Il percorso nel builder per aggiungere una classe** (Advanced → Attributes → Add Attribute):
  le etichette vengono dal codice di Divi 5.15.1 e l'attributo risulta nei dati del builder, ma
  non ho fatto il clic a mano nell'interfaccia.
- **Licenza di GSAP per un template venduto**: vedi `docs/ETSY.md`, "Aspetti legali".
- **Versioni di Divi diverse da 5.4.0 e 5.15.1.** Vedi "Compatibilità con le versioni di Divi 5".
  In particolare l'installazione automatica (funzioni PHP di Divi) è stata eseguita solo sulla
  5.15.1, e le versioni dalla 5.16 alla 5.19 non sono state provate affatto. Prima di vendere va
  lanciato `./bin/compat.sh` con l'ultima versione di Divi.
- **WordPress in una sottocartella.** L'adattamento dei link è stato provato sui layout con uno
  script, non su un sito realmente installato in una sottocartella.
- **PHP 7.4 e multisite.** Il codice non usa sintassi di PHP 8, ma è stato eseguito solo su
  PHP 8.3 e su un sito singolo.
- **Download automatico di Divi con API key** (`bin/setup.sh`): senza credenziali non è stato
  possibile provarlo, e l'indirizzo usato non compare nel codice di Divi. Se non funziona lo
  script lo dice e chiede lo zip.
- **Invio del modulo contatti**: controllata solo la resa. La consegna delle email dipende dal
  server di posta del sito.

## Vendita

Vedi [`docs/ETSY.md`](docs/ETSY.md): cosa aggiungere per vendere meglio, testi e tag per
l'inserzione, cose da controllare prima della pubblicazione. La guida per chi compra è
[`docs/BUYER-GUIDE.md`](docs/BUYER-GUIDE.md).

## Note legali

- Divi è un marchio di Elegant Themes. Questo progetto non è affiliato né approvato da Elegant Themes.
- Il design è originale: prende spunto dalla struttura di un kit Figma community, ma non ne riusa
  immagini, icone o testi.
- Child theme sotto licenza GPL v2 o successiva. Le foto demo non sono GPL: restano sotto la
  licenza di Pexels (vedi "Foto demo" e `theme/perla-child/demo/images/CREDITS.txt`).
