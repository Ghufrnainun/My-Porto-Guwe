import { useReducedMotion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Performance note:
//   We do NOT use filter:blur() here — it is catastrophically expensive on
//   large elements and was the main source of lag.
//   Instead we rely on radial-gradient's natural soft falloff (free, no filter).
//   Each blob is a single composite layer promoted via will-change:transform.
// ─────────────────────────────────────────────────────────────────────────────

interface MeshBlob {
  id: number;
  /** Radial gradient — natural falloff, no blur filter needed */
  gradient: string;
  size: string;
  x: string;
  y: string;
  animName: string;
  duration: string;
  delay: string;
}

const blobs: MeshBlob[] = [
  {
    id: 1,
    gradient:
      'radial-gradient(circle, hsl(var(--primary) / 0.30) 0%, hsl(var(--primary) / 0.12) 45%, transparent 70%)',
    size: '50vw',
    x: '10%',
    y: '20%',
    animName: 'mesh-drift-1',
    duration: '28s',
    delay: '0s',
  },
  {
    id: 2,
    gradient:
      'radial-gradient(circle, hsl(var(--accent) / 0.20) 0%, hsl(var(--accent) / 0.08) 45%, transparent 70%)',
    size: '44vw',
    x: '75%',
    y: '55%',
    animName: 'mesh-drift-2',
    duration: '36s',
    delay: '-12s',
  },
  {
    id: 3,
    gradient:
      'radial-gradient(circle, hsl(var(--primary) / 0.16) 0%, hsl(var(--primary) / 0.06) 45%, transparent 70%)',
    size: '40vw',
    x: '80%',
    y: '8%',
    animName: 'mesh-drift-3',
    duration: '32s',
    delay: '-20s',
  },
];

const KEYFRAMES = `
  @keyframes mesh-drift-1 {
    0%,100% { transform: translate3d(0,0,0) scale(1); }
    30%     { transform: translate3d(5vw,-6vh,0) scale(1.08); }
    65%     { transform: translate3d(-3vw,5vh,0) scale(0.95); }
  }
  @keyframes mesh-drift-2 {
    0%,100% { transform: translate3d(0,0,0) scale(1); }
    35%     { transform: translate3d(-5vw,-4vh,0) scale(1.07); }
    70%     { transform: translate3d(4vw,6vh,0) scale(0.97); }
  }
  @keyframes mesh-drift-3 {
    0%,100% { transform: translate3d(0,0,0) scale(1); }
    40%     { transform: translate3d(-5vw,7vh,0) scale(1.10); }
    80%     { transform: translate3d(3vw,-3vh,0) scale(0.94); }
  }
`;

export function AnimatedMeshGradient() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      {!shouldReduceMotion && <style>{KEYFRAMES}</style>}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        {blobs.map((blob) => (
          <div
            key={blob.id}
            className="absolute rounded-full"
            style={{
              width: blob.size,
              height: blob.size,
              left: blob.x,
              top: blob.y,
              transform: 'translate3d(-50%, -50%, 0)',
              background: blob.gradient,
              // No filter:blur() — the radial-gradient provides the soft falloff for free
              willChange: shouldReduceMotion ? 'auto' : 'transform',
              animation: shouldReduceMotion
                ? 'none'
                : `${blob.animName} ${blob.duration} ease-in-out infinite ${blob.delay}`,
            }}
          />
        ))}

        {/* Bottom fade — blends Hero into the next section seamlessly */}
        <div
          className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, transparent 0%, hsl(var(--background) / 0.60) 50%, hsl(var(--background)) 100%)',
          }}
        />
      </div>
    </>
  );
}
