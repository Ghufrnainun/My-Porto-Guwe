import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Check,
  Clock,
  Cloud,
  CloudRain,
  CloudSun,
  FolderGit2,
  GitCommitHorizontal,
  Headphones,
  Heart,
  LayoutGrid,
  MapPin,
  Minus,
  Moon,
  Pause,
  Play,
  Plus,
  Repeat,
  RotateCcw,
  RotateCw,
  Shuffle,
  SkipBack,
  SkipForward,
  StickyNote,
  Sun,
  Sunrise,
  Sunset,
  User,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useOsNote } from '@/components/os/OsShellContext';
import { useOsNotification } from '@/components/os/OsNotificationContext';
import { education, profile } from '@/data/profile';
import { featuredProjects } from '@/data/featuredProjects';
import { githubFallbackContributions } from '@/data/githubActivity';
import {
  clampDesktopIconPosition,
  DESKTOP_EDGE_PADDING,
  DESKTOP_ICON_FOOTPRINT,
  type DesktopBounds,
  type DesktopIconPosition,
} from '@/lib/desktop-layout';

interface DesktopIconConfig {
  id: 'projects' | 'cv' | 'about' | 'blog';
  label: string;
  icon: string;
  defaultIndex: number;
  appId: 'projects' | 'resume' | 'about' | 'blog';
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
];

export type SonomaWidgetId =
  | 'github'
  | 'weather'
  | 'clock'
  | 'music'
  | 'profile'
  | 'shipped'
  | 'memo';

/* 5x7 LED Dot-Matrix Font for GitHub Contributions Counter (os.atom63.io style) */
const DOT_MATRIX_FONT: Record<string, readonly string[]> = {
  '0': ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
  '1': ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  '2': ['01110', '10001', '00001', '00110', '01000', '10000', '11111'],
  '3': ['11110', '00001', '00001', '01110', '00001', '00001', '11110'],
  '4': ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  '5': ['11111', '10000', '11110', '00001', '00001', '10001', '01110'],
  '6': ['00110', '01000', '10000', '11110', '10001', '10001', '01110'],
  '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  '8': ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  '9': ['01110', '10001', '10001', '01111', '00001', '00010', '01100'],
};

function DotMatrixNumber({ value }: { value: number }) {
  const digits = String(Math.max(0, value)).split('');
  return (
    <div
      className="flex items-center gap-[7px]"
      aria-label={`${value} contributions`}
    >
      {digits.map((char, idx) => {
        const rows = DOT_MATRIX_FONT[char] ?? DOT_MATRIX_FONT['0'];
        return (
          <div
            key={`${idx}-${char}`}
            className="grid grid-cols-5 gap-[2px]"
            aria-hidden="true"
          >
            {rows.flatMap((row, rIdx) =>
              row
                .split('')
                .map((bit, cIdx) => (
                  <span
                    key={`${rIdx}-${cIdx}`}
                    className={
                      bit === '1'
                        ? 'h-[3.2px] w-[3.2px] rounded-full bg-white shadow-[0_0_4px_rgba(255,255,255,0.45)]'
                        : 'h-[3.2px] w-[3.2px] rounded-full bg-white/[0.06]'
                    }
                  />
                ))
            )}
          </div>
        );
      })}
    </div>
  );
}

// 11 weeks = 77 days of contributions for compact widget activity matrix
const RECENT_CONTRIBUTION_WEEKS = (() => {
  const slice = githubFallbackContributions.slice(-77);
  const weeks: { date: string; count: number; level: number }[][] = [];
  for (let i = 0; i < slice.length; i += 7) {
    weeks.push(slice.slice(i, i + 7));
  }
  return weeks;
})();

interface ListeningTrack {
  id: string;
  title: string;
  artist: string;
  streamUrl: string;
  ytId: string;
  coverImage: string;
  coverBg: string;
  coverLabel: string;
  coverSub: string;
  duration?: string;
}

const RECENT_TRACKS: ListeningTrack[] = [
  {
    id: 'loser',
    title: 'LOSER',
    artist: 'Kenshi Yonezu',
    streamUrl:
      'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/c6/d9/2a/c6d92a27-e5e5-7b96-55bd-69c57206ba9e/mzaf_718874132971187979.plus.aac.p.m4a',
    ytId: 'Dx_fKPBPYUI',
    coverImage:
      'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/1b/7a/5e/1b7a5e77-b0c4-6e32-f3ee-c09c70f8378e/jacket_SRCL09571B00Z_550.jpg/600x600bb.jpg',
    coverBg:
      'radial-gradient(circle at 30% 30%, #ff5f57 0%, #3a1c28 52%, #121015 100%)',
    coverLabel: 'LOSER',
    coverSub: '米津玄師',
    duration: '0:30',
  },
  {
    id: 'attitude',
    title: 'ATTITUDE',
    artist: 'aespa',
    streamUrl:
      'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/84/34/f0/8434f0e6-0d39-0340-030a-0168bba3825b/mzaf_7352837177102038356.plus.aac.p.m4a',
    ytId: '4xDzrJKXOOY',
    coverImage:
      'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/50/7e/e0/507ee09f-ccfd-1e3c-af90-ca5e92b1221b/00888735949869_Cover.jpg/600x600bb.jpg',
    coverBg: 'linear-gradient(145deg, #c084fc 0%, #818cf8 48%, #38bdf8 100%)',
    coverLabel: 'ATTITUDE',
    coverSub: 'aespa',
    duration: '0:30',
  },
  {
    id: 'odoriko',
    title: 'Odoriko',
    artist: 'Vaundy',
    streamUrl:
      'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/b7/6c/e1/b76ce16b-bbb1-b2f1-37a8-50b7fe734860/mzaf_12745039835044644768.plus.aac.p.m4a',
    ytId: '7HgJIAUtICU',
    coverImage:
      'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/a2/5f/07/a25f0778-e092-ca34-5125-c2e1433c4f26/198009368648.png/600x600bb.jpg',
    coverBg:
      'radial-gradient(circle at 70% 25%, #fb923c 0%, #7c2d12 58%, #18181b 100%)',
    coverLabel: '踊り子',
    coverSub: 'Vaundy',
    duration: '0:30',
  },
  {
    id: 'flowers',
    title: 'Flowers',
    artist: 'aespa',
    streamUrl:
      'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/7d/1b/a1/7d1ba15e-19fb-0411-e503-61e4379abd10/mzaf_16342830676435185944.plus.aac.p.m4a',
    ytId: 'jfKfPfyJRdk',
    coverImage:
      'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/d5/c1/f5/d5c1f505-f588-775f-df05-c672a8ec22e9/888735949562_Cover.jpg/600x600bb.jpg',
    coverBg:
      'radial-gradient(circle at 50% 45%, #a3e635 0%, #27272a 48%, #09090b 100%)',
    coverLabel: 'FLOWERS',
    coverSub: 'aespa',
    duration: '0:30',
  },
  {
    id: 'kickback',
    title: 'KICK BACK',
    artist: 'Kenshi Yonezu',
    streamUrl:
      'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/86/2d/45/862d4572-805c-3a72-49a4-905a8c327888/mzaf_14805576631717868964.plus.aac.p.m4a',
    ytId: 'M2cckDmNLMI',
    coverImage:
      'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/4e/a8/75/4ea875d1-bdb6-9b83-185a-646391cbffbd/4547366589849.jpg/600x600bb.jpg',
    coverBg: 'linear-gradient(135deg, #facc15 0%, #ef4444 55%, #1f2937 100%)',
    coverLabel: 'KICK BACK',
    coverSub: '米津玄師',
    duration: '0:30',
  },
  {
    id: 'nightcall',
    title: 'Nightcall',
    artist: 'Kavinsky',
    streamUrl:
      'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d2/45/fb/d245fbf9-8570-fdc0-5e6b-aa528c130486/mzaf_11947081694159530687.plus.aac.p.m4a',
    ytId: 'MV_3Dpw-BRY',
    coverImage:
      'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/c1/2d/fe/c12dfe8f-cdf6-e179-d69a-8ec35f760266/00602537248681.rgb.jpg/600x600bb.jpg',
    coverBg: 'linear-gradient(150deg, #ec4899 0%, #6366f1 52%, #0f172a 100%)',
    coverLabel: 'NIGHTCALL',
    coverSub: '1986',
    duration: '0:30',
  },
];

