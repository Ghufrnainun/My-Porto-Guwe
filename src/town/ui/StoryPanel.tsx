import { useEffect, useState } from 'react';
import { TOWN_HEX, TOWN_NIGHT_PANEL, TOWN_NIGHT_TEXT } from '../content';
import type { StoryRow, StoryStop } from '../types';
import { Accent } from './Accent';
import { FOCUS, MONO, inertIf } from './classes';

const Row = ({ row, dense }: { row: StoryRow; dense: boolean }) => {
  const body = (
    <>
      {/* side by side on wide panels; in the bottom sheet the period goes under the label */}
      <span className="flex items-baseline justify-between gap-3 sheet:flex-col sheet:gap-0.5">
        <b className="font-semibold">{row.label}</b>
        <span className={`shrink-0 text-right sheet:text-left ${MONO}`}>
          {row.detail}
          {row.href ? ' ↗' : ''}
        </span>
      </span>
      {row.note && <span className={`mt-0.5 block opacity-80 ${dense ? 'text-[13px]' : 'text-sm'}`}>{row.note}</span>}
    </>
  );
  return (
    <li className={`border-t-2 border-current ${dense ? 'py-1.5' : 'py-2'}`}>
      {row.href ? (
        <a href={row.href} target="_blank" rel="noreferrer" className={`block min-h-[44px] ${FOCUS}`}>
          {body}
        </a>
      ) : (
        body
      )}
    </li>
  );
};

/**
 * A stop that is read: a circle of the stop's colour swells in from the right and carries the text.
 * Narrow or short windows get a bottom sheet instead: capped height so the town stays visible above it,
 * scrolling inside itself (data-lenis-prevent keeps the page scroll out of it).
 */
export const StoryPanel = ({ stop, night }: { stop: StoryStop | null; night: boolean }) => {
  // keep the last stop mounted so the text does not vanish while the circle shrinks
  const [shown, setShown] = useState(stop);
  useEffect(() => {
    if (stop) setShown(stop);
  }, [stop]);

  const on = stop !== null;
  const key = shown?.color ?? 'yellow';
  const blue = key === 'blue';
  const flood = night ? TOWN_NIGHT_PANEL[key] : TOWN_HEX[key];
  const text = night ? TOWN_NIGHT_TEXT[key] : blue ? '#ffffff' : '#141414';
  const dense = (shown?.rows?.length ?? 0) > 3;

  return (
    <>
      <div
        aria-hidden
        className={`fixed left-full top-1/2 z-[2] -ml-[48vmax] -mt-[48vmax] h-[96vmax] w-[96vmax] rounded-full transition-transform duration-700 ease-town will-change-transform sheet:hidden ${on ? 'scale-100' : 'scale-0'}`}
        style={{ background: flood }}
      />
      <section
        className={`fixed right-[4%] top-1/2 z-[3] w-[min(38vw,580px)] font-grotesk transition-[opacity,transform] duration-500 ease-town sheet:inset-x-0 sheet:bottom-0 sheet:top-auto sheet:max-h-[min(56vh,560px)] sheet:w-auto sheet:overflow-y-auto sheet:overscroll-contain sheet:rounded-t-[28px] sheet:bg-[var(--flood)] sheet:px-[var(--town-pad)] sheet:pb-6 sheet:pt-5 sheet:text-base ${dense ? 'text-[15px]' : 'text-[19px]'} ${on ? '-translate-y-1/2 opacity-100 delay-[250ms] sheet:translate-y-0' : 'pointer-events-none -translate-y-[46%] opacity-0 sheet:translate-y-full'}`}
        style={{ color: text, ['--flood' as string]: flood }}
        data-lenis-prevent
        {...inertIf(!on)}
      >
        {shown && (
          <>
            <span className={MONO}>{shown.kicker}</span>
            <h2
              className={`mb-4 mt-2.5 font-anton uppercase leading-[.88] sheet:mb-3 sheet:text-[clamp(30px,7vw,48px)] ${dense ? 'text-[clamp(36px,4.4vw,76px)]' : 'text-[clamp(48px,6.6vw,118px)]'}`}
            >
              <Accent text={shown.heading} />
            </h2>
            {shown.body && <p className="leading-[1.5]">{shown.body}</p>}
            {shown.rows && (
              <ul className="mt-3.5 max-h-[46vh] overflow-y-auto sheet:max-h-none sheet:overflow-visible" data-lenis-prevent>
                {shown.rows.map((r) => (
                  <Row key={r.label} row={r} dense={dense} />
                ))}
              </ul>
            )}
          </>
        )}
      </section>
    </>
  );
};
