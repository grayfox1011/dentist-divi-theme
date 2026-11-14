#!/usr/bin/env node
/**
 * Writes the patterns, templates and template parts of the theme from the block trees in src/.
 *
 *   node tools/build.js            (the test site must be running: ./bin/setup.sh)
 *
 * The trees are handed to the block editor of the test site, and WordPress itself turns them
 * into markup. That way the files contain exactly what the editor would save, and no block
 * ever opens with the "unexpected or invalid content" warning.
 *
 * Set WP_URL to build with another site. Building with the oldest WordPress the theme
 * supports gives markup that every later version reads too.
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { PATTERNS } = require('../src/patterns');
const { TEMPLATES, PARTS } = require('../src/templates');
const { tokens } = require('../src/blocks');
const CONTENT = require('../src/content');

const BASE = process.env.WP_URL || 'http://localhost:8080';
const USER = process.env.WP_USER || 'admin';
const PASSWORD = process.env.WP_PASSWORD || 'admin';
const THEME = path.join(__dirname, '..', 'theme', 'perla');
const DOMAIN = 'perla';

/** Opens the block editor and waits until the blocks are registered. */
async function openEditor() {
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ viewport: { width: 1400, height: 900 } })).newPage();
  await page.goto(`${BASE}/wp-login.php`, { waitUntil: 'domcontentloaded' });
  await page.fill('#user_login', USER);
  await page.fill('#user_pass', PASSWORD);
  await Promise.all([page.waitForNavigation({ waitUntil: 'domcontentloaded' }), page.click('#wp-submit')]);
  await page.goto(`${BASE}/wp-admin/post-new.php?post_type=page`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForFunction(() => window.wp && wp.blocks && wp.blocks.getBlockTypes().length > 50, null, { timeout: 120000 });
  return { browser, page };
}

/** Runs in the editor: block trees in, markup out, plus everything that looks wrong. */
function serializeInEditor(jobs) {
  const { createBlock, serialize, parse, getBlockType } = wp.blocks;
  const problems = [];
  const out = {};
  for (const [id, tree] of Object.entries(jobs)) {
    const make = node => {
      if (!getBlockType(node.name)) { problems.push(`${id}: there is no block called ${node.name}`); return null; }
      const block = createBlock(node.name, node.attrs, node.inner.map(make).filter(Boolean));
      for (const key of Object.keys(node.attrs)) if (!(key in block.attributes)) problems.push(`${id}: ${node.name} does not know the setting "${key}"`);
      return block;
    };
    const html = serialize(tree.map(make).filter(Boolean));
    const check = blocks => blocks.forEach(block => {
      if (!block.isValid) problems.push(`${id}: ${block.name} is not valid`);
      check(block.innerBlocks);
    });
    check(parse(html));
    out[id] = html;
  }
  return { out, problems };
}

