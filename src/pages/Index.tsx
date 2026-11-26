import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Check,
  Clock,
  CloudSun,
  FolderGit2,
  GitCommitHorizontal,
  Headphones,
  LayoutGrid,
  Minus,
  Plus,
  RotateCcw,
  StickyNote,
  User,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useOsNote } from '@/components/os/OsShellContext';
import { WeatherWidget } from '@/components/os/WeatherWidget';
import { GitHubWidget } from '@/components/os/widgets/GitHubWidget';
import { ClockWidget } from '@/components/os/widgets/ClockWidget';
import { isClockDaytime } from '@/lib/clock';
import { ProfileWidget } from '@/components/os/widgets/ProfileWidget';
import { MusicWidget } from '@/components/os/widgets/MusicWidget';
import { PinnedWorkWidget } from '@/components/os/widgets/PinnedWorkWidget';
import { QuickMemoWidget } from '@/components/os/widgets/QuickMemoWidget';
import type { ContributionDay } from '@/components/ui/contribution-skyline';
import {
  DEFAULT_WEATHER_DATA,
  formatShortHour12,
  getWallpaperGlassProfile,
  parseWmoWeather,
  type GlassToneMode,
  type LiveWeatherData,
  type WeatherForecastSlot,
} from '@/lib/weather';
import { useOsNotification } from '@/components/os/OsNotificationContext';
import { education, profile } from '@/data/profile';
import { featuredProjects } from '@/data/featuredProjects';
import { githubFallbackContributions } from '@/data/githubActivity';
import { RECENT_TRACKS, type ListeningTrack } from '@/data/recentTracks';
import {
  arrangeDesktopWidgets,
  clampDesktopIconPosition,
  DESKTOP_EDGE_PADDING,
  DESKTOP_ICON_FOOTPRINT,
  findNonOverlappingWidgetPosition,
  type DesktopBounds,
  type DesktopIconPosition,
  type DesktopRect,
} from '@/lib/desktop-layout';

interface DesktopIconConfig {
  id: 'projects' | 'cv' | 'about' | 'blog' | 'town';
  label: string;
  icon: string;
  defaultIndex: number;
  appId: 'projects' | 'resume' | 'about' | 'blog' | 'town';
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
  {
    id: 'blog',
    label: 'Blog',
    icon: '/macos-icons/folder-documents.png',
    defaultIndex: 3,
    appId: 'blog',
  },
  {
    id: 'town',
    label: 'Town',
    icon: '/macos-icons/town.svg',
    defaultIndex: 4,
    appId: 'town',
  },
];

export type SonomaWidgetId =
  | 'github'
  | 'weather'
  | 'clock'
  | 'music'
  | 'profile'
  | 'shipped'
  | 'memo';

type WidgetResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

const WIDGET_RESIZE_HANDLES: { dir: WidgetResizeDir; className: string }[] = [
  { dir: 'n', className: 'inset-x-3 top-0 h-2 cursor-ns-resize' },
  { dir: 's', className: 'inset-x-3 bottom-0 h-2 cursor-ns-resize' },
  { dir: 'e', className: 'inset-y-3 right-0 w-2 cursor-ew-resize' },
  { dir: 'w', className: 'inset-y-3 left-0 w-2 cursor-ew-resize' },
  { dir: 'nw', className: 'left-0 top-0 h-4 w-4 cursor-nwse-resize' },
  { dir: 'ne', className: 'right-0 top-0 h-4 w-4 cursor-nesw-resize' },
  { dir: 'sw', className: 'bottom-0 left-0 h-4 w-4 cursor-nesw-resize' },
  { dir: 'se', className: 'bottom-0 right-0 h-4 w-4 cursor-nwse-resize' },
];

interface SonomaWidgetSpec {
  id: SonomaWidgetId;
  title: string;
  subtitle: string;
  size: { width: number; height: number };
  minSize: { width: number; height: number };
  maxSize: { width: number; height: number };
  defaultPos: DesktopIconPosition;
  defaultEnabled: boolean;
}

const WIDGET_CATALOG: SonomaWidgetSpec[] = [
  {
    id: 'github',
    title: 'GitHub Contributions',
    subtitle: 'Interactive activity heatmap for @Ghufrnainun (6M / 1Y)',
    size: { width: 196, height: 196 },
    minSize: { width: 170, height: 170 },
    maxSize: { width: 290, height: 260 },
    defaultPos: { x: 18, y: 18 },
    defaultEnabled: true,
  },
  {
    id: 'weather',
    title: 'Semarang Weather',
    subtitle: 'Live temperature, conditions & hourly forecast (WIB)',
    size: { width: 186, height: 186 },
    minSize: { width: 170, height: 170 },
    maxSize: { width: 384, height: 300 },
    defaultPos: { x: 226, y: 18 },
    defaultEnabled: true,
  },
  {
    id: 'clock',
    title: 'Semarang Clock',
    subtitle: 'Analog & digital WIB watch dial with day/night face',
    size: { width: 186, height: 186 },
    minSize: { width: 164, height: 164 },
    maxSize: { width: 320, height: 240 },
    defaultPos: { x: 424, y: 18 },
    defaultEnabled: true,
  },
  {
    id: 'music',
    title: 'Recent Listening',
    subtitle: 'Album-tinted player, 4-album shelf & video mode',
    size: { width: 394, height: 192 },
    minSize: { width: 310, height: 170 },
    maxSize: { width: 560, height: 260 },
    defaultPos: { x: 18, y: 226 },
    defaultEnabled: true,
  },
  {
    id: 'profile',
    title: 'Developer Card',
    subtitle: 'Full-bleed portrait poster & quick links',
    size: { width: 186, height: 196 },
    minSize: { width: 170, height: 176 },
    maxSize: { width: 320, height: 260 },
    defaultPos: { x: 622, y: 18 },
    defaultEnabled: true,
  },
  {
    id: 'shipped',
    title: 'Pinned Work',
    subtitle: 'Frosted project showcase with live previews',
    size: { width: 368, height: 184 },
    minSize: { width: 280, height: 152 },
    maxSize: { width: 520, height: 260 },
    defaultPos: { x: 18, y: 430 },
    defaultEnabled: true,
  },
  {
    id: 'memo',
    title: 'Quick Memo',
    subtitle: 'Ruled Notes stationery synced with Notes',
    size: { width: 368, height: 154 },
    minSize: { width: 250, height: 126 },
    maxSize: { width: 540, height: 280 },
    defaultPos: { x: 424, y: 226 },
    defaultEnabled: true,
  },
];

const SONOMA_WIDGET_STORAGE_KEY = 'ganos-sonoma-widgets-v5';
const DEFAULT_ENABLED_WIDGETS: SonomaWidgetId[] = WIDGET_CATALOG.filter(
  (w) => w.defaultEnabled
).map((w) => w.id);

const ICON_FOOTPRINT = DESKTOP_ICON_FOOTPRINT;
const EDGE_PADDING = DESKTOP_EDGE_PADDING;
const STACK_GAP_Y = 108;
const DRAG_THRESHOLD_PX = 3;

const MOBILE_PROFILE_SIZE = { width: 340, height: 156 };
const MOBILE_WEATHER_SIZE = { width: 174, height: 178 };
const MOBILE_GITHUB_SIZE = { width: 174, height: 178 };
const MOBILE_PINNED_SIZE = { width: 340, height: 188 };

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

interface WidgetResizeSession {
  id: SonomaWidgetId;
  dir: WidgetResizeDir;
  pointerId: number;
  startClientX: number;
  startClientY: number;
  startPos: DesktopIconPosition;
  startSize: { width: number; height: number };
  spec: SonomaWidgetSpec;
}

