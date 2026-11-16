// Tour 3D della Toasteria: punti di vista collegati da frecce, stile Street View.
// Il modello (assets/toasteria.glb) e le lightmap sono prodotti dagli script in source/.
// La luce diffusa e' quella calcolata da Cycles (lightmap); i riflessi vengono da sonde catturate
// nel browser all'avvio, una per zona, e corrette sulla forma della stanza.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { Pass, FullScreenQuad } from 'three/addons/postprocessing/Pass.js';

// Coordinate di Blender (x destra, y verso il fondo del locale, z in alto) -> three.js (y in alto)
const B = (x, y, z) => new THREE.Vector3(x, z, -y);
const EYE = 1.6;
const TILT = -0.2;                     // sguardo leggermente verso il basso: le frecce restano in vista
const ARROW_DIST = 2.2;                // distanza delle frecce davanti al punto di vista
const ARROW_H = 0.45;                  // poco sopra il pavimento, cosi' non finiscono sotto i comandi
const Z1 = 3.42;                       // quota del primo piano

// ------------------------------------------------------------------ punti di vista
// p = posizione degli occhi, look = punto inquadrato all'arrivo (coordinate Blender, metri),
// exp = esposizione (come l'occhio che si adatta: piu' alta dove c'e' meno luce)
const NODES = [
  { id: 'ingresso', name: 'Ingresso', floor: 0, p: [3.0, 0.75, EYE], look: [1.0, 4.2, 1.6], exp: 1.2 },
  { id: 'venere', name: 'La Nascita di Venere', floor: 0, p: [2.55, 2.8, EYE], look: [0, 2.8, 1.85], exp: 1.2 },
  { id: 'piedi-scala', name: 'Verso la scala', floor: 0, p: [2.6, 4.35, EYE], look: [2.45, 9.5, 3.3], exp: 1.2 },
  { id: 'scala', name: 'Sulla scala', floor: 0.5, p: [2.45, 6.9, 1.44 + EYE], look: [2.2, 10.05, 4.6], exp: 1.15 },
  { id: 'pianerottolo', name: 'Il pianerottolo dei poster', floor: 0.5, p: [2.0, 9.02, 2.88 + EYE], look: [1.9, 10.05, 4.85], exp: 1.1 },
  { id: 'arrivo', name: 'Arrivo al primo piano', floor: 1, p: [1.35, 7.75, Z1 + EYE], look: [1.6, 0, Z1 + 1.2], exp: 1.0 },
  { id: 'primavera', name: 'La Primavera', floor: 1, p: [2.45, 4.5, Z1 + EYE], look: [0, 4.55, Z1 + 1.95], exp: 1.0 },
  { id: 'vetrata', name: 'La vetrata sulla strada', floor: 1, p: [2.4, 2.3, Z1 + EYE], look: [1.75, -2, Z1 + 1.2], exp: 0.92 },
  { id: 'passaggio', name: 'Passaggio tra le sale', floor: 1, p: [3.95, 1.55, Z1 + EYE], look: [6.4, 8.0, Z1 + 1.3], exp: 1.0 },
  { id: 'divanetto', name: 'La sala del divanetto', floor: 1, p: [5.45, 4.3, Z1 + EYE], look: [8.4, 4.4, Z1 + 1.0], exp: 1.0 },
  { id: 'cassette', name: 'Il muro di cassette', floor: 1, p: [5.95, 5.5, Z1 + EYE], look: [6.3, 8.3, Z1 + 1.45], exp: 1.05 },
  { id: 'vetrata-2', name: 'La seconda vetrata', floor: 1, p: [6.2, 1.7, Z1 + EYE], look: [6.3, -2, Z1 + 1.1], exp: 0.85 },
];
const EDGES = [
  ['ingresso', 'venere'], ['venere', 'piedi-scala'], ['piedi-scala', 'scala'],
  ['scala', 'pianerottolo'], ['pianerottolo', 'arrivo'], ['arrivo', 'primavera'], ['primavera', 'vetrata'],
  ['primavera', 'passaggio'], ['vetrata', 'passaggio'], ['passaggio', 'divanetto'], ['passaggio', 'vetrata-2'],
  ['divanetto', 'cassette'], ['divanetto', 'vetrata-2'],
];
// passaggi intermedi per i tratti che girano attorno a qualcosa
const VIA = {
  'pianerottolo>arrivo': [[1.45, 9.35, 2.88 + EYE], [1.35, 8.75, 3.06 + EYE]],
  'scala>pianerottolo': [[2.45, 8.6, 2.7 + EYE]],
  'primavera>passaggio': [[2.6, 2.05, Z1 + EYE]],                        // attorno al divisorio tra le sale
  'divanetto>vetrata-2': [[6.25, 3.1, Z1 + EYE]],                        // lascia spazio alla pianta
};
const FLOORS = [{ label: 'Piano terra', value: 0 }, { label: 'Primo piano', value: 1 }];
const floorOf = (n) => (n.floor >= 1 ? 1 : 0);
const floorLabel = (n) => (n.floor === 0.5 ? 'Scala' : FLOORS[floorOf(n)].label);

const byId = Object.fromEntries(NODES.map((n, i) => [n.id, i]));
const NEIGH = NODES.map(() => []);
for (const [a, b] of EDGES) { NEIGH[byId[a]].push(byId[b]); NEIGH[byId[b]].push(byId[a]); }
for (const n of NODES) { n.pos = B(...n.p); n.lookAt = B(...n.look); n.floorY = n.pos.y - EYE; }

// ------------------------------------------------------------------ zone (una lightmap e una sonda ciascuna)
// box = [min, max] della stanza in coordinate Blender, probe = punto da cui si cattura il riflesso
const ZONES = {
  gf: { box: [[0, -0.1, 0], [5.2, 5.5, 3.05]], probe: [2.6, 2.7, 1.45] },
  st: { box: [[0.65, 5.5, 0], [3.0, 10.05, 6.62]], probe: [2.3, 8.6, 4.3] },
  ufa: { box: [[0, -0.05, Z1], [3.1, 8.41, 6.62]], probe: [1.6, 3.9, Z1 + 1.45] },
  ufb: { box: [[3.1, -0.05, Z1], [8.4, 8.0, 6.62]], probe: [5.9, 4.0, Z1 + 1.45] },
};
for (const z of Object.values(ZONES)) {
  const [a, b] = z.box;
  z.uBoxMin = { value: new THREE.Vector3(a[0], a[2], -b[1]) };
  z.uBoxMax = { value: new THREE.Vector3(b[0], b[2], -a[1]) };
  z.uProbe = { value: B(...z.probe) };
  z.materials = [];
}
const zoneOfName = (name) => (/^(?:LM_|GLASS_|EMIT_)?(gf|st|ua|ub|ufa|ufb)/.exec(name) || [])[1];
const zoneKey = (k) => ({ ua: 'ufa', ub: 'ufb' }[k] || k);

