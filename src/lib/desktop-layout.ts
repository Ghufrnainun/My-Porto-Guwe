export interface DesktopIconPosition {
  x: number;
  y: number;
}

export interface DesktopBounds {
  width: number;
  height: number;
}

export interface DesktopRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DesktopWidgetLayoutInput<T extends string = string> {
  id: T;
  width: number;
  height: number;
}

export interface ArrangeWidgetsOptions {
  padding?: number;
  gap?: number;
  rightReserved?: number;
  bottomReserved?: number;
  preferredClusterWidth?: number;
}

export const DESKTOP_ICON_FOOTPRINT = { width: 88, height: 98 };
export const DESKTOP_EDGE_PADDING = 12;
export const DESKTOP_WIDGET_PADDING = 18;
export const DESKTOP_WIDGET_GAP = 12;
export const DESKTOP_WIDGET_RIGHT_RESERVED =
  DESKTOP_ICON_FOOTPRINT.width + DESKTOP_EDGE_PADDING * 2;
export const DESKTOP_WIDGET_BOTTOM_RESERVED = 96;
export const DESKTOP_WIDGET_CLUSTER_WIDTH = 394;

/** Clamp a desktop icon or widget coordinate inside the current desktop viewport bounds. */
export function clampDesktopIconPosition(
  pos: DesktopIconPosition,
  bounds: DesktopBounds,
  size: { width: number; height: number } = DESKTOP_ICON_FOOTPRINT,
): DesktopIconPosition {
  const maxX = Math.max(
    DESKTOP_EDGE_PADDING,
    bounds.width - size.width - DESKTOP_EDGE_PADDING,
  );
  const maxY = Math.max(
    DESKTOP_EDGE_PADDING,
    bounds.height - size.height - DESKTOP_EDGE_PADDING,
  );
  return {
    x: Math.round(Math.min(maxX, Math.max(DESKTOP_EDGE_PADDING, pos.x))),
    y: Math.round(Math.min(maxY, Math.max(DESKTOP_EDGE_PADDING, pos.y))),
  };
}

/** Check whether two rectangles overlap when inflated by a minimum gap margin. */
export function rectsOverlapWithGap(
  a: DesktopRect,
  b: DesktopRect,
  gap: number = 0,
): boolean {
  return (
    a.x < b.x + b.width + gap &&
    a.x + a.width + gap > b.x &&
    a.y < b.y + b.height + gap &&
    a.y + a.height + gap > b.y
  );
}

function overlapArea(a: DesktopRect, b: DesktopRect): number {
  const xOverlap = Math.max(
    0,
    Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x),
  );
  const yOverlap = Math.max(
    0,
    Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y),
  );
  return xOverlap * yOverlap;
}

function uniqueSorted(values: number[]): number[] {
  return Array.from(new Set(values)).sort((a, b) => a - b);
}

function tryShelfPack<T extends string>(
  items: readonly DesktopWidgetLayoutInput<T>[],
  maxRight: number,
  maxBottom: number,
  padding: number,
  gap: number,
): Partial<Record<T, DesktopIconPosition>> | null {
  interface Shelf {
    y: number;
    height: number;
    nextX: number;
    locked: boolean;
  }

  const shelves: Shelf[] = [];
  const positions: Partial<Record<T, DesktopIconPosition>> = {};

  for (const item of items) {
    if (padding + item.width > maxRight) return null;

    let placed = false;
    for (const shelf of shelves) {
      const fitsWidth = shelf.nextX + item.width <= maxRight;
      const fitsHeight = shelf.locked
        ? item.height <= shelf.height
        : shelf.y + Math.max(shelf.height, item.height) <= maxBottom;

      if (fitsWidth && fitsHeight) {
        positions[item.id] = { x: Math.round(shelf.nextX), y: Math.round(shelf.y) };
        shelf.nextX += item.width + gap;
        if (!shelf.locked) {
          shelf.height = Math.max(shelf.height, item.height);
        }
        placed = true;
        break;
      }
    }

    if (!placed) {
      const prevShelf = shelves[shelves.length - 1];
      if (prevShelf) {
        prevShelf.locked = true;
      }
      const nextY = prevShelf ? prevShelf.y + prevShelf.height + gap : padding;
      if (nextY + item.height > maxBottom) return null;

      positions[item.id] = { x: Math.round(padding), y: Math.round(nextY) };
      shelves.push({
        y: nextY,
        height: item.height,
        nextX: padding + item.width + gap,
        locked: false,
      });
    }
  }

  return positions;
}

