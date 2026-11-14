/**
 * Module factories: thin wrappers that turn readable options into Divi 5 block attributes.
 * Only standard Divi 5 modules are used.
 */
const { rv, at, merge, block } = require('./lib/d5');
const { color: c, v, fontRef, makeId } = require('./tokens');

const isPlainObject = x => x !== null && typeof x === 'object' && !Array.isArray(x) && !(x instanceof Resp);
const len = o => Object.keys(o).length;

/** Marks a value as responsive: resp(desktop, tablet, phone). */
class Resp { constructor(d, t, p) { this.d = d; this.t = t; this.p = p; } }
const resp = (d, t, p) => new Resp(d, t, p);

function split(obj) {
  const out = { d: {}, t: {}, p: {} };
  for (const [k, val] of Object.entries(obj || {})) {
    if (val === undefined) continue;
    if (val instanceof Resp) { for (const bp of ['d', 't', 'p']) if (val[bp] !== undefined) out[bp][k] = val[bp]; }
    else if (isPlainObject(val)) { const s = split(val); for (const bp of ['d', 't', 'p']) if (len(s[bp])) out[bp][k] = s[bp]; }
    else out.d[k] = val;
  }
  return out;
}

/** Builds { desktop: { value, hover }, tablet: { value }, phone: { value } } from props that may contain resp(). */
function G(props, hover) {
  const s = split(props);
  const sync = o => { for (const key of ['padding', 'margin']) if (o[key]) o[key] = { ...o[key], syncVertical: 'off', syncHorizontal: 'off' }; return o; };
  const res = {};
  if (len(s.d) || hover) res.desktop = { ...(len(s.d) ? { value: sync(s.d) } : {}), ...(hover ? { hover } : {}) };
  if (len(s.t)) res.tablet = { value: sync(s.t) };
  if (len(s.p)) res.phone = { value: sync(s.p) };
  return len(res) ? res : undefined;
}

/** Single responsive scalar (not an object of props). */
const S = val => (val === undefined ? undefined : val instanceof Resp ? rv(val.d, val.t, val.p) : rv(val));

/** box('10px') | box('10px','20px') | box(t, r, b, l) -> sides object. */
function box(...a) {
  const [t, r, b, l] = a.length === 1 ? [a[0], a[0], a[0], a[0]] : a.length === 2 ? [a[0], a[1], a[0], a[1]] : a;
  return { top: t, right: r, bottom: b, left: l };
}
const corners = x => (x === undefined ? undefined : Array.isArray(x) ? { topLeft: x[0], topRight: x[1], bottomRight: x[2], bottomLeft: x[3], sync: 'off' } : { topLeft: x, topRight: x, bottomRight: x, bottomLeft: x, sync: 'on' });

const SHADOWS = {
  soft: { style: 'preset1', horizontal: '0px', vertical: '18px', blur: '48px', spread: '-18px', color: 'rgba(11,27,63,0.18)', position: 'outer' },
  lift: { style: 'preset1', horizontal: '0px', vertical: '28px', blur: '64px', spread: '-24px', color: 'rgba(11,27,63,0.28)', position: 'outer' },
  none: { style: 'none' },
};

/** Common "decoration" settings shared by module roots and sub-elements. */
function deco(o = {}) {
  const border = o.border || {};
  const sides = {};
  for (const side of ['all', 'top', 'right', 'bottom', 'left']) if (border[side]) sides[side] = border[side];
  if (border.width || border.color) sides.all = { width: border.width, color: border.color, style: border.style };
  return {
    background: G({ color: o.bg, gradient: o.gradient, image: o.bgImage }, o.bgHover ? { color: o.bgHover } : undefined),
    spacing: G({ padding: o.padding, margin: o.margin }),
    border: G({ radius: corners(o.radius), styles: len(sides) ? sides : undefined }, o.borderHover ? { styles: { all: { color: o.borderHover } } } : undefined),
    boxShadow: o.shadow ? G(typeof o.shadow === 'string' ? SHADOWS[o.shadow] : o.shadow, o.shadowHover ? SHADOWS[o.shadowHover] : undefined) : undefined,
    sizing: G({ width: o.width, maxWidth: o.maxWidth, height: o.height, minHeight: o.minHeight, maxHeight: o.maxHeight, alignSelf: o.alignSelf, size: o.size, flexType: o.flexType }),
    layout: G(o.layout),
    order: o.order !== undefined ? G({ order: o.order }) : undefined,
    overflow: o.overflow ? G({ x: o.overflow, y: o.overflow }) : undefined,
    position: o.position ? G(o.position) : undefined,
    transform: o.transform ? G(o.transform, o.transformHover) : (o.transformHover ? G({}, o.transformHover) : undefined),
    zIndex: o.zIndex !== undefined ? S(o.zIndex) : undefined,
    sticky: o.sticky ? G({ position: o.sticky }) : undefined,
    disabledOn: o.hideOn ? { ...(o.hideOn.includes('desktop') ? { desktop: { value: 'on' } } : {}), ...(o.hideOn.includes('tablet') ? { tablet: { value: 'on' } } : {}), ...(o.hideOn.includes('phone') ? { phone: { value: 'on' } } : {}) } : undefined,
  };
}

