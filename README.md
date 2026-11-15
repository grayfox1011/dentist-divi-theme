# Dimora – tema a blocchi per studi di interior design

Dimora è un tema WordPress a blocchi (Gutenberg, niente page builder) pensato per interior designer, architetti e piccoli studi. È costruito nello stesso modo di Perla: solo blocchi di WordPress, pattern pronti, foto libere, animazioni allo scorrimento scritte apposta e un plugin che crea tutto il sito con un clic.

- **Tema:** `theme/dimora` (versione 1.0.0, WordPress 6.6 o successivo, PHP 7.4 o successivo)
- **Plugin:** `plugin/dimora-starter` (crea pagine, menu, articoli e imposta la home)
- **File da installare:** `dist/dimora.zip` e `dist/dimora-starter.zip` (li crea `bin/package.sh`)

Questo ramo (`dimora-gutenberg`) contiene solo Dimora. Perla per Divi e Perla a blocchi stanno su altri rami dello stesso repository (`perla-gutenberg` per la versione a blocchi).

## Come si usa

1. In WordPress: **Aspetto → Temi → Aggiungi → Carica tema**, scegli `dimora.zip`, attiva.
2. **Plugin → Aggiungi → Carica plugin**, scegli `dimora-starter.zip`, attiva.
3. **Aspetto → Dimora Starter → Build the site**.

Il plugin crea 13 pagine con blocchi veri (Home, Projects con sei schede progetto, Studio, Services, Journal, Contact, Terms), il menu, tre articoli di esempio, copia le foto nella Libreria media e imposta la Home come pagina iniziale. Non sovrascrive niente: una pagina che esiste già viene lasciata com'è. Il menu invece viene creato sempre, anche se il sito ne aveva già uno di un altro tema: l'header mostra il menu più recente, quindi quello nuovo; i menu vecchi restano e si scelgono in Aspetto → Editor → Navigazione. Una casella permette di non crearlo. Lo stesso schermo ha il pulsante per annullare tutto. Dopo l'uso il plugin si può cancellare, le pagine restano.

Senza plugin il tema funziona lo stesso: la home mostra subito le sezioni pronte, e ogni pagina della demo si ottiene creando una pagina e scegliendo il pattern con lo stesso nome.

Per una nuova scheda progetto: crea una pagina, scegli uno dei pattern "Project", e nel pannello a destra scegli il modello **Page without title** (il pattern ha già il suo titolo).

## Da dove vengono le idee

Ho letto 12 siti di studi di interior design e architettura premiati su Awwwards (dieci nel 2025–2026), più le pagine dei temi WordPress per interior design già in commercio. Da ogni sito ho preso un principio, mai testi, immagini o codice. Dei siti ho potuto leggere la struttura e i contenuti delle pagine e le schede dei premi; non ho potuto vedere i caratteri usati né le animazioni in movimento, quindi quelle di Dimora sono progettate da zero.

