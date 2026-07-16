import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ExternalLink, Github } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ProjectModal } from './ProjectModal';
import {
  FeaturedProject,
  featuredProjects,
} from '@/data/featuredProjects';

const springEase = [0.32, 0.72, 0, 1] as const;
const cascadePositions = [
  {
    rotation: 'lg:-rotate-[1.2deg]',
    offset: 'lg:translate-y-8 lg:translate-x-2',
  },
  {
    rotation: 'lg:rotate-[1.2deg]',
    offset: 'lg:-translate-y-4 lg:-translate-x-2',
  },
  {
    rotation: 'lg:rotate-[0.8deg]',
    offset: 'lg:translate-y-0 lg:translate-x-8',
  },
  {
    rotation: 'lg:-rotate-[0.8deg]',
    offset: 'lg:translate-y-12 lg:-translate-x-8',
  },
];

function ProjectLinks({ project }: { project: FeaturedProject }) {
  return (
    <div className="flex items-center gap-2">
      <a
        href={project.github}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${project.title} GitHub`}
        className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-foreground/70 transition-all duration-500 ease-premium hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary active:scale-[0.98]"
      >
        <Github className="size-4" strokeWidth={1.35} />
      </a>
      {project.demo && (
        <a
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.title} live demo`}
          className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-foreground/70 transition-all duration-500 ease-premium hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary active:scale-[0.98]"
        >
          <ExternalLink className="size-4" strokeWidth={1.35} />
        </a>
      )}
    </div>
  );
}

function DetailsButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary px-3 py-2 pl-5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-primary-foreground shadow-[0_18px_60px_-24px_hsl(var(--primary)/0.8)] transition-all duration-700 ease-premium hover:-translate-y-0.5 hover:bg-primary/90 active:scale-[0.98]"
    >
      <span>Open</span>
      <span className="grid size-8 place-items-center rounded-full bg-background/90 text-primary transition-transform duration-700 ease-premium group-hover:translate-x-1 group-hover:-translate-y-0.5">
        <ArrowUpRight className="size-3.5" strokeWidth={1.6} />
      </span>
    </button>
  );
}

function CascadeProjectCard({
  project,
  index,
  onOpen,
}: {
  project: FeaturedProject;
  index: number;
  onOpen: (project: FeaturedProject) => void;
}) {
  const position = cascadePositions[index % cascadePositions.length];

  return (
    <motion.article
      initial={{ opacity: 0, y: 56, filter: 'blur(14px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.85, delay: index * 0.12, ease: springEase }}
      className={`group relative ${position.offset}`}
      style={{ zIndex: cascadePositions.length - (index % cascadePositions.length) }}
    >
      <div
        className={`rounded-[2.4rem] border border-white/10 bg-white/[0.055] p-2 shadow-[0_45px_130px_-78px_hsl(var(--primary)/0.75)] transition-all duration-700 ease-premium ${position.rotation} group-hover:rotate-0 group-hover:-translate-y-3`}
      >
        <div className="overflow-hidden rounded-[calc(2.4rem-0.5rem)] border border-white/10 bg-card shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]">
          <button
            type="button"
            onClick={() => onOpen(project)}
            className="relative block aspect-[4/3] w-full overflow-hidden text-left"
          >
            <img
              src={project.image}
              alt={project.title}
              className="absolute inset-0 size-full object-cover transition-transform duration-1000 ease-premium group-hover:scale-105"
              loading="lazy"
            />
            <div
              className="absolute inset-0 opacity-60 mix-blend-screen"
              style={{
                background: `radial-gradient(circle at 80% 15%, ${project.color}55, transparent 34%)`,
              }}
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/90 to-transparent" />
            <span className="absolute left-5 top-5 rounded-full border border-white/15 bg-background/45 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/80">
              /{String(index + 1).padStart(2, '0')}
            </span>
          </button>

          <div className="p-6 md:p-7">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                  {project.role}
                </p>
                <h3 className="mt-3 font-serif text-3xl font-bold leading-[0.98] text-foreground md:text-4xl">
                  {project.title}
                </h3>
              </div>
              <ProjectLinks project={project} />
            </div>

            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              {project.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {project.metric} / {project.year}
              </div>
              <DetailsButton onClick={() => onOpen(project)} />
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function ProjectsPreview() {
  const [modalProject, setModalProject] = useState<FeaturedProject | null>(
    null,
  );

  return (
    <section
      id="projects"
      className="relative bg-transparent py-16 md:py-24"
    >
      <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 34, filter: 'blur(12px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: springEase }}
          className="mb-14 flex flex-col gap-7 md:mb-20 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <span className="inline-flex w-fit rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
              Selected works
            </span>
            <h2 className="mt-6 max-w-3xl font-serif text-5xl font-bold leading-[0.95] tracking-tight text-foreground md:text-7xl md:leading-[0.9]">
              Projects with more depth.
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-base leading-8 text-muted-foreground md:text-lg">
              Recent builds with real ownership: auth architecture, content
              systems, deployment flow, and UI delivery.
            </p>
            <Link
              to="/projects"
              className="group mt-7 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 pl-5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-foreground transition-all duration-700 ease-premium hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white/[0.07] active:scale-[0.98]"
            >
              View all
              <span className="grid size-8 place-items-center rounded-full bg-white/10 text-primary transition-transform duration-700 ease-premium group-hover:translate-x-1">
                <ArrowRight className="size-3.5" strokeWidth={1.5} />
              </span>
            </Link>
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-x-0 lg:gap-y-16">
          {featuredProjects.map((project, index) => (
            <CascadeProjectCard
              key={project.title}
              project={project}
              index={index}
              onOpen={setModalProject}
            />
          ))}
        </div>
      </div>

      <ProjectModal
        project={modalProject ?? featuredProjects[0]}
        isOpen={Boolean(modalProject)}
        onClose={() => setModalProject(null)}
      />
    </section>
  );
}
