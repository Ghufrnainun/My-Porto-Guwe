import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import type { Stop, World, WorldFrame } from './types';

/** Screens of scroll per stop. The page is one hero screen plus the tour. */
export const SCREENS_PER_STOP = 0.8;

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));

type Keys = WorldFrame['keys'];
const DRIVE_KEYS: Record<string, keyof Keys> = {
  w: 'forward',
  arrowup: 'forward',
  s: 'back',
  arrowdown: 'back',
  a: 'left',
  arrowleft: 'left',
  d: 'right',
  arrowright: 'right',
};
/** Keys that may take the wheel from the tour. Left/right stay "previous/next stop". */
const ENTER_DRIVE = new Set(['w', 'a', 's', 'd', 'arrowup', 'arrowdown']);

const typingOrModal = (target: EventTarget | null) =>
  target instanceof Element &&
  (target.closest('input, textarea, select, [contenteditable="true"], dialog[open]') !== null ||
    document.querySelector('[data-town-modal]') !== null);

/**
 * Owns the numbers of the tour. Per-frame values live in refs; only what the DOM
 * has to re-render for (active stop, nearest stop, mode, past-the-hero) is state.
 * active: the stop the car is parked at, or -1. near: the nearest stop once in town, or -1.
 */
export function useTour(stops: readonly Stop[], worldRef: MutableRefObject<World | null>) {
  const n = stops.length - 1;
  const hero = useRef(0);
  const pos = useRef(0);
  const mode = useRef<WorldFrame['mode']>('tour');
  const keys = useRef<Keys>({ forward: false, back: false, left: false, right: false });
  const lenis = useRef<Lenis | null>(null);
  const total = useRef(1 + n * SCREENS_PER_STOP);
  const shown = useRef({ active: -1, near: -1, started: false });

  const [active, setActive] = useState(-1);
  const [near, setNear] = useState(-1);
  const [started, setStarted] = useState(false);
  const [driving, setDriving] = useState(false);

  const topOf = useCallback(
    (tour: number) => (1 + clamp(tour / n) * (total.current - 1)) * window.innerHeight + 2,
    [n],
  );

  const exitDrive = useCallback(() => {
    if (mode.current !== 'drive') return;
    const at = worldRef.current?.nearestTour() ?? pos.current;
    lenis.current?.scrollTo(topOf(at), { immediate: true, force: true });
    keys.current = { forward: false, back: false, left: false, right: false };
    mode.current = 'tour';
    setDriving(false);
  }, [topOf, worldRef]);

  const goTo = useCallback(
    (stop: number) => {
      exitDrive();
      lenis.current?.scrollTo(topOf(clamp(stop, 0, n)), { duration: 1.6, force: true });
    },
    [exitDrive, topOf, n],
  );

  const toTop = useCallback(() => {
    exitDrive();
    lenis.current?.scrollTo(0, { duration: 2, force: true });
  }, [exitDrive]);

  /** Call once per animation frame, before world.update. */
  const frame = useCallback(
    (now: number) => {
      lenis.current?.raf(now);
      // a 0-height viewport (hidden or collapsed frame) would turn these into NaN, and the world throws on NaN
      const s = window.scrollY / (window.innerHeight || 1);
      hero.current = clamp(s);
      pos.current = clamp((s - 1) / Math.max(1e-6, total.current - 1)) * n;

      const nearest = Math.round(pos.current);
      const inTown = hero.current >= 0.95 && mode.current === 'tour';
      const a = inTown && Math.abs(pos.current - nearest) < 0.28 ? nearest : -1;
      const d = inTown ? nearest : -1;
      const st = hero.current > 0.1;
      if (a !== shown.current.active) setActive((shown.current.active = a));
      if (d !== shown.current.near) setNear((shown.current.near = d));
      if (st !== shown.current.started) setStarted((shown.current.started = st));
    },
    [n],
  );

  useEffect(() => {
    const l = new Lenis({ lerp: 0.085 });
    lenis.current = l;
    const measure = () => {
      const vh = window.innerHeight || 1;
      total.current = Math.max(1, (document.documentElement.scrollHeight - vh) / vh);
    };
    measure();
    window.addEventListener('resize', measure);

    // same rule as the `drive` screen in tailwind.config.ts: no driving on touch or in small windows
    const canDrive = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 900px) and (min-height: 621px)').matches;

    const down = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || typingOrModal(e.target)) return;
      const k = e.key.toLowerCase();
      if (mode.current === 'drive') {
        if (k === 'escape') return exitDrive();
        const dir = DRIVE_KEYS[k];
        if (!dir) return;
        e.preventDefault();
        keys.current[dir] = true;
        return;
      }
      if (k === 'arrowright') return goTo(Math.round(pos.current) + 1);
      if (k === 'arrowleft') return goTo(Math.round(pos.current) - 1);
      if (canDrive && hero.current >= 0.95 && ENTER_DRIVE.has(k)) {
        e.preventDefault();
        keys.current[DRIVE_KEYS[k]] = true;
        mode.current = 'drive';
        setDriving(true);
      }
    };
    const up = (e: KeyboardEvent) => {
      const dir = DRIVE_KEYS[e.key.toLowerCase()];
      if (dir) keys.current[dir] = false;
    };
    const release = () => {
      keys.current = { forward: false, back: false, left: false, right: false };
    };

    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', release);
    window.addEventListener('wheel', exitDrive, { passive: true });
    window.addEventListener('touchmove', exitDrive, { passive: true });
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', release);
      window.removeEventListener('wheel', exitDrive);
      window.removeEventListener('touchmove', exitDrive);
      l.destroy();
      lenis.current = null;
    };
  }, [exitDrive, goTo]);

  return useMemo(
    () => ({ hero, pos, mode, keys, active, near, started, driving, goTo, toTop, exitDrive, frame }),
    [active, near, started, driving, goTo, toTop, exitDrive, frame],
  );
}

export type Tour = ReturnType<typeof useTour>;