| Parte di Dimora | Idea presa da | Che cosa ho tenuto |
|---|---|---|
| Hero | Studio DADO, Shed, Driessen Architectuur | Si apre con una frase, non con uno slider; nessun pulsante come azione principale; sopra il titolo una riga con il tipo di studio e la città |
| Menu | Studio X, Andrea Diego, LPAS | Cinque voci e un "Start a project" sempre visibile; su telefono (o sempre, con la variante "full-screen menu") un menu a tutto schermo con le voci numerate |
| Numerazione (01), (02)… | LPAS, Smeulders, Andrea Diego | I contatori "1/5" degli slider diventano un motivo unico: schede, servizi, fasi, indice, menu |
| Galleria progetti in home | Studio X (striscia trascinabile) | Una fila di schede che scorre di lato mentre la pagina scende, con barra di avanzamento; sul telefono si sfoglia col dito |
| Pagina Progetti | Shed (vista "Featured" + "Index") | Due modi di entrare: griglia sfalsata di immagini grandi e sotto un indice tipografico con nome, tipo, luogo e metri quadri |
| Anteprima al passaggio del mouse | Van Praet, Abvtek | Nell'indice la foto del progetto segue il puntatore |
| Scheda progetto: dati | Studio X, Shed | Quattro campi e basta: luogo, anno, superficie, incarico |
| Scheda progetto: racconto | Driessen Architectuur, Stanzza | Tre capitoli fissi con etichetta: la richiesta, che cosa abbiamo fatto, il dettaglio |
| Scheda progetto: ritmo delle foto | Shed, Studio DADO | Una coppia di foto verticali, poi una orizzontale larga |
| Scheda progetto: materiali | Andrea Diego (riga dei materiali) | Una tavola con i quattro colori/materiali del progetto, modificabili come sfondo di un blocco |
| Scheda progetto: chiusura | Studio DADO, LPAS, Studio X | Un solo collegamento al progetto successivo, poi il contatto |
| Dal disegno alla stanza | Studio X ("Progress", "Drawings & details") | Mostrare il lavoro, non solo il risultato: un cursore trascinabile fra disegno a matita e stanza finita |
| Servizi e processo | Studio X (fasi numerate apribili) | Righe numerate che si aprono (blocco Dettagli di WordPress) e cinque fasi con la colonna del titolo che resta ferma |
| Prove di fiducia | BAMO, Stanzza | Nomi delle riviste come testo, numeri dello studio, domande frequenti |
| Riga di testo che scorre | Stanzza, Shed | La chiamata finale "Tell us about your home" scorre in orizzontale e si ferma al passaggio del mouse |
| Footer | Studio DADO, LPAS, Stanzza | Una frase grande, i recapiti, "torna su", e il nome del sito largo quanto il footer |
| Colori | LPAS, Van Praet, Stanzza, Studio DADO | Sempre una base chiara e un solo accento. Predefinito carta + argilla; varianti Oxblood, Olive, Plaster e Ink (scura) |
| Cambio pagina | Studio X, Van Praet (Barba.js) | Dissolvenza fra una pagina e l'altra con la funzione nativa del browser, senza librerie |

Dove Dimora fa diversamente dai siti premiati: i loro punteggi più bassi sono sull'accessibilità (6,8–7,2 su 10). Qui ogni scheda ha un solo link (il titolo, che copre tutta la scheda), le copie del testo che scorre sono nascoste a tastiera e lettori di schermo, i contrasti di tutte le palette sono sopra 4,5:1 e chi chiede "movimento ridotto" vede il sito fermo e completo.

Dalla ricerca sui temi in commercio: i temi gratuiti per interior design su WordPress.org non hanno una direzione grafica, né una scheda progetto, né animazioni; quelli a pagamento dipendono quasi tutti da un page builder. Dimora copre quel vuoto con soli blocchi di WordPress.

## Il design

- **Caratteri:** Instrument Serif per i titoli (con il corsivo vero per le parole in evidenza) e Instrument Sans per i testi. Hanno la stessa altezza delle minuscole, quindi stanno bene insieme. File nel tema, nessun collegamento a Google.
- **Colori:** carta `#f5f2ec`, lino `#ece7de`, sabbia `#e2dbcf`, inchiostro `#1b1a17`, argilla `#9c5233`, fondo scuro `#1f1c19`.
- **Varianti di stile** (Editor del sito → Stili): Oxblood, Olive, Plaster, Ink.
- **Segni ricorrenti:** linee sottili, etichette piccole in maiuscolo fra parentesi, numeri, foto senza angoli arrotondati, molto spazio.

## Le animazioni

Niente GSAP: la sua licenza non è compatibile con WordPress.org. Il motore è scritto apposta (`assets/js/motion.js`, 12 KB non compressi) e per lo scorrimento fluido usa Lenis (licenza MIT).

