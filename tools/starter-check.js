#!/usr/bin/env node
// Uses the Perla Starter screen the way a site owner would: build, build again, undo, build.
// The site (WP_URL) needs the theme and the plugin active. It is left with the site built.
const { chromium } = require('playwright');

const BASE = process.env.WP_URL || 'http://localhost:8080';
const results = [];
const ok = (name, pass, detail = '') => { results.push(pass); console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`); };

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1400, height: 1000 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(String(error).slice(0, 160)));

  await page.goto(`${BASE}/wp-login.php`);
  await page.fill('#user_login', process.env.WP_USER || 'admin');
  await page.fill('#user_pass', process.env.WP_PASSWORD || 'admin');
  await Promise.all([page.waitForNavigation(), page.click('#wp-submit')]);

  const api = async path => {
    const nonce = (await (await page.request.get(`${BASE}/wp-admin/admin-ajax.php?action=rest-nonce`)).text()).trim();
    const [route, query] = path.split('?');
    return (await page.request.get(`${BASE}/?rest_route=/${route}${query ? '&' + query : ''}`, { headers: { 'X-WP-Nonce': nonce } })).json();
  };
  const screen = `${BASE}/wp-admin/themes.php?page=perla-starter`;
  const state = async () => {
    const pages = await api('wp/v2/pages?per_page=100&status=publish&_fields=id,slug,parent');
    const media = await api('wp/v2/media?per_page=100&_fields=id');
    const posts = await api('wp/v2/posts?per_page=100&_fields=id');
    const menus = await api('wp/v2/navigation?per_page=100&_fields=id');
    const settings = await api('wp/v2/settings');
    return { pages: pages.length, slugs: pages.map(p => p.slug), media: media.length, posts: posts.length, menus: menus.length, front: settings.show_on_front, home: settings.page_on_front, blog: settings.page_for_posts };
  };
  const send = async (method, route, data) => {
    const nonce = (await (await page.request.get(`${BASE}/wp-admin/admin-ajax.php?action=rest-nonce`)).text()).trim();
    return (await page.request.fetch(`${BASE}/?rest_route=/${route}`, { method, headers: { 'X-WP-Nonce': nonce }, data })).json();
  };
  const MENU = 'Home | About | Treatments | First visit | Journal | Contact';
  const UNDO = 'Remove what the starter created';
  const shownMenu = async () => {
    await front.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    return front.evaluate(() => [...document.querySelectorAll('header .wp-block-navigation__container > li > a, header .wp-block-navigation__container > li > button')].map(a => a.textContent.trim()).filter(Boolean).join(' | '));
  };
  const press = async (label, untick = []) => {
    await page.goto(screen, { waitUntil: 'domcontentloaded' });
    for (const name of untick) await page.uncheck(`input[name="${name}"]`);
    await Promise.all([page.waitForNavigation({ timeout: 180000 }), page.click(`input[type=submit][value="${label}"]`)]);
    return (await page.locator('.notice-success').first().textContent().catch(() => '')).trim().replace(/\s+/g, ' ');
  };

  // A site that was already built is taken apart first, so the test always starts from the same place.
  await page.goto(screen, { waitUntil: 'domcontentloaded' });
  if (await page.locator(`input[type=submit][value="${UNDO}"]`).count()) await press(UNDO);

  // A site is normally looked at before the starter runs, and WordPress then makes a menu of its own.
  const front = await context.newPage();
  await front.goto(`${BASE}/`, { waitUntil: 'networkidle' });

  const start = await state();
  await page.goto(screen, { waitUntil: 'domcontentloaded' });
  const rows = await page.locator('table.widefat tbody tr').count();
  const toCreate = await page.locator('table.widefat tbody tr', { hasText: 'Will be created' }).count();
  ok('the screen lists the pages before anything is done', rows >= 17 && toCreate === rows, `${rows} pages, ${toCreate} to create`);
  if (process.env.SHOT) await page.screenshot({ path: process.env.SHOT, fullPage: true });

  const notice = await press('Build the site');
  const built = await state();
  ok('one click builds the site', built.pages === start.pages + rows && built.posts === start.posts + 3 && built.menus === start.menus + 1, `${notice} | pages ${start.pages} → ${built.pages}, articles ${start.posts} → ${built.posts}, photos in the library ${built.media}`);
  ok('Home is the front page and Journal the posts page', built.front === 'page' && built.home > 0 && built.blog > 0, `show_on_front ${built.front}`);

  const response = await front.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  const seen = await front.evaluate(() => {
    const hero = document.querySelector('main .wp-block-post-content .perla-hero img');
    return { fromPage: !!document.querySelector('main .wp-block-post-content .perla-hero'), sections: document.querySelectorAll('main .wp-block-post-content > .alignfull').length, src: hero ? hero.getAttribute('src') : '', cls: hero ? hero.className : '', srcset: hero ? !!hero.getAttribute('srcset') : false, menu: [...document.querySelectorAll('header .wp-block-navigation__container > li > a, header .wp-block-navigation__container > li > button')].map(a => a.textContent.trim()).filter(Boolean) };
  });
  ok('the front page shows the Home page that was created', response.status() === 200 && seen.fromPage && seen.sections === 11, `${seen.sections} sections`);
  ok('photographs come from the Media Library', /wp-content\/uploads\//.test(seen.src) && /wp-image-\d+/.test(seen.cls) && seen.srcset, seen.src.replace(BASE, ''));
  ok('the header shows the menu made by the starter', seen.menu.join(' | ') === 'Home | About | Treatments | First visit | Journal | Contact', seen.menu.join(' | '));
  const broken = [];
  for (const slug of ['about', 'team', 'reviews', 'services', 'services/dental-implants', 'prices', 'first-visit', 'faq', 'blog', 'contact', 'terms']) {
    const r = await front.goto(`${BASE}/${slug}/`, { waitUntil: 'domcontentloaded' });
    if (r.status() !== 200) broken.push(`${slug} ${r.status()}`);
  }
  ok('every page of the menu and of the buttons answers', broken.length === 0, broken.join(', '));

  await page.goto(`${BASE}/wp-admin/post.php?post=${built.home}&action=edit`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForFunction(() => window.wp && wp.data && wp.data.select('core/block-editor') && wp.data.select('core/block-editor').getBlockCount() > 0, null, { timeout: 120000 });
  await page.waitForTimeout(4000);
  const editor = await page.evaluate(() => {
    const sel = wp.data.select('core/block-editor'); const all = [];
    const walk = ids => ids.forEach(id => { all.push(sel.getBlock(id)); walk(sel.getBlockOrder(id)); });
    walk(sel.getBlockOrder());
    return { blocks: all.length, invalid: all.filter(b => b && !b.isValid).length, patterns: all.filter(b => b && b.name === 'core/pattern').length, withId: all.filter(b => b && b.name === 'core/image' && b.attributes.id).length };
  });
  ok('the Home page opens in the editor as ordinary, valid blocks', editor.blocks > 200 && editor.invalid === 0 && editor.patterns === 0, `${editor.blocks} blocks, ${editor.invalid} invalid, ${editor.withId} images linked to the library`);

  await press('Build the site');
  const again = await state();
  ok('a second click creates nothing twice', again.pages === built.pages && again.posts === built.posts && again.media === built.media && again.menus === built.menus, `pages ${again.pages}, articles ${again.posts}, photos ${again.media}`);

  const undone = await press('Remove what the starter created');
  const after = await state();
  ok('undo puts everything in the trash and restores the homepage settings', after.pages === start.pages && after.posts === start.posts && after.menus === start.menus && after.front === start.front, `${undone.slice(0, 60)}… | pages ${after.pages}, show_on_front ${after.front}`);
  await front.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  const fallback = await front.evaluate(() => ({ hero: !!document.querySelector('main > .perla-hero'), sections: document.querySelectorAll('main > .alignfull').length }));
  ok('without a Home page the theme shows its ready-made home again', fallback.hero && fallback.sections === 11, `${fallback.sections} sections`);

  // The owner already has a menu, for example the one another theme or demo left behind.
  const own = await send('POST', 'wp/v2/navigation', { title: 'Our own menu', status: 'publish', content: '<!-- wp:navigation-link {"label":"Our own link","url":"/","kind":"custom"} /-->' });
  await press('Build the site');
  const mixed = await state();
  const shown = await shownMenu();
  ok('with a menu of the owner in place the starter still makes its menu and the header shows it', mixed.menus === start.menus + 2 && shown === MENU, `menus ${start.menus} → ${mixed.menus} | the header shows: ${shown}`);

  const homePage = await api(`wp/v2/pages/${mixed.home}?context=edit&_fields=content`);
  const hrefs = [...homePage.content.raw.matchAll(/href="([^"]*)"/g)].map(match => match[1]);
  const dead = hrefs.filter(href => href === '#' || href === '');
  ok('the links inside the Home page lead to the pages that were made', hrefs.length > 10 && dead.length === 0, `${hrefs.length} links, ${dead.length} leading nowhere`);
  await press(UNDO);

  await press('Build the site', ['perla_starter_menu']);
  const plain = await state();
  const kept = await shownMenu();
  ok('with the menu box unticked no menu is made', plain.menus === start.menus + 1 && kept === 'Our own link', `menus ${plain.menus} | the header shows: ${kept}`);
  await press(UNDO);
  await send('DELETE', `wp/v2/navigation/${own.id}&force=true`);

  await press('Build the site');
  const rebuilt = await state();
  await front.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  const menuAgain = await front.evaluate(() => [...document.querySelectorAll('header .wp-block-navigation__container > li > a, header .wp-block-navigation__container > li > button')].map(a => a.textContent.trim()).filter(Boolean).join(' | '));
  ok('building again after an undo works and reuses the photographs', rebuilt.pages === built.pages && rebuilt.media === built.media && rebuilt.front === 'page' && menuAgain === 'Home | About | Treatments | First visit | Journal | Contact', `pages ${rebuilt.pages}, photos ${rebuilt.media}, menu ${menuAgain}`);
  ok('no JavaScript errors in the admin', errors.length === 0, errors.join(' | '));

  await browser.close();
  console.log(`\n${results.filter(Boolean).length} / ${results.length} passed`);
  process.exit(results.every(Boolean) ? 0 : 1);
})().catch(error => { console.error(`Check failed: ${String(error).slice(0, 400)}`); process.exit(1); });