// resa: valori in scala "scena" (HDR), prima della curva di tono
const LOOK = {
  lens: 9, lensProbe: 260,            // faretti: come si vedono / quanto pesano nei riflessi
  outdoor: 1.55, outdoorProbe: 5,     // la strada oltre i vetri: come si vede / quanto pesa nei riflessi (il giorno e' molto piu' forte dei faretti)
  env: 1.0, specRef: 1.5,             // intensita' dei riflessi; sotto questa luce i riflessi si spengono
  bloom: { strength: 0.16, radius: 0.5, threshold: 1.9 },
  power: 1.22, saturation: 1.12, vignette: 0.2,   // "look" sulla curva AgX: contrasto e saturazione
  floorGloss: 0.38,                   // moltiplica la ruvidita' del parquet: piu' basso = piu' lucido
};

// ------------------------------------------------------------------ DOM
const $ = (id) => document.getElementById(id);
const root = $('tour');
const canvas = $('view');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const query = new URLSearchParams(location.search);
for (const [k, v] of query) if (typeof LOOK[k] === 'number' && v !== '' && !Number.isNaN(+v)) LOOK[k] = +v;   // prove di resa: ?outdoor=1.8

// "look" sulla curva di tono AgX (come il "Medium High Contrast" di Blender: una potenza e un po' di
// saturazione dopo la sigmoide). Si applica al modulo di three.js, quindi vale per entrambe le rese.
THREE.ShaderChunk.tonemapping_pars_fragment = THREE.ShaderChunk.tonemapping_pars_fragment.replace(
  'color = agxDefaultContrastApprox( color );',
  `color = agxDefaultContrastApprox( color );
	color = pow( max( color, vec3( 0.0 ) ), vec3( ${LOOK.power.toFixed(3)} ) );
	float agxLuma = dot( color, vec3( 0.2126, 0.7152, 0.0722 ) );
	color = agxLuma + ${LOOK.saturation.toFixed(3)} * ( color - agxLuma );`);

// Resa completa (alta dinamica, 16 bit per canale) o leggera? Si decide prima di creare il renderer,
// provando su un contesto usa e getta: restituisce i campioni di antialiasing disponibili, 0 se l'alta
// dinamica c'e' ma senza antialiasing, -1 se non c'e'.
function probeHDR() {
  try {
    const gl = document.createElement('canvas').getContext('webgl2', { antialias: false });
    if (!gl || (!gl.getExtension('EXT_color_buffer_float') && !gl.getExtension('EXT_color_buffer_half_float'))) return -1;
    const complete = (samples) => {
      const fb = gl.createFramebuffer(), rb = gl.createRenderbuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.bindRenderbuffer(gl.RENDERBUFFER, rb);
      if (samples) gl.renderbufferStorageMultisample(gl.RENDERBUFFER, samples, gl.RGBA16F, 16, 16);
      else gl.renderbufferStorage(gl.RENDERBUFFER, gl.RGBA16F, 16, 16);
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, rb);
      return gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE && gl.getError() === gl.NO_ERROR;
    };
    while (gl.getError() !== gl.NO_ERROR);
    const msaa = Math.min(4, gl.getParameter(gl.MAX_SAMPLES) || 0);
    const result = msaa >= 2 && complete(msaa) ? msaa : (complete(0) ? 0 : -1);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return result;
  } catch (e) {
    return -1;
  }
}
// se la scheda grafica ha ceduto in una visita precedente, si riparte dalla resa leggera
const remembered = (() => { try { return sessionStorage.getItem('tour-qualita'); } catch (e) { return null; } })();
const lite = query.get('qualita') === 'base' || (remembered === 'base' && query.get('qualita') !== 'alta');
const hdrSamples = lite ? -1 : probeHDR();

let renderer;
try {
  // nella resa completa l'antialiasing e' sul buffer in alta dinamica, non su quello dello schermo
  renderer = new THREE.WebGLRenderer({ canvas, antialias: hdrSamples < 0, powerPreference: 'high-performance' });
} catch (e) {
  $('nogl').hidden = false;
  root.classList.remove('is-loading');
  throw e;
}
// La scheda grafica puo' togliere la vista 3D alla pagina (poca memoria, scheda rimasta a lungo in secondo
// piano). Si lascia che il browser la ripristini; se e' successo a pagina visibile, al prossimo
// caricamento si parte dalla resa leggera.
let contextLost = false, ready = false;
canvas.addEventListener('webglcontextlost', (ev) => {
  ev.preventDefault();
  contextLost = true;
  if (document.visibilityState === 'visible') {
    try { sessionStorage.setItem('tour-qualita', 'base'); } catch (e) { /* senza memoria si riprova uguale */ }
  }
  $('nogl').textContent = 'La vista 3D si è interrotta. Se non riparte da sola, ricarica la pagina.';
  $('nogl').hidden = false;
});
canvas.addEventListener('webglcontextrestored', async () => {
  contextLost = false;
  $('nogl').hidden = true;
  if (!ready) return;
  await captureProbes();          // le sonde dei riflessi erano immagini calcolate: vanno rifatte
  resize();
});
const coarse = window.matchMedia('(pointer: coarse)').matches;
let pixelCap = Math.min(window.devicePixelRatio || 1, coarse ? 1.75 : 2);   // si abbassa da solo se il dispositivo fatica
let pixelRatio = pixelCap;
const PIXEL_BUDGET = coarse ? 2.6e6 : 3.6e6;                                // pixel disegnati al massimo per fotogramma
renderer.setPixelRatio(pixelRatio);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0d0808);
const overlay = new THREE.Scene();          // frecce: disegnate dopo, fuori dalla resa fotografica
const camera = new THREE.PerspectiveCamera(68, 1, 0.05, 80);
camera.rotation.order = 'YXZ';

