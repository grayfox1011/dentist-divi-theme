# Vendere Perla su Etsy

Appunti pratici: cosa manca prima di pubblicare, cosa aggiungere per vendere meglio e una bozza
dell'inserzione. Le indicazioni su prezzi e abitudini degli acquirenti sono valutazioni mie, non
dati di mercato: conviene confrontarle con le inserzioni simili già presenti su Etsy.

## Prima di pubblicare

1. **Prova l'importazione su un Divi vero.** I layout sono stati controllati nel builder di
   Divi 5.4, ma l'importazione dei JSON dal pannello di amministrazione va provata su
   un'installazione reale, con l'ultima versione di Divi. È il controllo più importante.
2. **Sostituisci i segnaposto con foto vere** per le immagini dell'inserzione e per la demo.
   Verifica la licenza: deve consentire l'uso commerciale e, se vuoi includere le foto nel
   pacchetto, anche la ridistribuzione. Per foto con persone riconoscibili serve la liberatoria.
   In alternativa lascia i segnaposto nel prodotto e usa le foto solo nella demo, scrivendolo
   chiaramente ("immagini non incluse").
3. **Metti online una demo.** Un link a un sito funzionante è ciò che più convince chi compra un
   template: basta un sottodominio con WordPress, Divi e il tema importato.
4. **Scegli nome e autore definitivi** in `src/tokens.js` e in `theme/perla-child/style.css`,
   poi `npm run package`.
5. **Aggiorna `theme/perla-child/screenshot.png`** (1200 × 900 px): è l'anteprima che WordPress
   mostra in Aspetto → Temi. Quella attuale è ricavata dalla home con i segnaposto.

## Cosa aggiungere per vendere meglio

In ordine di impatto stimato.

### 1. Importazione demo in un clic

Oggi l'acquirente importa tre file e crea le pagine a mano (circa 15 minuti). Un pulsante
"Importa demo" nel child theme riduce richieste di assistenza e rimborsi, ed è l'argomento di
vendita più citato nelle inserzioni di child theme. Va sviluppato e provato su un Divi reale.

### 2. Più pagine

- Prezzi e assicurazioni / piani di pagamento
- Scheda del singolo dentista
- Galleria prima/dopo
- Nuovi pazienti (cosa portare, moduli da scaricare)
- Landing page per campagne (es. "Sbiancamento: prima visita gratuita")
- Pagina di ringraziamento dopo l'invio del modulo
- Privacy, cookie e termini (testi segnaposto)
- "Sito in costruzione"

Con il generatore ogni pagina nuova riusa le sezioni esistenti: sono poche righe in `src/pages.js`.

### 3. Animazioni leggere

Comparsa allo scorrimento per titoli e card, leggero sollevamento delle card al passaggio del
mouse, header che si compatta scorrendo. Poche e sobrie: un sito medico deve trasmettere calma, e
le animazioni pesanti rallentano il caricamento su telefono.

### 4. Prenotazione online

Una sezione pronta per incorporare Calendly o un plugin di prenotazione, il pulsante WhatsApp e
una barra fissa "Chiama ora" su telefono. Per uno studio dentistico la prenotazione è l'obiettivo
del sito: mostrarla già risolta aumenta il valore percepito.

### 5. Varianti di colore

Tre o quattro palette pronte (menta, lavanda, sabbia, scuro). Tecnicamente basta cambiare sei
colori nel Variable Manager: la guida per l'acquirente elenca già tre palette. Mostrarle nelle
immagini dell'inserzione fa capire che il tema si adatta a qualunque marchio.

### 6. Contenuti in più lingue

Demo in inglese (la versione attuale), italiano e spagnolo come file separati. Allarga il
mercato e ti distingue: quasi tutti i template sono solo in inglese.

### 7. Materiale di supporto

- Guida PDF con schermate (la base è `docs/BUYER-GUIDE.md`)
- Video di 2-3 minuti: installazione e personalizzazione
- Bonus in Canva: post social, biglietto appuntamento, copertina Facebook con gli stessi colori

### 8. Altre nicchie con la stessa base

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

> Launch a calm, modern website for your dental practice in an afternoon. Perla is a child theme
> and layout pack for Divi 5, built only with standard Divi modules, so you can edit every word,
> colour and photo visually. No coding and no extra plugins.
>
> WHAT YOU GET
> - 6 page layouts: Home, About, Services, Service detail with pricing, Blog, Contact
> - Global header and footer, blog post template and 404 page
> - Before/after smile slider, team, reviews, FAQ, pricing and appointment form sections
> - Global colours, fonts and design variables: change your brand once, update everywhere
> - Clinic name, phone, email and address stored as variables
> - Fully responsive on desktop, tablet and phone
> - Step-by-step setup guide
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
8. "Come funziona": installa, importa, personalizza
9. Requisiti: serve Divi 5, foto non incluse
10. Assistenza e aggiornamenti

Le anteprime in `docs/previews/` sono un buon punto di partenza per le immagini 2, 4 e 5.

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
