// Studio-grade Web Audio API UI Synthesizer for GanOS & Ghufron Town
// Zero external audio assets, ultra-low latency, cohesive glass/ceramic/felt acoustics,
// master dynamics limiter, procedural early-reflection room reverb, and micro-variation.

const SOUND_STORAGE_KEY = 'ganos-sound-effects-enabled';

interface AudioEngine {
  ctx: AudioContext;
  dryBus: GainNode;
  reverbSend: GainNode;
  whiteNoise: AudioBuffer;
  pinkNoise: AudioBuffer;
}

let engineInstance: AudioEngine | null = null;
const lastPlayedAt = new Map<string, number>();

/** Deterministic PRNG (Mulberry32) so room acoustics & noise buffers stay clean every session. */
function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createNoiseBuffer(
  ctx: AudioContext,
  color: 'white' | 'pink',
  durationSec: number,
  seed: number
): AudioBuffer {
  const length = Math.max(1, Math.floor(ctx.sampleRate * durationSec));
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  const rand = createSeededRandom(seed);

  if (color === 'white') {
    for (let i = 0; i < length; i += 1) {
      data[i] = rand() * 2 - 1;
    }
    return buffer;
  }

  // Paul Kellet's pink noise filter for natural, velvet-like air & breath textures
  let b0 = 0;
  let b1 = 0;
  let b2 = 0;
  let b3 = 0;
  let b4 = 0;
  let b5 = 0;
  let b6 = 0;
  let maxAbs = 0.001;

  for (let i = 0; i < length; i += 1) {
    const white = rand() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.969 * b2 + white * 0.153852;
    b3 = 0.8665 * b3 + white * 0.3104856;
    b4 = 0.55 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.016898;
    const sample = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    b6 = white * 0.115926;
    data[i] = sample;
    const abs = Math.abs(sample);
    if (abs > maxAbs) maxAbs = abs;
  }

  const norm = 0.92 / maxAbs;
  for (let i = 0; i < length; i += 1) {
    data[i] *= norm;
  }
  return buffer;
}

/**
 * Procedural 240ms intimate stereo room impulse response.
 * Combines discrete early reflections with a smoothly damped tail so chimes
 * and glass blooms sit in a subtle physical space without sounding echoey.
 */
function createRoomImpulse(ctx: AudioContext): AudioBuffer {
  const durationSec = 0.24;
  const sampleRate = ctx.sampleRate;
  const length = Math.max(1, Math.floor(sampleRate * durationSec));
  const impulse = ctx.createBuffer(2, length, sampleRate);
  const rand = createSeededRandom(0x517cc1b7);

  const left = impulse.getChannelData(0);
  const right = impulse.getChannelData(1);

  // Subtle stereo early reflections (ms, L gain, R gain)
  const reflections: readonly [number, number, number][] = [
    [7.5, 0.24, 0.12],
    [12.2, 0.11, 0.21],
    [17.8, 0.16, 0.09],
    [23.4, 0.08, 0.15],
    [29.6, 0.11, 0.07],
    [36.5, 0.06, 0.09],
  ];

  for (const [ms, lGain, rGain] of reflections) {
    const idx = Math.floor((ms / 1000) * sampleRate);
    if (idx < length) {
      left[idx] += lGain;
      right[idx] += rGain;
    }
  }

  // Smoothly low-passed exponential velvet tail with soft 6ms fade-in
  let lpL = 0;
  let lpR = 0;
  const fadeSamples = Math.max(1, Math.floor(sampleRate * 0.006));

  for (let i = 0; i < length; i += 1) {
    const t = i / sampleRate;
    const fadeIn = i < fadeSamples ? i / fadeSamples : 1;
    const decay = Math.exp(-t * 15.5) * fadeIn * 0.18;

    const rawL = rand() * 2 - 1;
    const rawR = rand() * 2 - 1;
    lpL = lpL * 0.62 + rawL * 0.38;
    lpR = lpR * 0.62 + rawR * 0.38;

    left[i] += lpL * decay;
    right[i] += lpR * decay;
  }

  return impulse;
}

