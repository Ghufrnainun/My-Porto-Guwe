import * as THREE from 'three';
import type { Stop } from '../types';
import { C, FONTS, makeCanvas, type Kit } from './kit';
import { flipV, type Models } from './models';
import { groundHeight } from './tourMath';

type Kind = 'street_sign' | 'billboard' | 'plate';

interface Sign {
  kind: Kind;
  x: number;
  z: number;
  bg: string;
  face: THREE.MeshBasicMaterial;
}

/** Stand-in sizes, close to the models: [face width, post height]. */
const SIZE: Record<Kind, [number, number]> = { street_sign: [3.4, 2.2], billboard: [6, 3.4], plate: [2.6, 0.9] };

/**
 * Green street signs per district, black billboards for the stack, a small name and year plate at every project.
 * The lettering is a canvas on each model's `face` quad; the signs appear once the models have settled.
 */
export function buildSigns(kit: Kit, path: THREE.CatmullRomCurve3, pts: THREE.Vector3[], stops: readonly Stop[], billboards: readonly string[]) {
  const N = stops.length - 1;
  const signs: Sign[] = [];

  const add = (kind: Kind, text: string, x: number, z: number, bg: string, fg: string) => {
    const { ctx, tex } = makeCanvas(1024, 240);
    tex.flipY = false; // glTF UVs
    const paint = () => {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 1024, 240);
      // a thin inset line, not a frame: the board's own colour is the edge
      ctx.strokeStyle = fg;
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, 964, 180);
      ctx.globalAlpha = 1;
      ctx.fillStyle = fg;
      ctx.font = '150px Anton';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 512, 128, 930);
      tex.needsUpdate = true;
    };
    paint();
    kit.whenFonts([FONTS.anton], paint);
    // unlit and unfogged: the lettering keeps its colour at night, like a lit sign
    signs.push({ kind, x, z, bg, face: new THREE.MeshBasicMaterial({ map: tex, fog: false }) });
  };

  stops.forEach((stop, i) => {
    if (i === 0 || stop.kind === 'end' || stop.district === stops[i - 1].district) return;
    const r = path.getPoint(Math.max(0.004, (i - 0.28) / N));
    // across the road from the stop's building, so the sign never stands in front of its facade (campus lettering)
    add('street_sign', stop.district.toUpperCase(), r.x - 3.4 * stop.side, r.z, '#0a7a3b', '#fff');
  });
  [1.5, 4.5, 5.5].forEach((at, k) => {
    if (!billboards[k] || at >= N) return;
    const r = path.getPoint(at / N);
    add('billboard', billboards[k].toUpperCase(), r.x + 6.5, r.z, '#141414', '#ffd60a');
  });
  stops.forEach((stop, i) => {
    if (stop.kind !== 'project') return;
    const z = pts[i].z + (stop.building === 'pbundip' ? 4.2 : 2.6);
    add('plate', `${stop.name} · ${stop.year}`.toUpperCase(), pts[i].x + stop.side * 6.5, z, '#f3f1ea', '#141414');
  });

  /** The old code-built sign: a board in the plate's colour on two posts, the face tilted back. */
  const standIn = (s: Sign) => {
    const [width, height] = SIZE[s.kind];
    const root = new THREE.Group();
    const face = new THREE.Mesh(flipV(new THREE.PlaneGeometry(width, width * 0.235)), s.face);
    face.name = 'face';
    face.position.set(0, height + 0.3 + 0.565 * 0.08, 0.825 * 0.08);
    face.rotation.x = -0.6;
    root.add(face);
    const post = kit.mat(C.ink, C.paper);
    kit.box(width + 0.16, width * 0.235 + 0.16, 0.14, kit.mat(parseInt(s.bg.slice(1), 16)), 0, 0, height + 0.3, root).rotation.x = -0.6;
    kit.box(0.12, height, 0.12, post, -width * 0.35, 0, height / 2, root);
    kit.box(0.12, height, 0.12, post, width * 0.35, 0, height / 2, root);
    return root;
  };

  return {
    attach(models: Models) {
      for (const s of signs) {
        const model = models[s.kind];
        const root = model ? model.clone() : standIn(s);
        const face = root.getObjectByName('face') as THREE.Mesh | undefined;
        if (face) {
          face.material = s.face;
          face.castShadow = false;
        }
        root.position.set(s.x, groundHeight(s.x, s.z), s.z);
        kit.scene.add(root);
      }
    },
  };
}
