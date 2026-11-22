import * as THREE from 'three';
import type { HeroCopy, Stop } from '../types';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { HERO_FONTS, paintHero } from '../heroPoster';
import { C, NIGHT, makeCanvas, type Kit } from './kit';
import { instance, type Models } from './models';
import { groundHeight, HILL } from './tourMath';

/** District ground in full colour, [day, night]. One colour fills the screen at a time. */
const ZONE: Partial<Record<Stop['building'], [number, number]>> = {
  'side-alley': [C.red, NIGHT.red],
  campus: [C.pink, NIGHT.pink],
  certificates: [C.pink, NIGHT.pink],
  'ai-site': [C.green, NIGHT.green],
};
const zoneOf = (s: Stop): [number, number] | undefined => (s.kind === 'project' ? [C.yellow, NIGHT.yellow] : ZONE[s.building]);
/** Road: deep navy on every colour, paper on the blue hero page where navy would vanish. */
const ROAD = { navy: new THREE.Color(0x23275e), paper: new THREE.Color(C.paper) };

export interface Ground {
  /** Lays out the blue page and its poster for the viewport (CSS px) and returns the opening camera shot. */
  fitHero(width: number, height: number, camera: THREE.Vector3, target: THREE.Vector3): void;
  /** 0 = day, 1 = night: the road and its markings light up. */
  theme(e: number): void;
  /** Opacity of the poster words on the blue page: they fade as the camera leaves the hero, so no cut-off letters linger. */
  heroWords(o: number): void;
  /** Lays the district kerbs from kerb.glb (or a stand-in). Call once, after the models settled. */
  attach(models: Models): void;
}

/** A rounded rectangle lying flat, centred on the origin. */
const roundedPage = (w: number, h: number, r: number) => {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return new THREE.ShapeGeometry(s, 8).rotateX(-Math.PI / 2);
};

/* Layers on the flat ground, low to high. Far enough apart for the depth buffer at the ~200 high portrait hero camera. */
const Y = { zone: 0.012, rim: 0.02, page: 0.028, words: 0.034, road: 0.04, paint: 0.062 } as const;

