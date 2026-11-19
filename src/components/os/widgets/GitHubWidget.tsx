import { useMemo, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ContributionDay } from '@/components/ui/contribution-skyline';

interface GitHubWidgetProps {
  username: string;
  profileUrl: string;
  range: '6m' | '1y';
  onChangeRange: (range: '6m' | '1y') => void;
  stats: {
    sixMonths: number;
    oneYear: number;
    streak: number;
  };
  contributions: ContributionDay[];
  size: { width: number; height: number };
}

function formatContributionDate(isoDate: string): string {
  const parsed = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function getLevelColor(level: number): string {
  switch (level) {
    case 0:
      return 'bg-white/[0.06]';
    case 1:
      return 'bg-[#0e4429]';
    case 2:
      return 'bg-[#006d32]';
    case 3:
      return 'bg-[#26a641]';
    default:
      return 'bg-[#39d353]';
  }
}

export function GitHubWidget({
  username,
  profileUrl,
  range,
  onChangeRange,
  stats,
  contributions,
  size,
}: GitHubWidgetProps) {
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);

  const isCompact = size.width < 185 || size.height < 185;
  const isWide = size.width >= 230;
  const weekCount = isWide ? 18 : isCompact ? 11 : 14;

  const weeks = useMemo(() => {
    const totalDays = weekCount * 7;
    const slice = contributions.slice(-totalDays);
    const grouped: ContributionDay[][] = [];
    for (let i = 0; i < slice.length; i += 7) {
      grouped.push(slice.slice(i, i + 7));
    }
    return grouped;
  }, [contributions, weekCount]);

  const activeCount = range === '6m' ? stats.sixMonths : stats.oneYear;

  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-[#0d1117]/[0.92] text-[#f0f6fc] backdrop-blur-2xl backdrop-saturate-150 select-none">
      {/* Subtle atmospheric emerald corner sheen */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 85% 60% at 92% 4%, rgba(46, 160, 67, 0.16) 0%, transparent 65%), linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 32%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />

      <div
        className={cn(
          'relative z-10 flex h-full w-full flex-col justify-between',
          isCompact ? 'p-3' : 'p-3.5'
        )}
      >
        {/* Top Row: GitHub identity + 6M / 1Y segmented toggle */}
        <div className="flex items-center justify-between gap-2">
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/gh inline-flex min-w-0 items-center gap-1.5 text-[11px] font-medium text-[#8b949e] transition-colors duration-150 hover:text-white"
            title={`Open @${username} on GitHub`}
          >
            <svg
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
              className="h-3.5 w-3.5 shrink-0 text-[#f0f6fc]/85 transition-transform duration-150 ease-out-spring group-hover/gh:scale-105"
            >
              <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
            </svg>
            <span className="truncate">@{username}</span>
            <ArrowUpRight className="h-2.5 w-2.5 shrink-0 opacity-0 transition-[opacity,transform] duration-150 group-hover/gh:translate-x-0.5 group-hover/gh:-translate-y-0.5 group-hover/gh:opacity-80" />
          </a>

          <div
            role="group"
            aria-label="Contribution range"
            className="inline-flex shrink-0 items-center rounded-full bg-white/[0.06] p-[2px] ring-1 ring-white/[0.08]"
          >
            {(['6m', '1y'] as const).map((option) => {
              const active = range === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onChangeRange(option)}
                  aria-pressed={active}
                  className={cn(
                    'rounded-full px-2 py-[2px] text-[9.5px] font-semibold leading-none transition-[background-color,color,transform] duration-150 ease-out-spring active:scale-95',
                    active
                      ? 'bg-[#238636] text-white shadow-[0_1px_4px_rgba(35,134,54,0.45)]'
                      : 'text-[#8b949e] hover:text-white'
                  )}
                >
                  {option === '6m' ? '6M' : '1Y'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Hero Metric Row */}
        <div className="flex items-end justify-between gap-2 pt-1">
          <div className="min-w-0">
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'block font-semibold leading-none tracking-[-0.04em] text-white tabular-nums transition-opacity duration-150 hover:opacity-85',
                isCompact ? 'text-[26px]' : 'text-[31px]'
              )}
            >
              {activeCount.toLocaleString()}
            </a>
            <div className="mt-1 text-[10.5px] font-normal text-[#8b949e]">
              {range === '6m' ? 'contributions · 6 mo' : 'contributions · 1 yr'}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#238636]/15 px-2 py-0.5 text-[10px] font-medium text-[#56d364] ring-1 ring-[#3fb950]/25 tabular-nums">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3fb950]" />
            <span>{stats.streak}d streak</span>
          </div>
        </div>

        {/* Centerpiece: Adaptive 7-row Contribution Heatmap */}
        <div
          className="my-auto grid w-full py-1"
          style={{
            gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))`,
            gap: isCompact ? '2.5px' : '3px',
          }}
          onMouseLeave={() => setHoveredDay(null)}
        >
          {weeks.map((week, wIdx) => (
            <div
              key={wIdx}
              className="flex flex-col"
              style={{ gap: isCompact ? '2.5px' : '3px' }}
            >
              {week.map((day) => (
                <button
                  key={day.date}
                  type="button"
                  onMouseEnter={() => setHoveredDay(day)}
                  onFocus={() => setHoveredDay(day)}
                  onBlur={() => setHoveredDay(null)}
                  aria-label={`${formatContributionDate(day.date)}: ${day.count} contributions`}
                  title={`${formatContributionDate(day.date)}: ${day.count} contributions`}
                  className={cn(
                    'aspect-square w-full rounded-[2.5px] transition-[transform,filter] duration-100 ease-out hover:scale-125 hover:brightness-125 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/80',
                    getLevelColor(day.level)
                  )}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Quiet Footer: Live cell readout or GitHub legend */}
        <div className="flex items-center justify-between text-[9.5px] text-[#7d8590] tabular-nums">
          {hoveredDay ? (
            <span className="truncate font-medium text-[#c9d1d9]">
              {formatContributionDate(hoveredDay.date)} ·{' '}
              <span className="text-[#56d364]">
                {hoveredDay.count} {hoveredDay.count === 1 ? 'commit' : 'commits'}
              </span>
            </span>
          ) : (
            <>
              <span>Last {weekCount} weeks</span>
              <span className="inline-flex items-center gap-[3px]" aria-hidden="true">
                <span className="mr-0.5 text-[8.5px] text-[#6e7681]">Less</span>
                {[0, 1, 2, 3, 4].map((lvl) => (
                  <span
                    key={lvl}
                    className={cn('h-[6px] w-[6px] rounded-[1.5px]', getLevelColor(lvl))}
                  />
                ))}
                <span className="ml-0.5 text-[8.5px] text-[#6e7681]">More</span>
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
