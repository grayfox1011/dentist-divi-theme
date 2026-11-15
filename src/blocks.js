// Core blocks as plain objects: { name, attrs, inner }. tools/build.js lets WordPress serialize them.
// Texts, addresses and theme images are written as tokens and become PHP calls in the pattern files.
const tokens = new Map();
let counter = 0;

const token = (kind, value) => {
  const key = `${kind}:${value}`;
  if (!tokens.has(key)) tokens.set(key, { kind, value, id: `PERLATOKEN${String(++counter).padStart(4, '0')}X` });
  return tokens.get(key).id;
};

const t = text => token('text', text);
const th = html => token('html', html);
const ta = text => token('attr', text);
const url = path => token('url', path);
const img = file => token('image', file);
// The link to the privacy policy page of the site, followed by a separator; nothing while there is no such page.
const privacy = () => token('privacy', 'link');

const b = (name, attrs = {}, inner = []) => ({ name, attrs: prune(attrs), inner: inner.flat().filter(Boolean) });

function prune(value) {
  if (Array.isArray(value)) return value;
  if (value === null || typeof value !== 'object') return value;
  const out = {};
  for (const [key, child] of Object.entries(value)) {
    const p = prune(child);
    if (p === undefined || p === null || (typeof p === 'object' && !Array.isArray(p) && !Object.keys(p).length)) continue;
    out[key] = p;
  }
  return out;
}

const space = slug => `var:preset|spacing|${slug}`;
const sides = (top, right = top, bottom = top, left = right) => ({ top, right, bottom, left });

function section(o = {}, inner = []) {
  const pad = o.small ? space('80') : space('90');
  return b('core/group', {
    metadata: { name: o.name },
    tagName: o.tagName,
    align: 'full',
    anchor: o.anchor,
    className: o.className,
    backgroundColor: o.bg,
    textColor: o.text,
    // gaps must be presets or plain sizes: WordPress drops a gap written with clamp()
    style: { spacing: { padding: { top: o.top || pad, bottom: o.bottom || pad }, blockGap: o.gap || space('70'), margin: { top: '0', bottom: '0' } } },
    layout: { type: 'constrained' },
  }, inner);
}

const groupAttrs = o => ({
  metadata: o.name ? { name: o.name } : undefined,
  tagName: o.tagName,
  align: o.align,
  anchor: o.anchor,
  className: o.className,
  backgroundColor: o.bg,
  textColor: o.text,
  style: {
    spacing: { blockGap: o.gap, padding: o.padding, margin: o.margin },
    border: o.border,
    shadow: o.shadow ? `var:preset|shadow|${o.shadow}` : undefined,
    position: o.position,
    elements: o.linkColor ? { link: { color: { text: `var:preset|color|${o.linkColor}` } } } : undefined,
  },
});

const flow = (o = {}, inner = []) => b('core/group', { ...groupAttrs(o), layout: o.contentSize ? { type: 'constrained', contentSize: o.contentSize, justifyContent: o.justify } : { type: 'default' } }, inner);

const stack = (o = {}, inner = []) => b('core/group', { ...groupAttrs(o), layout: { type: 'flex', orientation: 'vertical', justifyContent: o.justify, verticalAlignment: o.valign } }, inner);

const row = (o = {}, inner = []) => b('core/group', { ...groupAttrs(o), layout: { type: 'flex', flexWrap: o.wrap === false ? 'nowrap' : 'wrap', justifyContent: o.justify, verticalAlignment: o.valign || 'center' } }, inner);

function grid(o = {}, inner = []) {
  return b('core/group', {
    metadata: o.name ? { name: o.name } : undefined,
    align: o.align === undefined ? 'wide' : o.align,
    className: o.className,
    style: { spacing: { blockGap: o.gap || space('50'), margin: o.margin } },
    layout: { type: 'grid', minimumColumnWidth: o.min || '300px' },
  }, inner);
}

function columns(o = {}, cols = []) {
  return b('core/columns', {
    align: o.align === undefined ? 'wide' : o.align,
    className: o.className,
    verticalAlignment: o.valign,
    isStackedOnMobile: o.stack,
    style: { spacing: { blockGap: { top: o.rowGap || space('70'), left: o.gap || space('80') }, margin: o.margin, padding: o.padding }, border: o.border, color: o.color },
    backgroundColor: o.bg,
  }, cols);
}

