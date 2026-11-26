import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Bookmark,
  BookOpen,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Compass,
  Copy,
  ExternalLink,
  FileText,
  FolderKanban,
  Globe,
  History,
  Info,
  Lock,
  Music,
  Paintbrush,
  PanelLeft,
  Plus,
  RotateCw,
  Search,
  Send,
  Share,
  ShieldAlert,
  Image as ImageIcon,
  Sun,
  User,
  X,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ensureFontGroup } from '@/lib/loadFont';
import {
  certifications,
  education,
  organizationExperience,
  profile,
  skillTiers,
} from '@/data/profile';
import { featuredProjects } from '@/data/featuredProjects';
import { RECENT_TRACKS } from '@/data/recentTracks';
import {
  GANOS_VERSION,
  useOsNote,
  useWindowFocus,
  WALLPAPERS,
  type OsAppearance,
  type SettingsPaneId,
  type SystemFontId,
} from '@/components/os/OsShellContext';
import {
  playSoftSelectSound,
  playToggleSound,
  SOUND_PREVIEW_ITEMS,
} from '@/lib/soundEffects';
import { useOsNotification } from '@/components/os/OsNotificationContext';
import {
  Avatar,
  SettingsGroup,
  SettingsRow,
  Sidebar,
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
} from '@/components/os/OsWindowChrome';

interface SafariTab {
  id: string;
  title: string;
  url: string;
  history: string[];
  historyIndex: number;
}

type SafariPortfolioIconKey = 'projects' | 'resume' | 'blog' | 'about' | 'legacy';

interface SafariPortfolioBookmark {
  id: string;
  label: string;
  shortLabel: string;
  pathHint: string;
  url: string;
  keywords: string[];
  icon: SafariPortfolioIconKey;
}

interface SafariTrackBookmark {
  id: string;
  label: string;
  title: string;
  artist: string;
  duration?: string;
  coverImage: string;
  coverBg: string;
  url: string;
}

interface SafariExternalLink {
  id: string;
  label: string;
  hostHint: string;
  url: string;
}

type BlockedInfo =
  | { kind: 'url'; targetUrl: string; hostname: string }
  | { kind: 'query'; query: string; searchUrl: string };

const MAX_SAFARI_TABS = 4;

const ALLOWED_INTERNAL_PREFIXES = [
  '/old',
  '/projects',
  '/blog',
  '/resume',
  '/about',
] as const;

const OWN_PORTFOLIO_HOSTS = new Set([
  'ghufronainun.tech',
  'www.ghufronainun.tech',
]);

const ALLOWED_EMBED_HOSTS = new Set([
  'www.youtube.com',
  'youtube.com',
  'www.youtube-nocookie.com',
]);

const SAFARI_PORTFOLIO_BOOKMARKS: readonly SafariPortfolioBookmark[] = [
  {
    id: 'fav-projects',
    label: 'Featured Projects',
    shortLabel: 'Projects',
    pathHint: '/projects',
    url: '/projects',
    keywords: ['projects', 'work', 'case study', 'pbundip', 'tempemail'],
    icon: 'projects',
  },
  {
    id: 'fav-resume',
    label: 'Curriculum Vitae',
    shortLabel: 'Resume',
    pathHint: '/resume',
    url: '/resume',
    keywords: ['resume', 'cv', 'curriculum vitae', 'experience'],
    icon: 'resume',
  },
  {
    id: 'fav-blog',
    label: 'Engineering Blog',
    shortLabel: 'Writing',
    pathHint: '/blog',
    url: '/blog',
    keywords: ['blog', 'writing', 'articles', 'posts', 'notes'],
    icon: 'blog',
  },
  {
    id: 'fav-about',
    label: 'About Ghufron',
    shortLabel: 'About Me',
    pathHint: '/about',
    url: '/about',
    keywords: ['about', 'profile', 'bio', 'ghufron'],
    icon: 'about',
  },
  {
    id: 'fav-old',
    label: 'Legacy Portfolio',
    shortLabel: 'Legacy Portfolio',
    pathHint: '/old',
    url: '/old',
    keywords: ['old', 'legacy', 'archive', 'previous'],
    icon: 'legacy',
  },
];

const CURATED_SAFARI_TRACK_IDS = [
  'odoriko',
  'loser',
  'supernova',
  'whiplash',
  'kickback',
  'nightcall',
] as const;

const SAFARI_TRACK_BOOKMARKS: readonly SafariTrackBookmark[] =
  CURATED_SAFARI_TRACK_IDS.flatMap((trackId) => {
    const track = RECENT_TRACKS.find((t) => t.id === trackId);
    if (!track) return [];
    return [
      {
        id: `yt-${track.id}`,
        label: `${track.title} — ${track.artist}`,
        title: track.title,
        artist: track.artist,
        duration: track.duration,
        coverImage: track.coverImage,
        coverBg: track.coverBg,
        url: `https://www.youtube.com/embed/${track.ytId}?autoplay=1`,
      },
    ];
  });

const SAFARI_EXTERNAL_LINKS: readonly SafariExternalLink[] = [
  {
    id: 'ext-github',
    label: 'GitHub',
    hostHint: 'github.com/Ghufrnainun',
    url: profile.github,
  },
  {
    id: 'ext-linkedin',
    label: 'LinkedIn',
    hostHint: 'linkedin.com/in/ghufronainunnajib',
    url: profile.linkedin,
  },
];

function renderPortfolioBookmarkIcon(icon: SafariPortfolioIconKey, size = 18) {
  switch (icon) {
    case 'projects':
      return <FolderKanban size={size} className="text-[#0a84ff]" />;
    case 'resume':
      return <FileText size={size} className="text-[#30b0c7]" />;
    case 'blog':
      return <BookOpen size={size} className="text-[#bf5af2]" />;
    case 'about':
      return <User size={size} className="text-[#34c759]" />;
    case 'legacy':
      return <History size={size} className="text-[#ff9f0a]" />;
  }
}

