import * as THREE from 'three';
import { C, smooth, type Kit } from './kit';
import { instance, type Instanced, type Models } from './models';

/** Commit levels, paper to navy: reads on every district colour. */
const LEVELS = [0xf3f1ea, 0xc9cdf5, 0x8d95e8, 0x4a54c9, 0x23275e];
// 4.6 apart: a lane of about 3.3 between two blocks, room for the car (1.3 wide) to drive between them
const COLUMNS = [-33.4, -28.8, -24.2, -19.6, 16, 20.6, 25.2];
const ROW = 3.4;
/** city_blocks.glb: whole buildings by commit level (see docs/town-models.md). */
const VARIANTS = [
  ['block_0a', 'block_0b', 'block_0c'],
  ['block_1a', 'block_1b', 'block_1c'],
  ['block_2a', 'block_2b', 'block_2c'],
  ['block_3a', 'block_3b'],
  ['block_4a', 'block_4b'],
] as const;

export interface City {
  /** The blocks' windows: dark glass by day, warm light at night (the world sets the emissive intensity). */
  windows: THREE.MeshToonMaterial;
  /** Colour of the block bodies; instance colours (the commit level) multiply with it. */
  bodyColor: THREE.Color;
  /** For the toonifier: city_blocks.glb's `block` and `window` parts get these instead of the shared ones. */
  materials: Record<string, THREE.Material>;
  /** Lamp heads: the world sets their colour per theme. */
  lamp: THREE.MeshBasicMaterial;
  lampColor: THREE.Color;
  lampGlow: THREE.MeshBasicMaterial;
  /** Builds the blocks, trees, lamps, benches and bushes from the models (or stand-ins). Call once. */
  attach(models: Models): void;
  /** Blocks rise as the car gets near; `grow` is 0 on the hero page and 1 in town. */
  update(carX: number, carZ: number, grow: number, time: number): void;
}

