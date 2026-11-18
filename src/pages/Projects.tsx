import { useMemo, useState } from 'react';
import { ArrowUpRight, BriefcaseBusiness, Code2, Folder, FolderOpen, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

import { featuredProjects } from '@/data/featuredProjects';
import { sideProjects } from '@/data/sideProjects';
import { usePageMeta } from '@/hooks/usePageMeta';

type ProjectFilter = 'all' | 'featured' | 'side';

const filterLabels: Record<ProjectFilter, string> = {
  all: 'All Projects',
  featured: 'Case Studies',
  side: 'Side Projects',
};

const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--os-accent-hover)]';

export default function Projects() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<ProjectFilter>('all');

  usePageMeta({
    title: 'Projects | Ghufron Ainun Najib — Full-Stack Developer',
    description:
      'Selected case studies and side projects by Ghufron Ainun Najib across web, mobile, cloud, computer vision, and IoT.',
    canonicalPath: '/projects',
    jsonLd: [
      {
        '@type': 'CollectionPage',
        name: 'Projects — Ghufron Ainun Najib',
        url: 'https://ghufronainun.tech/projects',
        description: 'Portfolio of software engineering projects by Ghufron Ainun Najib',
      },
      {
        '@type': 'ItemList',
        name: 'Featured Projects',
        itemListElement: featuredProjects.map((project, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: project.title,
          url: `https://ghufronainun.tech/projects/${project.slug}`,
        })),
      },
    ],
  });

  const normalizedQuery = query.trim().toLowerCase();
  const visibleFeatured = useMemo(
    () => filter === 'side' ? [] : featuredProjects.filter((project) =>
      [project.title, project.summary, project.year, project.role, ...project.technologies]
        .join(' ').toLowerCase().includes(normalizedQuery),
    ),
    [filter, normalizedQuery],
  );
  const visibleSide = useMemo(
    () => filter === 'featured' ? [] : sideProjects.filter((project) =>
      [project.title, project.category, project.description, project.year, ...project.technologies]
        .join(' ').toLowerCase().includes(normalizedQuery),
    ),
    [filter, normalizedQuery],
  );
  const resultCount = visibleFeatured.length + visibleSide.length;

  return (
    <main className="[.os-window--maximized_&]:min-h-[calc(100vh-73px)] flex min-h-0 w-full min-w-0 flex-1 flex-col bg-[var(--os-panel)] text-[var(--os-text-primary)]">
      <header className="border-b border-[var(--os-border)] bg-[var(--os-raised)]/80 px-3 py-3 backdrop-blur-xl sm:px-5">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <div className="flex shrink-0 items-center gap-2" aria-hidden="true">
            <span className="grid size-8 place-items-center rounded-lg bg-[var(--os-accent-soft)] text-[var(--os-accent-link)]"><FolderOpen className="size-[17px]" /></span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[9px] uppercase tracking-[0.17em] text-[var(--os-text-secondary)]">Ghufron OS <span className="px-1 text-[var(--os-border)]">/</span> Finder</p>
            <h1 className="truncate text-lg font-semibold leading-tight sm:text-xl">{filterLabels[filter]}</h1>
          </div>
          <label className="flex h-9 w-full items-center gap-2 rounded-lg border border-[var(--os-border)] bg-black/15 px-2.5 text-[var(--os-text-secondary)] transition-colors focus-within:border-[var(--os-accent-solid)] sm:w-56">
            <Search aria-hidden="true" className="size-3.5 shrink-0" />
            <span className="sr-only">Search projects and technologies</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search projects"
              className="min-w-0 flex-1 bg-transparent text-xs text-[var(--os-text-primary)] outline-none placeholder:text-[var(--os-text-secondary)]"
            />
          </label>
        </div>
      </header>

      <div className="grid w-full min-h-0 flex-1 md:grid-cols-[176px_minmax(0,1fr)]">
        <aside className="border-b border-[var(--os-border)] bg-white/[0.025] p-3 backdrop-blur-md md:border-b-0 md:border-r md:p-4" aria-label="Project folders">
          <p className="hidden px-2 pb-2 font-mono text-[9px] font-medium uppercase tracking-[0.16em] text-[var(--os-text-secondary)] md:block">Favorites</p>
          <nav aria-label="Filter projects" className="flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-col">
            {(Object.keys(filterLabels) as ProjectFilter[]).map((value) => {
              const Icon = value === 'all' ? Folder : value === 'featured' ? BriefcaseBusiness : Code2;
              const count = value === 'all' ? featuredProjects.length + sideProjects.length : value === 'featured' ? featuredProjects.length : sideProjects.length;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value)}
                  aria-pressed={filter === value}
                  className={`flex min-h-9 shrink-0 items-center gap-2 rounded-lg px-2.5 text-left text-xs transition-colors ${focusRing} ${filter === value ? 'bg-[var(--os-accent-soft)] font-medium text-[var(--os-accent-link)]' : 'text-[var(--os-text-secondary)] hover:bg-white/[0.06] hover:text-[var(--os-text-primary)]'}`}
                >
                  <Icon aria-hidden="true" className="size-4 shrink-0" />
                  <span className="flex-1">{filterLabels[value]}</span>
                  <span className="font-mono text-[10px] opacity-75">{count}</span>
                </button>
              );
            })}
          </nav>
          <div className="mt-5 hidden border-t border-[var(--os-border)] pt-4 md:block">
            <p className="px-2 font-mono text-[9px] font-medium uppercase tracking-[0.16em] text-[var(--os-text-secondary)]">On this Mac</p>
            <p className="mt-2 flex items-center gap-2 px-2 text-xs text-[var(--os-text-secondary)]"><FolderOpen aria-hidden="true" className="size-4 text-[var(--os-accent-link)]" />Portfolio</p>
          </div>
        </aside>

        <section className="flex min-w-0 flex-col" aria-label="Project directory">
          <div className="flex min-w-0 items-center justify-between gap-3 border-b border-[var(--os-border)] px-4 py-2.5 sm:px-5">
            <div className="flex min-w-0 items-center gap-2 text-xs text-[var(--os-text-secondary)]">
              <FolderOpen aria-hidden="true" className="size-4 shrink-0 text-[var(--os-accent-link)]" />
              <span className="truncate">Portfolio</span><span aria-hidden="true">›</span><span className="truncate text-[var(--os-text-primary)]">{filterLabels[filter]}</span>
            </div>
            <span className="shrink-0 font-mono text-[10px] text-[var(--os-text-secondary)]" aria-live="polite">{resultCount} items</span>
          </div>

          {resultCount === 0 ? (
            <div className="px-5 py-14 text-center">
              <Folder aria-hidden="true" className="mx-auto size-8 text-[var(--os-text-secondary)]" />
              <p className="mt-3 text-sm text-[var(--os-text-secondary)]">No projects match “{query}”.</p>
              <button type="button" onClick={() => { setQuery(''); setFilter('all'); }} className={`mt-3 min-h-9 rounded-lg px-3 text-xs text-[var(--os-accent-link)] hover:bg-white/[0.06] ${focusRing}`}>Clear search and filters</button>
            </div>
          ) : (
            <div className="grid min-w-0 grid-cols-2 gap-x-2 gap-y-4 p-3 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-5 sm:p-5 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {visibleFeatured.map((project) => (
                <article key={project.slug} className="group flex min-w-0 flex-col items-center rounded-xl p-2 text-center transition-colors hover:bg-[var(--os-accent-soft)]/35 sm:p-3">
                  <Link to={`/projects/${project.slug}`} aria-label={`Open ${project.title} case study`} className={`flex w-full min-w-0 flex-col items-center rounded-lg ${focusRing}`}>
                    <Folder aria-hidden="true" className="size-[68px] text-[var(--os-accent-link)] drop-shadow-[0_4px_8px_rgba(0,0,0,.2)] transition-transform group-hover:-translate-y-0.5 sm:size-[76px]" fill="currentColor" strokeWidth={1.25} />
                    <h2 className="mt-2 min-h-10 w-full break-words text-[11px] font-medium leading-5 text-[var(--os-text-primary)] group-hover:text-[var(--os-accent-link)] sm:text-xs">{project.title}</h2>
                  </Link>
                  <p className="mt-1 text-[10px] text-[var(--os-text-secondary)]">{project.year} <span className="px-0.5 text-[var(--os-border)]">·</span> Case study</p>
                </article>
              ))}
              {visibleSide.map((project) => (
                <article key={project.title} className="group flex min-w-0 flex-col items-center rounded-xl p-2 text-center transition-colors hover:bg-[var(--os-accent-soft)]/35 sm:p-3">
                  <Folder aria-hidden="true" className="size-[68px] text-[var(--os-accent-link)] drop-shadow-[0_4px_8px_rgba(0,0,0,.2)] transition-transform group-hover:-translate-y-0.5 sm:size-[76px]" fill="currentColor" strokeWidth={1.25} />
                  <h2 className="mt-2 min-h-10 w-full break-words text-[11px] font-medium leading-5 text-[var(--os-text-primary)] sm:text-xs">{project.title}</h2>
                  <p className="mt-1 text-[10px] text-[var(--os-text-secondary)]">{project.year} <span className="px-0.5 text-[var(--os-border)]">·</span> Side project</p>
                  <div className="mt-2 flex flex-wrap justify-center gap-x-2 gap-y-1">
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className={`text-[10px] text-[var(--os-accent-link)] hover:underline ${focusRing}`}>Source <ArrowUpRight aria-hidden="true" className="inline size-3" /></a>
                    {project.demo && <a href={project.demo} target="_blank" rel="noopener noreferrer" className={`text-[10px] text-[var(--os-accent-link)] hover:underline ${focusRing}`}>Demo <ArrowUpRight aria-hidden="true" className="inline size-3" /></a>}
                  </div>
                </article>
              ))}
            </div>
          )}

          <footer className="mt-auto flex items-center justify-between gap-3 border-t border-[var(--os-border)] px-4 py-2.5 text-[10px] text-[var(--os-text-secondary)] sm:px-5">
            <span>{resultCount} items</span><span className="font-mono">Portfolio · {filterLabels[filter]}</span>
          </footer>
        </section>
      </div>
    </main>
  );
}
