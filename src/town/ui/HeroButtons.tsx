import type { CSSProperties } from 'react';
import { CTA, MONO, inertIf } from './classes';

interface Props {
  /** True once the visitor has scrolled off the hero: the buttons stop taking clicks. */
  gone: boolean;
  onExplore: () => void;
  onWork: () => void;
}

/** Slides down and fades with --hero (0..1), which the page sets every frame. */
const follow: CSSProperties = {
  transform: 'translateY(calc(var(--hero, 0) * 160px))',
  opacity: 'calc(1 - var(--hero, 0) * 3.4)',
};

export const HeroButtons = ({ gone, onExplore, onWork }: Props) => (
  <>
  {/* says what scrolling does; on phones the Explore button carries it */}
  <div
    aria-hidden
    className={`pointer-events-none fixed bottom-10 right-[var(--town-pad)] z-[4] hidden rounded-full bg-town-bg px-3.5 py-2 text-town-fg sm:block ${MONO}`}
    style={follow}
  >
    scroll to walk through the town
  </div>
  <div
    className={`fixed bottom-10 left-[var(--town-pad)] z-[4] flex flex-wrap gap-2.5 will-change-transform ${gone ? 'pointer-events-none' : ''}`}
    style={follow}
    {...inertIf(gone)}
  >
    <button type="button" onClick={onExplore} className={`${CTA} border-town-ink bg-town-yellow text-town-ink`}>
      Explore ↓
    </button>
    <button type="button" onClick={onWork} className={`${CTA} border-white text-white`}>
      Just show me the work
    </button>
  </div>
  </>
);
