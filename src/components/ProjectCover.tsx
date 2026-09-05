import { Cpu, Server, ShieldCheck } from 'lucide-react';
import type { PortfolioProject } from '@/data/projects';

export function ProjectCover({
  project,
  className = '',
}: {
  project: PortfolioProject;
  className?: string;
}) {
  if (project.image) {
    return (
      <img
        src={project.image}
        alt={`${project.title} preview`}
        className={`size-full object-cover transition-transform duration-700 hover:scale-105 ${className}`}
        loading="lazy"
      />
    );
  }

  // SYSTEM BLUEPRINT REDESIGN (No BorderTrail)
  return (
    <div
      role="img"
      aria-label={`${project.title} system architecture identity`}
      className={`relative isolate overflow-hidden bg-card text-card-foreground select-none ${className}`}
    >
      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.12) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage:
            'radial-gradient(circle at center, black 20%, transparent 80%)',
          WebkitMaskImage:
            'radial-gradient(circle at center, black 20%, transparent 80%)',
        }}
      />

      {/* Main UI Layout */}
      <div className="relative flex size-full flex-col p-6 md:p-8">
        {/* Top Header */}
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1">
            <Cpu className="size-3 text-primary" />
            <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-primary/80">
              System Blueprint
            </span>
          </div>

          <div className="font-mono text-[9px] font-bold uppercase tracking-widest text-accent">
            0{project.team.size} Modules
          </div>
        </div>

        {/* Center Canvas */}
        <div className="flex flex-1 items-center justify-center">
          <div className="relative group/core">
            {/* Core Node */}
            <div className="relative z-10 flex size-20 items-center justify-center rounded-2xl border border-primary/20 bg-background/80 shadow-2xl backdrop-blur-sm transition-all duration-500 group-hover/core:border-primary/50 group-hover/core:shadow-primary/20 md:size-24">
              <span className="font-serif text-3xl font-bold tracking-tighter text-foreground md:text-4xl">
                {project.title.charAt(0)}
                {project.title.split(' ')[1]?.[0] ||
                  project.title.slice(1, 2).toLowerCase()}
              </span>
            </div>
            
            {/* Connection Node Indicator */}
            <div className="absolute -right-2 -top-2 size-3 rounded-full bg-accent shadow-[0_0_12px_2px] shadow-accent/40" />
          </div>
        </div>

        {/* Bottom Flow Footer */}
        <div className="flex items-center justify-center gap-4 border-t border-border/30 pt-6">
          <div className="flex items-center gap-1.5 opacity-60">
            <Server className="size-3.5 text-primary" />
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
              Core App
            </span>
          </div>
          <span className="text-border/40 font-mono text-[10px]">──</span>
          <div className="flex items-center gap-1.5 opacity-60">
            <Cpu className="size-3.5 text-accent" />
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
              Pipeline
            </span>
          </div>
          <span className="text-border/40 font-mono text-[10px]">──</span>
          <div className="flex items-center gap-1.5 opacity-60">
            <ShieldCheck className="size-3.5 text-green-500" />
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
              Verified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