| Effetto | Dove |
|---|---|
| Titoli che salgono parola per parola, riga dopo riga | tutti i titoli grandi |
| Foto che si scoprono dall'alto e si assestano | hero, schede progetto, studio |
| Leggero scorrimento della foto dentro la cornice | foto grandi |
| Elementi che entrano uno dopo l'altro | griglie, elenchi, righe |
| Galleria orizzontale bloccata con barra di avanzamento | home, da 1024 px in su |
| Numeri che contano | studio |
| Riga di testo che scorre senza fine | chiamata finale |
| Header che si fa da parte scendendo e torna salendo | tutto il sito |
| Etichetta rotonda "View" che segue il puntatore | schede progetto |
| Foto che segue il puntatore | indice dei progetti |
| Righe che si aprono con altezza animata | servizi, domande |
| Cursore disegno/stanza trascinabile, anche da tastiera | pagina Services |
| Menu a tutto schermo con voci in sequenza | telefono e variante header |
| Dissolvenza fra le pagine | browser che la supportano |
| Nome del sito adattato alla larghezza del footer | footer |

Si spengono da **Aspetto → Personalizza → Animations**. Con "movimento ridotto" attivo nel dispositivo non partono. Se JavaScript non funziona, dopo 4 secondi tutto il contenuto è comunque visibile.

## Che cosa c'è dentro

- **11 pattern di pagina:** Home, Projects, 6 schede progetto, Studio, Services, Contact
- **29 pattern di sezione**, fra cui le sei parti della scheda progetto, tre modi di lavorare con i compensi e tre citazioni di clienti
- **2 header e 2 footer**
- **8 modelli:** home, pagina, pagina senza titolo, articolo, blog, archivio, ricerca, 404
- **38 fotografie** CC0 dalla WordPress Photo Directory, ritagliate da `tools/photos.py`: 35 nel tema e 3 nel plugin per gli articoli di esempio (elenco con indirizzi nei due `readme.txt`)
- **4 varianti di stile**

## Per chi lavora sul codice

```
src/content.js     testi della demo
src/photos.json    foto: origine, ritaglio, testo alternativo
src/blocks.js      blocchi di WordPress come oggetti
src/patterns.js    sezioni e pagine
src/templates.js   modelli
tools/build.js     scrive pattern, modelli e i dati del plugin facendoli salvare all'editor di WordPress
tools/photos.py    ritaglia le foto
tools/check.js     controlla che ogni blocco sia valido
tools/motion-check.js, tools/starter-check.js   prove di animazioni e plugin
bin/setup.sh       sito di prova con Docker
bin/package.sh     crea i due zip
```

I pattern non si scrivono a mano: `node tools/build.js` li fa salvare dall'editor di un WordPress acceso, così il codice è identico a quello che salverebbe WordPress. Va costruito con la versione più vecchia supportata (6.6), che le successive leggono. Se si aggiunge un pattern va alzata la `Version` in `style.css`, perché WordPress tiene in memoria l'elenco dei pattern per versione del tema.

I nomi delle funzioni seguono la stessa regola di Perla: prefisso obbligatorio `dimora_` e nome preso da Metal Gear Solid.

| Funzione | Che cosa fa |
|---|---|
| `dimora_dog_tag` | versione del tema |
| `dimora_shadow_moses` | stili nell'editor |
| `dimora_octocamo` | carica il foglio di stile |
| `dimora_stealth_camo` | stili di blocco (etichetta, elenco a trattini, riga numerata) |
| `dimora_codec` | categorie dei pattern |
| `dimora_big_boss` | dice se la home scelta ha un contenuto suo |
| `dimora_psycho_mantis` | carica il cursore disegno/stanza solo dove serve |
| `dimora_big_shell` | carica lo script che adatta il nome del sito alla larghezza del footer |
| `dimora_otacon`, `dimora_grey_fox` | interruttori delle animazioni |
| `dimora_liquid_snake` | carica le animazioni |
| `nanomachines`, `revolverOcelot`, `codecCall`, `metalGear`, `solitonRadar` (motion.js) | parole dei titoli, numeri, testo che scorre, galleria orizzontale, comparsa allo scorrimento |
| `bigShell` (fit.js) | nome del sito largo quanto il footer, anche con le animazioni spente |
| `sniperWolf` (compare.js) | cursore disegno/stanza |
| `dimora_starter_outer_heaven`, `_foxdie`, `_fulton`, `_extraction`, `_nanomachines`, `_soliton` (plugin) | costruisce il sito, annulla, copia una foto, collega le foto, espande i pattern, scrive il menu |

## Prove fatte

