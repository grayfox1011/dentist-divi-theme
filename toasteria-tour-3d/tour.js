// Tour 3D della Toasteria: punti di vista collegati da frecce, stile Street View.
// Il modello (assets/toasteria.glb) e le lightmap sono prodotti dagli script in source/.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Coordinate di Blender (x destra, y verso il fondo del locale, z in alto) -> three.js (y in alto)
const B = (x, y, z) => new THREE.Vector3(x, z, -y);
const EYE = 1.6;
const TILT = -0.2;                  // sguardo leggermente verso il basso: le frecce restano in vista
const ARROW_DIST = 2.2;                // distanza delle frecce davanti al punto di vista
const ARROW_H = 0.45;                  // poco sopra il pavimento, cosi' non finiscono sotto i comandi
const Z1 = 3.42;                    // quota del primo piano

// ------------------------------------------------------------------ punti di vista
// p = posizione degli occhi, look = punto inquadrato all'arrivo (coordinate Blender, metri)
const NODES = [
  { id: 'ingresso', name: 'Ingresso', floor: 0, p: [3.0, 0.75, EYE], look: [1.0, 4.2, 1.6] },
  { id: 'venere', name: 'La Nascita di Venere', floor: 0, p: [2.55, 2.8, EYE], look: [0, 2.8, 1.85] },
  { id: 'piedi-scala', name: 'Verso la scala', floor: 0, p: [2.6, 4.35, EYE], look: [2.45, 9.5, 3.3] },
  { id: 'scala', name: 'Sulla scala', floor: 0.5, p: [2.45, 6.9, 1.44 + EYE], look: [2.2, 10.05, 4.6] },
  { id: 'pianerottolo', name: 'Il pianerottolo dei poster', floor: 0.5, p: [2.0, 9.02, 2.88 + EYE], look: [1.9, 10.05, 4.85] },
  { id: 'arrivo', name: 'Arrivo al primo piano', floor: 1, p: [1.35, 7.75, Z1 + EYE], look: [1.6, 0, Z1 + 1.2] },
  { id: 'primavera', name: 'La Primavera', floor: 1, p: [2.45, 4.5, Z1 + EYE], look: [0, 4.55, Z1 + 1.95] },
  { id: 'vetrata', name: 'La vetrata sulla strada', floor: 1, p: [1.9, 1.75, Z1 + EYE], look: [1.85, -2, Z1 + 1.2] },
  { id: 'passaggio', name: 'Passaggio tra le sale', floor: 1, p: [3.95, 1.55, Z1 + EYE], look: [6.4, 8.0, Z1 + 1.3] },
  { id: 'divanetto', name: 'La sala del divanetto', floor: 1, p: [5.45, 4.3, Z1 + EYE], look: [8.4, 4.4, Z1 + 1.0] },
  { id: 'cassette', name: 'Il muro di cassette', floor: 1, p: [5.95, 5.5, Z1 + EYE], look: [6.3, 8.3, Z1 + 1.45] },
  { id: 'vetrata-2', name: 'La seconda vetrata', floor: 1, p: [6.2, 1.7, Z1 + EYE], look: [6.3, -2, Z1 + 1.1] },
];
const EDGES = [
  ['ingresso', 'venere'], ['venere', 'piedi-scala'], ['piedi-scala', 'scala'],
  ['scala', 'pianerottolo'], ['pianerottolo', 'arrivo'], ['arrivo', 'primavera'], ['primavera', 'vetrata'],
  ['primavera', 'passaggio'], ['vetrata', 'passaggio'], ['passaggio', 'divanetto'], ['passaggio', 'vetrata-2'],
  ['divanetto', 'cassette'], ['divanetto', 'vetrata-2'],
];
// passaggi intermedi per i tratti che girano (scala a U)
const VIA = {
  'pianerottolo>arrivo': [[1.45, 9.35, 2.88 + EYE], [1.35, 8.75, 3.06 + EYE]],
  'scala>pianerottolo': [[2.45, 8.6, 2.7 + EYE]],
  'primavera>passaggio': [[2.6, 2.05, Z1 + EYE]],   // gira attorno al divisorio tra le sale
  'divanetto>vetrata-2': [[6.25, 3.1, Z1 + EYE]],   // lascia spazio alla pianta
};
const FLOORS = [{ label: 'Piano terra', value: 0 }, { label: 'Primo piano', value: 1 }];
const floorOf = (n) => (n.floor >= 1 ? 1 : 0);
const floorLabel = (n) => (n.floor === 0.5 ? 'Scala' : FLOORS[floorOf(n)].label);

const byId = Object.fromEntries(NODES.map((n, i) => [n.id, i]));
const NEIGH = NODES.map(() => []);
for (const [a, b] of EDGES) { NEIGH[byId[a]].push(byId[b]); NEIGH[byId[b]].push(byId[a]); }
for (const n of NODES) { n.pos = B(...n.p); n.lookAt = B(...n.look); n.floorY = n.pos.y - EYE; }