export function buildGround(kit: Kit, path: THREE.CatmullRomCurve3, pts: THREE.Vector3[], stops: readonly Stop[], hero: HeroCopy, anisotropy: number, fov: number): Ground {
  const { scene, mat, box } = kit;
  const N = stops.length - 1;
  const flat = (geo: THREE.BufferGeometry, m: THREE.Material, y: number) => {
    const p = new THREE.Mesh(geo, m);
    p.rotation.x = -Math.PI / 2;
    p.position.y = y;
    p.receiveShadow = true;
    scene.add(p);
    return p;
  };

  const paper = mat(C.paper, NIGHT.ground);
  // District grounds glow faintly in their own night colour: dim light alone darkens yellow into brown, a glow of
  // its own keeps every district saturated and recognisable (see theme).
  const glows: THREE.MeshToonMaterial[] = [];
  const glowing = (day: number, night: number) => {
    const m = mat(day, night, { emissive: night, emissiveIntensity: 0 });
    glows.push(m);
    return m;
  };
  flat(new THREE.PlaneGeometry(1200, 1200), paper, 0).position.z = -150;

  // the hill at Bukit: the road climbs, the name stands on top. Its foot sinks just under the flat ground.
  const hillGeo = new THREE.PlaneGeometry(130, 170, 52, 85).rotateX(-Math.PI / 2).translate(0, 0, (HILL.foot + HILL.back) / 2 - 10);
  const hp = hillGeo.attributes.position;
  for (let k = 0; k < hp.count; k++) hp.setY(k, groundHeight(hp.getX(k), hp.getZ(k)) - 0.06);
  hillGeo.computeVertexNormals();
  // green, like the AI Site ground it rises from: a real hill, not a pale bump
  const hill = new THREE.Mesh(hillGeo, glowing(C.green, NIGHT.green));
  hill.receiveShadow = hill.castShadow = true;
  scene.add(hill);

  // the hero page, lying on the ground: a rounded blue sheet on a paper rim, the car parked on it.
  // No fog: the hero camera sits high. Its geometry is rebuilt per viewport in fitHero.
  const blue = new THREE.Mesh(new THREE.BufferGeometry(), mat(C.blue, NIGHT.blue, { fog: false }));
  const rim = new THREE.Mesh(new THREE.BufferGeometry(), mat(C.paper, 0x2a2e4a, { fog: false }));
  blue.receiveShadow = rim.receiveShadow = true;
  blue.position.y = Y.page;
  rim.position.y = Y.rim;
  scene.add(rim, blue);

  // the poster on it: painted by the same code as the DOM overlay, once per viewport size
  const words = new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, fog: false });
  const text = flat(new THREE.PlaneGeometry(1, 1), words, Y.words);
  text.receiveShadow = false;
  text.visible = false;
  let fontsReady = false;
  let painted = '';
  let viewport: [number, number] = [1, 1];
  const paintPoster = () => {
    const [w, h] = viewport;
    const key = `${w}x${h}`;
    if (!fontsReady || key === painted) return;
    painted = key;
    const s = Math.min(2, 2048 / Math.max(w, h));
    const { ctx, tex } = makeCanvas(Math.round(w * s), Math.round(h * s));
    paintHero(ctx, w, h, s, hero);
    tex.anisotropy = anisotropy;
    words.map?.dispose();
    words.map = tex;
    words.needsUpdate = true;
    text.visible = true;
  };
  kit.whenFonts(HERO_FONTS, () => {
    fontsReady = true;
    paintPoster();
  });

  // zoning colours on the ground, one strip per run of stops in the same district
  let from = 1;
  const borders = new Set<number>();
  for (let i = 1; i <= N; i++) {
    const zone = zoneOf(stops[i]);
    const next = i < N ? zoneOf(stops[i + 1]) : undefined;
    if (zone && next && zone[0] === next[0]) continue;
    if (zone) {
      const start = from === 1 ? pts[from].z + 9 : (pts[from].z + pts[from - 1].z) / 2;
      const end = next ? (pts[i].z + pts[i + 1].z) / 2 : pts[i].z - 9;
      flat(new THREE.PlaneGeometry(92, start - end), glowing(zone[0], zone[1]), Y.zone).position.z = (start + end) / 2;
      if (from !== 1) borders.add(start); // the first one lies under the blue page
      borders.add(end);
    }
    from = i + 1;
  }

  // a low paper kerb where one district meets the next, broken where the road crosses it
  const kerbAt: [number, number, number][] = []; // [x centre, width, z]
  const roadXAt = (z: number) => {
    let best = path.getPoint(0);
    for (let k = 1; k <= 400; k++) {
      const p = path.getPoint(k / 400);
      if (Math.abs(p.z - z) < Math.abs(best.z - z)) best = p;
    }
    return best.x;
  };
  borders.forEach((z) => {
    const rx = roadXAt(z);
    const gapL = rx - 2.6;
    const gapR = rx + 2.6;
    kerbAt.push([(-46 + gapL) / 2, gapL + 46, z], [(gapR + 46) / 2, 46 - gapR, z]);
  });
  // laid as 2 m pieces of kerb.glb (paper and navy halves), each run stretched a little to end exactly at the road
  const pieces: THREE.Matrix4[] = [];
  kerbAt.forEach(([x, w, z]) => {
    const n = Math.max(1, Math.round(w / 2));
    const len = w / n;
    for (let k = 0; k < n; k++) pieces.push(new THREE.Matrix4().compose(new THREE.Vector3(x - w / 2 + len * (k + 0.5), 0, z), new THREE.Quaternion(), new THREE.Vector3(len / 2, 1, 1)));
  });
  const kerbStandIn = () => {
    const root = new THREE.Group();
    const mesh = new THREE.Mesh(new RoundedBoxGeometry(2, 0.16, 0.3, 2, 0.06).translate(0, 0.08, 0), mat(C.paper, 0x3a3f6e));
    mesh.castShadow = mesh.receiveShadow = true;
    root.add(mesh);
    return root;
  };
  const attach = (models: Models) => {
    const kerbs = instance(scene, models.kerb ?? kerbStandIn(), pieces.length);
    // 0.16 high: their shadow is invisible, and ~200 pieces would double their triangles in the shadow pass
    kerbs.parts.forEach((p) => (p.castShadow = false));
    pieces.forEach((m, k) => kerbs.set(k, m));
    kerbs.commit();
  };

  // road ribbon with its centre dashes
  // The road ends at the crest of the hill: the end camera stands just past it, so the hilltop under the name and
  // the links is a clean plane. S is the last ribbon step before the crest.
  const FULL = 500;
  let S = FULL;
  while (S > 1 && path.getPoint(S / FULL).z < HILL.crest) S--;
  const up = new THREE.Vector3(0, 1, 0);
  const v: number[] = [];
  const col: number[] = [];
  const idx: number[] = [];
  const onHero = (u: number) => u * N < 0.5;
  for (let k = 0; k <= S; k++) {
    const p = path.getPoint(k / FULL);
    const n = path.getTangent(k / FULL).cross(up).normalize().multiplyScalar(1.7);
    v.push(p.x - n.x, Y.road + groundHeight(p.x - n.x, p.z - n.z), p.z - n.z, p.x + n.x, Y.road + groundHeight(p.x + n.x, p.z + n.z), p.z + n.z);
    const c = onHero(k / FULL) ? ROAD.paper : ROAD.navy;
    col.push(c.r, c.g, c.b, c.r, c.g, c.b);
    if (k < S) idx.push(k * 2, k * 2 + 1, k * 2 + 2, k * 2 + 1, k * 2 + 3, k * 2 + 2);
  }
  const ribbon = new THREE.BufferGeometry();
  ribbon.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
  ribbon.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  ribbon.setIndex(idx);
  ribbon.computeVertexNormals();
  // at night the road glows a little from within, so it stays a readable band on the dark ground
  const roadMat = mat(0xffffff, 0xb4b8e6, { side: THREE.DoubleSide, vertexColors: true, emissive: 0x3a4090, emissiveIntensity: 0 });
  const road = new THREE.Mesh(ribbon, roadMat);
  road.receiveShadow = true;
  scene.add(road);

  // dashes: paper on the navy road (yellow at night), navy on the paper stretch over the hero page
  const paint = mat(C.paper, C.yellow, { emissive: C.yellow, emissiveIntensity: 0 });
  const navyPaint = mat(0x23275e, 0x23275e);
  for (let k = 0; k < 100; k++) {
    const p = path.getPoint(k / 100);
    if (p.z < HILL.crest) break;
    const y = Y.paint + groundHeight(p.x, p.z);
    const dash = box(0.14, 0.02, 1, onHero(k / 100) ? navyPaint : paint, p.x, p.z, y);
    dash.castShadow = false;
    const q = path.getPoint(k / 100 + 0.002);
    dash.lookAt(q.setY(Y.paint + groundHeight(q.x, q.z)));
  }
  for (let i = 1; i <= N - 2; i++) {
    const u = (i - 0.09) / N;
    const g = new THREE.Group();
    g.position.copy(path.getPoint(u));
    g.lookAt(path.getPoint(u + 0.003));
    scene.add(g);
    for (let k = -3; k <= 3; k++) box(0.3, 0.02, 1.5, paint, k * 0.46, 0, Y.paint, g).castShadow = false;
  }

  return {
    heroWords(o) {
      words.opacity = o;
      text.visible = o > 0.001;
    },
    fitHero(width, height, camera, target) {
      const aspect = width / height;
      // how much ground one unit of camera height shows: 2 * tan(fov / 2)
      const view = 2 * Math.tan(THREE.MathUtils.degToRad(fov) / 2);
      const camH = Math.max(27.6 / view, 46 / (view * aspect));
      const vh = view * camH;
      const vw = vh * aspect;
      const cx = -vw * 0.24;
      const cz = vh * 0.08;
      camera.set(cx, camH, cz + camH * 0.015);
      target.set(cx, 0, cz);
      // the page reaches 6% past every screen edge, so its rounded corners only show once the camera leaves
      blue.geometry.dispose();
      rim.geometry.dispose();
      blue.geometry = roundedPage(vw * 1.12, vh * 1.12, Math.min(vw, vh) * 0.05);
      rim.geometry = roundedPage(vw * 1.12 + 1.2, vh * 1.12 + 1.2, Math.min(vw, vh) * 0.05 + 0.6);
      blue.position.x = rim.position.x = cx;
      blue.position.z = rim.position.z = cz;
      // the poster covers exactly what the hero camera sees
      text.scale.set(vw, vh, 1);
      text.position.set(cx, Y.words, cz);
      viewport = [Math.max(1, Math.round(width)), Math.max(1, Math.round(height))];
      paintPoster();
    },
    attach,
    theme(e) {
      glows.forEach((m) => (m.emissiveIntensity = e * 0.38));
      roadMat.emissiveIntensity = e * 0.9;
      paint.emissiveIntensity = e * 0.7;
    },
  };
}
