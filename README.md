# Perla – tema Divi 5 per studi dentistici

Child theme e pacchetto di layout per **Divi 5**, pensato per essere venduto come template
(Etsy). Tutto il design è costruito con **soli moduli standard di Divi 5**: chi lo compra modifica
ogni cosa dal Visual Builder, senza plugin aggiuntivi e senza codice.

Il nome "Perla" e lo studio demo "Perla Dental Studio" sono segnaposto: si cambiano in
`src/tokens.js` (nome, colori, font, contatti) e `src/assets/logo.png` (logo dell'header).

## Cosa contiene

| Cartella | Contenuto |
| --- | --- |
| `theme/perla-child/` | Il child theme da installare su WordPress (volutamente minimale). |
| `layouts/` | I due file JSON da importare in Divi: pagine e Theme Builder. |
| `src/` | Il generatore dei layout: colori, variabili, sezioni, pagine. |
| `tools/` | Validatore dello schema Divi e script WP-CLI per l'ambiente locale. |
| `bin/` | `setup.sh` (ambiente di sviluppo) e `package.sh` (zip da caricare su Etsy). |
| `docs/` | Guida per l'acquirente, consigli di vendita, anteprime. |

### Pagine e template inclusi

- **Home** – hero, numeri, servizi, perché sceglierci, primi passi, galleria prima/dopo, team,
  recensioni, ultimi articoli, FAQ, invito all'azione.
- **About**, **Services**, **Service singolo** (con prezzi), **Blog**, **Contact** (modulo + mappa).
- **Theme Builder**: header globale (barra info + menu fisso), footer globale, template
  articolo del blog, pagina 404.

Anteprime del sito reale in [`docs/previews/`](docs/previews/).

### Come è fatto il design

- **Colori globali** e **variabili di design** di Divi 5 (Variable Manager): colori, raggi,
  spaziature, dimensioni dei testi, nome dello studio, telefono, email, indirizzo. Si cambiano
  una volta e si aggiornano ovunque. Viaggiano dentro i file dei layout.
- **Colori principali e font** (primario, secondario, titoli, testo, link, i due font): Divi li
  tiene nel Theme Customizer e non li importa con i layout. Li imposta il child theme alla prima
  attivazione, senza toccare valori già scelti dall'utente (`theme/perla-child/defaults.php`,
  generato da `src/tokens.js`).
- Font: Plus Jakarta Sans (titoli) e Inter (testi), entrambi Google Fonts già presenti in Divi.
- Dimensioni fluide con `clamp()`: il layout si adatta da solo a tablet e telefono.
- Le immagini sono **segnaposto SVG** incorporati nei layout: nessun problema di licenza e
  nessun file da caricare. Vanno sostituite con foto vere.

## Ambiente di sviluppo

Servono Docker e una copia di Divi (è un prodotto a pagamento: non sta nel repository).
Salva lo zip del tema come `divi/Divi.zip`, poi:

```bash
./bin/setup.sh
```

Lo script avvia WordPress e il database, installa Divi, attiva il child theme e costruisce
l'intero sito demo: colori e variabili, le sei pagine, header e footer, menu, articoli di
esempio. Non restano passaggi manuali. Il sito è su <http://localhost:8080> (utente `admin`,
password `admin`). Rilanciare lo script aggiorna pagine e layout con l'ultima build.

In alternativa allo zip puoi copiare `.env.example` in `.env` e inserire `ET_USERNAME` e
`ET_API_KEY`: lo script prova a scaricare Divi da solo (vedi le verifiche più sotto).

Comandi utili:

```bash
docker compose run --rm cli wp eval-file /project/tools/check-pages.php   # controlla le pagine
docker compose down                                                       # ferma tutto
docker compose down -v                                                    # ferma e cancella i dati
```

## Modificare il tema

Due modi, a seconda di cosa devi fare.

**Dal Visual Builder** (animazioni, ritocchi, nuove sezioni): modifica le pagine in Divi, poi
esporta da Divi Library / Theme Builder e sostituisci i file in `layouts/`.

**Dal codice** (testi, colori, struttura):

```bash
npm run validate   # confronta i moduli con lo schema di Divi 5.4
npm run build      # rigenera layouts/ e theme/perla-child/defaults.php
./bin/setup.sh     # aggiorna il sito locale
npm run package    # crea dist/Perla-Divi5-Dental-Theme.zip per Etsy
```

| File | Cosa cambi |
| --- | --- |
| `src/tokens.js` | Nome del tema, colori, font, variabili, contatti. |
| `src/assets/logo.png` | Logo dell'header (PNG trasparente, alto 120 px). |
| `src/content.js` | Testi demo: servizi, team, recensioni, FAQ. |
| `src/sections.js` | Le sezioni (hero, servizi, footer…). |
| `src/pages.js` | Quali sezioni compongono ogni pagina. |
| `src/ui.js` | Lo stile dei singoli moduli (pulsanti, card, titoli…). |

Attenzione: `npm run build` sovrascrive `layouts/`. Se hai modificato le pagine nel Visual
Builder ed esportato i JSON, da quel momento la fonte è Divi e il generatore non va più rilanciato
su quelle pagine.

## Verifiche fatte

Su un'installazione reale: WordPress in Docker con **Divi 5.15.1**.

| Verifica | Esito |
| --- | --- |
| `./bin/setup.sh` da zero: installazione, child theme, sito demo completo | Riuscita |
| Resa del sito pubblico: tutte le pagine, articolo, 404, su desktop, tablet e telefono | Controllata con schermate |
| Menu a tendina su telefono, header fisso, mappa incorporata | Controllati |
| Pagine create da script aperte nel Visual Builder | Tutti i moduli presenti e modificabili |
| Percorso dell'acquirente su un secondo sito pulito, solo dal pannello: attivazione del child theme, importazione dei due file, pagina creata da "Saved Layout" | Riuscito |
| Nessun errore PHP di Divi nel log | Confermato |
| Moduli conformi allo schema di Divi 5.4 (`npm run validate`) | 634 moduli, nessun errore |

I layout sono scritti nel formato di Divi 5.4 (versione minima richiesta). Le versioni successive
aggiornano da sole i contenuti più vecchi: su 5.15.1, aprendo e salvando la home nel builder,
l'unica modifica è stata la conversione del maiuscolo delle etichette nel nuovo campo dedicato.

Non verificato:

- **Download automatico di Divi con API key.** Senza credenziali non è stato possibile provarlo,
  e l'indirizzo usato non compare nel codice di Divi. Se non funziona lo script lo dice e chiede
  lo zip.
- **Invio del modulo contatti**: controllata solo la resa. La consegna delle email dipende dal
  server di posta del sito.
- **Versioni di Divi tra 5.4 e 5.14**: provate solo 5.4.0 (nel builder) e 5.15.1 (sito completo).

## Vendita

Vedi [`docs/ETSY.md`](docs/ETSY.md): cosa aggiungere per vendere meglio, testi e tag per
l'inserzione, cose da controllare prima della pubblicazione. La guida per chi compra è
[`docs/BUYER-GUIDE.md`](docs/BUYER-GUIDE.md).

## Note legali

- Divi è un marchio di Elegant Themes. Questo progetto non è affiliato né approvato da Elegant Themes.
- Il design è originale: prende spunto dalla struttura di un kit Figma community, ma non ne riusa
  immagini, icone o testi.
- Child theme sotto licenza GPL v2 o successiva.
