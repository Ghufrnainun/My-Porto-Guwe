import { useCallback, useEffect, useRef, useState } from 'react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useOsNote } from '@/components/os/OsShellContext';
import { profile } from '@/data/profile';
import {
  clampDesktopIconPosition,
  DESKTOP_EDGE_PADDING,
  DESKTOP_ICON_FOOTPRINT,
  type DesktopBounds,
  type DesktopIconPosition,
} from '@/lib/desktop-layout';

interface DesktopIconConfig {
  id: 'projects' | 'cv' | 'about';
  label: string;
  icon: string;
  defaultIndex: number;
  appId: 'projects' | 'resume' | 'about';
}

const DESKTOP_ICONS: DesktopIconConfig[] = [
  {
    id: 'projects',
    label: 'Projects',
    icon: '/macos-icons/folder.png',
    defaultIndex: 0,
    appId: 'projects',
  },
  {
    id: 'cv',
    label: 'CV.pdf',
    icon: '/macos-icons/pdf.png',
    defaultIndex: 1,
    appId: 'resume',
  },
  {
    id: 'about',
    label: 'About Me',
    icon: '/macos-icons/contacts.png',
    defaultIndex: 2,
    appId: 'about',
  },
];

const ICON_FOOTPRINT = DESKTOP_ICON_FOOTPRINT;
const EDGE_PADDING = DESKTOP_EDGE_PADDING;
const STACK_GAP_Y = 108;
const DRAG_THRESHOLD_PX = 3;

