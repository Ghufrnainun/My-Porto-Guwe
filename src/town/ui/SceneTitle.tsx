import { useEffect, useState } from 'react';

interface Props {
  title: readonly [string, string];
  hidden: boolean;
  /** The ground under the title is dark (the blue page, or night): set it in white. */
  onDark: boolean;
  /** Project stops: after the big title has been read once, a small "01 / 06" takes its place. */
  counter?: string;
}

const letters = (text: string, from: number) =>
  [...text].map((c, k) => (
    <b key={k} style={{ ['--i' as string]: from + k }}>
      {c === ' ' ? ' ' : c}
    </b>
  ));

const Lines = ({ title }: { title: readonly [string, string] }) => {
  const [inn, setInn] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setInn(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div className={`town-title ${inn ? 'in' : ''}`}>
      <span>{letters(title[0], 0)}</span>
      <span className="font-accent normal-case italic tracking-[-.02em]">{letters(title[1], title[0].length + 4)}</span>
    </div>
  );
};

/**
 * Two giant lines, bottom left. Decoration: the same words are headings in SceneList.
 * A thin halo in the opposite tone sits under the letters (painted before the fill), so they keep their contrast
 * where the road or a building passes beneath them.
 */
export const SceneTitle = ({ title, hidden, onDark, counter }: Props) => {
  const key = title.join('|');
  const counts = Boolean(counter);
  const [settled, setSettled] = useState(false);
  // a new title is shown large; in a counted district it settles into the counter after it has been read
  useEffect(() => {
    setSettled(false);
    if (!counts) return;
    const id = window.setTimeout(() => setSettled(true), 2400);
    return () => window.clearTimeout(id);
  }, [key, counts]);
  const small = settled && counter;

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed bottom-[34px] left-[var(--town-pad)] z-[5] font-anton uppercase leading-[.9] transition-[opacity,color] duration-300 sheet:hidden ${small ? 'text-[clamp(32px,3.4vw,52px)]' : 'text-[clamp(44px,8vw,128px)]'} [paint-order:stroke_fill] ${onDark ? 'text-white [-webkit-text-stroke:0.07em_#141414]' : 'text-town-ink [-webkit-text-stroke:0.07em_#f3f1ea]'} ${hidden ? 'opacity-0' : 'opacity-100'}`}
    >
      {small ? <span className="tabular-nums">{counter}</span> : title[0] && <Lines key={key} title={title} />}
    </div>
  );
};