function getEngine(): AudioEngine | null {
  if (typeof window === 'undefined') return null;

  if (!engineInstance) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return null;

    const ctx = new AudioContextClass();

    // Master warmth & safety chain: HPF 45Hz -> Warmth high-shelf -> Soft Limiter -> Master Gain
    const subCut = ctx.createBiquadFilter();
    subCut.type = 'highpass';
    subCut.frequency.value = 45;
    subCut.Q.value = 0.707;

    const warmthShelf = ctx.createBiquadFilter();
    warmthShelf.type = 'highshelf';
    warmthShelf.frequency.value = 8200;
    warmthShelf.gain.value = -2.5;

    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -10;
    limiter.knee.value = 12;
    limiter.ratio.value = 6;
    limiter.attack.value = 0.002;
    limiter.release.value = 0.08;

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.85;

    subCut.connect(warmthShelf);
    warmthShelf.connect(limiter);
    limiter.connect(masterGain);
    masterGain.connect(ctx.destination);

    // Dry bus
    const dryBus = ctx.createGain();
    dryBus.gain.value = 1;
    dryBus.connect(subCut);

    // Subtle band-limited studio room reverb bus
    const reverbSend = ctx.createGain();
    reverbSend.gain.value = 1;

    const reverbHpf = ctx.createBiquadFilter();
    reverbHpf.type = 'highpass';
    reverbHpf.frequency.value = 340;

    const reverbLpf = ctx.createBiquadFilter();
    reverbLpf.type = 'lowpass';
    reverbLpf.frequency.value = 4600;

    const convolver = ctx.createConvolver();
    convolver.normalize = false;
    convolver.buffer = createRoomImpulse(ctx);

    const reverbReturn = ctx.createGain();
    reverbReturn.gain.value = 0.42;

    reverbSend.connect(reverbHpf);
    reverbHpf.connect(reverbLpf);
    reverbLpf.connect(convolver);
    convolver.connect(reverbReturn);
    reverbReturn.connect(subCut);

    engineInstance = {
      ctx,
      dryBus,
      reverbSend,
      whiteNoise: createNoiseBuffer(ctx, 'white', 0.65, 0x13579bdf),
      pinkNoise: createNoiseBuffer(ctx, 'pink', 0.65, 0x2468ace0),
    };
  }

  if (engineInstance.ctx.state === 'suspended') {
    void engineInstance.ctx.resume().catch(() => {
      /* Ignore autoplay restriction until next user gesture */
    });
  }

  return engineInstance;
}

function canTrigger(channel: string, minGapMs: number): boolean {
  if (!isSoundEnabled()) return false;
  const nowMs =
    typeof performance !== 'undefined' ? performance.now() : Date.now();
  const prev = lastPlayedAt.get(channel) ?? -Infinity;
  if (nowMs - prev < minGapMs) return false;
  lastPlayedAt.set(channel, nowMs);
  return true;
}

function jitter(base: number, spread = 0.016): number {
  return base * (1 + (Math.random() * 2 - 1) * spread);
}

function scheduleEnvelope(
  param: AudioParam,
  startTime: number,
  attack: number,
  peak: number,
  decay: number,
  hold = 0
): number {
  const safeAttack = Math.max(0.002, attack);
  const safeDecay = Math.max(0.008, decay);
  const safePeak = Math.max(0.0005, peak);

  param.setValueAtTime(0.0001, startTime);
  param.linearRampToValueAtTime(safePeak, startTime + safeAttack);
  if (hold > 0) {
    param.setValueAtTime(safePeak, startTime + safeAttack + hold);
  }
  const endTime = startTime + safeAttack + hold + safeDecay;
  param.exponentialRampToValueAtTime(0.0001, endTime);
  return endTime;
}

interface ToneVoiceOptions {
  type?: OscillatorType;
  startFreq: number;
  endFreq?: number;
  pitchDecay?: number;
  startTime: number;
  attack: number;
  hold?: number;
  decay: number;
  peak: number;
  filterType?: BiquadFilterType;
  filterStartFreq?: number;
  filterEndFreq?: number;
  filterQ?: number;
  reverb?: number;
}