interface MarqueeRect {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

interface ContextMenuState {
  x: number;
  y: number;
  targetIconId?: DesktopIconConfig['id'];
}

export default function Index() {
  usePageMeta({
    title: `${profile.name} — Full-Stack Developer`,
    description: `${profile.name} (${profile.semester}, ${profile.location}). Full-stack developer building web applications, REST/Supabase backends, and interactive interfaces.`,
    canonicalPath: '/',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: profile.name,
      url: profile.website,
      sameAs: [profile.github, profile.linkedin],
      email: `mailto:${profile.email}`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Semarang',
        addressCountry: 'ID',
      },
    },
  });

  const { openApp, isDark, setAppearance, cycleWallpaper } = useOsNote();

  const containerRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<
    Partial<Record<DesktopIconConfig['id'], HTMLButtonElement | null>>
  >({});

  const [positions, setPositions] = useState<
    Partial<Record<DesktopIconConfig['id'], DesktopIconPosition>>
  >({});
  const [selectedIds, setSelectedIds] = useState<DesktopIconConfig['id'][]>([]);
  const [marquee, setMarquee] = useState<MarqueeRect | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  const dragSessionRef = useRef<{
    id: DesktopIconConfig['id'];
    pointerId: number;
    startClientX: number;
    startClientY: number;
    startPos: DesktopIconPosition;
    moved: boolean;
  } | null>(null);

  const suppressNextClickRef = useRef(false);

  const getDefaultPosition = useCallback(
    (defaultIndex: number): DesktopIconPosition => {
      const el = containerRef.current;
      const width = el ? el.clientWidth : 1280;
      const height = el ? el.clientHeight : 720;
      return clampDesktopIconPosition(
        {
          x: Math.max(
            EDGE_PADDING,
            width - ICON_FOOTPRINT.width - EDGE_PADDING
          ),
          y: EDGE_PADDING + defaultIndex * STACK_GAP_Y,
        },
        { width, height }
      );
    },
    []
  );

  // Re-clamp custom icon positions if viewport resizes
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => {
      const bounds = { width: el.clientWidth, height: el.clientHeight };
      setPositions((prev) => {
        const keys = Object.keys(prev) as DesktopIconConfig['id'][];
        if (keys.length === 0) return prev;
        let changed = false;
        const next: typeof prev = { ...prev };
        for (const key of keys) {
          const p = prev[key];
          if (!p) continue;
          const clamped = clampDesktopIconPosition(p, bounds);
          if (clamped.x !== p.x || clamped.y !== p.y) {
            next[key] = clamped;
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Close context menu on Escape or external pointer down
  useEffect(() => {
    if (!contextMenu) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setContextMenu(null);
    };
    const handlePointer = () => setContextMenu(null);
    window.addEventListener('keydown', handleKey);
    window.addEventListener('pointerdown', handlePointer);
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('pointerdown', handlePointer);
    };
  }, [contextMenu]);

  const openIcon = useCallback(
    (icon: DesktopIconConfig) => {
      openApp(icon.appId);
    },
    [openApp]
  );

  const handleIconPointerDown = (
    e: React.PointerEvent<HTMLButtonElement>,
    icon: DesktopIconConfig
  ) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    setContextMenu(null);

    if (e.metaKey || e.ctrlKey || e.shiftKey) {
      setSelectedIds((prev) =>
        prev.includes(icon.id)
          ? prev.filter((item) => item !== icon.id)
          : [...prev, icon.id]
      );
    } else {
      setSelectedIds([icon.id]);
    }

    const container = containerRef.current;
    const button = iconRefs.current[icon.id];
    let startPos = positions[icon.id];
    if (!startPos && container && button) {
      const cRect = container.getBoundingClientRect();
      const bRect = button.getBoundingClientRect();
      startPos = { x: bRect.left - cRect.left, y: bRect.top - cRect.top };
    }
    if (!startPos) {
      startPos = getDefaultPosition(icon.defaultIndex);
    }

    dragSessionRef.current = {
      id: icon.id,
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startPos,
      moved: false,
    };

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore synthetic events without active pointer capture support
    }
  };

  const handleIconPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const session = dragSessionRef.current;
    if (!session || session.pointerId !== e.pointerId) return;

    const dx = e.clientX - session.startClientX;
    const dy = e.clientY - session.startClientY;

    if (!session.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) {
      return;
    }
    session.moved = true;

    const container = containerRef.current;
    const bounds: DesktopBounds = container
      ? { width: container.clientWidth, height: container.clientHeight }
      : { width: 1280, height: 720 };

    const clamped = clampDesktopIconPosition(
      {
        x: session.startPos.x + dx,
        y: session.startPos.y + dy,
      },
      bounds
    );

    setPositions((prev) => ({
      ...prev,
      [session.id]: clamped,
    }));
  };

  const handleIconPointerUp = (
    e: React.PointerEvent<HTMLButtonElement>,
    icon: DesktopIconConfig
  ) => {
    const session = dragSessionRef.current;
    if (!session || session.pointerId !== e.pointerId) return;

    const didMove = session.moved;
    dragSessionRef.current = null;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore release failures on uncaptured events
    }

    if (didMove) {
      suppressNextClickRef.current = true;
      return;
    }

    // Touch / coarse pointer devices open desktop items on single tap
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(pointer: coarse)').matches
    ) {
      openIcon(icon);
    }
  };

  const handleDesktopPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || e.target !== e.currentTarget) return;
    setContextMenu(null);
    setSelectedIds([]);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMarquee({ startX: x, startY: y, currentX: x, currentY: y });
  };

  const handleDesktopPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!marquee || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const currentY = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

    const nextMarquee: MarqueeRect = { ...marquee, currentX, currentY };
    setMarquee(nextMarquee);

    const selLeft = Math.min(nextMarquee.startX, nextMarquee.currentX);
    const selTop = Math.min(nextMarquee.startY, nextMarquee.currentY);
    const selRight = Math.max(nextMarquee.startX, nextMarquee.currentX);
    const selBottom = Math.max(nextMarquee.startY, nextMarquee.currentY);

    if (selRight - selLeft < 4 && selBottom - selTop < 4) return;

    const hitIds: DesktopIconConfig['id'][] = [];
    for (const icon of DESKTOP_ICONS) {
      const btn = iconRefs.current[icon.id];
      if (!btn) continue;
      const bRect = btn.getBoundingClientRect();
      const left = bRect.left - rect.left;
      const top = bRect.top - rect.top;
      const right = left + bRect.width;
      const bottom = top + bRect.height;

      const intersects =
        left < selRight &&
        right > selLeft &&
        top < selBottom &&
        bottom > selTop;
      if (intersects) hitIds.push(icon.id);
    }
    setSelectedIds(hitIds);
  };

  const handleDesktopPointerUp = () => {
    if (marquee) setMarquee(null);
  };

  const openContextMenuAt = (
    e: React.MouseEvent,
    targetIconId?: DesktopIconConfig['id']
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const menuWidth = 220;
    const menuHeight = targetIconId ? 236 : 210;
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;
    const x = Math.max(8, Math.min(rect.width - menuWidth - 8, rawX));
    const y = Math.max(8, Math.min(rect.height - menuHeight - 8, rawY));
    if (targetIconId) {
      setSelectedIds([targetIconId]);
    }
    setContextMenu({ x, y, targetIconId });
  };

  const marqueeStyle = marquee
    ? {
        left: Math.min(marquee.startX, marquee.currentX),
        top: Math.min(marquee.startY, marquee.currentY),
        width: Math.abs(marquee.currentX - marquee.startX),
        height: Math.abs(marquee.currentY - marquee.startY),
      }
    : null;

  const targetIcon = contextMenu?.targetIconId
    ? DESKTOP_ICONS.find((item) => item.id === contextMenu.targetIconId)
    : undefined;

  return (
    <div
      ref={containerRef}
      onPointerDown={handleDesktopPointerDown}
      onPointerMove={handleDesktopPointerMove}
      onPointerUp={handleDesktopPointerUp}
      onPointerCancel={handleDesktopPointerUp}
      onContextMenu={(e) => openContextMenuAt(e)}
      className="relative h-full w-full select-none overflow-hidden"
      aria-label="ganOS Desktop"
    >
      {/* Marquee rubber-band selection box */}
      {marqueeStyle && (marqueeStyle.width > 3 || marqueeStyle.height > 3) && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute z-10 rounded-[3px] bg-white/15 ring-1 ring-inset ring-white/50"
          style={marqueeStyle}
        />
      )}

      {/* Desktop icons (top-right macOS stack, draggable) */}
      {DESKTOP_ICONS.map((icon) => {
        const isSelected = selectedIds.includes(icon.id);
        const customPos = positions[icon.id];
        const positionStyle: React.CSSProperties = customPos
          ? { left: customPos.x, top: customPos.y }
          : {
              right: EDGE_PADDING,
              top: EDGE_PADDING + icon.defaultIndex * STACK_GAP_Y,
            };

        return (
          <button
            key={icon.id}
            ref={(node) => {
              iconRefs.current[icon.id] = node;
            }}
            type="button"
            style={positionStyle}
            onPointerDown={(e) => handleIconPointerDown(e, icon)}
            onPointerMove={handleIconPointerMove}
            onPointerUp={(e) => handleIconPointerUp(e, icon)}
            onClick={(e) => {
              e.stopPropagation();
              if (suppressNextClickRef.current) {
                suppressNextClickRef.current = false;
                return;
              }
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              openIcon(icon);
            }}
            onContextMenu={(e) => openContextMenuAt(e, icon.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openIcon(icon);
              }
            }}
            aria-label={`Open ${icon.label}`}
            className="group absolute z-20 flex w-[88px] flex-col items-center gap-1 rounded-[8px] p-1 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          >
            <span
              className={[
                'flex h-16 w-16 items-center justify-center rounded-[8px] p-1 transition-colors',
                isSelected
                  ? 'bg-black/30 ring-1 ring-white/25'
                  : 'group-hover:bg-white/10',
              ].join(' ')}
            >
              <img
                src={icon.icon}
                alt=""
                draggable={false}
                className="pointer-events-none h-14 w-14 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)]"
              />
            </span>
            <span
              className={[
                'max-w-[84px] truncate rounded-[4px] px-1.5 py-[1px] text-[12px] font-medium leading-tight text-white transition-colors',
                isSelected
                  ? 'bg-[#0a5bc2] drop-shadow-none'
                  : 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]',
              ].join(' ')}
            >
              {icon.label}
            </span>
          </button>
        );
      })}

      {/* macOS Desktop Context Menu */}
      {contextMenu && (
        <div
          role="menu"
          onPointerDown={(e) => e.stopPropagation()}
          style={{ left: contextMenu.x, top: contextMenu.y }}
          className="absolute z-30 w-[220px] rounded-[10px] bg-[#f6f6f6]/90 p-1.5 text-[13px] text-black/85 shadow-[0_12px_36px_rgba(0,0,0,0.32)] ring-1 ring-black/10 backdrop-blur-[40px] dark:bg-[#231d21]/92 dark:text-white/90 dark:ring-white/15"
        >
          {targetIcon && (
            <>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  openIcon(targetIcon);
                  setContextMenu(null);
                }}
                className="flex w-full items-center justify-between rounded-[6px] px-2.5 py-1 text-left font-medium hover:bg-[#0a84ff] hover:text-white"
              >
                <span>Open {targetIcon.label}</span>
              </button>
              <div className="my-1 h-px bg-black/10 dark:bg-white/10" />
            </>
          )}

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              openApp('projects');
              setContextMenu(null);
            }}
            className="flex w-full items-center justify-between rounded-[6px] px-2.5 py-1 text-left hover:bg-[#0a84ff] hover:text-white"
          >
            <span>Open Finder</span>
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              openApp('terminal');
              setContextMenu(null);
            }}
            className="flex w-full items-center justify-between rounded-[6px] px-2.5 py-1 text-left hover:bg-[#0a84ff] hover:text-white"
          >
            <span>New Terminal Window</span>
          </button>

          <div className="my-1 h-px bg-black/10 dark:bg-white/10" />

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              openApp('settings', 'wallpaper');
              setContextMenu(null);
            }}
            className="flex w-full items-center justify-between rounded-[6px] px-2.5 py-1 text-left hover:bg-[#0a84ff] hover:text-white"
          >
            <span>Change Wallpaper…</span>
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              cycleWallpaper();
              setContextMenu(null);
            }}
            className="flex w-full items-center justify-between rounded-[6px] px-2.5 py-1 text-left hover:bg-[#0a84ff] hover:text-white"
          >
            <span>Next Wallpaper</span>
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setAppearance(isDark ? 'light' : 'dark');
              setContextMenu(null);
            }}
            className="flex w-full items-center justify-between rounded-[6px] px-2.5 py-1 text-left hover:bg-[#0a84ff] hover:text-white"
          >
            <span>
              {isDark ? 'Use Light Appearance' : 'Use Dark Appearance'}
            </span>
          </button>

          <div className="my-1 h-px bg-black/10 dark:bg-white/10" />

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setPositions({});
              setSelectedIds([]);
              setContextMenu(null);
            }}
            className="flex w-full items-center justify-between rounded-[6px] px-2.5 py-1 text-left hover:bg-[#0a84ff] hover:text-white"
          >
            <span>Clean Up Icons</span>
          </button>
        </div>
      )}
    </div>
  );
}
