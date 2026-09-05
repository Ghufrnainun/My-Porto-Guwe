import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PortfolioProject } from '@/data/featuredProjects';
import { ProjectCover } from '@/components/ProjectCover';
import { ProjectCursor } from './ProjectCursor';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: PortfolioProject;
  index?: number;
}

export function ProjectCardVariant1({ project }: ProjectCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/projects/${project.slug}`);
  };

  return (
    <article
      ref={cardRef}
      onClick={handleCardClick}
      className={cn(
        'group relative w-full cursor-pointer select-none overflow-hidden',
        'rounded-[28px] sm:rounded-[36px] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.9)]',
        'aspect-[16/10] sm:aspect-[16/9] md:aspect-[2/1] lg:aspect-[16/8] max-h-[640px]'
      )}
    >
      <ProjectCursor cardRef={cardRef} label="View Project" />

      {/* Full-Bleed Cinematic Background Photo */}
      <div className="absolute inset-0 size-full overflow-hidden bg-neutral-950">
        <div className="size-full transition-transform duration-700 ease-out group-hover:scale-[1.03]">
          <ProjectCover project={project} className="size-full" />
        </div>
      </div>

      {/* Dark Ambient Gradient (Portox 200deg Vignette) */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          background:
            'linear-gradient(200deg, rgba(5, 5, 5, 0) 20%, rgba(5, 5, 5, 0.4) 60%, rgba(5, 5, 5, 0.88) 100%)',
        }}
      />

      {/* Bottom-Left Frosted Overlay (Portox Signature Style) */}
      <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 z-10 flex flex-col items-start gap-2 sm:gap-3 max-w-2xl">
        {/* Frosted Glass Category Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/20 px-4 py-1.5 sm:px-6 sm:py-2.5 backdrop-blur-2xl shadow-lg transition-transform duration-300 group-hover:scale-105">
          <span className="size-1.5 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-white">
            {project.role} · {project.year}
          </span>
        </div>

        {/* Massive Bold Project Title */}
        <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white transition-all duration-300 group-hover:translate-x-1">
          {project.title}
        </h3>

        {/* Clean One-Line Subtitle */}
        <p className="hidden sm:block font-sans text-xs md:text-sm text-white/80 line-clamp-1 max-w-xl text-pretty">
          {project.summary}
        </p>
      </div>
    </article>
  );
}
