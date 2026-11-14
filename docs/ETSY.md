# Vendere Perla su Etsy

Appunti pratici: cosa manca prima di pubblicare, cosa aggiungere per vendere meglio e una bozza
dell'inserzione. Le indicazioni su prezzi e abitudini degli acquirenti sono valutazioni mie, non
dati di mercato: conviene confrontarle con le inserzioni simili già presenti su Etsy.

## Prima di pubblicare

1. **Riprova l'installazione sull'ultima versione di Divi.** Il percorso dell'acquirente è stato
   provato per intero su Divi 5.15.1 (vedi il README). Divi esce con aggiornamenti frequenti:
   prima di pubblicare, e poi a ogni versione importante, ripeti la prova su un sito pulito:
   carica `perla-child.zip`, attivalo e controlla che compaia "Your site is ready".
2. **Sostituisci i segnaposto con foto vere** per le immagini dell'inserzione e per la demo.
   Verifica la licenza: deve consentire l'uso commerciale e, se vuoi includere le foto nel
   pacchetto, anche la ridistribuzione. Per foto con persone riconoscibili serve la liberatoria.
   In alternativa lascia i segnaposto nel prodotto e usa le foto solo nella demo, scrivendolo
   chiaramente ("immagini non incluse").
3. **Metti online una demo.** Un link a un sito funzionante è ciò che più convince chi compra un
   template: basta un sottodominio con WordPress, Divi e il tema importato.
4. **Scegli nome, autore e logo definitivi**: `src/tokens.js`, `theme/perla-child/style.css` e
   `src/assets/logo.png`, poi `npm run package`. I file da caricare su Etsy sono quelli in
   `dist/`: `perla-child.zip` (il tema), la guida in PDF e i due file JSON facoltativi. Etsy
   accetta fino a 5 file per inserzione.
5. **Aggiorna `theme/perla-child/screenshot.png`** (1200 × 900 px): è l'anteprima che WordPress
   mostra in Aspetto → Temi. Quella attuale è ricavata dalla home con i segnaposto.

## Già incluso: installazione automatica

Era il primo punto della lista delle cose da aggiungere, ora c'è. L'acquirente carica lo zip,
clicca "Attiva" e in pochi secondi ha il sito demo completo: 11 pagine, header, footer, menu,
colori e articoli di esempio. Non deve importare file né creare pagine a mano. È l'argomento di
vendita più forte del prodotto: mettilo nel titolo, nella prima riga della descrizione e in
un'immagine dedicata ("Install. Activate. Done.").

Sui siti che hanno già contenuti il tema non tocca nulla e chiede conferma con un pulsante.
Meno passaggi manuali dovrebbero voler dire meno richieste di assistenza e meno rimborsi.

## Già incluso: animazioni allo scorrimento (GSAP)

Dalla versione 1.2 le pagine sono animate con GSAP: la sezione in alto si rimpicciolisce in una
scheda arrotondata mentre si scorre, i titoli compaiono riga per riga, card e pulsanti entrano
uno dopo l'altro, le foto grandi si scoprono dal basso. Si spengono con una casella in
Aspetto → Perla Setup, non partono mai dentro il builder e rispettano l'impostazione "riduci
movimento" dei dispositivi.

Per l'inserzione: Etsy permette di aggiungere un video breve senza audio (per quanto ne so tra
5 e 15 secondi: controlla i limiti quando lo carichi). `docs/previews/animations.mp4` dura
13,5 secondi ed è pensato per questo. Le animazioni non si
capiscono dalle immagini ferme: il video è il modo più diretto per mostrarle.

Una cosa da decidere tu: la licenza di GSAP (vedi "Aspetti legali" più sotto).

## Cosa aggiungere per vendere meglio

In ordine di impatto stimato.

### 1. Più pagine

- Prezzi e assicurazioni / piani di pagamento (oggi i prezzi sono solo nella pagina Dental Implants)
- Scheda del singolo dentista
- Galleria prima/dopo
- Nuovi pazienti (cosa portare, moduli da scaricare)
- Landing page per campagne (es. "Sbiancamento: prima visita gratuita")
- Pagina di ringraziamento dopo l'invio del modulo
- Privacy, cookie e termini (testi segnaposto)
- "Sito in costruzione"

Con il generatore ogni pagina nuova riusa le sezioni esistenti: sono poche righe in `src/pages.js`,
e l'installazione automatica la crea insieme alle altre.

### 2. Prenotazione online

Una sezione pronta per incorporare Calendly o un plugin di prenotazione, il pulsante WhatsApp e
una barra fissa "Chiama ora" su telefono. Per uno studio dentistico la prenotazione è l'obiettivo
del sito: mostrarla già risolta aumenta il valore percepito.

### 3. Varianti di colore

Tre o quattro palette pronte (menta, lavanda, sabbia, scuro). Tecnicamente basta cambiare sei
colori nel Variable Manager: la guida per l'acquirente elenca già tre palette. Mostrarle nelle
immagini dell'inserzione fa capire che il tema si adatta a qualunque marchio.

### 4. Contenuti in più lingue