const font = (o = {}, hover) => ({ font: G({ family: o.family, headingLevel: o.level, size: o.size, weight: o.weight, color: o.color, lineHeight: o.lineHeight, letterSpacing: o.letterSpacing, textAlign: o.align, style: o.style }, hover) });

/** CSS classes read by the scroll animations (theme/perla-child/assets/js/perla-motion.js). */
const MOTION = { hero: 'perla-hero', split: 'perla-split', stagger: 'perla-stagger', reveal: 'perla-reveal', image: 'perla-image', pop: 'perla-pop' };

/** Shared root: admin label + module decoration + custom HTML attributes. */
function root(o = {}, defaults = {}) {
  // Divi's custom attributes carry the HTML id (o.anchor, for "#pricing" style links) and the
  // class of the scroll animation (o.motion: a key of MOTION).
  const custom = [];
  const add = (name, value) => custom.push({ id: makeId('attr', `${name}:${value}`).slice(5), name, value, adminLabel: '', targetElement: 'main' });
  if (o.anchor) add('id', o.anchor);
  if (o.motion) {
    if (!MOTION[o.motion]) throw new Error(`Unknown motion: ${o.motion}`);
    add('class', MOTION[o.motion]);
  }
  const attributes = custom.length ? at('module.decoration.attributes', { attributes: custom }) : {};
  return merge(o.label ? at('module.meta.adminLabel', rv(o.label)) : {}, { module: { decoration: deco(merge(defaults, o.mod)) } }, o.link ? at('module.advanced.link', rv({ url: o.link })) : {}, attributes);
}

/** The animation a module gets when the caller does not choose one (motion: false = none). */
const motionOr = (o, fallback) => ({ ...o, motion: o.motion === undefined ? fallback : o.motion });

// ---------------------------------------------------------------- structure

function section(o = {}, rows = []) {
  const d = { bg: o.bg, gradient: o.gradient, padding: o.padding || { top: v('sectionY'), bottom: v('sectionY') }, layout: { rowGap: o.rowGap || 'clamp(32px, 4vw, 56px)' } };
  return block('divi/section', merge(root(o, d), o.attrs), rows);
}

const STRUCTURES = {
  1: { name: 'equal-columns_1', types: ['24_24'] },
  2: { name: 'equal-columns_2', types: ['12_24', '12_24'] },
  3: { name: 'equal-columns_3', types: ['8_24', '8_24', '8_24'] },
  4: { name: 'equal-columns_4', types: ['6_24', '6_24', '6_24', '6_24'] },
  '3_5,2_5': { name: 'offset-columns_1', types: ['3_5', '2_5'] },
  '2_5,3_5': { name: 'offset-columns_2', types: ['2_5', '3_5'] },
  '2_3,1_3': { name: 'offset-columns_5', types: ['16_24', '8_24'] },
  '1_3,2_3': { name: 'offset-columns_6', types: ['8_24', '16_24'] },
  '3_4,1_4': { name: 'offset-columns_9', types: ['18_24', '6_24'] },
  '1_4,3_4': { name: 'offset-columns_10', types: ['6_24', '18_24'] },
};

/**
 * Flex row. o.cols picks the structure (number or key of STRUCTURES); columns stack on
 * phones, and on tablets too unless o.tablet === 'keep'.
 */