function playToneVoice(engine: AudioEngine, opts: ToneVoiceOptions): void {
  const { ctx } = engine;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const nodes: AudioNode[] = [osc, gain];

  osc.type = opts.type ?? 'sine';
  osc.frequency.setValueAtTime(opts.startFreq, opts.startTime);
  if (opts.endFreq !== undefined && opts.endFreq !== opts.startFreq) {
    const glideTime = opts.pitchDecay ?? opts.attack + (opts.hold ?? 0) + opts.decay;
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(20, opts.endFreq),
      opts.startTime + Math.max(0.005, glideTime)
    );
  }

  const endTime = scheduleEnvelope(
    gain.gain,
    opts.startTime,
    opts.attack,
    opts.peak,
    opts.decay,
    opts.hold ?? 0
  );

  let tail: AudioNode = osc;
  if (opts.filterType && opts.filterStartFreq) {
    const filter = ctx.createBiquadFilter();
    filter.type = opts.filterType;
    filter.frequency.setValueAtTime(opts.filterStartFreq, opts.startTime);
    if (opts.filterEndFreq !== undefined) {
      filter.frequency.exponentialRampToValueAtTime(
        Math.max(40, opts.filterEndFreq),
        endTime
      );
    }
    if (opts.filterQ !== undefined) {
      filter.Q.setValueAtTime(opts.filterQ, opts.startTime);
    }
    tail.connect(filter);
    tail = filter;
    nodes.push(filter);
  }

  tail.connect(gain);
  gain.connect(engine.dryBus);

  if (opts.reverb && opts.reverb > 0) {
    const wet = ctx.createGain();
    wet.gain.setValueAtTime(opts.reverb, opts.startTime);
    gain.connect(wet);
    wet.connect(engine.reverbSend);
    nodes.push(wet);
  }

  osc.onended = () => {
    for (const node of nodes) {
      try {
        node.disconnect();
      } catch {
        /* already disconnected */
      }
    }
  };

  osc.start(opts.startTime);
  osc.stop(endTime + 0.015);
}

interface NoiseVoiceOptions {
  color: 'white' | 'pink';
  startTime: number;
  attack: number;
  hold?: number;
  decay: number;
  peak: number;
  filterType: BiquadFilterType;
  startFreq: number;
  endFreq?: number;
  q?: number;
  reverb?: number;
}

function playNoiseVoice(engine: AudioEngine, opts: NoiseVoiceOptions): void {
  const { ctx } = engine;
  const buffer = opts.color === 'white' ? engine.whiteNoise : engine.pinkNoise;
  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  const nodes: AudioNode[] = [source, filter, gain];

  source.buffer = buffer;

  const totalDur =
    Math.max(0.002, opts.attack) + (opts.hold ?? 0) + Math.max(0.008, opts.decay) + 0.02;
  if (buffer.duration <= totalDur + 0.02) {
    source.loop = true;
  }
  const maxOffset = Math.max(0, buffer.duration - totalDur - 0.015);
  const offset = maxOffset > 0 ? Math.random() * maxOffset : 0;

  const endTime = scheduleEnvelope(
    gain.gain,
    opts.startTime,
    opts.attack,
    opts.peak,
    opts.decay,
    opts.hold ?? 0
  );

  filter.type = opts.filterType;
  filter.frequency.setValueAtTime(opts.startFreq, opts.startTime);
  if (opts.endFreq !== undefined && opts.endFreq !== opts.startFreq) {
    filter.frequency.exponentialRampToValueAtTime(
      Math.max(40, opts.endFreq),
      endTime
    );
  }
  filter.Q.setValueAtTime(opts.q ?? 1.4, opts.startTime);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(engine.dryBus);

  if (opts.reverb && opts.reverb > 0) {
    const wet = ctx.createGain();
    wet.gain.setValueAtTime(opts.reverb, opts.startTime);
    gain.connect(wet);
    wet.connect(engine.reverbSend);
    nodes.push(wet);
  }

  source.onended = () => {
    for (const node of nodes) {
      try {
        node.disconnect();
      } catch {
        /* already disconnected */
      }
    }
  };

  source.start(opts.startTime, offset);
  source.stop(endTime + 0.012);
}

// ---------------------------------------------------------------------------
// Public preference helpers
// ---------------------------------------------------------------------------

export const isSoundEnabled = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const stored = window.localStorage.getItem(SOUND_STORAGE_KEY);
    return stored === null ? true : stored === 'true';
  } catch {
    return true;
  }
};

export const setSoundEnabled = (enabled: boolean): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SOUND_STORAGE_KEY, enabled ? 'true' : 'false');
  } catch {
    /* ignore */
  }
};

// ---------------------------------------------------------------------------
// Cohesive UI Sound Palette
// ---------------------------------------------------------------------------

