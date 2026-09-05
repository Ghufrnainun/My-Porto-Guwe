import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
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
        'group relative w-full cursor-pointer select-none py-10 md:py-16',
        'border-b border-border/25 last:border-none transition-all duration-500'
      )}
    >
      <ProjectCursor cardRef={cardRef} label="Discover Project" />

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* Typographic Title Column */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60">
            <span>{project.role}</span>
            <span>·</span>
            <span>{project.year}</span>
          </div>

          <h3 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground transition-all duration-500 group-hover:translate-x-3 group-hover:text-primary">
            {project.title}
          </h3>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.technologies.map((tech) => (
              <TechBadge key={tech} tech={tech} />
            ))}
          </div>
        </div>

        {/* Dynamic Image Window */}
        <div className="relative w-full flex-shrink-0 md:w-[320px] lg:w-[420px]">
          <div
            className={cn(
              'aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 shadow-2xl',
              'transition-all duration-700 ease-out',
              isHovered
                ? 'scale-[1.05] border-primary/40 -translate-y-2'
                : 'scale-100 opacity-80 md:opacity-50'
            )}
          >
            <ProjectCover project={project} className="size-full" />
          </div>
        </div>
      </div>
    </article>
  );
}
