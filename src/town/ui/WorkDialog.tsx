import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { FACTS, PROJECTS, TOWN_HEX } from '../content';
import type { ProjectStop } from '../types';
import { FOCUS, MONO, PILL } from './classes';

interface Props {
  open: boolean;
  onClose: () => void;
  onPick: (project: ProjectStop) => void;
}

/** "Just show me the work": every project on one sheet, no driving required. */
export const WorkDialog = ({ open, onClose, onPick }: Props) => {
  const dialog = useRef<HTMLDialogElement>(null);
  const [hover, setHover] = useState<{ project: ProjectStop; x: number; y: number } | null>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
    if (!open) setHover(null);
  }, [open]);

  const move = (e: PointerEvent<HTMLUListElement>) => {
    const slug = (e.target as HTMLElement).closest<HTMLElement>('[data-slug]')?.dataset.slug;
    const project = PROJECTS.find((p) => p.slug === slug);
    setHover(project && e.pointerType === 'mouse' ? { project, x: e.clientX, y: e.clientY } : null);
  };

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      data-lenis-prevent
      aria-label="All work"
      className="m-0 h-screen max-h-none w-screen max-w-none overflow-y-auto bg-town-bg p-0 font-grotesk text-town-fg open:animate-town-sheet"
    >
      <header className="sticky top-0 z-[1] flex items-end justify-between bg-town-bg px-[var(--town-pad)] pb-[18px] pt-7">
        <h2 className="font-anton text-[clamp(44px,7vw,110px)] uppercase leading-[.9]">
          All <i className="font-accent normal-case tracking-[-.02em]">work.</i>
        </h2>
        <button type="button" onClick={onClose} className={`${PILL} ${MONO}`}>
          close ✕
        </button>
      </header>
      <ul onPointerMove={move} onPointerLeave={() => setHover(null)}>
        {PROJECTS.map((p, k) => (
          <li key={p.slug} className="animate-town-row" style={{ animationDelay: `${k * 60 + 150}ms` }}>
            <button
              type="button"
              data-slug={p.slug}
              onClick={() => onPick(p)}
              style={{ ['--c' as string]: TOWN_HEX[p.color] } as CSSProperties}
              // fixed columns (role · year gets a set width), so every row's columns line up; the paper text of night
              // turns ink on the bright hover fill
              className={`group grid w-full grid-cols-[40px_minmax(0,1fr)] items-center gap-x-5 gap-y-1 border-t-2 border-current px-[var(--town-pad)] py-3.5 text-left transition-[background-color,padding] duration-300 ease-town hover:bg-[var(--c)] hover:pl-[calc(var(--town-pad)+28px)] hover:text-town-ink focus-visible:bg-[var(--c)] focus-visible:text-town-ink md:grid-cols-[70px_minmax(0,1.2fr)_minmax(0,1fr)_16rem] ${FOCUS}`}
            >
              <span className="font-anton text-[28px] opacity-[.35] group-hover:opacity-100 group-focus-visible:opacity-100">{p.number}</span>
              <span className="break-words font-anton text-[clamp(34px,5.4vw,84px)] uppercase leading-[.9]">{p.name}</span>
              <span className="max-md:col-start-2">{p.summary}</span>
              <span className={`max-md:col-start-2 ${MONO}`}>
                {p.role} · {p.year} →
              </span>
            </button>
          </li>
        ))}
      </ul>
      <footer className={`flex flex-wrap gap-x-7 gap-y-2.5 border-t-2 border-current px-[var(--town-pad)] pb-10 pt-[22px] ${MONO}`}>
        {FACTS.map((f) => (
          <span key={f}>{f}</span>
        ))}
      </footer>
      {hover && (
        <div
          aria-hidden
          style={{ left: hover.x, top: hover.y, background: TOWN_HEX[hover.project.color] }}
          className="pointer-events-none fixed z-[9] h-[150px] w-[230px] -translate-y-1/2 translate-x-[18px] -rotate-[4deg] overflow-hidden rounded-xl p-3 font-anton text-[70px] leading-[.8] text-town-ink shadow-[0_20px_40px_-16px_rgba(0,0,0,.55)] max-md:hidden"
        >
          {hover.project.image ? (
            <img src={hover.project.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            hover.project.number
          )}
        </div>
      )}
    </dialog>
  );
};