function readStoredWidgets(): {
  enabled: SonomaWidgetId[];
  positions: Partial<Record<SonomaWidgetId, DesktopIconPosition>>;
  sizes: Partial<Record<SonomaWidgetId, { width: number; height: number }>>;
} {
  if (typeof window === 'undefined') {
    return { enabled: DEFAULT_ENABLED_WIDGETS, positions: {}, sizes: {} };
  }
  try {
    const raw = JSON.parse(
      window.localStorage.getItem(SONOMA_WIDGET_STORAGE_KEY) ?? 'null'
    ) as {
      enabled?: unknown;
      positions?: Record<string, { x?: unknown; y?: unknown }>;
      sizes?: Record<string, { width?: unknown; height?: unknown }>;
    } | null;
    const validIds = new Set<SonomaWidgetId>(WIDGET_CATALOG.map((w) => w.id));
    const enabled = Array.isArray(raw?.enabled)
      ? (raw.enabled.filter(
          (id): id is SonomaWidgetId =>
            typeof id === 'string' && validIds.has(id as SonomaWidgetId)
        ) as SonomaWidgetId[])
      : DEFAULT_ENABLED_WIDGETS;
    const positions: Partial<Record<SonomaWidgetId, DesktopIconPosition>> = {};
    if (raw?.positions && typeof raw.positions === 'object') {
      for (const spec of WIDGET_CATALOG) {
        const candidate = raw.positions[spec.id];
        if (
          candidate &&
          typeof candidate.x === 'number' &&
          Number.isFinite(candidate.x) &&
          typeof candidate.y === 'number' &&
          Number.isFinite(candidate.y)
        ) {
          positions[spec.id] = { x: candidate.x, y: candidate.y };
        }
      }
    }
    const sizes: Partial<
      Record<SonomaWidgetId, { width: number; height: number }>
    > = {};
    if (raw?.sizes && typeof raw.sizes === 'object') {
      for (const spec of WIDGET_CATALOG) {
        const candidate = raw.sizes[spec.id];
        if (
          candidate &&
          typeof candidate.width === 'number' &&
          Number.isFinite(candidate.width) &&
          typeof candidate.height === 'number' &&
          Number.isFinite(candidate.height)
        ) {
          sizes[spec.id] = {
            width: Math.max(
              spec.minSize.width,
              Math.min(candidate.width, spec.maxSize.width)
            ),
            height: Math.max(
              spec.minSize.height,
              Math.min(candidate.height, spec.maxSize.height)
            ),
          };
        }
      }
    }
    return { enabled, positions, sizes };
  } catch {
    return { enabled: DEFAULT_ENABLED_WIDGETS, positions: {}, sizes: {} };
  }
}