function findSkylineSlot(
  size: { width: number; height: number },
  placed: readonly DesktopRect[],
  maxRight: number,
  maxBottom: number,
  padding: number,
  gap: number,
): DesktopIconPosition | null {
  if (padding + size.width > maxRight || padding + size.height > maxBottom) {
    return null;
  }

  const candidateXs = uniqueSorted([
    padding,
    ...placed.map((r) => r.x),
    ...placed.map((r) => r.x + r.width + gap),
  ]).filter((x) => x >= padding && x + size.width <= maxRight);

  const candidateYs = uniqueSorted([
    padding,
    ...placed.map((r) => r.y),
    ...placed.map((r) => r.y + r.height + gap),
  ]).filter((y) => y >= padding && y + size.height <= maxBottom);

  for (const y of candidateYs) {
    for (const x of candidateXs) {
      const candidate: DesktopRect = {
        x,
        y,
        width: size.width,
        height: size.height,
      };
      if (!placed.some((r) => rectsOverlapWithGap(candidate, r, gap))) {
        return { x: Math.round(x), y: Math.round(y) };
      }
    }
  }

  return null;
}

function trySkylinePack<T extends string>(
  items: readonly DesktopWidgetLayoutInput<T>[],
  maxRight: number,
  maxBottom: number,
  padding: number,
  gap: number,
): Partial<Record<T, DesktopIconPosition>> | null {
  const placed: DesktopRect[] = [];
  const positions: Partial<Record<T, DesktopIconPosition>> = {};

  for (const item of items) {
    const slot = findSkylineSlot(item, placed, maxRight, maxBottom, padding, gap);
    if (!slot) return null;
    positions[item.id] = slot;
    placed.push({ x: slot.x, y: slot.y, width: item.width, height: item.height });
  }

  return positions;
}

function packWithMinOverlap<T extends string>(
  items: readonly DesktopWidgetLayoutInput<T>[],
  bounds: DesktopBounds,
  padding: number,
  gap: number,
): Partial<Record<T, DesktopIconPosition>> {
  const placed: DesktopRect[] = [];
  const positions: Partial<Record<T, DesktopIconPosition>> = {};

  for (const item of items) {
    const maxX = Math.max(
      DESKTOP_EDGE_PADDING,
      bounds.width - item.width - DESKTOP_EDGE_PADDING,
    );
    const maxY = Math.max(
      DESKTOP_EDGE_PADDING,
      bounds.height - item.height - DESKTOP_EDGE_PADDING,
    );

    const candidateXs = uniqueSorted([
      Math.min(maxX, padding),
      maxX,
      ...placed.map((r) =>
        Math.min(maxX, Math.max(DESKTOP_EDGE_PADDING, r.x)),
      ),
      ...placed.map((r) =>
        Math.min(maxX, Math.max(DESKTOP_EDGE_PADDING, r.x + r.width + gap)),
      ),
    ]);

    const candidateYs = uniqueSorted([
      Math.min(maxY, padding),
      maxY,
      ...placed.map((r) =>
        Math.min(maxY, Math.max(DESKTOP_EDGE_PADDING, r.y)),
      ),
      ...placed.map((r) =>
        Math.min(maxY, Math.max(DESKTOP_EDGE_PADDING, r.y + r.height + gap)),
      ),
    ]);

    let bestPos: DesktopIconPosition = clampDesktopIconPosition(
      { x: padding, y: padding },
      bounds,
      item,
    );
    let bestScore = Number.POSITIVE_INFINITY;

    for (const y of candidateYs) {
      for (const x of candidateXs) {
        const cand: DesktopRect = {
          x,
          y,
          width: item.width,
          height: item.height,
        };
        let totalOverlap = 0;
        for (const r of placed) {
          totalOverlap += overlapArea(cand, r);
        }
        const score = totalOverlap * 1_000_000 + y * 1000 + x;
        if (score < bestScore) {
          bestScore = score;
          bestPos = { x: Math.round(x), y: Math.round(y) };
        }
      }
    }

    positions[item.id] = bestPos;
    placed.push({
      x: bestPos.x,
      y: bestPos.y,
      width: item.width,
      height: item.height,
    });
  }

  return positions;
}