function row(o = {}, columns = []) {
  const st = STRUCTURES[o.cols || columns.length];
  if (!st) throw new Error(`Unknown row structure: ${o.cols}`);
  const keepTablet = o.tablet === 'keep';
  const cols = columns.filter(Boolean).map((col, i) => {
    const preset = col.attrs.module && col.attrs.module.decoration && col.attrs.module.decoration.sizing;
    if (preset && preset.desktop && preset.desktop.value && preset.desktop.value.flexType) return col;
    const type = st.types[i] || st.types[st.types.length - 1];
    const sizing = G({ flexType: resp(type, keepTablet ? (o.tabletTypes ? o.tabletTypes[i] : type) : '24_24', o.phoneTypes ? o.phoneTypes[i] : '24_24') });
    return { ...col, attrs: merge(col.attrs, at('module.decoration.sizing', sizing)) };
  });
  const d = {
    width: o.width || resp('90%', '90%', '88%'), maxWidth: o.maxWidth || v('container'), padding: o.padding || box('0px'),
    layout: { display: 'flex', flexWrap: resp('nowrap', keepTablet ? 'nowrap' : 'wrap', 'wrap'), columnGap: o.gap || v('gapL'), rowGap: o.rowGap || o.gap || 'clamp(32px, 5vw, 56px)', alignItems: o.align, justifyContent: o.justify },
  };
  return block('divi/row', merge(root(o, d), at('module.advanced.flexColumnStructure', rv(st.name)), o.attrs), cols);
}

/** CSS grid row: equal columns that reflow, e.g. grid({ count: resp('3', '2', '1') }, cards). */
function grid(o = {}, columns = []) {
  const count = o.count || resp('3', '2', '1');
  const d = {
    width: o.width || resp('90%', '90%', '88%'), maxWidth: o.maxWidth || v('container'), padding: o.padding || box('0px'),
    layout: { display: 'grid', gridColumnWidths: 'equal', gridColumnCount: count, columnGap: o.gap || v('gapM'), rowGap: o.rowGap || o.gap || v('gapM'), alignItems: o.align },
  };
  const n = count instanceof Resp ? count.d : count;
  return block('divi/row', merge(root(motionOr(o, 'stagger'), d), at('module.advanced.flexColumnStructure', rv(`equal-columns_${n}`)), o.attrs), columns.filter(Boolean));
}

function col(o = {}, modules = []) {
  const d = { layout: { flexDirection: o.direction, rowGap: o.gap || '20px', columnGap: o.columnGap, justifyContent: o.justify, alignItems: o.align, flexWrap: o.wrap }, flexType: o.flexType };
  return block('divi/column', merge(root(o, d), o.attrs), modules.filter(Boolean));
}

/** A column styled as a card. */
function card(o = {}, modules = []) {
  return col(merge({ mod: { bg: c('white'), radius: v('radiusM'), padding: box(v('cardPad')), border: { width: '1px', color: c('line') } }, gap: '16px' }, o), modules);
}

function group(o = {}, modules = []) {
  const d = { layout: { flexDirection: o.direction || 'column', rowGap: o.gap || '16px', columnGap: o.columnGap || o.gap || '16px', alignItems: o.align, justifyContent: o.justify, flexWrap: o.wrap } };
  return block('divi/group', merge(root(o, d), o.attrs), modules.filter(Boolean));
}

// ---------------------------------------------------------------- content

function heading(text, o = {}) {
  const f = { level: o.level || 'h2', size: o.size || v('h2'), weight: o.weight || '700', color: o.color || c('heading'), lineHeight: o.lineHeight || '1.15em', letterSpacing: o.letterSpacing || '-0.02em', align: o.align, style: o.style };
  const titled = motionOr(o, ['h1', 'h2'].includes(f.level) ? 'split' : undefined);
  return block('divi/heading', merge(root(titled), { title: { innerContent: rv(text), decoration: { font: font(f) } } }, o.attrs));
}
const display = (text, o = {}) => heading(text, merge({ level: 'h1', size: v('display'), weight: '800', lineHeight: '1.06em', letterSpacing: '-0.03em' }, o));
const h3 = (text, o = {}) => heading(text, merge({ level: 'h3', size: v('h3'), lineHeight: '1.25em', letterSpacing: '-0.01em' }, o));
const eyebrow = (text, o = {}) => heading(text, merge({ level: 'h6', size: v('eyebrow'), weight: '700', color: c('primary'), lineHeight: '1.4em', letterSpacing: '0.12em', style: ['uppercase'] }, o));