interface WeatherForecastSlot {
  time: string;
  tempC: number;
  tempF: number;
  condition: string;
  weatherCode?: number;
  icon: typeof Sun;
  iconColor: string;
}

interface LiveWeatherData {
  tempC: number;
  tempF: number;
  condition: string;
  weatherCode: number;
  isDay: boolean;
  rainProbability: number;
  humidity: number;
  windSpeedKmH: number;
  sunrise: string;
  sunset: string;
  daylightDuration: string;
  forecast: WeatherForecastSlot[];
}

function parseWmoWeather(
  code: number,
  isDay = true
): {
  condition: string;
  icon: typeof Sun;
  iconColor: string;
} {
  if (code === 0) {
    return isDay
      ? { condition: 'Cerah', icon: Sun, iconColor: 'text-[#fbbf24]' }
      : { condition: 'Cerah Malam', icon: Moon, iconColor: 'text-[#93c5fd]' };
  }
  if (code === 1 || code === 2) {
    return isDay
      ? { condition: 'Cerah Berawan', icon: CloudSun, iconColor: 'text-[#f59e0b]' }
      : { condition: 'Berawan Tipis', icon: Moon, iconColor: 'text-[#93c5fd]' };
  }
  if (code === 3) {
    return { condition: 'Berawan', icon: Cloud, iconColor: 'text-[#cbd5e1]' };
  }
  if (code === 45 || code === 48) {
    return { condition: 'Berkabut', icon: Cloud, iconColor: 'text-[#94a3b8]' };
  }
  if (code >= 51 && code <= 55) {
    return { condition: 'Gerimis', icon: CloudRain, iconColor: 'text-[#60a5fa]' };
  }
  if (code >= 61 && code <= 65) {
    return { condition: 'Hujan', icon: CloudRain, iconColor: 'text-[#38bdf8]' };
  }
  if (code >= 80 && code <= 82) {
    return { condition: 'Hujan Deras', icon: CloudRain, iconColor: 'text-[#0284c7]' };
  }
  if (code >= 95) {
    return { condition: 'Badai Petir', icon: CloudRain, iconColor: 'text-[#f59e0b]' };
  }
  return { condition: 'Berawan', icon: Cloud, iconColor: 'text-[#cbd5e1]' };
}

const DEFAULT_WEATHER_DATA: LiveWeatherData = {
  tempC: 26,
  tempF: 79,
  condition: 'Hujan',
  weatherCode: 61,
  isDay: false,
  rainProbability: 90,
  humidity: 88,
  windSpeedKmH: 7,
  sunrise: '05:10',
  sunset: '17:36',
  daylightDuration: '12h 26m',
  forecast: [
    {
      time: 'Now',
      tempC: 26,
      tempF: 79,
      condition: 'Hujan',
      weatherCode: 61,
      icon: CloudRain,
      iconColor: 'text-[#38bdf8]',
    },
    {
      time: '19:00',
      tempC: 26,
      tempF: 79,
      condition: 'Gerimis',
      weatherCode: 51,
      icon: CloudRain,
      iconColor: 'text-[#60a5fa]',
    },
    {
      time: '21:00',
      tempC: 25,
      tempF: 77,
      condition: 'Berawan',
      weatherCode: 3,
      icon: Cloud,
      iconColor: 'text-[#cbd5e1]',
    },
    {
      time: '23:00',
      tempC: 25,
      tempF: 77,
      condition: 'Berawan Malam',
      weatherCode: 2,
      icon: Moon,
      iconColor: 'text-[#93c5fd]',
    },
  ],
};

const HOURLY_FORECAST: readonly WeatherForecastSlot[] =
  DEFAULT_WEATHER_DATA.forecast;

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
    subtitle: 'Dot-matrix live stats for @Ghufrnainun (6 Mo / 1 Yr)',
    size: { width: 186, height: 186 },
    minSize: { width: 160, height: 160 },
    maxSize: { width: 260, height: 260 },
    defaultPos: { x: 18, y: 18 },
    defaultEnabled: true,
  },
  {
    id: 'weather',
    title: 'Semarang Weather',
    subtitle: 'Live temperature, conditions & hourly forecast (WIB)',
    size: { width: 186, height: 186 },
    minSize: { width: 170, height: 170 },
    maxSize: { width: 340, height: 240 },
    defaultPos: { x: 216, y: 18 },
    defaultEnabled: true,
  },
  {
    id: 'clock',
    title: 'Semarang Clock',
    subtitle: 'Live WIB (UTC+7) time & availability',
    size: { width: 186, height: 186 },
    minSize: { width: 160, height: 160 },
    maxSize: { width: 280, height: 240 },
    defaultPos: { x: 414, y: 18 },
    defaultEnabled: false,
  },
  {
    id: 'music',
    title: 'Recent Listening',
    subtitle: '4-album grid player with shuffle & YouTube mode',
    size: { width: 384, height: 192 },
    minSize: { width: 320, height: 170 },
    maxSize: { width: 560, height: 260 },
    defaultPos: { x: 18, y: 216 },
    defaultEnabled: true,
  },
  {
    id: 'profile',
    title: 'Developer Card',
    subtitle: 'GanOS profile & quick links',
    size: { width: 186, height: 186 },
    minSize: { width: 170, height: 170 },
    maxSize: { width: 280, height: 250 },
    defaultPos: { x: 414, y: 18 },
    defaultEnabled: false,
  },
  {
    id: 'shipped',
    title: 'Pinned Work',
    subtitle: 'Direct shortcuts to featured case studies',
    size: { width: 384, height: 158 },
    minSize: { width: 280, height: 140 },
    maxSize: { width: 520, height: 240 },
    defaultPos: { x: 18, y: 420 },
    defaultEnabled: false,
  },
  {
    id: 'memo',
    title: 'Quick Memo',
    subtitle: 'Synced note with GanOS Notes app',
    size: { width: 384, height: 132 },
    minSize: { width: 260, height: 110 },
    maxSize: { width: 540, height: 280 },
    defaultPos: { x: 414, y: 216 },
    defaultEnabled: false,
  },
];

