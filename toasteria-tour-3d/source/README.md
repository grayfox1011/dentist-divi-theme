# Come è stato costruito il tour

Tutto è generato da script, così si può correggere una misura o una texture e rifare il modello.
Serve **Blender 4.5 LTS** (usato in modalità senza interfaccia) e Python 3 con `opencv-python`,
`numpy` e `pillow`.

## 1. Dal video ai frame

```bash
ffmpeg -i video.mp4 -vf fps=10 -q:v 2 video/frames10/f_%04d.jpg
```

Il video (478 × 850, 65 secondi) diventa 656 fotogrammi. I frame non sono nel repository: si
rigenerano con il comando qui sopra.

## 2. Texture ricavate dal video (`video/`)

- `mosaic.py` registra con omografie (SIFT + RANSAC) tutti i frame che inquadrano una superficie
  piana e li fonde, preferendo per ogni punto il frame più nitido, vicino e frontale.
  - Venere: `python mosaic.py venus 59 116 1 98`
  - Primavera: `python mosaic.py primavera 391 445 1 411 1.0 0.62`
- `aspect.py` stima dalle quattro angolate del murale il rapporto larghezza/altezza reale
  (risultati: 1,61 per la Venere, come il dipinto originale; 1,45 per la Primavera, che nel
  locale è stampata senza Mercurio).
- `rectify.py` riproietta direttamente dai frame originali al rettangolo raddrizzato, senza
  passare due volte per il ricampionamento; `refine_quad.py` serve a correggere gli angoli dopo
  una prima prova con margine.
- `make_textures.py` crea tutte le altre texture: gli otto poster del pianerottolo (testi letti
  dal video), pavimenti a listoncini, piani dei tavoli con la scritta incisa, moquette della
  scala, cassette, foglie, intreccio delle poltrone acapulco, e i ritagli dal video (logo,
  quadretti, poster del divanetto, vista sulla strada).

Le texture finali usate da Blender sono in `blender/tex/`.

## 3. Il modello (`blender/`)

```bash
blender -b -P build.py -- toasteria.blend          # costruisce la scena
blender -b toasteria.blend -P preview.py -- prev   # render di controllo con Cycles
blender -b toasteria.blend -P bake.py -- baked 128 2048
blender -b baked/toasteria_baked.blend -P export.py -- web
python encode_lightmaps.py web ../../assets         # lightmap WebP + lightmaps.json
cp web/toasteria.glb ../../assets/
blender -b toasteria.blend -P render_stills.py -- ../../renders
```

- `build.py` contiene la pianta (in metri, `x` verso destra entrando, `y` verso il fondo, `z` in
  alto; primo piano a quota 3,42 m) e costruisce pareti, scala a U con pianerottolo, murales,
  poster, tavoli, sedie, divanetto, muro di cassette, piante, binari con faretti e luci.
- `bake.py` unisce ogni gruppo (piano terra, scala, primo piano) in un'unica mesh, crea una
  seconda mappa UV, calcola con Cycles la luce diffusa diretta e indiretta (lightmap) e la pulisce
  con il denoiser OIDN.
- `export.py` esporta il GLB con texture WebP ridimensionate per il web.
- Nel browser ogni materiale diventa `MeshBasicMaterial` con la sua lightmap: la luce è quella
  calcolata da Cycles, ma la scena gira in tempo reale anche su telefono.

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
