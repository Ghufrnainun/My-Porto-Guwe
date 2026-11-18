import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const source = await readFile(new URL('../src/pages/Index.tsx', import.meta.url), 'utf8');
const file = ts.createSourceFile('Index.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const declaration = file.statements
  .filter(ts.isVariableStatement)
  .flatMap((statement) => statement.declarationList.declarations)
  .find((item) => item.name.getText(file) === 'parseWidgetOffset');
assert.ok(declaration?.initializer, 'Index.tsx must define the widget offset validator');

const js = ts.transpileModule(declaration.getText(file), { compilerOptions: { target: ts.ScriptTarget.ES2020 } }).outputText;
const parseWidgetOffset = new Function(`${js}; return parseWidgetOffset;`)();
assert.deepEqual(parseWidgetOffset({ x: 16, y: -32.5 }), { x: 16, y: -32.5 });
for (const invalid of [null, [], {}, { x: '16', y: 2 }, { x: 1, y: Infinity }, { x: NaN, y: 1 }]) {
  assert.equal(parseWidgetOffset(invalid), null, `reject invalid offset: ${String(invalid)}`);
}

const layoutGuard = file.statements
  .filter(ts.isVariableStatement)
  .flatMap((statement) => statement.declarationList.declarations)
  .find((item) => item.name.getText(file) === 'canRestoreWidgetLayout');
assert.ok(layoutGuard?.initializer, 'Index.tsx must reject offsets from different viewport layouts');
const layoutJs = ts.transpileModule(layoutGuard.getText(file), { compilerOptions: { target: ts.ScriptTarget.ES2020 } }).outputText;
const canRestoreWidgetLayout = new Function(`${layoutJs}; return canRestoreWidgetLayout;`)();
assert.ok(canRestoreWidgetLayout(1440, 1440), 'restore offsets at the saved desktop width');
assert.ok(canRestoreWidgetLayout(1440, 1500), 'restore offsets within the same layout and 10% width');
assert.equal(canRestoreWidgetLayout(920, 850), false, 'reject offsets across the 900px single/two-column breakpoint');
assert.equal(canRestoreWidgetLayout(850, 920), false, 'reject offsets when returning across the 900px breakpoint');
assert.equal(canRestoreWidgetLayout(1440, 1100), false, 'reject offsets across the 1200px layout change');
assert.equal(canRestoreWidgetLayout(1440, 1600), false, 'reject offsets after a materially different resize');
assert.equal(canRestoreWidgetLayout(0, 1440), false, 'reject invalid saved width');
assert.match(source, /if \(!canRestoreWidgetLayout\(layoutWidth\.current, window\.innerWidth\)\) \{\s*x\.set\(0\);\s*y\.set\(0\);\s*layoutInvalidated\.current = true;\s*return;/, 'live desktop resize must reset offsets without saving across layouts');
assert.match(source, /portoku-widget-positions-v2/, 'redesign must not reuse the old saved-position key');
const widgetIds = [...source.matchAll(/<DraggableCard id="([^"]+)"/g)].map(([, id]) => id);
assert.deepEqual(widgetIds, ['profile', 'recent-projects', 'local-time', 'github', 'sticky-note', 'work-base'], 'all six existing widgets must render in order on the home desktop');
assert.equal(new Set(widgetIds).size, 6, 'each existing widget must render exactly once');
assert.doesNotMatch(source, /widgetsOpen|Desktop widgets|>Widgets</, 'widgets must not live behind a separate view');
assert.match(source, /<div className="grid grid-cols-1 content-start gap-3 sm:gap-4 min-\[900px\]:grid-cols-2 min-\[1200px\]:grid-cols-3">/, 'home widgets must use explicit responsive tracks that can shrink below min-content width');
assert.match(source, /overflow-x-hidden overflow-y-auto/, 'the home scroll container must not create horizontal scrolling');
assert.match(source, /className=\{`min-w-0 max-w-full \$\{className\}`\}/, 'widget cards must shrink within narrow grid tracks');
assert.match(source, /x: enabled \? x : 0, y: enabled \? y : 0/, 'saved drag transforms must not shift cards on narrow or coarse-pointer layouts');
assert.match(source, /overflow-y-auto/, 'home content must remain vertically scrollable on mobile');
assert.match(source, /pb-\[calc\(160px\+env\(safe-area-inset-bottom\)\)\]/, 'mobile desktop content must clear the dock');
assert.match(source, /<Link to="\/projects"/, 'project route shortcut stays on the home desktop');
assert.match(source, /<Link to="\/about"/, 'about route shortcut stays on the home desktop');
assert.match(source, /<Link to="\/resume"/, 'resume route shortcut stays on the home desktop');
assert.match(source, /Reset layout/, 'layout reset stays available on the desktop');
console.log('Widget offset validation and viewport layout guard verified.');