/**
 * Crisp ceramic micro-tick for buttons and transport controls (~26ms).
 * Combines a damped ceramic body drop with a pinpoint high-frequency transient.
 */
export const playClickSound = (): void => {
  if (!canTrigger('click', 26)) return;
  const engine = getEngine();
  if (!engine) return;

  const now = engine.ctx.currentTime + 0.003;

  // Ceramic body
  playToneVoice(engine, {
    type: 'sine',
    startFreq: jitter(940, 0.025),
    endFreq: jitter(255, 0.025),
    pitchDecay: 0.015,
    startTime: now,
    attack: 0.002,
    decay: 0.024,
    peak: jitter(0.085, 0.04),
    filterType: 'lowpass',
    filterStartFreq: 2500,
    reverb: 0.03,
  });

  // Pinpoint anodized contact transient
  playNoiseVoice(engine, {
    color: 'white',
    startTime: now,
    attack: 0.0015,
    decay: 0.009,
    peak: 0.048,
    filterType: 'bandpass',
    startFreq: jitter(3200, 0.04),
    q: 2.2,
  });
};

/**
 * Velvet rotary detent for subtle selection changes (menus, sidebar items, app switcher).
 */
export const playSoftSelectSound = (): void => {
  if (!canTrigger('select', 24)) return;
  const engine = getEngine();
  if (!engine) return;

  const now = engine.ctx.currentTime + 0.003;

  playToneVoice(engine, {
    type: 'sine',
    startFreq: jitter(540, 0.02),
    endFreq: jitter(310, 0.02),
    pitchDecay: 0.022,
    startTime: now,
    attack: 0.0025,
    decay: 0.032,
    peak: 0.062,
    filterType: 'lowpass',
    filterStartFreq: 1600,
    reverb: 0.04,
  });

  playNoiseVoice(engine, {
    color: 'pink',
    startTime: now,
    attack: 0.002,
    decay: 0.011,
    peak: 0.022,
    filterType: 'bandpass',
    startFreq: 1550,
    q: 1.8,
  });
};

/**
 * Dual-stage precision mechanical switch for toggles, dark/night mode, and settings.
 * Pass `on = true` for a subtly rising latch, `on = false` for a settling release.
 */
export const playToggleSound = (on = true): void => {
  if (!canTrigger('toggle', 35)) return;
  const engine = getEngine();
  if (!engine) return;

  const now = engine.ctx.currentTime + 0.003;

  // Stage 1: initial mechanical release tick + soft housing thump
  playNoiseVoice(engine, {
    color: 'white',
    startTime: now,
    attack: 0.0015,
    decay: 0.009,
    peak: 0.042,
    filterType: 'bandpass',
    startFreq: on ? 2600 : 2100,
    q: 2.4,
  });

  playToneVoice(engine, {
    type: 'sine',
    startFreq: 175,
    endFreq: 92,
    pitchDecay: 0.018,
    startTime: now,
    attack: 0.002,
    decay: 0.024,
    peak: 0.065,
  });

  // Stage 2: settling magnetic latch (+26ms)
  const latchAt = now + 0.026;
  playToneVoice(engine, {
    type: 'sine',
    startFreq: on ? jitter(510, 0.015) : jitter(490, 0.015),
    endFreq: on ? jitter(690, 0.015) : jitter(320, 0.015),
    pitchDecay: 0.028,
    startTime: latchAt,
    attack: 0.003,
    decay: 0.044,
    peak: 0.088,
    filterType: 'lowpass',
    filterStartFreq: on ? 2400 : 1400,
    reverb: 0.07,
  });

  // Subtle harmonic sheen on enable
  if (on) {
    playToneVoice(engine, {
      type: 'sine',
      startFreq: 1380,
      endFreq: 1380,
      startTime: latchAt + 0.004,
      attack: 0.004,
      decay: 0.045,
      peak: 0.022,
      reverb: 0.1,
    });
  }
};

/**
 * Airy glass bloom for opening windows and full-screen project sheets (~175ms).
 * Perfect fifth harmonic lift (D4 -> A4) cushioned by a soft pink-noise inhale.
 */
