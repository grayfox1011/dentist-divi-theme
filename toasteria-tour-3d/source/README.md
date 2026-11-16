# Come è stato costruito il tour

Tutto è generato da script, così si può correggere una misura, un materiale o una luce e rifare il
modello. Servono **Blender 4.5 LTS** (usato senza interfaccia) e Python 3 con `opencv-python`,
`numpy` e `pillow`.

## 1. Dal video ai frame

```bash
ffmpeg -i video.mp4 -vf fps=10 -q:v 2 video/frames10/f_%04d.jpg
```

Il video (478 × 850, 65 secondi) diventa 656 fotogrammi. I frame non sono nel repository: si
rigenerano con il comando qui sopra.

## 2. Texture (`video/`)

**Dal video**

- `mosaic.py` registra con omografie (SIFT + RANSAC) tutti i frame che inquadrano una superficie
  piana e li fonde, preferendo per ogni punto il frame più nitido, vicino e frontale.
  - Venere: `python mosaic.py venus 59 116 1 98`
  - Primavera: `python mosaic.py primavera 391 445 1 411 1.0 0.62`
- `aspect.py` stima dai quattro angoli del murale il rapporto larghezza/altezza reale (1,61 per la
  Venere, come il dipinto originale; 1,45 per la Primavera, che nel locale è stampata senza
  Mercurio).
- `rectify.py` riproietta dai frame originali al rettangolo raddrizzato, senza ricampionare due
  volte; `refine_quad.py` corregge gli angoli dopo una prima prova con margine.
- `make_textures.py` prepara i due murales, i quadretti, i poster del divanetto, la vista sulla
  strada del primo piano e ridisegna gli otto poster del pianerottolo con i testi letti nel video.

**Materiali**

- `make_textures_pbr.py` crea i materiali con **colore, rilievo e lucidità**: parquet industriale a
  lamelle (colore + normal map + mappa di ruvidità), piani dei tavoli in legno verniciato con la
  scritta incisa, moquette dei gradini, scatole di cartone con il sigillo stampato, foglie
  (monstera, zamioculca, rami d'acero), menu e cartelli, la strada vista dalla vetrina.

Le texture usate da Blender sono in `blender/tex/`.

## 3. Il modello (`blender/`)

```bash
blender -b -P build.py -- toasteria.blend            # costruisce la scena
blender -b toasteria.blend -P preview.py -- pv        # anteprime Cycles dei 12 punti di vista
blender -b toasteria.blend -P bake.py -- baked 128 2048
blender -b toasteria.blend -P export.py -- baked web   # rimette insieme le zone ed esporta il GLB
python encode_lightmaps.py web ../../assets            # lightmap WebP + lightmaps.json
cp web/toasteria.glb ../../assets/
blender -b toasteria.blend -P render_stills.py -- ../../renders
```

- `lib.py` è la cassetta degli attrezzi: scatole con spigoli smussati, tubi lungo un percorso,
  solidi di rotazione (gambe dei tavoli, vasi, bottiglie), foglie curve, materiali, vetro.
- `build.py` contiene la pianta (in metri: `x` verso destra entrando, `y` verso il fondo, `z` in
  alto; primo piano a quota 3,42 m) e costruisce pareti, scala a U, murales, poster, tavoli con
  base in ghisa, sedie pieghevoli, divanetto imbottito, poltrone acapulco a corde, piante, muro di
  scatole, oggetti sui tavoli e i faretti. La luce viene **solo** dai faretti e dalle finestre,
  senza luci di riempimento: le ombre e i riflessi di colore tra le pareti li calcola Cycles.
- `bake.py` divide il locale in quattro zone (piano terra, scala, sala della Primavera, sala del
  divanetto). Per ogni zona unisce gli oggetti, crea una seconda mappa UV dando più pixel a
  pavimenti e tavoli, calcola con Cycles la luce diffusa diretta e indiretta (128 campioni,
  2048 px), riempie i vuoti tra le isole e pulisce il rumore con OIDN. Sul computer usato
  (4 core, senza scheda grafica) ci mette circa 45 minuti. Ogni zona finisce in file suoi
  (`baked/LM_<zona>.blend` e `baked/lm_<zona>.exr`), quindi dopo una modifica si può rifare solo
  la zona toccata: `blender -b toasteria.blend -P bake.py -- baked 128 2048 st`.
- `export.py` rimette nella scena le quattro zone cotte ed esporta il GLB con texture WebP
  ridimensionate per il web; `encode_lightmaps.py` converte le lightmap in WebP a 8 bit, con una
  leggera lisciatura che toglie la grana senza toccare i bordi delle ombre.
- `render_stills.py` fa le otto immagini di `renders/` in path tracing, con riflessi e vetri veri.

## 4. Come il browser arriva a un'immagine realistica (`tour.js`)

- **Luce diffusa**: è la lightmap di Cycles. Nel browser non ci sono luci da calcolare.
- **Materiali fisici**: ogni materiale mantiene ruvidità, metallo e rilievo. Il parquet e i tavoli
  hanno una normal map, quindi il riflesso segue le doghe e la venatura. Le superfici verniciate
  sono un po' più lisce che in Blender (tabella `GLOSS`), perché le sonde sfocano i riflessi.
- **Riflessi**: all'avvio il tour scatta una foto a 360° da ogni zona (quattro sonde) e la usa
  come ambiente riflesso. Il riflesso è corretto sulla forma della stanza, così la finestra si
  riflette sul pavimento nel punto giusto, ed è attenuato dove la lightmap è buia (sotto i tavoli).
- **Resa fotografica**: l'immagine è calcolata in alta dinamica, poi passa per il bagliore delle
  luci forti (bloom), la curva di tono AgX, un filo di contrasto, vignettatura e grana.
- **Esposizione**: ogni punto di vista ha la sua (`exp` in `NODES`), come l'occhio che si adatta
  passando dal piano terra alle vetrate.

I valori di resa sono raccolti in `LOOK` all'inizio di `tour.js` e si possono provare dall'indirizzo,
per esempio `index.html?outdoor=1.8&floorGloss=0.6`. Con `?qualita=base` il tour rinuncia al bagliore e
all'alta dinamica: lo fa anche da solo se il dispositivo non regge il ritmo o se la scheda grafica
interrompe la vista (in quel caso `?qualita=alta` riporta alla resa completa).

Le misure sono stimate dal video: proporzioni dei murales, alzata e pedata dei gradini (18 × 27 cm,
16 alzate fino al pianerottolo e 3 fino al primo piano), dimensioni standard di tavoli e sedie.
Per cambiarle si modificano le costanti all'inizio di `build.py` e si rilancia la catena.

## Modello in formato JSON (opzionale)

Alcuni hosting o anteprime non servono i file `.glb`. Lo stesso modello si può salvare come glTF
JSON con i dati incorporati:

```bash
python3 - <<'PY'
import json, struct, base64
b = open('../assets/toasteria.glb', 'rb').read()
n = struct.unpack('<I', b[12:16])[0]
j = json.loads(b[20:20 + n])
bin_len = struct.unpack('<I', b[20 + n:24 + n])[0]
j['buffers'][0]['uri'] = 'data:application/octet-stream;base64,' + base64.b64encode(b[28 + n:28 + n + bin_len]).decode()
json.dump(j, open('../assets/toasteria.gltf.json', 'w'), separators=(',', ':'))
PY
```

e nella pagina, prima di `tour.js`: `<script>window.TOUR_MODEL = 'assets/toasteria.gltf.json';</script>`.
