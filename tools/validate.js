/**
 * Checks every generated module against a snapshot of the Divi 5.4 module schema
 * (tools/divi-5.4-schema.json): unknown modules, wrong nesting and settings that the
 * module does not have are reported. Run with: npm run validate
 */
const schema = require('./divi-5.4-schema.json').modules;
const { PAGES, THEME } = require('../src/pages');

const BREAKPOINTS = new Set(['desktop', 'tablet', 'phone']);
const problems = new Set();
let modules = 0;

/** Attribute paths of a block, cut where the responsive values begin. */
function settingPaths(obj, prefix = '', out = new Set()) {
  for (const [key, value] of Object.entries(obj)) {
    if (BREAKPOINTS.has(key) || value === null || typeof value !== 'object' || Array.isArray(value)) { out.add(prefix); continue; }
    settingPaths(value, prefix ? `${prefix}.${key}` : key, out);
  }
  return out;
}

function check(block, parent, where) {
  modules++;
  const def = schema[block.name];
  if (!def) { problems.add(`${where}: unknown module ${block.name}`); return; }
  if (parent && schema[parent.name] && schema[parent.name].children.length && !schema[parent.name].children.includes(block.name)) {
    problems.add(`${where}: ${block.name} is not a valid child of ${parent.name}`);
  }
  for (const path of settingPaths(block.attrs)) {
    if (!path) continue;
    const known = def.paths.some(p => p === path || path.startsWith(`${p}.`) || p.startsWith(`${path}.`));
    if (!known) problems.add(`${where}: ${block.name} has no setting "${path}"`);
  }
  for (const child of (block.children || []).filter(Boolean)) check(child, block, where);
}

const layouts = [...PAGES.map(p => [p.slug, p.build()]), ...Object.entries(THEME).map(([key, def]) => [`theme-${key}`, def.build()])];
for (const [name, sections] of layouts) for (const section of sections.filter(Boolean)) check(section, null, name);

if (problems.size) {
  console.error([...problems].join('\n'));
  console.error(`\n${problems.size} problem(s) in ${modules} modules.`);
  process.exit(1);
}
console.log(`OK: ${modules} modules in ${layouts.length} layouts match the Divi 5.4 schema.`);