function text(html, o = {}) {
  const body = { family: o.family, size: o.size || v('bodySize'), color: o.color || c('body'), lineHeight: o.lineHeight || '1.7em', weight: o.weight };
  const link = o.linkColor ? { font: G({ color: o.linkColor }, { color: o.linkHover || o.linkColor }) } : undefined;
  return block('divi/text', merge(root(o), { content: { innerContent: rv(html), decoration: { bodyFont: { body: font(body), link } } } }, o.align ? at('module.advanced.text.text', G({ orientation: o.align })) : {}, o.attrs));
}
const lead = (html, o = {}) => text(html, merge({ size: v('lead'), lineHeight: '1.65em' }, o));
const small = (html, o = {}) => text(html, merge({ size: v('small'), lineHeight: '1.6em' }, o));

const BUTTONS = {
  primary: { bg: c('primary'), bgHover: c('primaryDark'), color: c('white'), colorHover: c('white'), borderColor: c('primary'), borderHover: c('primaryDark') },
  outline: { bg: 'rgba(255,255,255,0)', bgHover: c('tint'), color: c('heading'), colorHover: c('primary'), borderColor: c('line'), borderHover: c('primary') },
  light: { bg: c('white'), bgHover: c('tint'), color: c('heading'), colorHover: c('primary'), borderColor: c('white'), borderHover: c('tint') },
  ghost: { bg: 'rgba(255,255,255,0)', bgHover: c('white', 12), color: c('white'), colorHover: c('white'), borderColor: c('white', 40), borderHover: c('white') },
};

function button(label, url, o = {}) {
  const variant = BUTTONS[o.variant || 'primary'];
  const btn = {
    innerContent: rv({ text: label, linkUrl: url, ...(o.newTab ? { linkTarget: 'on' } : {}) }),
    decoration: {
      button: G({ enable: 'on', icon: { enable: 'off' } }),
      background: G({ color: variant.bg }, { color: variant.bgHover }),
      border: G({ radius: corners(v('radiusPill')), styles: { all: { width: '1.5px', color: variant.borderColor } } }, { styles: { all: { color: variant.borderHover } } }),
      font: font({ family: fontRef('heading'), size: o.size || '16px', weight: '600', color: variant.color, lineHeight: '1.2em' }, { color: variant.colorHover }),
      spacing: G({ padding: o.padding || box('15px', '28px') }),
    },
  };
  return block('divi/button', merge(root(o, { padding: o.padding || box('15px', '28px') }), { button: btn }, o.align ? at('module.advanced.alignment', S(o.align)) : {}, o.attrs));
}

/** Text-style link button with an arrow, e.g. "Learn more". */
function linkButton(label, url, o = {}) {
  const col1 = o.color || c('primary');
  const pad = box('4px', '0px');
  const btn = {
    innerContent: rv({ text: `${label} →`, linkUrl: url }),
    decoration: {
      button: G({ enable: 'on', icon: { enable: 'off' } }),
      background: G({ color: 'rgba(255,255,255,0)' }, { color: 'rgba(255,255,255,0)' }),
      border: G({ radius: corners('0px'), styles: { all: { width: '0px', color: 'rgba(255,255,255,0)' } } }),
      font: font({ family: fontRef('heading'), size: o.size || '16px', weight: '600', color: col1, lineHeight: '1.2em' }, { color: o.colorHover || c('primaryDark') }),
      spacing: G({ padding: pad }),
    },
  };
  return block('divi/button', merge(root(o, { padding: pad }), { button: btn }, o.align ? at('module.advanced.alignment', S(o.align)) : {}, o.attrs));
}

/** A picture as Divi stores it: a plain address, or { src, width, height } (see photos.js). */
const picture = (src, alt) => ({ ...(typeof src === 'string' ? { src } : src), alt: alt || '' });