| Prova | Esito |
|---|---|
| Costruzione dei pattern con l'editor di WordPress 6.6 | 50 pattern, 8 modelli, 2 parti di modello scritti dall'editor stesso |
| Validità dei blocchi, WordPress 6.6.4 (`tools/check.js`) | 3243 blocchi in pattern, modelli, 12 pagine e 3 articoli: tutti validi; 71 immagini, tutte caricate |
| Validità dei blocchi, WordPress 7.1.4 | 3243 blocchi, tutti validi |
| Animazioni (`tools/motion-check.js`, 41 controlli) | 41 su 41 su WordPress 6.6.4 e su 7.1.4 |
| Plugin (`tools/starter-check.js`) | 25 controlli su 25 (WordPress 7.1.4): creazione, secondo clic senza doppioni, menu creato anche dove ne esisteva già uno, casella per non crearlo, pagine del proprietario lasciate stare, annullamento |
| Sito WordPress 7.1.4 nuovo, tema e plugin installati dagli zip, un clic | 18 controlli su 18: 13 pagine, menu, 3 articoli, 38 foto nella Libreria media con testo alternativo, home impostata |
| Solo tema, senza plugin | la home mostra le sezioni pronte; i link verso pagine che non esistono ancora restano inerti invece di dare errore 404 |
| Home con "Gli ultimi articoli" | elenco vero degli articoli con le pagine successive |
| Theme Check (plugin ufficiale) | nessun errore, nessun avviso |
| Plugin Check (plugin ufficiale) | nessun errore |
| Contrasto dei colori, 5 palette | tutte le coppie testo/fondo usate sono sopra 4,5:1 |
| Interruttori in Aspetto → Personalizza | animazioni spente: nessuno script di animazione caricato; scorrimento fluido spento: niente Lenis |
| Movimento ridotto, JavaScript spento, script bloccato | contenuto sempre tutto visibile |
| Revisione sulle regole di WordPress.org | nessun motivo di rifiuto trovato; 10 osservazioni, 7 corrette (link, blog in home, foto degli articoli nel plugin, nomi dei blocchi traducibili…), 3 lasciate e descritte sotto |
| Revisione di accessibilità | 19 osservazioni misurate nel browser, 18 confermate da una seconda verifica: 17 corrette (fra cui menu del telefono con nomi lunghi, fuoco della tastiera sul testo che scorre e sulle schede articolo, stampa, lingue da destra a sinistra), 1 lasciata (menu del telefono senza JavaScript, limite del blocco Navigazione di WordPress) |
| Viste controllate a occhio | 1920, 1440, 1366×650, 820 (tablet), 390 (telefono), editor di WordPress |

Lasciato com'è, per scelta:

- numero di telefono, e-mail e cifre della demo non passano dalla traduzione: sono dati che ogni studio sostituisce;
- i titoli delle pagine e gli articoli creati dal plugin sono in inglese anche su un sito in un'altra lingua;
- i tre link ai social nel footer sono segnaposto ("#") da sostituire.

Non verificato: browser diversi da Chromium (Firefox e Safari non sono installati in questo ambiente); dispositivi reali; lettori di schermo veri; lingue da destra a sinistra; la revisione umana di WordPress.org, che è l'unica che conta davvero.

## Per pubblicarlo su WordPress.org

1. Caricare prima il tema (`dimora.zip`). Il nome "dimora" risultava libero il 15 novembre 2026, va ricontrollato al momento dell'invio.
2. Il plugin (`dimora-starter.zip`) si carica solo dopo che il tema è stato accettato: da solo non fa niente, e i revisori dei plugin non potrebbero provarlo. Per lo stesso motivo il readme del tema non nomina il plugin: le regole permettono di consigliare solo plugin già presenti su WordPress.org. Si aggiunge la frase con un aggiornamento del tema quando il plugin è online.
3. Nel readme del tema e del plugin il contributore è `grayfox86`.

## Licenze

Tema e plugin: GPL v2 o successiva. Caratteri: SIL Open Font License 1.1. Lenis: MIT. Fotografie: CC0 dalla WordPress Photo Directory, la fonte che le linee guida di WordPress.org indicano come più sicura. Nessuna foto mostra persone riconoscibili.