const SONOMA_WIDGET_STORAGE_KEY = 'ganos-sonoma-widgets-v4';
const DEFAULT_ENABLED_WIDGETS: SonomaWidgetId[] = WIDGET_CATALOG.filter(
  (w) => w.defaultEnabled
).map((w) => w.id);

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

  const {
    openApp,
    isDark,
    setAppearance,
    cycleWallpaper,
    note,
    setNote,
    widgetGalleryOpen,
    setWidgetGalleryOpen,
    language,
    activeTrack: osActiveTrack,
    setActiveTrack: setOsActiveTrack,
    isPlayingTrack: osIsPlayingTrack,
    setIsPlayingTrack: setOsIsPlayingTrack,
  } = useOsNote();

  const { pushNotification } = useOsNotification();

  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrackIdRef = useRef<string>(RECENT_TRACKS[0].id);
  const isTransitioningTrackRef = useRef<boolean>(false);
  const iconRefs = useRef<
    Partial<Record<DesktopIconConfig['id'], HTMLButtonElement | null>>
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
  const [now, setNow] = useState(() => new Date());
  const [weatherUnit, setWeatherUnit] = useState<'C' | 'F'>('C');
  const [activeHourlyIdx, setActiveHourlyIdx] = useState(0);
  const [liveWeather, setLiveWeather] =
    useState<LiveWeatherData>(DEFAULT_WEATHER_DATA);

  // Live GitHub contributions state for @Ghufrnainun (real baseline: 967 in 6 Mo, 1560 in 1 Yr)
  const [ghRange, setGhRange] = useState<'6m' | '1y'>('6m');
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
            contributions?: { date: string; count: number }[];
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
  useEffect(() => {
    let cancelled = false;
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=-6.9932&longitude=110.4203&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code&daily=sunrise,sunset&timezone=Asia%2FJakarta&forecast_days=1'
        );
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled || !data?.current) return;

        const currentHour = new Date().getHours();
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
          ? data.daily.sunrise[0].split('T')[1] ?? '05:10'
          : '05:10';
        const sunsetStr = data.daily?.sunset?.[0]
          ? data.daily.sunset[0].split('T')[1] ?? '17:36'
          : '17:36';

        // Calculate Daylight duration
        const [srH, srM] = sunriseStr.split(':').map(Number);
        const [ssH, ssM] = sunsetStr.split(':').map(Number);
        const totalMinutes = ssH * 60 + ssM - (srH * 60 + srM);
        const durHours = Math.floor(totalMinutes / 60);
        const durMins = Math.max(0, totalMinutes % 60);
        const daylightDuration = `${durHours}h ${durMins}m`;

        // Build 4 forecast slots: Now + 3 upcoming hours
        const slots: WeatherForecastSlot[] = [
          {
            time: 'Now',
            tempC: currentTempC,
            tempF: currentTempF,
            condition: parsedCurrent.condition,
            weatherCode: currentCode,
            icon: parsedCurrent.icon,
            iconColor: parsedCurrent.iconColor,
          },
        ];

        const hourlyTimes: string[] = data.hourly?.time ?? [];
        const hourlyTemps: number[] = data.hourly?.temperature_2m ?? [];
        const hourlyCodes: number[] = data.hourly?.weather_code ?? [];

        // Pick next 3 time points (e.g. currentHour + 2, +4, +6)
        const offsets = [2, 4, 6];
        for (const offset of offsets) {
          const targetHour = currentHour + offset;
          if (targetHour < hourlyTimes.length) {
            const hTempC = Math.round(hourlyTemps[targetHour] ?? currentTempC);
            const hTempF = Math.round((hTempC * 9) / 5 + 32);
            const hCode = Number(hourlyCodes[targetHour] ?? currentCode);
            const hIsDay = targetHour >= 6 && targetHour < 18;
            const hParsed = parseWmoWeather(hCode, hIsDay);
            const timeLabel = `${String(targetHour).padStart(2, '0')}:00`;
            slots.push({
              time: timeLabel,
              tempC: hTempC,
              tempF: hTempF,
              condition: hParsed.condition,
              weatherCode: hCode,
              icon: hParsed.icon,
              iconColor: hParsed.iconColor,
            });
          }
        }

        while (slots.length < 4) {
          const nextHour = (currentHour + slots.length) % 24;
          slots.push({
            time: `${String(nextHour).padStart(2, '0')}:00`,
            tempC: currentTempC - slots.length,
            tempF: currentTempF - slots.length,
            condition: parsedCurrent.condition,
            weatherCode: currentCode,
            icon: parsedCurrent.icon,
            iconColor: parsedCurrent.iconColor,
          });
        }

        setLiveWeather({
          tempC: currentTempC,
          tempF: currentTempF,
          condition: parsedCurrent.condition,
          weatherCode: currentCode,
          isDay,
          rainProbability: rainProb,
          humidity,
          windSpeedKmH: windSpeed,
          sunrise: sunriseStr,
          sunset: sunsetStr,
          daylightDuration,
          forecast: slots,
        });
      } catch (err) {
        console.warn(
          'Failed to fetch live Semarang weather from Open-Meteo:',
          err
        );
      }
    };

    void fetchWeather();
    // Refresh weather every 10 minutes
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // Recent Listening & Now Playing Widget state
  const [trackOffset, setTrackOffset] = useState(0);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [selectedTrackId, setSelectedTrackId] = useState<string>(
    RECENT_TRACKS[0].id
  );
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [ytEmbedTrack, setYtEmbedTrack] = useState<ListeningTrack | null>(null);
  const [musicViewMode, setMusicViewMode] = useState<'grid' | 'player'>('grid');
  const [audioPlaybackSec, setAudioPlaybackSec] = useState(0);
  const [audioDurationSec, setAudioDurationSec] = useState(30);

  const activeTrack =
    RECENT_TRACKS.find((t) => t.id === (playingTrackId ?? selectedTrackId)) ??
    RECENT_TRACKS[0];

  const visibleTracks = [0, 1, 2, 3].map(
    (i) => RECENT_TRACKS[(trackOffset + i) % RECENT_TRACKS.length]
  );

  // Sync desktop widget with OsShell / Dynamic Island media state
  useEffect(() => {
    if (osIsPlayingTrack) {
      setPlayingTrackId(osActiveTrack.id);
      setSelectedTrackId(osActiveTrack.id);
    } else {
      setPlayingTrackId(null);
    }
  }, [osIsPlayingTrack, osActiveTrack.id]);

  const playTrack = async (track: ListeningTrack) => {
    const audio = audioRef.current;
    if (!audio) return;

    currentTrackIdRef.current = track.id;
    setSelectedTrackId(track.id);

    // If this track is already playing, toggle pause
    if (playingTrackId === track.id && !audio.paused) {
      isTransitioningTrackRef.current = false;
      audio.pause();
      setPlayingTrackId(null);
      setIsAudioLoading(false);
      setOsIsPlayingTrack(false);
      return;
    }

    try {
      setIsAudioLoading(true);
      isTransitioningTrackRef.current = true;

      const isSameSrc =
        audio.src &&
        (audio.src === track.streamUrl ||
          audio.currentSrc === track.streamUrl ||
          audio.src.endsWith(track.streamUrl.split('/').pop() || ''));

      if (!isSameSrc) {
        audio.src = track.streamUrl;
      }

      await audio.play();
      setPlayingTrackId(track.id);
      setIsAudioLoading(false);
      isTransitioningTrackRef.current = false;
      setOsActiveTrack(track);
      setOsIsPlayingTrack(true);
      pushNotification({
        appId: 'music',
        appName: 'Music',
        appIcon: '/macos-icons/safari.png',
        title: language === 'id' ? 'Sedang Diputar' : 'Now Playing',
        body: `${track.title} — ${track.artist}`,
      });
    } catch (err) {
      console.warn('Audio play error:', err);
      if (currentTrackIdRef.current === track.id) {
        setPlayingTrackId(null);
        setIsAudioLoading(false);
        isTransitioningTrackRef.current = false;
        setOsIsPlayingTrack(false);
      }
    }
  };

  const handleTrackClick = (track: ListeningTrack) => {
    void playTrack(track);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetDuration =
      audio.duration && !isNaN(audio.duration) && audio.duration > 0
        ? audio.duration
        : audioDurationSec || 30;
    const newTime = ratio * targetDuration;
    audio.currentTime = newTime;
    setAudioPlaybackSec(Math.floor(newTime));
  };

  const playNextTrack = () => {
    const currentIndex = RECENT_TRACKS.findIndex(
      (t) => t.id === activeTrack.id
    );
    const nextTrack = RECENT_TRACKS[(currentIndex + 1) % RECENT_TRACKS.length];
    void playTrack(nextTrack);
  };

  const playPrevTrack = () => {
    const currentIndex = RECENT_TRACKS.findIndex(
      (t) => t.id === activeTrack.id
    );
    const prevTrack =
      RECENT_TRACKS[
        (currentIndex - 1 + RECENT_TRACKS.length) % RECENT_TRACKS.length
      ];
    void playTrack(prevTrack);
  };

  const shuffleListening = () => {
    const nextOffset = (trackOffset + 1) % RECENT_TRACKS.length;
    setTrackOffset(nextOffset);
    const nextTrack = RECENT_TRACKS[nextOffset];
    setSelectedTrackId(nextTrack.id);
    if (playingTrackId) {
      void playTrack(nextTrack);
    }
  };

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
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
  }, [enabledWidgets, widgetPositions, widgetSizes]);

  const dragSessionRef = useRef<{
    id: DesktopIconConfig['id'];
    pointerId: number;
    startClientX: number;
    startClientY: number;
    startPos: DesktopIconPosition;
    moved: boolean;
  } | null>(null);

  const widgetDragRef = useRef<{
    id: SonomaWidgetId;
    pointerId: number;
    startClientX: number;
    startClientY: number;
    startPos: DesktopIconPosition;
    size: { width: number; height: number };
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

  // Re-clamp custom icon & widget positions if viewport resizes
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
    });
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

  const widgetResizeRef = useRef<WidgetResizeSession | null>(null);

  const handleWidgetResizePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    spec: SonomaWidgetSpec,
    dir: WidgetResizeDir
  ) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();

    const curPos = widgetPositions[spec.id] ?? spec.defaultPos;
    const curSize = widgetSizes[spec.id] ?? spec.size;

    widgetResizeRef.current = {
      id: spec.id,
      dir,
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startPos: { ...curPos },
      startSize: { ...curSize },
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

    const dx = e.clientX - session.startClientX;
    const dy = e.clientY - session.startClientY;

    const container = containerRef.current;
    const bounds: DesktopBounds = container
      ? { width: container.clientWidth, height: container.clientHeight }
      : { width: 1280, height: 720 };

    const { spec, dir, startPos, startSize } = session;
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
  };

  const handleWidgetResizePointerUp = (
    e: React.PointerEvent<HTMLDivElement>
  ) => {
    const session = widgetResizeRef.current;
    if (!session || session.pointerId !== e.pointerId) return;
    widgetResizeRef.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const toggleWidget = (id: SonomaWidgetId) => {
    setEnabledWidgets((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
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

    const startPos = widgetPositions[spec.id] ?? spec.defaultPos;
    const curSize = widgetSizes[spec.id] ?? spec.size;
    widgetDragRef.current = {
      id: spec.id,
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startPos,
      size: curSize,
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
    if (Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return;

    const container = containerRef.current;
    const bounds: DesktopBounds = container
      ? { width: container.clientWidth, height: container.clientHeight }
      : { width: 1280, height: 720 };

    const clamped = clampDesktopIconPosition(
      {
        x: session.startPos.x + dx,
        y: session.startPos.y + dy,
      },
      bounds,
      session.size
    );

    setWidgetPositions((prev) => ({
      ...prev,
      [session.id]: clamped,
    }));
  };

  const handleWidgetPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const session = widgetDragRef.current;
    if (!session || session.pointerId !== e.pointerId) return;
    widgetDragRef.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
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

  const wibTime = now.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Jakarta',
  });
  const wibDate = now.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Jakarta',
  });

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
      {/* Shared HTML5 Audio element for Recent Listening widget */}
      <audio
        ref={audioRef}
        src={RECENT_TRACKS[0].streamUrl}
        preload="auto"
        onPlay={() => {
          setIsAudioLoading(false);
          setPlayingTrackId(currentTrackIdRef.current);
        }}
        onPlaying={() => {
          setIsAudioLoading(false);
          setPlayingTrackId(currentTrackIdRef.current);
        }}
        onWaiting={() => {
          setIsAudioLoading(true);
        }}
        onCanPlay={() => {
          setIsAudioLoading(false);
        }}
        onPause={() => {
          if (!isTransitioningTrackRef.current) {
            setPlayingTrackId(null);
            setIsAudioLoading(false);
          }
        }}
        onLoadedMetadata={(e) => {
          const dur = e.currentTarget.duration;
          if (dur && !isNaN(dur) && dur > 0) {
            setAudioDurationSec(Math.floor(dur));
          }
        }}
        onTimeUpdate={(e) => {
          setAudioPlaybackSec(Math.floor(e.currentTarget.currentTime));
          const dur = e.currentTarget.duration;
          if (dur && !isNaN(dur) && dur > 0) {
            setAudioDurationSec(Math.floor(dur));
          }
        }}
        onEnded={() => {
          isTransitioningTrackRef.current = false;
          playNextTrack();
        }}
        onError={() => {
          setPlayingTrackId(null);
          setIsAudioLoading(false);
          isTransitioningTrackRef.current = false;
        }}
      />

      {/* Marquee rubber-band selection box */}
      {marqueeStyle && (marqueeStyle.width > 3 || marqueeStyle.height > 3) && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute z-10 rounded-[2px] border border-[#0a84ff]/70 bg-[#0a84ff]/25 shadow-[0_0_12px_rgba(10,132,255,0.18)]"
          style={marqueeStyle}
        />
      )}

      {/* macOS Sonoma / os.atom63.io Floating Desktop Widgets */}
      <div className="hidden sm:block">
        {WIDGET_CATALOG.filter((spec) => enabledWidgets.includes(spec.id)).map(
          (spec) => {
            const pos = widgetPositions[spec.id] ?? spec.defaultPos;
            const size = widgetSizes[spec.id] ?? spec.size;
            return (
              <div
                key={spec.id}
                onPointerDown={(e) => handleWidgetPointerDown(e, spec)}
                onPointerMove={handleWidgetPointerMove}
                onPointerUp={handleWidgetPointerUp}
                onPointerCancel={handleWidgetPointerUp}
                style={{
                  left: pos.x,
                  top: pos.y,
                  width: size.width,
                  height: size.height,
                }}
                className="group/widget absolute z-10 flex cursor-grab flex-col justify-between overflow-hidden rounded-[28px] bg-[#121418] border border-white/[0.08] p-3 text-white shadow-[0_16px_36px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-200 active:cursor-grabbing hover:border-white/15 hover:shadow-[0_22px_45px_rgba(0,0,0,0.6)] select-none"
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
                  <span className="h-[2px] w-[2px] rounded-full bg-white" />
                  <div className="flex gap-[2px]">
                    <span className="h-[2px] w-[2px] rounded-full bg-white" />
                    <span className="h-[2px] w-[2px] rounded-full bg-white" />
                  </div>
                  <div className="flex gap-[2px]">
                    <span className="h-[2px] w-[2px] rounded-full bg-white" />
                    <span className="h-[2px] w-[2px] rounded-full bg-white" />
                    <span className="h-[2px] w-[2px] rounded-full bg-white" />
                  </div>
                </div>

                {/* Top Drag Pill Handle */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none mx-auto mb-1 h-1 w-7 shrink-0 rounded-full bg-white/20 transition-colors group-hover/widget:bg-white/35"
                />

                {/* Remove Widget (-) button on hover or when Widget Gallery is open */}
                <button
                  type="button"
                  onClick={() => toggleWidget(spec.id)}
                  title={`Remove ${spec.title} widget`}
                  aria-label={`Remove ${spec.title} widget`}
                  className={[
                    'absolute left-2.5 top-2.5 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-[#1b1f25] text-white/80 ring-1 ring-white/15 shadow-sm transition-all hover:scale-110 hover:bg-[#ff453a] hover:text-white',
                    widgetGalleryOpen
                      ? 'opacity-100'
                      : 'opacity-0 group-hover/widget:opacity-100',
                  ].join(' ')}
                >
                  <Minus className="h-3 w-3" />
                </button>

                {/* 1. GITHUB Contributions Widget (Playful Tactile Inset Card) */}
                {spec.id === 'github' && (
                  <div className="relative z-10 flex h-full flex-col justify-between select-none">
                    <div className="flex items-center justify-between">
                      <a
                        href={profile.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/ghLink flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-white/70 transition-colors hover:text-white"
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1b1f25] ring-1 ring-white/10">
                          <GitCommitHorizontal className="h-3 w-3 text-[#30d158] transition-transform duration-200 group-hover/ghLink:rotate-90" />
                        </span>
                        <span className="font-mono text-[10px] tracking-wide text-white/80">
                          GITHUB
                        </span>
                      </a>
                      <button
                        type="button"
                        onClick={() =>
                          setGhRange((curr) => (curr === '6m' ? '1y' : '6m'))
                        }
                        title="Toggle 6 Months / 1 Year contributions"
                        className="rounded-full bg-[#1b1f25] hover:bg-[#252b34] px-2.5 py-0.5 font-mono text-[9.5px] font-semibold text-white/85 ring-1 ring-white/10 transition-all active:scale-95"
                      >
                        {ghRange === '6m' ? '6 Mo' : '1 Yr'}
                      </button>
                    </div>

                    {/* Inset Content Box */}
                    <div className="my-auto rounded-2xl bg-[#1b1f25] p-2 ring-1 ring-white/[0.06]">
                      <div className="flex items-baseline justify-between">
                        <a
                          href={profile.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open @Ghufrnainun on GitHub"
                          className="font-mono text-[28px] font-black tracking-tight leading-none text-white hover:text-white/85 transition-colors"
                        >
                          {Number(
                            ghRange === '6m'
                              ? ghStats.sixMonths
                              : ghStats.oneYear
                          ).toLocaleString()}
                        </a>
                        <span className="flex items-center gap-1 font-mono text-[9px] font-bold tracking-wider text-[#30d158]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#30d158]" />
                          COMMITS
                        </span>
                      </div>
                      <div className="text-[10px] font-medium text-white/45 mt-0.5">
                        contributions in{' '}
                        {ghRange === '6m' ? '6 months' : '1 year'}
                      </div>

                      {/* Miniature Matrix Dots */}
                      <div className="mt-2 flex justify-between gap-[2px] rounded-xl bg-[#121418] p-1.5 ring-1 ring-white/[0.04]">
                        {RECENT_CONTRIBUTION_WEEKS.map((week, wIdx) => (
                          <div key={wIdx} className="flex flex-col gap-[2px]">
                            {week.map((day, dIdx) => (
                              <span
                                key={dIdx}
                                className={cn(
                                  'h-[3.5px] w-[3.5px] rounded-full transition-transform hover:scale-125',
                                  day.level === 0 && 'bg-white/[0.06]',
                                  day.level === 1 && 'bg-[#0e4429]',
                                  day.level === 2 && 'bg-[#006d32]',
                                  day.level === 3 && 'bg-[#26a641]',
                                  day.level >= 4 &&
                                    'bg-[#30d158] shadow-[0_0_3px_#30d158]'
                                )}
                                title={`${day.date}: ${day.count} contributions`}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10.5px]">
                      <span className="flex items-center gap-1.5 rounded-full bg-[#1b1f25] px-2.5 py-0.5 font-mono text-[9.5px] font-medium text-emerald-400 ring-1 ring-white/10">
                        <span>🔥</span>
                        <span>{ghStats.streak}d streak</span>
                      </span>
                      <a
                        href={profile.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 rounded-full bg-[#1b1f25] px-2.5 py-0.5 font-mono text-[9.5px] text-white/60 ring-1 ring-white/10 hover:text-white transition-colors"
                      >
                        <span>@Ghufrnainun</span>
                        <ArrowUpRight className="h-2.5 w-2.5" />
                      </a>
                    </div>
                  </div>
                )}

                {/* 2. RECENT LISTENING & NOW PLAYING Widget (Playful Tactile Music Controller matching Image 2) */}
                {spec.id === 'music' && (
                  <div className="relative z-10 flex h-full flex-col justify-between select-none">
                    {/* Top Bar with circular buttons like Image 2 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setMusicViewMode((m) =>
                              m === 'player' ? 'grid' : 'player'
                            )
                          }
                          title="Toggle Player / Recent view"
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1b1f25] hover:bg-[#252b34] ring-1 ring-white/10 text-white/80 transition-all active:scale-95 shadow-sm"
                        >
                          <Heart className="h-3.5 w-3.5 text-[#ff2d55]" />
                        </button>
                        <span className="font-mono text-[10px] font-bold tracking-wider text-white/80 uppercase">
                          {musicViewMode === 'player'
                            ? 'NOW PLAYING'
                            : 'RECENT LISTENING'}
                        </span>
                        {playingTrackId && (
                          <span
                            aria-hidden="true"
                            className="flex h-3 items-end gap-[2px]"
                          >
                            <span className="h-2.5 w-[2px] animate-pulse rounded-full bg-[#30d158]" />
                            <span className="h-3.5 w-[2px] animate-pulse rounded-full bg-[#30d158] delay-75" />
                            <span className="h-2 w-[2px] animate-pulse rounded-full bg-[#30d158] delay-150" />
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {ytEmbedTrack ? (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                const t = ytEmbedTrack;
                                if (playingTrackId) {
                                  audioRef.current?.pause();
                                  setPlayingTrackId(null);
                                }
                                setYtEmbedTrack(null);
                                openApp(
                                  'safari',
                                  `https://www.youtube.com/embed/${t.ytId}?autoplay=1`
                                );
                              }}
                              className="flex items-center gap-1 rounded-full bg-[#1b1f25] hover:bg-[#242a33] px-2.5 py-0.5 text-[10px] font-medium text-white/90 ring-1 ring-white/10 transition-all"
                              title="Open inside Safari window"
                            >
                              <img
                                src="/macos-icons/safari.png"
                                alt=""
                                className="h-3 w-3 object-contain"
                              />
                              <span>Safari</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setYtEmbedTrack(null)}
                              className="rounded-full bg-[#ff2d55] px-2.5 py-0.5 text-[10px] font-semibold text-white transition-opacity hover:opacity-90"
                            >
                              Back
                            </button>
                          </>
                        ) : (
                          <>
                            {/* View Mode Toggle Pill */}
                            <div className="flex items-center rounded-full bg-[#1b1f25] p-0.5 ring-1 ring-white/10">
                              <button
                                type="button"
                                onClick={() => setMusicViewMode('player')}
                                className={cn(
                                  'rounded-full px-2.5 py-0.5 text-[9.5px] font-semibold transition-all',
                                  musicViewMode === 'player'
                                    ? 'bg-[#282f3a] text-white shadow-sm ring-1 ring-white/20'
                                    : 'text-white/50 hover:text-white'
                                )}
                              >
                                Player
                              </button>
                              <button
                                type="button"
                                onClick={() => setMusicViewMode('grid')}
                                className={cn(
                                  'rounded-full px-2.5 py-0.5 text-[9.5px] font-semibold transition-all',
                                  musicViewMode === 'grid'
                                    ? 'bg-[#282f3a] text-white shadow-sm ring-1 ring-white/20'
                                    : 'text-white/50 hover:text-white'
                                )}
                              >
                                Recent
                              </button>
                            </div>

                            {/* Circular Safari / Settings Button like Image 2 */}
                            <button
                              type="button"
                              onClick={() => {
                                if (playingTrackId) {
                                  audioRef.current?.pause();
                                  setPlayingTrackId(null);
                                }
                                openApp(
                                  'safari',
                                  `https://www.youtube.com/embed/${activeTrack.ytId}?autoplay=1`
                                );
                              }}
                              title="Open inside Safari window"
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1b1f25] hover:bg-[#242a33] ring-1 ring-white/10 text-white/80 transition-all active:scale-95 shadow-sm"
                            >
                              <img
                                src="/macos-icons/safari.png"
                                alt="Safari"
                                className="h-3.5 w-3.5 object-contain"
                              />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {ytEmbedTrack ? (
                      <div className="mt-2 flex-1 min-h-[126px] w-full overflow-hidden rounded-2xl bg-black ring-1 ring-white/15">
                        <iframe
                          src={`https://www.youtube.com/embed/${ytEmbedTrack.ytId}?autoplay=1&controls=1&modestbranding=1&rel=0`}
                          title={`${ytEmbedTrack.title} — ${ytEmbedTrack.artist}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                          allowFullScreen
                          className="h-full w-full border-0"
                        />
                      </div>
                    ) : musicViewMode === 'player' ? (
                      /* NOW PLAYING VIEW (EXACTLY MATCHING IMAGE 2) */
                      <div className="my-auto flex flex-col gap-2 pt-1">
                        <div className="flex items-center gap-3.5">
                          {/* Left: Square Album Cover with smooth rounded-2xl corners */}
                          <button
                            type="button"
                            onClick={() => handleTrackClick(activeTrack)}
                            title={`Click to toggle audio (${activeTrack.title})`}
                            className="group/playerCover relative block h-[84px] w-[84px] shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/15 shadow-[0_8px_20px_rgba(0,0,0,0.5)] transition-transform hover:scale-[1.02]"
                          >
                            <img
                              src={activeTrack.coverImage}
                              alt={activeTrack.title}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover/playerCover:scale-105"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            <div
                              className={cn(
                                'absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity',
                                playingTrackId === activeTrack.id
                                  ? 'opacity-0 group-hover/playerCover:opacity-100'
                                  : 'opacity-100'
                              )}
                            >
                              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black shadow-lg">
                                {isAudioLoading &&
                                selectedTrackId === activeTrack.id ? (
                                  <RotateCw className="h-4 w-4 animate-spin text-black" />
                                ) : playingTrackId === activeTrack.id ? (
                                  <Pause className="h-4 w-4 fill-current" />
                                ) : (
                                  <Play className="h-4 w-4 translate-x-0.5 fill-current" />
                                )}
                              </span>
                            </div>
                          </button>

                          {/* Right: Artist, Title & Transport Controls (matching Image 2) */}
                          <div className="flex min-w-0 flex-1 flex-col justify-between h-[84px] py-0.5">
                            <div>
                              <div className="truncate text-[11px] font-medium text-white/50">
                                {activeTrack.artist}
                              </div>
                              <div className="truncate text-[14px] font-bold text-white leading-tight mt-0.5">
                                {activeTrack.title}
                              </div>
                            </div>

                            {/* Circular Controls Row like Image 2 */}
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleTrackClick(activeTrack)}
                                title={
                                  playingTrackId === activeTrack.id
                                    ? 'Pause'
                                    : 'Play'
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#272d37] hover:bg-[#343c4a] ring-1 ring-white/15 text-white shadow-md transition-all active:scale-95"
                              >
                                {isAudioLoading &&
                                selectedTrackId === activeTrack.id ? (
                                  <RotateCw className="h-4 w-4 animate-spin text-white" />
                                ) : playingTrackId === activeTrack.id ? (
                                  <Pause className="h-4 w-4 fill-current" />
                                ) : (
                                  <Play className="h-4 w-4 translate-x-0.5 fill-current" />
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={playPrevTrack}
                                title="Previous track"
                                className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1b1f25] hover:bg-[#272d37] ring-1 ring-white/10 text-white/75 transition-all active:scale-95"
                              >
                                <SkipBack className="h-3.5 w-3.5 fill-current" />
                              </button>

                              <button
                                type="button"
                                onClick={playNextTrack}
                                title="Next track"
                                className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1b1f25] hover:bg-[#272d37] ring-1 ring-white/10 text-white/75 transition-all active:scale-95"
                              >
                                <SkipForward className="h-3.5 w-3.5 fill-current" />
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  if (playingTrackId) {
                                    audioRef.current?.pause();
                                    setPlayingTrackId(null);
                                  }
                                  setYtEmbedTrack(activeTrack);
                                }}
                                title="Embed YouTube player"
                                className="ml-auto rounded-full bg-[#1b1f25] hover:bg-[#272d37] px-2 py-0.5 font-mono text-[9px] font-medium text-white/60 ring-1 ring-white/10 transition-colors"
                              >
                                Embed
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Scrubber & Timestamps (Matching Image 2!) */}
                        <div className="mt-1">
                          <div
                            onClick={handleSeek}
                            role="progressbar"
                            aria-valuenow={audioPlaybackSec}
                            aria-valuemin={0}
                            aria-valuemax={audioDurationSec || 30}
                            title="Click to seek"
                            className="group/scrubber relative flex h-2 w-full cursor-pointer items-center"
                          >
                            <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/10 transition-all group-hover/scrubber:h-1.5">
                              <div
                                className="h-full rounded-full bg-[#d4b996] transition-all"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    Math.max(
                                      0,
                                      (audioPlaybackSec /
                                        (audioDurationSec || 30)) *
                                        100
                                    )
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                          <div className="mt-1 flex items-center justify-between font-mono text-[9.5px] text-white/45">
                            <span>
                              00:{String(audioPlaybackSec).padStart(2, '0')}
                            </span>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={shuffleListening}
                                title="Shuffle tracks"
                                className="text-white/50 hover:text-white transition-colors"
                              >
                                <Shuffle className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (audioRef.current) {
                                    audioRef.current.currentTime = 0;
                                    audioRef.current.play();
                                  }
                                }}
                                title="Repeat current preview"
                                className="text-white/50 hover:text-white transition-colors"
                              >
                                <Repeat className="h-3 w-3" />
                              </button>
                            </div>
                            <span>
                              00:
                              {String(audioDurationSec || 30).padStart(2, '0')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* RECENT 4-ALBUM GRID VIEW WITH TACTILE SQUIRCLE CARDS */
                      <div className="my-auto grid grid-cols-4 gap-2.5 pt-1">
                        {visibleTracks.map((track) => {
                          const isTrackPlaying = playingTrackId === track.id;
                          const isTrackActive = activeTrack.id === track.id;
                          return (
                            <div
                              key={track.id}
                              className="group/track relative flex min-w-0 flex-col"
                            >
                              <button
                                type="button"
                                onClick={() => handleTrackClick(track)}
                                onDoubleClick={() => {
                                  if (playingTrackId) {
                                    audioRef.current?.pause();
                                    setPlayingTrackId(null);
                                  }
                                  openApp(
                                    'safari',
                                    `https://www.youtube.com/embed/${track.ytId}?autoplay=1`
                                  );
                                }}
                                title={`Click to play · Double-click for Safari (${track.title} — ${track.artist})`}
                                className={cn(
                                  'relative aspect-square w-full overflow-hidden rounded-2xl shadow-md transition-all duration-200 group-hover/track:scale-[1.03]',
                                  isTrackPlaying
                                    ? 'ring-2 ring-[#d4b996] shadow-[0_0_12px_rgba(212,185,150,0.35)]'
                                    : isTrackActive
                                    ? 'ring-1.5 ring-white/50'
                                    : 'ring-1 ring-white/10'
                                )}
                                style={{ background: track.coverBg }}
                              >
                                <img
                                  src={track.coverImage}
                                  alt={track.title}
                                  className="h-full w-full object-cover transition-transform duration-300 group-hover/track:scale-105"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />

                                {isTrackPlaying && (
                                  <div
                                    aria-hidden="true"
                                    className="absolute bottom-1.5 right-1.5 flex items-end gap-[1.5px] rounded-full bg-black/75 px-1.5 py-1 backdrop-blur-md ring-1 ring-white/20"
                                  >
                                    <span className="h-2 w-[2px] animate-pulse rounded-full bg-[#d4b996]" />
                                    <span className="h-3 w-[2px] animate-pulse rounded-full bg-[#d4b996] delay-75" />
                                    <span className="h-1.5 w-[2px] animate-pulse rounded-full bg-[#d4b996] delay-150" />
                                  </div>
                                )}

                                <div
                                  className={cn(
                                    'absolute inset-0 flex items-center justify-center bg-black/45 transition-opacity',
                                    isTrackPlaying
                                      ? 'opacity-100'
                                      : 'opacity-0 group-hover/track:opacity-100'
                                  )}
                                >
                                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black shadow-md transition-transform group-hover/track:scale-105 active:scale-95">
                                    {isAudioLoading &&
                                    selectedTrackId === track.id ? (
                                      <RotateCw className="h-3.5 w-3.5 animate-spin text-black" />
                                    ) : isTrackPlaying ? (
                                      <Pause className="h-3.5 w-3.5 fill-current" />
                                    ) : (
                                      <Play className="h-3.5 w-3.5 translate-x-0.5 fill-current" />
                                    )}
                                  </span>
                                </div>
                              </button>
                              <div className="mt-1 truncate text-[11px] font-bold text-white">
                                {track.title}
                              </div>
                              <div className="truncate text-[9.5px] text-white/50">
                                {track.artist}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* 2.5 SEMARANG WEATHER Widget (Playful Tactile Capsule & Micro Forecast matching Image 1) */}
                {spec.id === 'weather' && (
                  <div className="relative z-10 flex h-full flex-col justify-between select-none">
                    {/* Top Inset Card: Day/Time, Weather Illustration & Sunrise/Sunset Dashed Timeline */}
                    <div className="rounded-2xl bg-[#1b1f25] p-2 ring-1 ring-white/[0.06]">
                      {/* Header Line */}
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9.5px] font-medium text-white/50">
                          {wibDate.split(',')[0]}, {wibTime}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setWeatherUnit((prev) => (prev === 'C' ? 'F' : 'C'))
                          }
                          title="Toggle Celsius / Fahrenheit"
                          aria-label="Toggle Celsius or Fahrenheit"
                          className="rounded-full bg-[#121418] hover:bg-[#252b34] px-2 py-0.5 font-mono text-[9px] font-bold text-white/80 ring-1 ring-white/10 transition-all active:scale-95"
                        >
                          °{weatherUnit}
                        </button>
                      </div>

                      {/* Main Weather Hero Row */}
                      {(() => {
                        const activeSlot =
                          liveWeather.forecast[activeHourlyIdx] ??
                          liveWeather.forecast[0];
                        const isRain =
                          (activeSlot.weatherCode &&
                            activeSlot.weatherCode >= 50) ||
                          activeSlot.condition.toLowerCase().includes('hujan') ||
                          activeSlot.condition.toLowerCase().includes('gerimis');
                        const isClearNight =
                          !liveWeather.isDay &&
                          (activeSlot.weatherCode === 0 ||
                            activeSlot.weatherCode === 1);

                        return (
                          <div className="mt-1 flex items-center gap-2">
                            {/* Dynamic Weather Graphic matching Live Condition */}
                            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
                              {isRain ? (
                                <>
                                  <span className="absolute h-5 w-5 rounded-full bg-[#38bdf8]/20 blur-sm" />
                                  <CloudRain className="relative h-6 w-6 text-[#38bdf8] drop-shadow-[0_2px_8px_rgba(56,189,248,0.5)]" />
                                </>
                              ) : isClearNight ? (
                                <>
                                  <span className="absolute h-5 w-5 rounded-full bg-[#93c5fd]/20 blur-sm" />
                                  <Moon className="relative h-5 w-5 text-[#93c5fd] drop-shadow-[0_0_8px_rgba(147,197,253,0.5)]" />
                                </>
                              ) : (
                                <>
                                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-gradient-to-tr from-[#ff9500] to-[#ffcc00] shadow-[0_0_10px_rgba(255,149,0,0.7)]" />
                                  <Cloud className="relative h-5 w-5 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                                </>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="truncate text-[13px] font-bold leading-tight text-white">
                                {activeSlot.condition}{' '}
                                {weatherUnit === 'C'
                                  ? `${activeSlot.tempC}°C`
                                  : `${activeSlot.tempF}°F`}
                              </div>
                              <div className="flex items-center gap-1 text-[9.5px] text-white/45">
                                <MapPin className="h-2.5 w-2.5 text-[#ff9f0a]" />
                                <span>Semarang, Indonesia</span>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Dashed Timeline: Sunrise / Daylight Duration / Sunset */}
                      <div className="mt-1.5 flex items-center justify-between text-[8.5px] font-mono text-white/45">
                        <span className="flex items-center gap-1">
                          <Sunrise className="h-2.5 w-2.5 text-[#ff9f0a]" />
                          <span>{liveWeather.sunrise}</span>
                        </span>
                        <span className="flex-1 mx-1.5 border-b border-dashed border-white/15" />
                        <span className="text-[8px] text-white/35">
                          {liveWeather.daylightDuration}
                        </span>
                        <span className="flex-1 mx-1.5 border-b border-dashed border-white/15" />
                        <span className="flex items-center gap-1">
                          <span>{liveWeather.sunset}</span>
                          <Sunset className="h-2.5 w-2.5 text-[#ff453a]" />
                        </span>
                      </div>
                    </div>

                    {/* Middle Stat Row (Pill Capsules like Image 1) */}
                    <div className="flex items-center justify-between px-0.5 text-[9px]">
                      <span className="flex items-center gap-1 rounded-full bg-[#1b1f25] px-2 py-0.5 font-medium text-white/80 ring-1 ring-white/10">
                        <CloudRain className="h-2.5 w-2.5 text-[#64d2ff]" />
                        <span>Rain: {liveWeather.rainProbability}%</span>
                      </span>
                      <span className="font-mono text-white/45">
                        Humidity: {liveWeather.humidity}%
                      </span>
                      <span className="font-mono text-white/45">
                        Wind: {liveWeather.windSpeedKmH} km/h
                      </span>
                    </div>

                    {/* Bottom Forecast Vertical Capsules (matching Image 1) */}
                    <div className="grid grid-cols-4 gap-1">
                      {liveWeather.forecast.map((slot, sIdx) => {
                        const SlotIcon = slot.icon;
                        const temp =
                          weatherUnit === 'C'
                            ? `${slot.tempC}°`
                            : `${slot.tempF}°`;
                        const isSelected = activeHourlyIdx === sIdx;
                        const isSlotSun =
                          slot.time === 'Now' &&
                          (!slot.weatherCode || slot.weatherCode < 50) &&
                          liveWeather.isDay;
                        return (
                          <button
                            key={slot.time}
                            type="button"
                            onClick={() => setActiveHourlyIdx(sIdx)}
                            title={`${slot.time} forecast: ${temp} (${slot.condition})`}
                            aria-label={`${slot.time} forecast ${temp}`}
                            className={cn(
                              'flex flex-col items-center justify-between rounded-xl py-1 px-0.5 transition-all duration-150 active:scale-95',
                              isSelected
                                ? 'bg-[#272d37] ring-1 ring-white/25 shadow-sm'
                                : 'bg-[#1b1f25] ring-1 ring-white/5 hover:bg-[#20252d]'
                            )}
                          >
                            <span
                              className={cn(
                                'text-[8.5px] font-medium',
                                isSelected ? 'text-white' : 'text-white/40'
                              )}
                            >
                              {slot.time}
                            </span>
                            <div className="my-0.5 flex h-4 w-4 items-center justify-center">
                              {isSlotSun ? (
                                <span className="h-2.5 w-2.5 rounded-full bg-[#ff9f0a] shadow-[0_0_6px_#ff9f0a]" />
                              ) : (
                                <SlotIcon
                                  className={cn(
                                    'h-3 w-3',
                                    isSelected
                                      ? slot.iconColor
                                      : 'text-white/50'
                                  )}
                                />
                              )}
                            </div>
                            <span className="font-mono text-[9px] font-bold text-white/90">
                              {temp}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. SEMARANG CLOCK Widget (Digital Precision Chronometer Utility) */}
                {spec.id === 'clock' && (
                  <div className="relative z-10 flex h-full flex-col justify-between select-none">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1b1f25] ring-1 ring-white/10">
                          <Clock className="h-3 w-3 text-[#64d2ff]" />
                        </span>
                        <span className="font-mono text-[10px] font-bold tracking-wider text-white/80">
                          SEMARANG
                        </span>
                      </div>
                      <span className="rounded-full bg-[#1b1f25] px-2 py-0.5 font-mono text-[9px] font-bold text-[#64d2ff] ring-1 ring-white/10">
                        WIB · UTC+7
                      </span>
                    </div>

                    <div className="my-auto rounded-2xl bg-[#1b1f25] p-2.5 ring-1 ring-white/[0.06] flex flex-col justify-between">
                      <div>
                        <div className="flex items-baseline justify-between">
                          <span className="font-mono text-[30px] font-black tracking-tight leading-none text-white">
                            {wibTime}
                          </span>
                          <span className="font-mono text-[8.5px] font-semibold text-[#64d2ff] bg-[#64d2ff]/10 px-1.5 py-0.5 rounded-full ring-1 ring-[#64d2ff]/20">
                            SEC LIVE
                          </span>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[10px] font-medium text-white/50">
                          <span>{wibDate}</span>
                          <span className="font-mono text-[9px] text-white/35">
                            GMT+07:00
                          </span>
                        </div>
                      </div>

                      {/* Chronometer precision tick bar */}
                      <div
                        className="mt-2.5 flex items-center justify-between gap-[2px] opacity-40"
                        aria-hidden="true"
                      >
                        {Array.from({ length: 16 }).map((_, i) => (
                          <span
                            key={i}
                            className={cn(
                              'rounded-full',
                              i % 4 === 0
                                ? 'h-2 w-[2px] bg-[#64d2ff]'
                                : 'h-1 w-[1.5px] bg-white/25'
                            )}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-full bg-[#1b1f25] px-2.5 py-1 ring-1 ring-white/10">
                      <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#30d158] opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#30d158] shadow-[0_0_6px_#30d158]" />
                        </span>
                        <span className="truncate font-mono text-[9.5px] font-semibold text-emerald-400">
                          {profile.availability}
                        </span>
                      </div>
                      <span className="font-mono text-[8.5px] font-bold text-emerald-500/80 uppercase">
                        ONLINE
                      </span>
                    </div>
                  </div>
                )}

                {/* 4. DEVELOPER PROFILE Widget (Playful Tactile Identity Card) */}
                {spec.id === 'profile' && (
                  <div className="relative z-10 flex h-full flex-col justify-between select-none">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1b1f25] ring-1 ring-white/10">
                          <User className="h-3 w-3 text-[#64d2ff]" />
                        </span>
                        <span className="font-mono text-[10px] font-bold tracking-wider text-white/80">
                          DEVELOPER ID
                        </span>
                      </div>
                      <span className="rounded-full bg-[#1b1f25] px-2 py-0.5 font-mono text-[9px] font-bold text-[#64d2ff] ring-1 ring-white/10">
                        GAN·OS
                      </span>
                    </div>

                    <div className="my-auto rounded-2xl bg-[#1b1f25] p-2 ring-1 ring-white/[0.06]">
                      <div className="flex items-center gap-2">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-2xl ring-1.5 ring-white/20 shadow-md">
                          <img
                            src="/Photo.webp"
                            alt={profile.name}
                            draggable={false}
                            className="h-full w-full object-cover object-top transition-transform duration-300 hover:scale-105"
                          />
                          <span
                            className="absolute bottom-0.5 right-0.5 h-2 w-2 rounded-full bg-[#30d158] ring-1 ring-[#1b1f25]"
                            title="Online"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-[13px] font-bold leading-tight text-white">
                            Ghufron Ainun
                          </div>
                          <div className="truncate text-[10px] font-medium text-white/50">
                            Full-Stack Dev
                          </div>
                        </div>
                      </div>

                      <div className="mt-1.5 flex items-center justify-between rounded-xl bg-[#121418] px-2 py-1 ring-1 ring-white/[0.04]">
                        <div className="min-w-0">
                          <span className="block truncate text-[9.5px] font-medium text-white/70">
                            Sem {profile.semester} · Polines
                          </span>
                        </div>
                        <div className="flex shrink-0 items-center gap-1 rounded-full bg-[#64d2ff]/15 px-2 py-0.5 font-mono text-[9px] font-bold text-[#64d2ff] ring-1 ring-[#64d2ff]/25">
                          <span>GPA {education.gpa}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => openApp('about')}
                        className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-[#1b1f25] hover:bg-[#252b34] active:scale-[0.97] py-1 text-[10.5px] font-semibold text-white ring-1 ring-white/10 transition-all shadow-sm"
                      >
                        <span>Bio</span>
                        <ArrowUpRight className="h-3 w-3 text-white/50" />
                      </button>
                      <a
                        href={profile.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-[#1b1f25] hover:bg-[#252b34] active:scale-[0.97] py-1 text-[10.5px] font-semibold text-white ring-1 ring-white/10 transition-all shadow-sm"
                      >
                        <span>GitHub</span>
                        <ArrowUpRight className="h-3 w-3 text-white/50" />
                      </a>
                    </div>
                  </div>
                )}

                {/* 5. PINNED WORK Widget (Playful Tactile Portfolio Navigator) */}
                {spec.id === 'shipped' && (
                  <div className="relative z-10 flex h-full flex-col justify-between select-none">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1b1f25] ring-1 ring-white/10">
                          <FolderGit2 className="h-3 w-3 text-[#0a84ff]" />
                        </span>
                        <span className="font-mono text-[10px] font-bold tracking-wider text-white/80 uppercase">
                          PINNED WORK
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => openApp('projects')}
                        className="flex items-center gap-1 rounded-full bg-[#1b1f25] hover:bg-[#252b34] px-2.5 py-0.5 text-[9.5px] font-semibold text-[#64d2ff] ring-1 ring-white/10 transition-all active:scale-95"
                      >
                        <span>All ({featuredProjects.length})</span>
                        <ArrowUpRight className="h-2.5 w-2.5" />
                      </button>
                    </div>

                    <div className="space-y-1.5 py-0.5">
                      {featuredProjects.slice(0, 3).map((project, idx) => (
                        <button
                          key={project.slug}
                          type="button"
                          onClick={() => openApp('projects', project.slug)}
                          className="group/tile flex w-full items-center justify-between gap-2.5 rounded-2xl bg-[#1b1f25] hover:bg-[#252b34] px-2.5 py-1.5 text-left ring-1 ring-white/[0.06] hover:ring-white/20 transition-all duration-150 active:scale-[0.99] shadow-sm"
                        >
                          <div className="flex min-w-0 items-center gap-2.5">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#121418] ring-1 ring-white/10 font-mono text-[9px] font-bold text-white/40 group-hover/tile:text-white transition-colors">
                              0{idx + 1}
                            </span>
                            <span
                              className="h-2 w-2 shrink-0 rounded-full transition-transform group-hover/tile:scale-125"
                              style={{
                                backgroundColor: project.color,
                                boxShadow: `0 0 8px ${project.color}70`,
                              }}
                            />
                            <div className="min-w-0">
                              <span className="block truncate text-[12px] font-bold leading-tight text-white transition-colors group-hover/tile:text-[#64d2ff]">
                                {project.title}
                              </span>
                              <span className="block truncate text-[9.5px] text-white/45">
                                {project.category || 'Featured Work'}
                              </span>
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-1.5">
                            <span className="rounded-full bg-[#121418] px-2 py-0.5 font-mono text-[9px] font-medium text-white/60 ring-1 ring-white/10">
                              {project.year}
                            </span>
                            <ArrowUpRight className="h-3 w-3 text-white/35 transition-all group-hover/tile:translate-x-0.5 group-hover/tile:-translate-y-0.5 group-hover/tile:text-white" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. QUICK MEMO Widget (Playful Tactile Stationery Pad) */}
                {spec.id === 'memo' && (
                  <div className="relative z-10 flex h-full flex-col justify-between select-none">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1b1f25] ring-1 ring-white/10">
                          <StickyNote className="h-3 w-3 text-[#ffd60a]" />
                        </span>
                        <span className="font-mono text-[10px] font-bold tracking-wider text-[#ffd60a] uppercase">
                          QUICK MEMO
                        </span>
                        <span className="h-1.5 w-1.5 rounded-full bg-[#ffd60a]/60" />
                      </div>
                      <button
                        type="button"
                        onClick={() => openApp('notes')}
                        className="flex items-center gap-1 rounded-full bg-[#1b1f25] hover:bg-[#252b34] px-2.5 py-0.5 text-[9.5px] font-medium text-white/80 ring-1 ring-white/10 transition-all hover:text-white active:scale-95"
                      >
                        <span>Open Notes</span>
                        <ArrowUpRight className="h-2.5 w-2.5" />
                      </button>
                    </div>

                    <div className="relative mt-1 flex flex-1 min-h-0 flex-col overflow-hidden rounded-2xl bg-[#1b1f25] ring-1 ring-white/[0.06] shadow-inner">
                      <div className="h-[2px] w-full bg-gradient-to-r from-[#ffd60a] via-[#ff9f0a] to-transparent opacity-80" />
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={2}
                        placeholder="Jot down a quick thought..."
                        aria-label="Quick desktop memo"
                        className="flex-1 min-h-0 w-full resize-none bg-transparent p-2 text-[12px] leading-5 text-amber-50/90 placeholder:text-white/30 outline-none selection:bg-[#ffd60a]/30"
                        style={{
                          backgroundImage:
                            'repeating-linear-gradient(transparent, transparent 19px, rgba(255, 255, 255, 0.035) 19px, rgba(255, 255, 255, 0.035) 20px)',
                          backgroundAttachment: 'local',
                        }}
                      />
                      <div className="flex items-center justify-between border-t border-white/[0.04] bg-[#121418] px-2.5 py-1 text-[9px] text-white/40">
                        <span className="flex items-center gap-1 font-mono">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#30d158]" />
                          Synced with Notes
                        </span>
                        <span className="font-mono text-[8.5px] text-white/30">
                          {note.length} chars
                        </span>
                      </div>
                    </div>
                  </div>
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
            className="group absolute z-20 flex w-[88px] flex-col items-center gap-1 rounded-[8px] p-1 text-center transition-transform duration-100 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 active:scale-[0.96]"
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
      {widgetGalleryOpen && (
        <div
          role="dialog"
          aria-label="Edit Desktop Widgets"
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute inset-x-4 bottom-24 z-30 mx-auto max-w-2xl rounded-[28px] bg-[#121418] border border-white/[0.08] p-4 sm:p-5 text-white shadow-[0_24px_60px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.08)] select-none animate-in fade-in zoom-in-95 duration-150 ease-out"
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
                    GanOS Desktop Widgets
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
                  setEnabledWidgets(DEFAULT_ENABLED_WIDGETS);
                  setWidgetPositions({});
                  setWidgetSizes({});
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
                    'group/item flex items-center justify-between gap-3 rounded-2xl p-3 text-left transition-[background-color,border-color,box-shadow,transform] duration-150 ease-out active:scale-[0.98]',
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
                      {spec.id === 'clock' && <Clock className="h-4.5 w-4.5" />}
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
                      'flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold transition-all shadow-sm',
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
        </div>
      )}

      {/* macOS Desktop Context Menu */}
      {contextMenu && (
        <div
          role="menu"
          onPointerDown={(e) => e.stopPropagation()}
          style={{ left: contextMenu.x, top: contextMenu.y }}
          className="absolute z-30 w-[228px] rounded-[10px] bg-[#f6f6f6]/90 p-1.5 text-[13px] text-black/85 shadow-[0_12px_36px_rgba(0,0,0,0.32)] ring-1 ring-black/10 backdrop-blur-[40px] dark:bg-[#231d21]/90 dark:text-white/90 dark:ring-white/15"
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
              setWidgetPositions({});
              setSelectedIds([]);
              setContextMenu(null);
            }}
            className="flex w-full items-center justify-between rounded-[6px] px-2.5 py-1 text-left hover:bg-[#0a84ff] hover:text-white"
          >
            <span>Clean Up Desktop</span>
          </button>
        </div>
      )}
    </div>
  );
}