function column(o = {}, inner = []) {
  return b('core/column', {
    width: o.width,
    verticalAlignment: o.valign,
    className: o.className,
    style: { spacing: { blockGap: o.gap, padding: o.padding } },
    layout: o.layout,
  }, inner);
}

// o.spread pushes the last block to the bottom, so the cards of a row line up
function card(o = {}, inner = []) {
  const attrs = {
    name: o.name,
    className: o.className,
    bg: o.bg === undefined ? 'white' : o.bg,
    text: o.text,
    gap: o.gap || space('40'),
    padding: o.padding || sides(space('60')),
    border: { radius: 'var(--wp--custom--radius--medium)', ...(o.line === false ? {} : { width: '1px', color: 'var(--wp--preset--color--line)', style: 'solid' }) },
    shadow: o.shadow,
  };
  return o.spread ? stack({ ...attrs, justify: 'stretch', valign: 'space-between' }, inner) : flow(attrs, inner);
}

function heading(text, o = {}) {
  return b('core/heading', {
    level: o.level || 2,
    content: text,
    textAlign: o.align,
    anchor: o.anchor,
    className: o.className,
    fontSize: o.size,
    textColor: o.color,
    style: { typography: o.typography, spacing: { margin: o.margin } },
  });
}

function paragraph(text, o = {}) {
  return b('core/paragraph', {
    content: text,
    align: o.align,
    className: o.className,
    fontSize: o.size,
    textColor: o.color,
    style: { typography: o.typography, spacing: { margin: o.margin }, elements: o.linkColor ? { link: { color: { text: `var:preset|color|${o.linkColor}` } } } : undefined },
  });
}

const eyebrow = (text, o = {}) => paragraph(text, { ...o, className: ['is-style-perla-eyebrow', o.className].filter(Boolean).join(' ') });
const lead = (text, o = {}) => paragraph(text, { size: 'large', ...o });
const small = (text, o = {}) => paragraph(text, { size: 'small', ...o });

function buttons(o = {}, list = []) {
  return b('core/buttons', { className: o.className, style: { spacing: { blockGap: o.gap || space('30'), margin: o.margin } }, layout: { type: 'flex', justifyContent: o.justify } }, list);
}

// variant: none (filled), 'outline', 'perla-light' or 'perla-ghost'
function button(text, href, o = {}) {
  return b('core/button', { text, url: href, className: o.variant ? `is-style-${o.variant}` : undefined });
}

const arrowLink = (text, href, o = {}) => paragraph(`<a href="${href}">${text}</a>`, { className: 'perla-arrow-link', size: 'small', ...o });

function list(items, o = {}) {
  return b('core/list', { className: o.className, ordered: o.ordered, style: { spacing: { margin: o.margin } }, textColor: o.color }, items.map(item => b('core/list-item', { content: item })));
}
const checks = (items, o = {}) => list(items, { ...o, className: 'is-style-perla-checks' });

function image(file, o = {}) {
  return b('core/image', {
    url: img(file),
    alt: o.alt === undefined ? '' : o.alt,
    sizeSlug: 'full',
    aspectRatio: o.ratio,
    scale: o.ratio ? 'cover' : undefined,
    width: o.width,
    height: o.height,
    align: o.align,
    className: o.className,
    style: { border: o.radius ? { radius: o.radius } : undefined, shadow: o.shadow ? `var:preset|shadow|${o.shadow}` : undefined },
  });
}

const icon = (name, o = {}) => image(`icon-${name}.svg`, { className: ['perla-icon', o.small ? 'perla-icon-small' : '', o.className].filter(Boolean).join(' '), width: o.small ? '20px' : '26px', height: o.small ? '20px' : '26px' });

module.exports = { b, t, th, ta, url, img, privacy, tokens, space, sides, section, flow, stack, row, grid, columns, column, card, heading, paragraph, eyebrow, lead, small, buttons, button, arrowLink, list, checks, image, icon };
