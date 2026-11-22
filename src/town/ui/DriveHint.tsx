import { MONO } from './classes';

/** Only where driving is possible (fine pointer, keyboard-sized window; see useTour). The page hides it over panels. */
export const DriveHint = ({ show, driving }: { show: boolean; driving: boolean }) =>
  show ? (
    <div
      className={`pointer-events-none fixed bottom-4 right-[var(--town-pad)] z-[5] hidden rounded-full bg-town-bg px-3.5 py-2 text-town-fg drive:block ${MONO}`}
    >
      {driving ? 'scroll or esc to rejoin the tour' : 'w a s d to drive'}
    </div>
  ) : null;
