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

export function ProjectCardVariant3({ project }: ProjectCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const [isHoveringAction, setIsHoveringAction] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = () => {
    navigate(`/projects/${project.slug}`);
  };

  return (
    <article
      ref={cardRef}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'group relative w-full cursor-pointer select-none',
        'py-12 md:py-20 border-b border-border/30 last:border-none',
        'transition-all duration-500'
      )}
    >
      <ProjectCursor
        cardRef={cardRef}
        isHoveringAction={isHoveringAction}
        label="View Project"
      />

      {/* Main Row: Monumental Typography & Visual Reveal */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* Left: Giant Typographic Title & Meta */}
        <div className="flex flex-col gap-3 md:max-w-xl">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60">
            <span>{project.role}</span>
            <span>·</span>
            <span>{project.year}</span>
            <span>·</span>
            <span>{project.team.label}</span>
          </div>

          <h3 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground transition-all duration-500 group-hover:translate-x-3 group-hover:text-primary">
            {project.title}
          </h3>

          <p className="font-sans text-sm md:text-base leading-relaxed text-muted-foreground text-pretty max-w-lg pt-1">
            {project.summary}
          </p>
        </div>

        {/* Right: Floating Visual Preview Window */}
        <div className="relative w-full flex-shrink-0 md:w-[380px] lg:w-[460px]">
          <div
            className={cn(
              'aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-950',
              'shadow-[0_24px_64px_-16px_rgba(0,0,0,0.9)]',
              'transition-all duration-700 ease-out',
              isHovered
                ? 'scale-[1.04] border-primary/40 -translate-y-2'
                : 'scale-100 opacity-80 md:opacity-60'
            )}
          >
            <div className="size-full transition-transform duration-700 ease-out group-hover:scale-[1.05]">
              <ProjectCover project={project} className="size-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Info & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 mt-6 border-t border-border/10">
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.map((tech) => (
            <TechBadge key={tech} tech={tech} />
          ))}
        </div>

        <div className="flex items-center gap-3">
          {project.repository && (
            <a
              href={project.repository}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} GitHub repository`}
              onMouseEnter={() => setIsHoveringAction(true)}
              onMouseLeave={() => setIsHoveringAction(false)}
              onClick={(e) => e.stopPropagation()}
              className="grid size-9 place-items-center rounded-full border border-border/60 bg-secondary/20 text-muted-foreground transition-all duration-300 hover:scale-105 hover:border-primary/50 hover:text-primary active:scale-95"
            >
              <Github className="size-3.5" strokeWidth={1.5} />
            </a>
          )}

          {project.visibility === 'private' && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/40 bg-secondary/30 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
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
              className="grid size-9 place-items-center rounded-full border border-border/60 bg-secondary/20 text-muted-foreground transition-all duration-300 hover:scale-105 hover:border-primary/50 hover:text-primary active:scale-95"
            >
              <ExternalLink className="size-3.5" strokeWidth={1.5} />
            </a>
          )}

          <span
            onMouseEnter={() => setIsHoveringAction(true)}
            onMouseLeave={() => setIsHoveringAction(false)}
            className="group/link inline-flex items-center gap-2 pl-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-foreground transition-all duration-300 group-hover:text-primary"
          >
            Case Study
            <ArrowUpRight
              className="size-3.5 text-primary transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1"
              strokeWidth={2}
            />
          </span>
        </div>
      </div>
    </article>
  );
}