export default function Index() {
  usePageMeta({
    title: `${profile.name} — Full-Stack Developer`,
    description:
      'Full-stack & mobile developer in Semarang, Indonesia. Interactive desktop portfolio featuring TypeScript, React, Flutter & Cloudflare projects.',
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

  const {
    openApp,
    isDark,
    wallpaperId,
    setAppearance,
    cycleWallpaper,
    note,
    setNote,
    widgetGalleryOpen,
    setWidgetGalleryOpen,
    language,
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
  } = useOsNote();
  const reduceMotion = useReducedMotion();

  const { pushNotification } = useOsNotification();

  const containerRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<
    Partial<Record<DesktopIconConfig['id'], HTMLButtonElement | null>>
  >({});
  const widgetRefs = useRef<
    Partial<Record<SonomaWidgetId, HTMLDivElement | null>>
  >({});

  const [positions, setPositions] = useState<
    Partial<Record<DesktopIconConfig['id'], DesktopIconPosition>>
  >({});
  const [selectedIds, setSelectedIds] = useState<DesktopIconConfig['id'][]>([]);
  const [marquee, setMarquee] = useState<MarqueeRect | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  // Sonoma Desktop Widgets state
  const [enabledWidgets, setEnabledWidgets] = useState<SonomaWidgetId[]>(
    () => readStoredWidgets().enabled
  );
  const [widgetPositions, setWidgetPositions] = useState<
    Partial<Record<SonomaWidgetId, DesktopIconPosition>>
  >(() => readStoredWidgets().positions);
  const [widgetSizes, setWidgetSizes] = useState<
    Partial<Record<SonomaWidgetId, { width: number; height: number }>>
  >(() => readStoredWidgets().sizes);
  const [desktopBounds, setDesktopBounds] = useState<DesktopBounds>(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height:
      typeof window !== 'undefined'
        ? Math.max(360, window.innerHeight - 32)
        : 720,
  }));
  const [now, setNow] = useState(() => new Date());
  const [weatherUnit, setWeatherUnit] = useState<'C' | 'F'>('C');
  const [weatherGlassMode, setWeatherGlassMode] =
    useState<GlassToneMode>('auto');
  const [activeHourlyIdx, setActiveHourlyIdx] = useState(0);
  const [weatherRefreshing, setWeatherRefreshing] = useState(false);
  const [liveWeather, setLiveWeather] =
    useState<LiveWeatherData>(DEFAULT_WEATHER_DATA);
  const weatherGlassProfile = getWallpaperGlassProfile(
    wallpaperId,
    weatherGlassMode
  );

  // Live GitHub contributions state for @Ghufrnainun (real baseline: 967 in 6 Mo, 1560 in 1 Yr)
  const [ghRange, setGhRange] = useState<'6m' | '1y'>('6m');
  const [ghContributions, setGhContributions] = useState<ContributionDay[]>(
    githubFallbackContributions
  );
  const [ghStats, setGhStats] = useState<{
    sixMonths: number;
    oneYear: number;
    streak: number;
  }>({
    sixMonths: 967,
    oneYear: 1560,
    streak: 4,
  });

  useEffect(() => {
    let cancelled = false;
    fetch('https://github-contributions-api.jogruber.de/v4/Ghufrnainun?y=last')
      .then((res) => (res.ok ? res.json() : null))
      .then(
        (
          data: {
            total?: { lastYear?: number };
            contributions?: { date: string; count: number; level?: number }[];
          } | null
        ) => {
          if (cancelled || !data) return;
          const list = Array.isArray(data.contributions)
            ? data.contributions
            : [];
          const oneYear =
            typeof data.total?.lastYear === 'number'
              ? data.total.lastYear
              : list.reduce((sum, item) => sum + (item.count || 0), 0);
          const sixMonths = list
            .slice(-180)
            .reduce((sum, item) => sum + (item.count || 0), 0);

          // Calculate most recent active streak of days with contributions > 0
          let streak = 0;
          let started = false;
          for (let i = list.length - 1; i >= 0; i -= 1) {
            if (list[i].count > 0) {
              streak += 1;
              started = true;
            } else if (started) {
              break;
            }
          }

          if (list.length > 0) {
            setGhContributions(
              list.map((item) => ({
                date: item.date,
                count: item.count || 0,
                level:
                  typeof item.level === 'number'
                    ? (Math.max(0, Math.min(4, item.level)) as
                        | 0
                        | 1
                        | 2
                        | 3
                        | 4)
                    : item.count === 0
                    ? 0
                    : item.count < 4
                    ? 1
                    : item.count < 10
                    ? 2
                    : item.count < 20
                    ? 3
                    : 4,
              }))
            );
          }

          setGhStats({
            sixMonths: sixMonths || 967,
            oneYear: oneYear || 1560,
            streak: Math.max(1, streak || 4),
          });
        }
      )
      .catch(() => {
        /* Keep verified fallback stats */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Live Open-Meteo Weather for Semarang, Indonesia (-6.9932, 110.4203)
  const fetchWeather = useCallback(async (signal?: AbortSignal) => {
    setWeatherRefreshing(true);
    try {
      const res = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=-6.9932&longitude=110.4203&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code,is_day&daily=sunrise,sunset&timezone=Asia%2FJakarta&forecast_days=2',
        { signal }
      );
      if (!res.ok) return;
      const data = await res.json();
      if (signal?.aborted || !data?.current) return;

      const wibHourRaw = Number(
        new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit',
          hour12: false,
          timeZone: 'Asia/Jakarta',
        }).format(new Date())
      );
      const currentHour = Number.isNaN(wibHourRaw)
        ? new Date().getHours()
        : wibHourRaw % 24;

      const currentTempC = Math.round(data.current.temperature_2m);
      const currentTempF = Math.round((currentTempC * 9) / 5 + 32);
      const currentCode = Number(data.current.weather_code ?? 0);
      const isDay = Boolean(data.current.is_day);
      const parsedCurrent = parseWmoWeather(currentCode, isDay);

      const humidity = Math.round(data.current.relative_humidity_2m ?? 75);
      const windSpeed = Math.round(data.current.wind_speed_10m ?? 8);
      const rainProb =
        data.hourly?.precipitation_probability?.[currentHour] ??
        (data.current.precipitation > 0 ? 90 : 20);

      // Sunrise & Sunset
      const sunriseStr = data.daily?.sunrise?.[0]
        ? data.daily.sunrise[0].split('T')[1] ?? '05:18'
        : '05:18';
      const sunsetStr = data.daily?.sunset?.[0]
        ? data.daily.sunset[0].split('T')[1] ?? '17:42'
        : '17:42';

      // Calculate Daylight duration
      const [srH, srM] = sunriseStr.split(':').map(Number);
      const [ssH, ssM] = sunsetStr.split(':').map(Number);
      const totalMinutes = ssH * 60 + ssM - (srH * 60 + srM);
      const durHours = Math.floor(totalMinutes / 60);
      const durMins = Math.max(0, totalMinutes % 60);
      const daylightDuration = `${durHours}h ${durMins}m`;

      // Build 4 forecast slots: Now + next 3 consecutive hours
      const slots: WeatherForecastSlot[] = [
        {
          time: 'Now',
          tempC: currentTempC,
          tempF: currentTempF,
          condition: parsedCurrent.condition,
          weatherCode: currentCode,
          isDay,
          kind: parsedCurrent.kind,
        },
      ];

      const hourlyTimes: string[] = data.hourly?.time ?? [];
      const hourlyTemps: number[] = data.hourly?.temperature_2m ?? [];
      const hourlyCodes: number[] = data.hourly?.weather_code ?? [];
      const hourlyIsDay: number[] = data.hourly?.is_day ?? [];

      const offsets = [1, 2, 3];
      for (const offset of offsets) {
        const targetIdx = currentHour + offset;
        if (targetIdx < hourlyTimes.length) {
          const hTempC = Math.round(hourlyTemps[targetIdx] ?? currentTempC);
          const hTempF = Math.round((hTempC * 9) / 5 + 32);
          const hCode = Number(hourlyCodes[targetIdx] ?? currentCode);
          const hourOfDay = targetIdx % 24;
          const hIsDay =
            typeof hourlyIsDay[targetIdx] === 'number'
              ? Boolean(hourlyIsDay[targetIdx])
              : hourOfDay >= 6 && hourOfDay < 18;
          const hParsed = parseWmoWeather(hCode, hIsDay);
          slots.push({
            time: formatShortHour12(hourOfDay),
            tempC: hTempC,
            tempF: hTempF,
            condition: hParsed.condition,
            weatherCode: hCode,
            isDay: hIsDay,
            kind: hParsed.kind,
          });
        }
      }

      while (slots.length < 4) {
        const nextHour = (currentHour + slots.length) % 24;
        const hIsDay = nextHour >= 6 && nextHour < 18;
        const hParsed = parseWmoWeather(currentCode, hIsDay);
        slots.push({
          time: formatShortHour12(nextHour),
          tempC: currentTempC - slots.length,
          tempF: currentTempF - slots.length,
          condition: hParsed.condition,
          weatherCode: currentCode,
          isDay: hIsDay,
          kind: hParsed.kind,
        });
      }

      setLiveWeather({
        tempC: currentTempC,
        tempF: currentTempF,
        condition: parsedCurrent.condition,
        weatherCode: currentCode,
        isDay,
        kind: parsedCurrent.kind,
        rainProbability: rainProb,
        humidity,
        windSpeedKmH: windSpeed,
        sunrise: sunriseStr,
        sunset: sunsetStr,
        daylightDuration,
        forecast: slots,
      });
    } catch (err) {
      if ((err as Error)?.name !== 'AbortError') {
        console.warn(
          'Failed to fetch live Semarang weather from Open-Meteo:',
          err
        );
      }
    } finally {
      setWeatherRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void fetchWeather(controller.signal);
    // Refresh weather every 10 minutes
    const interval = setInterval(() => {
      void fetchWeather();
    }, 10 * 60 * 1000);
    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, [fetchWeather]);

  // Recent Listening & Now Playing Widget state (Randomized pool)
  const [trackOffset, setTrackOffset] = useState(() =>
    Math.floor(Math.random() * RECENT_TRACKS.length)
  );
  const [ytEmbedTrack, setYtEmbedTrack] = useState<ListeningTrack | null>(null);
  const [musicViewMode, setMusicViewMode] = useState<'grid' | 'player'>(
    'player'
  );

  const visibleTracks = useMemo(
    () =>
      [0, 1, 2, 3].map(
        (i) => RECENT_TRACKS[(trackOffset + i) % RECENT_TRACKS.length]
      ),
    [trackOffset]
  );

  const handleShuffle = useCallback(() => {
    const next = shuffleTrack();
    setTrackOffset((prev) => (prev + 1) % RECENT_TRACKS.length);
    pushNotification({
      appId: 'music',
      appName: 'Music',
      appIcon: '/macos-icons/safari.png',
      title: language === 'id' ? 'Shuffle Acak 🔀' : 'Shuffled Track 🔀',
      body: `${next.title} — ${next.artist}`,
      durationMs: 3200,
    });
  }, [language, pushNotification, shuffleTrack]);

  const handleToggleWeatherUnit = useCallback(() => {
    setWeatherUnit((prev) => (prev === 'C' ? 'F' : 'C'));
  }, []);

  const handleWeatherRefresh = useCallback(() => {
    void fetchWeather();
  }, [fetchWeather]);

  const handleOpenBio = useCallback(() => openApp('about'), [openApp]);
  const handleOpenAllProjects = useCallback(
    () => openApp('projects'),
    [openApp]
  );
  const handleOpenProject = useCallback(
    (slug: string) => openApp('projects', slug),
    [openApp]
  );
  const handleOpenNotes = useCallback(() => openApp('notes'), [openApp]);

  const handleSetYtEmbedTrack = useCallback(
    (track: ListeningTrack | null) => {
      if (track && isPlayingTrack) {
        togglePlayTrack();
      }
      setYtEmbedTrack(track);
    },
    [isPlayingTrack, togglePlayTrack]
  );

  const handleOpenSafariTrack = useCallback(
    (track: ListeningTrack) => {
      if (isPlayingTrack) {
        togglePlayTrack();
      }
      setYtEmbedTrack(null);
      openApp(
        'safari',
        `https://www.youtube.com/embed/${track.ytId}?autoplay=1`
      );
    },
    [isPlayingTrack, openApp, togglePlayTrack]
  );

  // Refresh daytime surface tint at 1-minute cadence (paused when tab is hidden)
  useEffect(() => {
    const sync = () => {
      if (!document.hidden) setNow(new Date());
    };
    const timer = window.setInterval(sync, 60_000);
    document.addEventListener('visibilitychange', sync);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  // Debounced persistence so dragging/resizing widgets never blocks frames with sync localStorage writes
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(
          SONOMA_WIDGET_STORAGE_KEY,
          JSON.stringify({
            enabled: enabledWidgets,
            positions: widgetPositions,
            sizes: widgetSizes,
          })
        );
      } catch {
        /* ignore */
      }
    }, 250);
    return () => window.clearTimeout(timer);
  }, [enabledWidgets, widgetPositions, widgetSizes]);

  const dragSessionRef = useRef<{
    id: DesktopIconConfig['id'];
    pointerId: number;
    startClientX: number;
    startClientY: number;
    startPos: DesktopIconPosition;
    lastPos: DesktopIconPosition;
    bounds: DesktopBounds;
    el: HTMLButtonElement | null;
    moved: boolean;
  } | null>(null);

  const widgetDragRef = useRef<{
    id: SonomaWidgetId;
    pointerId: number;
    startClientX: number;
    startClientY: number;
    startPos: DesktopIconPosition;
    lastPos: DesktopIconPosition;
    size: { width: number; height: number };
    bounds: DesktopBounds;
    el: HTMLDivElement | null;
    moved: boolean;
  } | null>(null);

  const marqueeCacheRef = useRef<{
    containerRect: DOMRect;
    items: {
      id: DesktopIconConfig['id'];
      left: number;
      top: number;
      right: number;
      bottom: number;
    }[];
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

  const getDesktopBounds = useCallback((): DesktopBounds => {
    const el = containerRef.current;
    if (el && el.clientWidth > 0 && el.clientHeight > 0) {
      return { width: el.clientWidth, height: el.clientHeight };
    }
    return desktopBounds;
  }, [desktopBounds]);

  const buildArrangedWidgetPositions = useCallback(
    (
      ids: readonly SonomaWidgetId[],
      sizesMap: Partial<
        Record<SonomaWidgetId, { width: number; height: number }>
      >,
      bounds: DesktopBounds
    ) => {
      const enabledSet = new Set(ids);
      const specs = WIDGET_CATALOG.filter((spec) =>
        enabledSet.has(spec.id)
      ).sort((a, b) => {
        const aWide = a.size.width >= 300 ? 1 : 0;
        const bWide = b.size.width >= 300 ? 1 : 0;
        return aWide - bWide;
      });
      return arrangeDesktopWidgets(
        specs.map((spec) => {
          const size = sizesMap[spec.id] ?? spec.size;
          return {
            id: spec.id,
            width: size.width,
            height: size.height,
          };
        }),
        bounds
      );
    },
    []
  );

  const fallbackWidgetPositions = useMemo(
    () =>
      buildArrangedWidgetPositions(enabledWidgets, widgetSizes, desktopBounds),
    [buildArrangedWidgetPositions, desktopBounds, enabledWidgets, widgetSizes]
  );

  const getWidgetPos = useCallback(
    (spec: SonomaWidgetSpec): DesktopIconPosition =>
      widgetPositions[spec.id] ??
      fallbackWidgetPositions[spec.id] ??
      spec.defaultPos,
    [fallbackWidgetPositions, widgetPositions]
  );

  // Re-clamp custom icon & widget positions if viewport resizes
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const syncBounds = () => {
      const bounds = { width: el.clientWidth, height: el.clientHeight };
      if (bounds.width <= 0 || bounds.height <= 0) return;
      setDesktopBounds((prev) =>
        prev.width === bounds.width && prev.height === bounds.height
          ? prev
          : bounds
      );
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
      setWidgetPositions((prev) => {
        const keys = Object.keys(prev) as SonomaWidgetId[];
        if (keys.length === 0) return prev;
        let changed = false;
        const next: typeof prev = { ...prev };
        for (const key of keys) {
          const p = prev[key];
          const spec = WIDGET_CATALOG.find((w) => w.id === key);
          if (!p || !spec) continue;
          const curSize = widgetSizes[key] ?? spec.size;
          const clamped = clampDesktopIconPosition(p, bounds, curSize);
          if (clamped.x !== p.x || clamped.y !== p.y) {
            next[key] = clamped;
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    };
    syncBounds();
    const observer = new ResizeObserver(syncBounds);
    observer.observe(el);
    return () => observer.disconnect();
  }, [widgetSizes]);

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

  const widgetResizeRef = useRef<
    (WidgetResizeSession & {
      bounds: DesktopBounds;
      latestClientX: number;
      latestClientY: number;
    }) | null
  >(null);
  const widgetResizeRafRef = useRef<number>(0);

  const flushWidgetResize = useCallback(() => {
    widgetResizeRafRef.current = 0;
    const session = widgetResizeRef.current;
    if (!session) return;

    const dx = session.latestClientX - session.startClientX;
    const dy = session.latestClientY - session.startClientY;
    const { spec, dir, startPos, startSize, bounds } = session;
    const minW = spec.minSize.width;
    const minH = spec.minSize.height;
    const maxW = spec.maxSize.width;
    const maxH = spec.maxSize.height;

    let nextWidth = startSize.width;
    let nextHeight = startSize.height;
    let nextX = startPos.x;
    let nextY = startPos.y;

    if (dir.includes('e')) {
      const maxAllowedW = Math.min(
        maxW,
        bounds.width - startPos.x - EDGE_PADDING
      );
      nextWidth = Math.max(minW, Math.min(startSize.width + dx, maxAllowedW));
    } else if (dir.includes('w')) {
      const rawWidth = startSize.width - dx;
      const clampedWidth = Math.max(minW, Math.min(rawWidth, maxW));
      const deltaW = clampedWidth - startSize.width;
      const candX = startPos.x - deltaW;
      if (candX >= EDGE_PADDING) {
        nextWidth = clampedWidth;
        nextX = candX;
      }
    }

    if (dir.includes('s')) {
      const maxAllowedH = Math.min(
        maxH,
        bounds.height - startPos.y - EDGE_PADDING
      );
      nextHeight = Math.max(minH, Math.min(startSize.height + dy, maxAllowedH));
    } else if (dir.includes('n')) {
      const rawHeight = startSize.height - dy;
      const clampedHeight = Math.max(minH, Math.min(rawHeight, maxH));
      const deltaH = clampedHeight - startSize.height;
      const candY = startPos.y - deltaH;
      if (candY >= EDGE_PADDING) {
        nextHeight = clampedHeight;
        nextY = candY;
      }
    }

    setWidgetSizes((prev) => ({
      ...prev,
      [session.id]: {
        width: Math.round(nextWidth),
        height: Math.round(nextHeight),
      },
    }));

    if (nextX !== startPos.x || nextY !== startPos.y) {
      setWidgetPositions((prev) => ({
        ...prev,
        [session.id]: {
          x: Math.round(nextX),
          y: Math.round(nextY),
        },
      }));
    }
  }, []);

  useEffect(() => {
    return () => {
      if (widgetResizeRafRef.current) {
        window.cancelAnimationFrame(widgetResizeRafRef.current);
      }
    };
  }, []);

  const handleWidgetResizePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    spec: SonomaWidgetSpec,
    dir: WidgetResizeDir
  ) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();

    const curPos = getWidgetPos(spec);
    const curSize = widgetSizes[spec.id] ?? spec.size;
    const container = containerRef.current;
    const bounds: DesktopBounds = container
      ? { width: container.clientWidth, height: container.clientHeight }
      : { width: 1280, height: 720 };

    widgetResizeRef.current = {
      id: spec.id,
      dir,
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      latestClientX: e.clientX,
      latestClientY: e.clientY,
      startPos: { ...curPos },
      startSize: { ...curSize },
      bounds,
      spec,
    };

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const handleWidgetResizePointerMove = (
    e: React.PointerEvent<HTMLDivElement>
  ) => {
    const session = widgetResizeRef.current;
    if (!session || session.pointerId !== e.pointerId) return;

    session.latestClientX = e.clientX;
    session.latestClientY = e.clientY;
    if (!widgetResizeRafRef.current) {
      widgetResizeRafRef.current =
        window.requestAnimationFrame(flushWidgetResize);
    }
  };

  const handleWidgetResizePointerUp = (
    e: React.PointerEvent<HTMLDivElement>
  ) => {
    const session = widgetResizeRef.current;
    if (!session || session.pointerId !== e.pointerId) return;
    if (widgetResizeRafRef.current) {
      window.cancelAnimationFrame(widgetResizeRafRef.current);
      flushWidgetResize();
    }
    widgetResizeRef.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const toggleWidget = (id: SonomaWidgetId) => {
    if (enabledWidgets.includes(id)) {
      setEnabledWidgets((prev) => prev.filter((item) => item !== id));
      return;
    }

    const spec = WIDGET_CATALOG.find((item) => item.id === id);
    if (spec) {
      const bounds = getDesktopBounds();
      const targetSize = widgetSizes[id] ?? spec.size;
      const preferredPos = widgetPositions[id] ?? spec.defaultPos;
      const occupiedRects: DesktopRect[] = WIDGET_CATALOG.filter((item) =>
        enabledWidgets.includes(item.id)
      ).map((item) => {
        const pos = getWidgetPos(item);
        const size = widgetSizes[item.id] ?? item.size;
        return { x: pos.x, y: pos.y, width: size.width, height: size.height };
      });
      const nextPos = findNonOverlappingWidgetPosition(
        targetSize,
        preferredPos,
        occupiedRects,
        bounds
      );
      setWidgetPositions((prev) => ({
        ...prev,
        [id]: nextPos,
      }));
    }

    setEnabledWidgets((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleWidgetPointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    spec: SonomaWidgetSpec
  ) => {
    if (e.button !== 0) return;
    if (
      (e.target as HTMLElement).closest(
        'button, a, textarea, input, [data-resize-handle]'
      )
    )
      return;
    e.stopPropagation();
    setContextMenu(null);

    const startPos = getWidgetPos(spec);
    const curSize = widgetSizes[spec.id] ?? spec.size;
    const container = containerRef.current;
    const bounds: DesktopBounds = container
      ? { width: container.clientWidth, height: container.clientHeight }
      : { width: 1280, height: 720 };

    widgetDragRef.current = {
      id: spec.id,
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startPos,
      lastPos: startPos,
      size: curSize,
      bounds,
      el: widgetRefs.current[spec.id] ?? e.currentTarget,
      moved: false,
    };

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const handleWidgetPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const session = widgetDragRef.current;
    if (!session || session.pointerId !== e.pointerId) return;

    const dx = e.clientX - session.startClientX;
    const dy = e.clientY - session.startClientY;
    if (!session.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return;
    session.moved = true;

    const clamped = clampDesktopIconPosition(
      {
        x: session.startPos.x + dx,
        y: session.startPos.y + dy,
      },
      session.bounds,
      session.size
    );
    session.lastPos = clamped;

    if (session.el) {
      session.el.style.willChange = 'translate';
      session.el.style.translate = `${Math.round(clamped.x - session.startPos.x)}px ${Math.round(clamped.y - session.startPos.y)}px`;
    }
  };

  const handleWidgetPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const session = widgetDragRef.current;
    if (!session || session.pointerId !== e.pointerId) return;
    widgetDragRef.current = null;

    if (session.el) {
      session.el.style.translate = '';
      session.el.style.willChange = '';
    }
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }

    if (
      session.moved &&
      (session.lastPos.x !== session.startPos.x ||
        session.lastPos.y !== session.startPos.y)
    ) {
      setWidgetPositions((prev) => ({
        ...prev,
        [session.id]: session.lastPos,
      }));
    }
  };

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

    const bounds: DesktopBounds = container
      ? { width: container.clientWidth, height: container.clientHeight }
      : { width: 1280, height: 720 };

    dragSessionRef.current = {
      id: icon.id,
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startPos,
      lastPos: startPos,
      bounds,
      el: button ?? e.currentTarget,
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

    const clamped = clampDesktopIconPosition(
      {
        x: session.startPos.x + dx,
        y: session.startPos.y + dy,
      },
      session.bounds
    );
    session.lastPos = clamped;

    if (session.el) {
      session.el.style.willChange = 'translate';
      session.el.style.translate = `${Math.round(clamped.x - session.startPos.x)}px ${Math.round(clamped.y - session.startPos.y)}px`;
    }
  };

  const handleIconPointerUp = (
    e: React.PointerEvent<HTMLButtonElement>,
    icon: DesktopIconConfig
  ) => {
    const session = dragSessionRef.current;
    if (!session || session.pointerId !== e.pointerId) return;

    const didMove = session.moved;
    const finalPos = session.lastPos;
    const startPos = session.startPos;
    dragSessionRef.current = null;

    if (session.el) {
      session.el.style.translate = '';
      session.el.style.willChange = '';
    }

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore release failures on uncaptured events
    }

    if (didMove) {
      suppressNextClickRef.current = true;
      if (finalPos.x !== startPos.x || finalPos.y !== startPos.y) {
        setPositions((prev) => ({
          ...prev,
          [session.id]: finalPos,
        }));
      }
      return;
    }

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
    if (widgetGalleryOpen) setWidgetGalleryOpen(false);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    marqueeCacheRef.current = {
      containerRect: rect,
      items: DESKTOP_ICONS.flatMap((icon) => {
        const btn = iconRefs.current[icon.id];
        if (!btn) return [];
        const bRect = btn.getBoundingClientRect();
        const left = bRect.left - rect.left;
        const top = bRect.top - rect.top;
        return [
          {
            id: icon.id,
            left,
            top,
            right: left + bRect.width,
            bottom: top + bRect.height,
          },
        ];
      }),
    };

    setMarquee({ startX: x, startY: y, currentX: x, currentY: y });
  };

  const handleDesktopPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!marquee || !containerRef.current) return;
    const cached = marqueeCacheRef.current;
    const rect = cached?.containerRect ?? containerRef.current.getBoundingClientRect();
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
    const items = cached?.items ?? [];
    for (const item of items) {
      if (
        item.left < selRight &&
        item.right > selLeft &&
        item.top < selBottom &&
        item.bottom > selTop
      ) {
        hitIds.push(item.id);
      }
    }
    setSelectedIds((prev) =>
      prev.length === hitIds.length && prev.every((id, i) => id === hitIds[i])
        ? prev
        : hitIds
    );
  };

  const handleDesktopPointerUp = () => {
    marqueeCacheRef.current = null;
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
    const menuWidth = 228;
    const menuHeight = targetIconId ? 280 : 254;
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

  const isClockLightSurface = isClockDaytime(now);

  return (
    <div
      ref={containerRef}
      onPointerDown={handleDesktopPointerDown}
      onPointerMove={handleDesktopPointerMove}
      onPointerUp={handleDesktopPointerUp}
      onPointerCancel={handleDesktopPointerUp}
      onContextMenu={(e) => openContextMenuAt(e)}
      className="relative h-full w-full select-none overflow-hidden"
      aria-label="Portfolio Desktop"
    >
      {/* Marquee rubber-band selection box */}
      {marqueeStyle && (marqueeStyle.width > 3 || marqueeStyle.height > 3) && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute z-10 rounded-[2px] border border-[#0a84ff]/70 bg-[#0a84ff]/25 shadow-[0_0_12px_rgba(10,132,255,0.18)]"
          style={marqueeStyle}
        />
      )}

      {/* Mobile OS Home Screen (iOS/iPadOS widget stack above Mobile 3D Dock) */}
      <div className="block h-full w-full overflow-y-auto px-3.5 pb-28 pt-3 sm:hidden">
        <div className="mx-auto flex max-w-md flex-col gap-3">
          {/* Developer Contact Poster */}
          <div className="h-[156px] w-full overflow-hidden rounded-[22px] border border-white/[0.16] shadow-[0_18px_40px_-10px_rgba(0,0,0,0.48)]">
            <ProfileWidget
              name={profile.name}
              semester={profile.semester}
              gpa={education.gpa}
              availability={profile.availability}
              githubUrl={profile.github}
              onOpenBio={handleOpenBio}
              size={MOBILE_PROFILE_SIZE}
            />
          </div>

          {/* 2-Column Live Widgets: Weather + GitHub */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className={cn(
                'h-[178px] overflow-hidden rounded-[22px] border',
                weatherGlassProfile.isLightSurface
                  ? 'border-white/65 shadow-[0_16px_34px_-10px_rgba(15,23,42,0.22)]'
                  : 'border-white/20 shadow-[0_18px_38px_-10px_rgba(0,0,0,0.48)]'
              )}
              style={{
                backdropFilter: 'blur(24px) saturate(200%)',
                WebkitBackdropFilter: 'blur(24px) saturate(200%)',
              }}
            >
              <WeatherWidget
                weather={liveWeather}
                unit={weatherUnit}
                onToggleUnit={handleToggleWeatherUnit}
                activeHourlyIdx={activeHourlyIdx}
                onSelectHourly={setActiveHourlyIdx}
                size={MOBILE_WEATHER_SIZE}
                wallpaperId={wallpaperId}
                glassMode={weatherGlassMode}
                onChangeGlassMode={setWeatherGlassMode}
                isRefreshing={weatherRefreshing}
                onRefresh={handleWeatherRefresh}
                widgetGalleryOpen={false}
              />
            </div>

            <div className="h-[178px] overflow-hidden rounded-[22px] border border-white/[0.14] shadow-[0_18px_38px_-10px_rgba(0,0,0,0.5)]">
              <GitHubWidget
                username="Ghufrnainun"
                profileUrl={profile.github}
                range={ghRange}
                onChangeRange={setGhRange}
                stats={ghStats}
                contributions={ghContributions}
                size={MOBILE_GITHUB_SIZE}
              />
            </div>
          </div>

          {/* Pinned Work Showcase */}
          <div className="h-[188px] w-full overflow-hidden rounded-[22px] border border-black/[0.08] shadow-[0_18px_40px_-10px_rgba(15,23,42,0.26)]">
            <PinnedWorkWidget
              projects={featuredProjects}
              onOpenAll={handleOpenAllProjects}
              onOpenProject={handleOpenProject}
              size={MOBILE_PINNED_SIZE}
            />
          </div>

          {/* Quick Shortcuts Row (CV, Blog, Terminal, Notes) */}
          <div
            data-tour-target="desktop-icons-mobile"
            className="grid grid-cols-5 gap-2 pt-1"
          >
            {DESKTOP_ICONS.map((icon) => (
              <button
                key={`mobile-${icon.id}`}
                type="button"
                onClick={() => openIcon(icon)}
                className="flex flex-col items-center gap-1 rounded-2xl bg-black/25 px-1.5 py-2.5 text-center backdrop-blur-md ring-1 ring-white/15 transition-transform duration-150 active:scale-[0.96]"
              >
                <img
                  src={icon.icon}
                  alt=""
                  draggable={false}
                  className="h-10 w-10 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)]"
                />
                <span className="max-w-full truncate text-[11px] font-medium text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.65)]">
                  {icon.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* macOS Sonoma Floating Desktop Widgets — Distinct Native App Personalities */}
      <div className="hidden sm:block">
        {WIDGET_CATALOG.filter((spec) => enabledWidgets.includes(spec.id)).map(
          (spec) => {
            const pos = getWidgetPos(spec);
            const size = widgetSizes[spec.id] ?? spec.size;
            const isWeatherLightGlass =
              spec.id === 'weather' && weatherGlassProfile.isLightSurface;
            const isLightSurface =
              isWeatherLightGlass ||
              spec.id === 'shipped' ||
              spec.id === 'memo' ||
              (spec.id === 'clock' && isClockLightSurface);
            return (
              <div
                key={spec.id}
                ref={(node) => {
                  widgetRefs.current[spec.id] = node;
                }}
                onPointerDown={(e) => handleWidgetPointerDown(e, spec)}
                onPointerMove={handleWidgetPointerMove}
                onPointerUp={handleWidgetPointerUp}
                onPointerCancel={handleWidgetPointerUp}
                style={{
                  left: pos.x,
                  top: pos.y,
                  width: size.width,
                  height: size.height,
                  ...(spec.id === 'weather'
                    ? {
                        backdropFilter: isWeatherLightGlass
                          ? 'blur(26px) saturate(210%) brightness(1.06)'
                          : 'blur(28px) saturate(200%) brightness(1.04)',
                        WebkitBackdropFilter: isWeatherLightGlass
                          ? 'blur(26px) saturate(210%) brightness(1.06)'
                          : 'blur(28px) saturate(200%) brightness(1.04)',
                      }
                    : undefined),
                }}
                className={cn(
                  'group/widget absolute z-10 flex cursor-grab flex-col overflow-hidden transition-[border-color,box-shadow] duration-200 active:cursor-grabbing select-none',
                  spec.id === 'weather'
                    ? isWeatherLightGlass
                      ? 'rounded-[24px] bg-transparent border border-white/65 p-0 text-white shadow-[0_20px_44px_-10px_rgba(15,23,42,0.22),0_2px_8px_rgba(15,23,42,0.08),inset_0_1.5px_0_rgba(255,255,255,0.84),inset_0_-1px_0_rgba(255,255,255,0.28),inset_1px_0_0_rgba(255,255,255,0.48)] hover:border-white/80 hover:shadow-[0_24px_50px_-10px_rgba(15,23,42,0.28),inset_0_1.5px_0_rgba(255,255,255,0.92)]'
                      : 'rounded-[24px] bg-transparent border border-white/25 p-0 text-white shadow-[0_22px_48px_-10px_rgba(0,0,0,0.48),inset_0_1.5px_0_rgba(255,255,255,0.36),inset_0_-1px_0_rgba(255,255,255,0.12),inset_1px_0_0_rgba(255,255,255,0.18)] hover:border-white/35 hover:shadow-[0_26px_54px_-10px_rgba(0,0,0,0.56),inset_0_1.5px_0_rgba(255,255,255,0.45)]'
                    : isLightSurface
                    ? 'rounded-[24px] p-0 border border-black/[0.08] shadow-[0_20px_44px_-10px_rgba(15,23,42,0.26),0_2px_8px_rgba(15,23,42,0.08)] hover:border-black/[0.14] hover:shadow-[0_24px_52px_-10px_rgba(15,23,42,0.34)]'
                    : 'rounded-[24px] p-0 border border-white/[0.14] shadow-[0_22px_48px_-10px_rgba(0,0,0,0.52),0_2px_8px_rgba(0,0,0,0.2)] hover:border-white/[0.24] hover:shadow-[0_26px_56px_-10px_rgba(0,0,0,0.62)]'
                )}
              >
                {/* 8-direction resize handles */}
                {WIDGET_RESIZE_HANDLES.map((handle) => (
                  <div
                    key={handle.dir}
                    data-resize-handle={handle.dir}
                    onPointerDown={(e) =>
                      handleWidgetResizePointerDown(e, spec, handle.dir)
                    }
                    onPointerMove={handleWidgetResizePointerMove}
                    onPointerUp={handleWidgetResizePointerUp}
                    onPointerCancel={handleWidgetResizePointerUp}
                    className={[
                      'absolute z-30 select-none touch-none',
                      handle.className,
                    ].join(' ')}
                  />
                ))}

                {/* macOS Corner Resize Dots Affordance */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-1.5 right-1.5 z-20 flex flex-col items-end gap-[2px] opacity-25 transition-opacity group-hover/widget:opacity-75"
                >
                  <span
                    className={cn(
                      'h-[2px] w-[2px] rounded-full',
                      isLightSurface ? 'bg-slate-900/65' : 'bg-white'
                    )}
                  />
                  <div className="flex gap-[2px]">
                    <span
                      className={cn(
                        'h-[2px] w-[2px] rounded-full',
                        isLightSurface ? 'bg-slate-900/65' : 'bg-white'
                      )}
                    />
                    <span
                      className={cn(
                        'h-[2px] w-[2px] rounded-full',
                        isLightSurface ? 'bg-slate-900/65' : 'bg-white'
                      )}
                    />
                  </div>
                  <div className="flex gap-[2px]">
                    <span
                      className={cn(
                        'h-[2px] w-[2px] rounded-full',
                        isLightSurface ? 'bg-slate-900/65' : 'bg-white'
                      )}
                    />
                    <span
                      className={cn(
                        'h-[2px] w-[2px] rounded-full',
                        isLightSurface ? 'bg-slate-900/65' : 'bg-white'
                      )}
                    />
                    <span
                      className={cn(
                        'h-[2px] w-[2px] rounded-full',
                        isLightSurface ? 'bg-slate-900/65' : 'bg-white'
                      )}
                    />
                  </div>
                </div>

                {/* Remove Widget (-) button on hover or when Widget Gallery is open */}
                <button
                  type="button"
                  onClick={() => toggleWidget(spec.id)}
                  title={`Remove ${spec.title} widget`}
                  aria-label={`Remove ${spec.title} widget`}
                  className={cn(
                    'absolute left-2 top-2 z-20 flex h-5 w-5 items-center justify-center rounded-full shadow-sm transition-[opacity,transform,background-color,color] duration-150 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] fine:hover:scale-105 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] active:scale-[0.96] hover:bg-[#ff453a] hover:text-white',
                    isLightSurface && spec.id !== 'memo'
                      ? 'bg-white/90 text-slate-800 ring-1 ring-black/10'
                      : 'bg-black/75 text-white/95 ring-1 ring-white/25',
                    widgetGalleryOpen
                      ? 'opacity-100'
                      : 'opacity-0 group-hover/widget:opacity-100'
                  )}
                >
                  <Minus className="h-3 w-3" />
                </button>

                {/* 1. GITHUB Contributions Widget (GitHub Dark Slate Heatmap) */}
                {spec.id === 'github' && (
                  <GitHubWidget
                    username="Ghufrnainun"
                    profileUrl={profile.github}
                    range={ghRange}
                    onChangeRange={setGhRange}
                    stats={ghStats}
                    contributions={ghContributions}
                    size={size}
                  />
                )}

                {/* 2. RECENT LISTENING & NOW PLAYING Widget (Dynamic Album-Art Glass) */}
                {spec.id === 'music' && (
                  <MusicWidget
                    activeTrack={activeTrack}
                    visibleTracks={visibleTracks}
                    isPlaying={isPlayingTrack}
                    viewMode={musicViewMode}
                    onChangeViewMode={setMusicViewMode}
                    ytEmbedTrack={ytEmbedTrack}
                    onSetYtEmbedTrack={handleSetYtEmbedTrack}
                    volume={volume}
                    isMuted={isMuted}
                    onSetVolume={setVolume}
                    onToggleMute={toggleMute}
                    isLooping={isLooping}
                    onToggleLoop={toggleLoop}
                    onTogglePlay={togglePlayTrack}
                    onPrevTrack={prevTrack}
                    onNextTrack={nextTrack}
                    onShuffle={handleShuffle}
                    onSeek={seekTrack}
                    onOpenSafari={handleOpenSafariTrack}
                    size={size}
                  />
                )}

                {/* 2.5 SEMARANG WEATHER Widget (Adaptive Liquid Glass — Untouched) */}
                {spec.id === 'weather' && (
                  <WeatherWidget
                    weather={liveWeather}
                    unit={weatherUnit}
                    onToggleUnit={handleToggleWeatherUnit}
                    activeHourlyIdx={activeHourlyIdx}
                    onSelectHourly={setActiveHourlyIdx}
                    size={size}
                    wallpaperId={wallpaperId}
                    glassMode={weatherGlassMode}
                    onChangeGlassMode={setWeatherGlassMode}
                    isRefreshing={weatherRefreshing}
                    onRefresh={handleWeatherRefresh}
                    widgetGalleryOpen={widgetGalleryOpen}
                  />
                )}

                {/* 3. SEMARANG CLOCK Widget (Horological Analog/Digital Watch Dial) */}
                {spec.id === 'clock' && (
                  <ClockWidget
                    availability={profile.availability}
                    size={size}
                  />
                )}

                {/* 4. DEVELOPER PROFILE Widget (Full-Bleed Contact Poster) */}
                {spec.id === 'profile' && (
                  <ProfileWidget
                    name={profile.name}
                    semester={profile.semester}
                    gpa={education.gpa}
                    availability={profile.availability}
                    githubUrl={profile.github}
                    onOpenBio={handleOpenBio}
                    size={size}
                  />
                )}

                {/* 5. PINNED WORK Widget (Frosted Pearl Project Showcase) */}
                {spec.id === 'shipped' && (
                  <PinnedWorkWidget
                    projects={featuredProjects}
                    onOpenAll={handleOpenAllProjects}
                    onOpenProject={handleOpenProject}
                    size={size}
                  />
                )}

                {/* 6. QUICK MEMO Widget (Apple Notes Stationery Pad) */}
                {spec.id === 'memo' && (
                  <QuickMemoWidget
                    note={note}
                    onChangeNote={setNote}
                    onOpenNotes={handleOpenNotes}
                    size={size}
                  />
                )}
              </div>
            );
          }
        )}
      </div>
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
            data-tour-desktop-icon="true"
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
            className="group absolute z-20 hidden w-[88px] flex-col items-center gap-1 rounded-[8px] p-1 text-center transition-transform duration-100 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 active:scale-[0.96] sm:flex"
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

      {/* macOS Sonoma Widget Gallery Sheet (Tactile Matte Dark Aesthetic matching Desktop Widgets) */}
      <AnimatePresence>
        {widgetGalleryOpen && (
          <motion.div
            role="dialog"
            aria-label="Edit Desktop Widgets"
            initial={
              reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              reduceMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    scale: 0.97,
                    y: 8,
                    transition: { duration: 0.14, ease: [0.22, 1, 0.36, 1] },
                  }
            }
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onPointerDown={(e) => e.stopPropagation()}
            className="absolute inset-x-4 bottom-24 z-30 mx-auto max-w-2xl rounded-[26px] bg-[#121418] border border-white/[0.08] p-4 text-white shadow-[0_24px_60px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.08)] select-none"
          >
            {/* Header Bar */}
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3.5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1b1f25] ring-1 ring-white/10 text-[#64d2ff]">
                  <LayoutGrid className="h-3.5 w-3.5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13.5px] font-bold tracking-tight text-white">
                      Desktop Widgets
                    </span>
                    <span className="hidden sm:inline-flex items-center rounded-full bg-white/[0.06] px-2 py-0.5 font-mono text-[9.5px] font-medium text-white/50 ring-1 ring-white/10">
                      {enabledWidgets.length}/{WIDGET_CATALOG.length} on desktop
                    </span>
                  </div>
                  <div className="text-[11px] text-white/45">
                    Click any card to add or remove from desktop
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const arranged = buildArrangedWidgetPositions(
                      DEFAULT_ENABLED_WIDGETS,
                      {},
                      getDesktopBounds()
                    );
                    setEnabledWidgets(DEFAULT_ENABLED_WIDGETS);
                    setWidgetSizes({});
                    setWidgetPositions(arranged);
                  }}
                  title="Reset widgets to default layout"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#1b1f25] hover:bg-[#252b34] active:scale-95 px-3 py-1 font-mono text-[10.5px] font-medium text-white/70 hover:text-white ring-1 ring-white/10 transition-[background-color,color,transform] duration-150 ease-out"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset</span>
                </button>
                <button
                  type="button"
                  aria-label="Close widget gallery"
                  onClick={() => setWidgetGalleryOpen(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1b1f25] hover:bg-[#252b34] active:scale-95 text-white/70 hover:text-white ring-1 ring-white/10 transition-[background-color,color,transform] duration-150 ease-out"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Widget Cards Grid */}
            <div className="mt-3.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {WIDGET_CATALOG.map((spec) => {
                const isAdded = enabledWidgets.includes(spec.id);
                const isWide = spec.size.width >= 300;
                return (
                  <button
                    key={spec.id}
                    type="button"
                    onClick={() => toggleWidget(spec.id)}
                    className={cn(
                      'group/item flex items-center justify-between gap-3 rounded-[12px] p-3 text-left transition-[background-color,border-color,box-shadow,transform] duration-150 ease-smooth-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] active:scale-[0.98]',
                      isAdded
                        ? 'bg-[#1b1f25] ring-1 ring-white/15 shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:bg-[#222731] hover:ring-white/25'
                        : 'bg-[#15181e] ring-1 ring-white/[0.06] opacity-75 hover:opacity-100 hover:bg-[#1a1e26] hover:ring-white/15'
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={cn(
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-sm transition-transform duration-200 group-hover/item:scale-105',
                          spec.id === 'github' &&
                            'bg-[#0e4429]/60 text-[#30d158] ring-1 ring-[#30d158]/30 shadow-[0_0_10px_rgba(48,209,88,0.15)]',
                          spec.id === 'weather' &&
                            'bg-[#ff9500]/15 text-[#ff9f0a] ring-1 ring-[#ff9f0a]/30 shadow-[0_0_10px_rgba(255,159,10,0.15)]',
                          spec.id === 'clock' &&
                            'bg-[#64d2ff]/15 text-[#64d2ff] ring-1 ring-[#64d2ff]/30 shadow-[0_0_10px_rgba(100,210,255,0.15)]',
                          spec.id === 'profile' &&
                            'bg-[#0a84ff]/15 text-[#64d2ff] ring-1 ring-[#64d2ff]/30 shadow-[0_0_10px_rgba(10,132,255,0.15)]',
                          spec.id === 'music' &&
                            'bg-[#ff2d55]/15 text-[#ff375f] ring-1 ring-[#ff375f]/30 shadow-[0_0_10px_rgba(255,55,95,0.15)]',
                          spec.id === 'shipped' &&
                            'bg-[#5e5ce6]/15 text-[#7d7aff] ring-1 ring-[#7d7aff]/30 shadow-[0_0_10px_rgba(94,92,230,0.15)]',
                          spec.id === 'memo' &&
                            'bg-[#ffd60a]/15 text-[#ffd60a] ring-1 ring-[#ffd60a]/30 shadow-[0_0_10px_rgba(255,214,10,0.15)]'
                        )}
                      >
                        {spec.id === 'github' && (
                          <GitCommitHorizontal className="h-4.5 w-4.5" />
                        )}
                        {spec.id === 'weather' && (
                          <CloudSun className="h-4.5 w-4.5" />
                        )}
                        {spec.id === 'clock' && (
                          <Clock className="h-4.5 w-4.5" />
                        )}
                        {spec.id === 'profile' && (
                          <User className="h-4.5 w-4.5" />
                        )}
                        {spec.id === 'music' && (
                          <Headphones className="h-4.5 w-4.5" />
                        )}
                        {spec.id === 'shipped' && (
                          <FolderGit2 className="h-4.5 w-4.5" />
                        )}
                        {spec.id === 'memo' && (
                          <StickyNote className="h-4.5 w-4.5" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate text-[13px] font-bold text-white leading-tight">
                            {spec.title}
                          </span>
                          <span className="rounded-full bg-white/[0.06] px-1.5 py-0.2 font-mono text-[8.5px] font-medium text-white/40 ring-1 ring-white/10">
                            {isWide ? 'Wide' : 'Small'}
                          </span>
                        </div>
                        <div className="truncate text-[11px] text-white/50 mt-0.5 group-hover/item:text-white/70 transition-colors">
                          {spec.subtitle}
                        </div>
                      </div>
                    </div>

                    <span
                      className={cn(
                        'flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold transition-[background-color,color] duration-150 shadow-sm',
                        isAdded
                          ? 'bg-[#30d158]/15 text-[#30d158] ring-1 ring-[#30d158]/30 group-hover/item:bg-[#30d158]/25'
                          : 'bg-white/[0.06] text-white/50 ring-1 ring-white/10 group-hover/item:bg-white/[0.12] group-hover/item:text-white'
                      )}
                    >
                      {isAdded ? (
                        <>
                          <Check className="h-3 w-3 stroke-[2.5]" />
                          <span className="font-mono text-[9.5px]">Added</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-3 w-3 stroke-[2.5]" />
                          <span className="font-mono text-[9.5px]">Add</span>
                        </>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* macOS Desktop Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            role="menu"
            initial={
              reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }
            }
            animate={{ opacity: 1, scale: 1 }}
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.97, transition: { duration: 0.09 } }
            }
            transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              left: contextMenu.x,
              top: contextMenu.y,
              transformOrigin: 'top left',
            }}
            className="absolute z-30 w-[228px] rounded-[12px] bg-[#f6f6f6]/90 p-1.5 text-[13px] text-black/85 shadow-[0_12px_36px_rgba(0,0,0,0.32)] ring-1 ring-black/10 backdrop-blur-2xl dark:bg-[#231d21]/90 dark:text-white/90 dark:ring-white/15"
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
                setWidgetGalleryOpen(true);
                setContextMenu(null);
              }}
              className="flex w-full items-center justify-between rounded-[6px] px-2.5 py-1 text-left font-medium hover:bg-[#0a84ff] hover:text-white"
            >
              <span>Edit Widgets…</span>
            </button>

            <div className="my-1 h-px bg-black/10 dark:bg-white/10" />

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
                openApp('blog');
                setContextMenu(null);
              }}
              className="flex w-full items-center justify-between rounded-[6px] px-2.5 py-1 text-left hover:bg-[#0a84ff] hover:text-white"
            >
              <span>Open Writing Log</span>
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
                pushNotification({
                  appId: 'settings',
                  appName: 'Wallpaper',
                  appIcon: '/macos-icons/settings.png',
                  title:
                    language === 'id'
                      ? 'Wallpaper Diganti'
                      : 'Wallpaper Changed',
                  body:
                    language === 'id'
                      ? 'Latar belakang desktop telah diperbarui.'
                      : 'Switched to next desktop wallpaper.',
                });
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
                const nextAppearance = isDark ? 'light' : 'dark';
                setAppearance(nextAppearance);
                pushNotification({
                  appId: 'settings',
                  appName: 'System Settings',
                  appIcon: '/macos-icons/settings.png',
                  title:
                    language === 'id'
                      ? 'Tampilan Diubah'
                      : 'Appearance Changed',
                  body: isDark
                    ? language === 'id'
                      ? 'Mode terang diaktifkan'
                      : 'Switched to Light Appearance'
                    : language === 'id'
                    ? 'Mode gelap diaktifkan'
                    : 'Switched to Dark Appearance',
                });
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
                const arranged = buildArrangedWidgetPositions(
                  enabledWidgets,
                  widgetSizes,
                  getDesktopBounds()
                );
                setPositions({});
                setWidgetPositions(arranged);
                setSelectedIds([]);
                pushNotification({
                  appId: 'finder',
                  appName: 'Finder',
                  appIcon: '/macos-icons/finder.png',
                  title:
                    language === 'id'
                      ? 'Desktop Dirapikan'
                      : 'Desktop Cleaned Up',
                  body:
                    language === 'id'
                      ? 'Ikon dan widget dikembalikan ke susunan rapi.'
                      : 'Desktop icons and widgets aligned to default grid.',
                });
                setContextMenu(null);
              }}
              className="flex w-full items-center justify-between rounded-[6px] px-2.5 py-1 text-left hover:bg-[#0a84ff] hover:text-white"
            >
              <span>Clean Up Desktop</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