// ------------------------------------------------------------------ stato vista
const view = { yaw: 0, pitch: 0, fov: 68, index: 0, moving: false, exposure: 1 };
let dirty = true;
const yawTo = (from, to) => Math.atan2(-(to.x - from.x), -(to.z - from.z));
const pitchTo = (from, to) => Math.atan2(to.y - from.y, Math.hypot(to.x - from.x, to.z - from.z));
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const curatedPitch = (i) => clamp(pitchTo(NODES[i].pos, NODES[i].lookAt) + TILT, -0.5, 0.35);

function applyCamera() {
  camera.rotation.y = view.yaw;
  camera.rotation.x = view.pitch;
  const aspect = canvas.clientWidth / Math.max(1, canvas.clientHeight);
  // in verticale allarga il campo, cosi' si vede abbastanza stanza anche sul telefono
  const minH = THREE.MathUtils.degToRad(64);
  const needV = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(minH / 2) / aspect));
  camera.fov = clamp(Math.max(view.fov, needV * (view.fov / 68)), 30, 100);
  camera.updateProjectionMatrix();
  dirty = true;
}

// ------------------------------------------------------------------ resa fotografica (HDR -> schermo)
// Ultimo passaggio: vignettatura, curva di tono AgX, un filo di grana, poi le frecce.
class FinalPass extends Pass {
  constructor() {
    super();
    this.needsSwap = false;
    this.material = new THREE.ShaderMaterial({
      toneMapped: false, depthTest: false, depthWrite: false,
      uniforms: {
        tDiffuse: { value: null }, toneMappingExposure: { value: 1 }, uVignette: { value: LOOK.vignette },
      },
      vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }',
      fragmentShader: `
        #include <common>
        uniform sampler2D tDiffuse; uniform float uVignette;
        varying vec2 vUv;
        ${THREE.ShaderChunk.tonemapping_pars_fragment}
        vec3 toDisplay( vec3 x ) { return mix( x * 12.92, 1.055 * pow( max( x, vec3( 0.0 ) ), vec3( 1.0 / 2.4 ) ) - 0.055, step( vec3( 0.0031308 ), x ) ); }
        float hash( vec2 p ) { return fract( sin( dot( p, vec2( 12.9898, 78.233 ) ) ) * 43758.5453 ); }
        void main() {
          vec3 c = texture2D( tDiffuse, vUv ).rgb;
          vec2 q = vUv - 0.5;
          c *= 1.0 - uVignette * smoothstep( 0.35, 0.95, length( q ) * 1.25 );
          c = toDisplay( AgXToneMapping( c ) );
          c += ( hash( gl_FragCoord.xy ) - 0.5 ) * 2.4 / 255.0;
          gl_FragColor = vec4( clamp( c, 0.0, 1.0 ), 1.0 );
        }`,
    });
    this.quad = new FullScreenQuad(this.material);
  }
  render(r, writeBuffer, readBuffer) {
    this.material.uniforms.tDiffuse.value = readBuffer.texture;
    this.material.uniforms.toneMappingExposure.value = view.exposure;
    r.setRenderTarget(null);
    this.quad.render(r);
    drawOverlay();
  }
}

function drawOverlay() {
  const ac = renderer.autoClear;
  renderer.autoClear = false;
  renderer.clearDepth();
  renderer.render(overlay, camera);
  renderer.autoClear = ac;
}

let composer = null, bloom = null;
function setupComposer() {
  if (hdrSamples < 0) return;
  const size = renderer.getDrawingBufferSize(new THREE.Vector2());
  const target = new THREE.WebGLRenderTarget(size.x, size.y, { type: THREE.HalfFloatType, samples: hdrSamples });
  composer = new EffectComposer(renderer, target);
  composer.addPass(new RenderPass(scene, camera));
  bloom = new UnrealBloomPass(new THREE.Vector2(size.x, size.y), LOOK.bloom.strength, LOOK.bloom.radius, LOOK.bloom.threshold);
  composer.addPass(bloom);
  composer.addPass(new FinalPass());
}

function setQuality() {
  // senza composer la curva di tono la applica direttamente il renderer
  renderer.toneMapping = composer ? THREE.NoToneMapping : THREE.AgXToneMapping;
  const a2c = !!composer && hdrSamples > 0;              // bordi morbidi delle foglie, dove c'e' l'antialiasing
  for (const z of Object.values(ZONES)) for (const m of z.materials) {
    if (m.userData.alpha && m.alphaToCoverage !== a2c) { m.alphaToCoverage = a2c; m.needsUpdate = true; }
  }
}

function renderFrame() {
  if (composer) { composer.render(); return; }
  renderer.toneMappingExposure = view.exposure;
  renderer.setRenderTarget(null);
  renderer.render(scene, camera);
  drawOverlay();
}

function resize() {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  pixelRatio = Math.max(0.75, Math.min(pixelCap, Math.sqrt(PIXEL_BUDGET / Math.max(1, w * h))));
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(w, h, false);
  if (composer) { composer.setPixelRatio(pixelRatio); composer.setSize(w, h); }
  camera.aspect = w / Math.max(1, h);
  applyCamera();
}
window.addEventListener('resize', resize);

// ------------------------------------------------------------------ materiali
// Riflessi d'ambiente corretti sulla scatola della stanza (parallasse) e attenuati dove la lightmap e' buia;
// la parte diffusa viene solo dalla lightmap, per non contare la luce due volte.
const ENV_CHUNK = THREE.ShaderChunk.envmap_physical_pars_fragment.replace(
  'reflectVec = inverseTransformDirection( reflectVec, viewMatrix );',
  'reflectVec = inverseTransformDirection( reflectVec, viewMatrix );\n\t\t\treflectVec = tourBoxProject( reflectVec, vTourPos );',
).replace('#ifdef USE_ENVMAP', `#ifdef USE_ENVMAP
	vec3 tourBoxProject( vec3 dir, vec3 pos ) {
		vec3 inside = step( uBoxMin - 0.02, pos ) * step( pos, uBoxMax + 0.02 );
		if ( inside.x * inside.y * inside.z < 0.5 ) return dir;
		vec3 d = mix( vec3( 1e-5 ), dir, step( vec3( 1e-5 ), abs( dir ) ) );
		vec3 t = max( ( uBoxMax - pos ) / d, ( uBoxMin - pos ) / d );
		return normalize( pos + dir * min( min( t.x, t.y ), t.z ) - uProbe );
	}`);
