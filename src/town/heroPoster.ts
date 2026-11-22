import type { HeroCopy } from './types';

/**
 * Paints the hero as a poster on a transparent canvas, in white. Used twice with the same numbers:
 * by the world (a texture lying on the blue page) and by the DOM overlay shown until the world is ready.
 * `w`/`h` are the viewport in CSS px, `scale` is canvas px per CSS px.
 * Layout: kicker under the top bar, the name as large as the column allows, the line in italic under it,
 * the body just above the Explore buttons. The column stops short of the road on the right.
 */
export function paintHero(ctx: CanvasRenderingContext2D, w: number, h: number, scale: number, hero: HeroCopy) {
  const clamp = (lo: number, x: number, hi: number) => Math.min(hi, Math.max(lo, x));
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.save();
  ctx.scale(scale, scale);
  ctx.fillStyle = '#fff';
  ctx.textBaseline = 'alphabetic';

  const pad = clamp(16, w * 0.04, 56); // same as --town-pad
  const wide = w >= 640;
  // the road and its first signs cross the page at 65-85% of the width on every aspect: stay left of them
  const col = w * 0.62 - pad;
  const top = 78; // clear of the top bar
  const foot = h - (wide ? 116 : 176); // clear of the Explore buttons (they wrap on phones)
  const short = Math.min(w, h);

  const wrap = (tokens: string[], sep: string, max: number) => {
    const lines: string[] = [];
    for (const t of tokens) {
      const last = lines[lines.length - 1];
      if (last !== undefined && ctx.measureText(last + sep + t).width <= max) lines[lines.length - 1] = last + sep + t;
      else lines.push(t);
    }
    return lines;
  };

  // kicker
  const k = clamp(13, short * 0.03, 18);
  ctx.font = `700 ${k}px "JetBrains Mono"`;
  ctx.letterSpacing = `${(k * 0.1).toFixed(1)}px`;
  const kicker = wrap(hero.kicker.split(' · '), ' · ', col);
  kicker.forEach((line, i) => ctx.fillText(line, pad, top + k + i * k * 1.5));
  ctx.letterSpacing = '0px';
  const below = top + k * 1.5 * kicker.length;

  // body
  const b = clamp(14, short * 0.032, 21);
  ctx.font = `${b}px "Schibsted Grotesk"`;
  const body = hero.body.flatMap((line) => wrap(line.split(' '), ' ', col));
  const bodyTop = foot - body.length * b * 1.45;
  body.forEach((line, i) => ctx.fillText(line, pad, bodyTop + (i + 1) * b * 1.45 - b * 0.35));

  // the name: try every way to break it into lines and keep the one that sets it largest
  const words = hero.lines[0].toUpperCase().split(' ');
  ctx.font = '100px Anton';
  const splits: string[][] = [words];
  for (let i = 1; i < words.length; i++) splits.push([words.slice(0, i).join(' '), words.slice(i).join(' ')]);
  if (words.length > 2) splits.push(words);
  ctx.font = 'italic 100px "Instrument Serif"';
  const italic100 = ctx.measureText(hero.lines[1]).width;
  const gap = clamp(12, h * 0.04, 40);
  const room = bodyTop - below - gap * 2;
  ctx.font = '100px Anton';
  let best = { lines: words, size: 0, sub: 0 };
  for (const lines of splits) {
    const widest = Math.max(...lines.map((l) => ctx.measureText(l).width));
    const byWidth = (col / widest) * 100;
    const size = Math.min(byWidth, room / (lines.length * 0.9 + 0.62), h * 0.22);
    if (size > best.size) best = { lines, size, sub: Math.min(size * 0.62, (col / italic100) * 100) };
  }
  const { lines, size, sub } = best;
  const block = lines.length * size * 0.9 + sub;
  const y0 = below + gap + Math.max(0, (room - block) / 2);
  ctx.font = `${size}px Anton`;
  lines.forEach((line, i) => ctx.fillText(line, pad - size * 0.02, y0 + (i + 1) * size * 0.9 - size * 0.06));
  ctx.font = `italic ${sub}px "Instrument Serif"`;
  ctx.fillText(hero.lines[1], pad, y0 + lines.length * size * 0.9 + sub * 0.82);
  ctx.restore();
}

export const HERO_FONTS = ['700 10px "JetBrains Mono"', '10px Anton', 'italic 10px "Instrument Serif"', '10px "Schibsted Grotesk"'] as const;