// ------------------------------------------------------------------ DOM
const $ = (id) => document.getElementById(id);
const root = $('tour');
const canvas = $('view');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
} catch (e) {
  $('nogl').hidden = false;
  root.classList.remove('is-loading');
  throw e;
}
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.AgXToneMapping;
renderer.toneMappingExposure = 1.0;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a0f0f);
const camera = new THREE.PerspectiveCamera(68, 1, 0.05, 80);
camera.rotation.order = 'YXZ';

// ------------------------------------------------------------------ stato vista
const view = { yaw: 0, pitch: 0, fov: 68, index: 0, moving: false };
let dirty = true;
const yawTo = (from, to) => Math.atan2(-(to.x - from.x), -(to.z - from.z));
const pitchTo = (from, to) => Math.atan2(to.y - from.y, Math.hypot(to.x - from.x, to.z - from.z));
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
const curatedPitch = (i) => Math.max(-0.5, Math.min(0.35, pitchTo(NODES[i].pos, NODES[i].lookAt) + TILT));
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

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

function resize() {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / Math.max(1, h);
  applyCamera();
}
window.addEventListener('resize', resize);

// ------------------------------------------------------------------ frecce sul pavimento
const arrowGroup = new THREE.Group();
arrowGroup.renderOrder = 10;
scene.add(arrowGroup);
const chevron = new THREE.Shape([
  new THREE.Vector2(0, 0.30), new THREE.Vector2(0.36, -0.05), new THREE.Vector2(0.25, -0.17),
  new THREE.Vector2(0, 0.07), new THREE.Vector2(-0.25, -0.17), new THREE.Vector2(-0.36, -0.05),
]);
const chevronGeo = new THREE.ShapeGeometry(chevron);
chevronGeo.rotateX(-Math.PI / 2);
const hitGeo = new THREE.CircleGeometry(0.42, 24).rotateX(-Math.PI / 2);
const arrowMat = () => new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.88, depthTest: false, depthWrite: false, toneMapped: false });
const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35, depthTest: false, depthWrite: false });
const hitMat = new THREE.MeshBasicMaterial({ visible: false });
let arrows = [];
const labelBox = $('labels');