function image(src, o = {}) {
  const img = { innerContent: rv({ ...picture(src, o.alt), ...(o.link ? { linkUrl: o.link } : {}) }), decoration: { border: G({ radius: corners(o.radius === undefined ? v('radiusL') : o.radius) }), boxShadow: o.shadow ? G(SHADOWS[o.shadow]) : undefined } };
  const adv = { sizing: G({ width: o.width, maxWidth: o.maxWidth, height: o.height, maxHeight: o.maxHeight }), align: S(o.align), spacing: o.margin ? G({ margin: o.margin }) : undefined };
  return block('divi/image', merge(root(o), { image: img, module: { advanced: adv } }, o.attrs));
}

const FA = unicode => ({ unicode, type: 'fa', weight: '900' });

/** Icon, optionally inside a rounded badge (o.badge = background colour). */
function icon(unicode, o = {}) {
  const badge = o.badge ? { bg: o.badge, padding: box(o.badgePad || '16px'), radius: o.badgeRadius || '16px' } : {};
  const ic = { innerContent: rv({ ...(typeof unicode === 'string' ? FA(unicode) : unicode), ...(o.link ? { url: o.link } : {}) }), advanced: { color: S(o.color || c('primary')), size: S(o.size || '24px'), align: S(o.align || 'left') } };
  return block('divi/icon', merge(root(o, merge(badge, { alignSelf: o.alignSelf || 'flex-start' })), { icon: ic }, o.attrs));
}

/**
 * A field holds either words or one variable of the Variable Manager, never both: the Visual
 * Builder shows only the variable when the two are mixed, while the site shows everything.
 */
const isVariable = text => /^\$variable\(.*\)\$$/.test(text);

/** Blurb with an icon, a title and a short text. */
function blurb(o = {}) {
  const placement = o.placement || 'top';
  const attrs = {
    imageIcon: {
      innerContent: rv({ useIcon: 'on', icon: typeof o.icon === 'string' ? FA(o.icon) : o.icon }),
      advanced: { color: S(o.iconColor || c('primary')), placement: S(placement) },
      decoration: merge(deco({ bg: o.iconBg === undefined ? c('tint') : o.iconBg, padding: box(o.iconPad || '16px'), radius: o.iconRadius || '16px' }), { sizing: G({ iconFontSize: o.iconSize || '26px' }) }),
    },
    title: { innerContent: rv({ text: o.title, ...(o.link ? { url: o.link } : {}) }), decoration: { font: font({ level: o.level || 'h3', size: o.titleSize || v('h3'), weight: '700', color: o.titleColor || c('heading'), lineHeight: '1.25em', letterSpacing: '-0.01em', align: o.align || 'left' }) } },
    content: { innerContent: rv(!o.text ? '' : isVariable(o.text) ? o.text : `<p>${o.text}</p>`), decoration: { bodyFont: { body: font({ size: o.textSize || v('bodySize'), color: o.textColor || c('body'), lineHeight: '1.65em', align: o.align || 'left' }) } } },
    contentContainer: { decoration: { sizing: G({ maxWidth: '100%' }) } },
    module: { advanced: { text: { text: G({ orientation: o.align || 'left' }) } } },
  };
  return block('divi/blurb', merge(root(o), attrs, o.attrs));
}

function iconList(items, o = {}) {
  const attrs = {
    icon: { advanced: { color: S(o.iconColor || c('secondary')), size: S(o.iconSize || '14px') }, decoration: deco({ bg: o.iconBg, padding: o.iconBg ? box('6px') : undefined, radius: o.iconBg ? '50px' : undefined, margin: { top: '5px' } }) },
    listItem: { decoration: { font: font({ size: o.size || v('bodySize'), color: o.color || c('heading'), weight: o.weight || '500', lineHeight: '1.5em' }) } },
  };
  // The text style is repeated on every item so it never depends on the site's default presets.
  const itemFont = font({ size: o.size || v('bodySize'), color: o.color || c('heading'), weight: o.weight || '500', lineHeight: '1.5em' });
  const children = items.map(item => block('divi/icon-list-item', { content: { innerContent: rv(typeof item === 'string' ? item : item.text), decoration: { font: itemFont } }, icon: { innerContent: rv({ ...FA((item && item.icon) || o.icon || '&#xf00c;'), target: 'off' }) } }));
  return block('divi/icon-list', merge(root(o, { layout: { rowGap: o.gap || '12px' }, padding: box('0px') }), attrs, o.attrs), children);
}

function divider(o = {}) {
  return block('divi/divider', merge(root(o), { divider: { advanced: { line: G({ show: 'on', color: o.color || c('line'), weight: o.weight || '1px', style: 'solid' }) } } }, o.attrs));
}