Demo in inglese (la versione attuale), italiano e spagnolo come file separati. Allarga il
mercato e ti distingue: quasi tutti i template sono solo in inglese.

### 5. Materiale di supporto

- Schermate nella guida PDF (oggi è solo testo: la base è `docs/BUYER-GUIDE.md`)
- Video di 2-3 minuti: installazione e personalizzazione
- Bonus in Canva: post social, biglietto appuntamento, copertina Facebook con gli stessi colori

### 6. Altre nicchie con la stessa base

Ortodonzia, pediatria, fisioterapia, veterinario, medicina estetica: stessi layout, palette e
testi diversi. Ogni variante è un'inserzione in più con poco lavoro, e un pacchetto "cliniche"
permette un prezzo più alto.

## Bozza dell'inserzione

**Titolo** (Etsy ammette 140 caratteri):

> Divi 5 Dental Theme | Dentist Website Template | WordPress Child Theme for Dental Clinic & Orthodontist | Divi Layout Pack

**Tag** (13, massimo 20 caratteri ciascuno):

`divi theme`, `divi child theme`, `divi 5`, `dentist website`, `dental template`,
`wordpress theme`, `dental clinic`, `orthodontist`, `medical website`, `website template`,
`divi layout pack`, `clinic website`, `dentist template`

**Descrizione** (apertura):

> Install, activate, done: Perla builds your complete dental website in seconds. No import files,
> no page-by-page set-up. It is a child theme for Divi 5, built only with standard Divi modules,
> so you can edit every word, colour and photo visually. No coding and no extra plugins.
>
> WHAT YOU GET
> - One-step set-up: activate the theme and the whole demo site is created for you
> - 11 pages: Home, About, Services, 6 treatment pages (one with a price table), Blog, Contact
> - Global header and footer, blog post template and 404 page
> - Before/after smile slider, team, reviews, FAQ, pricing and appointment form sections
> - Global colours, fonts and design variables: change your brand once, update everywhere
> - Clinic name, phone, email and address stored as variables
> - Scroll animations made with GSAP: text revealed line by line, staggered cards, a hero that
>   shrinks into a card. One tick switches them off
> - Fully responsive on desktop, tablet and phone
> - Safe on existing sites: nothing you already have is overwritten
> - Step-by-step set-up guide (PDF)
>
> PLEASE NOTE
> - Requires the Divi theme version 5.4 or newer (sold separately by Elegant Themes) and a
>   self-hosted WordPress site.
> - Demo photos are not included. The layouts ship with placeholders in the right sizes.
> - This is a digital download. No physical item will be shipped.

**Immagini** (in quest'ordine):

1. Home su portatile e telefono affiancati, con il nome del prodotto
2. La home per intero, in verticale
3. "Cosa è incluso": l'elenco delle pagine
4. Le altre pagine in miniatura
5. Vista su telefono
6. Personalizzazione: stesso layout in tre palette
7. Lo slider prima/dopo e il modulo di prenotazione
8. "Come funziona": installa, attiva, fatto (con la schermata "Your site is ready")
9. Requisiti: serve Divi 5, foto non incluse
10. Assistenza e aggiornamenti

Le anteprime in `docs/previews/` sono un buon punto di partenza per le immagini 2, 4, 5 e 8
(`service-pages.jpg` per le pagine servizio, `setup-screen.jpg` per la schermata di installazione).
Il video dell'inserzione è `animations.mp4`.

## Prezzo e licenza

Una fascia ragionevole per cominciare è quella dei child theme Divi già presenti su Etsy; un
prezzo di lancio scontato aiuta a raccogliere le prime recensioni. Valuta due livelli: licenza
per un sito e licenza "agenzia" per siti illimitati a un prezzo più alto.

Scrivi in modo esplicito nell'inserzione che Divi non è incluso: è il motivo più comune di
recensioni negative per questo tipo di prodotto.

## Aspetti legali

- Usa "for Divi" o "per Divi" e aggiungi la dicitura che non sei affiliato a Elegant Themes.
- Non riutilizzare immagini, icone o testi del kit Figma: il design di Perla è originale e ne
  riprende solo l'impostazione generale.
- Il child theme è GPL. I layout e le foto che aggiungi possono avere la licenza che scegli:
  indicala nel pacchetto.
- **GSAP.** Lo zip contiene i file di GSAP 3.15.1 (gsap, ScrollTrigger, SplitText) così come
  sono distribuiti, con la loro nota di copyright. La licenza standard di GSAP (in vigore dal
  30 aprile 2025, <https://gsap.com/standard-license>) dice che l'uso commerciale è gratuito,
  plugin compresi, e vieta solo gli strumenti che permettono di costruire animazioni in modo
  visuale in concorrenza con Webflow, cosa che un template non è. Non contiene però una
  clausola esplicita sui template venduti a più acquirenti: né un permesso né un divieto. Se
  vuoi la certezza, GSAP invita a scrivere a <https://gsap.com/contact> nei casi dubbi. In
  alternativa il tema può caricare GSAP da un CDN invece di includerlo: è una modifica di poche
  righe in `theme/perla-child/inc/motion.php`.
