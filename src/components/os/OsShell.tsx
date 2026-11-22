import React, {
  Suspense,
  lazy,
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
  Globe,
  Maximize2,
  Minimize2,
  Minus,
  Moon,
  Plus,
  Search,
  SlidersHorizontal,
  Sun,
  Volume2,
  VolumeX,
  Wifi,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { profile } from '@/data/profile';
import { featuredProjects } from '@/data/featuredProjects';
import {
  OsMusicPlaybackContext,
  OsShellContext,
  WALLPAPERS,
  WindowFocusContext,
  type OsAppearance,
  type OsAppId,
  type OsLanguage,
  type OsPowerState,
  type SettingsPaneId,
  type SystemFontId,
  type WallpaperId,
} from '@/components/os/OsShellContext';
import {
  GlassDock3D,
  type GlassDock3DItem,
} from '@/components/ui/glass-dock-3d';
import { useOsNotification } from '@/components/os/OsNotificationContext';
import { OsNotificationBannerContainer } from '@/components/os/OsNotificationBanner';
import { OsNotificationCenter } from '@/components/os/OsNotificationCenter';
import { DynamicIsland } from '@/components/os/DynamicIsland';
import { AppSwitcherHUD, type AppSwitcherItem } from '@/components/os/AppSwitcherHUD';
import { RECENT_TRACKS, type ListeningTrack } from '@/data/recentTracks';
import {
  playWindowOpenSound,
  playWindowCloseSound,
  playTrashEmptySound,
  playCameraShutterSound,
} from '@/lib/soundEffects';

const SafariApp = lazy(() =>
  import('@/components/os/OsBuiltInApps').then((m) => ({ default: m.SafariApp })),
);
const SystemSettingsApp = lazy(() =>
  import('@/components/os/OsBuiltInApps').then((m) => ({
    default: m.SystemSettingsApp,
  })),
);
const NotesApp = lazy(() =>
  import('@/components/os/OsBuiltInApps').then((m) => ({ default: m.NotesApp })),
);
const TerminalApp = lazy(() =>
  import('@/components/os/OsBuiltInApps').then((m) => ({ default: m.TerminalApp })),
);
const MailApp = lazy(() =>
  import('@/components/os/OsBuiltInApps').then((m) => ({ default: m.MailApp })),
);

const MenuBarClock: React.FC<{ language: OsLanguage }> = React.memo(({ language }) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 15_000);
    return () => window.clearInterval(id);
  }, []);

  const formattedDate = now
    .toLocaleDateString(language === 'id' ? 'id-ID' : 'en-GB', {
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

  return (
    <>
      <span className="hidden sm:inline">{formattedDate}</span>
      <span className="tabular-nums">{formattedTime}</span>
    </>
  );
});

const LockScreenClock: React.FC = React.memo(() => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 10_000);
    return () => window.clearInterval(id);
  }, []);

  const formattedTime = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  });

  return (
    <div className="relative text-center [text-shadow:0_2px_18px_rgba(0,0,0,0.28)]">
      <div className="text-[18px] font-medium tracking-tight text-white/90 sm:text-[20px]">
        {now.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          timeZone: 'Asia/Jakarta',
        })}
      </div>
      <div className="mt-1 text-[84px] font-bold leading-none tracking-tight text-white tabular-nums sm:text-[104px]">
        {formattedTime.replace(/\s?[AP]M/i, '')}
      </div>
    </div>
  );
});

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

type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

const RESIZE_HANDLES: { dir: ResizeDir; className: string }[] = [
  { dir: 'n', className: 'inset-x-3 top-0 h-1.5 cursor-ns-resize' },
  { dir: 's', className: 'inset-x-3 bottom-0 h-1.5 cursor-ns-resize' },
  { dir: 'e', className: 'inset-y-3 right-0 w-1.5 cursor-ew-resize' },
  { dir: 'w', className: 'inset-y-3 left-0 w-1.5 cursor-ew-resize' },
  { dir: 'nw', className: 'left-0 top-0 h-3.5 w-3.5 cursor-nwse-resize' },
  { dir: 'ne', className: 'right-0 top-0 h-3.5 w-3.5 cursor-nesw-resize' },
  { dir: 'sw', className: 'bottom-0 left-0 h-3.5 w-3.5 cursor-nesw-resize' },
  { dir: 'se', className: 'bottom-0 right-0 h-3.5 w-3.5 cursor-nwse-resize' },
];

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
const WALLPAPER_STORAGE_KEY = 'ganos-wallpaper-v3';
const LANGUAGE_STORAGE_KEY = 'ganos-system-language';
const WALLPAPER_ROTATE_INTERVAL_MS = 120_000;