const LIGHTS_CHUNK = `
#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	float tourOcc = 1.0;
	#ifdef USE_LIGHTMAP
		tourOcc = mix( 1.0, clamp( dot( lightMapIrradiance, vec3( 0.3333 ) ) / uSpecRef, 0.0, 1.0 ), uOcc );
	#endif
	radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness ) * tourOcc;
#endif
`;
function patch(material, zone, occ = 1) {
  const uOcc = { value: occ }, uSpecRef = { value: LOOK.specRef };
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, { uBoxMin: zone.uBoxMin, uBoxMax: zone.uBoxMax, uProbe: zone.uProbe, uOcc, uSpecRef });
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vTourPos;')
      .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvTourPos = ( modelMatrix * vec4( transformed, 1.0 ) ).xyz;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vTourPos;\nuniform vec3 uBoxMin; uniform vec3 uBoxMax; uniform vec3 uProbe; uniform float uOcc; uniform float uSpecRef;')
      .replace('#include <envmap_physical_pars_fragment>', ENV_CHUNK)
      .replace('#include <lights_fragment_maps>', LIGHTS_CHUNK);
  };
  material.customProgramCacheKey = () => 'tour-pbr-1';
  return material;
}

const ALPHA = /^(leaf|balcony)/;
const GLOSS = [[/^table_(long|mid|small)$/, 0.5], [/^poster_/, 0.3], [/^(frame_black|door_white|table_edge)$/, 0.6],
  [/^(banquette_red|chair_white|cast_iron|window_frame|pot_black)$/, 0.75]];
const lensMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 0.9, 0.72).multiplyScalar(LOOK.lens) });
const outdoor = [];
function makeMaterial(std, zone, lightMap, intensity) {
  const name = std.name || '';
  let m;
  if (name.startsWith('EMIT_lens')) return lensMat;
  if (name.startsWith('EMIT')) {
    // cio' che sta fuori dai vetri (strada, ringhiera del balcone) non ha lightmap: e' alla luce del giorno
    const map = std.emissiveMap || std.map;
    m = new THREE.MeshBasicMaterial({ map, color: new THREE.Color().setScalar((map ? 1 : 0.5) * LOOK.outdoor) });
    outdoor.push(m);
  } else if (name.startsWith('GLASS_window')) {
    // vetro delle finestre: resta trasparente, aggiunge solo il riflesso
    m = patch(new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.04, metalness: 0, transparent: true,
      blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }), zone, 0);
    m.userData.env = 0.9;
  } else if (name.startsWith('GLASS')) {
    const tint = { GLASS_dark: [0x2a1a10, 0.82], GLASS_green: [0x34482a, 0.78] }[name] || [0xdfe8e4, 0.22];
    m = patch(new THREE.MeshStandardMaterial({ color: tint[0], roughness: 0.06, metalness: 0, transparent: true, opacity: tint[1],
      depthWrite: tint[1] > 0.5, lightMap, lightMapIntensity: intensity * 0.6 }), zone, 0);
  } else {
    const metal = std.metalness > 0.5;
    m = new THREE.MeshStandardMaterial({
      map: std.map, color: std.color, roughness: std.roughness, metalness: std.metalness,
      roughnessMap: std.roughnessMap, metalnessMap: std.metalnessMap, normalMap: std.normalMap,
      lightMap: metal ? null : lightMap, lightMapIntensity: intensity,
    });
    if (std.normalMap) m.normalScale.copy(std.normalScale);
    // lucidita' vista dal vivo: le sonde sfocano i riflessi piu' del vero, quindi le superfici verniciate
    // vanno un po' piu' lisce che in Blender perche' finestre e faretti ci si specchino
    const gloss = name === 'floor_parquet' ? LOOK.floorGloss : (GLOSS.find(([re]) => re.test(name)) || [0, 1])[1];
    m.roughness *= gloss;
    if (name === 'floor_parquet') m.normalScale.multiplyScalar(0.6);
    if (name.startsWith('mural')) m.userData.env = 0.35;         // stampa opaca: niente velo di riflesso sopra il dipinto
    if (ALPHA.test(name) || std.alphaTest > 0 || std.transparent) {
      m.alphaTest = 0.5; m.side = THREE.DoubleSide; m.userData.alpha = true;
    }
    patch(m, zone, metal ? 0 : 1);
  }
  m.name = name;
  return m;
}

// ------------------------------------------------------------------ frecce sul pavimento
const arrowGroup = new THREE.Group();
overlay.add(arrowGroup);
// la freccia e' un disegno su un quadrato steso a terra: i bordi restano morbidi senza antialiasing
const ARROW_SIZE = 0.96;                 // lato del quadrato, in metri
const arrowTex = (() => {
  const S = 256, c = document.createElement('canvas');
  c.width = c.height = S;
  const g = c.getContext('2d');
  const k = S / ARROW_SIZE;
  const pts = [[0, 0.30], [0.36, -0.05], [0.25, -0.17], [0, 0.07], [-0.25, -0.17], [-0.36, -0.05]];   // metri, punta in avanti
  g.beginPath();
  pts.forEach(([x, y], i) => g[i ? 'lineTo' : 'moveTo'](S / 2 + x * k, S / 2 - (y - 0.065) * k));
  g.closePath();
  g.shadowColor = 'rgba(0, 0, 0, 0.6)'; g.shadowBlur = 14; g.shadowOffsetY = 3;
  g.fillStyle = '#fff'; g.fill();
  g.shadowColor = 'transparent';
  g.lineWidth = 2.5; g.strokeStyle = 'rgba(40, 22, 22, 0.5)'; g.stroke();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return t;
})();
const arrowGeo = new THREE.PlaneGeometry(ARROW_SIZE, ARROW_SIZE).rotateX(-Math.PI / 2);
arrowGeo.translate(0, 0, -0.065);
const hitGeo = new THREE.CircleGeometry(0.42, 24).rotateX(-Math.PI / 2);
const arrowMat = () => new THREE.MeshBasicMaterial({ map: arrowTex, transparent: true, opacity: 0.92, depthTest: false, depthWrite: false, toneMapped: false });
const hitMat = new THREE.MeshBasicMaterial({ visible: false });
let arrows = [];
const labelBox = $('labels');

// Direzione di ogni freccia: verso il primo tratto del percorso (dove si parte davvero); se due frecce
// dello stesso punto finirebbero quasi sovrapposte, puntano invece dritte alle loro destinazioni.
const ARROW_DIRS = NODES.map((n, i) => {
  const flat = (p) => new THREE.Vector3(p.x - n.pos.x, 0, p.z - n.pos.z).normalize();
  const list = NEIGH[i].map((j) => ({ j, first: flat(pathBetween(i, j)[1]), dest: flat(NODES[j].pos) }));
  const close = (a, b) => a.dot(b) > Math.cos(THREE.MathUtils.degToRad(32));
  const clash = list.some((a) => list.some((b) => a !== b && close(a.first, b.first)));
  return Object.fromEntries(list.map((a) => [a.j, clash ? a.dest : a.first]));
});
const arrowDir = (i, j) => ARROW_DIRS[i][j];

