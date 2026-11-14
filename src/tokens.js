/**
 * Design tokens of the theme. Everything a buyer may want to restyle lives here and is
 * exported to Divi 5 as Global Colors and Design Variables (Variable Manager).
 */
const crypto = require('crypto');

const BRAND = {
  themeName: 'Perla',
  clinicName: 'Perla Dental Studio',
  headingFont: 'Plus Jakarta Sans',
  bodyFont: 'Inter',
};

/** Stable, Divi-style ids (gcid-xxxxxxxxxx / gvid-xxxxxxxxxx) derived from the token name. */
function makeId(prefix, name) {
  const hex = crypto.createHash('sha1').update(`perla:${prefix}:${name}`).digest('hex');
  return `${prefix}-${BigInt('0x' + hex.slice(0, 16)).toString(36).padStart(10, '0').slice(0, 10)}`;
}

// The first four ids are Divi's own built-in global colors (linked to the Theme Customizer).
const COLORS = {
  primary: { id: 'gcid-primary-color', label: 'Primary Color', value: '#1a66e8' },
  secondary: { id: 'gcid-secondary-color', label: 'Secondary Color', value: '#12b5a5' },
  heading: { id: 'gcid-heading-color', label: 'Heading Text Color', value: '#0b1b3f' },
  body: { id: 'gcid-body-color', label: 'Body Text Color', value: '#4b5a75' },
  primaryDark: { label: 'Primary – Hover', value: '#114db8' },
  dark: { label: 'Dark Background', value: '#081632' },
  tint: { label: 'Soft Blue Background', value: '#edf4ff' },
  mist: { label: 'Light Background', value: '#f6f9fe' },
  line: { label: 'Borders', value: '#dce6f4' },
  white: { label: 'White', value: '#ffffff' },
  star: { label: 'Rating Stars', value: '#ffb020' },
};
for (const [name, def] of Object.entries(COLORS)) def.id = def.id || makeId('gcid', name);

const NUMBERS = {
  container: { label: 'Layout – Content Max Width', value: '1200px' },
  sectionY: { label: 'Layout – Section Padding', value: 'clamp(64px, 8vw, 120px)' },
  sectionYSmall: { label: 'Layout – Section Padding Small', value: 'clamp(40px, 5vw, 72px)' },
  gapL: { label: 'Layout – Column Gap Large', value: 'clamp(32px, 5vw, 80px)' },
  gapM: { label: 'Layout – Card Gap', value: 'clamp(20px, 2.4vw, 32px)' },
  cardPad: { label: 'Layout – Card Padding', value: 'clamp(24px, 2.6vw, 36px)' },
  radiusL: { label: 'Radius – Images & Panels', value: '28px' },
  radiusM: { label: 'Radius – Cards', value: '20px' },
  radiusS: { label: 'Radius – Fields', value: '12px' },
  radiusPill: { label: 'Radius – Buttons', value: '999px' },
  display: { label: 'Type – Display (H1)', value: 'clamp(40px, 5.4vw, 68px)' },
  h2: { label: 'Type – Section Title (H2)', value: 'clamp(30px, 3.6vw, 46px)' },
  h3: { label: 'Type – Card Title (H3)', value: 'clamp(20px, 1.7vw, 24px)' },
  lead: { label: 'Type – Lead Paragraph', value: 'clamp(17px, 1.4vw, 20px)' },
  bodySize: { label: 'Type – Body', value: '17px' },
  small: { label: 'Type – Small', value: '15px' },
  eyebrow: { label: 'Type – Eyebrow Label', value: '13px' },
};

const STRINGS = {
  clinicName: { label: 'Clinic Name', value: BRAND.clinicName },
  phone: { label: 'Phone Number', value: '(217) 555-0142' },
  email: { label: 'Email Address', value: 'smile@example.com' },
  address: { label: 'Address', value: '128 Harbor Street, Springfield, IL' },
  hours: { label: 'Opening Hours (short)', value: 'Mon–Fri 8am–7pm · Sat 9am–2pm' },
  bookLabel: { label: 'Button – Book', value: 'Book a visit' },
};

const LINKS = {
  bookUrl: { label: 'Booking Page', value: '/contact/' },
  phoneUrl: { label: 'Phone Link', value: 'tel:+12175550142' },
  emailUrl: { label: 'Email Link', value: 'mailto:smile@example.com' },
};

const GROUPS = { numbers: NUMBERS, strings: STRINGS, links: LINKS };
for (const [type, group] of Object.entries(GROUPS)) for (const [name, def] of Object.entries(group)) { def.id = makeId('gvid', name); def.type = type; }

const variableRef = (type, name, settings = {}) => `$variable(${JSON.stringify({ type, value: { name, settings } })})$`;

/** Reference to a global color, optionally with opacity (0-100). */
function color(name, opacity) {
  if (!COLORS[name]) throw new Error(`Unknown color token: ${name}`);
  return variableRef('color', COLORS[name].id, opacity === undefined ? {} : { opacity });
}

/** Reference to a number / string / link design variable. */
function v(name) {
  const def = NUMBERS[name] || STRINGS[name] || LINKS[name];
  if (!def) throw new Error(`Unknown variable token: ${name}`);
  return variableRef('content', def.id);
}

/** Reference to the global heading / body font set in the Theme Customizer. */
const fontRef = which => variableRef('content', which === 'heading' ? '--et_global_heading_font' : '--et_global_body_font');

/** Divi dynamic content, e.g. dynamic('home_url'). */
const dynamic = name => variableRef('content', name);

const STAMP = '2026-11-11T00:00:00.000Z';

/** Preview only: the font variables of the builder (on a site they mirror the Theme Customizer). */
function exportFontVariables() {
  return [
    { id: '--et_global_heading_font', label: 'Heading', value: BRAND.headingFont, groupKey: 'fonts', status: 'active', order: 1, lastUpdated: STAMP, type: 'fonts' },
    { id: '--et_global_body_font', label: 'Body', value: BRAND.bodyFont, groupKey: 'fonts', status: 'active', order: 2, lastUpdated: STAMP, type: 'fonts' },
  ];
}

/** Preview only: all colours as builder "colors" variables, including the four Customizer-linked ones. */
function exportColorVariables() {
  return Object.values(COLORS).map((col, i) => ({ id: col.id, label: col.label, value: col.value, groupKey: 'colors', status: 'active', order: i + 1, lastUpdated: STAMP, type: 'colors' }));
}

/** global_colors array in Divi 5 portability format. */
function exportGlobalColors() {
  return Object.values(COLORS).map((c, i) => [c.id, { id: c.id, lastUpdated: STAMP, label: c.label, color: c.value, order: String(i + 1), status: 'active', folder: '', usedInPosts: [] }]);
}

/** global_variables array in Divi 5 portability format (the same shape Divi writes into layout exports). */
function exportGlobalVariables() {
  const out = [];
  for (const group of Object.values(GROUPS)) for (const d of Object.values(group)) out.push({ id: d.id, label: d.label, value: d.value, status: 'active', type: d.type });
  return out;
}

module.exports = { BRAND, COLORS, NUMBERS, STRINGS, LINKS, color, v, fontRef, dynamic, exportGlobalColors, exportGlobalVariables, exportFontVariables, exportColorVariables, makeId };
