import { useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Folder,
  Github,
  Globe,
  Laptop,
  LayoutGrid,
  List,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  type SidebarSection,
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
} from '@/components/os/OsWindowChrome';
import { usePageMeta } from '@/hooks/usePageMeta';
import { featuredProjects, type PortfolioProject } from '@/data/featuredProjects';
import { profile } from '@/data/profile';

type ViewMode = 'grid' | 'list';

interface FolderMeta {
  id: string;
  label: string;
  filter: (project: PortfolioProject) => boolean;
}

const FOLDERS: Record<string, FolderMeta> = {
  recents: {
    id: 'recents',
    label: 'Recents',
    filter: (p) => Number(p.year) >= 2026,
  },
  all: {
    id: 'all',
    label: 'All Projects',
    filter: () => true,
  },
  public: {
    id: 'public',
    label: 'Open Source',
    filter: (p) => p.visibility === 'public',
  },
  live: {
    id: 'live',
    label: 'Live Deployments',
    filter: (p) => Boolean(p.demo),
  },
  ghufron: {
    id: 'ghufron',
    label: 'ghufron',
    filter: () => true,
  },
  'tag-typescript': {
    id: 'tag-typescript',
    label: 'TypeScript',
    filter: (p) => p.technologies.some((t) => t.toLowerCase().includes('typescript')),
  },
  'tag-react': {
    id: 'tag-react',
    label: 'React & Next.js',
    filter: (p) =>
      p.technologies.some((t) => {
        const lower = t.toLowerCase();
        return lower.includes('react') || lower.includes('next');
      }),
  },
  'tag-cloudflare': {
    id: 'tag-cloudflare',
    label: 'Cloudflare',
    filter: (p) => p.technologies.some((t) => t.toLowerCase().includes('cloudflare')),
  },
  'tag-laravel': {
    id: 'tag-laravel',
    label: 'Laravel & PHP',
    filter: (p) =>
      p.technologies.some((t) => {
        const lower = t.toLowerCase();
        return lower.includes('laravel') || lower.includes('php');
      }),
  },
  'tag-tailwind': {
    id: 'tag-tailwind',
    label: 'Tailwind CSS',
    filter: (p) => p.technologies.some((t) => t.toLowerCase().includes('tailwind')),
  },
};

const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    title: 'Favorites',
    items: [
      { id: 'recents', label: 'Recents', icon: <Clock className="h-4 w-4 text-[#0a84ff]" /> },
      { id: 'all', label: 'All Projects', icon: <Folder className="h-4 w-4 text-[#0a84ff]" /> },
      { id: 'live', label: 'Live Deployments', icon: <Globe className="h-4 w-4 text-[#0a84ff]" /> },
      { id: 'public', label: 'Open Source', icon: <Sparkles className="h-4 w-4 text-[#0a84ff]" /> },
    ],
  },
  {
    title: 'Locations',
    items: [
      { id: 'ghufron', label: 'ghufron', icon: <Laptop className="h-4 w-4 text-black/55 dark:text-white/60" /> },
    ],
  },
  {
    title: 'Tags',
    items: [
      { id: 'tag-typescript', label: 'TypeScript', dot: 'bg-[#0a84ff]' },
      { id: 'tag-react', label: 'React & Next.js', dot: 'bg-[#30d158]' },
      { id: 'tag-cloudflare', label: 'Cloudflare', dot: 'bg-[#ff9f0a]' },
      { id: 'tag-laravel', label: 'Laravel & PHP', dot: 'bg-[#ff453a]' },
      { id: 'tag-tailwind', label: 'Tailwind CSS', dot: 'bg-[#64d2ff]' },
    ],
  },
];

