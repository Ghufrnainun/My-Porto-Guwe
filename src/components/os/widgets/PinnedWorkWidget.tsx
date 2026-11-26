import { memo } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PortfolioProject } from '@/data/featuredProjects';

interface PinnedWorkWidgetProps {
  projects: PortfolioProject[];
  onOpenAll: () => void;
  onOpenProject: (slug: string) => void;
  size: { width: number; height: number };
}

function getInitials(title: string): string {
  const words = title.split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0] ?? ''}${words[1][0] ?? ''}`.toUpperCase();
}

export const PinnedWorkWidget = memo(function PinnedWorkWidget({
  projects,
  onOpenAll,
  onOpenProject,
  size,
}: PinnedWorkWidgetProps) {
  const isCompact = size.height < 164;
  const isTall = size.height >= 216;
  const isWide = size.width >= 410;
  const maxItems = isTall ? 4 : 3;
  const displayed = projects.slice(0, maxItems);

  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-[#f7f7fa]/[0.94] text-[#14161b] select-none">
      {/* Delicate top glass highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"
      />

      <div
        className={cn(
          'relative z-10 flex h-full w-full flex-col justify-between',
          isCompact ? 'px-3 py-2.5' : 'px-3.5 py-3'
        )}
      >
        {/* Clean macOS Sheet Header */}
        <div className="flex items-center justify-between gap-2 pb-1">
          <div className="flex items-center gap-2">
            <img
              src="/macos-icons/folder.png"
              alt=""
              aria-hidden="true"
              className="h-4 w-4 shrink-0 object-contain"
            />
            <span className="text-[12.5px] font-semibold tracking-[-0.015em] text-[#14161b]">
              Pinned Work
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenAll}
            className="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-medium text-[#0066cc] transition-[background-color,color,transform] duration-150 ease-out-spring hover:bg-black/[0.05] hover:text-[#004ea2] active:scale-95"
          >
            <span>All {projects.length}</span>
            <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>

        {/* Project Rows with Real Visual Thumbnails */}
        <div className="my-auto flex flex-col divide-y divide-black/[0.06]">
          {displayed.map((project) => (
            <button
              key={project.slug}
              type="button"
              onClick={() => onOpenProject(project.slug)}
              className={cn(
                'group/row -mx-1.5 flex items-center justify-between gap-2.5 rounded-[12px] px-1.5 text-left transition-[background-color,transform] duration-150 ease-out-spring hover:bg-black/[0.05] active:scale-[0.985]',
                isCompact ? 'py-1' : 'py-1.5'
              )}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                {/* Thumbnail or Monogram Swatch */}
                <div
                  className={cn(
                    'relative shrink-0 overflow-hidden rounded-[9px] ring-1 ring-black/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.08)]',
                    isCompact ? 'h-7 w-7' : 'h-8 w-8'
                  )}
                  style={{ backgroundColor: project.color }}
                >
                  {project.image ? (
                    <img
                      src={project.image}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-200 fine:group-hover/row:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] font-bold tracking-tight text-white">
                      {getInitials(project.title)}
                    </div>
                  )}
                </div>

                {/* Title & Role */}
                <div className="min-w-0">
                  <div className="truncate text-[12px] font-semibold leading-tight tracking-[-0.01em] text-[#14161b] transition-colors group-hover/row:text-[#0066cc]">
                    {project.title}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 truncate text-[10px] text-black/50">
                    <span className="truncate">{project.role}</span>
                    {isWide && project.technologies[0] && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="truncate text-black/45">
                          {project.technologies[0]}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                <span className="text-[10.5px] font-medium text-black/40 tabular-nums">
                  {project.year}
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 text-black/30 transition-[transform,color] duration-150 ease-out-spring fine:group-hover/row:translate-x-0.5 fine:group-hover/row:-translate-y-0.5 group-hover/row:text-[#0066cc]" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});