function buildArrows() {
  arrowGroup.clear();
  arrows = [];
  labelBox.replaceChildren();
  const n = NODES[view.index];
  for (const j of NEIGH[view.index]) {
    const m = NODES[j];
    const d = arrowDir(view.index, j);
    const g = new THREE.Group();
    const dist = Math.min(ARROW_DIST, 0.85 * Math.hypot(m.pos.x - n.pos.x, m.pos.z - n.pos.z));
    g.position.set(n.pos.x + d.x * dist, n.floorY + ARROW_H, n.pos.z + d.z * dist);
    g.rotation.y = Math.atan2(-d.x, -d.z);
    g.scale.setScalar(1.3);
    const ar = new THREE.Mesh(arrowGeo, arrowMat()); ar.renderOrder = 11;
    const hit = new THREE.Mesh(hitGeo, hitMat);
    hit.userData.target = j;
    g.add(ar, hit);
    g.userData = { target: j, mat: ar.material };
    arrowGroup.add(g);
    const label = document.createElement('span');
    label.className = 'arrow-label';
    label.textContent = m.name;
    labelBox.appendChild(label);
    arrows.push({ group: g, hit, target: j, label });
  }
  dirty = true;
}

// ------------------------------------------------------------------ caricamento
const status = { glb: 0, maps: 0, setup: 0 };
function progress() {
  const p = Math.round((status.glb * 0.72 + status.maps * 0.13 + status.setup * 0.15) * 100);
  $('bar-fill').style.width = p + '%';
  $('loader-pct').textContent = p + '%';
}
const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r()));

// Il modello si scarica con un normale fetch() dello stesso sito e si passa a GLTFLoader gia' in memoria.
// Le immagini incorporate diventano <img> (indirizzi blob:) invece di fetch(): cosi' il tour funziona
// anche dove una Content-Security-Policy restrittiva blocca fetch() di indirizzi data: e blob:.
function gltfLoader() {
  const loader = new GLTFLoader();
  loader.register((parser) => {
    parser.textureLoader = new THREE.TextureLoader(parser.options.manager);
    parser.textureLoader.setCrossOrigin(parser.options.crossOrigin);
    return { name: 'tour_image_textures' };
  });
  return loader;
}

async function fetchBytes(url, onProgress) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  const total = Number(res.headers.get('content-length')) || 0;
  if (!res.body || !total) { const b = new Uint8Array(await res.arrayBuffer()); onProgress(1); return b; }
  const reader = res.body.getReader();
  const chunks = [];
  let got = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value); got += value.length;
    onProgress(Math.min(1, got / total));
  }
  const out = new Uint8Array(got);
  let o = 0;
  for (const c of chunks) { out.set(c, o); o += c.length; }
  return out;
}

// glTF in formato JSON con il buffer in base64 -> GLB in memoria (nessun fetch di data:)
function jsonToGLB(json) {
  const uri = json.buffers?.[0]?.uri || '';
  if (!uri.startsWith('data:')) throw new Error('il glTF JSON deve avere i dati incorporati');
  const b64 = atob(uri.slice(uri.indexOf(',') + 1));
  const bin = new Uint8Array(b64.length);
  for (let i = 0; i < b64.length; i++) bin[i] = b64.charCodeAt(i);
  json.buffers[0] = { byteLength: bin.length };
  const js = new TextEncoder().encode(JSON.stringify(json));
  const jp = (4 - (js.length % 4)) % 4, bp = (4 - (bin.length % 4)) % 4;
  const total = 12 + 8 + js.length + jp + 8 + bin.length + bp;
  const buf = new ArrayBuffer(total), dv = new DataView(buf), u8 = new Uint8Array(buf);
  dv.setUint32(0, 0x46546c67, true); dv.setUint32(4, 2, true); dv.setUint32(8, total, true);
  dv.setUint32(12, js.length + jp, true); dv.setUint32(16, 0x4e4f534a, true);
  u8.set(js, 20); u8.fill(0x20, 20 + js.length, 20 + js.length + jp);
  const o = 20 + js.length + jp;
  dv.setUint32(o, bin.length + bp, true); dv.setUint32(o + 4, 0x004e4942, true);
  u8.set(bin, o + 8);
  return buf;
}

async function loadModel(url, onProgress) {
  const bytes = await fetchBytes(url, onProgress);
  const isGLB = bytes[0] === 0x67 && bytes[1] === 0x6c && bytes[2] === 0x54 && bytes[3] === 0x46;   // 'glTF'
  const data = isGLB ? bytes.buffer : jsonToGLB(JSON.parse(new TextDecoder().decode(bytes)));
  return new Promise((resolve, reject) => gltfLoader().parse(data, url.replace(/[^/]*$/, ''), resolve, reject));
}

let floorMeshes = [];
async function load() {
  const meta = await fetch('assets/lightmaps.json').then((r) => r.json());
  const tl = new THREE.TextureLoader();
  const maps = {};
  let done = 0;
  const entries = Object.entries(meta.maps);
  const mapsReady = Promise.all(entries.map(([key, file]) => new Promise((res, rej) => {
    tl.load('assets/' + file, (t) => {
      t.flipY = false; t.colorSpace = THREE.SRGBColorSpace; t.channel = 1;
      t.generateMipmaps = false; t.minFilter = THREE.LinearFilter; t.magFilter = THREE.LinearFilter;
      maps[key] = t; status.maps = ++done / entries.length; progress(); res();
    }, undefined, () => rej(new Error('lightmap ' + file)));
  })));
  const [gltf] = await Promise.all([
    loadModel(window.TOUR_MODEL || 'assets/toasteria.glb', (p) => { status.glb = p; progress(); }), mapsReady]);
  const intensity = Math.PI * meta.lmax;
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const cache = new Map();
  gltf.scene.updateMatrixWorld(true);
  gltf.scene.traverse((o) => {
    if (!o.isMesh) return;
    const key = o.userData.lightmap || o.parent?.userData?.lightmap;
    const zk = zoneKey(zoneOfName(o.name) || zoneOfName(o.parent?.name || '') || 'gf');
    const zone = ZONES[zk];
    const conv = (std) => {
      const id = std.uuid + zk;
      if (cache.has(id)) return cache.get(id);
      const m = makeMaterial(std, zone, key ? maps[key] : null, intensity);
      for (const t of [m.map, m.normalMap, m.roughnessMap]) if (t) t.anisotropy = Math.min(8, maxAniso);
      if (m.isMeshStandardMaterial) zone.materials.push(m);
      cache.set(id, m);
      return m;
    };
    o.material = Array.isArray(o.material) ? o.material.map(conv) : conv(o.material);
    if (o.material.transparent) o.renderOrder = 2;
    o.matrixAutoUpdate = false;
    if (!o.material.isMeshBasicMaterial || !o.material.transparent) floorMeshes.push(o);
  });
  scene.add(gltf.scene);
}

