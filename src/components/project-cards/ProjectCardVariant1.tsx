import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, ExternalLink, ArrowUpRight, LockKeyhole } from 'lucide-react';
import { PortfolioProject } from '@/data/featuredProjects';
import { ProjectCover } from '@/components/ProjectCover';
import { TechBadge } from '@/components/TechBadge';
import { ProjectCursor } from './ProjectCursor';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: PortfolioProject;
  index?: number;
}

export function ProjectCardVariant1({ project }: ProjectCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const [isHoveringAction, setIsHoveringAction] = useState(false);

  const handleCardClick = () => {
    navigate(`/projects/${project.slug}`);
  };

  return (
    <article
      ref={cardRef}
      onClick={handleCardClick}
      className={cn(
        'group relative w-full cursor-pointer select-none',
        'py-14 md:py-24 border-b border-border/30 last:border-none',
        'transition-colors duration-300'
      )}
    >
      <ProjectCursor
        cardRef={cardRef}
        isHoveringAction={isHoveringAction}
        label="View Case Study"
      />

      <div className="flex flex-col gap-10 md:flex-row md:items-center md:gap-16">
        {/* Floating Visual Stage (No Card Box) */}
        <div className="relative w-full flex-shrink-0 md:w-[56%]">
          <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.9)]">
            <div className="size-full transition-transform duration-700 ease-out group-hover:scale-[1.03]">
              <ProjectCover project={project} className="size-full" />
            </div>
          </div>
        </div>

        {/* Pure Editorial Story Stack */}
        <div className="flex w-full flex-col justify-center gap-6 md:w-[44%]">
          {/* Micro Meta */}
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground/60">
            <span>{project.role}</span>
            <span>·</span>
            <span>{project.year}</span>
            <span>·</span>
            <span>{project.team.label}</span>
          </div>

          {/* Monumental Playfair Heading */}
          <h3 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[0.98] group-hover:text-primary transition-colors duration-300">
            {project.title}
          </h3>

          {/* Natural Text Flow */}
          <p className="font-sans text-sm md:text-base leading-relaxed text-muted-foreground text-pretty max-w-lg">
            {project.summary}
          </p>

          {/* Clean Tech Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.technologies.map((tech) => (
              <TechBadge key={tech} tech={tech} />
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-3">
            {project.repository && (
              <a
                href={project.repository}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} GitHub repository`}
                onMouseEnter={() => setIsHoveringAction(true)}
                onMouseLeave={() => setIsHoveringAction(false)}
                onClick={(e) => e.stopPropagation()}
                className="grid size-11 place-items-center rounded-full border border-border/60 bg-secondary/20 text-muted-foreground transition-all duration-300 hover:scale-105 hover:border-primary/50 hover:text-primary active:scale-95"
              >
                <Github className="size-4" strokeWidth={1.5} />
              </a>
            )}

            {project.visibility === 'private' && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/40 bg-secondary/30 px-3.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
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
                onMouseEnter={() => setIsHoveringAction(true)}
                onMouseLeave={() => setIsHoveringAction(false)}
                onClick={(e) => e.stopPropagation()}
                className="grid size-11 place-items-center rounded-full border border-border/60 bg-secondary/20 text-muted-foreground transition-all duration-300 hover:scale-105 hover:border-primary/50 hover:text-primary active:scale-95"
              >
                <ExternalLink className="size-4" strokeWidth={1.5} />
              </a>
            )}

            <span
              onMouseEnter={() => setIsHoveringAction(true)}
              onMouseLeave={() => setIsHoveringAction(false)}
              className="group/link ml-auto inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-foreground transition-all duration-300 group-hover:text-primary"
            >
              Case Study
              <ArrowUpRight
                className="size-4 text-primary transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1"
                strokeWidth={2}
              />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