export const playWindowOpenSound = (): void => {
  if (!canTrigger('window-open', 65)) return;
  const engine = getEngine();
  if (!engine) return;

  const now = engine.ctx.currentTime + 0.004;

  // Soft rising breath
  playNoiseVoice(engine, {
    color: 'pink',
    startTime: now,
    attack: 0.02,
    decay: 0.115,
    peak: 0.042,
    filterType: 'bandpass',
    startFreq: 520,
    endFreq: 1780,
    q: 1.35,
    reverb: 0.14,
  });

  // Warm fundamental glide (D4 -> A4)
  playToneVoice(engine, {
    type: 'sine',
    startFreq: 293.66,
    endFreq: 440,
    pitchDecay: 0.052,
    startTime: now + 0.006,
    attack: 0.014,
    decay: 0.145,
    peak: 0.105,
    filterType: 'lowpass',
    filterStartFreq: 1600,
    reverb: 0.18,
  });

  // Airy glass octave shimmer (A5)
  playToneVoice(engine, {
    type: 'sine',
    startFreq: 880,
    endFreq: 880,
    startTime: now + 0.016,
    attack: 0.018,
    decay: 0.15,
    peak: 0.032,
    reverb: 0.26,
  });
};

/**
 * Soft settling exhale for closing windows and sheets (~125ms).
 */
export const playWindowCloseSound = (): void => {
  if (!canTrigger('window-close', 65)) return;
  const engine = getEngine();
  if (!engine) return;

  const now = engine.ctx.currentTime + 0.004;

  // Descending breath release
  playNoiseVoice(engine, {
    color: 'pink',
    startTime: now,
    attack: 0.008,
    decay: 0.095,
    peak: 0.038,
    filterType: 'bandpass',
    startFreq: 1280,
    endFreq: 360,
    q: 1.3,
    reverb: 0.1,
  });

  // Warm settling body (G4 -> A3)
  playToneVoice(engine, {
    type: 'sine',
    startFreq: 392,
    endFreq: 220,
    pitchDecay: 0.075,
    startTime: now,
    attack: 0.006,
    decay: 0.105,
    peak: 0.092,
    filterType: 'lowpass',
    filterStartFreq: 1100,
    filterEndFreq: 460,
    reverb: 0.12,
  });
};

/**
 * Silky downward tuck for minimizing a window into the Dock (~155ms).
 */
export const playWindowMinimizeSound = (): void => {
  if (!canTrigger('window-minimize', 65)) return;
  const engine = getEngine();
  if (!engine) return;

  const now = engine.ctx.currentTime + 0.004;

  playNoiseVoice(engine, {
    color: 'pink',
    startTime: now,
    attack: 0.01,
    decay: 0.125,
    peak: 0.035,
    filterType: 'bandpass',
    startFreq: 1650,
    endFreq: 340,
    q: 1.5,
    reverb: 0.12,
  });

  playToneVoice(engine, {
    type: 'sine',
    startFreq: 587.33,
    endFreq: 246.94,
    pitchDecay: 0.115,
    startTime: now,
    attack: 0.008,
    decay: 0.135,
    peak: 0.088,
    filterType: 'lowpass',
    filterStartFreq: 1900,
    filterEndFreq: 420,
    reverb: 0.16,
  });

  // Soft cushion harmonic
  playToneVoice(engine, {
    type: 'triangle',
    startFreq: 880,
    endFreq: 370,
    pitchDecay: 0.095,
    startTime: now,
    attack: 0.006,
    decay: 0.095,
    peak: 0.024,
    filterType: 'lowpass',
    filterStartFreq: 1200,
    filterEndFreq: 380,
  });
};

/**
 * Magnetic precision dock/snap lock for window snapping and maximize/restore (~75ms).
 */
export const playWindowSnapSound = (): void => {
  if (!canTrigger('window-snap', 55)) return;
  const engine = getEngine();
  if (!engine) return;

  const now = engine.ctx.currentTime + 0.003;

  // Tight anodized frame thump
  playToneVoice(engine, {
    type: 'sine',
    startFreq: 158,
    endFreq: 72,
    pitchDecay: 0.028,
    startTime: now,
    attack: 0.002,
    decay: 0.042,
    peak: 0.115,
    reverb: 0.05,
  });

  // Crisp edge snap
  playNoiseVoice(engine, {
    color: 'white',
    startTime: now,
    attack: 0.0015,
    decay: 0.008,
    peak: 0.045,
    filterType: 'bandpass',
    startFreq: 2800,
    q: 2.2,
  });

  // Subtle crystalline lock-in ping (E6)
  playToneVoice(engine, {
    type: 'sine',
    startFreq: 1318.51,
    endFreq: 1318.51,
    startTime: now + 0.009,
    attack: 0.003,
    decay: 0.055,
    peak: 0.036,
    reverb: 0.16,
  });
};

