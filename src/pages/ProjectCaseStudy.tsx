import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  Github,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { ProjectCover } from '@/components/ProjectCover';
import { TechBadge } from '@/components/TechBadge';
import { Toolbar } from '@/components/os/OsWindowChrome';
import { featuredProjects, getPortfolioProject } from '@/data/featuredProjects';
import { usePageMeta } from '@/hooks/usePageMeta';

function ProjectLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-black/10 bg-black/[0.04] px-3.5 text-[13px] font-medium text-black/85 transition-colors hover:border-[#0a84ff] hover:bg-[#0a84ff]/10 hover:text-[#0a84ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a84ff] dark:border-white/10 dark:bg-white/[0.06] dark:text-white/90"
    >
      {children}
      <ArrowUpRight aria-hidden="true" className="size-3.5" />
    </a>
  );
}

function CaseStudyView({ slug }: { slug: string }) {
  const project = getPortfolioProject(slug);
  const projectIndex = project
    ? featuredProjects.findIndex((item) => item.slug === project.slug)
    : -1;
  const previous =
    projectIndex > 0 ? featuredProjects[projectIndex - 1] : undefined;
  const next =
    projectIndex >= 0 ? featuredProjects[projectIndex + 1] : undefined;

  usePageMeta({
    title: project
      ? `${project.title} | Ghufron Ainun Najib`
      : 'Project | Ghufron Ainun Najib',
    description:
      project?.summary ??
      'Case study from the portfolio of Ghufron Ainun Najib.',
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
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://ghufronainun.tech/',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Projects',
                item: 'https://ghufronainun.tech/projects',
              },
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
      <div className="flex h-full flex-col bg-white text-black/85 dark:bg-[#282025] dark:text-white/90">
        <Toolbar
          hasControls
          leading={
            <Link
              to="/projects"
              className="inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-[13px] font-medium text-black/65 transition-colors hover:bg-black/[0.06] hover:text-[#0a84ff] dark:text-white/70 dark:hover:bg-white/[0.08]"
            >
              <ArrowLeft aria-hidden="true" className="size-3.5" />
              <span>Projects</span>
            </Link>
          }
          title="Not Found"
          centerTitle
        />
        <main className="grid flex-1 place-items-center px-5 py-12 text-center">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#0a84ff]">
              Project not found
            </p>
            <h1 className="mt-2 text-xl font-semibold">
              This project isn’t in the index.
            </h1>
            <p className="mt-2 text-sm text-black/55 dark:text-white/55">
              Check the address or return to the project list.
            </p>
            <Link
              to="/projects"
              className="mt-5 inline-flex min-h-9 items-center gap-2 rounded-lg bg-[#0a84ff] px-3.5 text-sm font-medium text-white shadow-sm hover:opacity-90"
            >
              <ArrowLeft aria-hidden="true" className="size-4" /> Browse all
              projects
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const gallery = [...new Set(project.gallery ?? [])].filter(
    (image) => image !== project.image
  );

  return (
    <div className="flex h-full flex-col bg-white text-black/85 dark:bg-[#282025] dark:text-white/90">
      <Toolbar
        hasControls
        leading={
          <Link
            to="/projects"
            className="inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-[13px] font-medium text-black/65 transition-colors hover:bg-black/[0.06] hover:text-[#0a84ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a84ff] dark:text-white/75 dark:hover:bg-white/[0.08]"
          >
            <ArrowLeft aria-hidden="true" className="size-3.5" />
            <span>All projects</span>
          </Link>
        }
        trailing={
          <span className="hidden truncate font-mono text-[11px] text-black/45 sm:inline dark:text-white/45">
            Project file / {project.slug}
          </span>
        }
      />

      <main className="min-h-0 w-full min-w-0 max-w-full flex-1 overflow-y-auto px-5 pb-8 pt-2 sm:px-8">
        <div className="mx-auto min-w-0 max-w-5xl pb-6">
          <header className="grid gap-6 border-b border-black/10 py-6 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-end dark:border-white/10">
            <div className="min-w-0">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-[#0a84ff]">
                {project.year}{' '}
                <span className="px-1 text-black/40 dark:text-white/40">/</span>{' '}
                {project.role}
              </p>
              <h1 className="mt-2.5 max-w-4xl text-2xl font-semibold leading-tight tracking-tight text-black/90 sm:text-3xl lg:text-4xl dark:text-white">
                {project.title}
              </h1>
              <p className="mt-3 max-w-3xl text-[15px] leading-7 text-black/65 dark:text-white/65">
                {project.summary}
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-2.5 lg:grid-cols-1">
              <div className="rounded-xl border border-black/10 bg-[#f7f7f8] px-3.5 py-3 dark:border-white/10 dark:bg-white/[0.04]">
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-black/45 dark:text-white/45">
                  Team
                </dt>
                <dd className="mt-1 text-sm font-medium text-black/85 dark:text-white/90">
                  {project.team.label}
                </dd>
              </div>
              <div className="rounded-xl border border-black/10 bg-[#f7f7f8] px-3.5 py-3 dark:border-white/10 dark:bg-white/[0.04]">
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-black/45 dark:text-white/45">
                  Source visibility
                </dt>
                <dd className="mt-1 text-sm font-medium capitalize text-black/85 dark:text-white/90">
                  {project.visibility}
                </dd>
              </div>
            </dl>
          </header>

          <section
            aria-label={`${project.title} preview`}
            className="mt-6 overflow-hidden rounded-xl border border-black/10 bg-black/5 dark:border-white/10 dark:bg-black/25"
          >
            <ProjectCover
              project={project}
              className="aspect-[16/8] max-h-[28rem] w-full"
            />
          </section>

          <section className="grid min-w-0 gap-8 border-b border-black/10 py-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12 dark:border-white/10">
            <div className="min-w-0">
              <h2 className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.17em] text-[#0a84ff]">
                Project context
              </h2>
              <p className="mt-3 text-[15px] leading-7 text-black/80 dark:text-white/85">
                {project.problem}
              </p>
              <h3 className="mt-6 font-mono text-[10.5px] font-semibold uppercase tracking-[0.17em] text-black/50 dark:text-white/50">
                Technologies
              </h3>
              <div
                className="mt-3 flex flex-wrap gap-1.5"
                aria-label="Technologies"
              >
                {project.technologies.map((technology) => (
                  <TechBadge
                    key={technology}
                    tech={technology}
                    showIcon={false}
                    className="!border-black/10 !bg-black/[0.04] !text-black/75 dark:!border-white/10 dark:!bg-white/[0.07] dark:!text-white/80"
                  />
                ))}
              </div>
            </div>

            <div className="grid min-w-0 gap-7 sm:grid-cols-2">
              <section aria-labelledby="contributions-heading">
                <h2
                  id="contributions-heading"
                  className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.17em] text-[#0a84ff]"
                >
                  Contributions
                </h2>
                <ul className="mt-3 space-y-3">
                  {project.contributions.map((item) => (
                    <li
                      key={item}
                      className="border-l-2 border-black/10 pl-3 text-[13.5px] leading-6 text-black/65 dark:border-white/15 dark:text-white/70"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
              <section aria-labelledby="outcomes-heading">
                <h2
                  id="outcomes-heading"
                  className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.17em] text-[#0a84ff]"
                >
                  Outcomes
                </h2>
                <ul className="mt-3 space-y-3">
                  {project.outcomes.map((item) => (
                    <li
                      key={item}
                      className="border-l-2 border-black/10 pl-3 text-[13.5px] leading-6 text-black/65 dark:border-white/15 dark:text-white/70"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </section>

          {gallery.length > 0 && (
            <section
              aria-label={`${project.title} screenshots`}
              className="grid min-w-0 gap-3 border-b border-black/10 py-6 sm:grid-cols-2 dark:border-white/10"
            >
              <h2 className="sr-only">Screenshots</h2>
              {gallery.map((image, index) => (
                <img
                  key={image}
                  src={image}
                  alt={`${project.title} screenshot ${index + 1}`}
                  loading="lazy"
                  className="aspect-[16/10] w-full rounded-xl border border-black/10 object-cover object-top dark:border-white/10"
                />
              ))}
            </section>
          )}

          {(project.repository || project.demo) && (
            <section className="flex flex-col gap-3 border-b border-black/10 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
              <div>
                <h2 className="text-sm font-semibold">Project links</h2>
                <p className="mt-0.5 text-[13px] text-black/55 dark:text-white/55">
                  Available destinations for this project.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.repository && (
                  <ProjectLink href={project.repository}>
                    <Github aria-hidden="true" className="size-4" /> Repository
                  </ProjectLink>
                )}
                {project.demo && (
                  <ProjectLink href={project.demo}>
                    <ExternalLink aria-hidden="true" className="size-4" /> Live
                    demo
                  </ProjectLink>
                )}
              </div>
            </section>
          )}

          <nav
            aria-label="Adjacent projects"
            className="flex min-w-0 items-center justify-between gap-4 pt-5"
          >
            {previous ? (
              <Link
                to={`/projects/${previous.slug}`}
                className="group min-w-0 rounded-lg px-2 py-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a84ff]"
              >
                <span className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-wider text-black/45 dark:text-white/45">
                  <ArrowLeft aria-hidden="true" className="size-3" /> Previous
                </span>
                <span className="mt-1 block truncate text-sm font-medium text-black/85 group-hover:text-[#0a84ff] dark:text-white/90">
                  {previous.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                to={`/projects/${next.slug}`}
                className="group min-w-0 rounded-lg px-2 py-2 text-right focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a84ff]"
              >
                <span className="flex items-center justify-end gap-1.5 text-[10.5px] uppercase tracking-wider text-black/45 dark:text-white/45">
                  Next <ArrowRight aria-hidden="true" className="size-3" />
                </span>
                <span className="mt-1 block truncate text-sm font-medium text-black/85 group-hover:text-[#0a84ff] dark:text-white/90">
                  {next.title}
                </span>
              </Link>
            )}
          </nav>
        </div>
      </main>
    </div>
  );
}

export default function ProjectCaseStudy() {
  const { slug = '' } = useParams();
  return <CaseStudyView slug={slug} />;
}
