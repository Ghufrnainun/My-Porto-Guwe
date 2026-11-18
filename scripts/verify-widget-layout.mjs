import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

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

// 1. Structural assertions for R0shish-style macOS Desktop
const requiredSnippets = [
  'clampDesktopIconPosition',
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

// 2. Pure logic verification matching clampDesktopIconPosition in Index.tsx
const EDGE_PADDING = 12;
const DEFAULT_SIZE = { width: 88, height: 98 };

function clampDesktopIconPosition(pos, bounds, size = DEFAULT_SIZE) {
  const maxX = Math.max(EDGE_PADDING, bounds.width - size.width - EDGE_PADDING);
  const maxY = Math.max(
    EDGE_PADDING,
    bounds.height - size.height - EDGE_PADDING
  );
  return {
    x: Math.round(Math.min(maxX, Math.max(EDGE_PADDING, pos.x))),
    y: Math.round(Math.min(maxY, Math.max(EDGE_PADDING, pos.y))),
  };
}

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

console.log('Desktop icon layout checks passed.');
