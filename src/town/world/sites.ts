import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import type { Stop } from '../types';
import { C, FONTS, makeCanvas, smooth, type Kit } from './kit';
import { flipV, type Models } from './models';

const BARS = ['#f3f1ea', '#ffd60a', '#19b866', '#ff8fc7', '#ff4a2b', '#1f3bff', '#141414'];
/** Road half-width plus a verge: no building comes closer to the road's centre line than this. */
const CLEAR = 2.3;

interface Screen {
  at: THREE.Group;
  name: string;
  /** Second line under the name ("no signal" on projects without a recording). */
  sub: string;
  ctx: CanvasRenderingContext2D;
  canvasTex: THREE.CanvasTexture;
  face: THREE.MeshBasicMaterial;
  scoreboard: boolean;
  video?: HTMLVideoElement;
  videoTex?: THREE.VideoTexture;
  /** `<slug>.jpg`, asked for the first time the screen is nearest; shown until the video has frames. */
  posterUrl?: string;
  poster?: THREE.Texture;
}

const SW = 3.4;
const SH = 1.9125;
/**
 * Story buildings carry no screen: the Blender script joined the screen's frame and two legs (x = ±1.1, 0.2 behind the
 * quad) into the building mesh, so their triangles are cut out here; the `.glb` stays as it is. A triangle goes only
 * when all three corners sit inside the frame box or a leg column.
 */
function removeScreen(root: THREE.Object3D, quad: THREE.Mesh) {
  // the tilt is baked into the quad's vertices, so its plane comes from the geometry (matrices as of
  // `root.updateMatrixWorld` in attach, i.e. model space; the group is not applied yet)
  const q = quad.geometry.attributes.position;
  const corner = (k: number) => new THREE.Vector3().fromBufferAttribute(q, k).applyMatrix4(quad.matrixWorld);
  const c = corner(0).add(corner(1)).add(corner(2)).add(corner(3)).multiplyScalar(0.25);
  const n = new THREE.Vector3().crossVectors(corner(1).sub(corner(0)), corner(2).sub(corner(0))).normalize();
  if (n.z < 0) n.negate();
  const ux = new THREE.Vector3(1, 0, 0);
  const uy = new THREE.Vector3().crossVectors(n, ux).normalize();
  const w = new THREE.Vector3();
  const d = new THREE.Vector3();
  const inside = (v: THREE.Vector3) => {
    d.subVectors(v, c);
    const lz = d.dot(n);
    if (Math.abs(d.x) < SW / 2 + 0.2 && Math.abs(d.dot(uy)) < SH / 2 + 0.2 && lz > -0.22 && lz < 0.05) return true;
    return Math.abs(Math.abs(v.x) - 1.1) < 0.12 && Math.abs(v.z - (c.z - 0.2)) < 0.12 && v.y < c.y + 0.01 && v.y > c.y - 2.4;
  };
  quad.removeFromParent();
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh || mesh === quad) return;
    const geo = mesh.geometry;
    const pos = geo.attributes.position;
    const idx = geo.index ? Array.from(geo.index.array) : Array.from({ length: pos.count }, (_, k) => k);
    const ok = (k: number) => inside(w.fromBufferAttribute(pos, k).applyMatrix4(mesh.matrixWorld));
    const keep: number[] = [];
    for (let t = 0; t < idx.length; t += 3) {
      if (!(ok(idx[t]) && ok(idx[t + 1]) && ok(idx[t + 2]))) keep.push(idx[t], idx[t + 1], idx[t + 2]);
    }
    if (keep.length < idx.length) geo.setIndex(keep);
  });
}

export interface Sites {
  /** One group per stop that has a building; `groups[i]` is undefined for gate and end. */
  groups: (THREE.Group | undefined)[];
  /** Each stop's building at full size, in world space, once placed (the show-off camera frames it). */
  bounds: (THREE.Box3 | undefined)[];
  windows: THREE.MeshToonMaterial;
  /** Puts each stop's model (or a stand-in) into its group. Call once, after the models settled. */
  attach(models: Models): void;
  update(carX: number, carZ: number, grow: number, time: number, mayPlayVideo: boolean): void;
  dispose(): void;
}

/**
 * One model per stop, from `<building>.glb`. Every model has a `screen` quad that carries the stop's
 * live screen (recording, scoreboard, or a painted name); `flag` nodes wave. Groups exist from the start
 * so the camera and the card anchor work before the models arrive.
 */