/**
 * Arrange all enabled desktop widgets into a clean, non-overlapping 2D grid
 * respecting each widget's actual dimensions, desktop icons clearance, and dock clearance.
 */
export function arrangeDesktopWidgets<T extends string>(
  items: readonly DesktopWidgetLayoutInput<T>[],
  bounds: DesktopBounds,
  options: ArrangeWidgetsOptions = {},
): Partial<Record<T, DesktopIconPosition>> {
  if (items.length === 0) return {};

  const safeBounds: DesktopBounds = {
    width: bounds.width > 0 ? bounds.width : 1280,
    height: bounds.height > 0 ? bounds.height : 720,
  };

  const padding = options.padding ?? DESKTOP_WIDGET_PADDING;
  const gap = options.gap ?? DESKTOP_WIDGET_GAP;
  const rightReserved = options.rightReserved ?? DESKTOP_WIDGET_RIGHT_RESERVED;
  const bottomReserved = options.bottomReserved ?? DESKTOP_WIDGET_BOTTOM_RESERVED;
  const clusterWidth =
    options.preferredClusterWidth ?? DESKTOP_WIDGET_CLUSTER_WIDTH;

  const safeMaxRight = Math.max(padding + 160, safeBounds.width - rightReserved);
  const safeMaxBottom = Math.max(
    padding + 160,
    safeBounds.height - bottomReserved,
  );
  const fullMaxRight = Math.max(
    DESKTOP_EDGE_PADDING + 160,
    safeBounds.width - DESKTOP_EDGE_PADDING,
  );
  const fullMaxBottom = Math.max(
    DESKTOP_EDGE_PADDING + 160,
    safeBounds.height - DESKTOP_EDGE_PADDING,
  );

  // Pass 1: Keep small widget sets (<= 4) in the signature compact left-hand Sonoma cluster when it fits
  if (items.length <= 4) {
    const maxItemWidth = Math.max(...items.map((item) => item.width));
    const clusterMaxRight = Math.min(
      safeMaxRight,
      padding + Math.max(clusterWidth, maxItemWidth),
    );
    const clusterLayout = tryShelfPack(
      items,
      clusterMaxRight,
      safeMaxBottom,
      padding,
      gap,
    );
    if (clusterLayout) return clusterLayout;
  }

  // Pass 2 & 3: Safe zone (clear of right desktop icons and bottom Dock)
  const safeShelf = tryShelfPack(items, safeMaxRight, safeMaxBottom, padding, gap);
  if (safeShelf) return safeShelf;

  const safeSkyline = trySkylinePack(
    items,
    safeMaxRight,
    safeMaxBottom,
    padding,
    gap,
  );
  if (safeSkyline) return safeSkyline;

  // Pass 4: Relax bottom dock clearance while still keeping right desktop icons clear
  const relaxedBottomShelf = tryShelfPack(
    items,
    safeMaxRight,
    fullMaxBottom,
    padding,
    gap,
  );
  if (relaxedBottomShelf) return relaxedBottomShelf;

  const relaxedBottomSkyline = trySkylinePack(
    items,
    safeMaxRight,
    fullMaxBottom,
    padding,
    gap,
  );
  if (relaxedBottomSkyline) return relaxedBottomSkyline;

  // Pass 5: Full desktop viewport with standard gap
  const fullShelf = tryShelfPack(items, fullMaxRight, fullMaxBottom, padding, gap);
  if (fullShelf) return fullShelf;

  const fullSkyline = trySkylinePack(
    items,
    fullMaxRight,
    fullMaxBottom,
    padding,
    gap,
  );
  if (fullSkyline) return fullSkyline;

  // Pass 6: Full desktop viewport with slightly tighter 8px gap
  const compactSkyline = trySkylinePack(
    items,
    fullMaxRight,
    fullMaxBottom,
    DESKTOP_EDGE_PADDING,
    Math.min(8, gap),
  );
  if (compactSkyline) return compactSkyline;

  // Pass 7: Last-resort minimum-overlap placement for extreme tiny viewports
  return packWithMinOverlap(items, safeBounds, DESKTOP_EDGE_PADDING, Math.min(8, gap));
}

