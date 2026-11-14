#!/usr/bin/env node
/**
 * Checks the theme on a running WordPress, the way the editor would see it.
 *
 *   node tools/check.js                          (the local test site)
 *   WP_URL=http://localhost:8066 node tools/check.js
 *
 * 1. Every pattern, template and template part is parsed by the block editor: a block that
 *    would open with the "unexpected or invalid content" warning fails the check.
 * 2. Every image the patterns point to must load.
 */
const { chromium } = require('playwright');

const BASE = process.env.WP_URL || 'http://localhost:8080';
const USER = process.env.WP_USER || 'admin';
const PASSWORD = process.env.WP_PASSWORD || 'admin';

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
    const patterns = (await get('/wp/v2/block-patterns/patterns')).filter(pattern => pattern.name.startsWith('perla/'));
    const templates = (await get('/wp/v2/templates')).filter(template => template.theme === 'perla');
    const parts = (await get('/wp/v2/template-parts')).filter(part => part.theme === 'perla');
    const things = [
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
      walk(block.innerBlocks, where);
    });
    for (const thing of things) {
      if (!thing.content || !thing.content.trim()) { problems.push(`${thing.name}: is empty`); continue; }
      if (/PERLATOKEN|<\?php/.test(thing.content)) problems.push(`${thing.name}: holds text that was not turned into PHP output`);
      walk(wp.blocks.parse(thing.content), thing.name);
    }
    for (const url of images) {
      const response = await fetch(url, { method: 'HEAD' });
      if (!response.ok) problems.push(`image does not load: ${url}`);
    }
    return { version, counts: { patterns: patterns.length, templates: templates.length, parts: parts.length, blocks, images: images.size }, problems };
  });
  await browser.close();

  const { counts } = report;
  console.log(`WordPress ${String(report.version).replace(/-/g, '.')} at ${BASE}: ${counts.patterns} patterns, ${counts.templates} templates, ${counts.parts} template parts, ${counts.blocks} blocks, ${counts.images} images.`);
  if (report.problems.length) {
    console.error(`${report.problems.length} problem(s):\n- ${report.problems.join('\n- ')}`);
    process.exit(1);
  }
  console.log('Every block is valid and every image loads.');
})().catch(error => { console.error(`Check failed: ${error.message}`); process.exit(1); });
