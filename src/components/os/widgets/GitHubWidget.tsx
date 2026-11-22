import { useId, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
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

interface MonthBucket {
  key: string;
  shortLabel: string;
  letter: string;
  fullLabel: string;
  count: number;
  activeDays: number;
}

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];
const MONTH_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

function parseIsoDate(isoDate: string): Date | null {
  const parsed = new Date(`${isoDate}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatContributionDate(isoDate: string): string {
  const parsed = parseIsoDate(isoDate);
  if (!parsed) return isoDate;
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

function getBarColor(count: number, maxCount: number, isPeak: boolean): string {
  if (count <= 0) return 'bg-white/[0.10]';
  if (isPeak) return 'bg-[#39d353]';
  const ratio = count / Math.max(1, maxCount);
  if (ratio >= 0.65) return 'bg-[#26a641]';
  if (ratio >= 0.32) return 'bg-[#006d32]';
  return 'bg-[#0e4429]';
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
  const pillLayoutId = useId();
  const prefersReducedMotion = useReducedMotion();
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);
  const [hoveredMonth, setHoveredMonth] = useState<MonthBucket | null>(null);

  const isCompact = size.width < 185 || size.height < 185;
  const isWide = size.width >= 230;
  const weekCount = isWide ? 22 : isCompact ? 13 : 16;

  // ── 6M View Data: Daily Heatmap Matrix ───────────────────────────────────
  const sixMonthData = useMemo(() => {
    const totalDays = weekCount * 7;
    const slice = contributions.slice(-totalDays);
    const weeks: ContributionDay[][] = [];
    for (let i = 0; i < slice.length; i += 7) {
      weeks.push(slice.slice(i, i + 7));
    }

    const activeDays = slice.reduce(
      (acc, d) => acc + (d.count > 0 ? 1 : 0),
      0,
    );

    // Compute clean month labels pinned to first week column where month changes
    const monthTicks: { col: number; label: string }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, idx) => {
      const first = week[0];
      if (!first) return;
      const dt = parseIsoDate(first.date);
      if (!dt) return;
      const m = dt.getMonth();
      if (m !== lastMonth) {
        // Avoid crowding adjacent ticks on narrow widths
        const prevTick = monthTicks[monthTicks.length - 1];
        if (!prevTick || idx - prevTick.col >= 3) {
          monthTicks.push({ col: idx, label: MONTH_SHORT[m] });
        }
        lastMonth = m;
      }
    });

    const firstDate = slice[0] ? parseIsoDate(slice[0].date) : null;
    const lastDate = slice[slice.length - 1]
      ? parseIsoDate(slice[slice.length - 1].date)
      : null;
    const spanLabel =
      firstDate && lastDate
        ? `${MONTH_SHORT[firstDate.getMonth()]}–${MONTH_SHORT[lastDate.getMonth()]}`
        : `Last ${weekCount}w`;

    return { weeks, activeDays, monthTicks, spanLabel };
  }, [contributions, weekCount]);

  // ── 1Y View Data: 12-Month Velocity Bars (strictly reconciled from days) ─
  const oneYearData = useMemo(() => {
    const map = new Map<string, MonthBucket>();
    for (const day of contributions) {
      const dt = parseIsoDate(day.date);
      if (!dt) continue;
      const y = dt.getFullYear();
      const m = dt.getMonth();
      const key = `${y}-${String(m + 1).padStart(2, '0')}`;
      const existing = map.get(key);
      if (existing) {
        existing.count += day.count;
        if (day.count > 0) existing.activeDays += 1;
      } else {
        const shortLabel = MONTH_SHORT[m];
        map.set(key, {
          key,
          shortLabel,
          letter: shortLabel[0],
          fullLabel: `${shortLabel} ${y}`,
          count: day.count,
          activeDays: day.count > 0 ? 1 : 0,
        });
      }
    }

    // Take the trailing 12 calendar months so bars stay crisp and evenly spaced
    const months = Array.from(map.values()).slice(-12);
    let peak: MonthBucket | null = null;
    let sum = 0;
    for (const bucket of months) {
      sum += bucket.count;
      if (!peak || bucket.count > peak.count) peak = bucket;
    }
    const maxCount = peak?.count ?? 1;
    const avgPerMonth = months.length > 0 ? Math.round(sum / months.length) : 0;

    return { months, peak, maxCount, avgPerMonth, sum };
  }, [contributions]);

  const activeCount =
    range === '6m'
      ? stats.sixMonths
      : oneYearData.sum > 0
        ? oneYearData.sum
        : stats.oneYear;

  const handleRangeChange = (next: '6m' | '1y') => {
    if (next === range) return;
    setHoveredDay(null);
    setHoveredMonth(null);
    onChangeRange(next);
  };

  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-[#0d1117]/[0.95] text-[#f0f6fc] backdrop-blur-2xl select-none">
      {/* Hairline top specular edge (flat surface, zero decorative glow blobs) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />

      <div
        className={cn(
          'relative z-10 flex h-full w-full flex-col justify-between',
          isCompact ? 'p-3' : 'p-3.5',
        )}
      >
        {/* Row 1: Identity (glides clear of widget remove button on hover) + Neutral Segmented Control */}
        <div className="flex items-center justify-between gap-2">
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/gh inline-flex min-w-0 items-center gap-1.5 text-[11px] font-medium text-[#8b949e] transition-[color,transform] duration-150 ease-smooth-out hover:text-white focus-visible:outline-none focus-visible:text-white group-hover/widget:translate-x-5"
            title={`Open @${username} on GitHub`}
          >
            <svg
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
              className="h-3.5 w-3.5 shrink-0 text-[#f0f6fc]/85 transition-transform duration-150 ease-smooth-out group-hover/gh:scale-105"
            >
              <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
            </svg>
            <span className="truncate">@{username}</span>
            <ArrowUpRight className="h-2.5 w-2.5 shrink-0 opacity-0 transition-[opacity,transform] duration-150 ease-smooth-out group-hover/gh:translate-x-0.5 group-hover/gh:-translate-y-0.5 group-hover/gh:opacity-80" />
          </a>

          {/* Receding neutral segmented control so green belongs exclusively to data */}
          <div
            role="group"
            aria-label="Contribution range"
            className="relative inline-flex shrink-0 items-center rounded-full bg-white/[0.06] p-[2px] ring-1 ring-white/[0.08]"
          >
            {(['6m', '1y'] as const).map((option) => {
              const active = range === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleRangeChange(option)}
                  aria-pressed={active}
                  className={cn(
                    'relative z-10 rounded-full px-2 py-[3px] text-[9.5px] font-semibold leading-none transition-colors duration-150 ease-smooth-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/70 active:scale-[0.97]',
                    active ? 'text-white' : 'text-[#7d8590] hover:text-[#c9d1d9]',
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId={`gh-range-pill-${pillLayoutId}`}
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { type: 'spring', duration: 0.28, bounce: 0.08 }
                      }
                      className="absolute inset-0 -z-10 rounded-full bg-white/[0.16] ring-1 ring-white/[0.12]"
                    />
                  )}
                  {option === '6m' ? '6M' : '1Y'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Typographic Hero KPI + Quiet Inline Metadata (zero extra pill chrome) */}
        <div className="flex items-baseline justify-between gap-2 pt-0.5">
          <div className="flex min-w-0 items-baseline gap-1.5">
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block focus-visible:outline-none focus-visible:underline"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={range}
                  initial={
                    prefersReducedMotion ? false : { opacity: 0, y: 3 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  exit={
                    prefersReducedMotion ? undefined : { opacity: 0, y: -3 }
                  }
                  transition={{ duration: 0.16, ease: EASE_OUT }}
                  className={cn(
                    'inline-block font-semibold leading-none tracking-[-0.04em] text-white tabular-nums',
                    isCompact ? 'text-[24px]' : 'text-[28px]',
                  )}
                >
                  {activeCount.toLocaleString()}
                </motion.span>
              </AnimatePresence>
            </a>
            <span className="truncate text-[10px] font-normal text-[#7d8590]">
              {range === '6m' ? 'in 6 mo' : 'in 12 mo'}
            </span>
          </div>

          <span className="shrink-0 text-[10px] font-medium text-[#56d364] tabular-nums">
            {range === '6m'
              ? `${stats.streak}d streak`
              : `${oneYearData.avgPerMonth}/mo`}
          </span>
        </div>

        {/* Row 3: Distinct Mode-Specific Data Visualization */}
        <div className="relative my-auto flex w-full flex-1 flex-col justify-center py-1">
          <AnimatePresence mode="wait" initial={false}>
            {range === '6m' ? (
              <motion.div
                key="view-6m"
                initial={
                  prefersReducedMotion ? false : { opacity: 0, scale: 0.97 }
                }
                animate={{ opacity: 1, scale: 1 }}
                exit={
                  prefersReducedMotion ? undefined : { opacity: 0, scale: 0.98 }
                }
                transition={{ duration: 0.18, ease: EASE_OUT }}
                className="flex w-full flex-col gap-1"
              >
                {/* Month alignment ticks (hidden only on ultra-compact height) */}
                {!isCompact && sixMonthData.monthTicks.length > 0 && (
                  <div
                    className="grid w-full text-[8.5px] font-medium leading-none text-[#6e7681]"
                    style={{
                      gridTemplateColumns: `repeat(${sixMonthData.weeks.length}, minmax(0, 1fr))`,
                      gap: '3px',
                    }}
                    aria-hidden="true"
                  >
                    {sixMonthData.weeks.map((_, colIdx) => {
                      const tick = sixMonthData.monthTicks.find(
                        (t) => t.col === colIdx,
                      );
                      return (
                        <span key={colIdx} className="overflow-visible whitespace-nowrap">
                          {tick ? tick.label : ''}
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* 7-row Daily Contribution Matrix */}
                <div
                  className="grid w-full"
                  style={{
                    gridTemplateColumns: `repeat(${sixMonthData.weeks.length}, minmax(0, 1fr))`,
                    gap: isCompact ? '2.5px' : '3px',
                  }}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  {sixMonthData.weeks.map((week, wIdx) => (
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
                            'aspect-square w-full rounded-[2px] transition-[transform,filter] duration-100 ease-smooth-out hover:scale-125 hover:brightness-125 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/80',
                            getLevelColor(
                              day.level ??
                                (day.count === 0
                                  ? 0
                                  : day.count >= 8
                                    ? 4
                                    : day.count >= 5
                                      ? 3
                                      : day.count >= 2
                                        ? 2
                                        : 1),
                            ),
                          )}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="view-1y"
                initial={
                  prefersReducedMotion ? false : { opacity: 0, scale: 0.97 }
                }
                animate={{ opacity: 1, scale: 1 }}
                exit={
                  prefersReducedMotion ? undefined : { opacity: 0, scale: 0.98 }
                }
                transition={{ duration: 0.18, ease: EASE_OUT }}
                className="flex h-full w-full flex-col justify-end gap-1.5 pt-1"
                onMouseLeave={() => setHoveredMonth(null)}
              >
                {/* 12-Month Velocity Bar Chart */}
                <div className="relative flex min-h-[58px] flex-1 items-end">
                  {/* Single faint midpoint guideline */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-white/[0.06]"
                  />
                  <div className="relative z-10 grid h-full w-full grid-cols-12 items-end gap-[4px]">
                    {oneYearData.months.map((bucket, idx) => {
                      const isPeak = oneYearData.peak?.key === bucket.key && bucket.count > 0;
                      const isHovered = hoveredMonth?.key === bucket.key;
                      const isDimmed = hoveredMonth !== null && !isHovered;
                      const heightPct =
                        bucket.count === 0
                          ? 6
                          : Math.max(
                              12,
                              Math.round(
                                (bucket.count / Math.max(1, oneYearData.maxCount)) * 100,
                              ),
                            );

                      return (
                        <button
                          key={bucket.key}
                          type="button"
                          onMouseEnter={() => setHoveredMonth(bucket)}
                          onFocus={() => setHoveredMonth(bucket)}
                          onBlur={() => setHoveredMonth(null)}
                          aria-label={`${bucket.fullLabel}: ${bucket.count} contributions`}
                          title={`${bucket.fullLabel}: ${bucket.count} contributions`}
                          className="group/bar flex h-full w-full flex-col justify-end focus-visible:outline-none"
                        >
                          <motion.span
                            initial={
                              prefersReducedMotion
                                ? false
                                : { scaleY: 0.15, opacity: 0.5 }
                            }
                            animate={{ scaleY: 1, opacity: isDimmed ? 0.4 : 1 }}
                            transition={{
                              duration: 0.24,
                              delay: prefersReducedMotion ? 0 : idx * 0.014,
                              ease: EASE_OUT,
                            }}
                            style={{
                              height: `${heightPct}%`,
                              transformOrigin: 'bottom',
                            }}
                            className={cn(
                              'w-full rounded-t-[3px] rounded-b-[1px] transition-[filter,box-shadow] duration-150 ease-smooth-out group-focus-visible/bar:ring-1 group-focus-visible/bar:ring-white/80',
                              getBarColor(bucket.count, oneYearData.maxCount, isPeak),
                              isHovered && 'brightness-125',
                            )}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Month initials axis */}
                <div
                  className="grid w-full grid-cols-12 gap-[4px] text-center text-[8.5px] font-medium leading-none tabular-nums"
                  aria-hidden="true"
                >
                  {oneYearData.months.map((bucket) => {
                    const isHovered = hoveredMonth?.key === bucket.key;
                    const isPeak = oneYearData.peak?.key === bucket.key;
                    return (
                      <span
                        key={bucket.key}
                        className={cn(
                          'transition-colors duration-100',
                          isHovered
                            ? 'text-white'
                            : isPeak
                              ? 'text-[#56d364]'
                              : 'text-[#6e7681]',
                        )}
                      >
                        {bucket.letter}
                      </span>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Row 4: Quiet Context-Aware Footer Readout */}
        <div className="flex items-center justify-between gap-2 text-[9.5px] text-[#7d8590] tabular-nums">
          {range === '6m' ? (
            hoveredDay ? (
              <span className="truncate font-medium text-[#c9d1d9]">
                {formatContributionDate(hoveredDay.date)} ·{' '}
                <span className="text-[#56d364]">
                  {hoveredDay.count}{' '}
                  {hoveredDay.count === 1 ? 'commit' : 'commits'}
                </span>
              </span>
            ) : (
              <>
                <span className="truncate">
                  {sixMonthData.spanLabel} · {sixMonthData.activeDays}d active
                </span>
                <span
                  className="inline-flex shrink-0 items-center gap-[3px]"
                  aria-hidden="true"
                >
                  <span className="mr-0.5 text-[8.5px] text-[#6e7681]">Less</span>
                  {[0, 1, 2, 3, 4].map((lvl) => (
                    <span
                      key={lvl}
                      className={cn(
                        'h-[6px] w-[6px] rounded-[1.5px]',
                        getLevelColor(lvl),
                      )}
                    />
                  ))}
                  <span className="ml-0.5 text-[8.5px] text-[#6e7681]">More</span>
                </span>
              </>
            )
          ) : hoveredMonth ? (
            <span className="truncate font-medium text-[#c9d1d9]">
              {hoveredMonth.fullLabel} ·{' '}
              <span className="text-[#56d364]">
                {hoveredMonth.count.toLocaleString()} commits
              </span>
              {!isCompact && (
                <span className="text-[#7d8590]">
                  {' '}
                  ({hoveredMonth.activeDays}d)
                </span>
              )}
            </span>
          ) : (
            <>
              <span className="truncate">
                {oneYearData.peak
                  ? `Peak ${oneYearData.peak.shortLabel} (${oneYearData.peak.count})`
                  : '12-month overview'}
              </span>
              <span className="shrink-0 text-[#6e7681]">
                {stats.streak}d streak
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
