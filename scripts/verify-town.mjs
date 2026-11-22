// Checks the pure maths behind the town tour: progress → road position, and road position → progress.
import assert from 'node:assert/strict';
import { groundHeight, makePath, nearestTour, roadPoints, tourToPath } from '../src/town/world/tourMath.ts';

const STOPS = 13;
const N = STOPS - 1;

assert.equal(roadPoints(STOPS).length, STOPS, 'one road point per stop');
assert.equal(roadPoints(15).length, 15, 'extra stops still get a road point');
assert.equal(tourToPath(0, N), 0, 'the tour starts at the start of the road');
assert.equal(tourToPath(N, N), 1, 'the tour ends at the end of the road');
assert.equal(tourToPath(-3, N), 0, 'clamped below');
assert.equal(tourToPath(N + 3, N), 1, 'clamped above');

let previous = -1;
for (let k = 0; k <= N * 200; k++) {
  const t = tourToPath(k / 200, N);
  assert.ok(t >= previous, `the car never drives backwards (tour ${k / 200})`);
  previous = t;
}
for (let i = 0; i <= N; i++) assert.ok(Math.abs(tourToPath(i, N) - i / N) < 1e-9, `stop ${i} sits on its own road point`);

const path = makePath(STOPS);
for (const tour of [0, 0.4, 1, 2.5, 5.75, 9, 11.2, N]) {
  const p = path.getPoint(tourToPath(tour, N));
  const found = nearestTour(path, N, p.x, p.z);
  // near a stop the car barely moves, so a wide range of tour values maps to almost the same spot
  const q = path.getPoint(tourToPath(found, N));
  assert.ok(Math.hypot(p.x - q.x, p.z - q.z) < 0.3, `nearestTour finds the way back to tour ${tour}`);
  assert.ok(Math.abs(found - tour) < 0.35, `nearestTour(${tour}) returned ${found}`);
}

const at = (i) => roadPoints(STOPS)[i];
assert.equal(groundHeight(at(N - 2).x, at(N - 2).z), 0, 'the AI site stands on flat ground');
assert.ok(groundHeight(at(N - 1).x, at(N - 1).z) > 2, 'the road climbs at the Bukit gate');
assert.ok(groundHeight(at(N).x, at(N).z - 25) > 5, 'the name stands on the hilltop');
assert.equal(groundHeight(0, 0), 0, 'the hero page is flat');

console.log('town tour maths: ok');