function isAllowedInternalPath(path: string): boolean {
  const clean = path.split(/[?#]/)[0] || '/';
  return ALLOWED_INTERNAL_PREFIXES.some(
    (prefix) => clean === prefix || clean.startsWith(`${prefix}/`),
  );
}

function extractYouTubeEmbedUrl(raw: string): string | null {
  try {
    const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    const parsed = new URL(normalized);
    const host = parsed.hostname.toLowerCase();
    let vidId = '';

    if (host === 'youtu.be' || host === 'www.youtu.be') {
      vidId = parsed.pathname.split('/').filter(Boolean)[0] ?? '';
    } else if (
      host === 'youtube.com' ||
      host === 'www.youtube.com' ||
      host === 'm.youtube.com' ||
      host === 'www.youtube-nocookie.com'
    ) {
      if (parsed.pathname === '/watch') {
        vidId = parsed.searchParams.get('v') ?? '';
      } else if (parsed.pathname.startsWith('/embed/')) {
        vidId = parsed.pathname.split('/embed/')[1]?.split('/')[0] ?? '';
      } else if (parsed.pathname.startsWith('/shorts/')) {
        vidId = parsed.pathname.split('/shorts/')[1]?.split('/')[0] ?? '';
      }
    }

    if (vidId && /^[a-zA-Z0-9_-]{6,20}$/.test(vidId)) {
      return `https://www.youtube.com/embed/${vidId}?autoplay=1`;
    }
  } catch {
    return null;
  }
  return null;
}

function makeBlockedUrl(targetUrl: string): string {
  return `safari:blocked?url=${encodeURIComponent(targetUrl)}`;
}

function makeBlockedQuery(query: string): string {
  return `safari:blocked?q=${encodeURIComponent(query)}`;
}

function parseBlockedUrl(url: string): BlockedInfo | null {
  if (!url.startsWith('safari:blocked?')) return null;
  const params = new URLSearchParams(url.slice('safari:blocked?'.length));
  const blockedTarget = params.get('url');
  if (blockedTarget) {
    let hostname = blockedTarget;
    try {
      hostname = new URL(blockedTarget).hostname.replace(/^www\./, '');
    } catch {
      /* keep raw */
    }
    return { kind: 'url', targetUrl: blockedTarget, hostname };
  }
  const query = params.get('q');
  if (query) {
    return {
      kind: 'query',
      query,
      searchUrl: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
    };
  }
  return null;
}

function isSafeEmbeddableUrl(url: string): boolean {
  if (url === 'safari:start' || url.startsWith('safari:blocked?')) return false;
  if (url.startsWith('/')) return isAllowedInternalPath(url);
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return false;
    }
    const host = parsed.hostname.toLowerCase();
    if (ALLOWED_EMBED_HOSTS.has(host) && parsed.pathname.startsWith('/embed/')) {
      return true;
    }
    if (
      typeof window !== 'undefined' &&
      host === window.location.hostname.toLowerCase() &&
      isAllowedInternalPath(parsed.pathname)
    ) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

function resolveSafariInput(rawInput: string): string {
  const input = rawInput.trim();
  if (!input) return 'safari:start';
  const lower = input.toLowerCase();

  if (
    lower === 'safari:start' ||
    lower === 'start' ||
    lower === 'favorites' ||
    lower === 'home'
  ) {
    return 'safari:start';
  }
  if (input.startsWith('safari:blocked?')) {
    return input;
  }

  // 1. Direct internal route
  if (input.startsWith('/')) {
    if (isAllowedInternalPath(input)) return input;
    const origin =
      typeof window !== 'undefined'
        ? window.location.origin
        : profile.website;
    return makeBlockedUrl(`${origin}${input}`);
  }

  // 2. YouTube links (watch / shorts / youtu.be / embed)
  const ytEmbed = extractYouTubeEmbedUrl(input);
  if (ytEmbed) return ytEmbed;

  // 3. Domain / URL input
  const hasProtocol = /^https?:\/\//i.test(input);
  const looksLikeDomain =
    !/\s/.test(input) &&
    /^([a-z0-9-]+\.)+[a-z]{2,}(\/.*)?$/i.test(input);

  if (hasProtocol || looksLikeDomain) {
    const normalized = hasProtocol ? input : `https://${input}`;
    try {
      const parsed = new URL(normalized);
      const host = parsed.hostname.toLowerCase();
      const isOwnHost =
        OWN_PORTFOLIO_HOSTS.has(host) ||
        (typeof window !== 'undefined' &&
          host === window.location.hostname.toLowerCase());

      if (isOwnHost) {
        const internalPath = `${parsed.pathname}${parsed.search}${parsed.hash}`;
        if (parsed.pathname === '/' || parsed.pathname === '') {
          return 'safari:start';
        }
        if (isAllowedInternalPath(parsed.pathname)) {
          return internalPath;
        }
      }

      if (ALLOWED_EMBED_HOSTS.has(host) && parsed.pathname.startsWith('/embed/')) {
        return parsed.toString();
      }

      return makeBlockedUrl(parsed.toString());
    } catch {
      return makeBlockedQuery(input);
    }
  }

  // 4. Plain-text keyword matching curated portfolio pages & tracks
  const portfolioMatch = SAFARI_PORTFOLIO_BOOKMARKS.find(
    (b) =>
      b.label.toLowerCase().includes(lower) ||
      b.pathHint.slice(1).toLowerCase() === lower ||
      b.keywords.some((kw) => kw.includes(lower) || lower.includes(kw)),
  );
  if (portfolioMatch) return portfolioMatch.url;

  const trackMatch = SAFARI_TRACK_BOOKMARKS.find(
    (t) =>
      t.title.toLowerCase().includes(lower) ||
      t.artist.toLowerCase().includes(lower) ||
      t.label.toLowerCase().includes(lower),
  );
  if (trackMatch) return trackMatch.url;

  const externalMatch = SAFARI_EXTERNAL_LINKS.find(
    (e) =>
      e.label.toLowerCase().includes(lower) ||
      e.hostHint.toLowerCase().includes(lower),
  );
  if (externalMatch) return makeBlockedUrl(externalMatch.url);

  // 5. Unknown search query -> sandbox notice with Google handoff
  return makeBlockedQuery(input);
}

function formatDisplayUrl(url: string): string {
  if (url === 'safari:start') return 'Favorites';
  const blocked = parseBlockedUrl(url);
  if (blocked) {
    return blocked.kind === 'url' ? blocked.hostname : blocked.query;
  }
  if (url === '/old') return 'ghufronainun.tech/old';
  try {
    const parsed = new URL(url);
    if (
      parsed.hostname.includes('youtube') &&
      parsed.pathname.includes('/embed/')
    ) {
      const vidId = parsed.pathname.split('/embed/')[1]?.split('?')[0];
      return `youtube.com/watch?v=${vidId}`;
    }
    return `${parsed.hostname}${parsed.pathname === '/' ? '' : parsed.pathname}`;
  } catch {
    if (url.startsWith('/')) return `ghufronainun.tech${url}`;
    return url;
  }
}

function formatDisplayTitle(url: string): string {
  if (url === 'safari:start') return 'Start Page';
  const blocked = parseBlockedUrl(url);
  if (blocked) {
    return blocked.kind === 'url'
      ? blocked.hostname
      : `Search: ${blocked.query}`;
  }
  const portfolio = SAFARI_PORTFOLIO_BOOKMARKS.find((b) => b.url === url);
  if (portfolio) return portfolio.shortLabel;
  const track = SAFARI_TRACK_BOOKMARKS.find((b) => b.url === url);
  if (track) return track.label;
  if (url.includes('youtube.com/embed/')) {
    const id = url.split('/embed/')[1]?.split('?')[0];
    const recentMatch = RECENT_TRACKS.find((t) => t.ytId === id);
    if (recentMatch) return `${recentMatch.title} — ${recentMatch.artist}`;
    return `YouTube (${id})`;
  }
  return formatDisplayUrl(url);
}

function formatExternalUrl(url: string): string {
  if (url === 'safari:start') return window.location.origin;
  const blocked = parseBlockedUrl(url);
  if (blocked) {
    return blocked.kind === 'url' ? blocked.targetUrl : blocked.searchUrl;
  }
  if (url.includes('youtube.com/embed/')) {
    const vidId = url.split('/embed/')[1]?.split('?')[0];
    return `https://www.youtube.com/watch?v=${vidId}`;
  }
  if (url.startsWith('/')) {
    return `${window.location.origin}${url}`;
  }
  return url;
}

type QuickSwitcherItem =
  | {
      key: string;
      kind: 'portfolio';
      label: string;
      meta: string;
      url: string;
      icon: SafariPortfolioIconKey;
    }
  | {
      key: string;
      kind: 'track';
      label: string;
      meta: string;
      url: string;
    }
  | {
      key: string;
      kind: 'external';
      label: string;
      meta: string;
      url: string;
    };

export const SafariApp: React.FC<{ initialUrl?: string }> = ({
  initialUrl = '/old',
}) => {
  const { pushNotification } = useOsNotification();
  const safeInitialUrl = resolveSafariInput(initialUrl);

  const [tabs, setTabs] = useState<SafariTab[]>([
    {
      id: 'tab-1',
      title: formatDisplayTitle(safeInitialUrl),
      url: safeInitialUrl,
      history: [safeInitialUrl],
      historyIndex: 0,
    },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('tab-1');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressInput, setAddressInput] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isReloading, setIsReloading] = useState(false);
  const [isIframeLoading, setIsIframeLoading] = useState(() =>
    isSafeEmbeddableUrl(safeInitialUrl),
  );
  const [copiedShare, setCopiedShare] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const activeTab = useMemo(
    () => tabs.find((t) => t.id === activeTabId) ?? tabs[0],
    [tabs, activeTabId],
  );

  const activeTabIdRef = useRef(activeTabId);
  activeTabIdRef.current = activeTabId;
  const tabsRef = useRef(tabs);
  tabsRef.current = tabs;
  const prevInitialUrlRef = useRef(initialUrl);
  const tabSeqRef = useRef(2);
  const addressInputRef = useRef<HTMLInputElement>(null);

  // Sync only when initialUrl prop actually updates from external desktop actions (e.g. music widget)
  useEffect(() => {
    if (!initialUrl || initialUrl === prevInitialUrlRef.current) return;
    prevInitialUrlRef.current = initialUrl;
    const resolved = resolveSafariInput(initialUrl);
    const targetTabId = activeTabIdRef.current;

    const existing = tabsRef.current.find((t) => t.url === resolved);
    if (existing) {
      setActiveTabId(existing.id);
      setShowOverview(false);
      setIsEditingAddress(false);
      return;
    }

    setTabs((prev) => {
      const current = prev.find((t) => t.id === targetTabId);
      if (current && current.url === resolved) return prev;
      return prev.map((t) => {
        if (t.id !== targetTabId) return t;
        const nextHist = [...t.history.slice(0, t.historyIndex + 1), resolved];
        return {
          ...t,
          url: resolved,
          title: formatDisplayTitle(resolved),
          history: nextHist,
          historyIndex: nextHist.length - 1,
        };
      });
    });
    setShowOverview(false);
    setIsEditingAddress(false);
  }, [initialUrl]);

  // Auto-select address bar text on edit open
  useEffect(() => {
    if (!isEditingAddress) return;
    const raf = window.requestAnimationFrame(() => {
      addressInputRef.current?.focus();
      addressInputRef.current?.select();
    });
    return () => window.cancelAnimationFrame(raf);
  }, [isEditingAddress]);

  const blockedInfo = useMemo(
    () => parseBlockedUrl(activeTab.url),
    [activeTab.url],
  );
  const canEmbedCurrent = useMemo(
    () => isSafeEmbeddableUrl(activeTab.url),
    [activeTab.url],
  );

  // Track iframe loading state with a safe timeout fallback for cross-origin embeds
  useEffect(() => {
    if (!canEmbedCurrent) {
      setIsIframeLoading(false);
      return;
    }
    setIsIframeLoading(true);
    const fallback = window.setTimeout(() => setIsIframeLoading(false), 2600);
    return () => window.clearTimeout(fallback);
  }, [activeTab.url, reloadKey, canEmbedCurrent]);

  const displayUrl = useMemo(
    () => formatDisplayUrl(activeTab.url),
    [activeTab.url],
  );

  const externalUrl = useMemo(
    () => formatExternalUrl(activeTab.url),
    [activeTab.url],
  );

  const quickSwitcherItems = useMemo<QuickSwitcherItem[]>(() => {
    const q = addressInput.trim().toLowerCase();
    const portfolio: QuickSwitcherItem[] = SAFARI_PORTFOLIO_BOOKMARKS.filter(
      (b) =>
        !q ||
        b.label.toLowerCase().includes(q) ||
        b.pathHint.toLowerCase().includes(q) ||
        b.keywords.some((kw) => kw.includes(q)),
    ).map((b) => ({
      key: b.id,
      kind: 'portfolio',
      label: b.label,
      meta: `ghufronainun.tech${b.pathHint}`,
      url: b.url,
      icon: b.icon,
    }));

    const tracks: QuickSwitcherItem[] = SAFARI_TRACK_BOOKMARKS.filter(
      (t) =>
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        t.label.toLowerCase().includes(q),
    )
      .slice(0, q ? 6 : 3)
      .map((t) => ({
        key: t.id,
        kind: 'track',
        label: t.title,
        meta: `${t.artist} · YouTube`,
        url: t.url,
      }));

    const externals: QuickSwitcherItem[] = SAFARI_EXTERNAL_LINKS.filter(
      (e) =>
        !q ||
        e.label.toLowerCase().includes(q) ||
        e.hostHint.toLowerCase().includes(q),
    ).map((e) => ({
      key: e.id,
      kind: 'external',
      label: e.label,
      meta: e.hostHint,
      url: e.url,
    }));

    return [...portfolio, ...tracks, ...externals];
  }, [addressInput]);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [addressInput, isEditingAddress]);

  const canGoBack = activeTab.historyIndex > 0;
  const canGoForward = activeTab.historyIndex < activeTab.history.length - 1;
  const canAddTab = tabs.length < MAX_SAFARI_TABS;
  const canReload = canEmbedCurrent;

  const navigateTo = (rawInput: string) => {
    const target = resolveSafariInput(rawInput);

    // Anti-duplicate: if another tab already holds this exact curated destination, focus it
    if (target !== 'safari:start' && !target.startsWith('safari:blocked?')) {
      const existingTab = tabs.find(
        (t) => t.id !== activeTabId && t.url === target,
      );
      if (existingTab) {
        const currentIsEmptyStart =
          activeTab.url === 'safari:start' &&
          activeTab.history.length === 1 &&
          tabs.length > 1;
        if (currentIsEmptyStart) {
          setTabs((prev) => prev.filter((t) => t.id !== activeTabId));
        }
        setActiveTabId(existingTab.id);
        setShowOverview(false);
        setIsEditingAddress(false);
        return;
      }
    }

    setTabs((prev) =>
      prev.map((t) => {
        if (t.id !== activeTabId) return t;
        if (t.url === target) return t;
        const nextHistory = [...t.history.slice(0, t.historyIndex + 1), target];
        return {
          ...t,
          url: target,
          title: formatDisplayTitle(target),
          history: nextHistory,
          historyIndex: nextHistory.length - 1,
        };
      }),
    );
    setShowOverview(false);
    setIsEditingAddress(false);
  };

  const handleSelectQuickItem = (item: QuickSwitcherItem) => {
    setIsEditingAddress(false);
    if (item.kind === 'external') {
      window.open(item.url, '_blank', 'noopener,noreferrer');
      return;
    }
    navigateTo(item.url);
  };

  const handleBack = () => {
    if (!canGoBack) return;
    setTabs((prev) =>
      prev.map((t) => {
        if (t.id !== activeTabId) return t;
        const nextIdx = t.historyIndex - 1;
        const prevUrl = t.history[nextIdx];
        return {
          ...t,
          url: prevUrl,
          title: formatDisplayTitle(prevUrl),
          historyIndex: nextIdx,
        };
      }),
    );
  };

  const handleForward = () => {
    if (!canGoForward) return;
    setTabs((prev) =>
      prev.map((t) => {
        if (t.id !== activeTabId) return t;
        const nextIdx = t.historyIndex + 1;
        const nextUrl = t.history[nextIdx];
        return {
          ...t,
          url: nextUrl,
          title: formatDisplayTitle(nextUrl),
          historyIndex: nextIdx,
        };
      }),
    );
  };

  const handleReload = () => {
    if (!canReload) return;
    setIsReloading(true);
    setIsIframeLoading(true);
    setReloadKey((k) => k + 1);
    window.setTimeout(() => setIsReloading(false), 450);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      void navigator.clipboard.writeText(externalUrl);
    }
    setCopiedShare(true);
    window.setTimeout(() => setCopiedShare(false), 1600);
    pushNotification({
      appId: 'safari',
      appName: 'Safari',
      appIcon: '/macos-icons/safari.png',
      title: 'Link Copied',
      body: externalUrl,
      durationMs: 3200,
    });
  };

  const handleNewTab = (newUrl: string = 'safari:start') => {
    const resolved = resolveSafariInput(newUrl);

    // Anti-duplicate for non-start destinations
    if (resolved !== 'safari:start') {
      const existing = tabs.find((t) => t.url === resolved);
      if (existing) {
        setActiveTabId(existing.id);
        setShowOverview(false);
        setIsEditingAddress(false);
        return;
      }
    }

    if (tabs.length >= MAX_SAFARI_TABS) {
      pushNotification({
        appId: 'safari',
        appName: 'Safari',
        appIcon: '/macos-icons/safari.png',
        title: `Tab Limit (${MAX_SAFARI_TABS})`,
        body: 'Close an existing tab before opening a new one.',
        durationMs: 2600,
      });
      return;
    }

    const id = `tab-${tabSeqRef.current++}`;
    setTabs((prev) => [
      ...prev,
      {
        id,
        title: formatDisplayTitle(resolved),
        url: resolved,
        history: [resolved],
        historyIndex: 0,
      },
    ]);
    setActiveTabId(id);
    setShowOverview(false);
    setIsEditingAddress(false);
  };

  const handleCloseTab = (tabId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (tabs.length <= 1) {
      const freshId = `tab-${tabSeqRef.current++}`;
      setTabs([
        {
          id: freshId,
          title: 'Start Page',
          url: 'safari:start',
          history: ['safari:start'],
          historyIndex: 0,
        },
      ]);
      setActiveTabId(freshId);
      setIsEditingAddress(false);
      return;
    }
    const remaining = tabs.filter((t) => t.id !== tabId);
    if (activeTabId === tabId) {
      const idx = tabs.findIndex((t) => t.id === tabId);
      const nextActive =
        remaining[Math.max(0, idx - 1)]?.id ?? remaining[0].id;
      setActiveTabId(nextActive);
    }
    setTabs(remaining);
  };

  return (
    <div className="flex h-full flex-col bg-[#f2f2f7] dark:bg-[#282025]">
      {/* Safari Main Toolbar */}
      <Toolbar
        hasControls
        className="z-30"
        leading={
          <>
            {/* Sidebar Toggle Button */}
            <ToolbarGroup>
              <ToolbarButton
                title={sidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
                isActive={sidebarOpen}
                onClick={() => setSidebarOpen((s) => !s)}
                icon={
                  <span className="flex items-center gap-0.5 px-0.5">
                    <PanelLeft size={15} />
                    <ChevronDown
                      size={11}
                      className={cn(
                        'transition-transform duration-150 ease-smooth-out motion-reduce:transition-none',
                        sidebarOpen && 'rotate-180',
                      )}
                    />
                  </span>
                }
              />
            </ToolbarGroup>

            {/* Back & Forward History Navigation */}
            <ToolbarGroup>
              <ToolbarButton
                title={canGoBack ? 'Go Back' : 'Back'}
                disabled={!canGoBack}
                onClick={handleBack}
                icon={<ChevronLeft size={16} />}
              />
              <span className="h-4 w-[0.5px] bg-black/15 dark:bg-white/15" />
              <ToolbarButton
                title={canGoForward ? 'Go Forward' : 'Forward'}
                disabled={!canGoForward}
                onClick={handleForward}
                icon={<ChevronRight size={16} />}
              />
            </ToolbarGroup>
          </>
        }
        center={
          /* Curated Combobox Address Bar + Quick Switcher */
          <div className="relative w-full max-w-[440px]">
            <ToolbarGroup
              className={cn(
                'w-full justify-between px-3 text-[13px] transition-shadow duration-150 ease-smooth-out',
                isEditingAddress &&
                  'ring-2 ring-[#0a84ff]/70 dark:ring-[#0a84ff]/80',
              )}
            >
              {blockedInfo ? (
                <ShieldAlert
                  size={12}
                  className="shrink-0 text-amber-500/90"
                  aria-hidden="true"
                />
              ) : (
                <Lock
                  size={12}
                  className="shrink-0 opacity-45"
                  aria-hidden="true"
                />
              )}

              {isEditingAddress ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (
                      highlightedIndex >= 0 &&
                      quickSwitcherItems[highlightedIndex]
                    ) {
                      handleSelectQuickItem(
                        quickSwitcherItems[highlightedIndex],
                      );
                      return;
                    }
                    navigateTo(addressInput);
                  }}
                  className="min-w-0 flex-1 px-2"
                >
                  <input
                    ref={addressInputRef}
                    type="text"
                    role="combobox"
                    aria-label="Search portfolio pages or enter URL"
                    aria-expanded={true}
                    aria-controls="safari-quick-switcher"
                    aria-autocomplete="list"
                    aria-activedescendant={
                      highlightedIndex >= 0 &&
                      quickSwitcherItems[highlightedIndex]
                        ? `safari-qs-${quickSwitcherItems[highlightedIndex].key}`
                        : undefined
                    }
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    onBlur={() => setIsEditingAddress(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        e.preventDefault();
                        setIsEditingAddress(false);
                      } else if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        if (!quickSwitcherItems.length) return;
                        setHighlightedIndex((prev) =>
                          prev < quickSwitcherItems.length - 1 ? prev + 1 : 0,
                        );
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        if (!quickSwitcherItems.length) return;
                        setHighlightedIndex((prev) =>
                          prev > 0 ? prev - 1 : quickSwitcherItems.length - 1,
                        );
                      }
                    }}
                    placeholder="Jump to portfolio page or embed..."
                    className="w-full bg-transparent text-left text-[12.5px] text-black outline-none placeholder:text-black/40 dark:text-white dark:placeholder:text-white/40"
                  />
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setAddressInput(
                      activeTab.url === 'safari:start' ? '' : displayUrl,
                    );
                    setIsEditingAddress(true);
                  }}
                  title="Search portfolio pages or enter URL"
                  aria-label={`Current address: ${displayUrl}. Click to search or navigate`}
                  className="min-w-0 flex-1 truncate px-2 text-center text-black/85 transition-opacity duration-150 hover:opacity-75 focus-visible:outline-none dark:text-white/90"
                >
                  {displayUrl}
                </button>
              )}

              <button
                type="button"
                onClick={handleReload}
                disabled={!canReload}
                title={canReload ? 'Reload page' : 'Nothing to reload'}
                aria-label="Reload page"
                className="shrink-0 rounded-full p-0.5 opacity-55 transition-[opacity,transform] duration-150 ease-smooth-out enabled:hover:opacity-100 enabled:active:scale-[0.92] disabled:opacity-25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff]"
              >
                <RotateCw
                  size={12}
                  className={isReloading ? 'animate-spin' : ''}
                />
              </button>
            </ToolbarGroup>

            {/* Quick Switcher Popover (anchored top-center, 0ms keyboard selection) */}
            {isEditingAddress && (
              <div
                id="safari-quick-switcher"
                role="listbox"
                aria-label="Curated destinations"
                onMouseDown={(e) => e.preventDefault()}
                className="absolute inset-x-0 top-[calc(100%+6px)] z-50 origin-top overflow-hidden rounded-2xl border border-black/10 bg-white/95 p-1.5 shadow-[0_14px_36px_rgba(0,0,0,0.22)] backdrop-blur-2xl animate-in fade-in-0 zoom-in-95 duration-150 ease-smooth-out motion-reduce:animate-none dark:border-white/[0.12] dark:bg-[#221b20]/95 dark:shadow-[0_18px_42px_rgba(0,0,0,0.55)]"
              >
                <div className="flex items-center justify-between px-2.5 pb-1 pt-0.5 text-[10px] font-semibold uppercase tracking-wider text-black/40 dark:text-white/35">
                  <span>Quick Switcher</span>
                  <span className="font-mono normal-case tracking-normal opacity-80">
                    ↑↓ · Enter · Esc
                  </span>
                </div>

                {quickSwitcherItems.length > 0 ? (
                  <div className="max-h-60 overflow-y-auto">
                    {quickSwitcherItems.map((item, idx) => {
                      const isHighlighted = idx === highlightedIndex;
                      const isCurrent =
                        item.kind !== 'external' && activeTab.url === item.url;
                      return (
                        <button
                          key={item.key}
                          id={`safari-qs-${item.key}`}
                          role="option"
                          aria-selected={isHighlighted}
                          type="button"
                          onMouseEnter={() => setHighlightedIndex(idx)}
                          onClick={() => handleSelectQuickItem(item)}
                          className={cn(
                            'flex w-full items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-left text-[12.5px] focus-visible:outline-none',
                            isHighlighted
                              ? 'bg-[#0a84ff] text-white'
                              : 'text-black/85 dark:text-white/85',
                          )}
                        >
                          <span
                            className={cn(
                              'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg',
                              isHighlighted
                                ? 'bg-white/20 text-white'
                                : 'bg-black/[0.05] dark:bg-white/[0.08]',
                            )}
                          >
                            {item.kind === 'portfolio' ? (
                              isHighlighted ? (
                                <Globe size={13} />
                              ) : (
                                renderPortfolioBookmarkIcon(item.icon, 13)
                              )
                            ) : item.kind === 'track' ? (
                              <Music
                                size={13}
                                className={
                                  isHighlighted ? 'text-white' : 'text-[#ff2d55]'
                                }
                              />
                            ) : (
                              <ExternalLink size={12} />
                            )}
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-medium leading-tight">
                              {item.label}
                            </span>
                            <span
                              className={cn(
                                'block truncate font-mono text-[10.5px] leading-tight',
                                isHighlighted
                                  ? 'text-white/75'
                                  : 'text-black/45 dark:text-white/40',
                              )}
                            >
                              {item.meta}
                            </span>
                          </span>

                          {item.kind === 'external' ? (
                            <ArrowUpRight
                              size={13}
                              className={
                                isHighlighted
                                  ? 'shrink-0 text-white/90'
                                  : 'shrink-0 text-black/40 dark:text-white/40'
                              }
                            />
                          ) : isCurrent ? (
                            <span
                              className={cn(
                                'shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium',
                                isHighlighted
                                  ? 'bg-white/20 text-white'
                                  : 'bg-black/[0.06] text-black/55 dark:bg-white/10 dark:text-white/60',
                              )}
                            >
                              Open
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="px-2.5 py-3 text-center text-[12px] text-black/55 dark:text-white/50">
                    Press{' '}
                    <kbd className="rounded bg-black/10 px-1.5 py-0.5 font-mono text-[10.5px] dark:bg-white/10">
                      Enter
                    </kbd>{' '}
                    to open in a new browser tab
                  </div>
                )}
              </div>
            )}
          </div>
        }
        trailing={
          <ToolbarGroup>
            {/* Share / Copy URL Button with confirmation state */}
            <ToolbarButton
              title={copiedShare ? 'Link copied' : 'Copy link to clipboard'}
              onClick={handleShare}
              icon={
                copiedShare ? (
                  <Check size={14} className="text-emerald-500" />
                ) : (
                  <Share size={14} />
                )
              }
            />
            {/* New Tab Button (capped at MAX_SAFARI_TABS) */}
            <ToolbarButton
              title={
                canAddTab
                  ? `New Tab (${tabs.length}/${MAX_SAFARI_TABS})`
                  : `Maximum ${MAX_SAFARI_TABS} tabs open`
              }
              disabled={!canAddTab}
              onClick={() => handleNewTab()}
              icon={<Plus size={15} />}
            />
            {/* Tab Overview Toggle Button */}
            <ToolbarButton
              title="Show Tab Overview"
              isActive={showOverview}
              onClick={() => setShowOverview((v) => !v)}
              className="max-sm:hidden"
              icon={<Copy size={13} />}
            />
          </ToolbarGroup>
        }
      />

      {/* Safari Tab Strip (when 2+ tabs are open) */}
      {tabs.length > 1 && (
        <div className="flex h-[32px] shrink-0 select-none items-center gap-1 border-b border-black/10 bg-[#e4e2e6] px-2.5 text-[12px] dark:border-white/10 dark:bg-[#1f1b20]">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              role="button"
              tabIndex={0}
              onClick={() => {
                setActiveTabId(tab.id);
                setShowOverview(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveTabId(tab.id);
                  setShowOverview(false);
                }
              }}
              className={cn(
                'group flex h-[25px] min-w-0 max-w-[210px] flex-1 cursor-default items-center justify-between rounded-[7px] px-2.5 transition-[background-color,color,box-shadow] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff]',
                tab.id === activeTabId
                  ? 'bg-white font-medium text-black shadow-[0_1px_3px_rgba(0,0,0,0.12)] dark:bg-[#2f272d] dark:text-white'
                  : 'text-black/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/5',
              )}
            >
              <span className="min-w-0 truncate">{tab.title}</span>
              <button
                type="button"
                aria-label={`Close ${tab.title} tab`}
                onClick={(e) => handleCloseTab(tab.id, e)}
                title="Close Tab"
                className="ml-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full opacity-0 transition-opacity hover:bg-black/10 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0a84ff] group-hover:opacity-100 [@media(hover:none)]:opacity-80 dark:hover:bg-white/15"
              >
                <X size={10} />
              </button>
            </div>
          ))}
          <button
            type="button"
            disabled={!canAddTab}
            aria-label={
              canAddTab
                ? 'New Tab'
                : `Maximum ${MAX_SAFARI_TABS} tabs open`
            }
            onClick={() => handleNewTab()}
            title={
              canAddTab
                ? 'New Tab'
                : `Maximum ${MAX_SAFARI_TABS} tabs open`
            }
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-black/60 transition-[background-color,color,transform] duration-150 ease-smooth-out enabled:hover:bg-black/10 enabled:hover:text-black enabled:active:scale-[0.94] disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] dark:text-white/60 dark:enabled:hover:bg-white/15 dark:enabled:hover:text-white"
          >
            <Plus size={13} />
          </button>
        </div>
      )}

      {/* Main Safari Body: Loading Hairline + Sidebar + Web Content */}
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {/* Subtle top loading progress hairline */}
        {isIframeLoading && !showOverview && canEmbedCurrent && (
          <div
            role="status"
            aria-label="Loading page"
            className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[2px] overflow-hidden bg-black/5 dark:bg-white/5"
          >
            <div className="h-full w-1/2 animate-pulse bg-[#0a84ff] motion-reduce:animate-none" />
          </div>
        )}

        {/* Slide-out Bookmarks Sidebar */}
        {sidebarOpen && (
          <aside className="w-56 shrink-0 select-none overflow-y-auto border-r border-black/10 bg-white/75 p-3 backdrop-blur-xl dark:border-white/10 dark:bg-[#20191f]/80">
            <div className="flex items-center justify-between pb-2 text-[11px] font-bold uppercase tracking-wider text-black/45 dark:text-white/40">
              <span className="flex items-center gap-1.5">
                <Bookmark size={12} />
                <span>Bookmarks</span>
              </span>
              <button
                type="button"
                aria-label="Close Sidebar"
                onClick={() => setSidebarOpen(false)}
                title="Close Sidebar"
                className="rounded p-0.5 text-black/40 transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] dark:text-white/40 dark:hover:text-white"
              >
                <X size={12} />
              </button>
            </div>

            <div className="space-y-4 pt-1">
              {/* Primary: Portfolio */}
              <div>
                <div className="px-1 text-[11px] font-semibold text-black/40 dark:text-white/35">
                  Portfolio
                </div>
                <div className="mt-1 space-y-0.5">
                  {SAFARI_PORTFOLIO_BOOKMARKS.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => navigateTo(b.url)}
                      className={cn(
                        'flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[12.5px] transition-[background-color,color,transform] duration-150 ease-smooth-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff]',
                        activeTab.url === b.url
                          ? 'bg-[#0a84ff] font-medium text-white'
                          : 'text-black/80 hover:bg-black/5 dark:text-white/85 dark:hover:bg-white/5',
                      )}
                    >
                      <span className="shrink-0">
                        {activeTab.url === b.url ? (
                          <Globe size={13} className="text-white" />
                        ) : (
                          renderPortfolioBookmarkIcon(b.icon, 13)
                        )}
                      </span>
                      <span className="truncate">{b.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Secondary: On Rotation */}
              <div>
                <div className="px-1 text-[11px] font-semibold text-black/40 dark:text-white/35">
                  On Rotation
                </div>
                <div className="mt-1 space-y-0.5">
                  {SAFARI_TRACK_BOOKMARKS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => navigateTo(t.url)}
                      className={cn(
                        'flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[12px] transition-[background-color,color,transform] duration-150 ease-smooth-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff]',
                        activeTab.url === t.url
                          ? 'bg-[#0a84ff] font-medium text-white'
                          : 'text-black/80 hover:bg-black/5 dark:text-white/85 dark:hover:bg-white/5',
                      )}
                    >
                      <Music
                        size={13}
                        className={cn(
                          'shrink-0',
                          activeTab.url === t.url
                            ? 'text-white'
                            : 'text-[#ff2d55] opacity-80',
                        )}
                      />
                      <span className="truncate">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* External Links */}
              <div>
                <div className="px-1 text-[11px] font-semibold text-black/40 dark:text-white/35">
                  External
                </div>
                <div className="mt-1 space-y-0.5">
                  {SAFARI_EXTERNAL_LINKS.map((ext) => (
                    <a
                      key={ext.id}
                      href={ext.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-[12px] text-black/75 transition-[background-color,color,transform] duration-150 ease-smooth-out hover:bg-black/5 hover:text-black active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] dark:text-white/75 dark:hover:bg-white/5 dark:hover:text-white"
                    >
                      <span className="truncate">{ext.label}</span>
                      <ArrowUpRight size={12} className="shrink-0 opacity-60" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Tab Overview Overlay */}
        {showOverview ? (
          <div className="flex-1 overflow-y-auto bg-black/[0.04] p-6 dark:bg-black/30">
            <div className="mx-auto max-w-3xl">
              <div className="flex items-center justify-between pb-4">
                <h2 className="text-[16px] font-bold tabular-nums text-black dark:text-white">
                  Open Tabs ({tabs.length} / {MAX_SAFARI_TABS})
                </h2>
                <button
                  type="button"
                  disabled={!canAddTab}
                  onClick={() => handleNewTab()}
                  className="flex items-center gap-1.5 rounded-full bg-[#0a84ff] px-3 py-1 text-[12px] font-medium text-white shadow-sm transition-[opacity,transform] duration-150 ease-smooth-out enabled:hover:opacity-90 enabled:active:scale-[0.97] disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] focus-visible:ring-offset-2"
                >
                  <Plus size={13} />
                  <span>New Tab</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {tabs.map((tab) => (
                  <div
                    key={tab.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setActiveTabId(tab.id);
                      setShowOverview(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveTabId(tab.id);
                        setShowOverview(false);
                      }
                    }}
                    className={cn(
                      'group relative flex aspect-[4/3] min-w-0 flex-col justify-between overflow-hidden rounded-xl border p-3 text-left transition-[transform,border-color,background-color] duration-150 ease-smooth-out [@media(hover:hover)_and_(pointer:fine)]:hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff]',
                      tab.id === activeTabId
                        ? 'border-[#0a84ff] bg-white ring-2 ring-[#0a84ff]/30 dark:bg-[#282025]'
                        : 'border-black/10 bg-white/60 dark:border-white/10 dark:bg-[#1a1518]/60',
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="min-w-0 truncate text-[12px] font-bold text-black dark:text-white">
                        {tab.title}
                      </span>
                      <button
                        type="button"
                        aria-label={`Close ${tab.title} tab`}
                        onClick={(e) => handleCloseTab(tab.id, e)}
                        title="Close Tab"
                        className="shrink-0 rounded-full p-1 opacity-0 transition-opacity hover:bg-black/10 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0a84ff] group-hover:opacity-100 [@media(hover:none)]:opacity-80 dark:hover:bg-white/15"
                      >
                        <X size={12} />
                      </button>
                    </div>

                    <div className="truncate font-mono text-[10px] text-black/45 dark:text-white/40">
                      {formatDisplayUrl(tab.url)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : activeTab.url === 'safari:start' ? (
          /* Curated Start Page — Primary Portfolio first, Secondary On Rotation below */
          <div className="flex-1 select-none overflow-y-auto bg-white px-6 py-7 dark:bg-[#181317] sm:px-8">
            <div className="mx-auto max-w-2xl space-y-7">
              {/* Compact Header */}
              <div className="flex items-center justify-between gap-4 border-b border-black/[0.06] pb-4 dark:border-white/[0.07]">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0a84ff] to-[#5ac8fa] text-white shadow-sm">
                    <Compass size={20} />
                  </div>
                  <div className="min-w-0">
                    <h1 className="truncate text-[18px] font-bold tracking-tight text-black dark:text-white">
                      Start Page
                    </h1>
                    <p className="truncate text-[12px] text-black/50 dark:text-white/45">
                      Curated portfolio routes &amp; verified media embeds
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAddressInput('');
                    setIsEditingAddress(true);
                  }}
                  className="hidden shrink-0 items-center gap-1.5 rounded-full border border-black/10 bg-black/[0.03] px-3 py-1.5 text-[11.5px] font-medium text-black/65 transition-[background-color,transform] duration-150 ease-smooth-out hover:bg-black/[0.06] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] dark:border-white/10 dark:bg-white/[0.04] dark:text-white/70 dark:hover:bg-white/[0.08] sm:inline-flex"
                >
                  <Search size={12} />
                  <span>Quick Jump</span>
                </button>
              </div>

              {/* Section 1: Portfolio (Primary) */}
              <section aria-labelledby="safari-section-portfolio">
                <div className="mb-3 flex items-center justify-between">
                  <h2
                    id="safari-section-portfolio"
                    className="text-[11px] font-semibold uppercase tracking-[0.08em] text-black/45 dark:text-white/45"
                  >
                    Portfolio
                  </h2>
                  <span className="font-mono text-[10.5px] text-black/35 dark:text-white/30">
                    ghufronainun.tech
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {SAFARI_PORTFOLIO_BOOKMARKS.map((bookmark) => (
                    <button
                      key={bookmark.id}
                      type="button"
                      onClick={() => navigateTo(bookmark.url)}
                      className="group flex min-w-0 flex-col items-start gap-2.5 rounded-2xl border border-black/[0.07] bg-black/[0.02] p-3.5 text-left transition-[transform,background-color,border-color,box-shadow] duration-150 ease-smooth-out [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-0.5 [@media(hover:hover)_and_(pointer:fine)]:hover:border-black/15 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-black/[0.045] [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-sm active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] dark:border-white/[0.08] dark:bg-white/[0.03] dark:[@media(hover:hover)_and_(pointer:fine)]:hover:border-white/15 dark:[@media(hover:hover)_and_(pointer:fine)]:hover:bg-white/[0.07]"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/5 transition-transform duration-150 ease-smooth-out [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-105 dark:bg-[#2a2128] dark:ring-white/10">
                        {renderPortfolioBookmarkIcon(bookmark.icon, 18)}
                      </span>
                      <div className="min-w-0 w-full">
                        <span className="block truncate text-[13px] font-semibold text-black dark:text-white">
                          {bookmark.label}
                        </span>
                        <span className="mt-0.5 block truncate font-mono text-[10.5px] text-black/45 dark:text-white/40">
                          {bookmark.pathHint}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Section 2: On Rotation (Secondary & Compact) */}
              <section aria-labelledby="safari-section-tracks">
                <div className="mb-3 flex items-center justify-between">
                  <h2
                    id="safari-section-tracks"
                    className="text-[11px] font-semibold uppercase tracking-[0.08em] text-black/45 dark:text-white/45"
                  >
                    On Rotation
                  </h2>
                  <span className="text-[11px] text-black/35 dark:text-white/30">
                    YouTube Embeds
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {SAFARI_TRACK_BOOKMARKS.map((track) => (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => navigateTo(track.url)}
                      className="group flex min-w-0 items-center gap-3 rounded-xl border border-black/[0.06] bg-black/[0.015] p-2 text-left transition-[transform,background-color,border-color] duration-150 ease-smooth-out [@media(hover:hover)_and_(pointer:fine)]:hover:border-black/[0.12] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-black/[0.045] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] dark:border-white/[0.06] dark:bg-white/[0.025] dark:[@media(hover:hover)_and_(pointer:fine)]:hover:border-white/[0.14] dark:[@media(hover:hover)_and_(pointer:fine)]:hover:bg-white/[0.06]"
                    >
                      <span
                        className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg ring-1 ring-black/10 dark:ring-white/10"
                        style={{ background: track.coverBg }}
                      >
                        <img
                          src={track.coverImage}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="block truncate text-[12.5px] font-semibold leading-tight text-black dark:text-white">
                          {track.title}
                        </span>
                        <span className="mt-0.5 block truncate text-[11px] leading-tight text-black/50 dark:text-white/45">
                          {track.artist}
                        </span>
                      </div>
                      {track.duration && (
                        <span className="shrink-0 pr-1 font-mono text-[10.5px] tabular-nums text-black/35 dark:text-white/35">
                          {track.duration}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </section>

              {/* Section 3: External Profiles (opens in real browser tab) */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.06] pt-4 dark:border-white/[0.07]">
                <div className="flex flex-wrap items-center gap-2">
                  {SAFARI_EXTERNAL_LINKS.map((ext) => (
                    <a
                      key={ext.id}
                      href={ext.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-black/[0.02] px-3 py-1 text-[11.5px] font-medium text-black/75 transition-[background-color,color,transform] duration-150 ease-smooth-out hover:bg-black/[0.06] hover:text-black active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] dark:border-white/10 dark:bg-white/[0.04] dark:text-white/75 dark:hover:bg-white/[0.09] dark:hover:text-white"
                    >
                      <span>{ext.label}</span>
                      <ArrowUpRight size={12} className="opacity-65" />
                    </a>
                  ))}
                </div>
                <span className="text-[11px] text-black/35 dark:text-white/30">
                  External links open in a new browser tab
                </span>
              </div>
            </div>
          </div>
        ) : blockedInfo || !canEmbedCurrent ? (
          /* Curated Sandbox Blocked View (replaces white refused-to-connect iframe errors) */
          <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto bg-white px-6 py-10 text-center dark:bg-[#181317]">
            <div className="mx-auto flex max-w-md flex-col items-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-black/10 bg-black/[0.03] text-black/60 dark:border-white/10 dark:bg-white/[0.05] dark:text-white/70">
                <ShieldAlert size={22} />
              </div>

              <h2 className="text-[17px] font-semibold tracking-tight text-black dark:text-white">
                {blockedInfo?.kind === 'url'
                  ? `${blockedInfo.hostname} can’t open inside embedded Safari`
                  : blockedInfo?.kind === 'query'
                    ? `No portfolio page matches “${blockedInfo.query}”`
                    : 'This address isn’t available in sandbox mode'}
              </h2>

              <p className="mt-2 text-[13px] leading-relaxed text-black/55 dark:text-white/50">
                {blockedInfo?.kind === 'url'
                  ? 'Most external websites block embedded frames. Open it directly in your browser tab or return to curated portfolio pages.'
                  : 'This preview browser only embeds Ghufron’s portfolio routes and curated media. You can run this search in a real browser tab instead.'}
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
                <a
                  href={externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#0a84ff] px-4 py-2 text-[12.5px] font-medium text-white shadow-sm transition-[opacity,transform] duration-150 ease-smooth-out hover:opacity-90 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#181317]"
                >
                  <span>
                    {blockedInfo?.kind === 'query'
                      ? 'Search on Google'
                      : 'Open in New Tab'}
                  </span>
                  <ArrowUpRight size={14} />
                </a>
                <button
                  type="button"
                  onClick={() => navigateTo('safari:start')}
                  className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.12] bg-black/[0.03] px-4 py-2 text-[12.5px] font-medium text-black/80 transition-[background-color,transform] duration-150 ease-smooth-out hover:bg-black/[0.07] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] dark:border-white/[0.12] dark:bg-white/[0.05] dark:text-white/85 dark:hover:bg-white/[0.1]"
                >
                  <span>Back to Start Page</span>
                </button>
              </div>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-1.5 border-t border-black/[0.06] pt-4 dark:border-white/[0.07]">
                {SAFARI_PORTFOLIO_BOOKMARKS.slice(0, 4).map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => navigateTo(b.url)}
                    className="rounded-full px-2.5 py-1 text-[11.5px] font-medium text-black/55 transition-[background-color,color,transform] duration-150 ease-smooth-out hover:bg-black/[0.05] hover:text-black active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] dark:text-white/50 dark:hover:bg-white/[0.08] dark:hover:text-white"
                  >
                    {b.shortLabel}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Sandboxed Live Iframe View (only for verified internal routes & YouTube embeds) */
          <iframe
            key={reloadKey + activeTab.url}
            src={activeTab.url}
            title={`Safari — ${displayUrl}`}
            onLoad={() => setIsIframeLoading(false)}
            sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-popups allow-popups-to-escape-sandbox"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
            className="w-full flex-grow overflow-hidden rounded-b-[inherit] border-0 bg-white dark:bg-[#141210]"
          />
        )}
      </div>
    </div>
  );
};

const settingsPanes: {
  id: SettingsPaneId;
  label: string;
  color: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'appearance',
    label: 'Appearance',
    color: 'bg-[#3a3a3c]',
    icon: <Paintbrush size={13} className="text-white" />,
  },
  {
    id: 'wallpaper',
    label: 'Wallpaper',
    color: 'bg-[#30b0c7]',
    icon: <ImageIcon size={13} className="text-white" />,
  },
  {
    id: 'displays',
    label: 'Displays',
    color: 'bg-[#0a84ff]',
    icon: <Sun size={13} className="text-white" />,
  },
  {
    id: 'about',
    label: 'About',
    color: 'bg-[#8e8e93]',
    icon: <Info size={13} className="text-white" />,
  },
];

const appearanceOptions: { id: OsAppearance; label: string; preview: string }[] = [
  {
    id: 'auto',
    label: 'Auto',
    preview: 'bg-[linear-gradient(135deg,#e5e5e5_50%,#2c2c2e_50%)]',
  },
  {
    id: 'light',
    label: 'Light',
    preview: 'bg-gradient-to-br from-[#f5f5f7] to-[#d1d1d6]',
  },
  {
    id: 'dark',
    label: 'Dark',
    preview: 'bg-gradient-to-br from-[#48484a] to-[#1c1c1e]',
  },
];

const fontOptions: { id: SystemFontId; label: string; specimenClass: string }[] = [
  { id: 'jakarta', label: 'Plus Jakarta', specimenClass: 'font-specimen-jakarta' },
  { id: 'inter', label: 'Inter', specimenClass: 'font-specimen-inter' },
  { id: 'geist', label: 'Geist', specimenClass: 'font-specimen-geist' },
];

export const SystemSettingsApp: React.FC = () => {
  const {
    appearance,
    setAppearance,
    systemFont,
    setSystemFont,
    wallpaperId,
    setWallpaperId,
    autoRotateWallpaper,
    setAutoRotateWallpaper,
    wallpaperMotion,
    setWallpaperMotion,
    brightness,
    setBrightness,
    settingsPane,
    setSettingsPane,
  } = useOsNote();

  const { soundEnabled: soundActive, setSoundEnabled } = useOsNotification();

  const currentPane =
    settingsPanes.find((p) => p.id === settingsPane) ?? settingsPanes[3];
  const currentWallpaper =
    WALLPAPERS.find((w) => w.id === wallpaperId) ?? WALLPAPERS[0];

  useEffect(() => {
    if (currentPane.id !== 'appearance') return;
    ensureFontGroup('inter');
    ensureFontGroup('geist');
  }, [currentPane.id]);

  return (
    <div className="flex h-full">
      <Sidebar
        selectedId={currentPane.id}
        onSelect={(id) => {
          if (id !== currentPane.id) playSoftSelectSound();
          setSettingsPane(id as SettingsPaneId);
        }}
        header={
          <button
            type="button"
            onClick={() => {
              if (currentPane.id !== 'about') playSoftSelectSound();
              setSettingsPane('about');
            }}
            className="mx-2.5 mb-3 flex cursor-default items-center gap-2.5 rounded-lg px-2 py-1.5 text-left hover:bg-black/5 dark:hover:bg-white/5"
          >
            <Avatar className="h-9 w-9 text-[13px]" />
            <div className="min-w-0">
              <div className="truncate text-[13px] font-semibold">
                {profile.name}
              </div>
              <div className="truncate text-[11px] text-black/50 dark:text-white/50">
                Full-Stack Developer
              </div>
            </div>
          </button>
        }
        sections={[
          {
            items: settingsPanes.map(({ id, label, color, icon }) => ({
              id,
              label,
              icon: (
                <span
                  className={cn(
                    'flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[6px] shadow-sm',
                    color,
                  )}
                >
                  {icon}
                </span>
              ),
            })),
          },
        ]}
      />
      <section className="flex min-w-0 flex-grow flex-col bg-[#f2f2f7] dark:bg-[#282025]">
        <Toolbar className="max-sm:pl-[92px]" title={currentPane.label} />
        <div className="flex-grow overflow-y-auto px-6 pb-8">
          <div className="mx-auto max-w-2xl space-y-4">
          {currentPane.id === 'appearance' && (
            <>
              <SettingsGroup>
                <SettingsRow label="Appearance">
                  <div className="flex gap-4 py-1">
                    {appearanceOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => {
                          if (appearance !== option.id) playSoftSelectSound();
                          setAppearance(option.id);
                        }}
                        className="flex cursor-default flex-col items-center gap-1.5"
                      >
                        <div
                          className={cn(
                            'h-[44px] w-[68px] rounded-lg ring-1 ring-black/10',
                            option.preview,
                            appearance === option.id && 'ring-[3px] ring-[#0a84ff]',
                          )}
                        />
                        <span
                          className={cn(
                            'text-[11px]',
                            appearance === option.id
                              ? 'font-semibold'
                              : 'text-black/60 dark:text-white/60',
                          )}
                        >
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </SettingsRow>
                <SettingsRow label="Auto-rotate wallpaper (2 min)">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={autoRotateWallpaper}
                    onClick={() => {
                      const next = !autoRotateWallpaper;
                      setAutoRotateWallpaper(next);
                      playToggleSound(next);
                    }}
                    className={cn(
                    'relative h-6 w-11 rounded-full transition-colors',
                      autoRotateWallpaper
                        ? 'bg-[#0a84ff]'
                        : 'bg-black/15 dark:bg-white/20',
                    )}
                  >
                    <span
                      className={cn(
                        'block h-5 w-5 rounded-full bg-white shadow transition-transform',
                        autoRotateWallpaper ? 'translate-x-5' : 'translate-x-0.5',
                      )}
                    />
                  </button>
                </SettingsRow>
                <SettingsRow label="System font">
                  <div className="flex flex-wrap justify-end gap-1.5 py-1">
                    {fontOptions.map((font) => (
                      <button
                        key={font.id}
                        type="button"
                        onClick={() => {
                          if (systemFont !== font.id) playSoftSelectSound();
                          setSystemFont(font.id);
                        }}
                        className={cn(
                          'rounded-lg px-2.5 py-1 text-[12px] transition-[background-color,color,transform] duration-150 ease-smooth-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] active:scale-[0.96]',
                          font.specimenClass,
                          systemFont === font.id
                            ? 'bg-[#0a84ff] font-semibold text-white shadow-sm'
                            : 'bg-black/[0.06] text-black/75 hover:bg-black/10 dark:bg-white/10 dark:text-white/80 dark:hover:bg-white/15',
                        )}
                      >
                        {font.label}
                      </button>
                    ))}
                  </div>
                </SettingsRow>
                <SettingsRow label="Play UI sound effects (Web Audio)">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={soundActive}
                    onClick={() => {
                      const next = !soundActive;
                      setSoundEnabled(next);
                      if (next) playToggleSound(true);
                    }}
                    className={cn(
                      'relative h-6 w-11 rounded-full transition-colors active:scale-[0.96]',
                      soundActive
                        ? 'bg-[#0a84ff]'
                        : 'bg-black/15 dark:bg-white/20',
                    )}
                  >
                    <span
                      className={cn(
                        'block h-5 w-5 rounded-full bg-white shadow transition-transform',
                        soundActive ? 'translate-x-5' : 'translate-x-0.5',
                      )}
                    />
                  </button>
                </SettingsRow>
                {soundActive && (
                  <SettingsRow label="Sound palette">
                    <div className="flex flex-wrap justify-end gap-1.5 py-1">
                      {SOUND_PREVIEW_ITEMS.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={item.play}
                          className="rounded-lg bg-black/[0.06] px-2.5 py-1 text-[11.5px] font-medium text-black/75 transition-[background-color,color,transform] duration-150 ease-smooth-out hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] active:scale-[0.95] dark:bg-white/10 dark:text-white/80 dark:hover:bg-white/15"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </SettingsRow>
                )}
              </SettingsGroup>
            </>
          )}

          {currentPane.id === 'wallpaper' && (
            <div className="space-y-4">
              <SettingsGroup>
                <div className="flex items-center gap-4 py-3">
                  <div
                    className="relative aspect-video w-36 shrink-0 overflow-hidden rounded-lg ring-1 ring-black/10 dark:ring-white/15"
                    style={{ background: currentWallpaper.preview }}
                  >
                    <img
                      src={currentWallpaper.thumbnail}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold">
                      {currentWallpaper.kind === 'image'
                        ? 'Still Wallpaper'
                        : 'Dynamic Wallpaper'}
                    </div>
                    <div className="text-[12px] text-black/55 dark:text-white/55">
                      {currentWallpaper.subtitle}
                    </div>
                  </div>
                </div>
                <SettingsRow label="Animate wallpaper">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={wallpaperMotion}
                    onClick={() => {
                      const next = !wallpaperMotion;
                      setWallpaperMotion(next);
                      playToggleSound(next);
                    }}
                    className={cn(
                      'relative h-6 w-11 rounded-full transition-[background-color,transform] duration-150 ease-smooth-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] focus-visible:ring-offset-2 active:scale-[0.97]',
                      wallpaperMotion
                        ? 'bg-[#0a84ff]'
                        : 'bg-black/15 dark:bg-white/20',
                    )}
                  >
                    <span
                      className={cn(
                        'block h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ease-smooth-out',
                        wallpaperMotion ? 'translate-x-5' : 'translate-x-0.5',
                      )}
                    />
                  </button>
                </SettingsRow>
                <SettingsRow label="Auto-rotate wallpaper (2 min)">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={autoRotateWallpaper}
                    onClick={() => {
                      const next = !autoRotateWallpaper;
                      setAutoRotateWallpaper(next);
                      playToggleSound(next);
                    }}
                    className={cn(
                      'relative h-6 w-11 rounded-full transition-[background-color,transform] duration-150 ease-smooth-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] focus-visible:ring-offset-2 active:scale-[0.97]',
                      autoRotateWallpaper
                        ? 'bg-[#0a84ff]'
                        : 'bg-black/15 dark:bg-white/20',
                    )}
                  >
                    <span
                      className={cn(
                        'block h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ease-smooth-out',
                        autoRotateWallpaper ? 'translate-x-5' : 'translate-x-0.5',
                      )}
                    />
                  </button>
                </SettingsRow>
              </SettingsGroup>

              {(
                [
                  {
                    id: 'dynamic',
                    title: 'Dynamic',
                    items: WALLPAPERS.filter((w) => w.kind !== 'image'),
                  },
                  {
                    id: 'still',
                    title: 'Still',
                    items: WALLPAPERS.filter((w) => w.kind === 'image'),
                  },
                ] as const
              ).map((group) => (
                <div key={group.id} className="space-y-2">
                  <div className="px-1 text-[11px] font-semibold uppercase tracking-wider text-black/50 dark:text-white/50">
                    {group.title}
                  </div>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(min(124px,100%),1fr))] gap-3">
                    {group.items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          if (wallpaperId !== item.id) playSoftSelectSound();
                          setWallpaperId(item.id);
                        }}
                        aria-label={`Select wallpaper ${item.label}`}
                        aria-pressed={wallpaperId === item.id}
                        className={cn(
                          'relative aspect-video w-full overflow-hidden rounded-lg ring-1 ring-black/10 transition-[transform,box-shadow] duration-150 ease-smooth-out fine:hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] focus-visible:ring-offset-2 active:scale-[0.97] dark:ring-white/15',
                          wallpaperId === item.id &&
                            'ring-[3px] ring-[#0a84ff] ring-offset-2 ring-offset-[#f2f2f7] dark:ring-offset-[#282025]',
                        )}
                        style={{ background: item.preview }}
                      >
                        <img
                          src={item.thumbnail}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentPane.id === 'displays' && (
            <SettingsGroup>
              <SettingsRow label="Brightness">
                <div className="flex w-56 items-center gap-2">
                  <Sun size={12} className="opacity-50" />
                  <input
                    type="range"
                    min={0.35}
                    max={1}
                    step={0.01}
                    value={brightness}
                    onChange={(event) =>
                      setBrightness(Number(event.target.value))
                    }
                    className="flex-grow accent-[#0a84ff]"
                    aria-label="Display brightness"
                  />
                  <Sun size={16} className="opacity-70" />
                </div>
              </SettingsRow>
            </SettingsGroup>
          )}

          {currentPane.id === 'about' && (
            <>
              <div className="flex flex-col items-center gap-2 py-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-black/[0.04] p-3 ring-1 ring-black/10 dark:bg-white/[0.06] dark:ring-white/10">
                  <img
                    src="/brand-logo.svg"
                    alt={profile.name}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="text-[20px] font-bold">{profile.name}</div>
                <div className="text-black/50 dark:text-white/50">
                  {profile.email}
                </div>
              </div>
              <SettingsGroup>
                <SettingsRow label="System">
                  <span className="text-black/50 dark:text-white/50">
                    Desktop Portfolio v{GANOS_VERSION}
                  </span>
                </SettingsRow>
                <SettingsRow label="Built with">
                  <span className="text-black/50 dark:text-white/50">
                    React, TypeScript, Tailwind CSS, Framer Motion
                  </span>
                </SettingsRow>
                <SettingsRow label="Legacy Design">
                  <a
                    href="/old"
                    className="text-[#0a84ff] hover:underline"
                  >
                    Open /old in Safari
                  </a>
                </SettingsRow>
                <SettingsRow label="Based on">
                  <a
                    href="https://github.com/R0shish/macos-styled-portfolio"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#0a84ff] hover:underline"
                  >
                    macOS Portfolio by Roshish Shrestha
                  </a>
                </SettingsRow>
                <SettingsRow label="Source">
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#0a84ff] hover:underline"
                  >
                    View on GitHub
                  </a>
                </SettingsRow>
              </SettingsGroup>
            </>
          )}
          </div>
        </div>
      </section>
    </div>
  );
};

const NOTES_UNCHECKED_KEY = 'ganos-notes-unchecked-v1';

const readUncheckedNotes = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = JSON.parse(
      window.localStorage.getItem(NOTES_UNCHECKED_KEY) ?? '[]',
    );
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
};

const ChecklistItem: React.FC<{ id: string; label: string }> = ({
  id,
  label,
}) => {
  const [isChecked, setIsChecked] = useState(
    () => !readUncheckedNotes().includes(id),
  );

  const toggle = () => {
    const unchecked = readUncheckedNotes().filter((item) => item !== id);
    const next = isChecked ? [...unchecked, id] : unchecked;
    try {
      window.localStorage.setItem(NOTES_UNCHECKED_KEY, JSON.stringify(next));
    } catch {
      /* ignore storage failures */
    }
    setIsChecked(!isChecked);
  };

  return (
    <li className="flex items-center gap-2">
      <motion.button
        type="button"
        role="checkbox"
        aria-checked={isChecked}
        aria-label={label}
        onClick={toggle}
        initial={false}
        animate={{ scale: isChecked ? [0.8, 1.15, 1] : [0.9, 1] }}
        transition={{ duration: 0.25 }}
        className={cn(
          'flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-colors duration-150',
          isChecked
            ? 'bg-[#ffd52e]'
            : 'ring-[1.5px] ring-inset ring-black/25 dark:ring-white/30',
        )}
      >
        {isChecked && <Check size={10} strokeWidth={3} className="text-black" />}
      </motion.button>
      <span>{label}</span>
    </li>
  );
};

export const NotesApp: React.FC<{ initialId?: string }> = ({ initialId }) => {
  const { note, setNote } = useOsNote();
  const isFocused = useWindowFocus();
  const [selectedId, setSelectedId] = useState(initialId ?? 'hello');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (initialId) setSelectedId(initialId);
  }, [initialId]);

  const notes = [
    {
      id: 'hello',
      title: 'Hello 👋',
      date: 'Pinned',
      preview: `${education.degree} at ${education.university}`,
      content: (
        <>
          <p>
            I&apos;m {profile.name}. I build web and mobile products from{' '}
            {profile.location} — focusing on clean backend systems and
            interfaces that feel good to use.
          </p>
          <p>
            Currently a Computer Engineering student at {education.university}{' '}
            (Semester {profile.semester}, GPA {education.gpa}).
          </p>
          <p>
            Say hi at{' '}
            <a
              href={`mailto:${profile.email}`}
              className="text-[#b8860b] underline underline-offset-2 dark:text-[#ffd52e]"
            >
              {profile.email}
            </a>{' '}
            or find me on{' '}
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="text-[#b8860b] underline underline-offset-2 dark:text-[#ffd52e]"
            >
              GitHub
            </a>{' '}
            and{' '}
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-[#b8860b] underline underline-offset-2 dark:text-[#ffd52e]"
            >
              LinkedIn
            </a>
            .
          </p>
        </>
      ),
    },
    ...organizationExperience.map((exp, idx) => ({
      id: `exp-${idx}`,
      title: exp.organization,
      date: exp.period.split(' - ')[0] ?? exp.period,
      preview: exp.role,
      content: (
        <>
          <p className="text-neutral-500 dark:text-neutral-400">
            {exp.role} · {exp.period}
          </p>
          <ul className="list-disc space-y-1 pl-5">
            {exp.responsibilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </>
      ),
    })),
    {
      id: 'skills',
      title: 'Skills',
      date: 'Always learning',
      preview: skillTiers
        .flatMap((t) => t.skills.map((s) => s.name))
        .slice(0, 5)
        .join(', '),
      content: (
        <>
          {skillTiers.map((tier) => (
            <div key={tier.label}>
              <h3 className="font-semibold">{tier.label}</h3>
              <ul className="mt-1.5 space-y-1">
                {tier.skills.map((skill) => (
                  <ChecklistItem
                    key={skill.name}
                    id={`${tier.label}/${skill.name}`}
                    label={skill.name}
                  />
                ))}
              </ul>
            </div>
          ))}
        </>
      ),
    },
    {
      id: 'certifications',
      title: 'Certifications',
      date: certifications[0]?.year ?? '2025',
      preview: certifications.map((c) => c.title).join(', '),
      content: (
        <>
          {certifications.map((cert) => (
            <div key={cert.title}>
              <h3 className="font-semibold">{cert.title}</h3>
              <p className="text-neutral-500 dark:text-neutral-400">
                {cert.issuer} · {cert.year}
                {cert.score ? ` · ${cert.score}` : ''}
                {cert.credentialId ? ` · ID ${cert.credentialId}` : ''}
              </p>
            </div>
          ))}
        </>
      ),
    },
    {
      id: 'scratchpad',
      title: 'Scratchpad',
      date: 'Editable',
      preview: note,
      content: (
        <textarea
          aria-label="Personal note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          className="min-h-60 w-full resize-none bg-transparent text-[15px] leading-7 outline-none"
        />
      ),
    },
  ];

  const filteredNotes = notes.filter((item) =>
    `${item.title} ${item.preview}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const selectedNote =
    notes.find((item) => item.id === selectedId) ?? notes[0];

  return (
    <div className="flex h-full">
      <aside className="flex w-40 shrink-0 select-none flex-col border-r border-black/5 sm:w-64 dark:border-white/[0.06]">
        <div className="handle h-[52px] shrink-0" />
        <div className="px-3 pb-2">
          <div className="flex h-8 items-center gap-1.5 rounded-full bg-black/5 px-2.5 dark:bg-white/[0.08]">
            <Search size={13} className="opacity-50" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search"
              className="w-full bg-transparent text-[13px] outline-none placeholder:text-black/40 dark:placeholder:text-white/40"
            />
          </div>
        </div>
        <div className="flex-grow overflow-y-auto px-2.5 pb-2">
          {filteredNotes.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className={cn(
                'w-full cursor-default rounded-[10px] px-3 py-2 text-left',
                selectedNote.id === item.id &&
                  (isFocused
                    ? 'bg-[#ffd52e] text-black dark:bg-[#6e5815] dark:text-white'
                    : 'bg-black/10 dark:bg-white/10'),
              )}
            >
              <div className="truncate font-bold">{item.title}</div>
              <div className="flex gap-2 text-[12px]">
                <span className="shrink-0">{item.date}</span>
                <span className="truncate opacity-60">{item.preview}</span>
              </div>
            </button>
          ))}
        </div>
      </aside>
      <article className="flex min-w-0 flex-grow flex-col bg-white dark:bg-[#1e1e1e]">
        <Toolbar />
        <div className="selectable flex-grow overflow-y-auto px-6 pb-8 selection:bg-[#ffd52e]/45 sm:px-12">
          <div className="mb-4 text-center text-[12px] text-black/40 dark:text-white/40">
            {selectedNote.date}
          </div>
          <h1 className="mb-4 text-[26px] font-bold">{selectedNote.title}</h1>
          <div className="max-w-prose space-y-4 text-[14px] leading-relaxed">
            {selectedNote.content}
          </div>
        </div>
      </article>
    </div>
  );
};

interface TerminalEntry {
  id: number;
  input: string;
  output: React.ReactNode;
}

const SESSION_BOOT_TS = Date.now();

export const TerminalApp: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { openApp, systemFont } = useOsNote();
  const { pushNotification } = useOsNotification();
  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const [lastLogin] = useState(() =>
    new Date().toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }),
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [entries]);

  const openTargets: Record<string, { label: string; run: () => void }> = {
    projects: { label: 'Projects (Finder)', run: () => openApp('projects') },
    about: { label: 'About Me (Contacts)', run: () => openApp('about') },
    cv: { label: 'CV.pdf (Preview)', run: () => openApp('resume') },
    resume: { label: 'CV.pdf (Preview)', run: () => openApp('resume') },
    blog: { label: 'Writing Log', run: () => openApp('blog') },
    notes: { label: 'Notes', run: () => openApp('notes') },
    mail: { label: 'Mail', run: () => openApp('mail') },
    settings: { label: 'System Settings', run: () => openApp('settings') },
    github: {
      label: 'GitHub',
      run: () => window.open(profile.github, '_blank', 'noreferrer'),
    },
    linkedin: {
      label: 'LinkedIn',
      run: () => window.open(profile.linkedin, '_blank', 'noreferrer'),
    },
  };

  const runCommand = (raw: string): React.ReactNode => {
    const [cmd, ...args] = raw.trim().split(/\s+/);
    if (!cmd) return null;
    const name = cmd.toLowerCase();

    if (name === 'help') {
      return (
        <div className="grid grid-cols-[120px_1fr] gap-y-0.5">
          <span className="text-cyan-400">whoami</span>
          <span>who is this guy?</span>
          <span className="text-cyan-400">projects</span>
          <span>featured builds and case studies</span>
          <span className="text-cyan-400">skills</span>
          <span>languages, frameworks &amp; tools</span>
          <span className="text-cyan-400">contact</span>
          <span>how to reach me</span>
          <span className="text-cyan-400">open &lt;app&gt;</span>
          <span>open an app (projects, about, cv, notes, mail, settings)</span>
          <span className="text-cyan-400">notify &lt;msg&gt;</span>
          <span>send a desktop notification</span>
          <span className="text-cyan-400">ls / cat</span>
          <span>list or inspect files</span>
          <span className="text-cyan-400">neofetch</span>
          <span>system information</span>
          <span className="text-cyan-400">clear / exit</span>
          <span>clear terminal or close window</span>
        </div>
      );
    }
    if (name === 'whoami')
      return `${profile.name} — Full-Stack Developer (${profile.location})`;
    if (name === 'projects') {
      return (
        <div>
          {featuredProjects.map((p) => (
            <div key={p.slug}>
              <span className="text-cyan-400">{p.title}</span>{' '}
              <span className="text-neutral-500">
                ({p.year} · {p.role})
              </span>
            </div>
          ))}
          <div className="mt-1 text-neutral-500">
            Run `open projects` to browse them in Finder.
          </div>
        </div>
      );
    }
    if (name === 'skills') {
      return (
        <div>
          {skillTiers.map((tier) => (
            <div key={tier.label}>
              <span className="text-cyan-400">{tier.label}:</span>{' '}
              {tier.skills.map((s) => s.name).join(', ')}
            </div>
          ))}
        </div>
      );
    }
    if (name === 'contact') {
      return (
        <div className="grid grid-cols-[90px_1fr]">
          <span className="text-cyan-400">email</span>
          <a href={`mailto:${profile.email}`} className="underline">
            {profile.email}
          </a>
          <span className="text-cyan-400">github</span>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            {profile.github}
          </a>
          <span className="text-cyan-400">linkedin</span>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            {profile.linkedin}
          </a>
        </div>
      );
    }
    if (name === 'notify' || name === 'alert') {
      const messageText = args.join(' ') || 'Hello from Terminal!';
      pushNotification({
        appId: 'terminal',
        appName: 'Terminal',
        appIcon: '/macos-icons/terminal.png',
        title: 'Terminal Notification',
        body: messageText,
      });
      return `Notification sent to Notification Center: "${messageText}"`;
    }
    if (name === 'open') {
      const targetKey = (args[0] ?? '').toLowerCase();
      if (!targetKey)
        return `usage: open <${Object.keys(openTargets).join(' | ')}>`;
      const target = openTargets[targetKey];
      if (!target)
        return `The file /Users/ghufron/${targetKey} does not exist.`;
      target.run();
      return `Opening ${target.label}...`;
    }
    if (name === 'ls') {
      return (
        <div className="flex flex-wrap gap-x-6">
          <span>about.txt</span>
          <span>skills.txt</span>
          <span>CV.pdf</span>
          <span className="font-bold text-blue-400">projects</span>
        </div>
      );
    }
    if (name === 'cat') {
      const file = args[0];
      if (!file) return 'usage: cat <file>';
      if (file === 'about.txt')
        return `${profile.name} — ${education.degree} at ${education.university} (GPA ${education.gpa}).`;
      if (file === 'skills.txt')
        return skillTiers
          .map((t) => `${t.label}: ${t.skills.map((s) => s.name).join(', ')}`)
          .join('\n');
      if (file === 'CV.pdf') return 'cat: CV.pdf: binary file. Try `open cv`';
      return `cat: ${file}: No such file or directory`;
    }
    if (name === 'neofetch') {
      const elapsedSec = Math.max(1, Math.floor((Date.now() - SESSION_BOOT_TS) / 1000));
      const upMins = Math.floor(elapsedSec / 60);
      const upSecs = elapsedSec % 60;
      const uptimeLabel = upMins > 0 ? `${upMins}m ${upSecs}s (this session)` : `${upSecs}s (this session)`;
      const fontLabel =
        systemFont === 'inter'
          ? 'Inter'
          : systemFont === 'geist'
            ? 'Geist'
            : 'Plus Jakarta Sans';
      return (
        <div className="my-1.5 flex flex-col gap-3 font-mono text-[11.5px] sm:flex-row sm:items-center sm:gap-6">
          <pre className="select-none leading-none text-amber-400">{`
       .:'
   __ :'__
 .'\`__\`-'__\`\`.
:__________.-'
:_________:
 :_________\`-;
  \`.__.-.__.'
`}</pre>
          <div className="space-y-0.5 leading-relaxed">
            <div>
              <span className="font-bold text-cyan-400">ghufron</span>@
              <span className="font-bold text-cyan-400">ghufronainun.tech</span>
            </div>
            <div className="text-white/30">---------------------------</div>
            <div>
              <span className="font-semibold text-amber-400">OS:</span> Desktop Portfolio v{GANOS_VERSION}
            </div>
            <div>
              <span className="font-semibold text-amber-400">Host:</span> {profile.name} · Full-Stack Developer
            </div>
            <div>
              <span className="font-semibold text-amber-400">Location:</span> {profile.location}
            </div>
            <div>
              <span className="font-semibold text-amber-400">Kernel:</span> React 18 / TypeScript / Vite
            </div>
            <div>
              <span className="font-semibold text-amber-400">Uptime:</span> {uptimeLabel}
            </div>
            <div>
              <span className="font-semibold text-amber-400">Shell:</span> zsh (browser sandbox)
            </div>
            <div>
              <span className="font-semibold text-amber-400">Font:</span> {fontLabel}
            </div>
            <div>
              <span className="font-semibold text-amber-400">Viewport:</span>{' '}
              {typeof window !== 'undefined' ? `${window.innerWidth}×${window.innerHeight}` : '1440×900'}
            </div>
            <div className="flex gap-1 pt-1.5">
              <span className="inline-block h-2 w-3.5 rounded-[2px] bg-black ring-1 ring-white/20" />
              <span className="inline-block h-2 w-3.5 rounded-[2px] bg-red-500" />
              <span className="inline-block h-2 w-3.5 rounded-[2px] bg-green-500" />
              <span className="inline-block h-2 w-3.5 rounded-[2px] bg-yellow-500" />
              <span className="inline-block h-2 w-3.5 rounded-[2px] bg-blue-500" />
              <span className="inline-block h-2 w-3.5 rounded-[2px] bg-purple-500" />
              <span className="inline-block h-2 w-3.5 rounded-[2px] bg-cyan-500" />
              <span className="inline-block h-2 w-3.5 rounded-[2px] bg-white" />
            </div>
          </div>
        </div>
      );
    }
    if (name === 'date') return new Date().toString();
    if (name === 'echo') return args.join(' ');
    if (name === 'pwd') return '/Users/ghufron';
    if (name === 'sudo') return 'Nice try. This incident will be reported.';
    if (name === 'exit') {
      onClose();
      return null;
    }
    return `zsh: command not found: ${name}`;
  };

  const submit = () => {
    const trimmed = input.trim();
    const nextHistory = trimmed ? [...history, trimmed] : history;
    if (trimmed.toLowerCase() === 'clear') {
      setEntries([]);
      setHistory(nextHistory);
      setHistoryIndex(null);
      setInput('');
      return;
    }
    const output = runCommand(input);
    setHistory(nextHistory);
    setHistoryIndex(null);
    setInput('');
    setEntries((prev) => [
      ...prev,
      { id: nextId.current++, input, output },
    ]);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      submit();
    } else if (event.key === 'Tab') {
      event.preventDefault();
      const current = input.trim().toLowerCase();
      if (!current) return;
      const allCommands = [
        'help',
        'whoami',
        'projects',
        'skills',
        'contact',
        'open',
        'ls',
        'cat',
        'neofetch',
        'clear',
        'date',
        'pwd',
        'echo',
        'exit',
      ];
      const match = allCommands.find((c) => c.startsWith(current));
      if (match) {
        setInput(match);
      }
    } else if (event.key === 'ArrowUp' && history.length) {
      event.preventDefault();
      const idx =
        historyIndex === null
          ? history.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(idx);
      setInput(history[idx] ?? '');
    } else if (event.key === 'ArrowDown' && history.length) {
      event.preventDefault();
      if (historyIndex === null) return;
      const next = historyIndex + 1;
      if (next >= history.length) {
        setHistoryIndex(null);
        setInput('');
      } else {
        setHistoryIndex(next);
        setInput(history[next] ?? '');
      }
    } else if (event.key === 'l' && event.ctrlKey) {
      event.preventDefault();
      setEntries([]);
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#1e1e1e]/95 text-[#f2f2f2]">
      <Toolbar
        hasControls
        centerTitle
        title={
          <span className="text-[13px] font-semibold text-white/70">
            ghufron — -zsh
          </span>
        }
        className="h-[52px] border-b border-black/60"
      />
      <div
        className="selectable flex-grow cursor-text overflow-y-auto p-3 font-mono text-[12px] leading-relaxed"
        onClick={() => {
          if (!window.getSelection()?.toString()) inputRef.current?.focus();
        }}
      >
        <div>Last login: {lastLogin} on ttys000</div>
        <div className="mb-1 text-neutral-400">
          Type `help` to see what you can do here.
        </div>
        {entries.map((entry) => (
          <div key={entry.id}>
            <div className="flex">
              <span className="mr-2 shrink-0">
                <span className="text-green-400">ghufron@portfolio</span>{' '}
                <span className="text-blue-400">~</span> %
              </span>
              <span className="break-all">{entry.input}</span>
            </div>
            {entry.output && (
              <div className="whitespace-pre-wrap break-words">
                {entry.output}
              </div>
            )}
          </div>
        ))}
        <div className="flex" ref={bottomRef}>
          <span className="mr-2 shrink-0">
            <span className="text-green-400">ghufron@portfolio</span>{' '}
            <span className="text-blue-400">~</span> %
          </span>
          <input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow bg-transparent caret-neutral-200 outline-none"
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export const MailApp: React.FC = () => {
  const { pushNotification } = useOsNotification();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const canSend = subject.trim().length > 0 && message.trim().length > 0;

  const handleSend = () => {
    if (!canSend) return;
    pushNotification({
      appId: 'mail',
      appName: 'Mail',
      appIcon: '/macos-icons/mail.png',
      title: 'Mail Client Launched',
      body: `Ready to send: "${subject}" to ${profile.email}`,
    });
    const params = new URLSearchParams({ subject, body: message });
    window.location.href = `mailto:${profile.email}?${params
      .toString()
      .replace(/\+/g, '%20')}`;
  };

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#282025]">
      <Toolbar
        hasControls
        title={subject.trim() || 'New Message'}
        trailing={
          <ToolbarGroup>
            <ToolbarButton
              icon={<Send size={15} />}
              title="Send"
              disabled={!canSend}
              onClick={handleSend}
              className="enabled:text-[#0a84ff]"
            />
          </ToolbarGroup>
        }
      />
      <div className="mx-4 flex h-9 items-center gap-2 border-b border-black/5 dark:border-white/10">
        <div className="w-14 text-black/45 dark:text-white/45">To:</div>
        <span className="rounded-full bg-[#0a84ff]/15 px-2 py-0.5 text-[#0a84ff]">
          {profile.name}
        </span>
      </div>
      <div className="mx-4 flex h-9 items-center gap-2 border-b border-black/5 dark:border-white/10">
        <div className="w-14 text-black/45 dark:text-white/45">Subject:</div>
        <input
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          className="flex-grow bg-transparent outline-none"
          autoFocus
        />
      </div>
      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
            handleSend();
          }
        }}
        placeholder={`Hi ${profile.name.split(' ')[0]},\n\n`}
        className="flex-grow resize-none bg-transparent p-4 text-[14px] leading-relaxed outline-none placeholder:text-black/30 dark:placeholder:text-white/30"
      />
      <div className="border-t border-black/5 px-4 py-2 text-[11px] text-black/40 dark:border-white/5 dark:text-white/40">
        Sending opens your mail app with this message ready to go.
      </div>
    </div>
  );
};