// Sonde dei riflessi: una foto a 360 gradi per zona, presa dalla scena gia' illuminata.
async function captureProbes() {
  const cubeRT = new THREE.WebGLCubeRenderTarget(256, { type: THREE.HalfFloatType });
  const cubeCam = new THREE.CubeCamera(0.05, 60, cubeRT);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const all = Object.values(ZONES).flatMap((z) => z.materials);
  // stessa variante di shader prima e dopo: una sonda nera durante la cattura
  renderer.setRenderTarget(cubeRT, 0); renderer.clear(); renderer.setRenderTarget(null);
  const blank = pmrem.fromCubemap(cubeRT.texture);
  for (const m of all) { m.envMap = blank.texture; m.envMapIntensity = 0; }
  lensMat.color.set(1, 0.9, 0.72).multiplyScalar(LOOK.lensProbe);
  for (const m of outdoor) m.color.multiplyScalar(LOOK.outdoorProbe / LOOK.outdoor);
  const tm = renderer.toneMapping;
  renderer.toneMapping = THREE.NoToneMapping;
  let k = 0;
  for (const z of Object.values(ZONES)) {
    cubeCam.position.copy(z.uProbe.value);
    cubeCam.update(renderer, scene);
    z.env?.dispose();
    z.env = pmrem.fromCubemap(cubeRT.texture).texture;
    status.setup = 0.3 + 0.7 * (++k / 4); progress();
    await nextFrame();
  }
  for (const z of Object.values(ZONES)) for (const m of z.materials) {
    m.envMap = z.env;
    m.envMapIntensity = (m.userData.env ?? 1) * LOOK.env;
  }
  lensMat.color.set(1, 0.9, 0.72).multiplyScalar(LOOK.lens);
  for (const m of outdoor) m.color.multiplyScalar(LOOK.outdoor / LOOK.outdoorProbe);
  renderer.toneMapping = tm;
  blank.dispose(); cubeRT.dispose(); pmrem.dispose();
}

// ------------------------------------------------------------------ movimento
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function pathBetween(a, b) {
  const pts = [NODES[a].pos.clone()];
  const k1 = `${NODES[a].id}>${NODES[b].id}`, k2 = `${NODES[b].id}>${NODES[a].id}`;
  if (VIA[k1]) VIA[k1].forEach((p) => pts.push(B(...p)));
  else if (VIA[k2]) [...VIA[k2]].reverse().forEach((p) => pts.push(B(...p)));
  pts.push(NODES[b].pos.clone());
  return pts;
}

// tempi di disegno durante gli spostamenti: se il dispositivo fatica, si alleggerisce la resa
const perf = { n: 0, sum: 0, last: 0, level: 0 };
function trackPerf(now) {
  if (perf.last) { perf.sum += now - perf.last; perf.n++; }
  perf.last = now;
}
function reviewPerf() {
  const avg = perf.n >= 12 ? perf.sum / perf.n : 0;
  perf.n = 0; perf.sum = 0; perf.last = 0;
  if (avg < 42 || perf.level >= 2) return;
  perf.level++;
  if (perf.level === 1 && pixelRatio > 1.2) pixelCap = Math.max(1, pixelRatio * 0.7);
  else { composer = null; perf.level = 2; setQuality(); }
  resize();
}

function travel(to, { curated = false } = {}) {
  if (view.moving || to === view.index) return;
  const from = view.index;
  const neighbour = NEIGH[from].includes(to);
  hideHint();
  if (!neighbour || reduceMotion) return teleport(to, curated || !neighbour);
  const pts = pathBetween(from, to);
  const seg = []; let L = 0;
  for (let i = 1; i < pts.length; i++) { const l = pts[i].distanceTo(pts[i - 1]); seg.push(l); L += l; }
  const dur = clamp(L / 1.9, 0.8, 2.8) * 1000;
  const yaw0 = view.yaw, pitch0 = view.pitch, exp0 = view.exposure, exp1 = NODES[to].exp || 1;
  const last = pts[pts.length - 1], prev = pts[pts.length - 2];
  const yaw1 = curated ? yawTo(NODES[to].pos, NODES[to].lookAt) : yawTo(prev, last);
  const pitch1 = curated ? curatedPitch(to) : TILT;
  const dy = wrap(yaw1 - yaw0);
  const t0 = performance.now();
  view.moving = true;
  arrowGroup.visible = false;
  placeLabels();
  const pos = new THREE.Vector3();
  const step = (now) => {
    const t = clamp((now - t0) / dur, 0, 1);
    const s = ease(t) * L;
    let acc = 0, i = 0;
    while (i < seg.length - 1 && acc + seg[i] < s) { acc += seg[i]; i++; }
    pos.lerpVectors(pts[i], pts[i + 1], seg[i] ? (s - acc) / seg[i] : 1);
    camera.position.copy(pos);
    const tr = ease(clamp(t * 1.35, 0, 1));
    view.yaw = yaw0 + dy * tr;
    view.pitch = pitch0 + (pitch1 - pitch0) * tr;
    view.exposure = exp0 + (exp1 - exp0) * ease(t);
    applyCamera();
    trackPerf(now);
    if (t < 1) requestAnimationFrame(step);
    else { arrive(to); reviewPerf(); }
  };
  requestAnimationFrame(step);
}

function teleport(to, curated) {
  const fade = $('fade');
  view.moving = true;
  fade.classList.add('is-on');
  setTimeout(() => {
    camera.position.copy(NODES[to].pos);
    if (curated) {
      view.yaw = yawTo(NODES[to].pos, NODES[to].lookAt);
      view.pitch = curatedPitch(to);
    }
    applyCamera();
    arrive(to);
    fade.classList.remove('is-on');
  }, reduceMotion ? 0 : 360);
}

