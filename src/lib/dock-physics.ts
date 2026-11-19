export interface DockSettings {
  magnification: number; // 1.0 to 1.6 (default 1.44)
  influenceRadius: number; // in px (default 162)
  maxLift: number; // in px (default 16)
  maxSpread: number; // horizontal neighbor parting in px (default 11)
  reflectionOpacity: number; // 0 to 0.95 (default 0.78)
  enableBounce: boolean;
}

export const DEFAULT_DOCK_SETTINGS: DockSettings = {
  magnification: 1.44,
  influenceRadius: 162,
  maxLift: 16,
  maxSpread: 11,
  reflectionOpacity: 0.78,
  enableBounce: true,
};

export function clampNumber(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function clampDockSettings(partial: Partial<DockSettings>): DockSettings {
  return {
    magnification: clampNumber(
      partial.magnification ?? DEFAULT_DOCK_SETTINGS.magnification,
      1.0,
      1.6,
    ),
    influenceRadius: clampNumber(
      partial.influenceRadius ?? DEFAULT_DOCK_SETTINGS.influenceRadius,
      80,
      260,
    ),
    maxLift: clampNumber(partial.maxLift ?? DEFAULT_DOCK_SETTINGS.maxLift, 0, 28),
    maxSpread: clampNumber(
      partial.maxSpread ?? DEFAULT_DOCK_SETTINGS.maxSpread,
      0,
      20,
    ),
    reflectionOpacity: clampNumber(
      partial.reflectionOpacity ?? DEFAULT_DOCK_SETTINGS.reflectionOpacity,
      0,
      0.95,
    ),
    enableBounce: partial.enableBounce ?? DEFAULT_DOCK_SETTINGS.enableBounce,
  };
}

/**
 * Smoothstep falloff returning 1 at distance 0 and 0 at distance >= radius.
 */
export function computeProximityIntensity(
  distance: number,
  influenceRadius: number,
): number {
  if (influenceRadius <= 0) return 0;
  const s = Math.max(0, 1 - Math.abs(distance) / influenceRadius);
  return s * s * (3 - 2 * s);
}

/**
 * Allocation-free target calculation writing into pre-allocated arrays for 60/120fps rAF loops.
 * Computes GPU-only scale, vertical lift, smooth horizontal neighbor parting, and z-index.
 */
export function writeDockIconTargets(params: {
  itemCenters: readonly number[];
  pointerX: number | null;
  settings: DockSettings;
  outScales: number[];
  outLifts: number[];
  outOffsetsX: number[];
  outZIndices: number[];
}): void {
  const {
    itemCenters,
    pointerX,
    settings,
    outScales,
    outLifts,
    outOffsetsX,
    outZIndices,
  } = params;
  const count = itemCenters.length;

  if (pointerX === null || settings.magnification <= 1.001) {
    for (let i = 0; i < count; i++) {
      outScales[i] = 1;
      outLifts[i] = 0;
      outOffsetsX[i] = 0;
      outZIndices[i] = 3;
    }
    return;
  }

  const scaleDelta = settings.magnification - 1;
  const radius = settings.influenceRadius;

  for (let i = 0; i < count; i++) {
    const signedDist = itemCenters[i] - pointerX;
    const intensity = computeProximityIntensity(signedDist, radius);
    outScales[i] = 1 + scaleDelta * intensity;
    outLifts[i] = -settings.maxLift * intensity;
    outZIndices[i] = 3 + Math.round(12 * intensity);

    if (radius > 0 && Math.abs(signedDist) < radius && settings.maxSpread > 0) {
      const norm = signedDist / radius; // -1..1
      const envelope = Math.cos(norm * Math.PI * 0.5);
      outOffsetsX[i] = Math.sin(norm * Math.PI) * envelope * settings.maxSpread;
    } else {
      outOffsetsX[i] = 0;
    }
  }
}

export interface SpringStepResult {
  value: number;
  velocity: number;
  settled: boolean;
}

/**
 * Sub-stepped semi-implicit Euler damped spring for frame-rate-independent,
 * interruptible motion with continuous velocity on rapid pointer reversals.
 */
export function stepSpring(
  value: number,
  velocity: number,
  target: number,
  dtSeconds: number,
  options?: {
    stiffness?: number;
    damping?: number;
    valueThreshold?: number;
    velocityThreshold?: number;
  },
): SpringStepResult {
  const stiffness = options?.stiffness ?? 460;
  const damping = options?.damping ?? 34;
  const valueThreshold = options?.valueThreshold ?? 0.0005;
  const velocityThreshold = options?.velocityThreshold ?? 0.001;

  const clampedDt = Math.min(0.032, Math.max(0.001, dtSeconds));
  const subDt = clampedDt * 0.5;

  let x = value;
  let v = velocity;

  for (let s = 0; s < 2; s++) {
    const force = (target - x) * stiffness;
    const accel = force - v * damping;
    v += accel * subDt;
    x += v * subDt;
  }

  if (
    Math.abs(target - x) < valueThreshold &&
    Math.abs(v) < velocityThreshold
  ) {
    return { value: target, velocity: 0, settled: true };
  }

  return { value: x, velocity: v, settled: false };
}
