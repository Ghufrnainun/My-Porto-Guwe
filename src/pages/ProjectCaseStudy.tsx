import { ArrowLeft, ArrowRight, ArrowUpRight, ExternalLink, Github } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { ProjectCover } from '@/components/ProjectCover';
import { TechBadge } from '@/components/TechBadge';
import { featuredProjects, getPortfolioProject } from '@/data/featuredProjects';
import { usePageMeta } from '@/hooks/usePageMeta';

function ProjectLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[var(--os-border)] bg-white/[0.035] px-3.5 text-sm text-[var(--os-text-primary)] transition-colors hover:border-[var(--os-accent-solid)] hover:bg-[var(--os-accent-soft)] hover:text-[var(--os-accent-link)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2385D9]"
    >
      {children}
      <ArrowUpRight aria-hidden="true" className="size-3.5" />
    </a>
  );
}

function CaseStudyView({ slug }: { slug: string }) {
  const project = getPortfolioProject(slug);
  const projectIndex = project ? featuredProjects.findIndex((item) => item.slug === project.slug) : -1;
  const previous = projectIndex > 0 ? featuredProjects[projectIndex - 1] : undefined;
  const next = projectIndex >= 0 ? featuredProjects[projectIndex + 1] : undefined;

  usePageMeta({
    title: project ? `${project.title} | Ghufron Ainun Najib` : 'Project | Ghufron Ainun Najib',
    description: project?.summary ?? 'Case study from the portfolio of Ghufron Ainun Najib.',
    canonicalPath: project ? `/projects/${project.slug}` : '/projects',
    ogImage: project?.image,
    jsonLd: project
      ? [
          {
            '@type': ['CreativeWork', 'SoftwareApplication'],
            name: project.title,
            description: project.summary,
            url: `https://ghufronainun.tech/projects/${project.slug}`,
            applicationCategory: 'DeveloperApplication',
            image: project.image
              ? /^https?:\/\//.test(project.image)
                ? project.image
                : `https://ghufronainun.tech${project.image}`
              : undefined,
            author: {
              '@type': 'Person',
              name: 'Ghufron Ainun Najib',
              url: 'https://ghufronainun.tech',
            },
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ghufronainun.tech/' },
              { '@type': 'ListItem', position: 2, name: 'Projects', item: 'https://ghufronainun.tech/projects' },
              {
                '@type': 'ListItem',
                position: 3,
                name: project.title,
                item: `https://ghufronainun.tech/projects/${project.slug}`,
              },
            ],
          },
        ]
      : undefined,
  });

  if (!project) {
    return (
      <main className="grid min-h-72 place-items-center bg-[var(--os-panel)] px-5 py-12 text-center text-[var(--os-text-primary)]">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--os-accent-link)]">Project not found</p>
          <h1 className="mt-2 text-xl font-semibold">This project isn’t in the index.</h1>
          <p className="mt-2 text-sm text-[var(--os-text-secondary)]">Check the address or return to the project list.</p>
          <Link to="/projects" className="mt-5 inline-flex min-h-9 items-center gap-2 rounded-lg px-3 text-sm text-[var(--os-accent-link)] hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2385D9]">
            <ArrowLeft aria-hidden="true" className="size-4" /> Browse all projects
          </Link>
        </div>
      </main>
    );
  }

  const gallery = [...new Set(project.gallery ?? [])].filter((image) => image !== project.image);

  return (
    <main className="min-h-0 w-full min-w-0 max-w-full bg-[var(--os-panel)] px-4 py-5 text-[var(--os-text-primary)] sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto min-w-0 max-w-6xl pb-6">
        <nav aria-label="Project navigation" className="flex min-w-0 items-center justify-between gap-4 border-b border-[var(--os-border)] pb-4">
          <Link to="/projects" className="inline-flex min-h-9 items-center gap-2 rounded-lg px-2 text-sm text-[var(--os-text-secondary)] transition-colors hover:bg-white/[0.05] hover:text-[var(--os-accent-link)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2385D9]">
            <ArrowLeft aria-hidden="true" className="size-3.5" /> All projects
          </Link>
          <span className="min-w-0 truncate text-right font-mono text-[10px] text-[var(--os-text-secondary)]">Project file / {project.slug}</span>
        </nav>

        <header className="grid gap-6 py-7 sm:py-8 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-end lg:py-9">
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--os-accent-link)]">{project.year} <span className="px-1 text-[var(--os-text-secondary)]">/</span> {project.role}</p>
            <h1 className="mt-3 max-w-4xl text-2xl font-semibold leading-tight tracking-tight sm:text-3xl lg:text-4xl">{project.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--os-text-secondary)]">{project.summary}</p>
          </div>
          <dl className="grid grid-cols-2 gap-2 lg:grid-cols-1">
            <div className="rounded-[10px] border border-[var(--os-border)] bg-[var(--os-raised)] px-3.5 py-3">
              <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--os-text-secondary)]">Team</dt>
              <dd className="mt-1 text-sm font-medium">{project.team.label}</dd>
            </div>
            <div className="rounded-[10px] border border-[var(--os-border)] bg-[var(--os-raised)] px-3.5 py-3">
              <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--os-text-secondary)]">Source visibility</dt>
              <dd className="mt-1 text-sm font-medium capitalize">{project.visibility}</dd>
            </div>
          </dl>
        </header>

        <section aria-label={`${project.title} preview`} className="overflow-hidden rounded-[10px] border border-[var(--os-border)] bg-black/20">
          <ProjectCover project={project} className="aspect-[16/8] max-h-[28rem] w-full" />
        </section>

        <section className="grid min-w-0 gap-8 border-b border-[var(--os-border)] py-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12">
          <div className="min-w-0">
            <h2 className="font-mono text-[10px] font-medium uppercase tracking-[0.17em] text-[var(--os-accent-link)]">Project context</h2>
            <p className="mt-3 text-base leading-7 text-[var(--os-text-primary)]">{project.problem}</p>
            <h3 className="mt-6 font-mono text-[10px] font-medium uppercase tracking-[0.17em] text-[var(--os-text-secondary)]">Technologies</h3>
            <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Technologies">
              {project.technologies.map((technology) => <TechBadge key={technology} tech={technology} showIcon={false} />)}
            </div>
          </div>
          <div className="grid min-w-0 gap-7 sm:grid-cols-2">
            <section aria-labelledby="contributions-heading">
              <h2 id="contributions-heading" className="font-mono text-[10px] font-medium uppercase tracking-[0.17em] text-[var(--os-accent-link)]">Contributions</h2>
              <ul className="mt-3 space-y-3">
                {project.contributions.map((item) => <li key={item} className="border-l-2 border-[var(--os-border)] pl-3 text-sm leading-6 text-[var(--os-text-secondary)]">{item}</li>)}
              </ul>
            </section>
            <section aria-labelledby="outcomes-heading">
              <h2 id="outcomes-heading" className="font-mono text-[10px] font-medium uppercase tracking-[0.17em] text-[var(--os-accent-link)]">Outcomes</h2>
              <ul className="mt-3 space-y-3">
                {project.outcomes.map((item) => <li key={item} className="border-l-2 border-[var(--os-border)] pl-3 text-sm leading-6 text-[var(--os-text-secondary)]">{item}</li>)}
              </ul>
            </section>
          </div>
        </section>

        {gallery.length > 0 && (
          <section aria-label={`${project.title} screenshots`} className="grid min-w-0 gap-3 border-b border-[var(--os-border)] py-6 sm:grid-cols-2">
            <h2 className="sr-only">Screenshots</h2>
            {gallery.map((image, index) => (
              <img key={image} src={image} alt={`${project.title} screenshot ${index + 1}`} loading="lazy" className="aspect-[16/10] w-full rounded-[10px] border border-[var(--os-border)] object-cover object-top" />
            ))}
          </section>
        )}

        {(project.repository || project.demo) && (
          <section className="flex flex-col gap-3 border-b border-[var(--os-border)] py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-medium">Project links</h2>
              <p className="mt-1 text-sm text-[var(--os-text-secondary)]">Available destinations for this project.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.repository && <ProjectLink href={project.repository}><Github aria-hidden="true" className="size-4" /> Repository</ProjectLink>}
              {project.demo && <ProjectLink href={project.demo}><ExternalLink aria-hidden="true" className="size-4" /> Live demo</ProjectLink>}
            </div>
          </section>
        )}

        <nav aria-label="Adjacent projects" className="flex min-w-0 items-center justify-between gap-4 border-t border-[var(--os-border)] pt-5">
          {previous ? (
            <Link to={`/projects/${previous.slug}`} className="group min-w-0 rounded-lg px-2 py-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2385D9]">
              <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[var(--os-text-secondary)]"><ArrowLeft aria-hidden="true" className="size-3" /> Previous</span>
              <span className="mt-1 block truncate text-sm text-[var(--os-text-primary)] group-hover:text-[var(--os-accent-link)]">{previous.title}</span>
            </Link>
          ) : <span />}
          {next && (
            <Link to={`/projects/${next.slug}`} className="group min-w-0 rounded-lg px-2 py-2 text-right focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2385D9]">
              <span className="flex items-center justify-end gap-1.5 text-[10px] uppercase tracking-wider text-[var(--os-text-secondary)]">Next <ArrowRight aria-hidden="true" className="size-3" /></span>
              <span className="mt-1 block truncate text-sm text-[var(--os-text-primary)] group-hover:text-[var(--os-accent-link)]">{next.title}</span>
            </Link>
          )}
        </nav>
      </div>
    </main>
  );
}

export default function ProjectCaseStudy() {
  const { slug = '' } = useParams();
  return <CaseStudyView slug={slug} />;
}
