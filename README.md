# Perla – tema Divi 5 per studi dentistici

Child theme per **Divi 5** pensato per essere venduto come template (Etsy). Si installa come un
normale tema e **costruisce da solo il sito demo**: pagine, header, footer, menu, colori e
articoli di esempio. Tutto il design è fatto con **soli moduli standard di Divi 5**: chi lo
compra modifica ogni cosa dal Visual Builder, senza plugin aggiuntivi e senza codice.

Il nome "Perla" e lo studio demo "Perla Dental Studio" sono segnaposto: si cambiano in
`src/tokens.js` (nome, colori, font, contatti) e `src/assets/logo.png` (logo dell'header).

## Cosa contiene

| Cartella | Contenuto |
| --- | --- |
| `theme/perla-child/` | Il child theme da installare su WordPress. |
| `theme/perla-child/inc/` | L'installazione automatica del sito demo e la schermata "Perla Setup". |
| `theme/perla-child/demo/` | I layout Divi e i contenuti che il tema installa (generati da `src/`). |
| `src/` | Il generatore dei layout: colori, variabili, sezioni, pagine. |
| `tools/` | Validatore dello schema Divi e script WP-CLI per l'ambiente locale. |
| `bin/` | `setup.sh` (ambiente di sviluppo) e `package.sh` (file da caricare su Etsy). |
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
  spaziature, dimensioni dei testi, nome dello studio, telefono, email, indirizzo. Si cambiano
  una volta e si aggiornano ovunque.
- **Colori principali e font** (primario, secondario, titoli, testo, link, i due font): Divi li
  tiene nel Theme Customizer. Li imposta il child theme (`theme/perla-child/defaults.php`,
  generato da `src/tokens.js`), sostituendo solo i valori vuoti o ancora uguali a quelli di serie
  di Divi: colori e font scelti dal proprietario del sito non vengono toccati.
- Font: Plus Jakarta Sans (titoli) e Inter (testi), entrambi Google Fonts già presenti in Divi.
- Dimensioni fluide con `clamp()`: il layout si adatta da solo a tablet e telefono.
- Le immagini sono **segnaposto SVG** incorporati nei layout: nessun problema di licenza e
  nessun file da caricare. Vanno sostituite con foto vere.

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
e i valori delle variabili restano come sono. Si può rilanciare quando si vuole (ricrea quello
che è stato cancellato). Se WordPress è in una sottocartella o usa i permalink semplici, i link
dei pulsanti vengono adattati agli indirizzi reali delle pagine.

Il codice è in `theme/perla-child/inc/`: `demo-import.php` (l'importazione, con le funzioni di
WordPress e di Divi) e `setup.php` (primo avvio, schermata e pulsante).

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
| `src/content.js` | Testi demo: servizi (con i dati di ogni pagina servizio), team, recensioni, FAQ. |
| `src/sections.js` | Le sezioni (hero, servizi, footer…). |
| `src/pages.js` | Quali sezioni compongono ogni pagina, il menu, gli articoli di esempio. |
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
| Sito nuovo: carico lo zip, clic su Attiva | Sito demo completo in circa 6 secondi, schermata "Your site is ready" |
| Contenuti salvati | Le 11 pagine e i 4 layout del Theme Builder sono identici byte per byte ai file del tema |
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
| Moduli conformi allo schema di Divi 5.4 (`npm run validate`) | 1079 moduli in 15 layout, nessun errore |

I layout sono scritti nel formato di Divi 5.4. Le versioni successive aggiornano da sole i
contenuti più vecchi: su 5.15.1, aprendo e salvando la home nel builder, l'unica modifica è stata
la conversione del maiuscolo delle etichette nel nuovo campo dedicato.

Non verificato:

- **Versioni di Divi tra 5.4 e 5.14.** L'installazione automatica usa funzioni PHP di Divi ed è
  stata eseguita solo su 5.15.1. Se una funzione manca il tema lo dice nella schermata di setup
  invece di dare errore, ma su quelle versioni non è stato provato.
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
- Child theme sotto licenza GPL v2 o successiva.
