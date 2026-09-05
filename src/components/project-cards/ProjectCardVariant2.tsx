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

export function ProjectCardVariant2({ project }: ProjectCardProps) {
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
        'group relative w-full overflow-hidden rounded-[2rem] border border-border/40 hover:border-primary/40',
        'bg-card/70 p-6 md:p-10 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.7)] backdrop-blur-sm',
        'transition-all duration-500 cursor-pointer flex flex-col gap-8'
      )}
    >
      <ProjectCursor
        cardRef={cardRef}
        isHoveringAction={isHoveringAction}
        label="Explore Project"
      />

      {/* Heroic Full-Width Visual Banner */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-border/30 bg-neutral-950">
        <div className="aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden">
          <div className="size-full transition-transform duration-700 ease-out group-hover:scale-[1.02]">
            <ProjectCover project={project} className="size-full" />
          </div>
        </div>
      </div>

      {/* 2-Column Editorial Info Bar */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-12 items-start pt-2">
        {/* Left Column (Heading & Meta) */}
        <div className="md:col-span-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
            <span>{project.role}</span>
            <span>·</span>
            <span>{project.year}</span>
          </div>

          <h3 className="font-serif text-3xl font-bold tracking-tight text-foreground leading-[1.05] md:text-4xl lg:text-5xl group-hover:text-primary transition-colors duration-300">
            {project.title}
          </h3>

          <div className="pt-2">
            <span
              onMouseEnter={() => setIsHoveringAction(true)}
              onMouseLeave={() => setIsHoveringAction(false)}
              className="group/link inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/30 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-foreground transition-all duration-300 group-hover:border-primary/40 group-hover:bg-primary/10"
            >
              Case Study
              <ArrowUpRight
                className="size-3.5 text-primary transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                strokeWidth={2}
              />
            </span>
          </div>
        </div>

        {/* Right Column (Summary, Tech, Links) */}
        <div className="md:col-span-7 flex flex-col justify-between gap-5">
          <p className="font-sans text-sm md:text-base leading-relaxed text-muted-foreground text-pretty max-w-xl">
            {project.summary}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.technologies.map((tech) => (
              <TechBadge key={tech} tech={tech} />
            ))}
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-3 pt-1">
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
                Private Repository
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
          </div>
        </div>
      </div>
    </article>
  );
}