/**
 * Nimble frosted-glass breath for popovers, Spotlight, Control Center,
 * Notification Center, Dynamic Island, and Work sheet (~85ms).
 */
export const playPanelOpenSound = (open = true): void => {
  if (!canTrigger('panel', 45)) return;
  const engine = getEngine();
  if (!engine) return;

  const now = engine.ctx.currentTime + 0.003;

  playNoiseVoice(engine, {
    color: 'pink',
    startTime: now,
    attack: open ? 0.01 : 0.005,
    decay: open ? 0.062 : 0.052,
    peak: open ? 0.032 : 0.026,
    filterType: 'bandpass',
    startFreq: open ? 680 : 1150,
    endFreq: open ? 1850 : 420,
    q: 1.4,
    reverb: 0.1,
  });

  playToneVoice(engine, {
    type: 'sine',
    startFreq: open ? 369.99 : 440,
    endFreq: open ? 554.37 : 293.66,
    pitchDecay: open ? 0.038 : 0.042,
    startTime: now + (open ? 0.004 : 0),
    attack: 0.007,
    decay: open ? 0.072 : 0.062,
    peak: open ? 0.068 : 0.055,
    filterType: 'lowpass',
    filterStartFreq: open ? 2000 : 1200,
    reverb: open ? 0.15 : 0.09,
  });
};

/**
 * Crystalline two-note glass chime for macOS notifications (~480ms).
 * Warm D5 -> A5 interval layered with delicate octave & damped bell partials.
 */
export const playNotificationChime = (volume = 0.2): void => {
  if (!canTrigger('chime', 140)) return;
  const engine = getEngine();
  if (!engine) return;

  const now = engine.ctx.currentTime + 0.004;
  const scale = Math.max(0.05, Math.min(1, volume / 0.2));

  // Note 1: Warm D5 (587.33Hz) + D6 harmonic + soft mallet transient
  playNoiseVoice(engine, {
    color: 'white',
    startTime: now,
    attack: 0.0015,
    decay: 0.007,
    peak: 0.025 * scale,
    filterType: 'bandpass',
    startFreq: 3100,
    q: 2.8,
  });

  playToneVoice(engine, {
    type: 'sine',
    startFreq: 587.33,
    startTime: now,
    attack: 0.005,
    decay: 0.29,
    peak: 0.115 * scale,
    reverb: 0.24,
  });

  playToneVoice(engine, {
    type: 'sine',
    startFreq: 1174.66,
    startTime: now,
    attack: 0.004,
    decay: 0.18,
    peak: 0.048 * scale,
    reverb: 0.28,
  });

  // Note 2: Luminous A5 (880Hz) + A6 shimmer + fast-damped glassy partial (+88ms)
  const note2 = now + 0.088;

  playToneVoice(engine, {
    type: 'sine',
    startFreq: 880,
    startTime: note2,
    attack: 0.006,
    decay: 0.38,
    peak: 0.125 * scale,
    reverb: 0.28,
  });

  playToneVoice(engine, {
    type: 'sine',
    startFreq: 1760,
    startTime: note2,
    attack: 0.004,
    decay: 0.22,
    peak: 0.036 * scale,
    reverb: 0.3,
  });

  // Authentic metallic-glass overtone ratio (2.76x fundamental), damped swiftly
  playToneVoice(engine, {
    type: 'sine',
    startFreq: 2429,
    startTime: note2,
    attack: 0.003,
    decay: 0.075,
    peak: 0.015 * scale,
    reverb: 0.2,
  });
};

/**
 * Understated luminous Dmaj9 wake chord for unlocking the desktop (~520ms).
 */
