export interface DesktopIconPosition {
  x: number;
  y: number;
}

export interface DesktopBounds {
  width: number;
  height: number;
}

export const DESKTOP_ICON_FOOTPRINT = { width: 88, height: 98 };
export const DESKTOP_EDGE_PADDING = 12;

/** Clamp a desktop icon coordinate inside the current desktop viewport bounds. */
export function clampDesktopIconPosition(
  pos: DesktopIconPosition,
  bounds: DesktopBounds,
  size: { width: number; height: number } = DESKTOP_ICON_FOOTPRINT,
): DesktopIconPosition {
  const maxX = Math.max(DESKTOP_EDGE_PADDING, bounds.width - size.width - DESKTOP_EDGE_PADDING);
  const maxY = Math.max(DESKTOP_EDGE_PADDING, bounds.height - size.height - DESKTOP_EDGE_PADDING);
  return {
    x: Math.round(Math.min(maxX, Math.max(DESKTOP_EDGE_PADDING, pos.x))),
    y: Math.round(Math.min(maxY, Math.max(DESKTOP_EDGE_PADDING, pos.y))),
  };
}
