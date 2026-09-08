import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ProjectShowcase } from '@/components/ui/project-showcase';

export function ProjectsPreview() {
  return (
    <section id="projects" className="relative bg-transparent py-20 md:py-32">
      <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-24">
        {/* Section header bar with View All link */}
        <div className="mb-8 flex items-center justify-between border-b border-border/40 pb-6">
          <div className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
              Selected Works
            </span>
          </div>

          <Link
            to="/projects"
            className="group inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground transition-colors duration-300 hover:text-primary"
          >
            View all
            <ArrowRight
              className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
              strokeWidth={1.5}
            />
          </Link>
        </div>

        <h2 className="mb-4 font-serif text-4xl font-bold leading-[0.95] tracking-tight text-foreground md:text-6xl">
          Shipped, not sketched.
        </h2>

        <p className="mb-12 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty">
          Recent builds with real ownership: auth architecture, content systems,
          deployment flow, and UI delivery.
        </p>

        {/* Minimalist Editorial Project Showcase */}
        <div className="w-full">
          <ProjectShowcase showTitle={false} />
        </div>
      </div>
    </section>
  );
}
