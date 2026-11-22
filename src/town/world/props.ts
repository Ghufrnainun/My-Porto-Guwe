import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { C, type Kit } from './kit';
import { instance, type Instanced, type Models } from './models';

interface Prop {
  cone: boolean;
  /** Index among its own kind's instances. */
  slot: number;
  at: THREE.Vector3;
  turn: THREE.Euler;
  rest: number;
  vx: number;
  vy: number;
  vz: number;
  spin: number;
}

/**
 * Cones and crates along the road that fly off when the car hits them. Drawn as two instanced models
 * (cone.glb, crate.glb), pivoted at their centre so they tumble about it.
 * ponytail: home-made physics (one impulse, gravity, one bounce, no prop-to-prop contact).
 * Swap in cannon-es if it ever has to feel real.
 */
export function buildProps(kit: Kit, path: THREE.CatmullRomCurve3) {
  const props: Prop[] = [];
  let cones = 0;
  let crates = 0;
  for (let k = 0; k < 44; k++) {
    const cone = k % 3 > 0;
    const r = path.getPoint(0.07 + kit.rnd() * 0.78);
    const x = r.x + (kit.rnd() < 0.5 ? -1 : 1) * (1.1 + kit.rnd() * (cone ? 0.5 : 1.6));
    const rest = cone ? 0.45 : 0.405;
    props.push({ cone, slot: cone ? cones++ : crates++, at: new THREE.Vector3(x, rest, r.z), turn: new THREE.Euler(0, kit.rnd() * 3, 0), rest, vx: 0, vy: 0, vz: 0, spin: 0 });
  }

  let coneMesh: Instanced | undefined;
  let crateMesh: Instanced | undefined;
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const one = new THREE.Vector3(1, 1, 1);
  const place = (p: Prop) => {
    const target = p.cone ? coneMesh : crateMesh;
    target?.set(p.slot, m.compose(p.at, q.setFromEuler(p.turn), one));
  };

  /** Model with its origin at the ground: move the pivot to its centre, and rest on half its height. */
  const centred = (root: THREE.Object3D, count: number, cone: boolean) => {
    const box = new THREE.Box3().setFromObject(root);
    const half = (box.max.y - box.min.y) / 2;
    props.forEach((p) => {
      if (p.cone === cone) p.at.y = p.rest = half;
    });
    return instance(kit.scene, root, count, new THREE.Matrix4().makeTranslation(0, -box.min.y - half, 0));
  };
  const standIn = (geo: THREE.BufferGeometry, mat: THREE.Material) => {
    const root = new THREE.Group();
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    root.add(mesh);
    return root;
  };

  return {
    attach(models: Models) {
      coneMesh = centred(models.cone ?? standIn(new THREE.ConeGeometry(0.35, 0.9, 10).translate(0, 0.45, 0), kit.mat(C.red)), cones, true);
      crateMesh = centred(models.crate ?? standIn(new RoundedBoxGeometry(0.8, 0.8, 0.8, 2, 0.14).translate(0, 0.4, 0), kit.mat(0xd9b27c, 0x6a5638)), crates, false);
      props.forEach(place);
      coneMesh.commit();
      crateMesh.commit();
    },
    /** `vx`/`vz` is the car's ground velocity in units per second. */
    update(carX: number, carZ: number, vx: number, vz: number, dt: number) {
      const raw = Math.hypot(vx, vz);
      const speed = Math.min(18, raw);
      const scale = speed / (raw || 1);
      let moved = false;
      for (const p of props) {
        const a = p.at;
        const dx = a.x - carX;
        const dz = a.z - carZ;
        const d = Math.hypot(dx, dz) || 0.01;
        if (d < 1.3 && speed > 1 && a.y < 1.3) {
          p.vx = (dx / d) * speed * 0.5 + vx * scale * 0.8;
          p.vz = (dz / d) * speed * 0.5 + vz * scale * 0.8;
          p.vy = 2 + speed * 0.4;
          p.spin = speed;
        }
        if (!p.vx && !p.vy && !p.vz) continue;
        moved = true;
        p.vy -= 22 * dt;
        a.x += p.vx * dt;
        a.y += p.vy * dt;
        a.z += p.vz * dt;
        p.turn.x += p.spin * dt;
        p.turn.z += p.spin * 0.7 * dt;
        if (a.y <= p.rest) {
          a.y = p.rest;
          p.vy = p.vy < -3 ? -p.vy * 0.35 : 0;
          const friction = Math.exp(-dt * 5);
          p.vx *= friction;
          p.vz *= friction;
          p.spin *= friction;
          if (Math.hypot(p.vx, p.vz) < 0.2 && !p.vy) p.vx = p.vz = p.spin = 0;
        }
        place(p);
      }
      if (moved) {
        coneMesh?.commit();
        crateMesh?.commit();
      }
    },
  };
}