export default function Projects() {
  usePageMeta({
    title: `Projects — ${profile.name}`,
    description: `Browse web applications, APIs, and engineering case studies built by ${profile.name}.`,
    canonicalPath: '/projects',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `Projects — ${profile.name}`,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: featuredProjects.map((project, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: project.title,
          url: `${profile.website}/projects/${project.slug}`,
        })),
      },
    },
  });

  const navigate = useNavigate();

  const [history, setHistory] = useState<string[]>(['all']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const activeFolderId = history[historyIndex] ?? 'all';
  const activeFolder = FOLDERS[activeFolderId] ?? FOLDERS.all;

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    featuredProjects[0]?.slug ?? null,
  );

  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return featuredProjects.filter((project) => {
      if (!activeFolder.filter(project)) return false;
      if (!q) return true;
      return (
        project.title.toLowerCase().includes(q) ||
        project.summary.toLowerCase().includes(q) ||
        project.role.toLowerCase().includes(q) ||
        project.technologies.some((tech) => tech.toLowerCase().includes(q))
      );
    });
  }, [activeFolder, searchQuery]);

  // Keep selected item synchronized if filter excludes previous selection
  useEffect(() => {
    if (filteredProjects.length === 0) {
      setSelectedSlug(null);
      return;
    }
    if (!selectedSlug || !filteredProjects.some((p) => p.slug === selectedSlug)) {
      setSelectedSlug(filteredProjects[0].slug);
    }
  }, [filteredProjects, selectedSlug]);

  const selectedProject = useMemo(
    () => filteredProjects.find((p) => p.slug === selectedSlug) ?? null,
    [filteredProjects, selectedSlug],
  );

  const selectFolder = (folderId: string) => {
    if (folderId === activeFolderId) return;
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), folderId]);
    setHistoryIndex((prev) => prev + 1);
  };

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  const openProject = (slug: string) => {
    navigate(`/projects/${slug}`);
  };

  const handleItemClick = (project: PortfolioProject) => {
    setSelectedSlug(project.slug);
    if (typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches) {
      openProject(project.slug);
    }
  };

  return (
    <div className="flex h-full min-h-0">
      <Sidebar
        sections={SIDEBAR_SECTIONS}
        selectedId={activeFolderId}
        onSelect={selectFolder}
      />

      <div className="flex min-w-0 flex-1 flex-col bg-white text-black/85 dark:bg-[#282025] dark:text-white/90">
        <Toolbar
          leading={
            <div className="flex min-w-0 items-center gap-2.5">
              <ToolbarGroup>
                <ToolbarButton
                  title="Back"
                  disabled={!canGoBack}
                  onClick={() => canGoBack && setHistoryIndex((i) => i - 1)}
                  icon={<ChevronLeft className="h-4 w-4" />}
                />
                <ToolbarButton
                  title="Forward"
                  disabled={!canGoForward}
                  onClick={() => canGoForward && setHistoryIndex((i) => i + 1)}
                  icon={<ChevronRight className="h-4 w-4" />}
                />
              </ToolbarGroup>
              <span className="truncate text-[14px] font-semibold">
                {activeFolder.label}
              </span>
            </div>
          }
          trailing={
            <div className="flex items-center gap-2">
              {searchOpen ? (
                <div className="flex h-9 items-center gap-1.5 rounded-full bg-black/[0.06] px-3 dark:bg-white/[0.08]">
                  <Search className="h-3.5 w-3.5 text-black/45 dark:text-white/45" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search projects..."
                    autoFocus
                    className="w-28 bg-transparent text-[12.5px] outline-none placeholder:text-black/40 sm:w-40 dark:placeholder:text-white/35"
                  />
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => {
                      setSearchQuery('');
                      setSearchOpen(false);
                    }}
                    className="text-black/45 hover:text-black dark:text-white/45 dark:hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <ToolbarGroup>
                  <ToolbarButton
                    title="Search projects"
                    onClick={() => setSearchOpen(true)}
                    icon={<Search className="h-4 w-4" />}
                  />
                </ToolbarGroup>
              )}

              <ToolbarGroup>
                <ToolbarButton
                  title="Icon view"
                  isActive={viewMode === 'grid'}
                  onClick={() => setViewMode('grid')}
                  icon={<LayoutGrid className="h-4 w-4" />}
                />
                <ToolbarButton
                  title="List view"
                  isActive={viewMode === 'list'}
                  onClick={() => setViewMode('list')}
                  icon={<List className="h-4 w-4" />}
                />
              </ToolbarGroup>
            </div>
          }
        />

        <main className="flex min-h-0 flex-1">
          {/* File / Project items browser */}
          <div className="flex-1 overflow-y-auto p-4">
            {filteredProjects.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-[13px] text-black/45 dark:text-white/45">
                <Folder className="h-10 w-10 opacity-35" />
                <p>No projects match this filter.</p>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-[#0a84ff] hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {filteredProjects.map((project) => {
                  const isSelected = project.slug === selectedSlug;
                  return (
                    <button
                      key={project.slug}
                      type="button"
                      onClick={() => handleItemClick(project)}
                      onDoubleClick={() => openProject(project.slug)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          openProject(project.slug);
                        }
                      }}
                      className="group flex flex-col items-center gap-1.5 rounded-xl p-2 text-center focus:outline-none"
                    >
                      <div
                        className={[
                          'flex h-20 w-20 items-center justify-center rounded-xl transition-colors',
                          isSelected
                            ? 'bg-black/[0.08] ring-1 ring-black/10 dark:bg-white/[0.12] dark:ring-white/15'
                            : 'group-hover:bg-black/[0.04] dark:group-hover:bg-white/[0.05]',
                        ].join(' ')}
                      >
                        <img
                          src="/macos-icons/folder.png"
                          alt=""
                          draggable={false}
                          className="h-16 w-16 object-contain drop-shadow-sm"
                        />
                      </div>
                      <span
                        className={[
                          'line-clamp-2 max-w-[130px] rounded-[5px] px-1.5 py-0.5 text-[12px] font-medium leading-snug',
                          isSelected
                            ? 'bg-[#0a5bc2] text-white'
                            : 'text-black/85 dark:text-white/90',
                        ].join(' ')}
                      >
                        {project.title}
                      </span>
                      <span className="text-[11px] text-black/40 dark:text-white/40">
                        {project.year} · {project.visibility === 'public' ? 'Public' : 'Case Study'}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-0.5">
                <div className="grid grid-cols-[1fr_110px_70px] gap-2 border-b border-black/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-black/45 dark:border-white/[0.06] dark:text-white/40">
                  <span>Name</span>
                  <span>Kind</span>
                  <span className="text-right">Year</span>
                </div>
                {filteredProjects.map((project, index) => {
                  const isSelected = project.slug === selectedSlug;
                  return (
                    <button
                      key={project.slug}
                      type="button"
                      onClick={() => handleItemClick(project)}
                      onDoubleClick={() => openProject(project.slug)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          openProject(project.slug);
                        }
                      }}
                      className={[
                        'grid w-full grid-cols-[1fr_110px_70px] items-center gap-2 rounded-lg px-3 py-1.5 text-left text-[13px] transition-colors',
                        isSelected
                          ? 'bg-[#0a5bc2] text-white'
                          : index % 2 === 1
                            ? 'bg-black/[0.02] hover:bg-black/[0.05] dark:bg-white/[0.02] dark:hover:bg-white/[0.06]'
                            : 'hover:bg-black/[0.05] dark:hover:bg-white/[0.06]',
                      ].join(' ')}
                    >
                      <span className="flex min-w-0 items-center gap-2.5">
                        <img
                          src="/macos-icons/folder.png"
                          alt=""
                          className="h-5 w-5 shrink-0 object-contain"
                        />
                        <span className="truncate font-medium">{project.title}</span>
                      </span>
                      <span
                        className={[
                          'truncate text-[12px]',
                          isSelected ? 'text-white/85' : 'text-black/50 dark:text-white/50',
                        ].join(' ')}
                      >
                        {project.visibility === 'public' ? 'Open Source' : 'Client / App'}
                      </span>
                      <span
                        className={[
                          'text-right text-[12px]',
                          isSelected ? 'text-white/85' : 'text-black/50 dark:text-white/50',
                        ].join(' ')}
                      >
                        {project.year}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Preview Inspector */}
          <aside className="hidden w-64 shrink-0 flex-col justify-between overflow-y-auto border-l border-black/5 bg-[#f7f7f8]/75 p-4 lg:flex dark:border-white/[0.06] dark:bg-white/[0.02]">
            {selectedProject ? (
              <div className="space-y-4">
                <div className="flex flex-col items-center border-b border-black/5 pb-4 text-center dark:border-white/[0.07]">
                  {selectedProject.image ? (
                    <div className="h-28 w-full overflow-hidden rounded-lg bg-black/5 ring-1 ring-black/10 dark:bg-white/5 dark:ring-white/10">
                      <img
                        src={selectedProject.image}
                        alt={selectedProject.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <img
                      src="/macos-icons/folder.png"
                      alt=""
                      className="h-20 w-20 object-contain"
                    />
                  )}
                  <h2 className="mt-3 text-[14px] font-semibold leading-snug text-black/90 dark:text-white">
                    {selectedProject.title}
                  </h2>
                  <p className="mt-0.5 text-[11.5px] text-black/50 dark:text-white/50">
                    {selectedProject.role} · {selectedProject.year}
                  </p>
                </div>

                <p className="text-[12px] leading-relaxed text-black/70 dark:text-white/70">
                  {selectedProject.summary}
                </p>

                <div>
                  <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-black/45 dark:text-white/40">
                    Stack
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedProject.technologies.slice(0, 6).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-black/[0.06] px-1.5 py-0.5 text-[11px] text-black/75 dark:bg-white/[0.08] dark:text-white/80"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <Link
                    to={`/projects/${selectedProject.slug}`}
                    className="flex w-full items-center justify-center rounded-lg bg-[#0a84ff] px-3 py-1.5 text-[12.5px] font-medium text-white shadow-sm transition-opacity hover:opacity-90"
                  >
                    Open Case Study
                  </Link>
                  <div className="flex gap-1.5">
                    {selectedProject.demo && (
                      <a
                        href={selectedProject.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-black/[0.06] px-2.5 py-1.5 text-[12px] font-medium text-black/80 hover:bg-black/10 dark:bg-white/[0.08] dark:text-white/85 dark:hover:bg-white/15"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>Live</span>
                      </a>
                    )}
                    {selectedProject.repository && (
                      <a
                        href={selectedProject.repository}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-black/[0.06] px-2.5 py-1.5 text-[12px] font-medium text-black/80 hover:bg-black/10 dark:bg-white/[0.08] dark:text-white/85 dark:hover:bg-white/15"
                      >
                        <Github className="h-3.5 w-3.5" />
                        <span>Repo</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-center text-[12px] text-black/45 dark:text-white/45">
                Select a project folder to inspect its details.
              </div>
            )}
          </aside>
        </main>

        <footer className="flex h-6 shrink-0 items-center justify-between border-t border-black/5 px-3 text-[11px] text-black/45 dark:border-white/[0.06] dark:text-white/40">
          <span>
            {filteredProjects.length} {filteredProjects.length === 1 ? 'item' : 'items'}
          </span>
          <span className="hidden sm:inline">Double-click a folder to open case study</span>
        </footer>
      </div>
    </div>
  );
}
