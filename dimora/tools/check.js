#!/usr/bin/env node
// Parses every pattern, template, template part, page and article in the block editor of a running site
// and loads every image they point to. The site has to run this copy of the theme.
//   node tools/check.js
//   WP_URL=http://localhost:8096 node tools/check.js
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const BASE = process.env.WP_URL || 'http://localhost:8090';
const USER = process.env.WP_USER || 'admin';
const PASSWORD = process.env.WP_PASSWORD || 'admin';
// A pattern with a broken header is not registered and would go unnoticed: the site must know as many as the theme holds.
const inTheme = dir => fs.readdirSync(path.join(__dirname, '..', 'theme', 'dimora', dir)).filter(name => /\.(php|html)$/.test(name)).length;

(async () => {
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ viewport: { width: 1400, height: 900 } })).newPage();
  await page.goto(`${BASE}/wp-login.php`, { waitUntil: 'domcontentloaded' });
  await page.fill('#user_login', USER);
  await page.fill('#user_pass', PASSWORD);
  await Promise.all([page.waitForNavigation({ waitUntil: 'domcontentloaded' }), page.click('#wp-submit')]);
  await page.goto(`${BASE}/wp-admin/post-new.php?post_type=page`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForFunction(() => window.wp && wp.blocks && wp.apiFetch && wp.blocks.getBlockTypes().length > 50, null, { timeout: 120000 });

  const report = await page.evaluate(async () => {
    const version = (document.body.className.match(/version-([\d-]+)/) || [])[1];
    const get = path => wp.apiFetch({ path }).catch(error => { throw new Error(`${path}: ${error.message || error.code || JSON.stringify(error)}`); });
    const patterns = (await get('/wp/v2/block-patterns/patterns')).filter(pattern => pattern.name.startsWith('dimora/'));
    const templates = (await get('/wp/v2/templates')).filter(template => template.theme === 'dimora');
    const parts = (await get('/wp/v2/template-parts')).filter(part => part.theme === 'dimora');
    // pages made by the Dimora Starter plugin, if it has run
    const pages = (await get('/wp/v2/pages?context=edit&per_page=100&_fields=slug,content')).filter(page => page.content.raw.trim());
    const posts = await get('/wp/v2/posts?context=edit&per_page=100&_fields=slug,content');
    const things = [
      ...pages.map(page => ({ name: `page ${page.slug}`, content: page.content.raw })),
      ...posts.map(post => ({ name: `article ${post.slug}`, content: post.content.raw })),
      ...patterns.map(pattern => ({ name: `pattern ${pattern.name}`, content: pattern.content })),
      ...templates.map(template => ({ name: `template ${template.slug}`, content: template.content.raw })),
      ...parts.map(part => ({ name: `part ${part.slug}`, content: part.content.raw })),
    ];
    const problems = [];
    const images = new Set();
    let blocks = 0;
    const walk = (list, where) => list.forEach(block => {
      blocks += 1;
      if (!block.isValid) problems.push(`${where}: ${block.name} is not valid`);
      if (block.name === 'core/missing') problems.push(`${where}: unknown block ${block.attributes.originalName}`);
      if (block.name === 'core/image' && block.attributes.url) images.add(block.attributes.url);
      if (block.name === 'core/pattern' && !patterns.some(pattern => pattern.name === block.attributes.slug)) problems.push(`${where}: refers to the missing pattern ${block.attributes.slug}`);
      if (block.name === 'core/template-part' && !parts.some(part => part.slug === block.attributes.slug)) problems.push(`${where}: refers to the missing template part ${block.attributes.slug}`);
      walk(block.innerBlocks, where);
    });
    for (const thing of things) {
      if (!thing.content || !thing.content.trim()) { problems.push(`${thing.name}: is empty`); continue; }
      if (/DIMORATOKEN|<\?php/.test(thing.content)) problems.push(`${thing.name}: holds text that was not turned into PHP output`);
      walk(wp.blocks.parse(thing.content), thing.name);
    }
    for (const url of images) {
      const response = await fetch(url, { method: 'HEAD' });
      if (!response.ok || !/^image\//.test(response.headers.get('content-type') || '')) problems.push(`image does not load: ${url}`);
    }
    // Opening the editor on a new page made an empty draft: it is deleted again.
    const draft = wp.data.select('core/editor') && wp.data.select('core/editor').getCurrentPostId();
    if (draft && (await get(`/wp/v2/pages/${draft}?context=edit&_fields=id,status`)).status === 'auto-draft') await wp.apiFetch({ path: `/wp/v2/pages/${draft}?force=true`, method: 'DELETE' });
    return { version, counts: { patterns: patterns.length, templates: templates.length, parts: parts.length, pages: pages.length, posts: posts.length, blocks, images: images.size }, problems };
  });
  await browser.close();

  const { counts } = report;
  for (const [dir, found] of [['patterns', counts.patterns], ['templates', counts.templates], ['parts', counts.parts]]) {
    if (found !== inTheme(dir)) report.problems.push(`the theme holds ${inTheme(dir)} files in ${dir}/, the site knows ${found}`);
  }
  console.log(`WordPress ${String(report.version).replace(/-/g, '.')} at ${BASE}: ${counts.patterns} patterns, ${counts.templates} templates, ${counts.parts} template parts, ${counts.pages} pages, ${counts.posts} articles, ${counts.blocks} blocks, ${counts.images} images.`);
  if (report.problems.length) {
    console.error(`${report.problems.length} problem(s):\n- ${report.problems.join('\n- ')}`);
    process.exit(1);
  }
  console.log('Every block is valid and every image loads.');
})().catch(error => { console.error(`Check failed: ${error.message}`); process.exit(1); });
