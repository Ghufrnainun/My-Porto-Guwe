import { Github, ArrowUpRight, Trophy } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { sideProjects, type SideProject } from '@/data/sideProjects';

interface SideProjectsProps {
  className?: string;
  hasContainer?: boolean;
}

export function SideProjects({ className = '', hasContainer = true }: SideProjectsProps) {
  const shouldReduceMotion = useReducedMotion();

  const content = (
    <div className={hasContainer ? "container mx-auto px-6 md:px-12 lg:px-24" : "w-full"}>
      {/* Section Header */}
      <div className="mb-8 md:mb-12">
        <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
          Experiments &amp; Prototypes
        </p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2
              id="side-projects-heading"
              className="text-2xl md:text-3xl font-bold tracking-tight text-foreground"
            >
              Side Projects
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-2xl leading-relaxed">
              Focused tools, computer vision experiments, and hackathon builds
              exploring specific engineering constraints.
            </p>
          </div>
          <span className="font-mono text-xs text-muted-foreground/70 self-start md:self-auto">
            {sideProjects.length} projects cataloged
          </span>
        </div>
      </div>

        {/* Compact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sideProjects.map((project: SideProject, index: number) => {
            const isFeaturedCard = Boolean(project.badge);

            return (
              <motion.article
                key={project.title}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.4,
                  delay: shouldReduceMotion ? 0 : index * 0.06,
                  ease: [0.21, 0.47, 0.32, 0.98],
                }}
                className={`group relative flex flex-col justify-between rounded-xl border p-5 md:p-6 transition-all duration-200 ${
                  isFeaturedCard
                    ? 'lg:col-span-2 border-primary/30 bg-card/60 hover:border-primary/60 hover:bg-card/90 shadow-sm'
                    : 'col-span-1 border-border/50 bg-card/30 hover:border-border/90 hover:bg-card/70'
                }`}
              >
                {/* Card Top / Header */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground/80">
                      {project.category}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground/60">
                      {project.year}
                    </span>
                  </div>

                  {project.badge && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-3">
                      <Trophy className="size-3 text-amber-500" />
                      <span>{project.badge.label}</span>
                    </div>
                  )}

                  <h3 className="text-base md:text-lg font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors duration-150">
                    {project.title}
                  </h3>

                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mt-2.5">
                    {project.description}
                  </p>
                </div>

                {/* Card Bottom / Tech & Links */}
                <div className="mt-5 pt-4 border-t border-border/30">
                  {/* Tech Stack Pills */}
                  <ul
                    aria-label="Technologies used"
                    className="flex flex-wrap gap-1.5 mb-4"
                  >
                    {project.technologies.map((tech) => (
                      <li
                        key={tech}
                        className="font-mono text-[11px] px-2 py-0.5 rounded bg-secondary/40 text-secondary-foreground/90 border border-border/30"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>

                  {/* Actions (Accessible targets) */}
                  <div className="flex items-center justify-between pt-1">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors py-2 px-1 rounded active:scale-95"
                      aria-label={`View ${project.title} source code on GitHub`}
                    >
                      <Github className="size-3.5" />
                      <span>Repository</span>
                    </a>

                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-primary font-medium hover:underline transition-colors py-2 px-1 rounded active:scale-95"
                        aria-label={`Visit ${project.title} live demo`}
                      >
                        <span>Live Demo</span>
                        <ArrowUpRight className="size-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
  );

  if (!hasContainer) {
    return (
      <div
        id="side-projects"
        aria-labelledby="side-projects-heading"
        className={`relative ${className}`}
      >
        {content}
      </div>
    );
  }

  return (
    <section
      id="side-projects"
      aria-labelledby="side-projects-heading"
      className={`py-12 md:py-20 bg-background relative ${className}`}
    >
      {content}
    </section>
  );
}