/** One block per day of the GitHub year (a week is one row along the road), plus trees, lamps, benches and bushes. */
export function buildCity(kit: Kit, path: THREE.CatmullRomCurve3, commits: readonly number[], sites: readonly THREE.Object3D[]): City {
  const { scene, mat, rnd, colliders } = kit;
  const body = kit.toon({ color: 0xffffff, vertexColors: true });
  const glass = kit.toon({ color: 0x2c3358, emissive: 0xffc04a, emissiveIntensity: 0, vertexColors: true });
  const o = new THREE.Object3D();

  /** One building per day of the GitHub year, picked by commit level: the busier the day, the taller and bluer. */
  interface Day {
    x: number;
    z: number;
    level: number;
    variant: number;
    /** Uniform scale (the models are 1 x 1 including their pavement) and a height jitter of up to 10 %. */
    w: number;
    h: number;
    /** Slot in its variant's instanced mesh. */
    slot: number;
    /** False when it would stand on the road or a stop's building. */
    fits: boolean;
  }
  const slots = VARIANTS.map((v) => v.map(() => 0));
  const days: Day[] = commits.map((n, k) => {
    const level = n > 30 ? 4 : n > 15 ? 3 : n > 6 ? 2 : n ? 1 : 0;
    const variant = Math.floor(rnd() * VARIANTS[level].length);
    return {
      x: COLUMNS[k % 7] + (rnd() - 0.5) * 0.5,
      z: 6 - Math.floor(k / 7) * ROW + (rnd() - 0.5) * 0.2,
      level,
      variant,
      w: 1.15 + rnd() * 0.25,
      h: 0.9 + rnd() * 0.2,
      slot: slots[level][variant]++,
      fits: true,
    };
  });

  // today's block is still being built
  const last = days[days.length - 1];
  const today = last ? kit.box(1.7, 0.3, 1.7, new THREE.MeshBasicMaterial({ color: C.yellow, wireframe: true }), last.x, last.z, 1.2) : null;
  if (today) today.castShadow = today.receiveShadow = false;

  // trees: [x, z, size], two kinds alternating; size 0 = left out (inside a building or the block columns)
  const trees: [number, number, number][] = [];
  for (let k = 0; k < 110; k++) {
    const r = path.getPoint(0.07 + rnd() * 0.74);
    const x = r.x + (rnd() < 0.5 ? -1 : 1) * (rnd() < 0.35 ? 6 + rnd() * 5 : 3.6 + rnd());
    const size = 0.7 + rnd() * 0.7;
    const fits = Math.abs(x) <= 15 && !sites.some((g) => Math.hypot(g.position.x - x, g.position.z - r.z) < 5.5);
    if (fits) colliders.push([x, r.z, 0.3]);
    trees.push([x, r.z, fits ? size : 0]);
  }

  // street lamps on the left verge, their head over the road edge; a bench beside every third one
  const nLamps = 36;
  const lamps: THREE.Vector3[] = [];
  const benches: THREE.Vector3[] = [];
  const lamp = new THREE.MeshBasicMaterial();
  const lampGlow = new THREE.MeshBasicMaterial({ color: C.yellow, transparent: true, opacity: 0, depthWrite: false });
  const pools = new THREE.InstancedMesh(new THREE.CircleGeometry(2.2, 20), lampGlow, nLamps);
  pools.frustumCulled = false;
  scene.add(pools);
  for (let k = 0; k < nLamps; k++) {
    const r = path.getPoint(((k + 0.5) / nLamps) * 0.83);
    lamps.push(new THREE.Vector3(r.x - 2.5, 0, r.z));
    o.position.set(r.x - 2.08, 0.06, r.z); // under the lamp head, 0.42 out from the pole
    o.rotation.set(-Math.PI / 2, 0, 0);
    o.updateMatrix();
    pools.setMatrixAt(k, o.matrix);
    if (k % 3 === 1) {
      benches.push(new THREE.Vector3(r.x - 3.5, 0, r.z + 1.2));
      colliders.push([r.x - 3.5, r.z + 1.2, 0.5]);
    }
  }

  // bushes along both verges, kept off the buildings
  const bushes: [number, number, number][] = [];
  for (let k = 0; k < 40; k++) {
    const r = path.getPoint(0.06 + rnd() * 0.76);
    const x = r.x + (rnd() < 0.5 ? -1 : 1) * (3.1 + rnd() * 1.6);
    const fits = !sites.some((g) => Math.hypot(g.position.x - x, g.position.z - r.z) < 5);
    bushes.push([x, r.z, fits ? 0.8 + rnd() * 0.5 : 0]);
  }

  let blocks: Instanced[][] = [];
  const m = new THREE.Matrix4();
  const s = new THREE.Vector3();
  const p = new THREE.Vector3();
  const upright = new THREE.Quaternion();
  const facingRoad = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);

  /** A group of simple meshes, for a model that did not load. */
  const standIn = (...parts: [THREE.BufferGeometry, THREE.Material][]) => {
    const root = new THREE.Group();
    parts.forEach(([geo, material]) => {
      const mesh = new THREE.Mesh(geo, material);
      mesh.castShadow = true;
      root.add(mesh);
    });
    return root;
  };
  const meshNamed = (root: THREE.Object3D | undefined, name: string) => root?.getObjectByName(name) as THREE.Mesh | undefined;
  const fill = (target: Instanced, list: { at: THREE.Vector3; size: number; turn?: THREE.Quaternion }[]) => {
    list.forEach(({ at, size, turn }, k) => target.set(k, m.compose(at, turn ?? upright, s.setScalar(size))));
    target.commit();
  };

  return {
    windows: glass,
    bodyColor: body.color,
    materials: { block: body, window: glass },
    lamp,
    lampColor: lamp.color,
    lampGlow,
    attach(models) {
      // blocks: every variant is one instanced set of parts; days on the road or on a stop's building are left out
      const set = models.city_blocks;
      const road = Array.from({ length: 240 }, (_, k) => path.getPoint(k / 239));
      days.forEach((d) => {
        // the pavement square, not its corners: the car may brush a kerb corner, never a wall
        const r = d.w * 0.5 + 0.05;
        d.fits =
          road.every((q) => Math.hypot(q.x - d.x, q.z - d.z) > 3 + r) &&
          !sites.some((g) => Math.hypot(g.position.x - d.x, g.position.z - d.z) < 5 + r);
        if (d.fits) colliders.push([d.x, d.z, r]);
      });
      const tint = new THREE.Color();
      const boxStandIn = (height: number) => {
        const geo = new THREE.BoxGeometry(1, height, 1).translate(0, height / 2, 0);
        geo.setAttribute('color', new THREE.Float32BufferAttribute(new Array(geo.attributes.position.count * 3).fill(1), 3)); // no AO
        return standIn([geo, body]);
      };
      blocks = VARIANTS.map((names, level) =>
        names.map((name, variant) => {
          const mine = days.filter((d) => d.level === level && d.variant === variant);
          const node = set?.getObjectByName(name);
          const root = node ? node.clone() : boxStandIn([0.15, 0.7, 1.3, 2.4, 3.4][level]);
          root.position.set(0, 0, 0); // all at the file origin already; a clone carries no parent transform
          const parts = instance(scene, root, Math.max(1, mine.length));
          // only the `block` part takes the level colour; the parts that share its material are the body
          parts.parts.forEach((im) => {
            if (im.material !== body) return;
            mine.forEach((d) => im.setColorAt(d.slot, tint.setHex(LEVELS[level])));
          });
          return parts;
        }),
      );
      // trees: two kinds, alternating
      const leaf = mat(0x2f6b4f, 0x153a2b);
      const bark = mat(0x6b4a2b, 0x2a2018);
      const treeStandIn = () =>
        standIn([new THREE.ConeGeometry(0.75, 2, 6).translate(0, 1.7, 0), leaf], [new THREE.BoxGeometry(0.2, 0.7, 0.2).translate(0, 0.35, 0), bark]);
      (['tree_a', 'tree_b'] as const).forEach((name, kind) => {
        const mine = trees.filter((_, k) => k % 2 === kind).map(([x, z, size]) => ({ at: new THREE.Vector3(x, 0, z), size }));
        fill(instance(scene, models[name] ?? treeStandIn(), mine.length), mine);
      });

      // lamps: the head's material is `lamp`, coloured by the world per theme
      const lampStandIn = () =>
        standIn([new THREE.BoxGeometry(0.1, 2.6, 0.1).translate(0, 1.3, 0), mat(C.ink, 0x8a8fb5)], [new THREE.SphereGeometry(0.24, 10, 8).translate(0.42, 2.5, 0), lamp]);
      fill(instance(scene, models.street_lamp ?? lampStandIn(), nLamps), lamps.map((at) => ({ at, size: 1 })));

      // benches face the road; bushes are scattered
      const benchStandIn = () => standIn([new THREE.BoxGeometry(1.5, 0.12, 0.48).translate(0, 0.45, 0), mat(0xd9a066, 0x6a5638)]);
      fill(instance(scene, models.bench ?? benchStandIn(), benches.length), benches.map((at) => ({ at, size: 1, turn: facingRoad })));
      const bushStandIn = () => standIn([new THREE.IcosahedronGeometry(0.5, 0).translate(0, 0.38, 0), leaf]);
      fill(instance(scene, models.bush ?? bushStandIn(), bushes.length), bushes.map(([x, z, size]) => ({ at: new THREE.Vector3(x, 0, z), size })));
    },
    update(carX, carZ, grow, time) {
      days.forEach((d) => {
        const rise = d.fits ? Math.max(0.02, 1 - smooth(20, 38, carZ - d.z)) * grow : 0;
        blocks[d.level]?.[d.variant]?.set(d.slot, m.compose(p.set(d.x, 0, d.z), upright, s.set(d.w * rise, d.w * d.h * rise, d.w * rise)));
      });
      blocks.forEach((row) => row.forEach((b) => b.commit()));
      if (today) {
        today.visible = grow > 0.5;
        today.scale.y = 1 + (0.5 + 0.5 * Math.sin(time * 4)) * 4;
      }
    },
  };
}
