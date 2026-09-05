import { useState } from 'react';
import type { PortfolioProject } from '@/data/featuredProjects';
import { cn } from '@/lib/utils';

export function ProjectCover({
  project,
  className = '',
}: {
  project: PortfolioProject;
  className?: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  if (project.image) {
    return (
      <div className={cn('relative size-full overflow-hidden bg-neutral-900', className)}>
        <img
          src={project.image}
          alt={`${project.title} project preview`}
          className={cn(
            'size-full object-cover object-top transition-all duration-700 ease-out will-change-transform',
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          )}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
        />
        {/* Subtle cinematic vignette */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
      </div>
    );
  }

  // Minimalist dark editorial fallback
  return (
    <div
      role="img"
      aria-label={`${project.title} visual`}
      className={cn(
        'relative isolate flex size-full items-center justify-center overflow-hidden bg-neutral-950 text-foreground select-none',
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black opacity-80" />
      <div
        className="absolute -right-16 -top-16 size-64 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: project.color || 'hsl(var(--primary))' }}
      />
      <div className="relative z-10 flex flex-col items-center justify-center p-8 text-center">
        <span className="font-serif text-5xl md:text-6xl font-bold tracking-tight text-white/90">
          {project.title.charAt(0)}
        </span>
        <span className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60">
          {project.title}
        </span>
      </div>
    </div>
  );
}
