import { PortfolioProject } from '@/data/featuredProjects';

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
        alt={`${project.title} cover`}
        className={className}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={`${project.title} typographic project identity`}
      className={`relative isolate overflow-hidden bg-[#0b1010] text-white ${className}`}
      style={{
        backgroundImage: `radial-gradient(circle at 80% 12%, ${project.color}55, transparent 30%), linear-gradient(135deg, ${project.color}18, transparent 45%)`,
      }}
    >
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="relative flex size-full flex-col justify-between p-6 md:p-10">
        <span className="w-fit rounded-full border border-white/15 bg-black/20 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white/60">
          Project identity / no public media
        </span>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
            {project.role} / {project.year}
          </p>
          <p className="mt-3 max-w-3xl font-serif text-4xl font-bold leading-[0.9] tracking-tight md:text-6xl">
            {project.title}
          </p>
        </div>
      </div>
    </div>
  );
}
