// Checks the scroll animations of the block theme on the local site.
const { chromium } = require('playwright');
const BASE = process.env.WP_URL || 'http://localhost:8080';
const results = [];
const ok = (name, pass, detail = '') => { results.push(pass); console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`); };

const hiddenCount = page => page.evaluate(() => {
  const els = [...document.querySelectorAll('.perla-reveal, .perla-stagger > *, .perla-image, .perla-pop')];
  const hidden = els.filter(e => parseFloat(getComputedStyle(e).opacity) < 0.99);
  const words = [...document.querySelectorAll('.perla-split .perla-word > span')].filter(e => { const t = getComputedStyle(e).transform; return t !== 'none' && t !== 'matrix(1, 0, 0, 1, 0, 0)'; });
  return { total: els.length, hidden: hidden.length, words: document.querySelectorAll('.perla-word').length, wordsMoving: words.length, sample: hidden.slice(0, 3).map(e => e.className.toString().slice(0, 60)) };
});

(async () => {
  const browser = await chromium.launch();

  // 1. Normal visitor with a mouse.
  let context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  let page = await context.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)); });
  page.on('pageerror', e => errors.push('PAGEERROR ' + String(e).slice(0, 160)));
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const state = await page.evaluate(() => ({ cls: document.documentElement.className, lenis: !!window.Lenis }));
  ok('motion starts (perla-motion + perla-ready on <html>)', /perla-motion/.test(state.cls) && /perla-ready/.test(state.cls), state.cls);
  ok('smooth scrolling is active with a mouse', /lenis/.test(state.cls) && state.lenis, state.cls);
  await page.waitForTimeout(1800);
  const top = await page.evaluate(() => { const h = document.querySelector('.perla-hero h1'); const r = h.getBoundingClientRect(); const firstWord = h.querySelector('.perla-word > span'); return { text: h.textContent, words: h.querySelectorAll('.perla-word').length, transform: getComputedStyle(firstWord).transform, visible: r.top < innerHeight }; });
  ok('hero title is split in words and has arrived', top.words >= 6 && (top.transform === 'none' || top.transform === 'matrix(1, 0, 0, 1, 0, 0)'), `${top.words} words, "${top.text}"`);
  const before = await hiddenCount(page);
  ok('sections further down wait hidden', before.hidden > 20, `${before.hidden} of ${before.total} pieces still hidden at the top`);
  const numberBefore = await page.evaluate(() => [...document.querySelectorAll('.perla-number')].map(e => e.textContent).join(' | '));

  // wheel scrolling through the whole page
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.mouse.move(700, 450);
  await page.mouse.wheel(0, 320); await page.waitForTimeout(900);
  const shrink = await page.evaluate(() => ({ y: Math.round(window.scrollY), v: getComputedStyle(document.querySelector('main > .perla-hero')).getPropertyValue('--perla-shrink'), tr: getComputedStyle(document.querySelector('main > .perla-hero')).transform }));
  ok('hero shrinks while it scrolls away', parseFloat(shrink.v) > 0.1 && shrink.tr !== 'none', `scrollY ${shrink.y}, shrink ${shrink.v}, ${shrink.tr}`);
  ok('wheel scrolling moves the page', shrink.y > 150, `scrollY ${shrink.y}`);
  const mid = await page.evaluate(() => [...document.querySelectorAll('.perla-number')].map(e => e.textContent).join(' | '));
  for (let y = 0; y < height; y += 400) { await page.mouse.wheel(0, 400); await page.waitForTimeout(260); }
  await page.waitForTimeout(2500);
  const after = await hiddenCount(page);
  ok('after scrolling to the end nothing is left hidden', after.hidden === 0 && after.wordsMoving === 0, `${after.hidden} hidden, ${after.wordsMoving} words still moving, ${after.words} words in all ${after.sample.join(' ; ')}`);
  const numberAfter = await page.evaluate(() => [...document.querySelectorAll('.perla-number')].map(e => e.textContent).join(' | '));
  ok('figures end on the written value', numberAfter === numberBefore, `${numberAfter}  (while counting: ${mid})`);
  const bottom = await page.evaluate(() => Math.round(window.scrollY + innerHeight) >= document.documentElement.scrollHeight - 4);
  ok('the page can be scrolled to the very end', bottom);
  ok('no JavaScript errors', errors.length === 0, errors.join(' | '));

  // anchor link with smooth scrolling
  await page.goto(BASE + '/services/dental-implants/', { waitUntil: 'networkidle' });
  await page.click('a[href="#prices"]'); await page.waitForTimeout(1800);
  const anchor = await page.evaluate(() => ({ top: Math.round(document.getElementById('prices').getBoundingClientRect().top), hash: location.hash }));
  ok('"See prices" scrolls to the price table', Math.abs(anchor.top) < 120 && anchor.hash === '#prices', `top ${anchor.top}px, ${anchor.hash}`);
  await context.close();

  // 2. Keyboard: skip link and focus ring.
  context = await browser.newContext({ viewport: { width: 1440, height: 900 } }); page = await context.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.keyboard.press('Tab');
  const skip = await page.evaluate(() => ({ cls: document.activeElement.className, text: document.activeElement.textContent.trim() }));
  ok('first Tab lands on the skip link', /skip-link/.test(skip.cls), skip.text);
  await page.keyboard.press('Tab'); await page.keyboard.press('Tab');
  const ring = await page.evaluate(() => { const e = document.activeElement; const c = getComputedStyle(e); return { tag: e.tagName, text: e.textContent.trim().slice(0, 30), outline: `${c.outlineStyle} ${c.outlineWidth} ${c.outlineColor}` }; });
  ok('focused links show an outline', /solid/.test(ring.outline) && !/ 0px/.test(ring.outline), `${ring.tag} "${ring.text}" ${ring.outline}`);
  await context.close();

  // 3. Reduced motion.
  context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }); page = await context.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const reduced = await page.evaluate(() => document.documentElement.className);
  const reducedHidden = await hiddenCount(page);
  ok('reduced motion: no animation, no smooth scrolling, everything visible', !/perla-motion|lenis/.test(reduced) && reducedHidden.hidden === 0, `<html class="${reduced}">`);
  await context.close();

  // 4. No JavaScript.
  context = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false }); page = await context.newPage();
  await page.goto(BASE + '/', { waitUntil: 'load' });
  const noJs = await hiddenCount(page);
  ok('without JavaScript everything is visible', noJs.hidden === 0, `${noJs.total} pieces`);
  await context.close();

  // 5. motion.js never arrives.
  context = await browser.newContext({ viewport: { width: 1440, height: 900 } }); page = await context.newPage();
  await page.route('**/assets/js/motion.js*', route => route.abort());
  await page.goto(BASE + '/', { waitUntil: 'load' });
  const early = await page.evaluate(() => document.documentElement.className);
  await page.waitForTimeout(4600);
  const late = await page.evaluate(() => document.documentElement.className);
  const lateHidden = await hiddenCount(page);
  ok('if the script fails to load, the page shows itself after 4 seconds', /perla-motion/.test(early) && !/perla-motion/.test(late) && lateHidden.hidden === 0, `before: "${early}" after: "${late}"`);
  await context.close();

  // 6. Touch device: animations yes, smooth scrolling no.
  context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true }); page = await context.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const touch = await page.evaluate(() => ({ cls: document.documentElement.className, fine: matchMedia('(pointer: fine)').matches }));
  ok('phones keep their own scrolling', /perla-ready/.test(touch.cls) && !/lenis/.test(touch.cls), `<html class="${touch.cls}"> pointer fine: ${touch.fine}`);
  await context.close();

  await browser.close();
  console.log(`\n${results.filter(Boolean).length} / ${results.length} passed`);
  process.exit(results.every(Boolean) ? 0 : 1);
})().catch(e => { console.error('FAILED', String(e).slice(0, 400)); process.exit(1); });
