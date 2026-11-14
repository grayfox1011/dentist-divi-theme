/**
 * Reads the report of tools/wp/migration-report.php and tells what the installed version of
 * Divi changes in the Perla layouts when it converts them from the Divi 5.4 format.
 *
 *   node tools/compat.js report.json
 *
 * For every module it compares the settings before and after the conversion:
 *   moved    the same value is now stored under another name (nothing is lost)
 *   changed  a value was rewritten
 *   added    Divi wrote a new setting
 *   dropped  a setting disappeared without a counterpart: this is what must be looked at
 *
 * Exits with an error when modules are missing after the conversion or settings were dropped.
 */
const fs = require('fs');

const report = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const BREAKPOINTS = /\.(desktop|tablet|phone|tabletWide|phoneWide|widescreen|ultraWide)\.(value|hover|sticky)/;

/** Settings of a module as "path -> value", down to the single values. */
function flatten(value, path = '', out = new Map()) {
  if (value !== null && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length) {
    for (const [key, child] of Object.entries(value)) flatten(child, path ? `${path}.${key}` : key, out);
  } else out.set(path, JSON.stringify(value));
  return out;
}

/** The same path without the breakpoint, to group what is reported. */
const general = path => path.replace(BREAKPOINTS, '');

const totals = { layouts: 0, modules: 0, untouched: 0 };
const notes = new Map(); // "kind | module | detail" -> count
const problems = [];
const note = (kind, module, detail) => { const key = `${kind} | ${module} | ${detail}`; notes.set(key, (notes.get(key) || 0) + 1); };

for (const [name, layout] of Object.entries(report.layouts)) {
  totals.layouts++;
  if (layout.before.length !== layout.after.length) {
    problems.push(`${name}: ${layout.before.length} modules before, ${layout.after.length} after the conversion`);
    continue;
  }
  layout.before.forEach(([module, attrs], index) => {
    totals.modules++;
    const [moduleAfter, attrsAfter] = layout.after[index];
    if (module !== moduleAfter) { problems.push(`${name}: module ${index} was ${module}, is now ${moduleAfter}`); return; }

    const before = flatten(attrs), after = flatten(attrsAfter);
    const removed = [...before.keys()].filter(p => !after.has(p));
    const added = [...after.keys()].filter(p => !before.has(p));
    const rewritten = [...before.keys()].filter(p => after.has(p) && after.get(p) !== before.get(p));
    if (!removed.length && !added.length && !rewritten.length) { totals.untouched++; return; }

    for (const path of rewritten) {
      if (path === 'builderVersion') continue; // The stamp of the version that last converted the module.
      note('changed', module, `${general(path)}: ${before.get(path)} -> ${after.get(path)}`);
    }
    // A removed setting whose value turns up under a new name has moved.
    const free = new Set(added);
    for (const path of removed) {
      const target = [...free].find(p => after.get(p) === before.get(path));
      if (target) { free.delete(target); note('moved', module, `${general(path)} -> ${general(target)}`); continue; }
      note('dropped', module, `${general(path)} = ${before.get(path)}`);
      problems.push(`${name}: ${module} lost "${path}" (${before.get(path)})`);
    }
    for (const path of free) note('added', module, `${general(path)} = ${after.get(path)}`);
  });
}

console.log(`Divi ${report.divi}: ${totals.layouts} layouts, ${totals.modules} modules, ${totals.untouched} left exactly as they are.`);
for (const kind of ['moved', 'changed', 'added', 'dropped']) {
  const lines = [...notes].filter(([key]) => key.startsWith(`${kind} |`));
  if (!lines.length) continue;
  console.log(`\n${kind.toUpperCase()}`);
  for (const [key, count] of lines.sort()) console.log(`  ${String(count).padStart(4)} x ${key.slice(kind.length + 3)}`);
}

if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n${[...new Set(problems)].slice(0, 30).join('\n')}`);
  process.exit(1);
}
console.log('\nOK: every module is still there and no setting was dropped.');