export const playUnlockSound = (): void => {
  if (!canTrigger('unlock', 250)) return;
  const engine = getEngine();
  if (!engine) return;

  const now = engine.ctx.currentTime + 0.005;
  // D4, A4, E5, F#5 — warm, open modern hardware voicing
  const notes: readonly [number, number, number, number][] = [
    [293.66, 0.0, 0.075, 0.36],
    [440.0, 0.034, 0.068, 0.38],
    [659.25, 0.068, 0.056, 0.4],
    [739.99, 0.106, 0.048, 0.42],
  ];

  // Subtle airy lift beneath the chord
  playNoiseVoice(engine, {
    color: 'pink',
    startTime: now,
    attack: 0.035,
    decay: 0.16,
    peak: 0.024,
    filterType: 'bandpass',
    startFreq: 600,
    endFreq: 2000,
    q: 1.2,
    reverb: 0.25,
  });

  for (const [freq, delay, peak, decay] of notes) {
    playToneVoice(engine, {
      type: 'sine',
      startFreq: freq,
      startTime: now + delay,
      attack: 0.018,
      decay,
      peak,
      filterType: 'lowpass',
      filterStartFreq: 2600,
      reverb: 0.32,
    });
  }
};

/**
 * Quick organic paper tuck when tossing an item into Trash (~130ms).
 */
export const playTrashDropSound = (): void => {
  if (!canTrigger('trash-drop', 80)) return;
  const engine = getEngine();
  if (!engine) return;

  const now = engine.ctx.currentTime + 0.003;

  // Soft hollow bin body
  playToneVoice(engine, {
    type: 'sine',
    startFreq: 148,
    endFreq: 80,
    pitchDecay: 0.04,
    startTime: now + 0.018,
    attack: 0.004,
    decay: 0.06,
    peak: 0.075,
    reverb: 0.08,
  });

  // Two crisp staggered paper crinkles
  playNoiseVoice(engine, {
    color: 'white',
    startTime: now,
    attack: 0.004,
    decay: 0.042,
    peak: 0.068,
    filterType: 'bandpass',
    startFreq: jitter(1850, 0.08),
    endFreq: 2600,
    q: 2.3,
    reverb: 0.06,
  });

  playNoiseVoice(engine, {
    color: 'pink',
    startTime: now + 0.036,
    attack: 0.006,
    decay: 0.068,
    peak: 0.058,
    filterType: 'bandpass',
    startFreq: jitter(2400, 0.08),
    endFreq: 1350,
    q: 1.9,
    reverb: 0.08,
  });
};

/**
 * Layered organic paper crumple for Empty Trash (~310ms).
 * Multiple differently tuned noise grains mimic crisp paper folding and settling.
 */
export const playTrashEmptySound = (): void => {
  if (!canTrigger('trash-empty', 160)) return;
  const engine = getEngine();
  if (!engine) return;

  const now = engine.ctx.currentTime + 0.004;

  // 4 organic paper crinkle bursts across different resonant bands
  const crinkles: readonly [number, number, number, number, number, number][] = [
    // [delay, attack, decay, peak, startFreq, endFreq]
    [0.0, 0.006, 0.065, 0.09, 1350, 2400],
    [0.048, 0.005, 0.075, 0.115, 2550, 1500],
    [0.105, 0.007, 0.085, 0.1, 1850, 3100],
    [0.175, 0.008, 0.115, 0.072, 2200, 1050],
  ];

  for (const [delay, attack, decay, peak, startFreq, endFreq] of crinkles) {
    playNoiseVoice(engine, {
      color: delay > 0.1 ? 'pink' : 'white',
      startTime: now + delay + Math.random() * 0.008,
      attack,
      decay,
      peak,
      filterType: 'bandpass',
      startFreq: jitter(startFreq, 0.09),
      endFreq: jitter(endFreq, 0.09),
      q: jitter(2.1, 0.15),
      reverb: 0.08,
    });
  }

  // Subtle low paper body rustle tying the bursts together
  playNoiseVoice(engine, {
    color: 'pink',
    startTime: now + 0.015,
    attack: 0.028,
    decay: 0.22,
    peak: 0.048,
    filterType: 'bandpass',
    startFreq: 760,
    endFreq: 480,
    q: 1.1,
    reverb: 0.06,
  });
};

/**
 * Dual-curtain mechanical leaf shutter for screenshot capture (~145ms).
 * Authentic crisp mechanical transient + subtle housing body + closing curtain 64ms later.
 */
