import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import nameFontUrl from 'three/examples/fonts/helvetiker_bold.typeface.json?url';
import type { CreateWorld, Stop, WorldFrame } from '../types';
import { buildCar } from './car';
import { buildCity } from './city';
import { buildGround } from './ground';
import { C, clamp01, createKit, makeCanvas, smooth, wrapAngle } from './kit';
import { loadModels, makeToonifier, type Models } from './models';
import { buildProps } from './props';
import { buildSigns } from './signs';
import { buildSites } from './sites';
import { groundHeight, makePath, nearestTour, roadPoints, tourToPath } from './tourMath';

/** Narrow lens for the miniature look. Every camera distance below was tuned at 38 degrees and is scaled by LENS. */
const FOV = 28;
/** Sky colour in the middle of the day/night handover. */
const DUSK = 0xf6a07a;
const MOON = 7; // radius of the sun and the moon at the ending: one disc above the name, swapped at the toggle
const MOON_UP = 3; // how far above the sky point the disc settles, so it sits over the name, not behind it
const LENS = Math.tan(THREE.MathUtils.degToRad(38) / 2) / Math.tan(THREE.MathUtils.degToRad(FOV) / 2);

/** Camera [height, distance back] while the car is at a stop, at 38 degrees. */
const shotOf = (s: Stop): [number, number] => {
  if (s.kind === 'project') return [14, 15];
  switch (s.building) {
    case 'start':
      return [21, 19];
    case 'side-alley':
      return [19, 18];
    case 'campus':
      return [27, 21];
    case 'certificates':
      return [24, 20];
    default:
      return [17, 16];
  }
};
const BOUNDS = { x: [-35, 29], z: [-232, 24] } as const;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/** About a 1080p frame of device pixels. Sharper than that costs fill rate the flat colours do not show. */
const PIXEL_BUDGET = 2.1e6;
/** Device pixels per CSS pixel: up to 1.5 on a small hi-dpi screen, down to 1 on a big one, never above the screen's own. */
const pixelRatio = (w: number, h: number) => clamp(Math.sqrt(PIXEL_BUDGET / (w * h)), 1, Math.min(1.5, window.devicePixelRatio || 1));