function accordion(items, o = {}) {
  const attrs = {
    title: { decoration: { font: font({ level: 'h3', size: o.titleSize || '18px', weight: '600', color: c('heading'), lineHeight: '1.4em' }) } },
    content: { decoration: { bodyFont: { body: font({ size: v('bodySize'), color: c('body'), lineHeight: '1.7em' }) } } },
    closedToggle: { decoration: { background: G({ color: o.itemBg || c('white') }), font: font({ color: c('heading') }) } },
    openToggle: { decoration: { background: G({ color: o.openBg || c('white') }), font: font({ color: c('primary') }) } },
    closedToggleIcon: { decoration: { icon: G({ color: c('primary'), type: 'fa', unicode: '&#xf067;', weight: '900', useSize: 'on', size: '14px' }) } },
  };
  const children = items.map((item, i) => block('divi/accordion-item', {
    module: { advanced: { open: rv(i === 0 ? 'on' : 'off') }, decoration: deco({ radius: v('radiusM'), border: { width: '1px', color: c('line') }, padding: box('22px', '26px') }) },
    title: { innerContent: rv(item.q) },
    content: { innerContent: rv(`<p>${item.a}</p>`) },
  }, []));
  return block('divi/accordion', merge(root(o, { layout: { rowGap: '12px' } }), attrs, o.attrs), children);
}

/** Animated number with a label underneath. */
function counter(number, title, o = {}) {
  const attrs = {
    number: { innerContent: rv(String(number)), advanced: { enablePercentSign: rv(o.percent ? 'on' : 'off') }, decoration: { font: font({ size: o.size || 'clamp(34px, 3.6vw, 48px)', weight: '800', color: o.color || c('heading'), lineHeight: '1.1em', letterSpacing: '-0.02em', align: o.align || 'left' }) } },
    title: { innerContent: rv(title), decoration: { font: font({ level: 'h3', size: v('small'), weight: '500', color: o.titleColor || c('body'), lineHeight: '1.4em', align: o.align || 'left' }) } },
    module: { advanced: { text: { text: G({ orientation: o.align || 'left' }) } } },
  };
  return block('divi/number-counter', merge(root(o, { layout: { rowGap: '6px' } }), attrs, o.attrs));
}

function contactForm(fields, o = {}) {
  const variant = BUTTONS.primary;
  const attrs = {
    module: { advanced: { uniqueId: rv(o.id || 'perla-contact-form'), successMessage: rv(o.success || 'Thank you! We will get back to you within one business day.') } },
    title: { innerContent: rv(o.title || '') },
    email: { advanced: { receiver: rv(o.email || '') } },
    field: { decoration: { background: G({ color: c('mist') }), border: G({ radius: corners(v('radiusS')), styles: { all: { width: '1px', color: c('line') } } }), font: font({ size: '16px', color: c('heading'), lineHeight: '1.5em' }), spacing: G({ padding: box('15px', '18px') }) } },
    button: {
      innerContent: rv({ text: o.button || 'Send message' }),
      decoration: {
        button: G({ enable: 'on', icon: { enable: 'off' } }),
        background: G({ color: variant.bg }, { color: variant.bgHover }),
        border: G({ radius: corners(v('radiusPill')), styles: { all: { width: '1.5px', color: variant.borderColor } } }),
        font: font({ family: fontRef('heading'), size: '16px', weight: '600', color: variant.color, lineHeight: '1.2em' }),
        spacing: G({ padding: box('15px', '30px') }),
      },
    },
  };
  const children = fields.map(f => block('divi/contact-field', {
    module: { decoration: { sizing: G({ flexType: resp(f.half ? '12_24' : '24_24', f.half ? '12_24' : '24_24', '24_24') }) } },
    fieldItem: {
      innerContent: rv(f.label),
      advanced: { id: rv(f.id), type: rv(f.type || 'input'), fullwidth: rv(f.half ? 'off' : 'on'), required: rv(f.required === false ? 'off' : 'on'), ...(f.options ? { selectOptions: rv(f.options.map((value, i) => ({ id: `${f.id}-${i}`, value, checked: 0, dragID: i }))) } : {}) },
    },
  }));
  return block('divi/contact-form', merge(root(o), attrs, o.attrs), children);
}

