import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export const C = {
  blue: 0x1f3bff,
  yellow: 0xffd60a,
  pink: 0xff8fc7,
  green: 0x19b866,
  red: 0xff4a2b,
  ink: 0x141414,
  paper: 0xf3f1ea,
  night: 0x0e1020,
} as const;

/**
 * Night versions of the grounds: deep but still clearly the same district. Chosen brighter than they show,
 * because the night light (moon and sky, about 0.7) dims them on screen.
 */
export const NIGHT = {
  ground: 0x161a3c,
  blue: 0x1a2690,
  yellow: 0xb47f00,
  red: 0x95250d,
  pink: 0x9a366a,
  green: 0x0e6b40,
} as const;

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const wrapAngle = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

/** A material whose colour blends between a day and a night value. */
export type Themed = [{ color: THREE.Color }, number, number];
/** Something the car cannot drive through: [x, z, radius]. */
export type Collider = [number, number, number];

export interface Kit {
  scene: THREE.Scene;
  themed: Themed[];
  colliders: Collider[];
  /** Three-step light ramp shared by every toon material. */
  ramp: THREE.DataTexture;
  /** Shadow colour, and how much direct light counts as fully lit (follows the sun's strength). */
  shade: { shadeTint: { value: THREE.Color }; shadeLit: { value: number } };
  /** A toon material whose shadows lean towards the shade colour instead of grey. Not themed. */
  toon(options?: THREE.MeshToonMaterialParameters): THREE.MeshToonMaterial;
  mat(day: number, night?: number, options?: THREE.MeshToonMaterialParameters): THREE.MeshToonMaterial;
  /** Boxes thicker than 0.1 get rounded edges; thin details (windows, lines) stay sharp. */
  box(w: number, h: number, d: number, m: THREE.Material | THREE.Material[], x: number, z: number, y?: number, parent?: THREE.Object3D): THREE.Mesh;
  /** Deterministic pseudo-random 0..1, so the town looks the same on every visit. */
  rnd(): number;
  /** Runs `draw` once the CSS fonts are usable in canvas, unless the world is gone by then. */
  whenFonts(fonts: readonly string[], draw: () => void): void;
}

export function createKit(scene: THREE.Scene, isDead: () => boolean): Kit {
  const themed: Themed[] = [];
  let seed = 7;
  // stepped shading: shade, half-lit, lit. Shadows themselves take the cool sky colour (see the lights in index.ts).
  const ramp = new THREE.DataTexture(new Uint8Array([90, 170, 255]), 3, 1, THREE.RedFormat);
  ramp.minFilter = ramp.magFilter = THREE.NearestFilter;
  ramp.needsUpdate = true;
  const shade = { shadeTint: { value: new THREE.Color(0x5945b3) }, shadeLit: { value: 0.65 } };
  // Where the sun does not reach: the surface's own colour, darkened by the sky light only and nudged towards
  // blue-purple. Not lit by the cool hemisphere, which turned yellow into mud. Emissive glow is left alone.
  const tint = (shader: THREE.WebGLProgramParametersWithUniforms) => {
    Object.assign(shader.uniforms, shade);
    shader.fragmentShader = `uniform vec3 shadeTint;
uniform float shadeLit;
${shader.fragmentShader.replace(
      '#include <opaque_fragment>',
      `float lit = clamp(dot(reflectedLight.directDiffuse, vec3(1.0)) / max(dot(diffuseColor.rgb, vec3(1.0)), 1e-4) / shadeLit, 0.0, 1.0);
      float amb = dot(reflectedLight.indirectDiffuse, vec3(1.0)) / max(dot(diffuseColor.rgb, vec3(1.0)), 1e-4);
      vec3 base = outgoingLight - totalEmissiveRadiance;
      vec3 shade = mix(diffuseColor.rgb, shadeTint, 0.22) * amb * 1.75;
      outgoingLight = mix(shade, base, lit) + totalEmissiveRadiance;
      #include <opaque_fragment>`,
    )}`;
  };
  const kit: Kit = {
    scene,
    themed,
    colliders: [],
    ramp,
    shade,
    toon(options = {}) {
      const m = new THREE.MeshToonMaterial({ gradientMap: ramp, ...options });
      m.onBeforeCompile = tint;
      return m;
    },
    mat(day, night = day, options = {}) {
      const m = kit.toon({ color: day, ...options });
      themed.push([m, day, night]);
      return m;
    },
    box(w, h, d, m, x, z, y = h / 2, parent = scene) {
      const min = Math.min(w, h, d);
      const geo = min >= 0.1 ? new RoundedBoxGeometry(w, h, d, 2, Math.min(0.22, min * 0.28)) : new THREE.BoxGeometry(w, h, d);
      const b = new THREE.Mesh(geo, m);
      b.position.set(x, y, z);
      b.castShadow = b.receiveShadow = true;
      parent.add(b);
      return b;
    },
    rnd() {
      seed = (Math.sin(seed * 91.7 + 1.3) * 43758.5453) % 1;
      return Math.abs(seed);
    },
    whenFonts(fonts, draw) {
      const run = () => {
        if (!isDead()) draw();
      };
      Promise.all(fonts.map((f) => document.fonts.load(f))).then(run, run);
    },
  };
  return kit;
}

export const FONTS = {
  anton: '10px Anton',
  serif: 'italic 10px "Instrument Serif"',
  grotesk: '10px "Schibsted Grotesk"',
  mono: '700 10px "JetBrains Mono"',
} as const;

export function makeCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  // A 2D context on a fresh canvas only fails when the browser is out of memory.
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  return { canvas, ctx, tex: new THREE.CanvasTexture(canvas) };
}
