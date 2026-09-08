import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  Github,
  LockKeyhole,
  PlusIcon,
} from 'lucide-react';
import { PortfolioProject, featuredProjects } from '@/data/featuredProjects';
import { ProjectCover } from './ProjectCover';
import { Cursor } from '@/components/core/cursor';
import ScrollStack, { ScrollStackItem } from './ScrollStack';
import { TechBadge } from './TechBadge';

// ─── Project content block ────────────────────────────────────────────────────
function ProjectContent({ project }: { project: PortfolioProject }) {
  return (
    <div className="flex w-full flex-col justify-center gap-5 md:w-[48%]">
      {/* Meta row */}
      <div className="flex items-center gap-3">
        <span
          className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em]"
          style={{ color: project.color }}
        >
          {project.role}
        </span>
        <span className="h-px w-6 bg-border/60" />
        <span className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-widest">
          {project.year}
        </span>
        <span className="h-px w-6 bg-border/60" />
        <span className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-widest">
          {project.team.label}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-serif text-3xl font-bold leading-[1.0] tracking-tight text-foreground md:text-4xl">
        <Link
          to={`/projects/${project.slug}`}
          className="hover:text-primary transition-colors duration-300"
        >
          {project.title}
        </Link>
      </h3>

      {/* Summary */}
      <p className="text-sm leading-7 text-muted-foreground max-w-sm text-wrap-pretty">
        {project.summary}
      </p>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-1.5">
        {project.technologies.map((tech) => (
          <TechBadge key={tech} tech={tech} />
        ))}
      </div>

      {/* Action row */}
      <div className="flex items-center gap-3">
        {project.repository && (
          <a
            href={project.repository}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} GitHub`}
            className="grid size-11 md:size-10 place-items-center rounded-full border border-border/50 bg-secondary/40 text-muted-foreground/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary active:scale-[0.97]"
          >
            <Github className="size-4" strokeWidth={1.35} />
          </a>
        )}
        {project.visibility === 'private' && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/40 bg-secondary/40 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
            <LockKeyhole className="size-3" />
            Private
          </span>
        )}
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} live demo`}
            className="grid size-11 md:size-10 place-items-center rounded-full border border-border/50 bg-secondary/40 text-muted-foreground/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary active:scale-[0.97]"
          >
            <ExternalLink className="size-4" strokeWidth={1.35} />
          </a>
        )}

        {/* Case study CTA */}
        <Link
          to={`/projects/${project.slug}`}
          className="group ml-auto inline-flex items-center gap-2.5 glass-pill px-4 py-2 rounded-full font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-foreground transition-all duration-300 hover:scale-105 active:scale-95"
        >
          Case study
          <ArrowUpRight
            className="size-3.5 text-primary transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={1.6}
          />
        </Link>
      </div>
    </div>
  );
}

// ─── Stacked project card ─────────────────────────────────────────────────────
function StackedProject({
  project,
  index,
}: {
  project: PortfolioProject;
  index: number;
}) {
  return (
    <article
      className="group rounded-[2rem] border border-border/80 hover:border-primary/60 bg-card p-6 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.85)] relative overflow-hidden transition-all duration-500 md:p-10"
    >
      <div className="mb-6 flex items-center justify-between gap-4 border-b border-border/40 pb-4">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40">
          /{String(index + 1).padStart(2, '0')}
        </span>
        <span
          className="h-px flex-1 opacity-70"
          style={{ backgroundColor: project.color }}
          aria-hidden="true"
        />
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
          {project.visibility}
        </span>
      </div>

      <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
        <div className="relative w-full flex-shrink-0 md:w-[48%]">
          <Link
            to={`/projects/${project.slug}`}
            className="group/img relative block aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border/20 bg-card cursor-none"
            aria-label={`View ${project.title} case study`}
            tabIndex={-1}
          >
            <Cursor
              attachToParent
              variants={{
                initial: { scale: 0.2, opacity: 0 },
                animate: { scale: 1, opacity: 1 },
                exit: { scale: 0.2, opacity: 0 },
              }}
              springConfig={{
                damping: 24,
                stiffness: 320,
                mass: 0.4,
              }}
            >
              <div className="flex size-20 md:size-24 flex-col items-center justify-center rounded-full bg-[#D4FF00] text-black shadow-[0_12px_36px_rgba(212,255,0,0.35)] select-none">
                <ArrowUpRight className="size-4 md:size-5 stroke-[2.2] text-black mb-0.5" />
                <span className="text-[10px] md:text-[11px] font-sans font-semibold tracking-tight text-black text-center leading-none">
                  View Details
                </span>
              </div>
            </Cursor>
            <ProjectCover
              project={project}
              className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-premium group-hover/img:scale-[1.04]"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background/40 to-transparent" />
          </Link>
        </div>

        <ProjectContent project={project} />
      </div>
    </article>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export function ProjectsPreview() {
  return (
    <section id="projects" className="relative bg-transparent py-20 md:py-32">
      <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-24">
        {/* Section header */}
        <div className="mb-4 flex items-center justify-end">
          <Link
            to="/projects"
            className="group inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground transition-colors duration-300 hover:text-primary"
          >
            View all
            <ArrowRight
              className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
              strokeWidth={1.5}
            />
          </Link>
        </div>

        <h2 className="mb-4 font-serif text-4xl font-bold leading-[0.95] tracking-tight text-foreground md:text-6xl">
          Shipped, not sketched.
        </h2>

        <p className="mb-2 max-w-lg text-base leading-8 text-muted-foreground">
          Recent builds with real ownership: auth architecture, content systems,
          deployment flow, and UI delivery.
        </p>

        {/* Project stack */}
        <ScrollStack
          className="mt-12 md:mt-16"
          itemDistance={96}
          itemScale={0.035}
          itemStackDistance={36}
          stackPosition="18%"
          scaleEndPosition="8%"
          baseScale={0.86}
          rotationAmount={0}
          blurAmount={0}
          useWindowScroll
        >
          {featuredProjects.map((project, index) => (
            <ScrollStackItem key={project.slug} zIndex={index + 1}>
              <StackedProject project={project} index={index} />
            </ScrollStackItem>
          ))}
        </ScrollStack>

        {/* Bottom border cap */}
        <div className="border-t border-border/40" />
      </div>
    </section>
  );
}
