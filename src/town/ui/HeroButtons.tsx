import type { CSSProperties } from 'react';
import { CTA, inertIf } from './classes';

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
);
