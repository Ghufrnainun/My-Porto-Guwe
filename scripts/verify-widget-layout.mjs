import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {
  arrangeDesktopWidgets,
  clampDesktopIconPosition,
  DESKTOP_WIDGET_BOTTOM_RESERVED,
  DESKTOP_WIDGET_RIGHT_RESERVED,
  findNonOverlappingWidgetPosition,
  rectsOverlapWithGap,
} from '../src/lib/desktop-layout.ts';

const indexPath = path.resolve(process.cwd(), 'src/pages/Index.tsx');
const layoutHelperPath = path.resolve(
  process.cwd(),
  'src/lib/desktop-layout.ts'
);
const source = fs.readFileSync(indexPath, 'utf8');
const helperSource = fs.readFileSync(layoutHelperPath, 'utf8');

assert.ok(
  helperSource.includes('export function clampDesktopIconPosition'),
  'Expected src/lib/desktop-layout.ts to export clampDesktopIconPosition'
);
assert.ok(
  helperSource.includes('export function arrangeDesktopWidgets'),
  'Expected src/lib/desktop-layout.ts to export arrangeDesktopWidgets'
);
assert.ok(
  helperSource.includes('export function findNonOverlappingWidgetPosition'),
  'Expected src/lib/desktop-layout.ts to export findNonOverlappingWidgetPosition'
);

// 1. Structural assertions for R0shish-style macOS Desktop
const requiredSnippets = [
  'clampDesktopIconPosition',
  'arrangeDesktopWidgets',
  'findNonOverlappingWidgetPosition',
  "id: 'projects'",
  "label: 'Projects'",
  "'/macos-icons/folder.png'",
  "id: 'cv'",
  "label: 'CV.pdf'",
  "'/macos-icons/pdf.png'",
  "id: 'about'",
  "label: 'About Me'",
  "'/macos-icons/contacts.png'",
  "id: 'blog'",
  "label: 'Blog'",
  "'/macos-icons/folder-documents.png'",
  'WIDGET_CATALOG',
  'Edit Widgets…',
  'handleDesktopPointerDown',
  'openContextMenuAt',
  'role="menu"',
  'Change Wallpaper',
];

for (const snippet of requiredSnippets) {
  assert.ok(
    source.includes(snippet),
    `Expected src/pages/Index.tsx to include "${snippet}"`
  );
}

// Ensure legacy multi-card dashboard widgets are removed from desktop home
for (const legacySnippet of [
  'portoku-widget-positions-v2',
  'DraggableCard',
  'sticky-note',
]) {
  assert.ok(
    !source.includes(legacySnippet),
    `Expected legacy widget snippet "${legacySnippet}" to be removed from src/pages/Index.tsx`
  );
}

// 2. Icon clamping verification
assert.deepEqual(
  clampDesktopIconPosition({ x: -120, y: -40 }, { width: 1280, height: 720 }),
  { x: 12, y: 12 },
  'Negative coordinates should clamp to top-left edge padding'
);

assert.deepEqual(
  clampDesktopIconPosition({ x: 5000, y: 5000 }, { width: 1280, height: 720 }),
  { x: 1180, y: 610 },
  'Overflowing coordinates should clamp inside viewport bounds'
);

assert.deepEqual(
  clampDesktopIconPosition({ x: 320, y: 210 }, { width: 1280, height: 720 }),
  { x: 320, y: 210 },
  'In-bounds coordinates should remain unchanged'
);

assert.deepEqual(
  clampDesktopIconPosition({ x: 200, y: 200 }, { width: 60, height: 60 }),
  { x: 12, y: 12 },
  'Tiny viewports should clamp safely to edge padding without NaN/negative bounds'
);