export const playCameraShutterSound = (): void => {
  if (!canTrigger('shutter', 160)) return;
  const engine = getEngine();
  if (!engine) return;

  const now = engine.ctx.currentTime + 0.003;

  // Curtain 1 (open): metallic crisp air + blade flick + damped camera body
  playNoiseVoice(engine, {
    color: 'white',
    startTime: now,
    attack: 0.0015,
    decay: 0.019,
    peak: 0.145,
    filterType: 'bandpass',
    startFreq: 2700,
    endFreq: 1800,
    q: 1.6,
    reverb: 0.08,
  });

  playToneVoice(engine, {
    type: 'triangle',
    startFreq: 1480,
    endFreq: 310,
    pitchDecay: 0.018,
    startTime: now,
    attack: 0.0015,
    decay: 0.022,
    peak: 0.095,
    filterType: 'lowpass',
    filterStartFreq: 3200,
  });

  playToneVoice(engine, {
    type: 'sine',
    startFreq: 195,
    endFreq: 84,
    pitchDecay: 0.022,
    startTime: now + 0.002,
    attack: 0.002,
    decay: 0.032,
    peak: 0.11,
  });

  // Curtain 2 (close, +64ms): tighter return click
  const closeAt = now + 0.064;

  playNoiseVoice(engine, {
    color: 'white',
    startTime: closeAt,
    attack: 0.0015,
    decay: 0.015,
    peak: 0.105,
    filterType: 'bandpass',
    startFreq: 2050,
    endFreq: 1350,
    q: 1.9,
    reverb: 0.07,
  });

  playToneVoice(engine, {
    type: 'sine',
    startFreq: 900,
    endFreq: 235,
    pitchDecay: 0.02,
    startTime: closeAt,
    attack: 0.002,
    decay: 0.03,
    peak: 0.078,
  });
};

/**
 * Warm two-note confirmation spark for copy, restore, and send actions (~210ms).
 */
export const playSuccessSound = (): void => {
  if (!canTrigger('success', 90)) return;
  const engine = getEngine();
  if (!engine) return;

  const now = engine.ctx.currentTime + 0.003;

  // E5 -> B5 airy fifth
  playToneVoice(engine, {
    type: 'sine',
    startFreq: 659.25,
    startTime: now,
    attack: 0.005,
    decay: 0.125,
    peak: 0.082,
    reverb: 0.18,
  });

  playToneVoice(engine, {
    type: 'sine',
    startFreq: 987.77,
    startTime: now + 0.062,
    attack: 0.005,
    decay: 0.165,
    peak: 0.088,
    reverb: 0.24,
  });

  playToneVoice(engine, {
    type: 'sine',
    startFreq: 1975.53,
    startTime: now + 0.064,
    attack: 0.004,
    decay: 0.095,
    peak: 0.022,
    reverb: 0.25,
  });
};

/**
 * Gentle wooden-glass marimba step for tours and sequential navigation (~60ms).
 */
export const playStepSound = (forward = true): void => {
  if (!canTrigger('step', 45)) return;
  const engine = getEngine();
  if (!engine) return;

  const now = engine.ctx.currentTime + 0.003;
  const fundamental = forward ? 587.33 : 440;

  playToneVoice(engine, {
    type: 'sine',
    startFreq: jitter(fundamental, 0.012),
    endFreq: jitter(fundamental * (forward ? 1.04 : 0.96), 0.012),
    pitchDecay: 0.035,
    startTime: now,
    attack: 0.003,
    decay: 0.062,
    peak: 0.072,
    filterType: 'lowpass',
    filterStartFreq: 2000,
    reverb: 0.12,
  });

  playToneVoice(engine, {
    type: 'sine',
    startFreq: fundamental * 2,
    startTime: now,
    attack: 0.002,
    decay: 0.03,
    peak: 0.022,
    reverb: 0.14,
  });
};

export interface SoundPreviewItem {
  id: string;
  label: string;
  play: () => void;
}

/** Curated preview palette for auditioning synthesized UI acoustics in System Settings. */
export const SOUND_PREVIEW_ITEMS: readonly SoundPreviewItem[] = [
  { id: 'click', label: 'Click', play: playClickSound },
  { id: 'toggle', label: 'Toggle', play: () => playToggleSound(true) },
  { id: 'window', label: 'Window', play: playWindowOpenSound },
  { id: 'snap', label: 'Snap', play: playWindowSnapSound },
  { id: 'chime', label: 'Chime', play: () => playNotificationChime() },
  { id: 'shutter', label: 'Shutter', play: playCameraShutterSound },
  { id: 'trash', label: 'Trash', play: playTrashEmptySound },
  { id: 'wake', label: 'Wake', play: playUnlockSound },
];