function arrive(i) {
  view.index = i;
  view.moving = false;
  view.exposure = NODES[i].exp || 1;
  camera.position.copy(NODES[i].pos);
  buildArrows();
  arrowGroup.visible = true;
  updateUI();
}

// ------------------------------------------------------------------ input
let drag = null;
let hover = null;
const ray = new THREE.Raycaster();
const ndc = new THREE.Vector2();
function setNDC(ev) {
  const r = canvas.getBoundingClientRect();
  ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ndc, camera);
}
function pick(ev) {
  setNDC(ev);
  const hits = ray.intersectObjects(arrows.map((a) => a.hit), false);
  return hits.length ? hits[0].object.userData.target : null;
}
function setHover(t) {
  if (t === hover) return;
  hover = t;
  for (const a of arrows) {
    const on = a.target === t;
    a.group.scale.setScalar(on ? 1.55 : 1.3);
    a.group.userData.mat.opacity = on ? 1 : 0.92;
  }
  canvas.classList.toggle('is-pointer', t !== null);
  canvas.title = t !== null ? 'Vai a: ' + NODES[t].name : '';
  dirty = true;
}
const pointers = new Map();
canvas.addEventListener('pointerdown', (ev) => {
  canvas.setPointerCapture(ev.pointerId);
  pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
  if (pointers.size === 2) {
    const [a, b] = [...pointers.values()];
    drag = { pinch: Math.hypot(a.x - b.x, a.y - b.y), fov: view.fov };
    return;
  }
  drag = { x: ev.clientX, y: ev.clientY, x0: ev.clientX, y0: ev.clientY, moved: false };
});
canvas.addEventListener('pointermove', (ev) => {
  if (!pointers.has(ev.pointerId)) { if (ev.pointerType === 'mouse') setHover(view.moving ? null : pick(ev)); return; }
  pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
  if (!drag) return;
  if (drag.pinch !== undefined && pointers.size === 2) {
    const [a, b] = [...pointers.values()];
    view.fov = clamp(drag.fov * drag.pinch / Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)), 35, 90);
    applyCamera();
    return;
  }
  const dx = ev.clientX - drag.x, dy = ev.clientY - drag.y;
  drag.x = ev.clientX; drag.y = ev.clientY;
  if (Math.hypot(ev.clientX - drag.x0, ev.clientY - drag.y0) > 6) { drag.moved = true; canvas.classList.add('is-dragging'); hideHint(); }
  const k = THREE.MathUtils.degToRad(camera.fov) / canvas.clientHeight;
  view.yaw += dx * k;
  view.pitch = clamp(view.pitch + dy * k, -1.35, 1.35);
  applyCamera();
});
const endPointer = (ev) => {
  const wasTap = drag && !drag.moved && drag.pinch === undefined && pointers.size === 1;
  pointers.delete(ev.pointerId);
  canvas.classList.remove('is-dragging');
  if (wasTap && !view.moving) {
    const t = pick(ev);
    if (t !== null) travel(t);
    else clickFloor(ev);
  }
  if (pointers.size === 0) drag = null;
};
canvas.addEventListener('pointerup', endPointer);
canvas.addEventListener('pointercancel', (ev) => { pointers.delete(ev.pointerId); drag = null; canvas.classList.remove('is-dragging'); });
canvas.addEventListener('wheel', (ev) => {
  ev.preventDefault();
  view.fov = clamp(view.fov * (1 + Math.sign(ev.deltaY) * 0.08), 35, 90);
  applyCamera();
}, { passive: false });

// clic sul pavimento: va al punto vicino piu' prossimo al punto cliccato
function clickFloor(ev) {
  setNDC(ev);
  const hit = ray.intersectObjects(floorMeshes, false)[0];
  if (!hit) return;
  let best = null, bd = 2.6;
  for (const j of NEIGH[view.index]) {
    const p = NODES[j].pos;
    const d = Math.hypot(p.x - hit.point.x, p.z - hit.point.z);
    if (d < bd) { bd = d; best = j; }
  }
  if (best !== null) travel(best);
}

function neighbourInDirection(sign) {
  const n = NODES[view.index];
  const f = new THREE.Vector3(-Math.sin(view.yaw), 0, -Math.cos(view.yaw)).multiplyScalar(sign);
  let best = null, bd = Math.cos(THREE.MathUtils.degToRad(65));
  for (const j of NEIGH[view.index]) {
    const c = arrowDir(view.index, j).dot(f);
    if (c > bd) { bd = c; best = j; }
  }
  return best;
}
window.addEventListener('keydown', (ev) => {
  if (ev.target.closest && ev.target.closest('button')) { if (ev.key === 'Enter' || ev.key === ' ') return; }
  const k = ev.key.toLowerCase();
  if (k === 'arrowup' || k === 'w') { const t = neighbourInDirection(1); if (t !== null) travel(t); ev.preventDefault(); }
  else if (k === 'arrowdown' || k === 's') { const t = neighbourInDirection(-1); if (t !== null) travel(t); ev.preventDefault(); }
  else if (k === 'arrowleft' || k === 'a') { view.yaw += 0.12; applyCamera(); hideHint(); ev.preventDefault(); }
  else if (k === 'arrowright' || k === 'd') { view.yaw -= 0.12; applyCamera(); hideHint(); ev.preventDefault(); }
  else if (k === 'pagedown' || k === 'n') next(1);
  else if (k === 'pageup' || k === 'p') next(-1);
});

// ------------------------------------------------------------------ interfaccia
function next(dir) {
  const t = view.index + dir;
  if (t >= 0 && t < NODES.length) travel(t, { curated: true });
}
$('btn-prev').addEventListener('click', () => next(-1));
$('btn-next').addEventListener('click', () => next(1));
$('btn-full').addEventListener('click', () => {
  const el = document.documentElement;
  if (document.fullscreenElement) document.exitFullscreen();
  else Promise.resolve((el.requestFullscreen || el.webkitRequestFullscreen)?.call(el)).catch(() => {});
});
let hintTimer = setTimeout(hideHint, 9000);
function hideHint() { $('hint').classList.add('is-hidden'); clearTimeout(hintTimer); }

