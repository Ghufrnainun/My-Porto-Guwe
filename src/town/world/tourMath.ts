import { CatmullRomCurve3, Vector3 } from 'three';

/** Road control points (x, z), one per stop. */
const ROAD: readonly (readonly [number, number])[] = [
  [0, 0], [5, -15], [-4, -34], [-7, -50], [4, -72], [7, -88], [-3, -108],
  [5, -122], [6, -140], [2, -156], [4, -172], [0, -198], [0, -231],
];

/** One control point per stop. Extra stops continue straight on, fewer use the first ones. */
export function roadPoints(count: number): Vector3[] {
  const out: Vector3[] = [];
  for (let i = 0; i < Math.max(2, count); i++) {
    const p = ROAD[i];
    const last = ROAD[ROAD.length - 1];
    out.push(p ? new Vector3(p[0], 0, p[1]) : new Vector3(0, 0, last[1] - 26 * (i - ROAD.length + 1)));
  }
  return out;
}

export const makePath = (count: number) => new CatmullRomCurve3(roadPoints(count));

/**
 * Tour position (stop units, 0..n) to path parameter (0..1).
 * The car slows down near every stop but never stands still.
 */
export function tourToPath(tour: number, n: number): number {
  const x = Math.min(n, Math.max(0, tour));
  const i = Math.min(n - 1, Math.floor(x));
  const f = x - i;
  return (i + f - (0.7 * Math.sin(2 * Math.PI * f)) / (2 * Math.PI)) / n;
}

/** Tour position whose path point is nearest to (x, z). */
export function nearestTour(path: CatmullRomCurve3, n: number, x: number, z: number): number {
  const p = new Vector3();
  let best = 0;
  let bestD = Infinity;
  for (let k = 0; k <= n * 50; k++) {
    const tour = k / 50;
    path.getPoint(tourToPath(tour, n), p);
    const d = (p.x - x) ** 2 + (p.z - z) ** 2;
    if (d < bestD) {
      bestD = d;
      best = tour;
    }
  }
  return best;
}

const smooth01 = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** The hill at "Bukit": the road climbs after the AI site and the name stands on top. */
export const HILL = { top: 5.5, foot: -178, crest: -208, back: -285, edge: [24, 46] } as const;

/** Ground height at (x, z). Flat everywhere except the hill before the ending. */
export function groundHeight(x: number, z: number): number {
  const along = smooth01(HILL.foot, HILL.crest, z) * (1 - smooth01(HILL.back, HILL.back - 30, z));
  return HILL.top * along * (1 - smooth01(HILL.edge[0], HILL.edge[1], Math.abs(x)));
}
