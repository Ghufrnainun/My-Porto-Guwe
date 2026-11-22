import { useRef, type PointerEvent } from 'react';

const BLUE = '#1f3bff';
const YELLOW = '#ffd60a';
const GREEN = '#19b866';
const RED = '#ff4a2b';
const PAPER = '#f3f1ea';
const INK = '#141414';

/** Flat shapes in the town colours, drawn on a 100 x 100 board with room left for the paper edge. */
const ART = {
  shuttle: (
    <>
      <polygon points="30,20 70,20 60,66 40,66" fill={YELLOW} />
      <polygon points="38.3,58 61.7,58 60,66 40,66" fill={BLUE} />
      <circle cx="50" cy="74" r="13" fill={RED} />
    </>
  ),
  mail: (
    <>
      <rect x="14" y="28" width="72" height="48" rx="7" fill={BLUE} />
      <polygon points="16,31 84,31 50,58" fill="#1630d8" />
      <circle cx="50" cy="56" r="7" fill={YELLOW} />
    </>
  ),
  sparkle: (
    <>
      <circle cx="50" cy="50" r="35" fill={YELLOW} />
      <path d="M50 22C53 40 60 47 78 50C60 53 53 60 50 78C47 60 40 53 22 50C40 47 47 40 50 22Z" fill={GREEN} />
    </>
  ),
  key: (
    <>
      <circle cx="32" cy="50" r="19" fill={YELLOW} />
      <rect x="46" y="45" width="42" height="10" rx="3" fill={YELLOW} />
      <rect x="68" y="53" width="7" height="12" rx="2" fill={YELLOW} />
      <rect x="79" y="53" width="7" height="9" rx="2" fill={YELLOW} />
      <circle cx="29" cy="50" r="7" fill={INK} />
    </>
  ),
  rosette: (
    <>
      <polygon points="38,56 30,88 43,80 52,62" fill={RED} />
      <polygon points="62,56 70,88 57,80 48,62" fill={RED} />
      <circle cx="50" cy="40" r="25" fill={BLUE} />
      <polyline points="39,40 47,48 62,33" fill="none" stroke={PAPER} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  flag: (
    <>
      <polygon points="29,18 82,33 29,50" fill={BLUE} />
      <rect x="23" y="13" width="7" height="75" rx="3.5" fill={INK} />
    </>
  ),
  hi: (
    <>
      <polygon points="30,60 24,86 50,62" fill={YELLOW} />
      <rect x="12" y="18" width="76" height="48" rx="19" fill={YELLOW} />
      <text x="50" y="54" textAnchor="middle" fontFamily="Anton, Impact, sans-serif" fontSize="31" fill={INK}>
        HI!
      </text>
    </>
  ),
  car: (
    <>
      <path d="M27 50 36 30H64L75 50Z" fill={BLUE} />
      <rect x="10" y="46" width="80" height="25" rx="10" fill={BLUE} />
      <polygon points="39,35 48,35 48,46 34,46" fill="#cfe0ff" />
      <polygon points="53,35 62,35 68,46 53,46" fill="#cfe0ff" />
      <rect x="83" y="52" width="6" height="7" rx="2" fill={YELLOW} />
      <circle cx="30" cy="72" r="9" fill={INK} />
      <circle cx="70" cy="72" r="9" fill={INK} />
      <circle cx="30" cy="72" r="3" fill={PAPER} />
      <circle cx="70" cy="72" r="3" fill={PAPER} />
    </>
  ),
  cone: (
    <>
      <polygon points="43,16 57,16 72,76 28,76" fill={RED} />
      <polygon points="38.9,34 61.1,34 64.2,46 35.8,46" fill={PAPER} />
      <rect x="17" y="74" width="66" height="11" rx="4" fill={RED} />
    </>
  ),
  open: (
    <>
      <rect x="5" y="33" width="90" height="34" rx="17" fill={GREEN} />
      <circle cx="19" cy="50" r="5" fill={PAPER} />
      <text x="60" y="54.5" textAnchor="middle" fontFamily="Anton, Impact, sans-serif" fontSize="11" letterSpacing=".4" fill={INK}>
        OPEN TO WORK
      </text>
    </>
  ),
} as const;

export type StickerName = keyof typeof ART;

interface Props {
  name: StickerName;
  /** Degrees it sits at; hovering straightens it. */
  tilt?: number;
  /** Position and width: the sticker is a square as wide as this says. */
  className?: string;
}

/**
 * A die-cut sticker: the art, a paper edge cut around it, a soft shadow.
 * Decoration only, so it is hidden from assistive tech. A mouse can pick it up and put it somewhere else;
 * touch leaves it alone so a finger on a sticker still scrolls the page.
 */
export const Sticker = ({ name, tilt = -8, className = '' }: Props) => {
  const at = useRef({ x: 0, y: 0 });
  const grab = useRef<{ px: number; py: number; x: number; y: number } | null>(null);

  const down = (e: PointerEvent<HTMLSpanElement>) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    grab.current = { px: e.clientX, py: e.clientY, ...at.current };
  };
  const move = (e: PointerEvent<HTMLSpanElement>) => {
    const g = grab.current;
    if (!g) return;
    at.current = { x: g.x + e.clientX - g.px, y: g.y + e.clientY - g.py };
    e.currentTarget.style.translate = `${at.current.x}px ${at.current.y}px`;
  };
  const up = () => {
    grab.current = null;
  };

  return (
    <span
      aria-hidden="true"
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      className={`group pointer-events-auto block aspect-square select-none fine:cursor-grab fine:active:cursor-grabbing ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        style={{ rotate: `${tilt}deg` }}
        className="block h-full w-full overflow-visible drop-shadow-[0_3px_0_rgba(20,20,20,.22)] transition-[scale,rotate,filter] duration-200 ease-out group-hover:![rotate:0deg] group-hover:scale-110 group-hover:drop-shadow-[0_10px_8px_rgba(20,20,20,.28)] motion-reduce:transition-none"
      >
        {/* the paper edge: the same shapes, painted paper and grown by a thick stroke */}
        <g className="[&_*]:fill-[#f3f1ea] [&_*]:stroke-[#f3f1ea] [&_*]:[stroke-linejoin:round] [&_*]:[stroke-width:9]">{ART[name]}</g>
        {ART[name]}
      </svg>
    </span>
  );
};