/**
 * Find a clean, non-overlapping position for a single widget being added to the desktop.
 * Prefers `preferredPos` if it fits inside the safe desktop area without colliding.
 */
export function findNonOverlappingWidgetPosition(
  size: { width: number; height: number },
  preferredPos: DesktopIconPosition,
  occupiedRects: readonly DesktopRect[],
  bounds: DesktopBounds,
  options: ArrangeWidgetsOptions = {},
): DesktopIconPosition {
  const safeBounds: DesktopBounds = {
    width: bounds.width > 0 ? bounds.width : 1280,
    height: bounds.height > 0 ? bounds.height : 720,
  };

  const padding = options.padding ?? DESKTOP_WIDGET_PADDING;
  const gap = options.gap ?? DESKTOP_WIDGET_GAP;
  const rightReserved = options.rightReserved ?? DESKTOP_WIDGET_RIGHT_RESERVED;
  const bottomReserved = options.bottomReserved ?? DESKTOP_WIDGET_BOTTOM_RESERVED;

  const safeMaxRight = Math.max(padding + 160, safeBounds.width - rightReserved);
  const safeMaxBottom = Math.max(
    padding + 160,
    safeBounds.height - bottomReserved,
  );
  const fullMaxRight = Math.max(
    DESKTOP_EDGE_PADDING + 160,
    safeBounds.width - DESKTOP_EDGE_PADDING,
  );
  const fullMaxBottom = Math.max(
    DESKTOP_EDGE_PADDING + 160,
    safeBounds.height - DESKTOP_EDGE_PADDING,
  );

  // Check preferred position first if it stays inside safe bounds without colliding
  const preferredFitsSafe =
    preferredPos.x >= padding &&
    preferredPos.y >= padding &&
    preferredPos.x + size.width <= safeMaxRight &&
    preferredPos.y + size.height <= safeMaxBottom;

  if (preferredFitsSafe) {
    const preferredRect: DesktopRect = {
      x: preferredPos.x,
      y: preferredPos.y,
      width: size.width,
      height: size.height,
    };
    if (!occupiedRects.some((r) => rectsOverlapWithGap(preferredRect, r, gap))) {
      return { x: Math.round(preferredPos.x), y: Math.round(preferredPos.y) };
    }
  }

  return (
    findSkylineSlot(size, occupiedRects, safeMaxRight, safeMaxBottom, padding, gap) ??
    findSkylineSlot(size, occupiedRects, safeMaxRight, fullMaxBottom, padding, gap) ??
    findSkylineSlot(size, occupiedRects, fullMaxRight, fullMaxBottom, padding, gap) ??
    findSkylineSlot(
      size,
      occupiedRects,
      fullMaxRight,
      fullMaxBottom,
      DESKTOP_EDGE_PADDING,
      Math.min(8, gap),
    ) ??
    clampDesktopIconPosition(preferredPos, safeBounds, size)
  );
}
