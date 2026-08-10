import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ExternalLink, Github, LockKeyhole } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { PortfolioProject, featuredProjects } from '@/data/featuredProjects';
import { ProjectCover } from './ProjectCover';

const springEase = [0.32, 0.72, 0, 1] as const;

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: springEase } }
};

// ─── Project image block ──────────────────────────────────────────────────────
function ProjectImage({ project, reversed }: { project: PortfolioProject; reversed: boolean }) {
  return (
    <motion.div
      variants={itemVariants}
      className={`relative w-full md:w-[48%] flex-shrink-0 ${reversed ? 'md:order-2' : ''}`}
    >
      <Link
        to={`/projects/${project.slug}`}
        className="group/img block relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border/20 bg-card"
        aria-label={`View ${project.title} case study`}
        tabIndex={-1}
      >
        <ProjectCover
          project={project}
          className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-premium group-hover/img:scale-[1.04]"
        />
        {/* Colour overlay from project brand colour */}
        <div
          className="absolute inset-0 opacity-20 mix-blend-screen"
          style={{
            background: `radial-gradient(circle at 75% 20%, ${project.color}88, transparent 50%)`,
          }}
        />
        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/60 to-transparent" />
      </Link>
    </motion.div>
  );
}

// ─── Project content block ────────────────────────────────────────────────────
function ProjectContent({
  project,
  index,
  reversed,
}: {
  project: PortfolioProject;
  index: number;
  reversed: boolean;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className={`flex w-full flex-col justify-center gap-5 md:w-[48%] ${
        reversed ? 'md:order-1' : ''
      }`}
    >
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
        {project.technologies.slice(0, 5).map((tech) => (
          <span
            key={tech}
            className="rounded-md border border-border/50 bg-secondary/40 px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
          >
            {tech}
          </span>
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
          <ArrowUpRight className="size-3.5 text-primary transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.6} />
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Individual project row ───────────────────────────────────────────────────
function ProjectRow({ project, index }: { project: PortfolioProject; index: number }) {
  const reversed = index % 2 !== 0;

  return (
    <motion.article
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        visible: { transition: { staggerChildren: 0.15 } }
      }}
      className="group relative border-t border-border/40 py-12 md:py-16"
    >
      {/* Row number */}
      <span className="absolute -top-3 left-0 font-mono text-[10px] text-muted-foreground/40 uppercase tracking-widest">
        /{String(index + 1).padStart(2, '0')}
      </span>

      <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
        <ProjectImage project={project} reversed={reversed} />
        <ProjectContent project={project} index={index} reversed={reversed} />
      </div>
    </motion.article>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export function ProjectsPreview() {
  const shouldReduceMotion = useReducedMotion();

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
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={1.5} />
          </Link>
        </div>

        <h2 className="mb-4 font-serif text-4xl font-bold leading-[0.95] tracking-tight text-foreground md:text-6xl">
          Projects with more depth.
        </h2>

        <p className="mb-2 max-w-lg text-base leading-8 text-muted-foreground">
          Recent builds with real ownership: auth architecture, content
          systems, deployment flow, and UI delivery.
        </p>

        {/* Project rows */}
        <div>
          {featuredProjects.map((project, index) => (
            <ProjectRow key={project.slug} project={project} index={index} />
          ))}
        </div>

        {/* Bottom border cap */}
        <div className="border-t border-border/40" />

      </div>
    </section>
  );
}
