import { OWNER } from '../content';
import { embedded } from '../embed';
import { FOCUS, MONO, PILL } from './classes';

interface Props {
  district: string;
  night: boolean;
  onToggleNight: () => void;
  onWork: () => void;
}

export const TopBar = ({ district, night, onToggleNight, onWork }: Props) => (
  <>
    <div
      // a solid pill in the page colours: readable on the blue page and on every district ground.
      // Inside the GanOS window it moves right, clear of the window's close, minimise and zoom buttons.
      className={`pointer-events-none fixed ${embedded ? "left-[calc(var(--town-pad)+64px)]" : "left-[var(--town-pad)]"} top-3 z-[5] rounded-full bg-town-bg px-3.5 py-2 text-town-fg ${MONO} text-[12px]`}
      aria-hidden
    >
      G — <span className="max-sm:hidden">{OWNER} · </span>
      {district || 'start'}
    </div>
    <div className="fixed right-[var(--town-pad)] top-3 z-[5] flex items-center gap-2 text-town-fg">
      {/* on its own page the town needs a way back to the desktop; inside the GanOS window, the window's close button is that way */}
      {!embedded && (
        <a href="/" aria-label="Back to desktop" className={`${PILL} ${MONO} border-transparent bg-town-bg`}>
          ←<span className="max-sm:hidden">&nbsp;Desktop</span>
        </a>
      )}
      {/* a switch: the knob is a sun by day; it slides across and becomes a moon at night (CSS in index.css) */}
      <button
        type="button"
        onClick={onToggleNight}
        aria-label="Night mode"
        aria-pressed={night}
        title={night ? 'Switch to day' : 'Switch to night'}
        className={`inline-flex h-11 items-center rounded-full ${FOCUS}`}
      >
        <span className="town-switch" aria-hidden>
          <span className="town-switch-knob" />
        </span>
      </button>
      <button type="button" onClick={onWork} className={`${PILL} ${MONO} border-transparent bg-town-bg`}>
        <span className="max-sm:hidden">just show me the work</span>
        <span className="sm:hidden">all work</span>
      </button>
    </div>
  </>
);