// Helper to assert zero overlap across arranged widgets
function assertZeroOverlap(items, positions, minGap = 0) {
  const rects = items.map((item) => {
    const pos = positions[item.id];
    assert.ok(pos, `Expected arranged position for widget "${item.id}"`);
    assert.ok(
      Number.isFinite(pos.x) && Number.isFinite(pos.y),
      `Expected finite coordinates for widget "${item.id}"`
    );
    return { id: item.id, x: pos.x, y: pos.y, width: item.width, height: item.height };
  });

  for (let i = 0; i < rects.length; i += 1) {
    for (let j = i + 1; j < rects.length; j += 1) {
      assert.equal(
        rectsOverlapWithGap(rects[i], rects[j], minGap),
        false,
        `Widgets "${rects[i].id}" (${JSON.stringify(rects[i])}) and "${rects[j].id}" (${JSON.stringify(rects[j])}) should not overlap`
      );
    }
  }
  return rects;
}

// 3. Default 3 widgets should keep signature left Sonoma cluster with exact coordinates
const defaultThree = [
  { id: 'github', width: 196, height: 196 },
  { id: 'weather', width: 186, height: 186 },
  { id: 'music', width: 394, height: 192 },
];
const arrangedDefaultThree = arrangeDesktopWidgets(defaultThree, {
  width: 1440,
  height: 868,
});
assert.deepEqual(arrangedDefaultThree, {
  github: { x: 18, y: 18 },
  weather: { x: 226, y: 18 },
  music: { x: 18, y: 226 },
});
assertZeroOverlap(defaultThree, arrangedDefaultThree, 12);

// 4. All 7 widgets at default sizes on 1440x868 should stay inside safe bounds with zero overlap
const allSevenDefault = [
  { id: 'github', width: 196, height: 196 },
  { id: 'weather', width: 186, height: 186 },
  { id: 'clock', width: 186, height: 186 },
  { id: 'profile', width: 186, height: 196 },
  { id: 'music', width: 394, height: 192 },
  { id: 'shipped', width: 368, height: 184 },
  { id: 'memo', width: 368, height: 154 },
];
const arrangedSeven = arrangeDesktopWidgets(allSevenDefault, {
  width: 1440,
  height: 868,
});
const sevenRects = assertZeroOverlap(allSevenDefault, arrangedSeven, 12);
for (const rect of sevenRects) {
  assert.ok(
    rect.x + rect.width <= 1440 - DESKTOP_WIDGET_RIGHT_RESERVED,
    `Widget "${rect.id}" should stay clear of right desktop icons`
  );
  assert.ok(
    rect.y + rect.height <= 868 - DESKTOP_WIDGET_BOTTOM_RESERVED,
    `Widget "${rect.id}" should stay clear of bottom dock`
  );
}

// 5. Resized 6 widgets (regression test for overlapping widgets on Clean Up Desktop)
const resizedSix = [
  { id: 'github', width: 260, height: 240 },
  { id: 'weather', width: 280, height: 240 },
  { id: 'profile', width: 240, height: 240 },
  { id: 'music', width: 440, height: 230 },
  { id: 'shipped', width: 360, height: 210 },
  { id: 'memo', width: 460, height: 200 },
];
for (const viewport of [
  { width: 1440, height: 868 },
  { width: 1280, height: 688 },
]) {
  const arrangedResized = arrangeDesktopWidgets(resizedSix, viewport);
  const rects = assertZeroOverlap(resizedSix, arrangedResized, 12);
  for (const rect of rects) {
    assert.ok(rect.x >= 12 && rect.y >= 12, `Widget "${rect.id}" should stay inside padding`);
    assert.ok(
      rect.x + rect.width <= viewport.width - 12 &&
        rect.y + rect.height <= viewport.height - 12,
      `Widget "${rect.id}" should stay inside viewport ${viewport.width}x${viewport.height}`
    );
  }
}

// 6. Adding a new widget when preferred defaultPos is already occupied should find a free slot
const occupied = [
  { x: 18, y: 18, width: 260, height: 240 },
  { x: 290, y: 18, width: 280, height: 240 },
];
const addedPos = findNonOverlappingWidgetPosition(
  { width: 186, height: 196 },
  { x: 424, y: 18 },
  occupied,
  { width: 1440, height: 868 }
);
const addedRect = { x: addedPos.x, y: addedPos.y, width: 186, height: 196 };
for (const rect of occupied) {
  assert.equal(
    rectsOverlapWithGap(addedRect, rect, 12),
    false,
    'Newly added widget should not overlap existing widgets'
  );
}

console.log('Desktop icon & widget layout checks passed.');
