import { useState } from 'react';
import { EMAIL, END_LINKS, OWNER } from '../content';
import { FOCUS, MONO, PILL, inertIf } from './classes';
import { Sticker } from './Sticker';

const STICKER = 'absolute w-[clamp(60px,9vw,116px)]';

const LINK = `inline-flex min-h-[48px] items-center px-2 text-lg font-semibold underline underline-offset-4 ${FOCUS}`;

export const EndLinks = ({ visible, onTop }: { visible: boolean; onTop: () => void }) => {
  const [copied, setCopied] = useState(false);
  const [reveal, setReveal] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setReveal(true);
    }
  };

  return (
    <>
    {/* stickers on the empty sky and grass around the name: decoration, free to drag about */}
    <div
      className={`pointer-events-none fixed inset-0 z-[4] transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0 [&_*]:!pointer-events-none'}`}
      {...inertIf(!visible)}
    >
      <Sticker name="hi" tilt={-10} className={`left-[7%] top-[15%] ${STICKER}`} />
      <Sticker name="car" tilt={7} className={`right-[7%] top-[17%] ${STICKER}`} />
      <Sticker name="open" tilt={-6} className={`left-[9%] top-[58%] ${STICKER} !w-[clamp(92px,13vw,168px)]`} />
      <Sticker name="sparkle" tilt={12} className={`right-[10%] top-[60%] ${STICKER}`} />
    </div>
    <div
      className={`fixed inset-x-0 bottom-5 z-[5] px-[var(--town-pad)] text-center text-town-fg transition-opacity duration-500 ${visible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      {...inertIf(!visible)}
    >
      {/* sits below the name: the end camera keeps the letters in the upper half of the screen */}
      <p className="font-accent text-[clamp(40px,5vw,76px)] italic leading-[.9]">Say hi.</p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        {reveal ? (
          <span className="select-all font-semibold">{EMAIL}</span>
        ) : (
          <button type="button" onClick={copy} className={`${PILL} min-h-[48px] px-5 text-lg font-semibold md:min-h-[48px]`}>
            <span aria-live="polite">{copied ? 'copied ✓' : 'copy email'}</span>
          </button>
        )}
        {END_LINKS.map((l) =>
          l.internal ? (
            <a key={l.label} href={l.href} target="_top" className={LINK}>
              {l.label} →
            </a>
          ) : (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className={LINK}>
              {l.label} ↗
            </a>
          ),
        )}
      </div>
      <p className={`mt-1 flex items-center justify-center gap-3 opacity-70 ${MONO}`}>
        <span>
          © {new Date().getFullYear()} {OWNER}
        </span>
        <button type="button" onClick={onTop} className={`min-h-[44px] uppercase underline underline-offset-4 fine:min-h-0 ${FOCUS}`}>
          back to the start ↑
        </button>
      </p>
    </div>
    </>
  );
};