const readLanguagePref = (): OsLanguage => {
  if (typeof window === 'undefined') return 'en';
  try {
    const val = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return val === 'id' || val === 'en' ? val : 'en';
  } catch {
    return 'en';
  }
};

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
  safari: {
    name: 'Safari',
    title: 'Safari',
    icon: '/macos-icons/safari.png',
    size: { width: 940, height: 600 },
    minSize: { width: 440, height: 320 },
  },
  blog: {
    name: 'Writing Log',
    title: 'Writing Log',
    icon: '/macos-icons/folder-documents.png',
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
  town: {
    name: 'Town',
    title: 'Ghufron Town',
    icon: '/macos-icons/town.svg',
    // a game window: room for the town's wide layout (900+), with desktop showing round it on a laptop
    size: { width: 1040, height: 660 },
    minSize: { width: 640, height: 440 },
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
  if (typeof window === 'undefined') return { id: 'zephyr', autoRotate: true };
  try {
    const raw = JSON.parse(
      window.localStorage.getItem(WALLPAPER_STORAGE_KEY) ?? 'null',
    ) as { id?: unknown; autoRotate?: unknown } | null;
    return {
      id: isValidWallpaperId(raw?.id) ? raw.id : 'zephyr',
      autoRotate:
        typeof raw?.autoRotate === 'boolean' ? raw.autoRotate : true,
    };
  } catch {
    return { id: 'zephyr', autoRotate: true };
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

export function OsShell({
  appName,
  lockScreen = false,
  children,
  renderWindow,
}: OsShellProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { setTheme, resolvedTheme } = useTheme();
  const reduceMotion = useReducedMotion();

  const currentRouteApp = routeToAppId(location.pathname);
  const routePath = `${location.pathname}${location.search}${location.hash}`;

  const {
    pushNotification,
    isCenterOpen,
    setIsCenterOpen,
    unreadCount,
    isFocusMode,
    setIsFocusMode,
    soundEnabled,
    setSoundEnabled,
    appBadges,
    clearAppBadge,
  } = useOsNotification();

  const [isTakingScreenshot, setIsTakingScreenshot] = useState(false);
  const [isInteractingWindow, setIsInteractingWindow] = useState(false);
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [launcherQuery, setLauncherQuery] = useState('');
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [spotlightQuery, setSpotlightQuery] = useState('');
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [power, setPower] = useState<OsPowerState>(() => {
    if (!lockScreen) return 'on';
    if (typeof window === 'undefined') return 'on';
    try {
      return window.sessionStorage.getItem('ganos_unlocked') === 'true'
        ? 'on'
        : 'locked';
    } catch {
      return 'locked';
    }
  });
  const [brightness, setBrightness] = useState(1);
  const [appearance, setAppearanceState] = useState<OsAppearance>('dark');
  const [systemFont, setSystemFontState] = useState<SystemFontId>(() => {
    if (typeof window === 'undefined') return 'jakarta';
    try {
      const stored = window.localStorage.getItem(
        'ganos-system-font',
      ) as SystemFontId | null;
      if (stored === 'inter' || stored === 'geist' || stored === 'jakarta') {
        return stored;
      }
    } catch {
      /* ignore */
    }
    return 'jakarta';
  });
  const [language, setLanguageState] = useState<OsLanguage>(readLanguagePref);
  const [settingsPane, setSettingsPane] = useState<SettingsPaneId>('about');
  const [notesPayload, setNotesPayload] = useState<string | undefined>();
  const [safariPayload, setSafariPayload] = useState<string | undefined>();
  const [launchingId, setLaunchingId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dockRevealed, setDockRevealed] = useState(false);
  const [widgetGalleryOpen, setWidgetGalleryOpen] = useState(false);
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
  const windowsRef = useRef(windows);
  windowsRef.current = windows;

  const menubarRef = useRef<HTMLElement>(null);
  const zCounter = useRef(12);
  const dragRef = useRef<{
    id: OsAppId;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  const [activeTrack, setActiveTrack] = useState<ListeningTrack>(
    () => RECENT_TRACKS[Math.floor(Math.random() * RECENT_TRACKS.length)] ?? RECENT_TRACKS[0]
  );
  const [isPlayingTrack, setIsPlayingTrack] = useState(false);
  const [trackPlaybackSec, setTrackPlaybackSec] = useState(0);
  const [trackDurationSec, setTrackDurationSec] = useState(30);
  const [volume, setVolumeState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('ganos_music_volume');
      return saved !== null ? Math.max(0, Math.min(1, parseFloat(saved))) : 0.8;
    } catch {
      return 0.8;
    }
  });
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [snapTarget, setSnapTarget] = useState<'left' | 'right' | 'top' | null>(null);
  const snapTargetRef = useRef<'left' | 'right' | 'top' | null>(null);

  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [switcherIndex, setSwitcherIndex] = useState(0);

  const playTrack = useCallback(
    async (track: ListeningTrack) => {
      const audio = audioRef.current;
      if (!audio) return;
      setActiveTrack(track);
      setTrackPlaybackSec(0);

      const isSameSrc =
        audio.src &&
        (audio.src === track.streamUrl ||
          audio.currentSrc === track.streamUrl ||
          audio.src.endsWith(track.streamUrl.split('/').pop() || ''));

      if (!isSameSrc) {
        audio.src = track.streamUrl;
      }
      audio.currentTime = 0;
      audio.volume = isMuted ? 0 : volume;

      try {
        await audio.play();
        setIsPlayingTrack(true);
      } catch (err) {
        console.warn('Playback error or blocked by autoplay:', err);
        setIsPlayingTrack(false);
      }
    },
    [isMuted, volume]
  );

  const togglePlayTrack = useCallback(
    (track?: ListeningTrack) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (track && track.id !== activeTrack.id) {
        void playTrack(track);
        return;
      }

      if (isPlayingTrack) {
        audio.pause();
        setIsPlayingTrack(false);
      } else {
        if (!audio.src || !audio.src.includes(activeTrack.id)) {
          audio.src = activeTrack.streamUrl;
        }
        audio.volume = isMuted ? 0 : volume;
        audio.play().catch(() => {
          setIsPlayingTrack(false);
        });
        setIsPlayingTrack(true);
      }
    },
    [activeTrack, isPlayingTrack, isMuted, volume, playTrack]
  );

  const nextTrack = useCallback(() => {
    const currentIndex = RECENT_TRACKS.findIndex((t) => t.id === activeTrack.id);
    const next = RECENT_TRACKS[(currentIndex + 1) % RECENT_TRACKS.length];
    void playTrack(next);
  }, [activeTrack, playTrack]);

  const prevTrack = useCallback(() => {
    const currentIndex = RECENT_TRACKS.findIndex((t) => t.id === activeTrack.id);
    const prev =
      RECENT_TRACKS[
        (currentIndex - 1 + RECENT_TRACKS.length) % RECENT_TRACKS.length
      ];
    void playTrack(prev);
  }, [activeTrack, playTrack]);

  const shuffleTrack = useCallback((): ListeningTrack => {
    const otherTracks = RECENT_TRACKS.filter((t) => t.id !== activeTrack.id);
    const randomNext =
      otherTracks[Math.floor(Math.random() * otherTracks.length)] ??
      RECENT_TRACKS[0];
    void playTrack(randomNext);
    return randomNext;
  }, [activeTrack, playTrack]);

  const seekTrack = useCallback((sec: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = sec;
    setTrackPlaybackSec(Math.floor(sec));
  }, []);

  const setVolume = useCallback(
    (newVol: number) => {
      const clamped = Math.max(0, Math.min(1, newVol));
      setVolumeState(clamped);
      if (isMuted && clamped > 0) {
        setIsMuted(false);
      }
      const audio = audioRef.current;
      if (audio) {
        audio.volume = clamped;
      }
      try {
        localStorage.setItem('ganos_music_volume', String(clamped));
      } catch {
        /* ignore */
      }
    },
    [isMuted]
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      const audio = audioRef.current;
      if (audio) {
        audio.volume = next ? 0 : volume;
      }
      return next;
    });
  }, [volume]);

  const toggleLoop = useCallback(() => {
    setIsLooping((prev) => !prev);
  }, []);

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

  const setSystemFont = useCallback((font: SystemFontId) => {
    setSystemFontState(font);
    try {
      window.localStorage.setItem('ganos-system-font', font);
    } catch {
      /* ignore */
    }
  }, []);

  const setLanguage = useCallback((next: OsLanguage) => {
    setLanguageState(next);
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-font', systemFont);
  }, [systemFont]);

  const activeWallpaper = useMemo(
    () => WALLPAPERS.find((w) => w.id === wallpaperId) ?? WALLPAPERS[0],
    [wallpaperId],
  );

  // the wallpaper just replaced stays on top for its 700 ms fade-out, then leaves the page. Set during render, so the
  // outgoing layer goes from shown to fading in one commit and its opacity transition runs.
  const [wallpaperFade, setWallpaperFade] = useState<{ shown: WallpaperId; fading: WallpaperId | null }>({
    shown: wallpaperId,
    fading: null,
  });
  if (wallpaperFade.shown !== wallpaperId) setWallpaperFade({ shown: wallpaperId, fading: wallpaperFade.shown });
  useEffect(() => {
    if (!wallpaperFade.fading) return;
    const t = window.setTimeout(() => setWallpaperFade((s) => ({ ...s, fading: null })), 750);
    return () => window.clearTimeout(t);
  }, [wallpaperFade.fading]);

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

  // Unlock / wake display on any key press when locked or sleeping
  useEffect(() => {
    if (power === 'on') return;
    const onWakeOrUnlock = (event: globalThis.KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (power === 'sleeping') {
        setPower('locked');
        return;
      }
      try {
        window.sessionStorage.setItem('ganos_unlocked', 'true');
      } catch {
        /* ignore */
      }
      setPower('on');
    };
    window.addEventListener('keydown', onWakeOrUnlock);
    return () => window.removeEventListener('keydown', onWakeOrUnlock);
  }, [power]);

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
      const existing = windowsRef.current.find((w) => w.id === id);
      const targetPath = existing?.path ?? spec.path;
      if (targetPath && targetPath !== routePath) {
        navigate(targetPath);
      }
    },
    [navigate, routePath],
  );

  const openApp = useCallback(
    (id: OsAppId, payload?: string) => {
      setOpenMenu(null);
      setLauncherOpen(false);
      setSpotlightOpen(false);
      clearAppBadge(id);

      if (id === 'settings' && payload) {
        setSettingsPane(payload as SettingsPaneId);
      }
      if (id === 'notes' && payload) {
        setNotesPayload(payload);
      }
      if (id === 'safari' && payload) {
        setSafariPayload(payload);
      }
      // a phone gets the town as a full page: a game in a window that is already the whole screen only adds chrome
      if (id === 'town' && window.innerWidth < 768) {
        window.location.assign('/town');
        return;
      }

      const alreadyOpen = windowsRef.current.some((w) => w.id === id);
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
            // the town opens as a game window on the desktop; the green button makes it full
            isMaximized: false,
            frame: computeDefaultFrame(id, current.length),
          },
        ];
      });

      if (targetPath && targetPath !== routePath) {
        navigate(targetPath);
      }
      playWindowOpenSound();
    },
    [clearAppBadge, navigate, routePath],
  );

  // Single calm welcome notification on first session visit
  useEffect(() => {
    if (power !== 'on') return;

    const hasShownWelcome = window.sessionStorage.getItem('ganos_welcome_shown');
    if (!hasShownWelcome) {
      const timer = window.setTimeout(() => {
        pushNotification({
          id: 'welcome-notification',
          appId: 'settings',
          appName: 'GanOS System',
          appIcon: '/macos-icons/settings.png',
          title: 'Welcome to GanOS',
          body: 'Press ⌘K for Spotlight, or pick your workspace language:',
          durationMs: 11000,
          secondaryActionLabel: '🇬🇧 English',
          onSecondaryAction: () => {
            setLanguage('en');
            pushNotification({
              appId: 'settings',
              appName: 'GanOS System',
              appIcon: '/macos-icons/settings.png',
              title: '🇬🇧 English Selected',
              body: 'Press ⌘K for Spotlight search or explore the dock to get started.',
              actionLabel: 'Explore Projects',
              onAction: () => openApp('projects'),
              silent: true,
            });
          },
          actionLabel: '🇮🇩 Bahasa Indonesia',
          onAction: () => {
            setLanguage('id');
            pushNotification({
              appId: 'settings',
              appName: 'GanOS System',
              appIcon: '/macos-icons/settings.png',
              title: '🇮🇩 Bahasa Indonesia Aktif',
              body: 'Gunakan ⌘K untuk Spotlight Search atau klik dock untuk mulai menjelajahi portofolio.',
              actionLabel: 'Jelajahi Proyek',
              onAction: () => openApp('projects'),
              silent: true,
            });
          },
        });
        window.sessionStorage.setItem('ganos_welcome_shown', 'true');
      }, 1600);

      return () => window.clearTimeout(timer);
    }
  }, [power, pushNotification, openApp, setLanguage]);

  // Real-time network online/offline notifications
  useEffect(() => {
    const handleOnline = () => {
      const isId = language === 'id';
      pushNotification({
        appId: 'settings',
        appName: 'Wi-Fi',
        appIcon: '/macos-icons/settings.png',
        title: isId ? 'Wi-Fi Terhubung' : 'Wi-Fi Connected',
        body: isId
          ? 'Koneksi internet kembali aktif.'
          : 'Internet connection has been restored.',
      });
    };
    const handleOffline = () => {
      const isId = language === 'id';
      pushNotification({
        appId: 'settings',
        appName: 'Wi-Fi',
        appIcon: '/macos-icons/settings.png',
        title: isId ? 'Wi-Fi Terputus' : 'Wi-Fi Disconnected',
        body: isId
          ? 'GanOS sedang berjalan dalam mode cache offline.'
          : 'GanOS is running in offline cache mode.',
      });
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [language, pushNotification]);

  const closeWindow = useCallback(
    (id: OsAppId) => {
      playWindowCloseSound();
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
      playWindowCloseSound();
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

  const switcherApps: AppSwitcherItem[] = useMemo(() => {
    if (windows.length > 0) {
      return windows.map((w) => ({
        id: w.id,
        title: APP_SPECS[w.id].name,
        icon: APP_SPECS[w.id].icon,
      }));
    }
    return (
      [
        'projects',
        'town',
        'safari',
        'blog',
        'about',
        'notes',
        'terminal',
        'mail',
        'settings',
      ] as OsAppId[]
    ).map((id) => ({
      id,
      title: APP_SPECS[id].name,
      icon: APP_SPECS[id].icon,
    }));
  }, [windows]);

  // Keyboard shortcuts (Mac + Windows native equivalents)
  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (power !== 'on') return;

      if (event.key === 'Escape') {
        setOpenMenu(null);
        setLauncherOpen(false);
        setSpotlightOpen(false);
        setIsSwitcherOpen(false);
        return;
      }

      const isCmdOrCtrl = event.metaKey || event.ctrlKey;

      // 1. Spotlight Search: Cmd+Space (Mac), Ctrl+Space (Windows), Cmd+K / Ctrl+K
      if (
        isCmdOrCtrl &&
        (event.key === ' ' || event.code === 'Space' || event.key.toLowerCase() === 'k')
      ) {
        event.preventDefault();
        setOpenMenu(null);
        setLauncherOpen(false);
        setSpotlightOpen((open) => !open);
        return;
      }

      // 2. Close active window: Cmd+W (Mac) / Ctrl+W (Windows)
      // Calling e.preventDefault() prevents Windows browser from closing the browser tab!
      if (isCmdOrCtrl && event.key.toLowerCase() === 'w') {
        event.preventDefault();
        if (focusedId) {
          closeWindow(focusedId);
        }
        return;
      }

      // 3. Minimize active window: Cmd+M (Mac) / Ctrl+M (Windows)
      if (isCmdOrCtrl && event.key.toLowerCase() === 'm') {
        event.preventDefault();
        if (focusedId) {
          minimizeWindow(focusedId);
        }
        return;
      }

      // 4. Open Settings: Cmd+, (Mac) / Ctrl+, (Windows)
      if (isCmdOrCtrl && event.key === ',') {
        event.preventDefault();
        openApp('settings');
        return;
      }

      // 5. App Switcher HUD: Cmd+Tab / Ctrl+Tab
      if (isCmdOrCtrl && event.key === 'Tab') {
        event.preventDefault();
        if (!isSwitcherOpen) {
          setIsSwitcherOpen(true);
          setSwitcherIndex(switcherApps.length > 1 ? 1 : 0);
        } else {
          if (event.shiftKey) {
            setSwitcherIndex((prev) => (prev - 1 + switcherApps.length) % switcherApps.length);
          } else {
            setSwitcherIndex((prev) => (prev + 1) % switcherApps.length);
          }
        }
        return;
      }

      // 6. Screenshot shortcut: Cmd+Shift+3, Cmd+Shift+4, Ctrl+Shift+3, Ctrl+Shift+4, or PrintScreen
      if (
        (isCmdOrCtrl &&
          event.shiftKey &&
          (event.key === '3' ||
            event.key === '4' ||
            event.code === 'Digit3' ||
            event.code === 'Digit4')) ||
        event.key === 'PrintScreen'
      ) {
        event.preventDefault();
        setIsTakingScreenshot(true);
        playCameraShutterSound();
        window.setTimeout(() => setIsTakingScreenshot(false), 220);

        const timeStr = new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        const isId = language === 'id';
        pushNotification({
          appId: 'photos',
          appName: 'Screen Capture',
          appIcon: '/macos-icons/preview.png',
          title: `Screen Shot ${timeStr}.png`,
          body: isId
            ? 'Tersimpan di Desktop GanOS'
            : 'Screenshot saved to GanOS Desktop',
          actionLabel: isId ? 'Buka Finder' : 'Open in Finder',
          onAction: () => openApp('projects'),
        });
        return;
      }

      // 7. Toggle Notification Center: Cmd+Shift+N / Ctrl+Shift+N
      if (isCmdOrCtrl && event.shiftKey && event.key.toLowerCase() === 'n') {
        event.preventDefault();
        setIsCenterOpen((prev) => !prev);
        return;
      }
    };

    const onKeyUp = (event: globalThis.KeyboardEvent) => {
      // Releasing Cmd or Ctrl closes the App Switcher and focuses the chosen app
      if (event.key === 'Meta' || event.key === 'Control') {
        if (isSwitcherOpen) {
          setIsSwitcherOpen(false);
          const target = switcherApps[switcherIndex];
          if (target) {
            openApp(target.id);
            focusWindow(target.id);
          }
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [
    power,
    focusedId,
    closeWindow,
    minimizeWindow,
    openApp,
    focusWindow,
    isSwitcherOpen,
    switcherApps,
    switcherIndex,
    language,
    pushNotification,
    setIsCenterOpen,
  ]);

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
    setIsInteractingWindow(true);
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* ignore */
    }
    const onMove = (moveEvent: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const dx = moveEvent.clientX - drag.startX;
      const dy = moveEvent.clientY - drag.startY;

      const vw = window.innerWidth;
      const edgeThreshold = 24;

      if (moveEvent.clientX <= edgeThreshold) {
        setSnapTarget('left');
        snapTargetRef.current = 'left';
      } else if (moveEvent.clientX >= vw - edgeThreshold) {
        setSnapTarget('right');
        snapTargetRef.current = 'right';
      } else if (moveEvent.clientY <= MENUBAR_HEIGHT + 12) {
        setSnapTarget('top');
        snapTargetRef.current = 'top';
      } else {
        if (snapTargetRef.current !== null) {
          setSnapTarget(null);
          snapTargetRef.current = null;
        }
      }

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
      const drag = dragRef.current;
      const snap = snapTargetRef.current;
      if (drag && snap) {
        const vw = window.innerWidth;
        const vh = window.innerHeight - MENUBAR_HEIGHT;
        if (snap === 'left') {
          setWindows((current) =>
            current.map((w) =>
              w.id === drag.id
                ? {
                    ...w,
                    isMaximized: false,
                    frame: {
                      x: 8,
                      y: 8,
                      width: Math.max(380, Math.round(vw / 2 - 14)),
                      height: Math.max(
                        300,
                        Math.round(vh - DOCK_RESERVED_HEIGHT - 16),
                      ),
                    },
                  }
                : w,
            ),
          );
        } else if (snap === 'right') {
          setWindows((current) =>
            current.map((w) =>
              w.id === drag.id
                ? {
                    ...w,
                    isMaximized: false,
                    frame: {
                      x: Math.round(vw / 2 + 6),
                      y: 8,
                      width: Math.max(380, Math.round(vw / 2 - 14)),
                      height: Math.max(
                        300,
                        Math.round(vh - DOCK_RESERVED_HEIGHT - 16),
                      ),
                    },
                  }
                : w,
            ),
          );
        } else if (snap === 'top') {
          setWindows((current) =>
            current.map((w) =>
              w.id === drag.id ? { ...w, isMaximized: true } : w,
            ),
          );
        }
      }

      setSnapTarget(null);
      snapTargetRef.current = null;
      dragRef.current = null;
      setIsInteractingWindow(false);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.removeEventListener('blur', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    window.addEventListener('blur', onUp);
  };

  const startWindowResize = (
    id: OsAppId,
    dir: ResizeDir,
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    const win = windows.find((w) => w.id === id);
    if (!win || win.isMaximized || window.innerWidth < 768) return;
    event.preventDefault();
    event.stopPropagation();
    if (focusedId !== id) focusWindow(id);
    setIsInteractingWindow(true);
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* ignore */
    }

    const origFrame = { ...win.frame };
    const startX = event.clientX;
    const startY = event.clientY;
    const minW = APP_SPECS[id].minSize.width;
    const minH = APP_SPECS[id].minSize.height;

    const onMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      const vw = window.innerWidth;
      const vh = window.innerHeight - MENUBAR_HEIGHT;

      let { x, y, width, height } = origFrame;

      if (dir.includes('e')) {
        width = Math.max(minW, Math.min(origFrame.width + dx, vw - origFrame.x - 4));
      }
      if (dir.includes('s')) {
        height = Math.max(minH, Math.min(origFrame.height + dy, vh - origFrame.y - 4));
      }
      if (dir.includes('w')) {
        const maxLeft = origFrame.x + origFrame.width - minW;
        const nextX = Math.max(4, Math.min(origFrame.x + dx, maxLeft));
        width = origFrame.width + (origFrame.x - nextX);
        x = nextX;
      }
      if (dir.includes('n')) {
        const maxTop = origFrame.y + origFrame.height - minH;
        const nextY = Math.max(0, Math.min(origFrame.y + dy, maxTop));
        height = origFrame.height + (origFrame.y - nextY);
        y = nextY;
      }

      setWindows((current) =>
        current.map((w) =>
          w.id === id
            ? {
                ...w,
                frame: {
                  x: Math.round(x),
                  y: Math.round(y),
                  width: Math.round(width),
                  height: Math.round(height),
                },
              }
            : w,
        ),
      );
    };

    const onUp = () => {
      setIsInteractingWindow(false);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.removeEventListener('blur', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    window.addEventListener('blur', onUp);
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
        <span className="flex items-center gap-1.5">
          <img
            src="/brand-logo.svg"
            alt="GanOS"
            className="h-[16px] w-[16px] object-contain drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
          />
          <span className="text-[12.5px] font-bold tracking-tight">GanOS</span>
        </span>
      ),
      entries: [
        { label: 'About GanOS', onClick: () => openApp('settings', 'about') },
        { label: 'About Ghufron', onClick: () => openApp('about') },
        'separator',
        {
          label: 'System Settings…',
          onClick: () => openApp('settings', 'wallpaper'),
        },
        {
          label: 'Safari (/old)',
          onClick: () => openApp('safari'),
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
          label: 'About GanOS',
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
          label: 'Edit Desktop Widgets…',
          checked: widgetGalleryOpen,
          onClick: () => {
            if (routePath !== '/') navigate('/');
            setFocusedId(null);
            setWidgetGalleryOpen((v) => !v);
          },
        },
        'separator',
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
          label: 'Safari (/old)',
          onClick: () => openApp('safari'),
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

  // GanOS Dock groups on 3D Frosted Glass Shelf (original icons & item set for OS-wide cohesion)
  const dockOrder: OsAppId[] = [
    'projects',
    'town',
    'safari',
    'about',
    'blog',
    'notes',
    'terminal',
    'mail',
    'settings',
  ];

  const makeDockItem = (id: OsAppId): GlassDock3DItem => {
    const spec = APP_SPECS[id];
    const isRunning = id === 'projects' || windows.some((w) => w.id === id);
    return {
      key: id,
      title: spec.name,
      iconSrc: spec.icon,
      isRunning,
      isLaunching: launchingId === id,
      badge: appBadges[id],
      onClick: () => {
        clearAppBadge(id);
        openApp(id);
      },
    };
  };

  const appsLauncherDockItem: GlassDock3DItem = {
    key: 'apps',
    title: 'Apps',
    iconSrc: '/macos-icons/apps.png',
    isRunning: launcherOpen,
    onClick: () => {
      setOpenMenu(null);
      setLauncherOpen((v) => !v);
    },
  };

  const minimizedItems: GlassDock3DItem[] = windows
    .filter((w) => w.isMinimized)
    .map((w) => ({
      key: `minimized-${w.id}`,
      title: APP_SPECS[w.id].title,
      iconSrc: APP_SPECS[w.id].icon,
      isMinimizedWindow: true,
      onClick: () => focusWindow(w.id),
    }));

  const dockGroups: GlassDock3DItem[][] = [
    [
      makeDockItem('projects'),
      appsLauncherDockItem,
      makeDockItem('safari'),
      makeDockItem('about'),
      makeDockItem('blog'),
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
        title: 'Trash (Click to empty)',
        iconSrc: '/macos-icons/trash.png',
        onClick: () => {
          playTrashEmptySound();
          pushNotification({
            appId: 'finder',
            appName: 'Finder',
            appIcon: '/macos-icons/trash.png',
            title: language === 'id' ? 'Sampah Dikosongkan' : 'Trash Emptied',
            body:
              language === 'id'
                ? 'Tempat sampah sudah bersih.'
                : 'Recycle bin is clean and quiet.',
            durationMs: 3200,
            silent: true,
          });
        },
      },
    ],
  ].filter((group) => group.length > 0);

  const mobileDockItems: GlassDock3DItem[] = [
    makeDockItem('projects'),
    makeDockItem('safari'),
    makeDockItem('about'),
    makeDockItem('mail'),
    appsLauncherDockItem,
  ];

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
      {
        id: 'system:weather',
        category: 'Applications',
        title: 'Weather',
        subtitle: 'Semarang live weather & forecast',
        icon: '/macos-icons/weather.svg',
        action: () => {
          setSpotlightOpen(false);
          setWidgetGalleryOpen(true);
        },
      },
      {
        id: 'system:widgets',
        category: 'Applications',
        title: 'Add Widgets',
        subtitle: 'Customize & configure Sonoma desktop widgets',
        icon: '/macos-icons/widgets.svg',
        action: () => {
          setSpotlightOpen(false);
          setWidgetGalleryOpen(true);
        },
      },
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
        title: 'Safari — ghufronainun.tech/old',
        subtitle: 'Open previous portfolio inside Safari window',
        icon: '/macos-icons/safari.png',
        action: () => openApp('safari'),
      },
    ];
    if (!q) return all.slice(0, 8);
    return all.filter((item) =>
      `${item.title} ${item.subtitle} ${item.category}`
        .toLowerCase()
        .includes(q),
    );
  }, [openApp, setWidgetGalleryOpen, spotlightQuery]);

  const musicPlaybackValue = useMemo(
    () => ({
      trackPlaybackSec,
      trackDurationSec,
    }),
    [trackPlaybackSec, trackDurationSec],
  );

  const shellContextValue = useMemo(
    () => ({
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
      systemFont,
      setSystemFont,
      language,
      setLanguage,
      isDark,
      brightness,
      setBrightness,
      openApp,
      settingsPane,
      setSettingsPane,
      power,
      setPower,
      widgetGalleryOpen,
      setWidgetGalleryOpen,
      isFocused: true,
      activeTrack,
      setActiveTrack,
      isPlayingTrack,
      setIsPlayingTrack,
      volume,
      isMuted,
      setVolume,
      toggleMute,
      seekTrack,
      isLooping,
      toggleLoop,
      togglePlayTrack,
      nextTrack,
      prevTrack,
      shuffleTrack,
      audioRef,
    }),
    [
      note,
      routePath,
      wallpaperId,
      activeWallpaper.label,
      cycleWallpaper,
      autoRotateWallpaper,
      appearance,
      setAppearance,
      systemFont,
      setSystemFont,
      language,
      setLanguage,
      isDark,
      brightness,
      openApp,
      settingsPane,
      power,
      widgetGalleryOpen,
      activeTrack,
      isPlayingTrack,
      volume,
      isMuted,
      setVolume,
      toggleMute,
      seekTrack,
      isLooping,
      toggleLoop,
      togglePlayTrack,
      nextTrack,
      prevTrack,
      shuffleTrack,
    ],
  );

  const launcherItems = useMemo(
    () => [
      ...(Object.keys(APP_SPECS) as OsAppId[]).map((id) => ({
        id,
        name: APP_SPECS[id].name,
        icon: APP_SPECS[id].icon,
        action: () => openApp(id),
        keywords: [APP_SPECS[id].name.toLowerCase(), APP_SPECS[id].title.toLowerCase()],
      })),
      {
        id: 'weather',
        name: 'Weather',
        icon: '/macos-icons/weather.svg',
        action: () => {
          setLauncherOpen(false);
          setWidgetGalleryOpen(true);
        },
        keywords: ['weather', 'cuaca', 'semarang', 'temperature', 'suhu', 'forecast'],
      },
      {
        id: 'widgets',
        name: 'Add Widgets',
        icon: '/macos-icons/widgets.svg',
        action: () => {
          setLauncherOpen(false);
          setWidgetGalleryOpen(true);
        },
        keywords: ['widgets', 'widget', 'add', 'desktop', 'edit', 'customize', 'gallery'],
      },
    ],
    [openApp, setWidgetGalleryOpen],
  );

  const filteredLauncherItems = useMemo(() => {
    const q = launcherQuery.trim().toLowerCase();
    if (!q) return launcherItems;
    return launcherItems.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.keywords?.some((k) => k.includes(q)),
    );
  }, [launcherItems, launcherQuery]);

  return (
    <OsShellContext.Provider value={shellContextValue}>
      <OsMusicPlaybackContext.Provider value={musicPlaybackValue}>
      <main className="gh-os relative h-[100svh] w-screen overflow-hidden select-none text-[13px] antialiased">
        {/* Wallpaper */}
        <div aria-hidden="true" className="absolute inset-0 bg-black">
          {[activeWallpaper, ...WALLPAPERS.filter((w) => w.id === wallpaperFade.fading && w.id !== activeWallpaper.id)].map((wallpaper) => (
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

        {/* Desktop surface (isolated in z-0 stacking context so windows always sit above desktop icons/widgets) */}
        <div
          className="absolute inset-x-0 bottom-0 z-0"
          style={{ top: MENUBAR_HEIGHT }}
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) focusDesktop();
          }}
        >
          {children}
        </div>

        {/* Window Snap Preview Ghost (macOS Sequoia / Windows Aero Snap) */}
        <AnimatePresence>
          {snapTarget && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'pointer-events-none fixed z-20 rounded-[22px] border border-white/40 bg-[#0a84ff]/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-md transition-[left,top,width,height,opacity] duration-150',
                snapTarget === 'left' &&
                  'left-2 top-[36px] w-[calc(50vw-12px)] h-[calc(100svh-136px)]',
                snapTarget === 'right' &&
                  'left-[calc(50vw+4px)] top-[36px] w-[calc(50vw-12px)] h-[calc(100svh-136px)]',
                snapTarget === 'top' &&
                  'left-2 top-[36px] w-[calc(100vw-16px)] h-[calc(100svh-44px)]',
              )}
            />
          )}
        </AnimatePresence>

        {/* Floating Windows */}
        <AnimatePresence>
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
              <motion.div
                key={win.id}
                role="dialog"
                aria-label={spec.title}
                style={style}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={
                  reduceMotion
                    ? { opacity: 0, transition: { duration: 0.1 } }
                    : {
                        opacity: 0,
                        scale: 0.95,
                        y: 16,
                        transition: { duration: 0.15, ease: [0.22, 1, 0.36, 1] },
                      }
                }
                transition={{ type: 'spring', stiffness: 440, damping: 36 }}
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
                <div
                  className={cn(
                    'relative flex h-full w-full flex-col overflow-hidden bg-[#e8e6ea]/80 text-[13px] text-black/85 ring-[0.5px] ring-black/40 dark:bg-[#3a3039]/75 dark:text-white/90',
                    // the frosted glass is re-blurred whenever the window or what is under it changes: skip it while a
                    // window is dragged or resized, when it fills the screen, and for the town, whose frame repaints every frame
                    win.isMaximized || win.id === 'town' || isInteractingWindow
                      ? 'bg-[#e8e6ea]/95 dark:bg-[#3a3039]/95'
                      : 'backdrop-blur-xl backdrop-saturate-150',
                    'after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.5)] dark:after:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.13)]',
                    !win.isMaximized && 'rounded-[26px]',
                    isFocused
                      ? 'shadow-[0_30px_80px_rgba(0,0,0,0.55),0_0_0_0.5px_rgba(0,0,0,0.6)]'
                      : 'shadow-[0_14px_36px_rgba(0,0,0,0.35)]',
                    win.isMaximized && 'rounded-none shadow-none ring-0',
                  )}
                >
                  {/* Traffic light controls with extended non-overlapping hit areas */}
                  <div className="window-controls group/lights absolute left-[19px] top-[19px] z-20 flex gap-[9px]">
                    <button
                      type="button"
                      aria-label="Close"
                      onClick={() => closeWindow(win.id)}
                      className={cn(
                        'relative flex h-[14px] w-[14px] items-center justify-center rounded-full ring-[0.5px] ring-inset ring-black/20 transition-transform duration-100 after:absolute after:-inset-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] active:scale-[0.96] enabled:active:brightness-75',
                        isFocused
                          ? 'bg-[#ff5f57]'
                          : 'bg-black/15 group-hover/lights:bg-[#ff5f57] dark:bg-white/20',
                      )}
                    >
                      <X
                        size={8}
                        strokeWidth={3}
                        className="text-[#4d0000] opacity-0 transition-opacity group-hover/lights:opacity-100 [@media(hover:none)]:opacity-80"
                      />
                    </button>
                    <button
                      type="button"
                      aria-label="Minimize"
                      onClick={() => minimizeWindow(win.id)}
                      className={cn(
                        'relative flex h-[14px] w-[14px] items-center justify-center rounded-full ring-[0.5px] ring-inset ring-black/20 transition-transform duration-100 after:absolute after:-inset-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] active:scale-[0.96] enabled:active:brightness-75',
                        isFocused
                          ? 'bg-[#febc2e]'
                          : 'bg-black/15 group-hover/lights:bg-[#febc2e] dark:bg-white/20',
                      )}
                    >
                      <Minus
                        size={8}
                        strokeWidth={3}
                        className="text-[#985700] opacity-0 transition-opacity group-hover/lights:opacity-100 [@media(hover:none)]:opacity-80"
                      />
                    </button>
                    <button
                      type="button"
                      aria-label={win.isMaximized ? 'Restore' : 'Maximize'}
                      onClick={() => toggleMaximize(win.id)}
                      className={cn(
                        'relative flex h-[14px] w-[14px] items-center justify-center rounded-full ring-[0.5px] ring-inset ring-black/20 transition-transform duration-100 after:absolute after:-inset-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] active:scale-[0.96] enabled:active:brightness-75',
                        isFocused
                          ? 'bg-[#28c840]'
                          : 'bg-black/15 group-hover/lights:bg-[#28c840] dark:bg-white/20',
                      )}
                    >
                      <Plus
                        size={8}
                        strokeWidth={3}
                        className="text-[#006500] opacity-0 transition-opacity group-hover/lights:opacity-100 [@media(hover:none)]:opacity-80"
                      />
                    </button>
                  </div>

                  {/* Window body (shielded from iframe pointer capture while dragging/resizing) */}
                  <div
                    className={cn(
                      'relative min-h-0 flex-grow',
                      isInteractingWindow && 'pointer-events-none',
                    )}
                  >
                    <WindowFocusContext.Provider value={isFocused}>
                      <Suspense
                        fallback={
                          <div className="flex h-full w-full items-center justify-center text-[12px] text-black/45 dark:text-white/45">
                            Opening {spec.name}…
                          </div>
                        }
                      >
                        {win.id === 'settings' ? (
                          <SystemSettingsApp />
                        ) : win.id === 'safari' ? (
                          <SafariApp initialUrl={safariPayload} />
                        ) : win.id === 'notes' ? (
                          <NotesApp initialId={notesPayload} />
                        ) : win.id === 'terminal' ? (
                          <TerminalApp onClose={() => closeWindow('terminal')} />
                        ) : win.id === 'mail' ? (
                          <MailApp />
                        ) : win.id === 'town' ? (
                          // its own page in a frame: the town scrolls the window and fills the screen, which a GanOS window body cannot give it
                          <iframe
                            src="/town"
                            title="Ghufron Town: a 3D tour of the projects"
                            allow="fullscreen"
                            className="block h-full w-full border-0 bg-[#1f3bff]"
                          />
                        ) : win.path && renderWindow ? (
                          <div className="h-full w-full overflow-hidden">
                            {renderWindow(win.path)}
                          </div>
                        ) : (
                          <div className="h-full w-full overflow-hidden">
                            {children}
                          </div>
                        )}
                      </Suspense>
                    </WindowFocusContext.Provider>
                  </div>

                  {/* 8-direction macOS window resize handles */}
                  {!win.isMaximized &&
                    RESIZE_HANDLES.map((handle) => (
                      <div
                        key={handle.dir}
                        aria-hidden="true"
                        onPointerDown={(event) =>
                          startWindowResize(win.id, handle.dir, event)
                        }
                        className={cn(' absolute z-30', handle.className)}
                      />
                    ))}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* 3D Frosted Glass Dock */}
        <div className="pointer-events-none absolute inset-x-0 bottom-1.5 z-[26] flex justify-center [&>*]:pointer-events-auto">
          <GlassDock3D
            groups={dockGroups}
            mobileItems={mobileDockItems}
            activeKey={launcherOpen ? 'apps' : focusedId}
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
                    if (event.key === 'Enter' && filteredLauncherItems[0]) {
                      setLauncherOpen(false);
                      filteredLauncherItems[0].action();
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
                {filteredLauncherItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setLauncherOpen(false);
                      item.action();
                    }}
                    className="group flex cursor-default flex-col items-center gap-2 transition-transform duration-150 active:scale-95"
                  >
                    <img
                      src={item.icon}
                      alt={item.name}
                      className="h-24 w-24 object-contain transition-transform duration-200 group-hover:scale-105 active:brightness-75 drop-shadow-[0_8px_18px_rgba(0,0,0,0.35)]"
                    />
                    <span className="text-[13px] font-medium [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
                      {item.name}
                    </span>
                  </button>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Menu Bar (32px, transparent over wallpaper) */}
        <header className="pointer-events-none absolute inset-x-0 top-0 z-30 [&>*]:pointer-events-auto">
          <DynamicIsland />
          <nav
            ref={menubarRef}
            style={{ height: MENUBAR_HEIGHT }}
            className={cn(
              'relative flex items-center justify-between text-[13px] font-medium transition-colors',
              maximizedWindow
                ? 'text-black dark:text-white'
                : activeWallpaper.isLight
                  ? 'text-black'
                  : 'text-white [text-shadow:0_0_8px_rgba(0,0,0,0.25)]',
            )}
          >
            {maximizedWindow && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-[#ececec]/90 backdrop-blur-2xl dark:bg-[#1e1e1e]/90"
              />
            )}
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
                      'flex h-6 cursor-default items-center rounded-full px-2.5 transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80',
                      menu.id === 'apple' && 'px-3',
                      openMenu === menu.id && 'bg-white/20',
                    )}
                  >
                    {menu.label}
                  </button>
                  <AnimatePresence>
                    {openMenu === menu.id && (
                      <motion.div
                        role="menu"
                        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: -2 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: -2, transition: { duration: 0.09 } }}
                        transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
                        style={{ transformOrigin: 'top left' }}
                        className="absolute left-0 top-full z-50 mt-1 min-w-[230px] rounded-[13px] bg-[#f4f2f5]/90 p-[5px] text-[13px] font-normal text-black shadow-[0_12px_40px_rgba(0,0,0,0.35),inset_0_0_0_0.5px_rgba(255,255,255,0.25)] ring-[0.5px] ring-black/30 backdrop-blur-2xl backdrop-saturate-150 [text-shadow:none] dark:bg-[#2a2429]/90 dark:text-white"
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
                              role="menuitem"
                              disabled={entry.disabled}
                              onClick={() => {
                                setOpenMenu(null);
                                entry.onClick?.();
                              }}
                              className="flex h-[24px] w-full cursor-default items-center rounded-[7px] pl-1.5 pr-5 text-left transition-colors duration-75 hover:bg-[#0a84ff] hover:text-white focus-visible:bg-[#0a84ff] focus-visible:text-white focus-visible:outline-none disabled:opacity-30"
                            >
                              <span className="w-4 shrink-0">
                                {entry.checked && <Check size={11} />}
                              </span>
                              {entry.label}
                            </button>
                          ),
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
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

                <AnimatePresence>
                {openMenu === 'control-center' && (
                  <motion.div
                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: -3, transition: { duration: 0.12, ease: [0.22, 1, 0.36, 1] } }}
                    transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformOrigin: 'top right' }}
                    className="absolute right-0 top-full z-50 mt-1 w-80 max-w-[calc(100vw-1rem)] space-y-2.5 rounded-[24px] bg-[#f4f2f5]/85 p-3 font-normal text-black shadow-[0_12px_40px_rgba(0,0,0,0.35),inset_0_0_0_0.5px_rgba(255,255,255,0.25)] backdrop-blur-2xl backdrop-saturate-150 [text-shadow:none] dark:bg-[#2a2429]/80 dark:text-white"
                  >
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="flex flex-col rounded-[12px] bg-white/50 p-1 dark:bg-white/[0.08]">
                        <div className="flex items-center gap-2 rounded-[9px] p-1.5 text-left">
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
                          className="flex cursor-default items-center gap-2 rounded-[9px] p-1.5 text-left transition-[background-color,transform] duration-150 ease-smooth-out hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] active:scale-[0.97] dark:hover:bg-white/5"
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
                        <div className="flex flex-grow rounded-[12px] bg-white/50 p-1 dark:bg-white/[0.08]">
                          <button
                            type="button"
                            onClick={toggleBrowserFullscreen}
                            className="flex w-full cursor-default items-center gap-2 rounded-[9px] p-1.5 text-left transition-[background-color,transform] duration-150 ease-smooth-out hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] active:scale-[0.97] dark:hover:bg-white/5"
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
                        <div className="flex flex-grow rounded-[12px] bg-white/50 p-1 dark:bg-white/[0.08]">
                          <button
                            type="button"
                            onClick={() => {
                              openApp('settings', 'wallpaper');
                              setOpenMenu(null);
                            }}
                            className="flex w-full cursor-default items-center gap-2 rounded-[9px] p-1.5 text-left transition-[background-color,transform] duration-150 ease-smooth-out hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] active:scale-[0.97] dark:hover:bg-white/5"
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

                    <div className="rounded-[12px] bg-white/50 p-1.5 dark:bg-white/[0.08]">
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenu(null);
                          if (routePath !== '/') navigate('/');
                          setFocusedId(null);
                          setWidgetGalleryOpen((v) => !v);
                        }}
                        className="flex w-full cursor-default items-center justify-between rounded-[9px] px-2 py-1.5 text-left transition-[background-color,transform] duration-150 ease-smooth-out hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] active:scale-[0.97] dark:hover:bg-white/5"
                      >
                        <span className="text-[12px] font-semibold">
                          Desktop Widgets
                        </span>
                        <span className="rounded-full bg-[#0a84ff] px-2.5 py-0.5 text-[11px] font-medium text-white">
                          {widgetGalleryOpen ? 'Done' : 'Add / Remove'}
                        </span>
                      </button>
                    </div>

                    <div className="rounded-[12px] bg-white/50 px-3 py-2 dark:bg-white/[0.08]">
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

                    {/* Focus Mode & Sound Effects */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="flex flex-grow rounded-[12px] bg-white/50 p-1 dark:bg-white/[0.08]">
                        <button
                          type="button"
                          onClick={() => setIsFocusMode((v) => !v)}
                          className="flex w-full cursor-default items-center gap-2 rounded-[9px] p-1.5 text-left transition-[background-color,transform] duration-150 ease-smooth-out hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] active:scale-[0.97] dark:hover:bg-white/5"
                        >
                          <span
                            className={cn(
                              'flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                              isFocusMode
                                ? 'bg-purple-600 text-white'
                                : 'bg-black/10 dark:bg-white/15',
                            )}
                          >
                            <Moon size={14} />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[12px] font-semibold leading-tight">
                              {language === 'id' ? 'Fokus' : 'Focus'}
                            </span>
                            <span className="block truncate text-[11px] leading-tight opacity-60">
                              {isFocusMode
                                ? language === 'id'
                                  ? 'Jangan Ganggu'
                                  : 'Do Not Disturb'
                                : language === 'id'
                                  ? 'Mati'
                                  : 'Off'}
                            </span>
                          </span>
                        </button>
                      </div>

                      <div className="flex flex-grow rounded-[12px] bg-white/50 p-1 dark:bg-white/[0.08]">
                        <button
                          type="button"
                          onClick={() => setSoundEnabled((v) => !v)}
                          className="flex w-full cursor-default items-center gap-2 rounded-[9px] p-1.5 text-left transition-[background-color,transform] duration-150 ease-smooth-out hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] active:scale-[0.97] dark:hover:bg-white/5"
                        >
                          <span
                            className={cn(
                              'flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                              soundEnabled
                                ? 'bg-[#0a84ff] text-white'
                                : 'bg-black/10 dark:bg-white/15',
                            )}
                          >
                            {soundEnabled ? (
                              <Volume2 size={14} />
                            ) : (
                              <VolumeX size={14} />
                            )}
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[12px] font-semibold leading-tight">
                              {language === 'id' ? 'Efek Suara' : 'Sound'}
                            </span>
                            <span className="block truncate text-[11px] leading-tight opacity-60">
                              {soundEnabled
                                ? language === 'id'
                                  ? 'Aktif'
                                  : 'On'
                                : language === 'id'
                                  ? 'Bisu'
                                  : 'Muted'}
                            </span>
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Language Switcher Tile */}
                    <div className="rounded-[12px] bg-white/50 p-1.5 dark:bg-white/[0.08]">
                      <button
                        type="button"
                        onClick={() => {
                          const next = language === 'en' ? 'id' : 'en';
                          setLanguage(next);
                          pushNotification({
                            appId: 'settings',
                            appName: 'GanOS System',
                            appIcon: '/macos-icons/settings.png',
                            title:
                              next === 'id'
                                ? '🇮🇩 Bahasa Indonesia'
                                : '🇬🇧 English',
                            body:
                              next === 'id'
                                ? 'Bahasa sistem diubah ke Bahasa Indonesia.'
                                : 'System language changed to English.',
                            silent: true,
                          });
                        }}
                        className="flex w-full cursor-default items-center justify-between rounded-[9px] px-2 py-1.5 text-left transition-[background-color,transform] duration-150 ease-smooth-out hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] active:scale-[0.97] dark:hover:bg-white/5"
                      >
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0a84ff] text-white">
                            <Globe size={14} />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[12px] font-semibold leading-tight">
                              {language === 'id'
                                ? 'Bahasa Sistem'
                                : 'System Language'}
                            </span>
                            <span className="block truncate text-[11px] leading-tight opacity-60">
                              {language === 'id'
                                ? 'Bahasa Indonesia (ID)'
                                : 'English (EN)'}
                            </span>
                          </span>
                        </div>
                        <span className="rounded-full bg-black/10 px-2 py-0.5 text-[10.5px] font-semibold text-neutral-800 dark:bg-white/15 dark:text-neutral-200">
                          {language === 'id' ? 'Ganti / Switch' : 'Switch'}
                        </span>
                      </button>
                    </div>
                  </motion.div>
                )}
                </AnimatePresence>
              </div>

              {isFocusMode && (
                <div
                  title="Do Not Disturb is active"
                  className="flex h-6 items-center px-1 text-purple-300"
                >
                  <Moon size={13} />
                </div>
              )}

              <button
                type="button"
                data-notification-toggle="true"
                aria-label="Notification Center"
                aria-expanded={isCenterOpen}
                onClick={() => {
                  setOpenMenu(null);
                  setIsCenterOpen((v) => !v);
                }}
                className={cn(
                  'flex h-6 cursor-default items-center gap-1.5 rounded-full px-2.5 transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80',
                  isCenterOpen && 'bg-white/20',
                )}
              >
                <MenuBarClock language={language} />
                {unreadCount > 0 && !isCenterOpen && (
                  <span
                    aria-label={`${unreadCount} unread notifications`}
                    className="h-1.5 w-1.5 rounded-full bg-[#0a84ff]"
                  />
                )}
              </button>
            </div>
          </nav>
        </header>

        {/* Spotlight Modal (⌘K) — Instant keyboard response (Raycast/Emil principle) */}
        <AnimatePresence>
          {spotlightOpen && (
            <motion.div
              className="absolute inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.06 }}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget)
                  setSpotlightOpen(false);
              }}
            >
              <div className="absolute left-1/2 top-[22%] w-[min(640px,calc(100vw-32px))] -translate-x-1/2">
                <div className="overflow-hidden rounded-[26px] bg-[#f4f2f5]/90 text-black shadow-[0_20px_60px_rgba(0,0,0,0.45),inset_0_0_0_0.5px_rgba(255,255,255,0.25)] backdrop-blur-2xl backdrop-saturate-150 dark:bg-[#2a2429]/85 dark:text-white">
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
                </div>
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

        {/* Initial & On-Demand Lock Screen with Wallpaper + User Brand Logo */}
        <AnimatePresence>
          {power === 'locked' && (
            <motion.div
              role="button"
              tabIndex={0}
              aria-label="Unlock GanOS"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => {
                try {
                  window.sessionStorage.setItem('ganos_unlocked', 'true');
                } catch {
                  /* ignore */
                }
                setPower('on');
              }}
              onKeyDown={() => {
                try {
                  window.sessionStorage.setItem('ganos_unlocked', 'true');
                } catch {
                  /* ignore */
                }
                setPower('on');
              }}
              className="absolute inset-0 z-[60] flex cursor-pointer flex-col items-center justify-between py-[9vh] text-white focus:outline-none"
              style={{ background: activeWallpaper.background }}
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35" />

              {/* Top Date & Time (isolated clock ticker with tabular numerals) */}
              <LockScreenClock />

              {/* Bottom Brand Logo Avatar & Unlock Prompt */}
              <div className="relative flex flex-col items-center gap-2.5">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/30 p-3 shadow-[0_8px_28px_rgba(0,0,0,0.35)] ring-1 ring-white/35 backdrop-blur-md transition-transform hover:scale-105">
                  <img
                    src="/brand-logo.svg"
                    alt="GanOS Logo"
                    className="h-full w-full object-contain drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]"
                  />
                </div>
                <div className="text-[14px] font-semibold tracking-tight text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
                  {profile.name}
                </div>
                <div className="rounded-full bg-black/25 px-3 py-0.5 text-[11.5px] font-medium text-white/85 ring-1 ring-white/15 backdrop-blur-md">
                  Click or press any key to unlock
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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

        {/* Camera Shutter Flash Effect */}
        <AnimatePresence>
          {isTakingScreenshot && (
            <motion.div
              initial={{ opacity: 0.85 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="pointer-events-none fixed inset-0 z-[100] bg-white"
            />
          )}
        </AnimatePresence>

        {/* GanOS Notification System */}
        <OsNotificationBannerContainer />
        <OsNotificationCenter />

        {/* macOS / Windows App Switcher HUD (⌘Tab / Ctrl+Tab) */}
        <AppSwitcherHUD
          isOpen={isSwitcherOpen}
          apps={switcherApps}
          selectedIndex={switcherIndex}
        />

        {/* Global background audio element for Music / Dynamic Island */}
        <audio
          ref={audioRef}
          preload="none"
          className="hidden"
          onPlay={() => setIsPlayingTrack(true)}
          onPause={() => setIsPlayingTrack(false)}
          onTimeUpdate={(e) => {
            const nextSec = Math.floor(e.currentTarget.currentTime);
            setTrackPlaybackSec((prev) => (prev === nextSec ? prev : nextSec));
            const dur = e.currentTarget.duration;
            if (dur && !isNaN(dur) && dur > 0) {
              const nextDur = Math.floor(dur);
              setTrackDurationSec((prev) => (prev === nextDur ? prev : nextDur));
            }
          }}
          onLoadedMetadata={(e) => {
            const dur = e.currentTarget.duration;
            if (dur && !isNaN(dur) && dur > 0) {
              setTrackDurationSec(Math.floor(dur));
            }
          }}
          onEnded={() => {
            setTrackPlaybackSec(0);
            if (isLooping) {
              const audio = audioRef.current;
              if (audio) {
                audio.currentTime = 0;
                audio.play().catch(() => {});
              }
            } else {
              nextTrack();
            }
          }}
          onError={(e) => {
            console.warn('Audio playback error:', e);
            setIsPlayingTrack(false);
            setTrackPlaybackSec(0);
          }}
        />

        <style>{`
          html:has(.gh-os),body:has(.gh-os){height:100%;overflow:hidden;overscroll-behavior:none}
          .inactive-window ::selection{background:rgba(128,128,128,0.3)}
        `}</style>
      </main>
      </OsMusicPlaybackContext.Provider>
    </OsShellContext.Provider>
  );
}
