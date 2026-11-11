/**
 * Minimal helpers to describe Divi 5 layouts in code and serialise them to the
 * block markup Divi 5 stores in post_content (<!-- wp:divi/section {...} -->).
 */
const BUILDER_VERSION = '5.4.0';

// Class instances (e.g. responsive markers) are treated as values, not merged into.
const isPlainObject = v => v !== null && typeof v === 'object' && Object.getPrototypeOf(v) === Object.prototype;

/** Deep merge of plain objects (arrays and scalars are replaced). Skips undefined. */
function merge(...sources) {
  const out = {};
  for (const src of sources) {
    if (!isPlainObject(src)) continue;
    for (const [key, value] of Object.entries(src)) {
      if (value === undefined) continue;
      out[key] = isPlainObject(value) && isPlainObject(out[key]) ? merge(out[key], value) : isPlainObject(value) ? merge(value) : value;
    }
  }
  return out;
}

/** Remove empty objects left behind by optional settings. */
function prune(value) {
  if (!isPlainObject(value)) return value;
  const out = {};
  for (const [key, v] of Object.entries(value)) {
    const p = prune(v);
    if (p === undefined || (isPlainObject(p) && Object.keys(p).length === 0)) continue;
    out[key] = p;
  }
  return out;
}

/**
 * Responsive value. rv('a') -> desktop only; rv('a', 'b', 'c') -> desktop, tablet, phone.
 * Pass undefined to skip a breakpoint.
 */
function rv(desktop, tablet, phone) {
  const out = {};
  if (desktop !== undefined) out.desktop = { value: desktop };
  if (tablet !== undefined) out.tablet = { value: tablet };
  if (phone !== undefined) out.phone = { value: phone };
  return Object.keys(out).length ? out : undefined;
}

/** Same as rv() plus a desktop hover value. */
function rvHover(desktop, hover, tablet, phone) {
  const out = rv(desktop, tablet, phone) || {};
  if (hover !== undefined) out.desktop = { ...(out.desktop || {}), hover };
  return out;
}

/** Nest a value under a dotted path: at('module.decoration.spacing', x). */
function at(path, value) {
  if (value === undefined) return {};
  return path.split('.').reduceRight((acc, key) => ({ [key]: acc }), value);
}

function block(name, attrs = {}, children = null) {
  return { name, attrs: prune(attrs), children };
}

/** Same escaping as WordPress serialize_block_attributes(). */
function serializeAttrs(attrs) {
  return JSON.stringify(attrs)
    .replace(/--/g, '\\u002d\\u002d')
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\\"/g, '\\u0022');
}

function serializeBlock(b) {
  const attrs = { ...b.attrs, builderVersion: BUILDER_VERSION };
  const head = `wp:${b.name} ${serializeAttrs(attrs)}`;
  if (b.children === null) return `<!-- ${head} /-->`;
  const inner = b.children.filter(Boolean).map(serializeBlock).join('\n');
  return `<!-- ${head} -->\n${inner}\n<!-- /wp:${b.name} -->`;
}

/** Full post_content for a list of sections. */
function serialize(sections) {
  const body = sections.filter(Boolean).map(serializeBlock).join('\n');
  return `<!-- wp:divi/placeholder -->${body}<!-- /wp:divi/placeholder -->`;
}

function countBlocks(blocks, counts = {}) {
  for (const b of blocks.filter(Boolean)) {
    counts[b.name] = (counts[b.name] || 0) + 1;
    if (b.children) countBlocks(b.children, counts);
  }
  return counts;
}

module.exports = { BUILDER_VERSION, merge, prune, rv, rvHover, at, block, serialize, serializeAttrs, countBlocks };