const php = text => `'${String(text).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

/** Tokens become the PHP calls that print the translated text or the right address. */
function withPhp(html) {
  return html.replace(/PERLATOKEN\d{4}X/g, id => {
    const token = [...tokens.values()].find(entry => entry.id === id);
    if (!token) throw new Error(`Unknown token ${id}`);
    switch (token.kind) {
      case 'text': return `<?php echo esc_html__( ${php(token.value)}, '${DOMAIN}' ); ?>`;
      case 'html': return `<?php echo wp_kses_post( __( ${php(token.value)}, '${DOMAIN}' ) ); ?>`;
      case 'attr': return `<?php echo esc_attr__( ${php(token.value)}, '${DOMAIN}' ); ?>`;
      case 'url': return `<?php echo esc_url( home_url( ${php(token.value)} ) ); ?>`;
      case 'image': return `<?php echo esc_url( get_theme_file_uri( ${php(`assets/images/${token.value}`)} ) ); ?>`;
      default: throw new Error(`Unknown kind of token: ${token.kind}`);
    }
  });
}

function patternFile(pattern, html) {
  const head = [
    `Title: ${pattern.title}`,
    `Slug: perla/${pattern.slug}`,
    pattern.categories && `Categories: ${pattern.categories}`,
    pattern.keywords && `Keywords: ${pattern.keywords}`,
    pattern.blockTypes && `Block Types: ${pattern.blockTypes}`,
    pattern.postTypes && `Post Types: ${pattern.postTypes}`,
    pattern.inserter === false && 'Inserter: no',
    'Viewport Width: 1400',
  ].filter(Boolean);
  return `<?php\n/**\n${head.map(line => ` * ${line}`).join('\n')}\n *\n * Written by tools/build.js from src/patterns.js.\n *\n * @package Perla\n */\n\n?>\n${withPhp(html)}\n`;
}

function emptyDir(dir, extension) {
  fs.mkdirSync(dir, { recursive: true });
  for (const file of fs.readdirSync(dir)) if (file.endsWith(extension)) fs.unlinkSync(path.join(dir, file));
}

(async () => {
  const jobs = {};
  for (const pattern of PATTERNS) jobs[`pattern:${pattern.slug}`] = pattern.blocks;
  for (const [name, tree] of Object.entries(TEMPLATES)) jobs[`template:${name}`] = tree;
  for (const [name, tree] of Object.entries(PARTS)) jobs[`part:${name}`] = tree;

  const { browser, page } = await openEditor();
  const version = await page.evaluate(() => (document.body.className.match(/version-(\d+)-(\d+)/) || []).slice(1).join('.'));
  const { out, problems } = await page.evaluate(serializeInEditor, jobs);
  await browser.close();

  if (problems.length) {
    console.error(`Nothing was written, ${problems.length} thing(s) to fix first:\n- ${[...new Set(problems)].join('\n- ')}`);
    process.exit(1);
  }

  emptyDir(path.join(THEME, 'patterns'), '.php');
  emptyDir(path.join(THEME, 'templates'), '.html');
  emptyDir(path.join(THEME, 'parts'), '.html');

  for (const pattern of PATTERNS) fs.writeFileSync(path.join(THEME, 'patterns', `${pattern.slug}.php`), patternFile(pattern, out[`pattern:${pattern.slug}`]));
  for (const [kind, dir, names] of [['template', 'templates', Object.keys(TEMPLATES)], ['part', 'parts', Object.keys(PARTS)]]) {
    for (const name of names) {
      const html = out[`${kind}:${name}`];
      if (/PERLATOKEN/.test(html)) throw new Error(`${dir}/${name}.html holds text. Templates cannot be translated: move the text to a pattern.`);
      fs.writeFileSync(path.join(THEME, dir, `${name}.html`), `${html}\n`);
    }
  }

  // What bin/setup.sh puts on the local test site: pages made from the page patterns and sample posts.
  const demo = {
    pages: [
      { slug: 'home', title: 'Home' },
      { slug: 'about', title: 'About', pattern: 'perla/page-about' },
      { slug: 'services', title: 'Treatments', pattern: 'perla/page-services' },
      ...CONTENT.SERVICES.map(service => ({ slug: service.slug, parent: 'services', title: service.title, pattern: `perla/page-${service.slug}` })),
      { slug: 'blog', title: 'Journal' },
      { slug: 'contact', title: 'Contact', pattern: 'perla/page-contact' },
      { slug: 'privacy-policy', title: 'Privacy Policy', content: '<!-- wp:paragraph -->\n<p>Write here how your practice collects and uses personal data.</p>\n<!-- /wp:paragraph -->' },
      { slug: 'terms', title: 'Terms', content: '<!-- wp:paragraph -->\n<p>Write here the terms of your practice: cancellations, payments, guarantees.</p>\n<!-- /wp:paragraph -->' },
    ],
    posts: CONTENT.POSTS.map((post, index) => ({ title: post.title, text: post.text, body: post.body, image: ['studio.jpg', 'teeth-whitening.jpg', 'general-dentistry.jpg'][index % 3] })),
  };
  fs.writeFileSync(path.join(__dirname, 'wp', 'demo.json'), `${JSON.stringify(demo, null, 2)}\n`);

  // Images the patterns ask for and the theme does not have.
  const missing = [...tokens.values()].filter(token => token.kind === 'image' && !fs.existsSync(path.join(THEME, 'assets', 'images', token.value))).map(token => token.value);
  console.log(`Built with WordPress ${version || '?'} at ${BASE}: ${PATTERNS.length} patterns, ${Object.keys(TEMPLATES).length} templates, ${Object.keys(PARTS).length} template parts.`);
  if (missing.length) console.log(`Missing in assets/images: ${missing.join(', ')}`);
})().catch(error => { console.error(`Build failed: ${error.message}`); process.exit(1); });
