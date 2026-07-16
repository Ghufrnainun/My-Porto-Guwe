import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ExternalLink, Github } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProjectModal } from '@/components/ProjectModal';
import {
  FeaturedProject,
  featuredProjects,
} from '@/data/featuredProjects';

const springEase = [0.32, 0.72, 0, 1] as const;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex w-fit rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
      {children}
    </span>
  );
}

function ProjectLinks({
  project,
  compact = false,
}: {
  project: FeaturedProject;
  compact?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <a
        href={project.github}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${project.title} GitHub`}
        className={`grid place-items-center rounded-full border border-white/10 bg-white/[0.06] text-foreground/70 transition-all duration-500 ease-premium hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary active:scale-[0.98] ${
          compact ? 'size-9' : 'size-10'
        }`}
      >
        <Github className="size-4" strokeWidth={1.35} />
      </a>
      {project.demo && (
        <a
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.title} live demo`}
          className={`grid place-items-center rounded-full border border-white/10 bg-white/[0.06] text-foreground/70 transition-all duration-500 ease-premium hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary active:scale-[0.98] ${
            compact ? 'size-9' : 'size-10'
          }`}
        >
          <ExternalLink className="size-4" strokeWidth={1.35} />
        </a>
      )}
    </div>
  );
}

function DetailsButton({
  onClick,
  children = 'Details',
}: {
  onClick: () => void;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary px-3 py-2 pl-5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-primary-foreground shadow-[0_18px_60px_-24px_hsl(var(--primary)/0.8)] transition-all duration-700 ease-premium hover:-translate-y-0.5 hover:bg-primary/90 active:scale-[0.98]"
    >
      <span>{children}</span>
      <span className="grid size-8 place-items-center rounded-full bg-background/90 text-primary transition-transform duration-700 ease-premium group-hover:translate-x-1 group-hover:-translate-y-0.5">
        <ArrowUpRight className="size-3.5" strokeWidth={1.6} />
      </span>
    </button>
  );
}

function EditorialPremiumSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalProject, setModalProject] = useState<FeaturedProject | null>(
    null,
  );
  const activeProject = featuredProjects[activeIndex];

  return (
    <section className="relative overflow-hidden bg-background py-24 md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,hsl(var(--primary)/0.13),transparent_30%),radial-gradient(circle_at_90%_40%,rgba(255,255,255,0.07),transparent_26%)]" />
      <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <motion.aside
            initial={{ opacity: 0, y: 36, filter: 'blur(12px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-120px' }}
            transition={{ duration: 0.85, ease: springEase }}
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <Eyebrow>Selected works</Eyebrow>
            <h2 className="mt-6 max-w-[9ch] font-serif text-5xl font-bold leading-[0.9] tracking-tight text-foreground md:text-7xl">
              Featured Projects.
            </h2>
            <p className="mt-7 max-w-md text-base leading-8 text-muted-foreground md:text-lg">
              Recent builds with real ownership: auth architecture, content
              systems, deployment flow, and UI delivery.
            </p>
            <Link
              to="/projects"
              className="group mt-9 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 pl-5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-foreground transition-all duration-700 ease-premium hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white/[0.07] active:scale-[0.98]"
            >
              View all
              <span className="grid size-8 place-items-center rounded-full bg-white/10 text-primary transition-transform duration-700 ease-premium group-hover:translate-x-1">
                <ArrowRight className="size-3.5" strokeWidth={1.5} />
              </span>
            </Link>

            <div className="mt-14 space-y-3">
              {featuredProjects.map((project, index) => {
                const isActive = activeIndex === index;

                return (
                  <button
                    key={project.title}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`group w-full rounded-[1.35rem] border p-4 text-left transition-all duration-700 ease-premium active:scale-[0.99] ${
                      isActive
                        ? 'border-primary/30 bg-primary/10'
                        : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-5">
                      <span className="font-mono text-[10px] text-muted-foreground">
                        /{String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        {project.year}
                      </span>
                    </div>
                    <h3
                      className={`mt-3 font-serif text-2xl font-bold leading-tight transition-colors duration-500 ${
                        isActive ? 'text-primary' : 'text-foreground/70'
                      }`}
                    >
                      {project.title}
                    </h3>
                    <div
                      className={`mt-4 h-px transition-all duration-700 ease-premium ${
                        isActive ? 'w-full bg-primary/50' : 'w-1/3 bg-white/10'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </motion.aside>

          <motion.div
            key={activeProject.title}
            initial={{ opacity: 0, x: 44, filter: 'blur(12px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.75, ease: springEase }}
            className="min-w-0"
          >
            <div className="rounded-[2.35rem] border border-white/10 bg-white/[0.05] p-2 shadow-[0_40px_120px_-70px_hsl(var(--primary)/0.7)]">
              <article className="overflow-hidden rounded-[calc(2.35rem-0.5rem)] border border-white/10 bg-card shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]">
                <div className="grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
                  <button
                    type="button"
                    onClick={() => setModalProject(activeProject)}
                    className="group relative min-h-[360px] overflow-hidden text-left md:min-h-[560px]"
                  >
                    <img
                      src={activeProject.image}
                      alt={activeProject.title}
                      className="absolute inset-0 size-full object-cover transition-transform duration-1000 ease-premium group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2">
                      {activeProject.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-white/15 bg-background/55 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground/80"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </button>

                  <div className="flex min-h-[420px] flex-col justify-between p-6 md:p-9">
                    <div>
                      <Eyebrow>Featured project</Eyebrow>
                      <h3 className="mt-6 font-serif text-4xl font-bold leading-[0.95] text-foreground md:text-5xl">
                        {activeProject.title}
                      </h3>
                      <p className="mt-6 max-w-md text-sm leading-7 text-muted-foreground md:text-base">
                        {activeProject.description}
                      </p>
                    </div>

                    <div className="mt-9 space-y-7">
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          ['Role', activeProject.role],
                          ['Scale', activeProject.metric],
                          ['Year', activeProject.year],
                        ].map(([label, value]) => (
                          <div
                            key={label}
                            className="rounded-2xl border border-white/10 bg-white/[0.04] p-3"
                          >
                            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                              {label}
                            </p>
                            <p className="mt-2 text-sm font-semibold text-foreground">
                              {value}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <ProjectLinks project={activeProject} />
                        <DetailsButton
                          onClick={() => setModalProject(activeProject)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </motion.div>
        </div>
      </div>

      <ProjectModal
        project={modalProject ?? activeProject}
        isOpen={Boolean(modalProject)}
        onClose={() => setModalProject(null)}
      />
    </section>
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
  const rotation =
    index % 2 === 0 ? 'lg:-rotate-[1.5deg]' : 'lg:rotate-[1.5deg]';
  const lift = index === 0 ? 'lg:translate-y-8' : 'lg:-translate-y-8';

  return (
    <motion.article
      initial={{ opacity: 0, y: 56, filter: 'blur(14px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.85, delay: index * 0.12, ease: springEase }}
      className={`group relative ${lift}`}
    >
      <div
        className={`rounded-[2.4rem] border border-white/10 bg-white/[0.055] p-2 shadow-[0_45px_130px_-78px_hsl(var(--primary)/0.75)] transition-all duration-700 ease-premium ${rotation} group-hover:rotate-0 group-hover:-translate-y-3`}
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
                <h3 className="mt-3 font-serif text-3xl font-bold leading-[0.95] text-foreground md:text-4xl">
                  {project.title}
                </h3>
              </div>
              <ProjectLinks project={project} compact />
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

            <div className="mt-7 flex items-center justify-between gap-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {project.metric} / {project.year}
              </div>
              <DetailsButton onClick={() => onOpen(project)}>Open</DetailsButton>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function ZAxisCascadeSection() {
  const [modalProject, setModalProject] = useState<FeaturedProject | null>(
    null,
  );

  return (
    <section className="relative overflow-hidden bg-background py-24 md:py-36">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.14),transparent_34%),linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent)]" />
      <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 34, filter: 'blur(12px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: springEase }}
          className="mb-14 flex flex-col gap-7 md:mb-20 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <Eyebrow>Variant 02</Eyebrow>
            <h2 className="mt-6 max-w-3xl font-serif text-5xl font-bold leading-[0.9] tracking-tight text-foreground md:text-7xl">
              Projects with more depth.
            </h2>
          </div>
          <p className="max-w-md text-base leading-8 text-muted-foreground md:text-lg">
            A stronger visual rhythm using stacked cards, tilted planes, and
            hover depth. Desktop gets attitude, mobile stays clean.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-0">
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

export default function ProjectSectionPreview() {
  return (
    <main className="dark min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-white/10 bg-background px-6 py-16 md:px-12 lg:px-24">
        <div className="container mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors duration-500 ease-premium hover:text-primary"
          >
            <ArrowRight className="size-3 rotate-180" strokeWidth={1.5} />
            Back home
          </Link>
          <div className="mt-10 max-w-4xl">
            <Eyebrow>Preview route</Eyebrow>
            <h1 className="mt-6 font-serif text-4xl font-bold leading-[1.02] tracking-tight text-foreground sm:text-5xl md:text-7xl md:leading-[0.92]">
              Featured Projects redesign options.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
              Two candidate sections for the homepage. Production section stays
              untouched until one direction wins.
            </p>
          </div>
        </div>
      </section>

      <EditorialPremiumSection />
      <ZAxisCascadeSection />
    </main>
  );
}
