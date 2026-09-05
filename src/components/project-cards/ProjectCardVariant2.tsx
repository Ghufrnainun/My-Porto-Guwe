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
        'group relative w-full cursor-pointer select-none py-14 md:py-24',
        'border-b border-border/30 last:border-none flex flex-col gap-8'
      )}
    >
      <ProjectCursor
        cardRef={cardRef}
        isHoveringAction={isHoveringAction}
        label="Explore Project"
      />

      {/* Cinematic Panoramic Stage Display */}
      <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-neutral-950 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.9)]">
        <div className="aspect-[16/8] md:aspect-[21/8] w-full overflow-hidden">
          <div className="size-full transition-transform duration-1000 ease-out group-hover:scale-[1.03]">
            <ProjectCover project={project} className="size-full" />
          </div>
        </div>
        {/* Subtle Bottom Ambient Gradient */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Floating Quick Action in Corner */}
        <div className="absolute bottom-6 right-6 z-10 hidden sm:flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-4 py-2 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-primary group-hover:text-black group-hover:border-primary">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]">
            Read Case Study
          </span>
          <ArrowUpRight className="size-3.5 stroke-[2.2]" />
        </div>
      </div>

      {/* Architectural Meta & Story Footer */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between pt-2">
        {/* Left: Title & Meta */}
        <div className="flex flex-col gap-2 md:max-w-xs">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60">
            <span>{project.role}</span>
            <span>·</span>
            <span>{project.year}</span>
          </div>

          <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
            {project.title}
          </h3>
        </div>

        {/* Middle: Summary Text */}
        <p className="font-sans text-sm md:text-base leading-relaxed text-muted-foreground text-pretty max-w-lg md:px-4">
          {project.summary}
        </p>

        {/* Right: Tech Badges & Direct Links */}
        <div className="flex flex-col items-start md:items-end gap-4">
          <div className="flex flex-wrap gap-1.5 md:justify-end">
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
          </div>
        </div>
      </div>
    </article>
  );
}
