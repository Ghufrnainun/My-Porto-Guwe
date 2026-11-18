import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Check,
  Maximize2,
  Minimize2,
  Minus,
  Moon,
  Plus,
  Search,
  SlidersHorizontal,
  Sun,
  Wifi,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { profile } from '@/data/profile';
import { featuredProjects } from '@/data/featuredProjects';
import {
  OsShellContext,
  WALLPAPERS,
  WindowFocusContext,
  type OsAppearance,
  type OsAppId,
  type OsPowerState,
  type SettingsPaneId,
  type WallpaperId,
} from '@/components/os/OsShellContext';
import {
  MailApp,
  NotesApp,
  SystemSettingsApp,
  TerminalApp,
} from '@/components/os/OsBuiltInApps';
import { Avatar } from '@/components/os/OsWindowChrome';
import { MacOSDock, type MacOSDockItem } from '@/components/ui/mac-os-dock';

type OsShellProps = {
  appName: string;
  mode: 'desktop' | 'window';
  lockScreen?: boolean;
  children: ReactNode;
  renderWindow?: (path: string) => ReactNode;
};

type WindowFrame = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type OsWindow = {
  id: OsAppId;
  path?: string;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  frame: WindowFrame;
};

type MenuEntry =
  | 'separator'
  | {
      label: string;
      disabled?: boolean;
      checked?: boolean;
      onClick?: () => void;
    };

type MenuDef = {
  id: string;
  label: ReactNode;
  entries: MenuEntry[];
};

const MENUBAR_HEIGHT = 32;
const DOCK_RESERVED_HEIGHT = 92;
const WALLPAPER_STORAGE_KEY = 'ganos-wallpaper-v2';
const WALLPAPER_ROTATE_INTERVAL_MS = 120_000;

const APP_SPECS: Record<
  OsAppId,
  {
    name: string;
    title: string;
    icon: string;
    path?: string;
    size: { width: number; height: number };
    minSize: { width: number; height: number };
  }
> = {
  projects: {
    name: 'Finder',
    title: 'Finder',
    icon: '/macos-icons/finder.png',
    path: '/projects',
    size: { width: 920, height: 560 },
    minSize: { width: 420, height: 280 },
  },
  blog: {
    name: 'Writing',
    title: 'Writing',
    icon: '/macos-icons/safari.png',
    path: '/blog',
    size: { width: 880, height: 580 },
    minSize: { width: 420, height: 300 },
  },
  about: {
    name: 'Contacts',
    title: 'Contacts',
    icon: '/macos-icons/contacts.png',
    path: '/about',
    size: { width: 640, height: 480 },
    minSize: { width: 380, height: 340 },
  },
  notes: {
    name: 'Notes',
    title: 'Notes',
    icon: '/macos-icons/notes.png',
    size: { width: 880, height: 560 },
    minSize: { width: 420, height: 280 },
  },
  terminal: {
    name: 'Terminal',
    title: 'Terminal',
    icon: '/macos-icons/terminal.png',
    size: { width: 680, height: 440 },
    minSize: { width: 380, height: 260 },
  },
  resume: {
    name: 'Preview',
    title: 'CV.pdf',
    icon: '/macos-icons/preview.png',
    path: '/resume',
    size: { width: 780, height: 580 },
    minSize: { width: 400, height: 320 },
  },
  mail: {
    name: 'Mail',
    title: 'New Message',
    icon: '/macos-icons/mail.png',
    size: { width: 560, height: 460 },
    minSize: { width: 380, height: 320 },
  },
  settings: {
    name: 'System Settings',
    title: 'System Settings',
    icon: '/macos-icons/settings.png',
    size: { width: 780, height: 540 },
    minSize: { width: 500, height: 360 },
  },
};

const isValidWallpaperId = (value: unknown): value is WallpaperId =>
  typeof value === 'string' && WALLPAPERS.some((item) => item.id === value);

const readWallpaperPrefs = (): { id: WallpaperId; autoRotate: boolean } => {
  if (typeof window === 'undefined') return { id: 'dusk', autoRotate: true };
  try {
    const raw = JSON.parse(
      window.localStorage.getItem(WALLPAPER_STORAGE_KEY) ?? 'null',
    ) as { id?: unknown; autoRotate?: unknown } | null;
    return {
      id: isValidWallpaperId(raw?.id) ? raw.id : 'dusk',
      autoRotate:
        typeof raw?.autoRotate === 'boolean' ? raw.autoRotate : true,
    };
  } catch {
    return { id: 'dusk', autoRotate: true };
  }
};

const computeDefaultFrame = (
  appId: OsAppId,
  cascadeIndex: number,
): WindowFrame => {
  const spec = APP_SPECS[appId];
  if (typeof window === 'undefined') {
    return {
      x: 160 + (cascadeIndex % 5) * 24,
      y: 64 + (cascadeIndex % 5) * 24,
      width: spec.size.width,
      height: spec.size.height,
    };
  }
  const vw = window.innerWidth;
  const vh = window.innerHeight - MENUBAR_HEIGHT;
  if (vw < 768) {
    return {
      x: 8,
      y: 8,
      width: Math.max(280, vw - 16),
      height: Math.max(320, vh - 86),
    };
  }
  const width = Math.min(spec.size.width, vw - 40);
  const height = Math.min(spec.size.height, vh - DOCK_RESERVED_HEIGHT - 24);
  const offset = (cascadeIndex % 6) * 22;
  return {
    x: Math.max(8, Math.round((vw - width) / 2 - 40 + offset)),
    y: Math.max(8, Math.round((vh - DOCK_RESERVED_HEIGHT - height) / 2 + offset)),
    width,
    height,
  };
};

const routeToAppId = (pathname: string): OsAppId | null => {
  if (pathname === '/projects' || pathname.startsWith('/projects/'))
    return 'projects';
  if (pathname === '/about') return 'about';
  if (pathname === '/resume') return 'resume';
  if (pathname === '/blog' || pathname.startsWith('/blog/')) return 'blog';
  return null;
};

