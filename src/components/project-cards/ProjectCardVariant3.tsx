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

export function ProjectCardVariant3({ project, index = 0 }: ProjectCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const [isHoveringAction, setIsHoveringAction] = useState(false);
  const isReversed = index % 2 !== 0;

  const handleCardClick = () => {
    navigate(`/projects/${project.slug}`);
  };

  return (
    <article
      ref={cardRef}
      onClick={handleCardClick}
      className={cn(
        'group relative w-full overflow-hidden rounded-[2rem] border border-border/40 hover:border-primary/40',
        'bg-card/70 p-6 md:p-10 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.7)] backdrop-blur-sm',
        'transition-all duration-500 cursor-pointer'
      )}
    >
      <ProjectCursor
        cardRef={cardRef}
        isHoveringAction={isHoveringAction}
        label="View Case Study"
      />

      <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
        {/* Visual Column */}
        <div
          className={cn(
            'relative w-full flex-shrink-0 overflow-hidden rounded-2xl border border-border/30 bg-neutral-950 md:w-[56%]',
            isReversed ? 'md:order-2' : 'md:order-1'
          )}
        >
          <div className="aspect-[16/10] w-full overflow-hidden">
            <div className="size-full transition-transform duration-700 ease-out group-hover:scale-[1.03]">
              <ProjectCover project={project} className="size-full" />
            </div>
          </div>
        </div>

        {/* Text Column */}
        <div
          className={cn(
            'flex w-full flex-col justify-center gap-5 md:w-[44%]',
            isReversed ? 'md:order-1' : 'md:order-2'
          )}
        >
          {/* Minimalist Meta */}
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
            <span>{project.role}</span>
            <span>·</span>
            <span>{project.year}</span>
            <span>·</span>
            <span>{project.team.label}</span>
          </div>

          {/* Large Serif Title */}
          <h3 className="font-serif text-3xl font-bold tracking-tight text-foreground leading-[1.05] md:text-4xl lg:text-5xl group-hover:text-primary transition-colors duration-300">
            {project.title}
          </h3>

          {/* Flowing Summary */}
          <p className="font-sans text-sm md:text-base leading-relaxed text-muted-foreground text-pretty max-w-lg">
            {project.summary}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.technologies.map((tech) => (
              <TechBadge key={tech} tech={tech} />
            ))}
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-3 pt-2">
            {project.repository && (
              <a
                href={project.repository}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} GitHub repository`}
                onMouseEnter={() => setIsHoveringAction(true)}
                onMouseLeave={() => setIsHoveringAction(false)}
                onClick={(e) => e.stopPropagation()}
                className="grid size-10 place-items-center rounded-full border border-border/50 bg-secondary/40 text-muted-foreground/80 transition-all duration-300 hover:scale-105 hover:border-primary/40 hover:text-primary active:scale-95"
              >
                <Github className="size-4" strokeWidth={1.5} />
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
                onMouseEnter={() => setIsHoveringAction(true)}
                onMouseLeave={() => setIsHoveringAction(false)}
                onClick={(e) => e.stopPropagation()}
                className="grid size-10 place-items-center rounded-full border border-border/50 bg-secondary/40 text-muted-foreground/80 transition-all duration-300 hover:scale-105 hover:border-primary/40 hover:text-primary active:scale-95"
              >
                <ExternalLink className="size-4" strokeWidth={1.5} />
              </a>
            )}

            <span
              onMouseEnter={() => setIsHoveringAction(true)}
              onMouseLeave={() => setIsHoveringAction(false)}
              className="group/link ml-auto inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/30 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-foreground transition-all duration-300 group-hover:border-primary/40 group-hover:bg-primary/10"
            >
              Case Study
              <ArrowUpRight
                className="size-3.5 text-primary transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                strokeWidth={2}
              />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