// mini-mappa: pianta semplificata dei due piani (metri, vista dall'alto, strada in basso)
const PLAN = {
  0: { rooms: [[0, 0, 5.2, 5.5], [3.0, 5.5, 4.6, 8.2]], stairs: [[1.9, 4.9, 3.0, 10.05], [0.65, 8.95, 1.9, 10.05]], murals: [[0, 1.15, 0, 4.45]] },
  1: { rooms: [[0, 0.8, 3.0, 8.41], [0.55, 0, 3.15, 0.8], [3.0, 0.8, 3.2, 2.4], [3.2, 0.8, 8.4, 8.0], [4.75, 0, 7.85, 0.8], [4.9, 8.0, 7.7, 8.35]],
       stairs: [[1.9, 6.0, 3.0, 10.05], [0.65, 8.41, 1.9, 10.05]], murals: [[0, 3.0, 0, 6.16]] },
};
let mapFloor = 0;
let mapCone = null;
const svgNS = 'http://www.w3.org/2000/svg';
function conePath() {
  const cur = NODES[view.index];
  const [x, y] = cur.p, R = 1.6, h = Math.min(1.2, THREE.MathUtils.degToRad(camera.fov * camera.aspect) / 2 || 0.7);
  const dir = Math.PI / 2 + view.yaw;            // yaw 0 = verso il fondo (y+)
  const a1 = dir - h, a2 = dir + h;
  return `M${x},${-y} L${x + R * Math.cos(a1)},${-(y + R * Math.sin(a1))} A${R},${R} 0 0 0 ${x + R * Math.cos(a2)},${-(y + R * Math.sin(a2))} Z`;
}
function drawMap() {
  const nav = $('minimap');
  nav.innerHTML = '';
  const tabs = document.createElement('div');
  tabs.className = 'tabs';
  FLOORS.forEach((f) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'tab'; b.textContent = f.label;
    b.setAttribute('aria-pressed', String(mapFloor === f.value));
    b.addEventListener('click', () => { mapFloor = f.value; drawMap(); });
    tabs.appendChild(b);
  });
  nav.appendChild(tabs);
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '-0.4 -10.5 9.2 10.9');
  svg.setAttribute('role', 'group');
  svg.setAttribute('aria-label', 'Pianta: ' + FLOORS[mapFloor].label);
  const plan = PLAN[mapFloor];
  const rect = (r, cls) => {
    const e = document.createElementNS(svgNS, 'rect');
    e.setAttribute('x', r[0]); e.setAttribute('y', -r[3]);
    e.setAttribute('width', r[2] - r[0]); e.setAttribute('height', r[3] - r[1]);
    e.setAttribute('class', cls); svg.appendChild(e);
  };
  plan.rooms.forEach((r) => rect(r, 'room'));
  plan.stairs.forEach((r) => rect(r, 'stairs'));
  plan.murals.forEach((m) => {
    const l = document.createElementNS(svgNS, 'line');
    l.setAttribute('x1', m[0] + 0.08); l.setAttribute('y1', -m[1]); l.setAttribute('x2', m[2] + 0.08); l.setAttribute('y2', -m[3]);
    l.setAttribute('class', 'mural'); svg.appendChild(l);
  });
  const cur = NODES[view.index];
  const onMap = (n) => (floorOf(n) === mapFloor && n.floor !== 0.5) || (n.id === 'scala' && mapFloor === 0) || (n.id === 'pianerottolo' && mapFloor === 1);
  mapCone = null;
  if (onMap(cur)) {
    mapCone = document.createElementNS(svgNS, 'path');
    mapCone.setAttribute('d', conePath());
    mapCone.setAttribute('class', 'cone'); svg.appendChild(mapCone);
  }
  NODES.forEach((n, i) => {
    if (!onMap(n)) return;
    const d = document.createElementNS(svgNS, 'circle');
    d.setAttribute('cx', n.p[0]); d.setAttribute('cy', -n.p[1]); d.setAttribute('r', 0.32);
    d.setAttribute('class', 'dot' + (i === view.index ? ' is-current' : ''));
    d.setAttribute('tabindex', '0'); d.setAttribute('role', 'button'); d.setAttribute('aria-label', n.name);
    const t = document.createElementNS(svgNS, 'title'); t.textContent = n.name; d.appendChild(t);
    const go = () => travel(i, { curated: true });
    d.addEventListener('click', go);
    d.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    svg.appendChild(d);
  });
  nav.appendChild(svg);
}

function updateUI() {
  const n = NODES[view.index];
  $('place-name').textContent = n.name;
  $('place-floor').textContent = floorLabel(n);
  $('counter').textContent = `${view.index + 1} / ${NODES.length}`;
  $('btn-prev').disabled = view.index === 0;
  $('btn-next').disabled = view.index === NODES.length - 1;
  mapFloor = n.floor === 0.5 ? (n.id === 'pianerottolo' ? 1 : 0) : floorOf(n);
  drawMap();
}

// ------------------------------------------------------------------ avvio
const tmpV = new THREE.Vector3();
function placeLabels() {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  for (const a of arrows) {
    tmpV.copy(a.group.position).project(camera);
    const show = arrowGroup.visible && tmpV.z < 1 && Math.abs(tmpV.x) < 1.05 && Math.abs(tmpV.y) < 1.05;
    a.label.hidden = !show;
    if (show) a.label.style.transform = `translate(${(tmpV.x * 0.5 + 0.5) * w}px, ${(-tmpV.y * 0.5 + 0.5) * h}px) translate(-50%, 18px)`;
  }
}
function loop() {
  if (dirty && !contextLost) {
    renderFrame();
    placeLabels();
    if (mapCone) mapCone.setAttribute('d', conePath());
    dirty = false;
  }
  requestAnimationFrame(loop);
}

(async () => {
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  try {
    await load();
    status.setup = 0.1; progress();
    await nextFrame();
    const start = byId[query.get('punto')] ?? 0;
    view.index = start;
    camera.position.copy(NODES[start].pos);
    view.yaw = yawTo(NODES[start].pos, NODES[start].lookAt);
    view.pitch = curatedPitch(start);
    setupComposer();
    setQuality();
    await captureProbes();
    resize();
    arrive(start);
    renderer.compile(scene, camera);
  } catch (e) {
    console.error(e);
    $('loader-pct').textContent = 'Non riesco a caricare il modello 3D (' + String(e?.message || e).slice(0, 140) + ').';
    return;
  }
  status.setup = 1; progress();
  renderFrame();
  ready = true;
  root.classList.remove('is-loading');
  window.TOUR = { view, NODES, LOOK, renderer, camera, scene, redraw: applyCamera };   // per prove e regolazioni dalla console
  loop();
})();
