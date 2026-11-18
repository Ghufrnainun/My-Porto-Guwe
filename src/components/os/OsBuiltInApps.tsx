import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bookmark,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
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
  Image as ImageIcon,
  Sun,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  certifications,
  education,
  organizationExperience,
  profile,
  skillTiers,
} from '@/data/profile';
import { featuredProjects } from '@/data/featuredProjects';
import {
  useOsNote,
  useWindowFocus,
  WALLPAPERS,
  type OsAppearance,
  type OsAppId,
  type SettingsPaneId,
} from '@/components/os/OsShellContext';
import {
  isSoundEnabled,
  setSoundEnabled,
  playToggleSound,
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

const SAFARI_BOOKMARKS = [
  {
    id: 'yt-odoriko',
    label: 'Odoriko — Vaundy',
    url: 'https://www.youtube.com/embed/7HgJIAUtICU?autoplay=1',
    category: 'tracks',
  },
  {
    id: 'yt-loser',
    label: 'LOSER — Kenshi Yonezu',
    url: 'https://www.youtube.com/embed/Dx_fKPBPYUI?autoplay=1',
    category: 'tracks',
  },
  {
    id: 'yt-attitude',
    label: 'ATTITUDE — aespa',
    url: 'https://www.youtube.com/embed/4xDzrJKXOOY?autoplay=1',
    category: 'tracks',
  },
  {
    id: 'yt-flowers',
    label: 'Flowers — aespa',
    url: 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1',
    category: 'tracks',
  },
  {
    id: 'yt-kickback',
    label: 'KICK BACK — Kenshi Yonezu',
    url: 'https://www.youtube.com/embed/M2cckDmNLMI?autoplay=1',
    category: 'tracks',
  },
  {
    id: 'yt-nightcall',
    label: 'Nightcall — Kavinsky',
    url: 'https://www.youtube.com/embed/MV_3Dpw-BRY?autoplay=1',
    category: 'tracks',
  },
  {
    id: 'fav-old',
    label: 'Legacy Portfolio (/old)',
    url: '/old',
    category: 'fav',
  },
  {
    id: 'fav-projects',
    label: 'Featured Projects',
    url: '/projects',
    category: 'fav',
  },
  {
    id: 'fav-blog',
    label: 'Engineering Blog',
    url: '/blog',
    category: 'fav',
  },
  {
    id: 'fav-resume',
    label: 'Curriculum Vitae',
    url: '/resume',
    category: 'fav',
  },
  {
    id: 'fav-about',
    label: 'About Ghufron',
    url: '/about',
    category: 'fav',
  },
];

function formatDisplayUrl(url: string): string {
  if (url === 'safari:start') return 'Favorites';
  if (url === '/old') return 'ghufronainun.tech/old';
  try {
    const parsed = new URL(url);
    if (
      parsed.hostname.includes('youtube.com') &&
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
  if (url === '/old') return 'Legacy Portfolio';
  if (url === '/projects') return 'Projects';
  if (url === '/blog') return 'Writing';
  if (url === '/resume') return 'Resume';
  if (url === '/about') return 'About Me';
  const match = SAFARI_BOOKMARKS.find((b) => b.url === url);
  if (match) return match.label;
  if (url.includes('youtube.com/embed/')) {
    const id = url.split('/embed/')[1]?.split('?')[0];
    return `YouTube (${id})`;
  }
  return formatDisplayUrl(url);
}

function formatExternalUrl(url: string): string {
  if (url === 'safari:start') return window.location.origin;
  if (url.includes('youtube.com/embed/')) {
    const vidId = url.split('/embed/')[1]?.split('?')[0];
    return `https://www.youtube.com/watch?v=${vidId}`;
  }
  if (url.startsWith('/')) {
    return `${window.location.origin}${url}`;
  }
  return url;
}

export const SafariApp: React.FC<{ initialUrl?: string }> = ({
  initialUrl = '/old',
}) => {
  const [tabs, setTabs] = useState<SafariTab[]>([
    {
      id: 'tab-1',
      title: formatDisplayTitle(initialUrl),
      url: initialUrl,
      history: [initialUrl],
      historyIndex: 0,
    },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('tab-1');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressInput, setAddressInput] = useState('');
  const [isReloading, setIsReloading] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const activeTab = useMemo(
    () => tabs.find((t) => t.id === activeTabId) ?? tabs[0],
    [tabs, activeTabId],
  );

  // Sync when initialUrl prop updates from external desktop actions (e.g. music widget)
  useEffect(() => {
    if (!initialUrl) return;
    setTabs((prev) => {
      const current = prev.find((t) => t.id === activeTabId);
      if (current && current.url === initialUrl) return prev;
      return prev.map((t) => {
        if (t.id !== activeTabId) return t;
        const nextHist = [...t.history.slice(0, t.historyIndex + 1), initialUrl];
        return {
          ...t,
          url: initialUrl,
          title: formatDisplayTitle(initialUrl),
          history: nextHist,
          historyIndex: nextHist.length - 1,
        };
      });
    });
  }, [initialUrl, activeTabId]);

  const displayUrl = useMemo(
    () => formatDisplayUrl(activeTab.url),
    [activeTab.url],
  );

  const externalUrl = useMemo(
    () => formatExternalUrl(activeTab.url),
    [activeTab.url],
  );

  const canGoBack = activeTab.historyIndex > 0;
  const canGoForward = activeTab.historyIndex < activeTab.history.length - 1;

  const navigateTo = (rawInput: string) => {
    let target = rawInput.trim();
    if (!target) return;

    // Convert YouTube watch links to embed so they work inside iframe
    if (target.includes('youtube.com/watch') || target.includes('youtu.be/')) {
      try {
        let vidId = '';
        if (target.includes('youtu.be/')) {
          vidId =
            target.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0] ?? '';
        } else {
          const u = new URL(
            target.startsWith('http') ? target : `https://${target}`,
          );
          vidId = u.searchParams.get('v') ?? '';
        }
        if (vidId) {
          target = `https://www.youtube.com/embed/${vidId}?autoplay=1`;
        }
      } catch {
        /* ignore */
      }
    } else if (
      !target.startsWith('/') &&
      !target.startsWith('http://') &&
      !target.startsWith('https://') &&
      target !== 'safari:start'
    ) {
      if (target === 'old' || target === 'legacy') target = '/old';
      else if (
        target === 'projects' ||
        target === 'about' ||
        target === 'blog' ||
        target === 'resume'
      )
        target = `/${target}`;
      else if (target.includes('.')) target = `https://${target}`;
      else target = '/projects';
    }

    setTabs((prev) =>
      prev.map((t) => {
        if (t.id !== activeTabId) return t;
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
    setIsReloading(true);
    setReloadKey((k) => k + 1);
    window.setTimeout(() => setIsReloading(false), 500);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      void navigator.clipboard.writeText(externalUrl);
      toast.success('Link copied to clipboard', {
        description: externalUrl,
      });
    } else {
      toast('Link: ' + externalUrl);
    }
  };

  const handleNewTab = (newUrl: string = 'safari:start') => {
    const id = `tab-${Date.now()}`;
    setTabs((prev) => [
      ...prev,
      {
        id,
        title: formatDisplayTitle(newUrl),
        url: newUrl,
        history: [newUrl],
        historyIndex: 0,
      },
    ]);
    setActiveTabId(id);
    setShowOverview(false);
  };

  const handleCloseTab = (tabId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setTabs((prev) => {
      if (prev.length <= 1) {
        return [
          {
            id: `tab-${Date.now()}`,
            title: 'Start Page',
            url: 'safari:start',
            history: ['safari:start'],
            historyIndex: 0,
          },
        ];
      }
      const remaining = prev.filter((t) => t.id !== tabId);
      if (activeTabId === tabId) {
        const idx = prev.findIndex((t) => t.id === tabId);
        const nextActive =
          remaining[Math.max(0, idx - 1)]?.id ?? remaining[0].id;
        setActiveTabId(nextActive);
      }
      return remaining;
    });
  };

  return (
    <div className="flex h-full flex-col bg-[#f2f2f7] dark:bg-[#282025]">
      {/* Safari Main Toolbar */}
      <Toolbar
        hasControls
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
                    <ChevronDown size={11} className={sidebarOpen ? 'rotate-180 transition-transform' : ''} />
                  </span>
                }
              />
            </ToolbarGroup>

            {/* Back & Forward History Navigation */}
            <ToolbarGroup>
              <ToolbarButton
                title={canGoBack ? 'Click to go back' : 'Back'}
                disabled={!canGoBack}
                onClick={handleBack}
                icon={<ChevronLeft size={16} />}
              />
              <span className="h-4 w-[0.5px] bg-black/15 dark:bg-white/15" />
              <ToolbarButton
                title={canGoForward ? 'Click to go forward' : 'Forward'}
                disabled={!canGoForward}
                onClick={handleForward}
                icon={<ChevronRight size={16} />}
              />
            </ToolbarGroup>
          </>
        }
        center={
          /* Smart Interactive Address Bar */
          <ToolbarGroup className="w-full max-w-[440px] justify-between px-3 text-[13px]">
            <Lock size={12} className="shrink-0 opacity-45" />

            {isEditingAddress ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  navigateTo(addressInput);
                }}
                className="flex-1 px-2"
              >
                <input
                  type="text"
                  autoFocus
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  onBlur={() => setIsEditingAddress(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setIsEditingAddress(false);
                  }}
                  placeholder="Enter URL or search..."
                  className="w-full bg-transparent text-center text-[12.5px] text-black outline-none focus:text-left dark:text-white"
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
                title="Click to edit address or enter URL"
                className="flex-1 truncate px-2 text-center text-black/85 transition-opacity hover:opacity-75 dark:text-white/90"
              >
                {displayUrl}
              </button>
            )}

            <button
              type="button"
              onClick={handleReload}
              title="Reload page"
              aria-label="Reload page"
              className="shrink-0 opacity-55 transition-opacity hover:opacity-100"
            >
              <RotateCw
                size={12}
                className={isReloading ? 'animate-spin' : ''}
              />
            </button>
          </ToolbarGroup>
        }
        trailing={
          <ToolbarGroup className="max-sm:hidden">
            {/* Share / Copy URL Button */}
            <ToolbarButton
              title="Copy link to clipboard"
              onClick={handleShare}
              icon={<Share size={14} />}
            />
            {/* New Tab Button */}
            <ToolbarButton
              title="New Tab (inside Safari)"
              onClick={() => handleNewTab()}
              icon={<Plus size={15} />}
            />
            {/* Tab Overview Toggle Button */}
            <ToolbarButton
              title="Show Tab Overview"
              isActive={showOverview}
              onClick={() => setShowOverview((v) => !v)}
              icon={<Copy size={13} />}
            />
          </ToolbarGroup>
        }
      />

      {/* Safari Tab Strip (when 2+ tabs are open) */}
      {tabs.length > 1 && (
        <div className="flex h-[32px] shrink-0 items-center gap-1 border-b border-black/10 bg-[#e4e2e6] px-2.5 text-[12px] dark:border-white/10 dark:bg-[#1f1b20] select-none">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              role="button"
              tabIndex={0}
              onClick={() => {
                setActiveTabId(tab.id);
                setShowOverview(false);
              }}
              className={cn(
                'group flex h-[25px] max-w-[210px] flex-1 cursor-default items-center justify-between rounded-[7px] px-2.5 transition-all',
                tab.id === activeTabId
                  ? 'bg-white font-medium text-black shadow-[0_1px_3px_rgba(0,0,0,0.12)] dark:bg-[#2f272d] dark:text-white'
                  : 'text-black/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/5',
              )}
            >
              <span className="truncate">{tab.title}</span>
              <button
                type="button"
                onClick={(e) => handleCloseTab(tab.id, e)}
                title="Close Tab"
                className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full opacity-0 hover:bg-black/10 group-hover:opacity-100 dark:hover:bg-white/15"
              >
                <X size={10} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleNewTab()}
            title="New Tab"
            className="flex h-6 w-6 items-center justify-center rounded-md text-black/60 transition-colors hover:bg-black/10 hover:text-black dark:text-white/60 dark:hover:bg-white/15 dark:hover:text-white"
          >
            <Plus size={13} />
          </button>
        </div>
      )}

      {/* Main Safari Body: Sidebar + Web Content */}
      <div className="relative flex flex-1 min-h-0 overflow-hidden">
        {/* Slide-out Bookmarks & History Sidebar */}
        {sidebarOpen && (
          <aside className="w-56 shrink-0 border-r border-black/10 bg-white/70 p-3 backdrop-blur-xl dark:border-white/10 dark:bg-[#20191f]/70 overflow-y-auto select-none">
            <div className="flex items-center justify-between pb-2 text-[11px] font-bold uppercase tracking-wider text-black/45 dark:text-white/40">
              <span className="flex items-center gap-1.5">
                <Bookmark size={12} />
                <span>Bookmarks</span>
              </span>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                title="Close Sidebar"
                className="text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white"
              >
                <X size={12} />
              </button>
            </div>

            <div className="space-y-4 pt-1">
              {/* Favorites Section */}
              <div>
                <div className="px-1 text-[11px] font-semibold text-black/40 dark:text-white/35">
                  Favorites
                </div>
                <div className="mt-1 space-y-0.5">
                  {SAFARI_BOOKMARKS.filter((b) => b.category === 'fav').map(
                    (b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => navigateTo(b.url)}
                        className={cn(
                          'flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[12.5px] transition-colors',
                          activeTab.url === b.url
                            ? 'bg-[#0a84ff] text-white'
                            : 'hover:bg-black/5 dark:hover:bg-white/5 text-black/80 dark:text-white/85',
                        )}
                      >
                        <Globe size={13} className="shrink-0 opacity-70" />
                        <span className="truncate">{b.label}</span>
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* Music Videos Section */}
              <div>
                <div className="px-1 text-[11px] font-semibold text-black/40 dark:text-white/35">
                  Recent Tracks
                </div>
                <div className="mt-1 space-y-0.5">
                  {SAFARI_BOOKMARKS.filter((b) => b.category === 'tracks').map(
                    (b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => navigateTo(b.url)}
                        className={cn(
                          'flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[12px] transition-colors',
                          activeTab.url === b.url
                            ? 'bg-[#0a84ff] text-white'
                            : 'hover:bg-black/5 dark:hover:bg-white/5 text-black/80 dark:text-white/85',
                        )}
                      >
                        <Music size={13} className="shrink-0 opacity-70 text-[#ff2d55]" />
                        <span className="truncate">{b.label}</span>
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Tab Overview Overlay */}
        {showOverview ? (
          <div className="flex-1 overflow-y-auto p-6 bg-black/[0.04] dark:bg-black/30">
            <div className="mx-auto max-w-3xl">
              <div className="flex items-center justify-between pb-4">
                <h2 className="text-[16px] font-bold text-black dark:text-white">
                  Open Tabs ({tabs.length})
                </h2>
                <button
                  type="button"
                  onClick={() => handleNewTab()}
                  className="flex items-center gap-1.5 rounded-full bg-[#0a84ff] px-3 py-1 text-[12px] font-medium text-white shadow-sm hover:opacity-90"
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
                    className={cn(
                      'group relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-xl border p-3 text-left transition-all hover:scale-[1.02]',
                      tab.id === activeTabId
                        ? 'border-[#0a84ff] bg-white ring-2 ring-[#0a84ff]/30 dark:bg-[#282025]'
                        : 'border-black/10 bg-white/60 dark:border-white/10 dark:bg-[#1a1518]/60',
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate text-[12px] font-bold text-black dark:text-white">
                        {tab.title}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleCloseTab(tab.id, e)}
                        title="Close Tab"
                        className="rounded-full p-1 opacity-0 hover:bg-black/10 group-hover:opacity-100 dark:hover:bg-white/15"
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
          /* Apple Safari Start Page */
          <div className="flex-1 overflow-y-auto p-8 bg-white dark:bg-[#181317] select-none">
            <div className="mx-auto max-w-2xl">
              <div className="pb-8 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0a84ff] to-[#5ac8fa] text-white shadow-md">
                  <Compass size={24} />
                </div>
                <h1 className="mt-3 text-2xl font-bold tracking-tight text-black dark:text-white">
                  Favorites
                </h1>
                <p className="mt-1 text-sm text-black/50 dark:text-white/50">
                  Quick bookmarks inside GanOS Safari
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
                {SAFARI_BOOKMARKS.map((bookmark) => (
                  <button
                    key={bookmark.id}
                    type="button"
                    onClick={() => navigateTo(bookmark.url)}
                    className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-black/5 bg-black/[0.02] p-4 text-center transition-all hover:-translate-y-0.5 hover:bg-black/[0.05] hover:shadow-md dark:border-white/5 dark:bg-white/[0.03] dark:hover:bg-white/[0.08]"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/5 group-hover:scale-105 dark:bg-[#2c232a] dark:ring-white/10">
                      {bookmark.category === 'tracks' ? (
                        <Music size={20} className="text-[#ff2d55]" />
                      ) : (
                        <Globe size={20} className="text-[#0a84ff]" />
                      )}
                    </span>
                    <span className="line-clamp-1 text-[12.5px] font-semibold text-black dark:text-white">
                      {bookmark.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Live Iframe View */
          <iframe
            key={reloadKey + activeTab.url}
            src={activeTab.url}
            title={`Safari — ${displayUrl}`}
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

export const SystemSettingsApp: React.FC = () => {
  const {
    appearance,
    setAppearance,
    wallpaperId,
    setWallpaperId,
    autoRotateWallpaper,
    setAutoRotateWallpaper,
    brightness,
    setBrightness,
    settingsPane,
    setSettingsPane,
  } = useOsNote();

  const [soundActive, setSoundActive] = useState(() => isSoundEnabled());

  const currentPane =
    settingsPanes.find((p) => p.id === settingsPane) ?? settingsPanes[3];
  const currentWallpaper =
    WALLPAPERS.find((w) => w.id === wallpaperId) ?? WALLPAPERS[0];

  return (
    <div className="flex h-full">
      <Sidebar
        selectedId={currentPane.id}
        onSelect={(id) => setSettingsPane(id as SettingsPaneId)}
        header={
          <button
            type="button"
            onClick={() => setSettingsPane('about')}
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
                        onClick={() => setAppearance(option.id)}
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
                    onClick={() =>
                      setAutoRotateWallpaper((current) => !current)
                    }
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
                <SettingsRow label="Play UI sound effects (Web Audio)">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={soundActive}
                    onClick={() => {
                      const next = !soundActive;
                      setSoundActive(next);
                      setSoundEnabled(next);
                      if (next) playToggleSound();
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
              </SettingsGroup>
            </>
          )}

          {currentPane.id === 'wallpaper' && (
            <>
              <SettingsGroup>
                <div className="flex items-center gap-4 py-3">
                  <div
                    className="relative aspect-video w-36 shrink-0 overflow-hidden rounded-lg ring-1 ring-black/10"
                    style={{ background: currentWallpaper.preview }}
                  />
                  <div>
                    <div className="font-semibold">{currentWallpaper.label}</div>
                    <div className="text-[12px] text-black/50 dark:text-white/50">
                      {currentWallpaper.subtitle}
                    </div>
                  </div>
                </div>
              </SettingsGroup>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
                {WALLPAPERS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setWallpaperId(item.id)}
                    className={cn(
                      'relative aspect-video cursor-default overflow-hidden rounded-lg ring-1 ring-black/10',
                      wallpaperId === item.id &&
                        'ring-[3px] ring-[#0a84ff] ring-offset-2 ring-offset-[#f2f2f7] dark:ring-offset-[#282025]',
                    )}
                    style={{ background: item.preview }}
                    title={item.label}
                  >
                    <span className="sr-only">{item.label}</span>
                  </button>
                ))}
              </div>
            </>
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
                    alt="GanOS"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="text-[20px] font-bold">GanOS</div>
                <div className="text-black/50 dark:text-white/50">
                  {profile.name} · {profile.email}
                </div>
              </div>
              <SettingsGroup>
                <SettingsRow label="System">
                  <span className="text-black/50 dark:text-white/50">
                    GanOS · Ghufron&apos;s Portfolio OS
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

export const TerminalApp: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { openApp } = useOsNote();
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
              <span className="font-bold text-cyan-400">ganos-sonoma</span>
            </div>
            <div className="text-white/30">---------------------------</div>
            <div>
              <span className="font-semibold text-amber-400">OS:</span> GanOS 15.4 (Sonoma Edition)
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
              <span className="font-semibold text-amber-400">Uptime:</span> 7 hours, 24 mins
            </div>
            <div>
              <span className="font-semibold text-amber-400">Shell:</span> zsh 5.9 (x86_64-apple-darwin23.0)
            </div>
            <div>
              <span className="font-semibold text-amber-400">Font:</span> Plus Jakarta Sans (Open Source)
            </div>
            <div>
              <span className="font-semibold text-amber-400">CPU:</span> Apple M3 Max (16-core)
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