/** Latest posts. Uses Divi's own Blog module, so it always shows the site's real posts. */
function blog(o = {}) {
  const attrs = {
    post: { advanced: { type: rv('post'), number: rv(String(o.number || 3)), excerptLength: rv('110'), showExcerpt: rv('on') }, decoration: { border: G({ radius: corners(v('radiusM')), styles: { all: { width: '1px', color: c('line') } } }) } },
    image: { advanced: { enable: rv('on') } },
    readMore: { advanced: { enable: rv('on') }, decoration: { font: font({ size: '15px', weight: '600', color: c('primary') }) } },
    pagination: { advanced: { enable: rv(o.pagination ? 'on' : 'off') }, decoration: { font: font({ size: '15px', weight: '600', color: c('primary') }) } },
    meta: { advanced: { showAuthor: rv('off'), showDate: rv('on'), showCategories: rv('on'), showComments: rv('off') }, decoration: { font: font({ size: '13px', color: c('body'), lineHeight: '1.5em' }) } },
    title: { decoration: { font: font({ level: 'h3', size: '20px', weight: '700', color: c('heading'), lineHeight: '1.3em' }) } },
    content: { decoration: { bodyFont: { body: font({ size: v('small'), color: c('body'), lineHeight: '1.6em' }) } } },
    blogGrid: { decoration: { layout: G({ display: 'grid', gridColumnCount: o.count || resp('3', '2', '1'), columnGap: v('gapM'), rowGap: v('gapM') }) } },
    masonry: { decoration: { background: G({ color: c('white') }) } },
  };
  return block('divi/blog', merge(root(o), attrs, o.attrs));
}

/** Raw HTML (used only for the keyless Google Maps embed). */
function code(html, o = {}) {
  return block('divi/code', merge(root(o), { content: { innerContent: rv(html) } }, o.attrs));
}

function menu(o = {}) {
  const attrs = {
    menu: { advanced: { menuId: rv(String(o.menuId || '')), style: rv('left_aligned'), activeLinkColor: rv(o.active || c('primary')) }, decoration: { font: font({ size: '16px', weight: '500', color: o.color || c('heading'), lineHeight: '1.4em' }) } },
    menuDropdown: { advanced: { lineColor: rv(c('primary')) }, decoration: { background: G({ color: c('white') }), font: font({ color: c('heading') }) } },
    menuMobile: { decoration: { background: G({ color: c('white') }), font: font({ color: c('heading') }) } },
    hamburgerMenuIcon: { decoration: { font: font({ color: o.color || c('heading'), size: '32px' }) } },
    cartIcon: { advanced: { show: rv('off') } }, cartQuantity: { advanced: { show: rv('off') } }, searchIcon: { advanced: { show: rv('off') } },
    logo: o.logo ? { innerContent: rv({ src: o.logo, alt: o.logoAlt || '', linkUrl: o.logoLink }), decoration: { sizing: G({ maxHeight: o.logoHeight || '40px' }) } } : undefined,
  };
  return block('divi/menu', merge(root(o, { bg: 'rgba(255,255,255,0)' }), attrs, at('module.advanced.text.text', G({ orientation: resp(o.align || 'center', 'right', 'right') })), o.attrs));
}

function social(networks, o = {}) {
  const attrs = { socialNetwork: { advanced: { followButton: rv('off') } } };
  const children = networks.map(n => block('divi/social-media-follow-network', {
    module: { decoration: deco({ bg: o.bg || c('white', 10), bgHover: c('primary'), radius: '100px', padding: box('6px') }) },
    socialNetwork: { innerContent: rv({ title: n.id, label: n.label, link: n.url || '#' }) },
    icon: { advanced: { color: rv(o.color || c('white')) } },
  }));
  return block('divi/social-media-follow', merge(root(o, { layout: { columnGap: '10px', rowGap: '10px' } }), { socialNetwork: attrs.socialNetwork }, o.attrs), children);
}