export function buildSites(kit: Kit, stops: readonly Stop[], pts: THREE.Vector3[]): Sites {
  const { scene, colliders } = kit;
  const windows = kit.toon({ color: 0xffffff, emissive: C.yellow, emissiveIntensity: 0 });
  const groups: (THREE.Group | undefined)[] = [];
  const bounds: (THREE.Box3 | undefined)[] = [];
  const screenOf: (Screen | undefined)[] = [];
  const screens: Screen[] = [];
  const mails: THREE.Mesh[] = [];
  const flags: THREE.Object3D[] = [];
  let arm: THREE.Object3D | undefined;

  stops.forEach((stop, i) => {
    if (stop.building === 'none') {
      groups.push(undefined);
      screenOf.push(undefined);
      return;
    }
    const g = new THREE.Group();
    g.position.set(pts[i].x + stop.side * 6.5, 0, pts[i].z - 1);
    scene.add(g);
    groups.push(g);

    // only the six project buildings have a screen
    if (stop.kind !== 'project') {
      screenOf.push(undefined);
      return;
    }
    const scoreboard = stop.building === 'pbundip';
    const { ctx, tex } = makeCanvas(256, 144);
    tex.flipY = false; // glTF UVs
    const face = new THREE.MeshBasicMaterial({ map: tex, fog: false });
    const screen: Screen = {
      at: g,
      name: stop.name.toUpperCase(),
      sub: 'no signal',
      ctx,
      canvasTex: tex,
      face,
      scoreboard,
    };
    // `town/video/<slug>.mp4` when it exists: a missing file errors on first play and the screen stays on "no signal"
    {
      const base = `${import.meta.env.BASE_URL}town/video/${stop.slug}`;
      const video = document.createElement('video');
      video.muted = video.loop = video.playsInline = true;
      video.preload = 'none';
      video.src = stop.video ?? `${base}.mp4`;
      video.addEventListener('error', () => {
        screen.video = screen.poster = undefined;
        screen.videoTex?.dispose();
        show(screen, screen.canvasTex);
      });
      screen.video = video;
      screen.videoTex = new THREE.VideoTexture(video);
      screen.videoTex.flipY = false;
      screen.posterUrl = `${base}.jpg`;
    }
    screens.push(screen);
    screenOf.push(screen);

    // TempeMail keeps sending: envelopes fly up out of the mailbox
    if (stop.building === 'tempe-mail') {
      const paper = kit.mat(0xffffff, 0xd8d8e8);
      for (let k = 0; k < 3; k++) mails.push(kit.box(1.1, 0.06, 0.75, paper, 0, 1.2, 3.5, g));
    }
  });

  /** When a file is missing: a block in the stop's colour with a screen on top, enough to read the stop. */
  const standIn = (stop: Stop) => {
    const root = new THREE.Group();
    const color = stop.kind === 'project' || stop.kind === 'story' ? C[stop.color] : C.paper;
    const add = (mesh: THREE.Mesh, x: number, y: number, z: number) => {
      mesh.position.set(x, y, z);
      mesh.castShadow = mesh.receiveShadow = true;
      root.add(mesh);
      return mesh;
    };
    add(new THREE.Mesh(new RoundedBoxGeometry(4, 3, 3.5, 2, 0.2), kit.mat(0xffffff, 0xd8d8e8)), 0, 1.5, 0);
    add(new THREE.Mesh(new RoundedBoxGeometry(4.3, 0.3, 3.8, 2, 0.12), kit.mat(color)), 0, 3.15, 0);
    const quad = add(new THREE.Mesh(flipV(new THREE.PlaneGeometry(3.4, 1.9125)), kit.mat(C.ink)), 0, 4.6, -0.4);
    quad.name = 'screen';
    quad.rotation.x = -0.35;
    return root;
  };

  const attach = (models: Models) => {
    const box = new THREE.Box3();
    const size = new THREE.Vector3();
    stops.forEach((stop, i) => {
      const g = groups[i];
      if (!g || stop.building === 'none') return;
      const root = models[stop.building] ?? standIn(stop);
      root.updateMatrixWorld(true);
      box.setFromObject(root);
      box.getSize(size);
      // wide models (campus, AI site) step back from the road instead of reaching onto it
      const roadX = pts[i].x;
      g.position.x = stop.side < 0 ? Math.min(roadX - 6.5, roadX - CLEAR - box.max.x) : Math.max(roadX + 6.5, roadX + CLEAR - box.min.x);
      g.add(root);
      bounds[i] = box.clone().translate(g.position);

      const quad = root.getObjectByName('screen') as THREE.Mesh | undefined;
      const screen = screenOf[i];
      if (quad && screen) {
        quad.material = screen.face;
        quad.castShadow = false;
      } else if (quad) removeScreen(root, quad);
      const flag = root.getObjectByName('flag');
      if (flag && stop.building === 'tempe-mail') arm = flag;
      else if (flag) flags.push(flag);
      // the badminton court can be driven across
      if (stop.building !== 'pbundip') colliders.push([g.position.x, g.position.z, Math.max(size.x, size.z) * 0.4]);
    });
  };

  let a = 0;
  let b = 0;
  let scoredAt = 0;
  const draw = (s: Screen, time: number) => {
    const q = s.ctx;
    q.textAlign = 'center';
    if (s.scoreboard) {
      q.fillStyle = '#141414';
      q.fillRect(0, 0, 256, 144);
      q.fillStyle = '#ffd60a';
      q.font = '92px Anton';
      q.textBaseline = 'middle';
      q.fillText(`${a}  ${b}`, 128, 78);
    } else {
      const shift = (time * 24) % 37;
      for (let k = -1; k < 8; k++) {
        q.fillStyle = BARS[(k + 7) % 7];
        q.fillRect(k * 37 + shift, 0, 37, 144);
      }
      q.fillStyle = '#141414';
      q.fillRect(0, 44, 256, 56);
      q.fillStyle = '#f3f1ea';
      q.textBaseline = 'alphabetic';
      q.font = '30px Anton';
      q.fillText(s.name, 128, 78, 240);
      q.font = '10px "Schibsted Grotesk"';
      q.fillText(s.sub, 128, 92);
    }
    s.canvasTex.needsUpdate = true;
  };
  kit.whenFonts([FONTS.anton, FONTS.grotesk], () => screens.forEach((s) => draw(s, 0)));

  const show = (s: Screen, tex: THREE.Texture) => {
    if (s.face.map !== tex) {
      s.face.map = tex;
      s.face.needsUpdate = true;
    }
  };

  return {
    groups,
    bounds,
    windows,
    attach,
    dispose() {
      screens.forEach((s) => {
        if (s.video) {
          s.video.pause();
          s.video.removeAttribute('src');
          s.video.load();
        }
        s.videoTex?.dispose();
        s.poster?.dispose();
        s.canvasTex.dispose();
      });
    },
    update(carX, carZ, grow, time, mayPlayVideo) {
      groups.forEach((g) => {
        if (!g) return;
        const rise = Math.max(0.001, 1 - smooth(16, 30, Math.hypot(carX - g.position.x, carZ - g.position.z) - 8));
        g.scale.set(grow || 0.001, rise, grow || 0.001);
      });
      flags.forEach((f, k) => (f.rotation.y = Math.sin(time * 3 + k) * 0.4));
      if (arm) arm.rotation.x = -0.6 * (0.5 + 0.5 * Math.sin(time * 1.6)); // the mailbox's signal arm goes up and down
      mails.forEach((e, n) => {
        const p = (time * 0.35 + n / 3) % 1;
        e.position.set(Math.sin(p * 5 + n) * 0.8, 3.5 + p * 4, 1.2 + p * 2.5);
        e.rotation.set(p * 2, p * 3, 0);
        e.scale.setScalar(Math.sin(p * Math.PI));
      });
      if (time - scoredAt > 1.3) {
        scoredAt = time;
        if (Math.random() < 0.5) a++;
        else b++;
        if (a > 21 || b > 21) a = b = 0;
      }

      // only the screen nearest to the car is live
      let nearest: Screen | undefined;
      let best = 30;
      for (const s of screens) {
        const d = Math.hypot(carX - s.at.position.x, carZ - s.at.position.z);
        if (d < best) {
          best = d;
          nearest = s;
        }
      }
      for (const s of screens) {
        if (!s.video || !s.videoTex) continue;
        if (s === nearest && s.posterUrl) {
          const url = s.posterUrl;
          s.posterUrl = undefined;
          new THREE.TextureLoader().load(url, (t) => {
            t.flipY = false;
            t.colorSpace = THREE.SRGBColorSpace;
            if (s.video) s.poster = t;
            else t.dispose();
          });
        }
        const still = s.poster ?? s.canvasTex;
        if (s === nearest && mayPlayVideo) {
          if (s.video.paused && !s.video.error) s.video.play().catch(() => undefined);
          show(s, s.video.readyState >= 2 ? s.videoTex : still);
        } else {
          if (!s.video.paused) s.video.pause();
          show(s, still);
        }
      }
      if (nearest && nearest.face.map === nearest.canvasTex) draw(nearest, time);
    },
  };
}
