#!/usr/bin/env node
// Uses the Dimora Starter screen the way a site owner would: build, build again, undo, build next to a page
// and a menu of the owner, undo, build. The site (WP_URL) needs the theme and the plugin active.
// It may start empty or already built. It is left built, and what the test put in the trash is deleted for good.
const { chromium } = require('playwright');

const BASE = process.env.WP_URL || 'http://localhost:8090';
const results = [];
const ok = (name, pass, detail = '') => { results.push(!!pass); console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`); };

// What the starter has to make: title, address and the pattern the page is built from.
const PAGES = [
  ['Home', '/home/', 'dimora/page-home'],
  ['Projects', '/projects/', 'dimora/page-projects'],
  ['Canal House', '/projects/canal-house/', 'dimora/page-project-canal-house'],
  ['Northlight Loft', '/projects/northlight-loft/', 'dimora/page-project-northlight-loft'],
  ['The Orchard', '/projects/the-orchard/', 'dimora/page-project-the-orchard'],
  ['Casa Arenal', '/projects/casa-arenal/', 'dimora/page-project-casa-arenal'],
  ['The Reading Rooms', '/projects/reading-rooms/', 'dimora/page-project-reading-rooms'],
  ['Atelier Café', '/projects/atelier-cafe/', 'dimora/page-project-atelier-cafe'],
  ['Studio', '/studio/', 'dimora/page-studio'],
  ['Services', '/services/', 'dimora/page-services'],
  ['Journal', '/journal/', ''],
  ['Contact', '/contact/', 'dimora/page-contact'],
  ['Terms', '/terms/', ''],
].map(([title, address, pattern]) => { const path = address.split('/').filter(Boolean); return { title, address, pattern, slug: path.pop(), parent: path.pop() || '' }; });
const MENU = ['Projects', 'Studio', 'Services', 'Journal', 'Contact'];
const ARTICLE = 'How to choose a white that isn’t cold';
// The one h1 a visitor has to find on each address.
const HEADINGS = { '/': 'Homes with a quiet kind of character.', '/projects/': 'Projects', '/projects/canal-house/': 'Canal House', '/journal/': 'Notes on living well' };
const SECTIONS = 9; // sections of the Home page
const BUILD = 'Build the site';
const UNDO = 'Remove what the starter created';
const OWN_TEXT = '<!-- wp:paragraph -->\n<p>Our own page about the studio.</p>\n<!-- /wp:paragraph -->';
const OWN_MENU = '<!-- wp:navigation-link {"label":"Our own link","url":"/","kind":"custom"} /-->';

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

  const nonce = (await (await page.request.get(`${BASE}/wp-admin/admin-ajax.php?action=rest-nonce`)).text()).trim();
  const api = async (path, method = 'GET', data) => {
    const [route, query] = path.split('?');
    const response = await page.request.fetch(`${BASE}/?rest_route=/${route}${query ? '&' + query : ''}`, { method, data, headers: { 'X-WP-Nonce': nonce } });
    if (!response.ok()) throw new Error(`${method} ${path} answered ${response.status()}`);
    return response.json();
  };
  const screen = `${BASE}/wp-admin/themes.php?page=dimora-starter`;
  const state = async () => {
    const pages = await api('wp/v2/pages?per_page=100&status=publish&context=edit&_fields=id,slug,parent,template,link,title,content');
    const posts = await api('wp/v2/posts?per_page=100&status=publish&context=edit&_fields=id,slug,link,title,content,categories,featured_media');
    const menus = await api('wp/v2/navigation?per_page=100&status=publish&context=edit&_fields=id,title,content');
    const media = await api('wp/v2/media?per_page=100&_fields=id,source_url');
    const settings = await api('wp/v2/settings');
    return { pages, posts, menus, media: new Map(media.map(item => [item.id, item.source_url])), front: settings.show_on_front, home: settings.page_on_front, blog: settings.page_for_posts, reading: `${settings.show_on_front} ${settings.page_on_front} ${settings.page_for_posts}` };
  };
  const trash = async () => {
    const found = [];
    for (const type of ['pages', 'posts', 'navigation']) for (const item of await api(`wp/v2/${type}?per_page=100&status=trash&_fields=id`)) found.push(`${type}/${item.id}`);
    return found;
  };
  const ids = list => list.map(item => item.id).sort((a, b) => a - b).join();
  const fresh = (now, before) => now.filter(item => !before.some(old => old.id === item.id));
  const bare = menu => menu.content.raw.trim() === '<!-- wp:page-list /-->';
  const isBuilt = async () => { await page.goto(screen, { waitUntil: 'domcontentloaded' }); return (await page.locator(`input[type=submit][value="${UNDO}"]`).count()) > 0; };
  const listed = () => page.locator('table.widefat tbody tr').evaluateAll(rows => rows.map(row => [...row.cells].map(cell => cell.textContent.trim())));
  const press = async label => {
    await page.goto(screen, { waitUntil: 'domcontentloaded' });
    await Promise.all([page.waitForNavigation({ timeout: 180000 }), page.click(`input[type=submit][value="${label}"]`)]);
    const text = async selector => (await page.locator(selector).allTextContents()).join(' ').trim().replace(/\s+/g, ' ');
    return { done: await text('.wrap .notice-success'), kept: await text('.wrap .notice-info') };
  };
  const front = await context.newPage();
  const visit = async path => {
    const response = await front.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded' });
    const seen = await front.evaluate(() => {
      const hero = document.querySelector('main .dimora-hero img');
      return {
        h1: [...document.querySelectorAll('h1')].map(h => h.textContent.trim().replace(/\s+/g, ' ')).join(' / '),
        menu: [...document.querySelectorAll('header .wp-block-navigation__container > li')].map(li => li.textContent.trim().replace(/\s+/g, ' ')).join(' | '),
        fromPage: document.querySelectorAll('main .wp-block-post-content > .alignfull').length,
        fromTheme: document.querySelectorAll('main > .alignfull').length,
        heroInPage: !!document.querySelector('main .wp-block-post-content > .dimora-hero'),
        heroInTheme: !!document.querySelector('main > .dimora-hero'),
        src: hero ? hero.getAttribute('src') : '', cls: hero ? hero.className : '', srcset: hero ? !!hero.getAttribute('srcset') : false,
      };
    });
    return { status: response.status(), ...seen };
  };
  // The stored pages, read as text: blocks, no pattern left, photographs tied to their copy in the Media Library.
  const inspect = (bySlug, media) => {
    const flaws = []; const photos = new Set(); let blocks = 0, drawings = 0;
    for (const wanted of PAGES) {
      const raw = bySlug[wanted.slug] ? bySlug[wanted.slug].content.raw.trim() : null;
      if (raw === null) { flaws.push(`${wanted.slug} is missing`); continue; }
      blocks += (raw.match(/<!-- wp:/g) || []).length;
      if (wanted.slug === 'journal') { if (raw) flaws.push('journal, the page of the articles, has content'); continue; }
      if (!wanted.pattern) { if (!/^<!-- wp:paragraph -->\s*<p>[^<]+<\/p>\s*<!-- \/wp:paragraph -->$/.test(raw)) flaws.push(`${wanted.slug} is not one paragraph`); continue; }
      if (!/<!-- wp:group /.test(raw)) flaws.push(`${wanted.slug} has no blocks`);
      if (/<!-- wp:pattern/.test(raw)) flaws.push(`${wanted.slug} still holds wp:pattern`);
      if (/assets\/images\/[^"]+\.jpg/.test(raw)) flaws.push(`${wanted.slug} shows a photograph from the theme folder`);
      const images = [...raw.matchAll(/<!-- wp:image (\{.*?\}) -->([\s\S]*?)<!-- \/wp:image -->/g)];
      if (images.length !== (raw.match(/<!-- wp:image /g) || []).length) flaws.push(`${wanted.slug} has an image block that cannot be read`);
      for (const [, json, html] of images) {
        const src = (html.match(/<img[^>]*\ssrc="([^"]*)"/) || [])[1] || '';
        // The portrait placeholder is a drawing: WordPress takes no SVG uploads, so it stays in the theme.
        if (/\/themes\/dimora\/assets\/images\/[a-z0-9-]+\.svg$/.test(src)) { drawings += 1; continue; }
        const id = JSON.parse(json).id;
        const cls = Number((html.match(/<img[^>]*\sclass="[^"]*\bwp-image-(\d+)/) || [])[1]);
        if (!id || id !== cls || media.get(id) !== src || !/\/wp-content\/uploads\//.test(src)) flaws.push(`${wanted.slug}: ${src.split('/').pop() || 'an image'} is not tied to the Media Library (id ${id}, class wp-image-${cls})`);
        else photos.add(id);
      }
    }
    return { flaws, photos: [...photos].sort((a, b) => a - b).join(), count: photos.size, blocks, drawings };
  };
  const menuOf = menu => {
    const raw = menu ? menu.content.raw : '';
    return { links: [...raw.matchAll(/<!-- wp:navigation-link (\{.*?\}) \/-->/g)].map(found => JSON.parse(found[1])), rest: raw.replace(/<!-- wp:navigation-link \{.*?\} \/-->/g, '').trim() };
  };
  const index = pages => Object.fromEntries(pages.map(item => [item.slug, item]));

  const own = { page: 0, menu: 0 };
  const trashAtStart = await trash();
  let failure = null;

  try {
    const wasBuilt = await isBuilt();
    if (wasBuilt) await press(UNDO);
    // A site is normally looked at before the starter runs, and WordPress then makes a menu of its own.
    await visit('/');

    const start = await state();
    await page.goto(screen, { waitUntil: 'domcontentloaded' });
    let rows = await listed();
    const wanted = PAGES.map(item => `${item.title} ${item.address}`);
    const unlisted = wanted.filter((line, i) => !rows[i] || `${rows[i][0]} ${rows[i][1]}` !== line);
    ok('the screen lists the 13 pages, the six projects under /projects/, before anything is done', rows.length === 13 && unlisted.length === 0 && rows.every(row => row[2] === 'Will be created'), `${rows.length} pages, ${rows.filter(row => row[2] === 'Will be created').length} to create${unlisted.length ? ', not as expected: ' + unlisted.join('; ') : ''}${wasBuilt ? ' (the site was built: undone first)' : ''}`);
    if (process.env.SHOT) await page.screenshot({ path: process.env.SHOT, fullPage: true });

    let notice = await press(BUILD);
    const built = await state();
    const made = { pages: fresh(built.pages, start.pages), posts: fresh(built.posts, start.posts), menus: fresh(built.menus, start.menus) };
    const bySlug = index(made.pages);
    ok('one click builds the site', /Done: 13 pages and 3 articles are in place\./.test(notice.done) && !notice.kept && made.pages.length === 13 && made.posts.length === 3 && made.menus.length === 1, `${notice.done} | pages ${start.pages.length} → ${built.pages.length}, articles ${start.posts.length} → ${built.posts.length}, menus ${start.menus.length} → ${built.menus.length}, photos in the library ${built.media.size}`);

    const misplaced = PAGES.filter(item => { const got = bySlug[item.slug]; return !got || got.title.raw !== item.title || got.parent !== (item.parent ? (bySlug[item.parent] || {}).id : 0) || (item.slug !== 'home' && got.link !== `${BASE}${item.address}`); }).map(item => item.address);
    ok('every page has its title and address, the six projects as children of Projects', misplaced.length === 0, misplaced.length ? `wrong: ${misplaced.join(', ')}` : PAGES.filter(item => item.parent).map(item => item.slug).join(', '));

    const stored = inspect(bySlug, built.media);
    ok('the pages hold real blocks: no wp:pattern left, every photograph a Media Library copy with its wp-image class', stored.flaws.length === 0 && stored.count > 30, stored.flaws.slice(0, 4).join('; ') || `${stored.blocks} block comments, ${stored.count} photographs, ${stored.drawings} image blocks keep the SVG placeholder of the theme`);

    const templates = PAGES.filter(item => (bySlug[item.slug] || {}).template !== (item.parent ? 'page-no-title' : '')).map(item => `${item.slug} "${(bySlug[item.slug] || {}).template}"`);
    ok('the six project pages use the template "page-no-title", the other pages the default one', templates.length === 0, templates.join(', ') || PAGES.filter(item => item.parent).length + ' project pages');

    const menu = menuOf(made.menus[0]);
    const linked = menu.links.every((link, i) => { const target = bySlug[(MENU[i] || '').toLowerCase()]; return target && link.id === target.id && link.url === target.link; });
    ok('a menu with exactly Projects, Studio, Services, Journal, Contact is made, although WordPress had made its own "Navigation"', made.menus.length === 1 && menu.links.map(link => link.label).join(' | ') === MENU.join(' | ') && menu.rest === '' && linked && start.menus.some(bare) && start.menus.every(bare), `${menu.links.map(link => link.label).join(' | ')}${linked ? '' : ' (a link does not point at its page)'}${menu.rest ? ' and more: ' + menu.rest.slice(0, 80) : ''} | menus before: ${start.menus.map(item => `"${item.title.raw}"${bare(item) ? ' (only the page list)' : ''}`).join(', ') || 'none'}`);

    const notes = (await api('wp/v2/categories?per_page=100&_fields=id,name')).find(category => category.name === 'Notes');
    const complete = made.posts.filter(post => /dimora-journal-\d/.test(built.media.get(post.featured_media) || '') && notes && post.categories.join() === String(notes.id));
    ok('three articles, each with its featured image, in the category "Notes"', made.posts.length === 3 && complete.length === 3, made.posts.map(post => `${post.slug} (${(built.media.get(post.featured_media) || 'no image').split('/').pop()})`).join(', '));
    ok('Home is the front page and Journal the posts page', built.front === 'page' && bySlug.home && built.home === bySlug.home.id && bySlug.journal && built.blog === bySlug.journal.id, `show_on_front ${built.front}, front page ${built.home}, posts page ${built.blog}`);

    const article = made.posts.find(post => post.title.raw === ARTICLE);
    const expected = { ...HEADINGS, [article ? article.link.replace(BASE, '') : '/?p=0']: ARTICLE };
    const seen = {};
    for (const path of Object.keys(expected)) seen[path] = await visit(path);
    const wrong = Object.keys(expected).filter(path => seen[path].status !== 200 || seen[path].h1 !== expected[path]).map(path => `${path} ${seen[path].status} "${seen[path].h1}"`);
    ok('the home, Projects, a project, the Journal and an article answer 200 and show their h1', wrong.length === 0, wrong.join(', ') || Object.keys(expected).map(path => `${path} "${expected[path]}"`).join(', '));
    const home = seen['/'];
    ok('the front page shows the Home page that was created', home.heroInPage && home.fromPage === SECTIONS, `${home.fromPage} sections`);
    ok('photographs come from the Media Library', /wp-content\/uploads\//.test(home.src) && /wp-image-\d+/.test(home.cls) && home.srcset, home.src.replace(BASE, ''));
    ok('the header shows the menu made by the starter', home.menu === MENU.join(' | '), home.menu);
    const broken = [];
    for (const address of [...PAGES.map(item => item.address), ...made.posts.map(post => post.link.replace(BASE, ''))]) {
      const answer = await page.request.get(`${BASE}${address}`);
      if (answer.status() !== 200) broken.push(`${address} ${answer.status()}`);
    }
    ok('every page and every article answers', broken.length === 0, broken.join(', ') || `${PAGES.length} pages, ${made.posts.length} articles`);

    await page.goto(`${BASE}/wp-admin/post.php?post=${built.home}&action=edit`, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForFunction(() => window.wp && wp.data && wp.data.select('core/block-editor') && wp.data.select('core/block-editor').getBlockCount() > 0, null, { timeout: 120000 });
    await page.waitForTimeout(2000);
    const editor = await page.evaluate(async things => {
      const sel = wp.data.select('core/block-editor'); const open = [];
      const walk = list => list.forEach(id => { open.push(sel.getBlock(id)); walk(sel.getBlockOrder(id)); });
      walk(sel.getBlockOrder());
      const patterns = await wp.apiFetch({ path: '/wp/v2/block-patterns/patterns' });
      const read = content => {
        const names = []; let bad = 0;
        const go = list => list.forEach(block => { names.push(block.name); if (!block.isValid || ['core/missing', 'core/pattern', 'core/freeform'].includes(block.name)) bad += 1; go(block.innerBlocks); });
        go(wp.blocks.parse(content || ''));
        return { names: names.join(' '), count: names.length, bad };
      };
      const flaws = []; let blocks = 0;
      for (const thing of things) {
        const mine = read(thing.content); blocks += mine.count;
        if (mine.bad) flaws.push(`${thing.name}: ${mine.bad} blocks are not valid, ordinary blocks`);
        if (!thing.pattern) continue;
        const pattern = patterns.find(item => item.name === thing.pattern);
        const theirs = read(pattern ? pattern.content : '');
        if (!pattern || mine.names !== theirs.names) flaws.push(`${thing.name}: ${mine.count} blocks, the pattern ${thing.pattern} has ${theirs.count}`);
      }
      return { open: open.length, invalid: open.filter(block => block && !block.isValid).length, patterns: open.filter(block => block && block.name === 'core/pattern').length, withId: open.filter(block => block && block.name === 'core/image' && block.attributes.id).length, blocks, flaws };
    }, [...PAGES.filter(item => bySlug[item.slug]).map(item => ({ name: item.slug, pattern: item.pattern, content: bySlug[item.slug].content.raw })), ...made.posts.map(post => ({ name: post.slug, content: post.content.raw }))]);
    ok('the Home page opens in the editor as ordinary, valid blocks', editor.open > 200 && editor.invalid === 0 && editor.patterns === 0 && editor.withId > 0, `${editor.open} blocks, ${editor.invalid} invalid, ${editor.withId} images linked to the library`);
    ok('every page holds the same blocks as its pattern and every block of the pages and articles is valid', editor.flaws.length === 0, editor.flaws.slice(0, 4).join('; ') || `${editor.blocks} blocks in ${made.pages.length} pages and ${made.posts.length} articles`);

    notice = await press(BUILD);
    const again = await state();
    ok('a second click creates nothing twice and re-uses the photographs', ids(again.pages) === ids(built.pages) && ids(again.posts) === ids(built.posts) && ids(again.menus) === ids(built.menus) && [...again.media.keys()].join() === [...built.media.keys()].join() && again.reading === built.reading && !notice.kept && /Done: 13 pages and 3 articles/.test(notice.done), `pages ${again.pages.length}, articles ${again.posts.length}, menus ${again.menus.length}, photos ${again.media.size} | ${notice.done}${notice.kept ? ' | ' + notice.kept : ''}`);

    const undone = await press(UNDO);
    rows = await listed();
    const after = await state();
    let binned = await trash();
    const lost = [...made.pages.map(item => `pages/${item.id}`), ...made.posts.map(item => `posts/${item.id}`), ...made.menus.map(item => `navigation/${item.id}`)].filter(id => !binned.includes(id));
    ok('"Remove what the starter created" puts every page, the articles and the menu in the trash and restores the reading settings', lost.length === 0 && ids(after.pages) === ids(start.pages) && ids(after.posts) === ids(start.posts) && ids(after.menus) === ids(start.menus) && after.reading === start.reading && after.media.size === built.media.size && rows.every(row => row[2] === 'Will be created') && !(await isBuilt()), `${undone.done.slice(0, 60)}… | ${17 - lost.length} of 17 in the trash, pages ${after.pages.length}, articles ${after.posts.length}, menus ${after.menus.length}, reading "${after.reading}" (was "${start.reading}"), photos kept ${after.media.size}`);
    const fallback = await visit('/');
    ok('without a Home page the theme shows its ready-made home again', fallback.status === 200 && fallback.heroInTheme && fallback.fromTheme === SECTIONS && fallback.h1 === HEADINGS['/'], `${fallback.fromTheme} sections`);

    // The owner already has a Studio page and a menu of their own.
    own.page = (await api('wp/v2/pages', 'POST', { title: 'Studio', slug: 'studio', status: 'publish', content: OWN_TEXT })).id;
    own.menu = (await api('wp/v2/navigation', 'POST', { title: 'Our own menu', status: 'publish', content: OWN_MENU })).id;
    await page.goto(screen, { waitUntil: 'domcontentloaded' });
    rows = await listed();
    const kept = rows.filter(row => row[2] === 'Exists, will be kept').map(row => row[0]).join();
    notice = await press(BUILD);
    const mixed = await state();
    const mine = mixed.pages.find(item => item.id === own.page);
    const others = fresh(mixed.pages, start.pages).filter(item => item.id !== own.page);
    ok('a page that already has the address is kept as it is and reported', kept === 'Studio' && rows.filter(row => row[2] === 'Will be created').length === 12 && /Done: 12 pages and 3 articles/.test(notice.done) && /left as they are: Studio\./.test(notice.kept) && mine && mine.content.raw === OWN_TEXT && mine.slug === 'studio' && others.length === 12 && mixed.pages.filter(item => /^studio/.test(item.slug)).length === 1, `screen: "${kept}" exists, will be kept | ${notice.done} | ${notice.kept} | pages made ${others.length}`);
    const ownMenu = await visit('/');
    ok('no menu is made when the owner already has a real one', ids(mixed.menus) === ids([...start.menus, { id: own.menu }]) && ownMenu.menu === 'Our own link', `menus ${mixed.menus.map(item => `"${item.title.raw}"`).join(', ')} | the header shows: ${ownMenu.menu}`);
    await press(UNDO);
    const spared = await state();
    binned = await trash();
    ok('the undo leaves the page and the menu of the owner where they are', ids(spared.pages) === ids([...start.pages, { id: own.page }]) && ids(spared.menus) === ids([...start.menus, { id: own.menu }]) && !binned.includes(`pages/${own.page}`) && !binned.includes(`navigation/${own.menu}`) && spared.reading === start.reading, `pages ${spared.pages.length}, menus ${spared.menus.length}, reading "${spared.reading}"`);
    await api(`wp/v2/pages/${own.page}?force=true`, 'DELETE'); own.page = 0;
    await api(`wp/v2/navigation/${own.menu}?force=true`, 'DELETE'); own.menu = 0;

    notice = await press(BUILD);
    const rebuilt = await state();
    const remade = index(fresh(rebuilt.pages, start.pages));
    const restored = inspect(remade, rebuilt.media);
    const last = await visit('/');
    ok('building again after an undo gives the whole site back and re-uses the photographs', /Done: 13 pages and 3 articles/.test(notice.done) && !notice.kept && rebuilt.pages.length === built.pages.length && rebuilt.posts.length === built.posts.length && rebuilt.menus.length === built.menus.length && [...rebuilt.media.keys()].join() === [...built.media.keys()].join() && restored.flaws.length === 0 && restored.photos === stored.photos && rebuilt.front === 'page' && remade.home && rebuilt.home === remade.home.id && rebuilt.blog === remade.journal.id && last.menu === MENU.join(' | ') && last.fromPage === SECTIONS, `${restored.flaws.slice(0, 3).join('; ') || notice.done} | pages ${rebuilt.pages.length}, articles ${rebuilt.posts.length}, menus ${rebuilt.menus.length}, photos ${rebuilt.media.size}, front page ${rebuilt.home}, menu ${last.menu}`);
    ok('no JavaScript errors in the admin', errors.length === 0, errors.join(' | '));
  } catch (error) {
    failure = error;
  }

  // Whatever happened above: nothing of the owner made up by the test stays, the site is built, the trash is as it was.
  try {
    if (own.page || own.menu) {
      if (await isBuilt()) await press(UNDO);
      if (own.page) await api(`wp/v2/pages/${own.page}?force=true`, 'DELETE');
      if (own.menu) await api(`wp/v2/navigation/${own.menu}?force=true`, 'DELETE');
    }
    if (!(await isBuilt())) await press(BUILD);
    const added = (await trash()).filter(id => !trashAtStart.includes(id));
    for (const id of added) await api(`wp/v2/${id}?force=true`, 'DELETE');
    const end = await state();
    const left = (await trash()).filter(id => !trashAtStart.includes(id));
    const whole = index(end.pages);
    ok('the site is left built and the trash as it was', left.length === 0 && PAGES.every(item => whole[item.slug]) && end.front === 'page' && whole.home && end.home === whole.home.id && (await isBuilt()), `${added.length} trashed items of the test deleted for good | pages ${end.pages.length}, articles ${end.posts.length}, menus ${end.menus.length}, front page ${end.home}, posts page ${end.blog}`);
  } catch (error) {
    failure = failure || error;
  }

  await browser.close();
  if (failure) throw failure;
  console.log(`\n${results.filter(Boolean).length} / ${results.length} passed`);
  process.exit(results.every(Boolean) ? 0 : 1);
})().catch(error => { console.error(`Check failed: ${String(error).slice(0, 400)}`); process.exit(1); });
