#!/usr/bin/env node
// Writes patterns, templates and template parts from src/. The block editor of a running site
// does the serializing, so the files hold exactly what WordPress itself would save.
//   node tools/build.js                                (needs ./bin/setup.sh)
//   WP_URL=http://localhost:8066 node tools/build.js   (build with the oldest WordPress supported)
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

async function sneakIn() {
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

// runs inside the editor page
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

function patternFile(pattern, html, otherwise) {
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
  const body = pattern.when ? `<?php if ( ${pattern.when} ) : ?>\n${withPhp(html)}\n<?php else : ?>\n${withPhp(otherwise)}\n<?php endif; ?>` : withPhp(html);
  return `<?php\n/**\n${head.map(line => ` * ${line}`).join('\n')}\n */\n?>\n${body}\n`;
}

function emptyDir(dir, extension) {
  fs.mkdirSync(dir, { recursive: true });
  for (const file of fs.readdirSync(dir)) if (file.endsWith(extension)) fs.unlinkSync(path.join(dir, file));
}

(async () => {
  const jobs = {};
  for (const pattern of PATTERNS) {
    jobs[`pattern:${pattern.slug}`] = pattern.blocks;
    if (pattern.otherwise) jobs[`otherwise:${pattern.slug}`] = pattern.otherwise;
  }
  for (const [name, tree] of Object.entries(TEMPLATES)) jobs[`template:${name}`] = tree;
  for (const [name, tree] of Object.entries(PARTS)) jobs[`part:${name}`] = tree;

  const { browser, page } = await sneakIn();
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

  for (const pattern of PATTERNS) fs.writeFileSync(path.join(THEME, 'patterns', `${pattern.slug}.php`), patternFile(pattern, out[`pattern:${pattern.slug}`], out[`otherwise:${pattern.slug}`]));
  for (const [kind, dir, names] of [['template', 'templates', Object.keys(TEMPLATES)], ['part', 'parts', Object.keys(PARTS)]]) {
    for (const name of names) {
      const html = out[`${kind}:${name}`];
      if (/PERLATOKEN/.test(html)) throw new Error(`${dir}/${name}.html holds text. Templates cannot be translated: move the text to a pattern.`);
      fs.writeFileSync(path.join(THEME, dir, `${name}.html`), `${html}\n`);
    }
  }

  // what the Perla Starter plugin builds: pages from the page patterns, the menu, sample posts
  const treatments = CONTENT.SERVICES.map(service => ({ slug: service.slug, parent: 'services', title: service.title, pattern: `perla/page-${service.slug}` }));
  const site = {
    pages: [
      { slug: 'home', title: 'Home', pattern: 'perla/page-home', role: 'front' },
      { slug: 'about', title: 'About', pattern: 'perla/page-about' },
      { slug: 'team', title: 'Team', pattern: 'perla/page-team' },
      { slug: 'reviews', title: 'Reviews', pattern: 'perla/page-reviews' },
      { slug: 'services', title: 'Treatments', pattern: 'perla/page-services' },
      ...treatments,
      { slug: 'prices', title: 'Prices', pattern: 'perla/page-prices' },
      { slug: 'first-visit', title: 'First visit', pattern: 'perla/page-first-visit' },
      { slug: 'faq', title: 'Questions', pattern: 'perla/page-faq' },
      { slug: 'blog', title: 'Journal', role: 'posts' },
      { slug: 'contact', title: 'Contact', pattern: 'perla/page-contact' },
      { slug: 'terms', title: 'Terms', text: 'Write here the terms of your practice: cancellations, payments, guarantees.' },
    ],
    menu: [
      { page: 'home', label: 'Home' },
      { page: 'about', label: 'About', children: ['team', 'reviews'] },
      { page: 'services', label: 'Treatments', children: [...treatments.map(page => page.slug), 'prices'] },
      { page: 'first-visit', label: 'First visit', children: ['faq'] },
      { page: 'blog', label: 'Journal' },
      { page: 'contact', label: 'Contact' },
    ],
    posts: CONTENT.POSTS.map((post, index) => ({ title: post.title, excerpt: post.text, body: post.body, image: ['studio.jpg', 'teeth-whitening.jpg', 'general-dentistry.jpg'][index % 3] })),
  };
  const data = path.join(__dirname, '..', 'plugin', 'perla-starter', 'data');
  fs.mkdirSync(data, { recursive: true });
  fs.writeFileSync(path.join(data, 'site.json'), `${JSON.stringify(site, null, 2)}\n`);

  const missing = [...tokens.values()].filter(token => token.kind === 'image' && !fs.existsSync(path.join(THEME, 'assets', 'images', token.value))).map(token => token.value);
  console.log(`Built with WordPress ${version || '?'} at ${BASE}: ${PATTERNS.length} patterns, ${Object.keys(TEMPLATES).length} templates, ${Object.keys(PARTS).length} template parts.`);
  if (missing.length) console.log(`Missing in assets/images: ${missing.join(', ')}`);
})().catch(error => { console.error(`Build failed: ${error.message}`); process.exit(1); });