function beforeAfter(before, after, o = {}) {
  const attrs = {
    beforeImage: { innerContent: rv(picture(before, o.beforeAlt || 'Before treatment')) },
    afterImage: { innerContent: rv(picture(after, o.afterAlt || 'After treatment')) },
    beforeLabel: { innerContent: rv('Before') },
    afterLabel: { innerContent: rv('After') },
    slider: { advanced: { color: rv(c('white')), arrowColor: rv(c('primary')) } },
    labels: { decoration: { background: G({ color: c('white') }), font: font({ size: '13px', weight: '600', color: c('heading'), lineHeight: '1.2em' }), border: G({ radius: corners('100px') }), spacing: G({ padding: box('7px', '14px') }) } },
  };
  return block('divi/before-after-image', merge(root(o, { radius: v('radiusL'), overflow: 'hidden' }), attrs, o.attrs));
}


// ---------------------------------------------------------------- theme builder (post template)

function postTitle(o = {}) {
  const attrs = {
    title: { decoration: { font: font({ level: 'h1', size: 'clamp(34px, 4.4vw, 56px)', weight: '800', color: c('heading'), lineHeight: '1.1em', letterSpacing: '-0.025em', align: o.align || 'center' }) } },
    meta: { advanced: { showMeta: rv('on'), showAuthor: rv('off'), showDate: rv('on'), showCategories: rv('on'), showCommentsCount: rv('off') }, decoration: { font: font({ size: v('small'), color: c('body'), lineHeight: '1.6em', align: o.align || 'center' }) } },
    featuredImage: { advanced: { enabled: rv('off') } },
    module: { advanced: { text: { text: G({ orientation: o.align || 'center' }) } } },
  };
  return block('divi/post-title', merge(root(o), attrs, o.attrs));
}

function postContent(o = {}) {
  const heads = {};
  for (const [tag, size] of [['h1', 'clamp(28px, 3vw, 38px)'], ['h2', 'clamp(26px, 2.6vw, 34px)'], ['h3', v('h3')], ['h4', '19px']]) heads[tag] = font({ size, weight: '700', color: c('heading'), lineHeight: '1.25em' });
  const dec = { bodyFont: { body: font({ size: '18px', color: c('body'), lineHeight: '1.8em' }), link: font({ color: c('primary') }, { color: c('primaryDark') }) }, headingFont: heads };
  return block('divi/post-content', merge(root(o), { module: { decoration: dec } }, o.attrs));
}

function postNav(o = {}) {
  return block('divi/post-nav', merge(root(o), { links: { advanced: { prevText: rv('Previous article'), nextText: rv('Next article') }, decoration: { font: font({ size: '15px', weight: '600', color: c('primary') }) } } }, o.attrs));
}

function comments(o = {}) {
  const variant = BUTTONS.primary;
  const attrs = {
    commentCount: { decoration: { font: font({ level: 'h2', size: 'clamp(24px, 2.4vw, 30px)', weight: '700', color: c('heading'), lineHeight: '1.25em' }) } },
    formTitle: { decoration: { font: font({ level: 'h3', size: v('h3'), weight: '700', color: c('heading'), lineHeight: '1.25em' }) } },
    meta: { decoration: { font: font({ size: v('small'), color: c('body') }) } },
    commentText: { decoration: { font: font({ size: v('bodySize'), color: c('body'), lineHeight: '1.7em' }) } },
    field: { decoration: { background: G({ color: c('mist') }), border: G({ radius: corners(v('radiusS')), styles: { all: { width: '1px', color: c('line') } } }), font: font({ size: '16px', color: c('heading'), lineHeight: '1.5em' }), spacing: G({ padding: box('15px', '18px') }) } },
    button: {
      decoration: {
        button: G({ enable: 'on', icon: { enable: 'off' } }),
        background: G({ color: variant.bg }, { color: variant.bgHover }),
        border: G({ radius: corners(v('radiusPill')), styles: { all: { width: '1.5px', color: variant.borderColor } } }),
        font: font({ family: fontRef('heading'), size: '16px', weight: '600', color: variant.color, lineHeight: '1.2em' }),
        spacing: G({ padding: box('15px', '30px') }),
      },
    },
  };
  return block('divi/comments', merge(root(o), attrs, o.attrs));
}

module.exports = { resp, G, S, box, corners, deco, font, root, SHADOWS, FA, section, row, grid, col, card, group, heading, display, h3, eyebrow, text, lead, small, button, linkButton, image, icon, blurb, iconList, divider, accordion, counter, contactForm, blog, code, menu, social, beforeAfter, postTitle, postContent, postNav, comments, BUTTONS };
