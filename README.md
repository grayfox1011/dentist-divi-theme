# Perla – tema Divi 5 per studi dentistici

Child theme e pacchetto di layout per **Divi 5**, pensato per essere venduto come template
(Etsy). Tutto il design è costruito con **soli moduli standard di Divi 5**: chi lo compra modifica
ogni cosa dal Visual Builder, senza plugin aggiuntivi e senza codice.

Il nome "Perla" e lo studio demo "Perla Dental Studio" sono segnaposto: si cambiano in un punto
solo (`src/tokens.js`).

## Cosa contiene

| Cartella | Contenuto |
| --- | --- |
| `theme/perla-child/` | Il child theme da installare su WordPress (volutamente minimale). |
| `layouts/` | I file JSON da importare in Divi: sistema di design, pagine, Theme Builder. |
| `src/` | Il generatore dei layout: colori, variabili, sezioni, pagine. |
| `tools/` | Validatore dello schema Divi e script WP-CLI per l'ambiente locale. |
| `bin/` | `setup.sh` (ambiente di sviluppo) e `package.sh` (zip da caricare su Etsy). |
| `docs/` | Guida per l'acquirente, consigli di vendita, anteprime. |

### Pagine e template inclusi

- **Home** – hero, numeri, servizi, perché sceglierci, primi passi, galleria prima/dopo, team,
  recensioni, ultimi articoli, FAQ, invito all'azione.
- **About**, **Services**, **Service singolo** (con prezzi), **Blog**, **Contact** (modulo + mappa).
- **Theme Builder**: header globale (barra info + menu sticky), footer globale, template
  articolo del blog, pagina 404.

Anteprime in [`docs/previews/`](docs/previews/).

### Come è fatto il design

- **Colori globali** e **variabili di design** di Divi 5 (Variable Manager): colori, raggi,
  spaziature, dimensioni dei testi, nome dello studio, telefono, email, indirizzo. Si cambiano
  una volta e si aggiornano ovunque.
- Font: Plus Jakarta Sans (titoli) e Inter (testi), entrambi Google Fonts già presenti in Divi.
- Dimensioni fluide con `clamp()`: il layout si adatta da solo a tablet e telefono.
- Le immagini sono **segnaposto SVG** incorporati nei layout: nessun problema di licenza e
  nessun file da caricare. Vanno sostituite con foto vere.

## Ambiente di sviluppo

Servono Docker e una copia di Divi (è un prodotto a pagamento: non può stare nel repository).

```bash
./bin/setup.sh
```

Lo script avvia WordPress e il database, installa Divi, attiva il child theme e crea pagine,
menu e articoli di esempio. Il sito è su <http://localhost:8080> (utente `admin`, password `admin`).

Per Divi ci sono due strade:

1. scarica `Divi.zip` dalla tua area Elegant Themes e salvalo in `divi/Divi.zip`, oppure
2. copia `.env.example` in `.env` e inserisci `ET_USERNAME` e `ET_API_KEY`: lo script prova a
   scaricarlo da solo.

Restano due importazioni manuali, le stesse che farà l'acquirente:

1. **Divi → Divi Library → Import & Export** → `layouts/Perla-1-Design-System.json`
2. **Divi → Theme Builder → Portability** → `layouts/Perla-3-Theme-Builder.json`

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
npm run build      # rigenera i file in layouts/
npm run package    # crea dist/Perla-Divi5-Dental-Theme.zip per Etsy
```

| File | Cosa cambi |
| --- | --- |
| `src/tokens.js` | Nome del tema, colori, font, variabili, contatti. |
| `src/content.js` | Testi demo: servizi, team, recensioni, FAQ. |
| `src/sections.js` | Le sezioni (hero, servizi, footer…). |
| `src/pages.js` | Quali sezioni compongono ogni pagina. |
| `src/ui.js` | Lo stile dei singoli moduli (pulsanti, card, titoli…). |

Attenzione: `npm run build` sovrascrive `layouts/`. Se hai modificato le pagine nel Visual
Builder ed esportato i JSON, da quel momento la fonte è Divi e il generatore non va più rilanciato
su quelle pagine.

## Stato delle verifiche

| Verifica | Esito |
| --- | --- |
| Resa di tutte le pagine nel Visual Builder di Divi 5.4.0 (desktop, tablet, telefono) | Fatta, sulla demo pubblica di Elegant Themes |
| Colori globali, variabili e font applicati | Fatta, nello stesso builder |
| Moduli conformi allo schema di Divi 5.4 (`npm run validate`) | 637 moduli, nessun errore |
| Ambiente Docker: installazione, child theme, creazione pagine | Fatta, con un tema Divi fittizio al posto di quello vero |
| Contenuto integro dopo il salvataggio in WordPress (`check-pages.php`) | Fatta |
| **Importazione dei JSON dal pannello di Divi e resa sul sito pubblico** | **Non ancora: serve una copia vera di Divi** |
| **Download automatico di Divi con API key** | **Non provato: l'indirizzo dell'API è quello noto, ma senza credenziali non è verificabile** |

I file JSON seguono la stessa struttura degli export ufficiali di Divi 5, ma la prova decisiva è
importarli in un'installazione reale. È il primo controllo da fare prima di mettere in vendita.

Le versioni di Divi successive alla 5.4 aggiornano da sole i contenuti più vecchi; conviene
comunque riprovare l'importazione sull'ultima versione prima della pubblicazione.

## Vendita

Vedi [`docs/ETSY.md`](docs/ETSY.md): cosa aggiungere per vendere meglio, testi e tag per
l'inserzione, cose da controllare prima della pubblicazione.

## Note legali

- Divi è un marchio di Elegant Themes. Questo progetto non è affiliato né approvato da Elegant Themes.
- Il design è originale: prende spunto dalla struttura di un kit Figma community, ma non ne riusa
  immagini, icone o testi.
- Child theme sotto licenza GPL v2 o successiva.