export const createWorld: CreateWorld = ({ canvas, stops, commits, hero, billboards, reducedMotion }) => {
  const N = stops.length - 1;
  const pts = roadPoints(stops.length);
  const path = makePath(stops.length);
  const endZ = pts[N].z - 25; // where the big name stands
  // The end camera stands on the hilltop, END_D in front of the name: everything else in town (stops, signs, lamps,
  // props) is behind it. The name scales down on narrow screens so it fits the width with margin instead.
  const END_D = 40;
  let nameMesh: THREE.Mesh | null = null;
  const nameFace = new THREE.MeshBasicMaterial({ color: C.ink, fog: false });
  let nameSide: THREE.MeshToonMaterial | null = null; // made with the name, once the kit exists
  let nameWidth = 33; // measured once the font has loaded
  let nameScale = 1;
  const fitName = () => {
    const halfWide = Math.tan(THREE.MathUtils.degToRad(FOV) / 2) * cam.aspect;
    nameScale = Math.min(1, (2 * END_D * halfWide) / 1.2 / nameWidth);
    nameMesh?.scale.setScalar(nameScale);
  };

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // soft edges instead of stair steps
  const scene = new THREE.Scene();
  const background = new THREE.Color(C.paper);
  // haze comes in sooner than the old wide lens did: the far town softens like a model photographed close up
  const fog = new THREE.Fog(C.paper, 62, 190);
  scene.background = background;
  scene.fog = fog;
  // near = 1: the narrow lens puts the hero camera up to ~190 high, where 0.1 left too little depth precision for the layered ground
  const cam = new THREE.PerspectiveCamera(FOV, 1, 1, 800);

  let dead = false;
  let lost = false;
  let healthy = true;
  const kit = createKit(scene, () => dead);

  const ground = buildGround(kit, path, pts, stops, hero, renderer.capabilities.getMaxAnisotropy(), FOV);
  const sites = buildSites(kit, stops, pts);
  const city = buildCity(kit, path, commits, sites.groups.filter((g): g is THREE.Group => !!g));
  const signs = buildSigns(kit, path, pts, stops, billboards);
  const props = buildProps(kit, path);

  // the ending: the name, and the sun (or moon) behind it
  // the sun and the moon: at the toggle the sun sets on one arc while the moon rises on the other (see theme)
  const disc = new THREE.SphereGeometry(36, 64, 48);
  const orb = new THREE.Mesh(disc, new THREE.MeshBasicMaterial({ color: C.red, fog: false }));
  // the moon: pale warm cream with three flat craters, smaller than the sun and above the name (paper at night)
  const moon = new THREE.Mesh(disc, new THREE.MeshBasicMaterial({ color: 0xf1e8d0, fog: false }));
  const crater = new THREE.MeshBasicMaterial({ color: 0xd9ccaa, fog: false });
  for (const [x, y, r] of [[-11, 9, 7], [12, -4, 5], [-3, -15, 3.5]]) {
    const c = new THREE.Mesh(new THREE.CircleGeometry(r, 32), crater);
    c.position.set(x, y, 36.5);
    moon.add(c);
  }
  moon.scale.setScalar(MOON / 36);
  orb.scale.setScalar(MOON / 36);
  const top = groundHeight(0, endZ);
  const skyAt = new THREE.Vector3(0, 18 + top, endZ - 90);
  const moonAt = new THREE.Vector3(0, MOON_UP, 0).add(skyAt);
  orb.position.copy(moonAt);
  moon.position.copy(moonAt).add(new THREE.Vector3(-130, -95, 0));
  scene.add(orb, moon);

  // Along the road the sky is rarely in view, so the handover crosses the ground instead: a soft band moving the way
  // the sun goes, a blue shade going to night and a warm light going to day.
  const band = makeCanvas(256, 1);
  const grad = band.ctx.createLinearGradient(0, 0, 256, 0);
  grad.addColorStop(0, 'rgba(255,255,255,0)');
  grad.addColorStop(0.5, 'rgba(255,255,255,1)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  band.ctx.fillStyle = grad;
  band.ctx.fillRect(0, 0, 256, 1);
  band.tex.needsUpdate = true;
  const sweepMat = new THREE.MeshBasicMaterial({ map: band.tex, transparent: true, opacity: 0, depthWrite: false });
  const sweep = new THREE.Mesh(new THREE.PlaneGeometry(18, 90).rotateX(-Math.PI / 2), sweepMat);
  sweep.visible = false;
  scene.add(sweep);
  new FontLoader().load(nameFontUrl, (font) => {
    if (dead) return;
    const g = new TextGeometry('GHUFRON', { font, size: 6, height: 3, curveSegments: 6, bevelEnabled: true, bevelThickness: 0.25, bevelSize: 0.16, bevelSegments: 3 });
    g.computeBoundingBox();
    const b = g.boundingBox;
    if (b) {
      g.translate(-(b.max.x + b.min.x) / 2, -b.min.y, 0);
      nameWidth = b.max.x - b.min.x;
    }
    // two-tone on purpose, like letterpress: a flat ink face that never shades, paper sides and bevels (groups 0
    // and 1). At night they swap, paper face and ink sides, as the page does. No fog: full colour against the sun.
    // the two tones swap at the middle of the handover (in theme), never blending through grey
    nameSide = kit.toon({ color: C.paper, fog: false });
    const name = new THREE.Mesh(g, [nameFace, nameSide]);
    name.position.set(0, top, endZ);
    name.castShadow = true;
    scene.add(name);
    nameMesh = name;
    fitName();
    drawnNight = -1; // the new material picks up the current theme on the next frame
  });

  const toyCar = buildCar(kit);
  const { car } = toyCar;

  // The models (public/town/models) are fetched in parallel now and placed when they settle: the ground, road and
  // hero poster paint first, buildings grow in as usual. A file that fails gets a code-built stand-in, never the plain page.
  const disposeTree = (root: THREE.Object3D) =>
    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      mesh.geometry?.dispose();
      (Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : []).forEach((m) => m.dispose());
      if ((o as THREE.InstancedMesh).isInstancedMesh) (o as THREE.InstancedMesh).dispose();
    });
  let loaded: Models = {};
  const special = { window: sites.windows, light: city.lamp, headlight: toyCar.head, taillight: toyCar.tail };
  const toon = makeToonifier(kit, special);
  const toonCity = makeToonifier(kit, { ...special, ...city.materials }); // the blocks' own body tint and windows
  loadModels()
    .then((models) => {
      loaded = models;
      if (dead) return Object.values(models).forEach((root) => root && disposeTree(root));
      Object.entries(models).forEach(([name, root]) => root && (name === 'city_blocks' ? toonCity : toon)(root));
      ground.attach(models);
      sites.attach(models);
      city.attach(models);
      signs.attach(models);
      props.attach(models);
      toyCar.attach(models.car);
      drawnNight = -1; // the new materials pick up the current theme on the next frame
    })
    .catch((err) => console.warn('[town] could not place the models', err));

  // Near-white sky fill and a warm key by day, so the palette shows true (a lilac sky turned paper pink-grey).
  // Shadows still go blue-purple through kit.shade. At night: a cooler sky and a moonlit key, dimmer but not black,
  // so the night palette (kit NIGHT) reads as itself instead of mud.
  const sky = new THREE.HemisphereLight(0xeef0ff, 0xd9d0f0, 1.6);
  const sun = new THREE.DirectionalLight(0xfff0d8, 2.4);
  const LIGHT = { skyDay: 0xeef0ff, skyNight: 0xb8c2ff, groundDay: 0xd9d0f0, groundNight: 0x6a5fb0, sunDay: 0xfff0d8, sunNight: 0xc4ceff } as const;
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  // rounded boxes have many small faces: without a normal bias their lit sides show shadow acne
  sun.shadow.normalBias = 0.05;
  sun.shadow.bias = -0.0004;
  // a tighter box around the car: 1024 texels over 56 units instead of 72, so edges stay clean
  Object.assign(sun.shadow.camera, { left: -28, right: 28, top: 28, bottom: -28, near: 1, far: 110 });
  scene.add(sky, sun, sun.target);

  // day and night is one number: colours blend, the light swings round so the shadows sweep
  let night = 0;
  let drawnNight = -1;
  const arc = new THREE.Vector3();
  const mixA = new THREE.Color();
  const mixB = new THREE.Color();
  const mix = (a: number, b: number, e: number) => mixA.setHex(a).lerp(mixB.setHex(b), e);
  const theme = () => {
    const e = smooth(0, 1, night);
    kit.themed.forEach(([m, day, dark]) => m.color.copy(mix(day, dark, e)));
    // the sky passes through dusk on its way, so the handover reads as a sunset (or sunrise), not a fade to grey
    background.copy(e < 0.5 ? mix(C.paper, DUSK, e * 2) : mix(DUSK, C.night, e * 2 - 1));
    nameFace.color.setHex(e < 0.5 ? C.ink : C.paper);
    nameSide?.color.setHex(e < 0.5 ? C.paper : 0x23275e);
    fog.color.copy(background);
    city.bodyColor.copy(mix(0xffffff, 0x5a64a8, e));
    // lamps switch on partway through the handover, not with the first step
    const lampsOn = smooth(0.42, 0.62, night);
    city.lampColor.copy(mix(0xb8b4a6, C.yellow, lampsOn));
    city.lampGlow.opacity = lampsOn * 0.4;
    city.windows.emissiveIntensity = smooth(0.4, 1, night) * 1.1;
    ground.theme(e);
    // the sun sets on an arc down to the right while the moon rises from the left into its place above the name;
    // below the hilltop both are hidden
    orb.position.copy(moonAt).add(arc.set(Math.sin((e * Math.PI) / 2) * 130, -(1 - Math.cos((e * Math.PI) / 2)) * 95, 0));
    moon.position.copy(moonAt).add(arc.set(-Math.sin(((1 - e) * Math.PI) / 2) * 130, -(1 - Math.cos(((1 - e) * Math.PI) / 2)) * 95, 0));
    orb.visible = e < 0.999;
    moon.visible = e > 0.001;
    sky.color.copy(mix(LIGHT.skyDay, LIGHT.skyNight, e));
    sky.groundColor.copy(mix(LIGHT.groundDay, LIGHT.groundNight, e));
    sun.color.copy(mix(LIGHT.sunDay, LIGHT.sunNight, e));
    sky.intensity = 1.6 - e * 0.55;
    // dusk in the middle of the handover: the key light dips while it swings round
    sun.intensity = (2.4 - e * 1.2) * (0.25 + 0.75 * Math.abs(Math.cos(night * Math.PI)));
    kit.shade.shadeLit.value = Math.max(0.04, sun.intensity * 0.27);
    sites.windows.emissiveIntensity = smooth(0.5, 1, night) * 2.2;
  };

  let width = 1;
  let height = 1;
  /** Seconds since the last draw (see the end of update). */
  let sinceDraw = Infinity;
  const heroCam = new THREE.Vector3();
  const heroLook = new THREE.Vector3();
  const resize = (w: number, h: number) => {
    width = Math.max(1, w);
    height = Math.max(1, h);
    renderer.setPixelRatio(healthy ? pixelRatio(width, height) : 1);
    renderer.setSize(width, height, false);
    cam.aspect = width / height;
    cam.updateProjectionMatrix();
    ground.fitHero(width, height, heroCam, heroLook);
    fitName();
    sinceDraw = Infinity; // setSize cleared the canvas: draw on the next frame, still or not
  };
  resize(canvas.clientWidth || window.innerWidth, canvas.clientHeight || window.innerHeight);

  const onLost = (e: Event) => {
    e.preventDefault();
    lost = true;
  };
  const onRestored = () => {
    lost = false;
    drawnNight = -1;
  };
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);

  const shots = stops.map((s) => shotOf(s).map((v) => v * LENS));
  // the end camera looks level, from low over the hilltop: the name sits in the upper half, "Say hi." below it
  const endLook = new THREE.Vector3(0, top, endZ);
  const pos = heroCam.clone();
  const lookAt = heroLook.clone();
  const target = new THREE.Vector3();
  const look = new THREE.Vector3();
  const end = new THREE.Vector3();
  const cp = new THREE.Vector3();
  const ahead = new THREE.Vector3();
  const drivePos = new THREE.Vector3();
  const offset = new THREE.Vector3(); // car position minus path position, fading out after a drive
  const projected = new THREE.Vector3();

  // "Show off": at a stop with a building, the camera turns to the building (with its screen) and the car and fits them
  // into the part of the window the card or story panel leaves free, so they are the subject of the frame.
  const SHOW_TILT = 0.5; // looking down about 29 degrees, from the front where the screens face
  const showUp = new THREE.Vector3(0, Math.cos(SHOW_TILT), -Math.sin(SHOW_TILT));
  const showBack = new THREE.Vector3(0, Math.sin(SHOW_TILT), Math.cos(SHOW_TILT));
  const subject = new THREE.Box3();
  const centre = new THREE.Vector3();
  const size = new THREE.Vector3();
  const showPos = new THREE.Vector3();
  const showLook = new THREE.Vector3();
  /** The window area the overlay leaves free at this stop, in CSS px: [left, top, right, bottom]. Mirrors the
   *  layouts of ProjectCard and StoryPanel (the `sheet` variant is under 900 wide or 620 high). */
  const freeArea = (stop: Stop): [number, number, number, number] => {
    const w = width;
    const h = height;
    const sheet = w < 900 || h <= 620;
    const area: [number, number, number, number] = [16, 72, w - 16, h - 24]; // under the top bar
    if (stop.kind === 'project') {
      if (sheet) area[3] = h - Math.min(340, h * 0.5) - 16; // the bottom-sheet card measures about 300-320 px
      else {
        const card = 0.07 * w + Math.min(560, 0.68 * h) * 0.714 + 24;
        if (stop.side === 1) area[0] = card;
        else area[2] = w - card;
      }
    } else if (sheet) area[3] = h - Math.min(0.56 * h, 560);
    else {
      area[2] = w - Math.max(0.48 * Math.max(w, h), 0.04 * w + Math.min(0.38 * w, 580)) - 16;
      // the scene title (two lines, bottom left, SceneTitle) shows while the car arrives: keep the facade above it
      area[3] = h - 34 - 2 * 0.9 * clamp(0.08 * w, 44, 128) - 12;
    }
    return area;
  };
  const frameStop = (box: THREE.Box3, stop: Stop) => {
    subject.copy(box).expandByPoint(projected.set(cp.x - 1.6, cp.y, cp.z - 1.6)).expandByPoint(projected.set(cp.x + 1.6, cp.y + 1.6, cp.z + 1.6));
    subject.getCenter(centre);
    subject.getSize(size);
    // the box's half extents across the view: x is the camera's right, height and depth fold into its up
    const ex = size.x / 2;
    const ey = (size.y * Math.cos(SHOW_TILT) + size.z * Math.sin(SHOW_TILT)) / 2;
    const [l, t, r, b] = freeArea(stop);
    const tanV = Math.tan(THREE.MathUtils.degToRad(FOV) / 2);
    const tanH = tanV * cam.aspect;
    const hx = Math.max(0.1, (r - l) / width); // half extents and centre of the free area, in NDC
    const hy = Math.max(0.1, (b - t) / height);
    const cx = (l + r) / width - 1;
    const cy = 1 - (t + b) / height;
    const fill = stop.kind === 'project' ? 1 : 0.85; // story buildings: a little more room around them
    // distance to the box's front face plus the depth to its centre
    const dist = clamp(Math.max(ex / (hx * tanH), ey / (hy * tanV)) / fill + size.z / 2, 14, 120);
    showPos.copy(centre).addScaledVector(showBack, dist);
    // shift the aim so the subject lands in the middle of the free area rather than the middle of the window
    showLook.copy(centre).addScaledVector(showUp, -cy * tanV * dist);
    showLook.x -= cx * tanH * dist;
    showPos.x -= cx * tanH * dist;
    showPos.addScaledVector(showUp, -cy * tanV * dist);
  };
  let time = 0;
  let slow = 0;
  const lastLook = new THREE.Vector3();
  let wasDriving = false;
  let heading = 0;
  let speed = 0;
  let camHeading = 0;
  let headingPrev = Math.PI;
  let groundSpeedPrev = 0;
  let prevX = 0;
  let prevZ = 0;
  let roll = 0;
  let pitch = 0;
  let wheelTurn = 0;
  let lastSpeed = 0;

  const degrade = () => {
    healthy = false;
    renderer.shadowMap.enabled = false;
    sun.castShadow = false;
    renderer.setPixelRatio(1);
    renderer.setSize(width, height, false);
    // the screens keep playing: one 480p clip (only the nearest plays) costs little next to shadows and pixel ratio
  };

  const update = (frame: WorldFrame) => {
    if (dead || lost) return;
    const dt = Math.max(0.001, frame.dt);
    time += dt;
    if (healthy) {
      // under 40 fps for a second and a half: trade looks for speed
      // gaps over a quarter second are a hitch (models arriving, shaders compiling) or a hidden tab, not a slow device
      if (dt < 0.25) slow = dt > 1 / 40 ? slow + dt : Math.max(0, slow - dt * 2);
      if (slow > 1.5) degrade();
    }

    const hero = clamp01(frame.heroProgress);
    const x = clamp(frame.tour, 0, N);
    const i = Math.min(N - 1, Math.floor(x));
    const f = x - i;
    const t = tourToPath(x, N);
    const dropToEye = smooth(N - 1.6, N - 0.5, x);
    // settled before the end links show (tour within 0.28 of the end), so they never sit over the road or the car
    const settle = smooth(N - 0.8, N - 0.3, x);
    const grow = smooth(0.05, 0.75, hero);
    const onHero = 1 - smooth(0, 1, hero);
    ground.heroWords(1 - smooth(0.45, 0.9, hero));
    const driving = frame.mode === 'drive';

    path.getPoint(t, cp);
    path.getPoint(Math.min(1, t + 0.004), ahead);
    if (driving) {
      if (!wasDriving) {
        drivePos.copy(car.position);
        heading = headingPrev;
        speed = 0;
      }
      const { keys } = frame;
      const throttle = (keys.forward ? 1 : 0) - (keys.back ? 1 : 0);
      const steer = (keys.left ? 1 : 0) - (keys.right ? 1 : 0);
      speed = clamp(speed + throttle * 16 * dt - speed * 1.1 * dt, -7, 17);
      heading += steer * 2.3 * dt * clamp(speed / 5, -1, 1);
      // hands off the wheel within 12 degrees of a street (the blocks stand on a north-south, east-west grid): settle onto it,
      // so holding W drives down the street instead of slowly across it at whatever angle the road had
      if (!steer && Math.abs(speed) > 0.5) {
        const off = wrapAngle(Math.round(heading / (Math.PI / 2)) * (Math.PI / 2) - heading);
        if (Math.abs(off) < 0.21) heading += off * (1 - Math.exp(-dt * 3));
      }
      drivePos.x += Math.sin(heading) * speed * dt;
      drivePos.z += Math.cos(heading) * speed * dt;
      for (const [cx, cz, r] of kit.colliders) {
        const dx = drivePos.x - cx;
        const dz = drivePos.z - cz;
        const d = Math.hypot(dx, dz) || 0.01;
        const min = r + 0.8; // about the car's half width (0.64) plus a little air
        if (d < min) {
          drivePos.x = cx + (dx / d) * min;
          drivePos.z = cz + (dz / d) * min;
          speed *= 0.9;
        }
      }
      drivePos.x = clamp(drivePos.x, BOUNDS.x[0], BOUNDS.x[1]);
      drivePos.z = clamp(drivePos.z, BOUNDS.z[0], BOUNDS.z[1]);
      cp.copy(drivePos);
      ahead.set(drivePos.x + Math.sin(heading), 0, drivePos.z + Math.cos(heading));
      wheelTurn += (steer - wheelTurn) * (1 - Math.exp(-dt * 10));
    } else {
      if (wasDriving) offset.copy(drivePos).sub(cp);
      cp.add(offset);
      ahead.add(offset);
      offset.multiplyScalar(Math.exp(-dt * 3));
    }
    wasDriving = driving;

    // on the hill the car follows the ground, and lookAt tilts it with the slope
    const lift = groundHeight(cp.x, cp.z);
    cp.y = lift;
    ahead.y = groundHeight(ahead.x, ahead.z);
    car.position.copy(cp);
    car.lookAt(ahead);
    car.visible = driving || settle < 0.999; // out of frame by then; hiding it also takes its headlight pool along
    if (!driving && settle > 0) {
      // at the end the car pulls over to the right and out of frame: the name spans nearly the whole width,
      // so there is no spot beside it where the car would not cover a letter or the links
      const carDist = endZ + END_D - pts[N].z;
      const halfWide = Math.atan(Math.tan(THREE.MathUtils.degToRad(FOV) / 2) * cam.aspect);
      car.position.x += settle * (Math.tan(Math.min(1.4, halfWide * 1.25)) * carDist + 2);
    }
    const carHeading = Math.atan2(ahead.x - cp.x, ahead.z - cp.z);
    const vx = (cp.x - prevX) / dt;
    const vz = (cp.z - prevZ) / dt;
    const groundSpeed = Math.hypot(vx, vz);
    let turn = carHeading - headingPrev;
    if (Math.abs(turn) > 3) turn = 0;
    roll += (clamp((turn / dt) * 0.12, -0.3, 0.3) - roll) * 0.1;
    pitch += (clamp(((groundSpeed - groundSpeedPrev) / dt) * 0.0115, -0.12, 0.12) - pitch) * 0.1;
    if (!driving) wheelTurn += (clamp((turn / dt) * 0.6, -1, 1) - wheelTurn) * 0.15;
    const along = Math.sin(carHeading) * vx + Math.cos(carHeading) * vz;
    const signed = driving ? speed : along;
    toyCar.update({
      dt,
      time,
      speed: signed,
      steer: wheelTurn,
      roll,
      pitch,
      braking: driving && speed > 0.3 && (frame.keys.back || speed < lastSpeed - 0.01),
      night: smooth(0, 1, night),
      dust: driving && Math.abs(speed) > 3,
    });
    lastSpeed = speed;
    headingPrev = carHeading;
    groundSpeedPrev = groundSpeed;
    prevX = cp.x;
    prevZ = cp.z;

    props.update(cp.x, cp.z, vx, vz, dt);
    sites.update(cp.x, cp.z, grow, time, !reducedMotion);
    city.update(cp.x, cp.z, grow, time);

    if (night !== frame.night) {
      const step = reducedMotion ? 1 : dt / 1.4; // the handover takes 1.4 s; toggling midway turns it round
      night = frame.night > night ? Math.min(1, night + step) : Math.max(0, night - step);
    }
    if (night !== drawnNight) {
      drawnNight = night;
      theme();
    }
    const handover = night > 0 && night < 1 && !reducedMotion && dropToEye < 0.5;
    sweep.visible = handover;
    if (handover) {
      const toNight = frame.night === 1;
      sweep.position.set(cp.x + (night * 2 - 1) * 34, lift + 0.3, cp.z - 4);
      sweepMat.color.setHex(toNight ? 0x2233b8 : C.yellow);
      sweepMat.blending = toNight ? THREE.NormalBlending : THREE.AdditiveBlending;
      sweepMat.opacity = Math.sin(night * Math.PI) * (toNight ? 0.6 : 0.55);
    }
    const swing = night * Math.PI;
    sun.position.set(cp.x + 15 * Math.cos(swing) + 6, 8 + 20 * Math.abs(Math.cos(swing)), cp.z + 9);
    sun.target.position.copy(cp);

    // camera: hero (straight down) → per-district tour shot → eye level in front of the name. Driving gets a chase camera.
    const from = shots[i];
    const to = shots[i + 1];
    const e = smooth(0, 1, f);
    const tall = cam.aspect < 1;
    const zoom = tall ? 1.5 : 1;
    const shift = tall ? 0 : -(1 + 2.5 * clamp01(cam.aspect - 1)) * (stops[i].side + (stops[i + 1].side - stops[i].side) * e);
    target.set(cp.x + shift, (from[0] + (to[0] - from[0]) * e) * zoom, cp.z + (from[1] + (to[1] - from[1]) * e) * zoom);
    target.y += lift;
    const endCamZ = endZ + END_D;
    const eye = Math.max(0.7, 6.4 * nameScale * 0.22); // a fifth of the letters' height above the ground
    end.set(cp.x * (1 - settle), 0, cp.z + 10 + (endCamZ - cp.z - 10) * settle);
    end.y = eye + groundHeight(end.x, end.z);
    endLook.y = top + eye;
    look.set(cp.x + shift, lift, cp.z - 2);
    const k = Math.round(x);
    const box = sites.bounds[k];
    // story buildings turn to face the camera earlier, while their title is up, so the facade is seen whole
    const reach = stops[k]?.kind === 'story' ? 0.6 : 0.45;
    const showing = box ? (1 - smooth(0.1, reach, Math.abs(x - k))) * (1 - dropToEye) : 0;
    if (showing > 0 && box) {
      frameStop(box, stops[k]);
      target.lerp(showPos, showing);
      look.lerp(showLook, showing);
    }
    target.lerp(end, dropToEye);
    look.lerp(endLook, dropToEye);
    if (driving) {
      camHeading += wrapAngle(heading - camHeading) * (1 - Math.exp(-dt * 4));
      target.set(cp.x - Math.sin(camHeading) * 11 * LENS, 5.5 * LENS + lift, cp.z - Math.cos(camHeading) * 11 * LENS);
      look.set(cp.x + Math.sin(camHeading) * 5, 1 + lift, cp.z + Math.cos(camHeading) * 5);
    } else {
      camHeading = carHeading;
    }
    target.lerp(heroCam, onHero);
    look.lerp(heroLook, onHero);
    // on the hero the camera is pinned to the scroll (Lenis already smooths it), like lookAt below. Easing the position
    // while lookAt snaps tilted the hero page for a second after any resize, e.g. the scrollbar width at load.
    pos.lerp(target, reducedMotion || (onHero > 0 && !driving) ? 1 : 1 - Math.exp(-dt * 5));
    lookAt.lerp(look, reducedMotion || onHero > 0 ? 1 : 1 - Math.exp(-dt * 8));
    const still = !driving && !handover && night === frame.night && pos.distanceToSquared(cam.position) < 1e-6 && lookAt.distanceToSquared(lastLook) < 1e-6;
    cam.position.copy(pos);
    cam.lookAt(lookAt);
    lastLook.copy(lookAt);
    // a 120 or 144 Hz screen would otherwise draw the town twice as often for nothing; a camera at rest only has the
    // screens and the idle wobble to show, which 30 frames a second carries
    sinceDraw += dt;
    if (sinceDraw < (still ? 1 / 30 : 1 / 60) - 0.002) return;
    sinceDraw = 0;
    renderer.render(scene, cam);
  };

  return {
    update,
    resize,
    project(stopIndex) {
      const g = sites.groups[stopIndex];
      const p = pts[clamp(stopIndex, 0, N)];
      projected.set(g ? g.position.x : p.x, 3, g ? g.position.z : p.z).project(cam);
      return { x: ((projected.x + 1) / 2) * width, y: ((1 - projected.y) / 2) * height };
    },
    nearestTour: () => nearestTour(path, N, car.position.x, car.position.z),
    get healthy() {
      return healthy;
    },
    dispose() {
      dead = true;
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      sites.dispose();
      kit.ramp.dispose();
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        mesh.geometry?.dispose();
        if ((o as THREE.InstancedMesh).isInstancedMesh) (o as THREE.InstancedMesh).dispose();
        const materials = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
        materials.forEach((m) => {
          (m as THREE.MeshBasicMaterial).map?.dispose();
          (m as THREE.MeshToonMaterial).emissiveMap?.dispose();
          m.dispose();
        });
      });
      // model parts that were copied into instanced meshes, or never placed, are not in the scene
      Object.values(loaded).forEach((root) => root && disposeTree(root));
      renderer.dispose();
    },
  };
};

export default createWorld;
