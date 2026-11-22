import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { C, type Kit } from './kit';

const WHEEL = 0.28;
const WHEELS = ['wheel_fl', 'wheel_fr', 'wheel_rl', 'wheel_rr'] as const;

export interface CarFrame {
  dt: number;
  time: number;
  /** Signed ground speed along the car's nose, units per second. */
  speed: number;
  /** -1..1, positive turns left. */
  steer: number;
  roll: number;
  pitch: number;
  braking: boolean;
  /** 0 = day, 1 = night (already eased). */
  night: number;
  dust: boolean;
}

/**
 * The toy car from car.glb: `body` (with `headlights` and `taillights`) rolls and bobs, the four named wheels
 * spin and the front two steer. Until the model arrives nothing is drawn; if it fails, a stand-in with the same
 * part names takes its place.
 */
export function buildCar(kit: Kit) {
  const car = new THREE.Group(); // placed and turned by the world
  kit.scene.add(car);
  const head = kit.mat(0xfff6d0, 0xfff6d0, { emissive: 0xfff1b0, emissiveIntensity: 0.15 });
  const tail = kit.mat(C.red, C.red, { emissive: C.red, emissiveIntensity: 0.25 });

  let body: THREE.Object3D | null = null;
  let wheels: THREE.Object3D[] = [];

  /** Same part names as car.glb, so one code path drives both. */
  const standIn = () => {
    const root = new THREE.Group();
    const shell = new THREE.Group();
    shell.name = 'body';
    root.add(shell);
    const part = (geo: THREE.BufferGeometry, m: THREE.Material, parent: THREE.Object3D, x: number, y: number, z: number) => {
      const mesh = new THREE.Mesh(geo, m);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      parent.add(mesh);
    };
    part(new RoundedBoxGeometry(1.2, 0.5, 2.5, 2, 0.14), kit.mat(C.blue), shell, 0, 0.55, 0);
    part(new RoundedBoxGeometry(0.96, 0.42, 1.2, 2, 0.1), kit.mat(0xffffff, 0xd8d8e8), shell, 0, 0.98, -0.15);
    part(new THREE.BoxGeometry(0.9, 0.12, 0.05), head, shell, 0, 0.6, 1.26);
    part(new THREE.BoxGeometry(1, 0.1, 0.05), tail, shell, 0, 0.62, -1.26);
    const tyre = new THREE.CylinderGeometry(WHEEL, WHEEL, 0.24, 16).rotateZ(Math.PI / 2);
    const ink = kit.mat(C.ink);
    WHEELS.forEach((name, k) => {
      const w = new THREE.Group();
      w.name = name;
      w.position.set(k % 2 ? -0.56 : 0.56, WHEEL, k < 2 ? 0.68 : -0.68);
      part(tyre, ink, w, 0, 0, 0);
      root.add(w);
    });
    return root;
  };

  // at night the headlights throw a pool on the road and a soft beam
  const pool = new THREE.Mesh(new THREE.CircleGeometry(1, 24), new THREE.MeshBasicMaterial({ color: C.yellow, transparent: true, opacity: 0, depthWrite: false }));
  pool.rotation.x = -Math.PI / 2;
  pool.scale.set(1.3, 2.6, 1);
  pool.position.set(0, 0.07, 3.6);
  const beamMat = new THREE.MeshBasicMaterial({ color: 0xfff1b0, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
  const beam = new THREE.Mesh(new THREE.ConeGeometry(1.25, 5.5, 20, 1, true).rotateX(-Math.PI / 2).translate(0, 0, 2.75 + 1.3), beamMat);
  beam.position.y = 0.52;
  beam.rotation.x = 0.08;
  pool.visible = beam.visible = false;
  car.add(pool, beam);

  // dust: a small pool of puffs behind the rear wheels, recycled oldest first
  const PUFFS = 18;
  const dust = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.22, 0), kit.mat(0xfaf6ea, 0x5a5f8a), PUFFS);
  dust.frustumCulled = false;
  kit.scene.add(dust);
  const puffs = Array.from({ length: PUFFS }, () => ({ age: 1, at: new THREE.Vector3() }));
  const o = new THREE.Object3D();
  let next = 0;
  let since = 0;
  let spin = 0;

  return {
    car,
    /** Materials the model's `headlight` / `taillight` meshes take, so night and braking drive them. */
    head,
    tail,
    attach(model: THREE.Group | undefined) {
      const root = model ?? standIn();
      car.add(root);
      body = root.getObjectByName('body') ?? null;
      wheels = WHEELS.map((n) => root.getObjectByName(n)).filter((w): w is THREE.Object3D => !!w);
      wheels.forEach((w) => (w.rotation.order = 'YXZ'));
    },
    update(f: CarFrame) {
      spin += (f.speed * f.dt) / WHEEL;
      wheels.forEach((w, k) => {
        w.rotation.x = spin;
        if (k < 2) w.rotation.y = f.steer * 0.45;
      });
      if (body) {
        body.position.y = Math.sin(f.time * 13) * 0.014 * Math.min(1, Math.abs(f.speed) / 6);
        body.rotation.set(f.pitch, 0, f.roll);
      }

      head.emissiveIntensity = 0.15 + f.night * 2.2;
      tail.emissiveIntensity = 0.25 + f.night * 0.6 + (f.braking ? 2.2 : 0);
      pool.visible = beam.visible = f.night > 0.02;
      (pool.material as THREE.MeshBasicMaterial).opacity = f.night * 0.38;
      beamMat.opacity = f.night * 0.14;

      since += f.dt;
      if (f.dust && since > 0.06) {
        since = 0;
        for (const s of [-1, 1]) {
          const p = puffs[next];
          next = (next + 1) % PUFFS;
          p.age = 0;
          car.localToWorld(p.at.set(s * 0.56, 0.12, -0.88));
        }
      }
      puffs.forEach((p, k) => {
        p.age = Math.min(1, p.age + f.dt / 0.7);
        o.position.copy(p.at);
        o.position.y += p.age * 0.5;
        o.scale.setScalar(p.age < 1 ? (0.5 + p.age) * (1 - p.age) * 1.6 : 0);
        o.updateMatrix();
        dust.setMatrixAt(k, o.matrix);
      });
      dust.instanceMatrix.needsUpdate = true;
    },
  };
}
