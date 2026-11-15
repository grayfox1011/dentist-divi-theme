#!/usr/bin/env node
// Animations, pinned rail, marquee, header, pointer effects and the fallbacks, on a running site (WP_URL to choose it).
const { chromium } = require('playwright');
const BASE = process.env.WP_URL || 'http://localhost:8090';
const VIEW = { width: 1440, height: 900 };
const results = [];
const ok = (name, pass, detail = '') => { results.push(!!pass); console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`); };

// Runs before the page's own scripts: notes when a class lands on <html> and whether <body> existed yet.
const watchHtml = () => {
  const log = window.__dimoraHtml = [];
  let before = [];
  new MutationObserver(() => {
    if (!document.documentElement) return;
    const now = [...document.documentElement.classList];
    const note = (c, on) => log.push({ c, on, t: Math.round(performance.now()), body: !!document.body });
    now.filter(c => !before.includes(c)).forEach(c => note(c, true));
    before.filter(c => !now.includes(c)).forEach(c => note(c, false));
    before = now;
  }).observe(document, { attributes: true, attributeFilter: ['class'], subtree: true });
};

// Pieces the animation styles still hide, and pieces still waiting for "is-in".
const hiddenCount = page => page.evaluate(() => {
  const css = e => getComputedStyle(e), all = s => [...document.querySelectorAll(s)];
  const hidden = [
    ...all('.dimora-reveal, .dimora-stagger > *').filter(e => parseFloat(css(e).opacity) < 0.99),
    ...all('.dimora-image').filter(e => css(e).clipPath !== 'none'),
    ...all('.dimora-split').filter(e => css(e).visibility !== 'visible'),
    ...all('.dimora-word > span').filter(e => css(e).translate !== 'none'),
  ];
  return {
    total: all('.dimora-reveal, .dimora-stagger > *, .dimora-image, .dimora-split').length,
    hidden: hidden.length,
    waiting: all('.dimora-reveal, .dimora-stagger, .dimora-split, .dimora-image, .dimora-number').filter(e => !e.classList.contains('is-in')).length,
    sample: hidden.slice(0, 3).map(e => (e.className.toString() || e.tagName).slice(0, 40)).join(' ; '),
  };
});

// Lenis eases the wheel: wait until the page stops moving.
const settle = async page => {
  let last = null;
  for (let i = 0; i < 50; i++) { const y = await page.evaluate(() => window.scrollY); if (y === last) break; last = y; await page.waitForTimeout(130); }
  return Math.round(last);
};

const wordmark = page => page.evaluate(() => {
  const mark = document.querySelector('.dimora-wordmark'), range = document.createRange();
  range.selectNodeContents(mark);
  const text = range.getBoundingClientRect().width;
  return { fitted: mark.classList.contains('is-fitted'), text: Math.round(text), box: mark.clientWidth, fits: mark.classList.contains('is-fitted') && Math.abs(text / mark.clientWidth - 1) <= 0.03 };
});

const railState = page => page.evaluate(() => {
  const rail = document.querySelector('.dimora-rail'), pin = rail.querySelector('.dimora-rail-pin'), track = rail.querySelector('.dimora-rail-track');
  return { pinned: rail.classList.contains('is-pinned'), height: rail.offsetHeight, pin: pin.offsetHeight, sticky: getComputedStyle(pin).position, view: innerHeight, width: document.documentElement.clientWidth, cards: track.children.length, card: track.lastElementChild.offsetWidth, overflow: getComputedStyle(track).overflowX, scroll: track.scrollWidth, client: track.clientWidth };
});

(async () => {
  const browser = await chromium.launch();

  // 1. Visitor with a mouse, 1440x900. Console errors and failed requests are collected on every page seen here.
  let context = await browser.newContext({ viewport: VIEW });
  let page = await context.newPage();
  const problems = [], seen = [];
  const at = () => page.url().replace(BASE, '');
  page.on('console', m => { if (m.type() === 'error') problems.push(`${at()} console: ${m.text().slice(0, 120)}`); });
  page.on('pageerror', e => problems.push(`${at()} error: ${String(e).slice(0, 120)}`));
  page.on('requestfailed', r => problems.push(`${at()} failed: ${r.url().replace(BASE, '')} ${(r.failure() || {}).errorText || ''}`));
  page.on('response', r => { if (r.status() >= 400) problems.push(`${at()} ${r.status()}: ${r.url().replace(BASE, '')}`); });
  const open = async path => { seen.push(path); await page.goto(BASE + path, { waitUntil: 'networkidle' }); };
  await page.addInitScript(watchHtml);
  await open('/');

  const start = await page.evaluate(() => ({ cls: document.documentElement.className, log: window.__dimoraHtml, paint: Math.round((performance.getEntriesByType('paint')[0] || {}).startTime || 0) }));
  const added = start.log.find(l => l.c === 'dimora-motion' && l.on) || {};
  const ready = start.log.find(l => l.c === 'dimora-ready' && l.on) || {};
  ok('"dimora-motion" is on <html> before the first paint', added.body === false && (!start.paint || added.t <= start.paint), `set at ${added.t} ms with no <body> yet, first paint at ${start.paint} ms`);
  ok('motion.js adds "dimora-ready"', /dimora-motion/.test(start.cls) && /dimora-ready/.test(start.cls), `at ${ready.t} ms, <html class="${start.cls}">`);
  ok('fine pointer: "dimora-fine" and Lenis ("lenis") on <html>', /dimora-fine/.test(start.cls) && /(^| )lenis( |$)/.test(start.cls), start.cls);

  // What waits further down, read before any scrolling.
  const top = await page.evaluate(() => {
    const css = e => getComputedStyle(e), all = (s, scope = document) => [...scope.querySelectorAll(s)];
    const titles = all('.dimora-split').map(title => {
      const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT), words = all('.dimora-word', title);
      let loose = 0, line = -1, y = null;
      while (walker.nextNode()) { const n = walker.currentNode; if (n.nodeValue.trim() && !n.parentElement.parentElement.classList.contains('dimora-word')) loose++; }
      const lines = words.map(w => { if (w.offsetTop !== y) { y = w.offsetTop; line++; } return Math.min(line, 6); }).join('');
      const given = words.map(w => w.firstElementChild ? w.firstElementChild.style.getPropertyValue('--dimora-l') : '?').join('');
      const sunk = words.filter(w => { const s = w.firstElementChild; return css(s).translate === '0px 115%' && s.getBoundingClientRect().top >= w.getBoundingClientRect().top + s.offsetHeight; }).length;
      return { in: title.classList.contains('is-in'), text: title.textContent.trim().slice(0, 28), words: words.length, loose, bare: words.filter(w => w.children.length !== 1 || w.firstElementChild.tagName !== 'SPAN').length, lines, given, sunk };
    });
    const groups = all('.dimora-stagger').map(g => ({ in: g.classList.contains('is-in'), n: g.children.length, numbered: [...g.children].every((c, i) => c.style.getPropertyValue('--dimora-i') === String(Math.min(i, 10))), dark: [...g.children].filter(c => css(c).opacity === '0').length }));
    const reveals = all('.dimora-reveal').map(e => ({ in: e.classList.contains('is-in'), dark: css(e).opacity === '0' }));
    const images = all('.dimora-image').map(e => ({ in: e.classList.contains('is-in'), clip: css(e).clipPath }));
    return { titles, groups, reveals, images };
  });
  const sum = (list, f) => list.reduce((n, x) => n + f(x), 0);
  const waiting = { titles: top.titles.filter(t => !t.in), groups: top.groups.filter(g => !g.in), reveals: top.reveals.filter(r => !r.in), images: top.images.filter(i => !i.in) };
  const badTitles = top.titles.filter(t => !t.words || t.loose || t.bare || t.given !== t.lines);
  ok('titles: every word sits in .dimora-word > span with its line number --dimora-l', top.titles.length > 0 && !badTitles.length, `${top.titles.length} titles, ${sum(top.titles, t => t.words)} words${badTitles.slice(0, 2).map(t => ` ; "${t.text}" has ${t.given}, lines are ${t.lines}, ${t.loose} loose`).join('')}`);
  ok('titles: the words wait below their mask until "is-in"', waiting.titles.length > 0 && waiting.titles.every(t => t.sunk === t.words), `${waiting.titles.length} titles waiting, ${sum(waiting.titles, t => t.sunk)} of ${sum(waiting.titles, t => t.words)} words moved down 115%`);
  ok('reveal and stagger pieces wait at opacity 0 until "is-in"', waiting.reveals.length > 0 && waiting.groups.length > 0 && waiting.reveals.every(r => r.dark) && waiting.groups.every(g => g.dark === g.n), `${waiting.reveals.filter(r => r.dark).length} of ${waiting.reveals.length} reveals, ${sum(waiting.groups, g => g.dark)} of ${sum(waiting.groups, g => g.n)} stagger children`);
  ok('stagger children carry --dimora-i 0, 1, 2…', top.groups.length > 0 && top.groups.every(g => g.numbered), `${top.groups.filter(g => g.numbered).length} of ${top.groups.length} groups`);
  ok('images wait behind a clip-path until "is-in"', waiting.images.length > 0 && waiting.images.every(i => /^inset\(0px 0px 100%/.test(i.clip)), `${waiting.images.length} of ${top.images.length} waiting: ${waiting.images.map(i => i.clip).join(', ')}`);

  await page.waitForTimeout(2300);
  const firstScreen = await page.evaluate(() => {
    const css = e => getComputedStyle(e), all = s => [...document.querySelectorAll(s)];
    const late = [...all('.dimora-reveal.is-in, .dimora-stagger.is-in > *').filter(e => css(e).opacity !== '1'), ...all('.dimora-split.is-in .dimora-word > span').filter(e => css(e).translate !== 'none'), ...all('.dimora-image.is-in').filter(e => css(e).clipPath !== 'none')];
    return { shown: all('.is-in').length, late: late.length };
  });
  ok('pieces on the first screen get "is-in" and show themselves', firstScreen.shown > 0 && firstScreen.late === 0, `${firstScreen.shown} with "is-in", ${firstScreen.late} not arrived after 2.3 s`);

  // One wheel trip down the home page; a frame-by-frame log is kept inside the page.
  const original = await page.evaluate(async () => { const doc = new DOMParser().parseFromString(await (await fetch(location.href)).text(), 'text/html'); return [...doc.querySelectorAll('.dimora-number')].map(e => e.textContent); });
  const rail = await railState(page);
  await page.evaluate(() => {
    const rail = document.querySelector('.dimora-rail'), pin = rail.querySelector('.dimora-rail-pin'), track = rail.querySelector('.dimora-rail-track');
    const numbers = [...document.querySelectorAll('.dimora-number')], drift = [...document.querySelectorAll('.dimora-parallax')];
    const log = window.__dimoraLog = { rail: [], numbers: numbers.map(() => []), drift: drift.map(() => []) };
    (function tick() {
      const r = rail.getBoundingClientRect();
      log.rail.push([+r.top.toFixed(1), +r.bottom.toFixed(1), +pin.getBoundingClientRect().top.toFixed(1), new DOMMatrix(getComputedStyle(track).transform).m41, parseFloat(rail.style.getPropertyValue('--dimora-rail') || 0), +track.firstElementChild.getBoundingClientRect().left.toFixed(1), +track.lastElementChild.getBoundingClientRect().right.toFixed(1)]);
      numbers.forEach((n, i) => { const seq = log.numbers[i]; if (seq[seq.length - 1] !== n.textContent) seq.push(n.textContent); });
      drift.forEach((d, i) => { const seq = log.drift[i], p = d.style.getPropertyValue('--dimora-p'); if (p !== '' && seq[seq.length - 1] !== p) seq.push(p); });
      requestAnimationFrame(tick);
    })();
  });
  await page.mouse.move(700, 450);
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 240) { await page.mouse.wheel(0, 240); await page.waitForTimeout(110); }
  await settle(page);
  await page.waitForTimeout(2600);
  const log = await page.evaluate(() => ({ ...window.__dimoraLog, bottom: Math.ceil(scrollY + innerHeight) >= document.documentElement.scrollHeight - 2, y: Math.round(scrollY) }));
  const end = await hiddenCount(page);
  ok('wheel scrolling reaches the end of the page and nothing is left hidden', log.bottom && end.hidden === 0 && end.waiting === 0, `scrollY ${log.y}, ${end.hidden} of ${end.total} hidden, ${end.waiting} without "is-in" ${end.sample}`);

  const counted = log.numbers.map((seq, i) => { const n = seq.slice(1).map(parseFloat); return seq.length > 3 && seq[0] === original[i] && seq[seq.length - 1] === original[i] && n[0] < n[n.length - 1] && n.every((v, j) => j === 0 || v >= n[j - 1]); });
  ok('figures count up and end on the written text', original.length > 0 && counted.every(Boolean), log.numbers.map((seq, i) => `"${original[i]}": ${seq.slice(1, 4).join(' ')} … ${seq[seq.length - 1]} (${seq.length - 1} steps)`).join(' | '));

  const drift = log.drift.map(seq => seq.map(parseFloat));
  ok('parallax: --dimora-p follows the scroll between -1 and 1', drift.length > 0 && drift.every(v => new Set(v).size >= 3 && v.every((p, i) => p >= -1 && p <= 1 && (i === 0 || p <= v[i - 1]))), drift.map(v => `${v[0]} → ${v[v.length - 1]} in ${v.length} steps`).join(' | '));

  // The rail, frame by frame: [rail top, rail bottom, pin top, track x, --dimora-rail, first card left, last card right].
  const distance = rail.height - rail.pin;
  const inside = log.rail.filter(f => f[0] < -2 && f[1] > rail.view + 2);
  const pinTops = inside.map(f => f[2]), xs = inside.map(f => f[3]), ps = log.rail.map(f => f[4]);
  const before = log.rail.find(f => f[0] > 0) || [], after = log.rail.find(f => f[4] === 1) || [];
  const gaps = { start: before[5], end: +(rail.width - after[6]).toFixed(1) };
  ok('rail at 1440x900: pinned and taller than the screen', rail.pinned && rail.sticky === 'sticky' && rail.pin === rail.view && distance > 0, `rail ${rail.height}px, pin ${rail.pin}px, ${distance}px of sideways travel for ${rail.cards} cards`);
  ok('rail: the pin stays stuck while the track moves left', inside.length > 5 && pinTops.every(t => Math.abs(t) <= 1) && xs.every((x, i) => i === 0 || x <= xs[i - 1] + 0.5) && xs[xs.length - 1] < xs[0] - 100, `${inside.length} frames, pin top ${Math.min(...pinTops)}…${Math.max(...pinTops)}px, track x ${xs[0]} → ${xs[xs.length - 1]}px`);
  ok('rail: --dimora-rail goes from 0 to 1', ps[0] === 0 && Math.max(...ps) === 1 && ps.every((p, i) => p >= 0 && p <= 1 && (i === 0 || p >= ps[i - 1])) && Math.abs(Math.min(...log.rail.map(f => f[3])) + distance) <= 1, `${ps[0]} → ${Math.max(...ps)}, track ends at ${Math.min(...log.rail.map(f => f[3]))}px for ${distance}px of travel`);
  ok('rail: the last card ends inside the screen, with the gap the first card started with', after[6] <= rail.width && after[6] - rail.card >= 0 && Math.abs(gaps.end - gaps.start) <= 2, `last card ${(after[6] - rail.card).toFixed(1)}…${after[6]}px of ${rail.width}px, gap ${gaps.end}px at the end, ${gaps.start}px at the start`);

  // Marquee: the pointer is parked in a corner first, because hovering pauses it.
  const band = page.locator('.dimora-marquee').first();
  await band.evaluate(e => e.scrollIntoView({ block: 'center' }));
  await settle(page);
  await page.mouse.move(5, 5);
  const marquee = await band.evaluate(e => {
    const items = [...e.querySelectorAll('.dimora-marquee-item')], copies = items.slice(1), count = (list, s) => list.reduce((n, i) => n + i.querySelectorAll(s).length, 0);
    return { live: e.classList.contains('is-live'), items: items.length, firstHidden: !!items[0] && items[0].hasAttribute('aria-hidden'), hidden: copies.filter(i => i.getAttribute('aria-hidden') === 'true').length, links: count(copies, 'a'), off: count(copies, 'a[tabindex="-1"]'), own: count(items.slice(0, 1), 'a:not([tabindex])'), width: (e.querySelector('.dimora-marquee-track') || e).scrollWidth, view: innerWidth };
  });
  ok('marquee: "is-live", copies hidden from screen readers and from the Tab key', marquee.live && marquee.items >= 2 && marquee.items % 2 === 0 && !marquee.firstHidden && marquee.hidden === marquee.items - 1 && marquee.links > 0 && marquee.off === marquee.links && marquee.own > 0 && marquee.width >= marquee.view * 2, `${marquee.items} items (${marquee.width}px for a ${marquee.view}px screen), ${marquee.hidden} aria-hidden, ${marquee.off} of ${marquee.links} copied links with tabindex -1`);
  const moving = async () => {
    const read = () => band.evaluate(e => { const c = getComputedStyle(e.querySelector('.dimora-marquee-track')); return { x: new DOMMatrix(c.transform).m41, state: c.animationPlayState, name: c.animationName }; });
    await page.waitForTimeout(200); const a = await read(); await page.waitForTimeout(400); const b = await read();
    return { state: b.state, name: b.name, by: +(b.x - a.x).toFixed(1) };
  };
  const running = await moving();
  const bandBox = await band.boundingBox();
  await page.mouse.move(bandBox.x + bandBox.width / 2, bandBox.y + bandBox.height / 2, { steps: 3 });
  const paused = await moving();
  await page.mouse.move(5, 5, { steps: 3 });
  const resumed = await moving();
  ok('marquee: the track runs, pauses under the pointer and runs again', running.name === 'dimora-marquee' && running.state === 'running' && running.by !== 0 && paused.state === 'paused' && paused.by === 0 && resumed.state === 'running' && resumed.by !== 0, `${running.by}px in 0.4 s, ${paused.state} ${paused.by}px, ${resumed.state} ${resumed.by}px`);

  // Keyboard: Tab from the last stop before the rail through every card.
  await page.evaluate(() => {
    const first = document.querySelector('.dimora-rail-track a[href]');
    const stops = [...document.querySelectorAll('a[href], button, input, select, textarea, summary')].filter(e => e.tabIndex >= 0 && e.getClientRects().length);
    stops[stops.indexOf(first) - 1].focus({ preventScroll: true });
  });
  const stops = [];
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(350);
    const stop = await page.evaluate(() => {
      const link = document.activeElement, track = document.querySelector('.dimora-rail-track');
      if (!track.contains(link)) return null;
      const card = link.closest('.dimora-rail-track > *'), r = card.getBoundingClientRect();
      return { card: [...track.children].indexOf(card) + 1, left: Math.round(r.left), right: Math.round(r.right), top: Math.round(r.top), bottom: Math.round(r.bottom), pin: document.querySelector('.dimora-rail-pin').scrollLeft };
    });
    if (stop) stops.push(stop); else if (stops.length) break;
  }
  const offScreen = stops.filter(s => s.left < 0 || s.right > rail.width || s.top < 0 || s.bottom > rail.view || s.pin !== 0);
  ok('rail: Tab brings each card into view, the last one too', stops.some(s => s.card === rail.cards) && !offScreen.length, stops.map(s => `card ${s.card} at ${s.left}…${s.right}px`).join(', ') + offScreen.slice(0, 2).map(s => ` ; card ${s.card} out: y ${s.top}…${s.bottom}, pin scrolled ${s.pin}px`).join(''));

  // The "View" label over a project card.
  const spot = await page.evaluate(() => { const r = [...document.querySelectorAll('.dimora-cursor')].map(e => e.getBoundingClientRect()).find(r => r.left >= 0 && r.right <= innerWidth && r.top + r.height / 2 > 100 && r.top + r.height / 2 < innerHeight); return r ? { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) } : null; });
  const label = () => page.evaluate(() => { const l = document.querySelector('.dimora-pointer'); if (!l) return {}; const r = l.getBoundingClientRect(); return { on: l.classList.contains('is-on'), text: l.textContent, opacity: +getComputedStyle(l).opacity, x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) }; });
  if (spot) { await page.mouse.move(spot.x - 30, spot.y - 30); await page.mouse.move(spot.x, spot.y, { steps: 5 }); await page.waitForTimeout(800); }
  const over = await label();
  await page.mouse.move(5, 5, { steps: 5 });
  await page.waitForTimeout(500);
  const away = await label();
  ok('pointer label "View" turns on over a project card and off again', spot && over.on && over.text === 'View' && over.opacity === 1 && Math.abs(over.x - spot.x - 56) <= 6 && Math.abs(over.y - spot.y - 56) <= 6 && away.on === false && away.opacity === 0, spot ? `pointer ${spot.x},${spot.y}: "${over.text}" is-on ${over.on}, opacity ${over.opacity}, centre ${over.x},${over.y} ; away: is-on ${away.on}, opacity ${away.opacity}` : 'no .dimora-cursor card on screen');

  // Header: back to the top, then down and up with the wheel.
  await page.evaluate(() => { document.activeElement.blur(); window.scrollTo(0, 0); });
  await settle(page);
  await page.mouse.move(700, 450);
  await page.waitForTimeout(400);
  const head = async wait => { await settle(page); await page.waitForTimeout(wait); return page.evaluate(() => { const r = document.querySelector('.wp-site-blocks > header').getBoundingClientRect(), c = document.documentElement.classList; return { y: Math.round(scrollY), scrolled: c.contains('dimora-scrolled'), away: c.contains('dimora-header-away'), top: Math.round(r.top), bottom: Math.round(r.bottom) }; }); };
  const h0 = await head(0);
  await page.mouse.wheel(0, 20); const h1 = await head(0);
  await page.mouse.wheel(0, 100); const h2 = await head(0);
  await page.mouse.wheel(0, 600); await page.waitForTimeout(90);
  const eased = Math.round(await page.evaluate(() => window.scrollY));
  const h3 = await head(900);
  await page.mouse.wheel(0, -160); const h4 = await head(900);
  ok('Lenis eases the wheel', eased > h2.y && eased < h3.y - 5 && h3.y === h2.y + 600, `${h2.y} → ${eased} after 90 ms → ${h3.y}`);
  ok('header: "dimora-scrolled" after 24px', !h0.scrolled && !h1.scrolled && h2.scrolled && h4.scrolled, `scrollY ${h0.y}: ${h0.scrolled}, ${h1.y}: ${h1.scrolled}, ${h2.y}: ${h2.scrolled}`);
  ok('header: steps away going down past 200px, comes back going up', !h2.away && h2.top === 0 && h3.away && h3.bottom <= 0 && !h4.away && h4.top === 0, `scrollY ${h2.y}: away ${h2.away} ; ${h3.y}: away ${h3.away}, header bottom at ${h3.bottom}px ; up to ${h4.y}: away ${h4.away}, header top at ${h4.top}px`);
  const mark = await wordmark(page);
  ok('footer: the wordmark is fitted to the footer width', mark.fits, `text ${mark.text}px in ${mark.box}px, is-fitted ${mark.fitted}`);

  // Project list: the picture of the row under the pointer floats next to it.
  await open('/projects/');
  const row = page.locator('.dimora-list-row').nth(2);
  await row.scrollIntoViewIfNeeded();
  await settle(page);
  const rowBox = await row.boundingBox();
  const picture = () => row.evaluate(e => { const i = e.querySelector('.dimora-list-image'), r = i.getBoundingClientRect(); return { x: e.style.getPropertyValue('--dimora-x'), y: e.style.getPropertyValue('--dimora-y'), opacity: +getComputedStyle(i).opacity, left: Math.round(r.left), right: Math.round(r.right), middle: Math.round(r.top + r.height / 2), page: document.documentElement.scrollWidth - document.documentElement.clientWidth }; });
  const idle = await picture();
  const px = Math.round(rowBox.x + rowBox.width * 0.4), py = Math.round(rowBox.y + rowBox.height / 2);
  await page.mouse.move(px - 40, py); await page.mouse.move(px, py, { steps: 4 });
  await page.waitForTimeout(900);
  const hover = await picture();
  ok('project list: the hovered row gets --dimora-x / --dimora-y and shows its picture', idle.opacity === 0 && hover.opacity === 1 && hover.x === `${Math.round(px - rowBox.x)}px` && hover.y === `${Math.round(py - rowBox.y)}px` && Math.abs(hover.left - px - 28) <= 3 && Math.abs(hover.middle - py) <= 3, `pointer ${px},${py}: --dimora-x ${hover.x}, --dimora-y ${hover.y}, picture opacity ${idle.opacity} → ${hover.opacity}, at ${hover.left}…${hover.right}px, middle ${hover.middle}px`);
  const pointer = await page.evaluate(() => ({ cls: document.documentElement.className, label: document.querySelectorAll('.dimora-pointer').length }));
  ok('project list page: "dimora-fine", "lenis" and one pointer label', /dimora-fine/.test(pointer.cls) && /(^| )lenis( |$)/.test(pointer.cls) && pointer.label === 1, pointer.cls);

  // Drawing and room slider, and the rows that open.
  await open('/services/');
  const slider = page.locator('.dimora-compare').first();
  await slider.scrollIntoViewIfNeeded();
  await settle(page);
  const sliderState = () => slider.evaluate(box => { const range = box.querySelector('input[type=range]'), handle = box.querySelector('.dimora-compare-handle'), r = box.getBoundingClientRect(); return { live: box.classList.contains('is-live'), range: !!range, label: range ? range.getAttribute('aria-label') : '', value: range ? range.value : '', images: box.querySelectorAll('.wp-block-image').length, pos: parseFloat(box.style.getPropertyValue('--dimora-pos')), handle: handle ? +((handle.getBoundingClientRect().left - r.left) / r.width * 100).toFixed(1) : null, clip: getComputedStyle(box.querySelector('.wp-block-image')).clipPath }; });
  const live = await sliderState();
  ok('compare: "is-live" with a labelled range input and a handle at 50%', live.live && live.range && !!live.label && live.images === 2 && live.pos === 50 && Math.abs(live.handle - 50) < 0.5, `label "${live.label}", --dimora-pos ${live.pos}%, handle at ${live.handle}%`);
  await slider.locator('input[type=range]').focus();
  for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowRight');
  const right = await sliderState();
  for (let i = 0; i < 12; i++) await page.keyboard.press('ArrowLeft');
  const left = await sliderState();
  ok('compare: the arrow keys move --dimora-pos', right.pos === 55 && left.pos === 43 && Math.abs(left.handle - 43) < 0.5, `50% → ${right.pos}% → ${left.pos}%, handle at ${left.handle}%, ${left.clip}`);
  await settle(page);
  const box = await slider.boundingBox();
  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.25, box.y + box.height * 0.5, { steps: 6 });
  await page.mouse.up();
  await page.waitForTimeout(100);
  const dragged = await sliderState();
  ok('compare: dragging with the mouse moves --dimora-pos', Math.abs(dragged.pos - 25) < 1 && Math.abs(dragged.handle - 25) < 1 && dragged.value === '25', `dragged to 25%: --dimora-pos ${dragged.pos}%, handle at ${dragged.handle}%, range value ${dragged.value}`);

  const details = page.locator('details.is-style-dimora-row').first();
  const rowState = () => details.evaluate(d => ({ open: d.open, height: d.offsetHeight }));
  const rows = [await rowState()];
  for (let i = 0; i < 2; i++) { await details.locator('summary').click(); await page.waitForTimeout(900); rows.push(await rowState()); }
  const tall = rows.filter(r => r.open).map(r => r.height), short = rows.filter(r => !r.open).map(r => r.height);
  ok('details rows open and close on click', rows[1].open !== rows[0].open && rows[2].open === rows[0].open && rows[2].height === rows[0].height && Math.min(...tall) > Math.max(...short) + 20, rows.map(r => `${r.open ? 'open' : 'closed'} ${r.height}px`).join(' → '));

  // The other pages: jump straight to the end, where whatever is left has to show up.
  const jumps = [];
  for (const path of ['/projects/canal-house/', '/contact/', '/journal/']) {
    await open(path);
    const early = await hiddenCount(page);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(2600);
    jumps.push({ path, early, late: await hiddenCount(page) });
  }
  ok('at the end of a page everything left gets "is-in" and shows', jumps.every(j => j.late.hidden === 0 && j.late.waiting === 0) && jumps.some(j => j.early.waiting > 0), jumps.map(j => `${j.path} ${j.early.waiting} waiting → ${j.late.waiting}, ${j.late.hidden} of ${j.late.total} hidden ${j.late.sample}`).join(' | '));
  ok('no console errors or failed requests', problems.length === 0, problems.slice(0, 4).join(' | ') || seen.join(' '));
  await context.close();

  // 2. motion.js never arrives: the class comes off after 4 seconds.
  context = await browser.newContext({ viewport: VIEW }); page = await context.newPage();
  await page.addInitScript(watchHtml);
  await page.route('**/assets/js/motion.js*', route => route.abort());
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  const blockedEarly = { cls: await page.evaluate(() => document.documentElement.className), ...(await hiddenCount(page)) };
  await page.waitForFunction(() => !document.documentElement.classList.contains('dimora-motion'), null, { timeout: 8000 }).catch(() => {});
  const blockedLate = { cls: await page.evaluate(() => document.documentElement.className), log: await page.evaluate(() => window.__dimoraHtml.filter(l => l.c === 'dimora-motion')), ...(await hiddenCount(page)) };
  const took = blockedLate.log.length === 2 ? blockedLate.log[1].t - blockedLate.log[0].t : NaN;
  ok('motion.js blocked: content waits, then the class comes off after 4 s and everything shows', /dimora-motion/.test(blockedEarly.cls) && !/dimora-ready/.test(blockedEarly.cls) && blockedEarly.hidden > 0 && !/dimora-motion/.test(blockedLate.cls) && took >= 3950 && took < 4600 && blockedLate.hidden === 0, `${blockedEarly.hidden} hidden at first, class removed after ${took} ms, then ${blockedLate.hidden} of ${blockedLate.total} hidden, <html class="${blockedLate.cls}">`);
  await context.close();

  // 3. Reduced motion.
  context = await browser.newContext({ viewport: VIEW, reducedMotion: 'reduce' }); page = await context.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const calm = { cls: await page.evaluate(() => document.documentElement.className), ...(await hiddenCount(page)), rail: await railState(page), extra: await page.evaluate(() => ({ live: document.querySelectorAll('.dimora-marquee.is-live, .dimora-marquee-track').length, words: document.querySelectorAll('.dimora-word').length, label: document.querySelectorAll('.dimora-pointer').length })) };
  ok('reduced motion: no "dimora-motion", no "lenis", nothing hidden', !/dimora-motion|dimora-fine|lenis/.test(calm.cls) && calm.total > 0 && calm.hidden === 0 && calm.extra.words === 0 && calm.extra.label === 0, `<html class="${calm.cls}">, ${calm.hidden} of ${calm.total} hidden`);
  ok('reduced motion: rail not pinned, marquee not live', !calm.rail.pinned && calm.rail.height === calm.rail.pin && calm.rail.sticky !== 'sticky' && calm.rail.scroll > calm.rail.client && calm.extra.live === 0, `rail ${calm.rail.height}px, pin ${calm.rail.sticky}, track ${calm.rail.scroll}px in ${calm.rail.client}px (${calm.rail.overflow})`);
  const calmMark = await wordmark(page);
  await page.setViewportSize({ width: 1100, height: 800 });
  await page.waitForTimeout(300);
  const smallMark = await wordmark(page);
  ok('reduced motion: the wordmark is still fitted, after a resize too', calmMark.fits && smallMark.fits, `text ${calmMark.text}px in ${calmMark.box}px, then ${smallMark.text}px in ${smallMark.box}px`);
  await context.close();

  // 4. Phone, 390x844 with touch.
  context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true }); page = await context.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const phone = { cls: await page.evaluate(() => document.documentElement.className), label: await page.evaluate(() => document.querySelectorAll('.dimora-pointer').length), rail: await railState(page) };
  ok('phone: animations run, but no "dimora-fine", no pointer label, no Lenis', /dimora-motion/.test(phone.cls) && /dimora-ready/.test(phone.cls) && !/dimora-fine|lenis/.test(phone.cls) && phone.label === 0, `<html class="${phone.cls}">`);
  const track = page.locator('.dimora-rail-track').first();
  await track.evaluate(e => e.scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(400);
  const trackBox = await track.boundingBox();
  const cdp = await context.newCDPSession(page);
  await cdp.send('Input.synthesizeScrollGesture', { x: Math.round(trackBox.x + trackBox.width / 2), y: Math.round(trackBox.y + trackBox.height / 2), xDistance: -300, yDistance: 0, speed: 1200, gestureSourceType: 'touch' });
  await page.waitForTimeout(700);
  const swiped = Math.round(await track.evaluate(e => e.scrollLeft));
  ok('rail at 390x844: not pinned, the track is swiped sideways', !phone.rail.pinned && phone.rail.sticky !== 'sticky' && phone.rail.overflow === 'auto' && phone.rail.scroll > phone.rail.client && swiped > 0, `track ${phone.rail.scroll}px in ${phone.rail.client}px, overflow-x ${phone.rail.overflow}, a 300px swipe scrolled it ${swiped}px`);
  const phoneMark = await wordmark(page);
  ok('phone: the wordmark is fitted', phoneMark.fits, `text ${phoneMark.text}px in ${phoneMark.box}px`);
  await context.close();

  // 5. No JavaScript at all.
  context = await browser.newContext({ viewport: VIEW, javaScriptEnabled: false }); page = await context.newPage();
  await page.goto(BASE + '/', { waitUntil: 'load' });
  const plain = await hiddenCount(page);
  ok('without JavaScript everything is visible', plain.total > 0 && plain.hidden === 0, `${plain.hidden} of ${plain.total} hidden`);
  await context.close();

  await browser.close();
  console.log(`\n${results.filter(Boolean).length} / ${results.length} passed`);
  process.exit(results.every(Boolean) ? 0 : 1);
})().catch(e => { console.error('FAILED', String(e).slice(0, 400)); process.exit(1); });
