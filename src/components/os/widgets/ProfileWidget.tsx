import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileWidgetProps {
  name: string;
  role?: string;
  semester: number;
  gpa: string;
  availability: string;
  githubUrl: string;
  onOpenBio: () => void;
  size: { width: number; height: number };
}

export function ProfileWidget({
  name,
  role = 'Full-Stack Dev',
  semester,
  gpa,
  availability,
  githubUrl,
  onOpenBio,
  size,
}: ProfileWidgetProps) {
  const isWide = size.width >= 242;
  const isTall = size.height >= 218;
  const shortName = name.split(' ').slice(0, 2).join(' ');

  if (isWide) {
    return (
      <div className="relative flex h-full w-full overflow-hidden bg-[#141519]/[0.95] text-white select-none">
        {/* Left: Full-height editorial portrait */}
        <div className="relative h-full w-[44%] shrink-0 overflow-hidden bg-[#1c1e24]">
          <img
            src="/Photo.webp"
            alt={name}
            draggable={false}
            className="h-full w-full object-cover object-top"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#141519]/90"
          />
        </div>

        {/* Right: Clean editorial pass details */}
        <div className="relative z-10 flex min-w-0 flex-1 flex-col justify-between p-3.5 pl-2.5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-medium text-[#56d364]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#30d158]" />
              <span className="truncate">{availability}</span>
            </div>
            <div className="mt-1.5 truncate text-[15px] font-semibold leading-tight tracking-[-0.02em] text-white">
              {shortName}
            </div>
            <div className="mt-0.5 truncate text-[11px] text-white/60">
              {role}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-white/50 tabular-nums">
              <span>Polines · Sem {semester}</span>
              <span aria-hidden="true">·</span>
              <span className="text-white/75">GPA {gpa.split('/')[0]}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenBio}
              className="flex flex-1 items-center justify-center gap-1 rounded-[10px] bg-white/[0.12] px-2.5 py-1.5 text-[11px] font-medium text-white transition-[background-color,transform] duration-150 ease-out-spring hover:bg-white/[0.2] active:scale-[0.96]"
            >
              <span>Bio</span>
              <ArrowUpRight className="h-3 w-3 opacity-70" />
            </button>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-1 rounded-[10px] bg-white/[0.07] px-2.5 py-1.5 text-[11px] font-medium text-white/85 ring-1 ring-white/[0.1] transition-[background-color,color,transform] duration-150 ease-out-spring hover:bg-white/[0.14] hover:text-white active:scale-[0.96]"
            >
              <span>GitHub</span>
              <ArrowUpRight className="h-3 w-3 opacity-70" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  /* Compact / Square: Full-Bleed Contact Poster */
  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-[#16181e] text-white select-none">
      {/* Full-bleed Portrait Photography */}
      <img
        src="/Photo.webp"
        alt={name}
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 ease-out-spring group-hover/widget:scale-[1.03]"
      />

      {/* Refined Editorial Gradient Scrim */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(10,12,18,0.22) 0%, rgba(10,12,18,0.04) 36%, rgba(10,12,18,0.68) 68%, rgba(10,12,18,0.94) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
      />

      {/* Top-right subtle status dot */}
      <div className="relative z-10 flex justify-end p-2.5">
        <span
          title={availability}
          className="inline-flex items-center gap-1.5 rounded-full bg-black/45 px-2 py-0.5 text-[9.5px] font-medium text-white/90 backdrop-blur-md ring-1 ring-white/15"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#30d158]" />
          <span>Open</span>
        </span>
      </div>

      {/* Bottom Contact Poster Typography + Glass Action Dock */}
      <div className="relative z-10 flex flex-col gap-2 px-3 pb-3">
        <div className="min-w-0">
          <div className="truncate text-[14.5px] font-semibold leading-tight tracking-[-0.02em] text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
            {shortName}
          </div>
          <div className="mt-0.5 truncate text-[10.5px] font-medium text-white/75">
            {role} · Polines
          </div>
          {isTall && (
            <div className="mt-1 text-[9.5px] text-white/60 tabular-nums">
              Sem {semester} · GPA {gpa}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenBio}
            className={cn(
              'flex flex-1 items-center justify-center gap-1 rounded-[10px] bg-white/[0.18] py-1.5 text-[10.5px] font-semibold text-white backdrop-blur-md ring-1 ring-white/20',
              'transition-[background-color,transform] duration-150 ease-out-spring hover:bg-white/[0.28] active:scale-[0.96]'
            )}
          >
            <span>Bio</span>
            <ArrowUpRight className="h-2.5 w-2.5 opacity-80" />
          </button>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'flex flex-1 items-center justify-center gap-1 rounded-[10px] bg-black/40 py-1.5 text-[10.5px] font-medium text-white/90 backdrop-blur-md ring-1 ring-white/15',
              'transition-[background-color,color,transform] duration-150 ease-out-spring hover:bg-black/60 hover:text-white active:scale-[0.96]'
            )}
          >
            <span>GitHub</span>
            <ArrowUpRight className="h-2.5 w-2.5 opacity-75" />
          </a>
        </div>
      </div>
    </div>
  );
}
