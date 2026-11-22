import { useEffect, useRef } from 'react';
import { HERO } from '../content';
import { HERO_FONTS, paintHero } from '../heroPoster';

/** The hero poster in the DOM, painted by the same code as the world's texture, so the swap is invisible. */
export const HeroPoster = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const paint = () => {
      const c = ref.current;
      const ctx = c?.getContext('2d');
      if (!c || !ctx) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const s = Math.min(2, window.devicePixelRatio || 1);
      c.width = Math.round(w * s);
      c.height = Math.round(h * s);
      paintHero(ctx, w, h, s, HERO);
    };
    paint();
    const run = () => paint();
    Promise.all(HERO_FONTS.map((f) => document.fonts.load(f))).then(run, run);
    window.addEventListener('resize', paint);
    return () => window.removeEventListener('resize', paint);
  }, []);
  return <canvas ref={ref} aria-hidden className="absolute left-0 top-0 h-screen w-screen" />;
};