function buildArrows() {
  arrowGroup.clear();
  arrows = [];
  labelBox.replaceChildren();
  const n = NODES[view.index];
  for (const j of NEIGH[view.index]) {
    const m = NODES[j];
    const d = new THREE.Vector3(m.pos.x - n.pos.x, 0, m.pos.z - n.pos.z).normalize();
    const g = new THREE.Group();
    const dist = Math.min(ARROW_DIST, 0.85 * Math.hypot(m.pos.x - n.pos.x, m.pos.z - n.pos.z));
    g.position.set(n.pos.x + d.x * dist, n.floorY + ARROW_H, n.pos.z + d.z * dist);
    g.rotation.y = Math.atan2(-d.x, -d.z);
    g.scale.setScalar(1.3);
    g.userData.base = 1.3;
    const sh = new THREE.Mesh(chevronGeo, shadowMat);
    sh.scale.setScalar(1.12); sh.position.y = -0.005; sh.renderOrder = 10;
    const ar = new THREE.Mesh(chevronGeo, arrowMat()); ar.renderOrder = 11;
    const hit = new THREE.Mesh(hitGeo, hitMat);
    hit.userData.target = j;
    g.add(sh, ar, hit);
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
const status = { glb: 0, maps: 0 };
function progress() {
  const p = Math.round((status.glb * 0.85 + status.maps * 0.15) * 100);
  $('bar-fill').style.width = p + '%';
  $('loader-pct').textContent = p + '%';
}

async function load() {
  const meta = await fetch('assets/lightmaps.json').then((r) => r.json());
  const tl = new THREE.TextureLoader();
  const maps = {};
  let done = 0;
  await Promise.all(Object.entries(meta.maps).map(([key, file]) => new Promise((res, rej) => {
    tl.load('assets/' + file, (t) => {
      t.flipY = false; t.colorSpace = THREE.SRGBColorSpace; t.channel = 1;
      t.generateMipmaps = false; t.minFilter = THREE.LinearFilter; t.magFilter = THREE.LinearFilter;
      maps[key] = t; status.maps = ++done / Object.keys(meta.maps).length; progress(); res();
    }, undefined, rej);
  })));
  const gltf = await new GLTFLoader().loadAsync(window.TOUR_MODEL || 'assets/toasteria.glb', (e) => {
    if (e.total) { status.glb = e.loaded / e.total; progress(); }
  });
  const intensity = Math.PI * meta.lmax;
  const cache = new Map();
  const glass = new THREE.MeshBasicMaterial({ color: 0xdfe9ec, transparent: true, opacity: 0.12, depthWrite: false, side: THREE.DoubleSide });
  const ALPHA = /leaf|weave|railing|balcony/i;
  gltf.scene.traverse((o) => {
    if (!o.isMesh) return;
    const key = o.userData.lightmap || o.parent?.userData?.lightmap;
    const lm = key ? maps[key] : null;
    const conv = (std) => {
      const id = std.uuid + (key || '');
      if (cache.has(id)) return cache.get(id);
      let m;
      if (std.name.startsWith('GLASS')) m = glass;
      else if (std.name.startsWith('EMIT')) {
        m = new THREE.MeshBasicMaterial({ map: std.map, color: std.map ? 0xffffff : std.emissive.clone().multiplyScalar(1.0), toneMapped: false });
        if (!std.map) m.color.copy(std.color);
      } else {
        m = new THREE.MeshBasicMaterial({ map: std.map, color: std.color, lightMap: lm, lightMapIntensity: intensity });
        if (ALPHA.test(std.name) || std.alphaTest > 0 || std.transparent) {
          m.alphaTest = 0.5; m.transparent = false; m.side = THREE.DoubleSide;
        }
      }
      m.name = std.name;
      cache.set(id, m);
      return m;
    };
    o.material = Array.isArray(o.material) ? o.material.map(conv) : conv(o.material);
    o.matrixAutoUpdate = false; o.updateMatrix();
  });
  scene.add(gltf.scene);
  floorMeshes = [];
  gltf.scene.traverse((o) => { if (o.isMesh) floorMeshes.push(o); });
}
let floorMeshes = [];

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

function travel(to, { curated = false } = {}) {
  if (view.moving || to === view.index) return;
  const from = view.index;
  const neighbour = NEIGH[from].includes(to);
  hideHint();
  if (!neighbour || reduceMotion) return teleport(to, curated || !neighbour);
  const pts = pathBetween(from, to);
  const seg = []; let L = 0;
  for (let i = 1; i < pts.length; i++) { const l = pts[i].distanceTo(pts[i - 1]); seg.push(l); L += l; }
  const dur = clamp(L / 1.9, 0.8, 2.6) * 1000;
  const yaw0 = view.yaw, pitch0 = view.pitch;
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
    applyCamera();
    if (t < 1) requestAnimationFrame(step);
    else arrive(to);
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
function pick(ev) {
  const r = canvas.getBoundingClientRect();
  ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  const hits = ray.intersectObjects(arrows.map((a) => a.hit), false);
  return hits.length ? hits[0].object.userData.target : null;
}
function setHover(t) {
  if (t === hover) return;
  hover = t;
  for (const a of arrows) {
    const on = a.target === t;
    a.group.scale.setScalar(on ? 1.55 : 1.3);
    a.group.userData.mat.opacity = on ? 1 : 0.88;
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
  const r = canvas.getBoundingClientRect();
  ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ndc, camera);
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
    const d = new THREE.Vector3(NODES[j].pos.x - n.pos.x, 0, NODES[j].pos.z - n.pos.z).normalize();
    const c = d.dot(f);
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
const svgNS = 'http://www.w3.org/2000/svg';
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
  if (floorOf(cur) === mapFloor || (cur.floor === 0.5)) {
    const c = document.createElementNS(svgNS, 'path');
    const [x, y] = cur.p, R = 1.6, h = THREE.MathUtils.degToRad(camera.fov * camera.aspect) / 2 || 0.7;
    const dir = Math.PI / 2 + view.yaw;            // yaw 0 = verso il fondo (y+)
    const a1 = dir - Math.min(h, 1.2), a2 = dir + Math.min(h, 1.2);
    c.setAttribute('d', `M${x},${-y} L${x + R * Math.cos(a1)},${-(y + R * Math.sin(a1))} A${R},${R} 0 0 1 ${x + R * Math.cos(a2)},${-(y + R * Math.sin(a2))} Z`);
    c.setAttribute('class', 'cone'); svg.appendChild(c);
    mapCone = c;
  } else mapCone = null;
  NODES.forEach((n, i) => {
    if (floorOf(n) !== mapFloor && !(n.floor === 0.5 && mapFloor === 0 && n.id === 'scala') && !(n.floor === 0.5 && mapFloor === 1 && n.id === 'pianerottolo')) return;
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
let mapCone = null;
function updateCone() {
  if (!mapCone) return;
  const cur = NODES[view.index];
  const [x, y] = cur.p, R = 1.6, h = Math.min(1.2, THREE.MathUtils.degToRad(camera.fov * camera.aspect) / 2);
  const dir = Math.PI / 2 + view.yaw;
  const a1 = dir - h, a2 = dir + h;
  mapCone.setAttribute('d', `M${x},${-y} L${x + R * Math.cos(a1)},${-(y + R * Math.sin(a1))} A${R},${R} 0 0 1 ${x + R * Math.cos(a2)},${-(y + R * Math.sin(a2))} Z`);
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
  if (dirty) {
    renderer.render(scene, camera);
    placeLabels();
    updateCone();
    dirty = false;
  }
  requestAnimationFrame(loop);
}

(async () => {
  resize();
  try {
    await load();
  } catch (e) {
    console.error(e);
    $('loader-pct').textContent = 'Non riesco a caricare il modello 3D.';
    return;
  }
  const start = byId[new URLSearchParams(location.search).get('punto')] ?? 0;
  view.index = start;
  camera.position.copy(NODES[start].pos);
  view.yaw = yawTo(NODES[start].pos, NODES[start].lookAt);
  view.pitch = curatedPitch(start);
  applyCamera();
  arrive(start);
  renderer.compile(scene, camera);
  root.classList.remove('is-loading');
  loop();
})();