export function OsShell({ appName, children, renderWindow }: OsShellProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { setTheme, resolvedTheme } = useTheme();
  const reduceMotion = useReducedMotion();

  const currentRouteApp = routeToAppId(location.pathname);
  const routePath = `${location.pathname}${location.search}${location.hash}`;

  const [now, setNow] = useState(() => new Date());
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [launcherQuery, setLauncherQuery] = useState('');
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [spotlightQuery, setSpotlightQuery] = useState('');
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [power, setPower] = useState<OsPowerState>('on');
  const [brightness, setBrightness] = useState(1);
  const [appearance, setAppearanceState] = useState<OsAppearance>('dark');
  const [settingsPane, setSettingsPane] = useState<SettingsPaneId>('about');
  const [notesPayload, setNotesPayload] = useState<string | undefined>();
  const [launchingId, setLaunchingId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dockRevealed, setDockRevealed] = useState(false);
  const [note, setNote] = useState(
    'A note to self: make useful things, keep learning, and leave the codebase better than you found it.',
  );

  const [wallpaperId, setWallpaperId] = useState<WallpaperId>(
    () => readWallpaperPrefs().id,
  );
  const [autoRotateWallpaper, setAutoRotateWallpaper] = useState<boolean>(
    () => readWallpaperPrefs().autoRotate,
  );

  const [windows, setWindows] = useState<OsWindow[]>(() => {
    if (!currentRouteApp) return [];
    return [
      {
        id: currentRouteApp,
        path: routePath,
        zIndex: 10,
        isMinimized: false,
        isMaximized: false,
        frame: computeDefaultFrame(currentRouteApp, 0),
      },
    ];
  });
  const [focusedId, setFocusedId] = useState<OsAppId | null>(currentRouteApp);

  const menubarRef = useRef<HTMLElement>(null);
  const zCounter = useRef(12);
  const dragRef = useRef<{
    id: OsAppId;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  const isDark =
    appearance === 'auto'
      ? resolvedTheme !== 'light'
      : appearance === 'dark';

  const setAppearance = useCallback(
    (next: OsAppearance) => {
      setAppearanceState(next);
      setTheme(next === 'auto' ? 'system' : next);
    },
    [setTheme],
  );

  const activeWallpaper = useMemo(
    () => WALLPAPERS.find((w) => w.id === wallpaperId) ?? WALLPAPERS[0],
    [wallpaperId],
  );

  const cycleWallpaper = useCallback(() => {
    setWallpaperId((current) => {
      const idx = WALLPAPERS.findIndex((item) => item.id === current);
      return WALLPAPERS[(idx + 1) % WALLPAPERS.length].id;
    });
  }, []);

  // Persist wallpaper choice
  useEffect(() => {
    try {
      window.localStorage.setItem(
        WALLPAPER_STORAGE_KEY,
        JSON.stringify({ id: wallpaperId, autoRotate: autoRotateWallpaper }),
      );
    } catch {
      /* ignore */
    }
  }, [wallpaperId, autoRotateWallpaper]);

  // Auto-rotate wallpaper every 2 minutes when enabled
  useEffect(() => {
    if (!autoRotateWallpaper) return;
    const timer = window.setInterval(cycleWallpaper, WALLPAPER_ROTATE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [autoRotateWallpaper, cycleWallpaper]);

  // Clock ticker
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Browser fullscreen listener
  useEffect(() => {
    const onFs = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  // Sync URL route into window stack
  useEffect(() => {
    if (!currentRouteApp) return;
    const nextZ = ++zCounter.current;
    setFocusedId(currentRouteApp);
    setWindows((current) => {
      const existing = current.find((w) => w.id === currentRouteApp);
      if (existing) {
        return current.map((w) =>
          w.id === currentRouteApp
            ? { ...w, path: routePath, isMinimized: false, zIndex: nextZ }
            : w,
        );
      }
      return [
        ...current,
        {
          id: currentRouteApp,
          path: routePath,
          zIndex: nextZ,
          isMinimized: false,
          isMaximized: false,
          frame: computeDefaultFrame(currentRouteApp, current.length),
        },
      ];
    });
  }, [currentRouteApp, routePath]);

  // Close menus on outside click
  useEffect(() => {
    if (!openMenu) return;
    const onPointerDown = (event: globalThis.PointerEvent) => {
      if (!menubarRef.current?.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };
    window.addEventListener('pointerdown', onPointerDown);
    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, [openMenu]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (power !== 'on') return;
      if (event.key === 'Escape') {
        setOpenMenu(null);
        setLauncherOpen(false);
        setSpotlightOpen(false);
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpenMenu(null);
        setLauncherOpen(false);
        setSpotlightOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [power]);

  // Keep windows clamped on viewport resize
  useEffect(() => {
    const onResize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight - MENUBAR_HEIGHT;
      setWindows((current) =>
        current.map((w) => {
          if (vw < 768) {
            return {
              ...w,
              frame: {
                x: 8,
                y: 8,
                width: Math.max(280, vw - 16),
                height: Math.max(320, vh - 86),
              },
            };
          }
          const width = Math.min(w.frame.width, vw - 24);
          const height = Math.min(w.frame.height, vh - 40);
          return {
            ...w,
            frame: {
              x: Math.max(8, Math.min(w.frame.x, vw - width - 8)),
              y: Math.max(4, Math.min(w.frame.y, vh - height - 20)),
              width,
              height,
            },
          };
        }),
      );
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const focusWindow = useCallback(
    (id: OsAppId) => {
      const nextZ = ++zCounter.current;
      setFocusedId(id);
      setWindows((current) =>
        current.map((w) =>
          w.id === id ? { ...w, zIndex: nextZ, isMinimized: false } : w,
        ),
      );
      const spec = APP_SPECS[id];
      const existing = windows.find((w) => w.id === id);
      const targetPath = existing?.path ?? spec.path;
      if (targetPath && targetPath !== routePath) {
        navigate(targetPath);
      }
    },
    [navigate, routePath, windows],
  );

  const openApp = useCallback(
    (id: OsAppId, payload?: string) => {
      setOpenMenu(null);
      setLauncherOpen(false);
      setSpotlightOpen(false);

      if (id === 'settings' && payload) {
        setSettingsPane(payload as SettingsPaneId);
      }
      if (id === 'notes' && payload) {
        setNotesPayload(payload);
      }

      const alreadyOpen = windows.some((w) => w.id === id);
      if (!alreadyOpen) {
        setLaunchingId(id);
        window.setTimeout(
          () => setLaunchingId((curr) => (curr === id ? null : curr)),
          750,
        );
      }

      const spec = APP_SPECS[id];
      const targetPath =
        id === 'projects' && payload
          ? `/projects/${payload}`
          : spec.path;

      const nextZ = ++zCounter.current;
      setFocusedId(id);
      setWindows((current) => {
        const existing = current.find((w) => w.id === id);
        if (existing) {
          return current.map((w) =>
            w.id === id
              ? {
                  ...w,
                  path: targetPath ?? w.path,
                  zIndex: nextZ,
                  isMinimized: false,
                }
              : w,
          );
        }
        return [
          ...current,
          {
            id,
            path: targetPath,
            zIndex: nextZ,
            isMinimized: false,
            isMaximized: false,
            frame: computeDefaultFrame(id, current.length),
          },
        ];
      });

      if (targetPath && targetPath !== routePath) {
        navigate(targetPath);
      }
    },
    [navigate, routePath, windows],
  );

  const closeWindow = useCallback(
    (id: OsAppId) => {
      setWindows((current) => {
        const remaining = current.filter((w) => w.id !== id);
        const topVisible = [...remaining]
          .filter((w) => !w.isMinimized)
          .sort((a, b) => b.zIndex - a.zIndex)[0];
        setFocusedId(topVisible?.id ?? null);
        if (APP_SPECS[id].path) {
          const nextRouteWindow = [...remaining]
            .filter((w) => !w.isMinimized && Boolean(w.path))
            .sort((a, b) => b.zIndex - a.zIndex)[0];
          const nextPath = nextRouteWindow?.path ?? '/';
          if (nextPath !== routePath) navigate(nextPath);
        }
        return remaining;
      });
    },
    [navigate, routePath],
  );

  const minimizeWindow = useCallback(
    (id: OsAppId) => {
      setWindows((current) => {
        const next = current.map((w) =>
          w.id === id ? { ...w, isMinimized: true } : w,
        );
        const topVisible = [...next]
          .filter((w) => !w.isMinimized)
          .sort((a, b) => b.zIndex - a.zIndex)[0];
        setFocusedId(topVisible?.id ?? null);
        if (APP_SPECS[id].path) {
          const nextRouteWindow = [...next]
            .filter((w) => !w.isMinimized && Boolean(w.path))
            .sort((a, b) => b.zIndex - a.zIndex)[0];
          const nextPath = nextRouteWindow?.path ?? '/';
          if (nextPath !== routePath) navigate(nextPath);
        }
        return next;
      });
    },
    [navigate, routePath],
  );

  const toggleMaximize = useCallback((id: OsAppId) => {
    setWindows((current) =>
      current.map((w) =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized } : w,
      ),
    );
  }, []);

  const focusDesktop = useCallback(() => {
    setFocusedId(null);
    setOpenMenu(null);
    if (routePath !== '/') navigate('/');
  }, [navigate, routePath]);

  const startWindowDrag = (
    id: OsAppId,
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    const win = windows.find((w) => w.id === id);
    if (!win || win.isMaximized || window.innerWidth < 768) return;
    if (
      !(event.target as HTMLElement).closest('.handle') ||
      (event.target as HTMLElement).closest(
        'button, input, textarea, a, .window-controls',
      )
    ) {
      return;
    }
    dragRef.current = {
      id,
      startX: event.clientX,
      startY: event.clientY,
      origX: win.frame.x,
      origY: win.frame.y,
    };
    const onMove = (moveEvent: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const dx = moveEvent.clientX - drag.startX;
      const dy = moveEvent.clientY - drag.startY;
      setWindows((current) =>
        current.map((w) =>
          w.id === drag.id
            ? {
                ...w,
                frame: {
                  ...w.frame,
                  x: Math.max(
                    80 - w.frame.width,
                    Math.min(drag.origX + dx, window.innerWidth - 80),
                  ),
                  y: Math.max(
                    0,
                    Math.min(
                      drag.origY + dy,
                      window.innerHeight - MENUBAR_HEIGHT - 56,
                    ),
                  ),
                },
              }
            : w,
        ),
      );
    };
    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const toggleBrowserFullscreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void document.documentElement.requestFullscreen?.();
    }
  };

  const maximizedWindow = windows.find(
    (w) => w.isMaximized && !w.isMinimized,
  );

  const focusedAppSpec = focusedId ? APP_SPECS[focusedId] : null;
  const activeMenuAppName = focusedAppSpec?.name ?? (appName === 'Finder' ? 'Finder' : appName);

  const menus: MenuDef[] = [
    {
      id: 'apple',
      label: (
        <img
          src="/macos-icons/apple.png"
          alt="Apple"
          className={cn('h-[15px] w-[13px] object-contain', !activeWallpaper.isLight && 'invert')}
        />
      ),
      entries: [
        { label: 'About This Mac', onClick: () => openApp('about') },
        'separator',
        {
          label: 'System Settings…',
          onClick: () => openApp('settings', 'about'),
        },
        'separator',
        { label: 'Sleep', onClick: () => setPower('sleeping') },
        { label: 'Lock Screen', onClick: () => setPower('locked') },
      ],
    },
    {
      id: 'app',
      label: <span className="font-bold">{activeMenuAppName}</span>,
      entries: [
        {
          label: 'About This Portfolio',
          onClick: () => openApp('settings', 'about'),
        },
        'separator',
        {
          label: `Hide ${activeMenuAppName}`,
          disabled: !focusedId,
          onClick: () => focusedId && minimizeWindow(focusedId),
        },
        {
          label: `Quit ${activeMenuAppName}`,
          disabled: !focusedId,
          onClick: () => focusedId && closeWindow(focusedId),
        },
      ],
    },
    {
      id: 'file',
      label: 'File',
      entries: [
        { label: 'New Finder Window', onClick: () => openApp('projects') },
        { label: 'New Terminal Window', onClick: () => openApp('terminal') },
        { label: 'New Message', onClick: () => openApp('mail') },
        'separator',
        {
          label: 'Close Window',
          disabled: !focusedId,
          onClick: () => focusedId && closeWindow(focusedId),
        },
      ],
    },
    {
      id: 'edit',
      label: 'Edit',
      entries: [
        {
          label: 'Copy Email Address',
          onClick: () => void navigator.clipboard?.writeText(profile.email),
        },
        {
          label: 'Copy Portfolio Link',
          onClick: () =>
            void navigator.clipboard?.writeText(window.location.href),
        },
      ],
    },
    {
      id: 'view',
      label: 'View',
      entries: [
        {
          label: maximizedWindow ? 'Restore Window' : 'Zoom Window',
          disabled: !focusedId,
          onClick: () => focusedId && toggleMaximize(focusedId),
        },
        'separator',
        {
          label: 'Dark Mode',
          checked: isDark,
          onClick: () => setAppearance(isDark ? 'light' : 'dark'),
        },
        {
          label: 'Auto-Rotate Wallpaper',
          checked: autoRotateWallpaper,
          onClick: () => setAutoRotateWallpaper((v) => !v),
        },
      ],
    },
    {
      id: 'go',
      label: 'Go',
      entries: [
        { label: 'Projects', onClick: () => openApp('projects') },
        { label: 'About Me', onClick: () => openApp('about') },
        { label: 'CV.pdf', onClick: () => openApp('resume') },
        { label: 'Writing Log', onClick: () => openApp('blog') },
        'separator',
        {
          label: 'GitHub',
          onClick: () => window.open(profile.github, '_blank', 'noreferrer'),
        },
        {
          label: 'LinkedIn',
          onClick: () => window.open(profile.linkedin, '_blank', 'noreferrer'),
        },
        {
          label: 'Legacy Portfolio (/old)',
          onClick: () => navigate('/old'),
        },
      ],
    },
    {
      id: 'window',
      label: 'Window',
      entries: [
        {
          label: 'Minimize',
          disabled: !focusedId,
          onClick: () => focusedId && minimizeWindow(focusedId),
        },
        {
          label: 'Zoom',
          disabled: !focusedId,
          onClick: () => focusedId && toggleMaximize(focusedId),
        },
        ...(windows.length ? (['separator'] as const) : []),
        ...windows.map((w) => ({
          label: APP_SPECS[w.id].title,
          checked: w.id === focusedId && !w.isMinimized,
          onClick: () => focusWindow(w.id),
        })),
      ],
    },
    {
      id: 'help',
      label: 'Help',
      entries: [
        { label: 'Terminal Commands', onClick: () => openApp('terminal') },
        { label: 'Contact Ghufron…', onClick: () => openApp('mail') },
        'separator',
        {
          label: 'View Source on GitHub',
          onClick: () =>
            window.open(
              'https://github.com/Ghufrnainun/My-Porto-Guwe',
              '_blank',
              'noreferrer',
            ),
        },
      ],
    },
  ];

  // Dock groups matching R0shish 1:1
  const dockOrder: OsAppId[] = [
    'projects',
    'blog',
    'about',
    'notes',
    'terminal',
    'mail',
    'settings',
  ];

  const makeDockItem = (id: OsAppId): MacOSDockItem => {
    const spec = APP_SPECS[id];
    const isRunning =
      id === 'projects' || windows.some((w) => w.id === id);
    return {
      key: id,
      title: spec.name,
      iconSrc: spec.icon,
      isRunning,
      isLaunching: launchingId === id,
      onClick: () => openApp(id),
    };
  };

  const minimizedItems: MacOSDockItem[] = windows
    .filter((w) => w.isMinimized)
    .map((w) => ({
      key: `minimized-${w.id}`,
      title: APP_SPECS[w.id].title,
      iconSrc: APP_SPECS[w.id].icon,
      isMinimizedWindow: true,
      onClick: () => focusWindow(w.id),
    }));

  const dockGroups: MacOSDockItem[][] = [
    [
      makeDockItem('projects'),
      {
        key: 'apps',
        title: 'Apps',
        iconSrc: '/macos-icons/apps.png',
        onClick: () => {
          setOpenMenu(null);
          setLauncherOpen((v) => !v);
        },
      },
      makeDockItem('blog'),
      makeDockItem('about'),
      makeDockItem('notes'),
      makeDockItem('terminal'),
      makeDockItem('mail'),
      {
        key: 'vscode',
        title: 'Visual Studio Code',
        iconSrc: '/macos-icons/vscode.png',
        onClick: () =>
          window.open(
            'https://github.com/Ghufrnainun/My-Porto-Guwe',
            '_blank',
            'noreferrer',
          ),
      },
      makeDockItem('settings'),
    ],
    windows
      .filter((w) => !dockOrder.includes(w.id))
      .map((w) => makeDockItem(w.id)),
    [
      ...minimizedItems,
      {
        key: 'trash',
        title: 'Trash',
        iconSrc: '/macos-icons/trash.png',
        onClick: () => openApp('projects'),
      },
    ],
  ].filter((group) => group.length > 0);

  // Spotlight search items
  const spotlightResults = useMemo(() => {
    const q = spotlightQuery.trim().toLowerCase();
    const all = [
      ...(Object.keys(APP_SPECS) as OsAppId[]).map((id) => ({
        id: `app:${id}`,
        category: 'Applications',
        title: APP_SPECS[id].name,
        subtitle: APP_SPECS[id].title,
        icon: APP_SPECS[id].icon,
        action: () => openApp(id),
      })),
      ...featuredProjects.map((project) => ({
        id: `project:${project.slug}`,
        category: 'Projects',
        title: project.title,
        subtitle: `${project.year} · ${project.role}`,
        icon: '/macos-icons/folder.png',
        action: () => openApp('projects', project.slug),
      })),
      {
        id: 'link:github',
        category: 'Links',
        title: 'GitHub',
        subtitle: profile.github,
        icon: '/macos-icons/vscode.png',
        action: () => window.open(profile.github, '_blank', 'noreferrer'),
      },
      {
        id: 'link:old',
        category: 'Links',
        title: 'Legacy Portfolio (/old)',
        subtitle: 'View previous editorial design',
        icon: '/macos-icons/safari.png',
        action: () => navigate('/old'),
      },
    ];
    if (!q) return all.slice(0, 8);
    return all.filter((item) =>
      `${item.title} ${item.subtitle} ${item.category}`
        .toLowerCase()
        .includes(q),
    );
  }, [navigate, openApp, spotlightQuery]);

  const formattedDate = now
    .toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      timeZone: 'Asia/Jakarta',
    })
    .replace(',', '');
  const formattedTime = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  });

  const shellContextValue = {
    note,
    setNote,
    activePath: routePath,
    wallpaperId,
    wallpaperLabel: activeWallpaper.label,
    setWallpaperId,
    cycleWallpaper,
    autoRotateWallpaper,
    setAutoRotateWallpaper,
    appearance,
    setAppearance,
    isDark,
    brightness,
    setBrightness,
    openApp,
    settingsPane,
    setSettingsPane,
    power,
    setPower,
    isFocused: true,
  };

  const launcherApps = (Object.keys(APP_SPECS) as OsAppId[]).filter((id) =>
    APP_SPECS[id].name.toLowerCase().includes(launcherQuery.toLowerCase()),
  );

  return (
    <OsShellContext.Provider value={shellContextValue}>
      <main className="gh-os relative h-[100svh] w-screen overflow-hidden select-none text-[13px] antialiased">
        {/* Wallpaper */}
        <div aria-hidden="true" className="absolute inset-0 bg-black">
          {WALLPAPERS.map((wallpaper) => (
            <div
              key={wallpaper.id}
              className="absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none"
              style={{
                background: wallpaper.background,
                opacity: wallpaper.id === activeWallpaper.id ? 1 : 0,
              }}
            />
          ))}
        </div>

        {/* Desktop surface */}
        <div
          className="absolute inset-x-0 bottom-0"
          style={{ top: MENUBAR_HEIGHT }}
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) focusDesktop();
          }}
        >
          {children}
        </div>

        {/* Floating Windows */}
        {windows.map((win) => {
          if (win.isMinimized) return null;
          const isFocused = focusedId === win.id;
          const spec = APP_SPECS[win.id];
          const style: React.CSSProperties = win.isMaximized
            ? {
                left: 0,
                top: MENUBAR_HEIGHT,
                width: '100vw',
                height: `calc(100svh - ${MENUBAR_HEIGHT}px)`,
                zIndex: win.zIndex,
              }
            : {
                left: win.frame.x,
                top: win.frame.y + MENUBAR_HEIGHT,
                width: win.frame.width,
                height: win.frame.height,
                zIndex: win.zIndex,
              };

          return (
            <div
              key={win.id}
              role="dialog"
              aria-label={spec.title}
              style={style}
              onPointerDownCapture={() => {
                if (focusedId !== win.id) focusWindow(win.id);
              }}
              onPointerDown={(event) => startWindowDrag(win.id, event)}
              onDoubleClick={(event) => {
                if (
                  (event.target as HTMLElement).closest('.handle') &&
                  !(event.target as HTMLElement).closest('button, input, a')
                ) {
                  toggleMaximize(win.id);
                }
              }}
              className={cn(
                'absolute flex flex-col overflow-hidden transition-[border-radius,box-shadow] duration-200',
                !win.isMaximized && 'rounded-[26px]',
                !isFocused && 'inactive-window',
              )}
            >
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 420, damping: 38 }}
                className={cn(
                  'relative flex h-full w-full flex-col overflow-hidden bg-[#e8e6ea]/75 text-[13px] text-black/85 ring-[0.5px] ring-black/40 backdrop-blur-3xl backdrop-saturate-150 dark:bg-[#3a3039]/70 dark:text-white/90',
                  'after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.5)] dark:after:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.13)]',
                  !win.isMaximized && 'rounded-[26px]',
                  isFocused
                    ? 'shadow-[0_30px_80px_rgba(0,0,0,0.55),0_0_0_0.5px_rgba(0,0,0,0.6)]'
                    : 'shadow-[0_14px_36px_rgba(0,0,0,0.35)]',
                  win.isMaximized && 'rounded-none shadow-none ring-0',
                )}
              >
                {/* Traffic light controls matching R0shish */}
                <div className="window-controls group/lights absolute left-[19px] top-[19px] z-20 flex gap-[9px]">
                  <button
                    type="button"
                    aria-label="Close"
                    onClick={() => closeWindow(win.id)}
                    className={cn(
                      'flex h-[14px] w-[14px] items-center justify-center rounded-full ring-[0.5px] ring-inset ring-black/20 enabled:active:brightness-75',
                      isFocused
                        ? 'bg-[#ff5f57]'
                        : 'bg-black/15 group-hover/lights:bg-[#ff5f57] dark:bg-white/20',
                    )}
                  >
                    <X
                      size={8}
                      strokeWidth={3}
                      className="text-[#4d0000] opacity-0 transition-opacity group-hover/lights:opacity-100"
                    />
                  </button>
                  <button
                    type="button"
                    aria-label="Minimize"
                    onClick={() => minimizeWindow(win.id)}
                    className={cn(
                      'flex h-[14px] w-[14px] items-center justify-center rounded-full ring-[0.5px] ring-inset ring-black/20 enabled:active:brightness-75',
                      isFocused
                        ? 'bg-[#febc2e]'
                        : 'bg-black/15 group-hover/lights:bg-[#febc2e] dark:bg-white/20',
                    )}
                  >
                    <Minus
                      size={8}
                      strokeWidth={3}
                      className="text-[#985700] opacity-0 transition-opacity group-hover/lights:opacity-100"
                    />
                  </button>
                  <button
                    type="button"
                    aria-label={win.isMaximized ? 'Restore' : 'Maximize'}
                    onClick={() => toggleMaximize(win.id)}
                    className={cn(
                      'flex h-[14px] w-[14px] items-center justify-center rounded-full ring-[0.5px] ring-inset ring-black/20 enabled:active:brightness-75',
                      isFocused
                        ? 'bg-[#28c840]'
                        : 'bg-black/15 group-hover/lights:bg-[#28c840] dark:bg-white/20',
                    )}
                  >
                    <Plus
                      size={8}
                      strokeWidth={3}
                      className="text-[#006500] opacity-0 transition-opacity group-hover/lights:opacity-100"
                    />
                  </button>
                </div>

                {/* Window body */}
                <div className="relative min-h-0 flex-grow">
                  <WindowFocusContext.Provider value={isFocused}>
                    {win.id === 'settings' ? (
                      <SystemSettingsApp />
                    ) : win.id === 'notes' ? (
                      <NotesApp initialId={notesPayload} />
                    ) : win.id === 'terminal' ? (
                      <TerminalApp onClose={() => closeWindow('terminal')} />
                    ) : win.id === 'mail' ? (
                      <MailApp />
                    ) : win.path && renderWindow ? (
                      <div className="h-full overflow-y-auto bg-white dark:bg-[#282025]">
                        {renderWindow(win.path)}
                      </div>
                    ) : (
                      <div className="h-full overflow-y-auto bg-white dark:bg-[#282025]">
                        {children}
                      </div>
                    )}
                  </WindowFocusContext.Provider>
                </div>
              </motion.div>
            </div>
          );
        })}

        {/* Dock */}
        <div className="pointer-events-none absolute inset-x-0 bottom-2 z-[26] flex justify-center [&>*]:pointer-events-auto">
          <MacOSDock
            groups={dockGroups}
            isHidden={Boolean(maximizedWindow) && !dockRevealed}
            onRevealChange={setDockRevealed}
          />
        </div>

        {/* Apps Launcher */}
        <AnimatePresence>
          {launcherOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(event) => {
                if (event.target === event.currentTarget)
                  setLauncherOpen(false);
              }}
              className="absolute inset-0 z-[25] flex flex-col items-center bg-black/30 pt-[8vh] text-white backdrop-blur-3xl"
            >
              <div className="flex h-9 w-60 items-center gap-2 rounded-full bg-white/15 px-3 shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.25)]">
                <Search size={14} className="opacity-70" />
                <input
                  autoFocus
                  value={launcherQuery}
                  onChange={(event) => setLauncherQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && launcherApps[0]) {
                      openApp(launcherApps[0]);
                    }
                  }}
                  placeholder="Search"
                  className="flex-grow bg-transparent text-[14px] outline-none placeholder:text-white/60"
                />
              </div>
              <motion.div
                initial={{ scale: 1.06 }}
                animate={{ scale: 1 }}
                exit={{ scale: 1.06 }}
                transition={{ duration: 0.22 }}
                onClick={(event) => {
                  if (event.target === event.currentTarget)
                    setLauncherOpen(false);
                }}
                className="mt-[8vh] grid w-full max-w-5xl grid-cols-[repeat(auto-fill,120px)] justify-center gap-x-8 gap-y-6 px-8"
              >
                {launcherApps.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => openApp(id)}
                    className="flex cursor-default flex-col items-center gap-2"
                  >
                    <img
                      src={APP_SPECS[id].icon}
                      alt=""
                      className="h-24 w-24 object-contain active:brightness-75"
                    />
                    <span className="text-[13px] [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
                      {APP_SPECS[id].name}
                    </span>
                  </button>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Menu Bar (32px, transparent over wallpaper) */}
        <header className="pointer-events-none absolute inset-x-0 top-0 z-30 [&>*]:pointer-events-auto">
          <nav
            ref={menubarRef}
            style={{ height: MENUBAR_HEIGHT }}
            className={cn(
              'flex items-center justify-between text-[13px] font-medium transition-colors',
              maximizedWindow
                ? 'bg-[#ececec]/90 text-black backdrop-blur-2xl dark:bg-[#1e1e1e]/90 dark:text-white'
                : activeWallpaper.isLight
                  ? 'text-black'
                  : 'text-white [text-shadow:0_0_8px_rgba(0,0,0,0.25)]',
            )}
          >
            <div className="flex h-full items-center pl-2.5">
              {menus.map((menu) => (
                <div
                  key={menu.id}
                  className={cn(
                    'relative',
                    !['apple', 'app'].includes(menu.id) && 'hidden md:block',
                  )}
                >
                  <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={openMenu === menu.id}
                    onClick={() =>
                      setOpenMenu(openMenu === menu.id ? null : menu.id)
                    }
                    onMouseEnter={() => openMenu && setOpenMenu(menu.id)}
                    className={cn(
                      'flex h-6 cursor-default items-center rounded-full px-2.5',
                      menu.id === 'apple' && 'px-3',
                      openMenu === menu.id && 'bg-white/20',
                    )}
                  >
                    {menu.label}
                  </button>
                  {openMenu === menu.id && (
                    <div
                      role="menu"
                      className="absolute left-0 top-full z-50 mt-1 min-w-[230px] rounded-[13px] bg-[#f4f2f5]/85 p-[5px] text-[13px] font-normal text-black shadow-[0_12px_40px_rgba(0,0,0,0.35),inset_0_0_0_0.5px_rgba(255,255,255,0.25)] ring-[0.5px] ring-black/30 backdrop-blur-2xl backdrop-saturate-150 [text-shadow:none] dark:bg-[#2a2429]/80 dark:text-white"
                    >
                      {menu.entries.map((entry, idx) =>
                        entry === 'separator' ? (
                          <div
                            key={idx}
                            role="separator"
                            className="mx-2.5 my-[5px] h-px bg-black/10 dark:bg-white/10"
                          />
                        ) : (
                          <button
                            key={entry.label}
                            type="button"
                            disabled={entry.disabled}
                            onClick={() => {
                              setOpenMenu(null);
                              entry.onClick?.();
                            }}
                            className="flex h-[24px] w-full cursor-default items-center rounded-[7px] pl-1.5 pr-5 text-left hover:bg-[#0a84ff] hover:text-white disabled:opacity-30"
                          >
                            <span className="w-4 shrink-0">
                              {entry.checked && <Check size={11} />}
                            </span>
                            {entry.label}
                          </button>
                        ),
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Status Bar */}
            <div className="mr-2.5 flex h-full items-center gap-0.5">
              {/* Battery indicator matching R0shish */}
              <div
                className="hidden h-6 items-center px-2 sm:flex"
                title="Battery 100%, charged"
              >
                <div className="relative h-[12px] w-[25px] rounded-[4px] border border-current p-[1.5px] opacity-90">
                  <div className="h-full w-full rounded-[2px] bg-current" />
                  <div className="absolute -right-[3px] top-1/2 h-[4px] w-[2px] -translate-y-1/2 rounded-r-sm bg-current" />
                </div>
              </div>

              <button
                type="button"
                aria-label="Spotlight Search"
                onClick={() => {
                  setOpenMenu(null);
                  setSpotlightOpen(true);
                }}
                className="flex h-6 cursor-default items-center rounded-full px-2 hover:bg-white/15"
              >
                <Search size={14} />
              </button>

              <div className="relative">
                <button
                  type="button"
                  aria-label="Control Center"
                  aria-expanded={openMenu === 'control-center'}
                  onClick={() =>
                    setOpenMenu(
                      openMenu === 'control-center' ? null : 'control-center',
                    )
                  }
                  onMouseEnter={() =>
                    openMenu && setOpenMenu('control-center')
                  }
                  className={cn(
                    'flex h-6 cursor-default items-center rounded-full px-2 hover:bg-white/15',
                    openMenu === 'control-center' && 'bg-white/20',
                  )}
                >
                  <SlidersHorizontal size={14} />
                </button>

                {openMenu === 'control-center' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.16, ease: [0.2, 0.9, 0.3, 1] }}
                    style={{ transformOrigin: 'top right' }}
                    className="absolute right-0 top-full z-50 mt-1 w-80 max-w-[calc(100vw-1rem)] space-y-2.5 rounded-[24px] bg-[#f4f2f5]/80 p-3 font-normal text-black shadow-[0_12px_40px_rgba(0,0,0,0.35),inset_0_0_0_0.5px_rgba(255,255,255,0.25)] backdrop-blur-2xl backdrop-saturate-150 [text-shadow:none] dark:bg-[#2a2429]/75 dark:text-white"
                  >
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="flex flex-col rounded-[18px] bg-white/50 p-1 dark:bg-white/[0.08]">
                        <div className="flex items-center gap-2 rounded-xl p-1.5 text-left">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0a84ff] text-white">
                            <Wifi size={14} />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[12px] font-semibold leading-tight">
                              Wi-Fi
                            </span>
                            <span className="block truncate text-[11px] leading-tight opacity-60">
                              Connected
                            </span>
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setAppearance(isDark ? 'light' : 'dark')
                          }
                          className="flex cursor-default items-center gap-2 rounded-xl p-1.5 text-left hover:bg-black/5 dark:hover:bg-white/5"
                        >
                          <span
                            className={cn(
                              'flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                              isDark
                                ? 'bg-[#0a84ff] text-white'
                                : 'bg-black/10 dark:bg-white/15',
                            )}
                          >
                            {isDark ? <Moon size={14} /> : <Sun size={14} />}
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[12px] font-semibold leading-tight">
                              Dark Mode
                            </span>
                            <span className="block truncate text-[11px] leading-tight opacity-60">
                              {isDark ? 'On' : 'Off'}
                            </span>
                          </span>
                        </button>
                      </div>

                      <div className="flex flex-col gap-2.5">
                        <div className="flex flex-grow rounded-[18px] bg-white/50 p-1 dark:bg-white/[0.08]">
                          <button
                            type="button"
                            onClick={toggleBrowserFullscreen}
                            className="flex w-full cursor-default items-center gap-2 rounded-xl p-1.5 text-left hover:bg-black/5 dark:hover:bg-white/5"
                          >
                            <span
                              className={cn(
                                'flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                                isFullscreen
                                  ? 'bg-[#0a84ff] text-white'
                                  : 'bg-black/10 dark:bg-white/15',
                              )}
                            >
                              {isFullscreen ? (
                                <Minimize2 size={14} />
                              ) : (
                                <Maximize2 size={14} />
                              )}
                            </span>
                            <span className="min-w-0">
                              <span className="block text-[12px] font-semibold leading-tight">
                                Full Screen
                              </span>
                              <span className="block truncate text-[11px] leading-tight opacity-60">
                                {isFullscreen ? 'On' : 'Off'}
                              </span>
                            </span>
                          </button>
                        </div>
                        <div className="flex flex-grow rounded-[18px] bg-white/50 p-1 dark:bg-white/[0.08]">
                          <button
                            type="button"
                            onClick={() => {
                              openApp('settings', 'wallpaper');
                              setOpenMenu(null);
                            }}
                            className="flex w-full cursor-default items-center gap-2 rounded-xl p-1.5 text-left hover:bg-black/5 dark:hover:bg-white/5"
                          >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/10 dark:bg-white/15">
                              <ImageIcon size={14} />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-[12px] font-semibold leading-tight">
                                Wallpaper
                              </span>
                              <span className="block truncate text-[11px] leading-tight opacity-60">
                                {activeWallpaper.label}
                              </span>
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[18px] bg-white/50 px-3 py-2 dark:bg-white/[0.08]">
                      <div className="mb-1.5 text-[12px] font-semibold">
                        Display
                      </div>
                      <div className="relative h-6 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                        <div
                          className="absolute inset-y-0 left-0 bg-white dark:bg-neutral-200"
                          style={{
                            width: `${((brightness - 0.35) / 0.65) * 100}%`,
                          }}
                        />
                        <Sun
                          size={13}
                          className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-neutral-500"
                        />
                        <input
                          type="range"
                          min={0.35}
                          max={1}
                          step={0.01}
                          value={brightness}
                          onChange={(event) =>
                            setBrightness(Number(event.target.value))
                          }
                          aria-label="Display brightness"
                          className="absolute inset-0 w-full cursor-default opacity-0"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="flex gap-2 px-2.5">
                <span className="hidden sm:inline">{formattedDate}</span>
                <span>{formattedTime}</span>
              </div>
            </div>
          </nav>
        </header>

        {/* Spotlight Modal (⌘K) */}
        <AnimatePresence>
          {spotlightOpen && (
            <motion.div
              className="absolute inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget)
                  setSpotlightOpen(false);
              }}
            >
              <div className="absolute left-1/2 top-[22%] w-[min(640px,calc(100vw-32px))] -translate-x-1/2">
                <motion.div
                  initial={{ scale: 0.97 }}
                  animate={{ scale: 1 }}
                  className="overflow-hidden rounded-[28px] bg-[#f4f2f5]/85 text-black shadow-[0_20px_60px_rgba(0,0,0,0.45),inset_0_0_0_0.5px_rgba(255,255,255,0.25)] backdrop-blur-2xl backdrop-saturate-150 dark:bg-[#2a2429]/80 dark:text-white"
                >
                  <div className="flex h-14 items-center gap-3 px-4">
                    <Search size={20} className="opacity-50" />
                    <input
                      autoFocus
                      value={spotlightQuery}
                      onChange={(event) => {
                        setSpotlightQuery(event.target.value);
                        setSpotlightIndex(0);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Escape') setSpotlightOpen(false);
                        if (
                          event.key === 'Enter' &&
                          spotlightResults[spotlightIndex]
                        ) {
                          spotlightResults[spotlightIndex].action();
                          setSpotlightOpen(false);
                        }
                        if (
                          event.key === 'ArrowDown' ||
                          event.key === 'ArrowUp'
                        ) {
                          event.preventDefault();
                          const dir = event.key === 'ArrowDown' ? 1 : -1;
                          setSpotlightIndex((curr) =>
                            Math.min(
                              Math.max(curr + dir, 0),
                              Math.max(0, spotlightResults.length - 1),
                            ),
                          );
                        }
                      }}
                      placeholder="Spotlight Search"
                      className="flex-grow bg-transparent text-[20px] outline-none placeholder:text-neutral-400"
                    />
                  </div>
                  {spotlightQuery.trim() && (
                    <div className="max-h-80 overflow-y-auto border-t border-black/10 p-2 dark:border-white/10">
                      {spotlightResults.length === 0 ? (
                        <div className="py-6 text-center text-[14px] text-neutral-400">
                          No Results
                        </div>
                      ) : (
                        spotlightResults.map((result, idx) => (
                          <React.Fragment key={result.id}>
                            {result.category !==
                              spotlightResults[idx - 1]?.category && (
                              <div className="px-2 pb-1 pt-2 text-[11px] font-semibold text-neutral-400">
                                {result.category}
                              </div>
                            )}
                            <button
                              type="button"
                              onMouseMove={() => setSpotlightIndex(idx)}
                              onClick={() => {
                                result.action();
                                setSpotlightOpen(false);
                              }}
                              className={cn(
                                'flex w-full cursor-default items-center gap-3 rounded-[10px] px-2 py-1.5 text-left',
                                idx === spotlightIndex &&
                                  'bg-[#0a84ff] text-white',
                              )}
                            >
                              <img
                                src={result.icon}
                                alt=""
                                className="h-7 w-7 shrink-0 object-contain"
                              />
                              <div className="min-w-0">
                                <div className="truncate text-[14px]">
                                  {result.title}
                                </div>
                                <div
                                  className={cn(
                                    'truncate text-[12px]',
                                    idx === spotlightIndex
                                      ? 'text-white/75'
                                      : 'text-neutral-400',
                                  )}
                                >
                                  {result.subtitle}
                                </div>
                              </div>
                            </button>
                          </React.Fragment>
                        ))
                      )}
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Brightness Overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-50 bg-black"
          style={{ opacity: (1 - brightness) * 0.75 }}
        />

        {/* Optional Lock / Sleep Screens triggered only via Apple menu */}
        {power === 'locked' && (
          <div
            role="button"
            tabIndex={0}
            onClick={() => setPower('on')}
            onKeyDown={() => setPower('on')}
            className="absolute inset-0 z-[60] flex cursor-default flex-col items-center justify-between py-[10vh] text-white"
            style={{ background: activeWallpaper.background }}
          >
            <div className="absolute inset-0 bg-black/20 backdrop-blur-xl" />
            <div className="relative text-center [text-shadow:0_2px_12px_rgba(0,0,0,0.3)]">
              <div className="text-[20px] font-semibold opacity-90">
                {now.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  timeZone: 'Asia/Jakarta',
                })}
              </div>
              <div className="text-[88px] font-bold leading-none tracking-tight">
                {formattedTime.replace(/\s?[AP]M/i, '')}
              </div>
            </div>
            <div className="relative flex flex-col items-center gap-2">
              <Avatar className="h-16 w-16 text-[24px] ring-2 ring-white/30" />
              <div className="font-semibold">{profile.name}</div>
              <div className="text-[12px] opacity-75">
                Click or press any key to unlock
              </div>
            </div>
          </div>
        )}
        {power === 'sleeping' && (
          <div
            role="button"
            tabIndex={0}
            aria-label="Wake display"
            onClick={() => setPower('locked')}
            onKeyDown={() => setPower('locked')}
            className="absolute inset-0 z-[60] bg-black"
          />
        )}

        <style>{`
          html:has(.gh-os),body:has(.gh-os){height:100%;overflow:hidden;overscroll-behavior:none}
          .inactive-window ::selection{background:rgba(128,128,128,0.3)}
        `}</style>
      </main>
    </OsShellContext.Provider>
  );
}
