import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { Kit } from './kit';

/** Every file in public/town/models/ (see its README for names, origins and sizes). */
export const MODEL_NAMES = [
  'car',
  'start',
  'pbundip',
  'tempe-mail',
  'curated-design',
  'sewainaja',
  'lsp-polines',
  'impp-website',
  'side-alley',
  'campus',
  'certificates',
  'ai-site',
  'street_sign',
  'billboard',
  'plate',
  'street_lamp',
  'cone',
  'crate',
  'tree_a',
  'tree_b',
  'bench',
  'bush',
  'kerb',
  'city_blocks',
] as const;
export type ModelName = (typeof MODEL_NAMES)[number];
/** Loaded scenes by file name. A file that failed is missing: its user builds a stand-in. */
export type Models = Partial<Record<ModelName, THREE.Group>>;

/** Fetches every model in parallel. Never rejects: a failed file is left out with a warning. */
export async function loadModels(): Promise<Models> {
  const loader = new GLTFLoader();
  const base = `${import.meta.env.BASE_URL}town/models/`;
  const settled = await Promise.allSettled(MODEL_NAMES.map((n) => loader.loadAsync(`${base}${n}.glb`)));
  const out: Models = {};
  settled.forEach((r, k) => {
    if (r.status === 'fulfilled') out[MODEL_NAMES[k]] = r.value.scene;
    else console.warn(`[town] model ${MODEL_NAMES[k]}.glb did not load, using a stand-in`, r.reason);
  });
  return out;
}

/** Night colours for glTF material names where "darken towards night navy" reads wrong. */
const NIGHT: Record<string, number> = {
  paper: 0x8a8fb5,
  white: 0xd8d8e8,
  cream: 0x8f8a78,
  trim: 0x8a8fb5,
  ink: 0x2a2e4a,
  navy: 0x2a2f70,
  glass: 0x0b0c1a,
};

/**
 * Swaps every glTF material for the world's toon material of the same name, so day/night blending and the
 * coloured shadows apply. Day colour comes from the file. Baked AO in COLOR_0 multiplies in (vertexColors).
 * `special` maps names to materials the world drives itself (lit windows, lamps, car lights).
 */
export function makeToonifier(kit: Kit, special: Record<string, THREE.Material>) {
  const cache = new Map<string, THREE.Material>();
  const night = new THREE.Color(0x14163a);
  return (root: THREE.Object3D) => {
    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const src = mesh.material as THREE.MeshStandardMaterial;
      // a textured part (the campus logo) keeps its picture as is: unlit, so it stays readable at night
      if (src.map) {
        mesh.material = new THREE.MeshBasicMaterial({ map: src.map, transparent: src.transparent, alphaTest: src.alphaTest });
        src.dispose();
        return;
      }
      const ao = Boolean(mesh.geometry.attributes.color);
      const key = `${src.name}|${ao}`;
      let m = special[src.name] ?? cache.get(key);
      if (!m) {
        const day = src.color.getHex();
        m = kit.mat(day, NIGHT[src.name] ?? src.color.clone().lerp(night, 0.55).getHex(), { vertexColors: ao });
        cache.set(key, m);
      }
      if (src !== m) src.dispose();
      mesh.material = m;
      mesh.castShadow = mesh.receiveShadow = true;
    });
  };
}

/** glTF UVs run v up; a CanvasTexture drawn for them uses flipY = false. Stand-in quads flip their v to match. */
export const flipV = <G extends THREE.BufferGeometry>(geo: G) => {
  const uv = geo.attributes.uv;
  for (let k = 0; k < uv.count; k++) uv.setY(k, 1 - uv.getY(k));
  return geo;
};

export interface Instanced {
  parts: THREE.InstancedMesh[];
  set(k: number, m: THREE.Matrix4): void;
  /** Marks the matrices for upload after a batch of `set`. */
  commit(): void;
}

/**
 * One InstancedMesh per part of a model (one part per material), all sharing the instance matrices.
 * Each part's own transform inside the model is baked into its copy of the geometry; `pivot` moves them all.
 */
export function instance(scene: THREE.Scene, root: THREE.Object3D, count: number, pivot?: THREE.Matrix4): Instanced {
  root.updateMatrixWorld(true);
  const parts: THREE.InstancedMesh[] = [];
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const geo = mesh.geometry.clone().applyMatrix4(mesh.matrixWorld);
    if (pivot) geo.applyMatrix4(pivot);
    const im = new THREE.InstancedMesh(geo, mesh.material, count);
    im.castShadow = mesh.castShadow;
    im.receiveShadow = true;
    im.frustumCulled = false; // instances spread over the whole town
    parts.push(im);
    scene.add(im);
  });
  return {
    parts,
    set: (k, m) => parts.forEach((p) => p.setMatrixAt(k, m)),
    commit: () => parts.forEach((p) => (p.instanceMatrix.needsUpdate = true)),
  };
}
