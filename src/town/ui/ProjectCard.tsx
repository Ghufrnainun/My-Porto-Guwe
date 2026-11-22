import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { TOWN_HEX, hostOf } from '../content';
import type { ProjectStop } from '../types';
import { FOCUS, MONO } from './classes';

interface Props {
  stop: ProjectStop | null;
  /** Where on screen the stop's building is, so the card can fly out of it. */
  origin: () => { x: number; y: number } | null;
  onOpen: (stop: ProjectStop, from: DOMRect) => void;
}

/** A stop that is opened. Sits on the side of the road opposite its building. */
export const ProjectCard = ({ stop, origin, onOpen }: Props) => {
  const wrap = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(stop);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (stop) setShown(stop);
    else setOn(false);
  }, [stop]);

  // start at the building, then let the transition bring the card home
  useLayoutEffect(() => {
    const w = wrap.current;
    const c = card.current;
    if (!stop || shown !== stop || !w || !c) return;
    const r = w.getBoundingClientRect();
    const o = origin();
    if (o) {
      c.style.setProperty('--fx', `${o.x - r.left - r.width / 2}px`);
      c.style.setProperty('--fy', `${o.y - r.top - r.height / 2}px`);
    }
    void c.offsetWidth;
    setOn(true);
  }, [stop, shown, origin]);

  const tilt = (e: PointerEvent<HTMLDivElement>) => {
    const r = wrap.current?.getBoundingClientRect();
    if (!r) return;
    e.currentTarget.style.setProperty('--x', String(((e.clientX - r.left) / r.width) * 2 - 1));
    e.currentTarget.style.setProperty('--y', String(((e.clientY - r.top) / r.height) * 2 - 1));
  };
  const level = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty('--x', '0');
    e.currentTarget.style.setProperty('--y', '0');
  };
  const open = () => shown && card.current && onOpen(shown, card.current.getBoundingClientRect());
  const key = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || (e.key !== 'Enter' && e.key !== ' ')) return;
    e.preventDefault();
    open();
  };

  const left = shown?.side === 1;
  // --ch is the card height on wide windows. In small windows (`sheet`) the card is a bottom sheet: full width less a
  // margin, as tall as its content, above the safe area; the whole card is still the tap target

  return (
    <div
      ref={wrap}
      className={`pointer-events-none fixed top-1/2 z-[3] [--ch:min(560px,68vh)] -mt-[calc(var(--ch)/2)] h-[var(--ch)] w-[calc(var(--ch)*.714)] [perspective:1100px] sheet:inset-x-3 sheet:bottom-[max(12px,env(safe-area-inset-bottom))] sheet:top-auto sheet:mx-auto sheet:mt-0 sheet:h-auto sheet:w-auto sheet:max-w-[560px] ${left ? 'wide:left-[7%]' : 'wide:right-[7%]'}`}
    >
      {shown && (
        <div
          ref={card}
          role="button"
          tabIndex={on ? 0 : -1}
          aria-hidden={!on}
          aria-label={`Open project: ${shown.name}`}
          onClick={open}
          onKeyDown={key}
          onPointerMove={tilt}
          onPointerLeave={level}
          style={{ background: TOWN_HEX[shown.color] }}
          className={`town-card relative flex h-full w-full cursor-pointer flex-col justify-between overflow-hidden rounded-3xl p-7 text-left font-grotesk text-lg text-town-ink sheet:max-h-[calc(100dvh-84px)] sheet:gap-3 sheet:p-5 sheet:text-base shadow-[0_30px_60px_-24px_rgba(0,0,0,.55)] ${on ? 'on' : ''} ${FOCUS}`}
        >
          <div>
            <span className={MONO}>
              {shown.role} · {shown.year}
            </span>
            <div className="mt-1.5 font-anton text-[84px] leading-[.9] sheet:text-[40px]">{shown.number}</div>
          </div>
          <div>
            <h3 className="mb-3 font-anton text-[clamp(44px,6.4vh,64px)] uppercase leading-[.9] sheet:mb-2 sheet:text-[clamp(30px,8vw,44px)]">{shown.name}</h3>
            <p className="leading-snug">{shown.summary}</p>
            <p className={`mt-3 ${MONO}`}>{shown.stack.join(' · ')}</p>
            <p className="mt-4 flex min-h-[48px] flex-wrap items-center justify-between gap-x-4 border-t-[1.5px] border-current pt-3 text-lg font-semibold sheet:mt-3 sheet:pt-1 sheet:text-base">
              <span>Open project →</span>
              {shown.liveUrl && (
                <a
                  href={shown.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  tabIndex={on ? 0 : -1}
                  onClick={(e) => e.stopPropagation()}
                  className={`inline-flex min-h-[44px] items-center text-base underline underline-offset-4 ${FOCUS}`}
                >
                  {hostOf(shown.liveUrl)} ↗
                </a>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
