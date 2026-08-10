import { useReducedMotion } from 'framer-motion';

export type HeroBackgroundVariant = 'current' | 'a' | 'b' | 'c' | 'd';

type HeroBackgroundProps = {
  variant?: HeroBackgroundVariant;
};

const KEYFRAMES = `
  @keyframes aurora-1 {
    0%, 100% { transform: translate3d(0, 0, 0) scale(1) rotate(0deg); }
    33% { transform: translate3d(8vw, -12vh, 0) scale(1.1) rotate(10deg); }
    66% { transform: translate3d(-10vw, 8vh, 0) scale(0.9) rotate(-5deg); }
  }
  @keyframes aurora-2 {
    0%, 100% { transform: translate3d(0, 0, 0) scale(1) rotate(0deg); }
    33% { transform: translate3d(-12vw, -8vh, 0) scale(0.95) rotate(-10deg); }
    66% { transform: translate3d(10vw, 12vh, 0) scale(1.05) rotate(5deg); }
  }
  @keyframes aurora-3 {
    0%, 100% { transform: translate3d(0, 0, 0) scale(1) rotate(0deg); }
    33% { transform: translate3d(12vw, 12vh, 0) scale(1.15) rotate(5deg); }
    66% { transform: translate3d(-8vw, -12vh, 0) scale(0.85) rotate(-10deg); }
  }
  @keyframes prism-sweep {
    0%, 100% { transform: translate3d(-10vw, 5vh, 0) rotate(-17deg) scaleX(0.92); opacity: 0.62; }
    50% { transform: translate3d(12vw, -5vh, 0) rotate(-11deg) scaleX(1.08); opacity: 0.9; }
  }
  @keyframes shard-float {
    0%, 100% { transform: translate3d(0, 0, 0) rotate(10deg); opacity: 0.35; }
    50% { transform: translate3d(5vw, -4vh, 0) rotate(18deg); opacity: 0.68; }
  }
  @keyframes topology-pan {
    0%, 100% { transform: translate3d(-4vw, 2vh, 0) rotate(0deg); opacity: 0.48; }
    50% { transform: translate3d(4vw, -3vh, 0) rotate(1deg); opacity: 0.78; }
  }
  @keyframes bolt-breathe {
    0%, 100% { transform: translate3d(-2vw, 0, 0) skewX(-14deg); opacity: 0.22; }
    45% { transform: translate3d(3vw, -1vh, 0) skewX(-8deg); opacity: 0.72; }
  }
  @keyframes eclipse-drift {
    0%, 100% { transform: translate3d(-6vw, 0, 0) scale(0.96); opacity: 0.72; }
    50% { transform: translate3d(5vw, -2vh, 0) scale(1.04); opacity: 0.92; }
  }
  @keyframes ring-turn {
    0% { transform: translate(-50%, -50%) rotate(0deg) scale(0.98); opacity: 0.38; }
    50% { transform: translate(-50%, -50%) rotate(24deg) scale(1.03); opacity: 0.62; }
    100% { transform: translate(-50%, -50%) rotate(48deg) scale(0.98); opacity: 0.38; }
  }
`;

function CurrentAurora({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <>
      <div
        className="absolute rounded-full pointer-events-none opacity-60 dark:opacity-75"
        style={{
          width: '60vw',
          height: '60vw',
          left: '-10%',
          top: '-20%',
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.6) 0%, hsl(var(--primary) / 0.15) 45%, transparent 70%)',
          animation: reduceMotion ? 'none' : 'aurora-1 14s ease-in-out infinite alternate',
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none opacity-60 dark:opacity-70"
        style={{
          width: '55vw',
          height: '55vw',
          right: '-10%',
          bottom: '-15%',
          background: 'radial-gradient(circle, hsl(var(--accent) / 0.55) 0%, hsl(var(--accent) / 0.15) 45%, transparent 70%)',
          animation: reduceMotion ? 'none' : 'aurora-2 16s ease-in-out infinite alternate',
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none opacity-40 dark:opacity-50"
        style={{
          width: '45vw',
          height: '45vw',
          left: '25%',
          top: '15%',
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.4) 0%, hsl(var(--accent) / 0.1) 45%, transparent 70%)',
          animation: reduceMotion ? 'none' : 'aurora-3 12s ease-in-out infinite alternate',
        }}
      />
    </>
  );
}

function VariantLayers({ variant, reduceMotion }: { variant: HeroBackgroundVariant; reduceMotion: boolean }) {
  if (variant === 'a') {
    return (
      <>
        <div
          className="absolute left-[-18%] top-[-22%] h-[130%] w-[58vw] blur-[18px]"
          style={{
            background:
              'linear-gradient(104deg, transparent 0 17%, hsl(var(--foreground) / 0.18) 22%, hsl(var(--primary) / 0.44) 31%, hsl(var(--accent) / 0.34) 42%, transparent 58% 100%)',
            clipPath: 'polygon(34% 0, 100% 0, 67% 100%, 0 100%)',
            animation: reduceMotion ? 'none' : 'prism-sweep 13s cubic-bezier(0.16, 1, 0.3, 1) infinite',
          }}
        />
        <div
          className="absolute right-[9%] top-[12%] h-[44vh] w-[22vw] border border-foreground/10 bg-foreground/[0.035]"
          style={{
            clipPath: 'polygon(18% 0, 100% 16%, 78% 100%, 0 72%)',
            boxShadow: 'inset 0 1px 1px hsl(var(--foreground) / 0.16)',
            animation: reduceMotion ? 'none' : 'shard-float 10s cubic-bezier(0.16, 1, 0.3, 1) infinite',
          }}
        />
        <div
          className="absolute left-[12%] top-[24%] h-px w-[78vw] -rotate-[17deg]"
          style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--foreground) / 0.52), transparent)' }}
        />
      </>
    );
  }

  if (variant === 'b') {
    return (
      <>
        <div
          className="absolute inset-[-10%] opacity-70"
          style={{
            backgroundImage: `
              repeating-linear-gradient(62deg, transparent 0 34px, hsl(var(--primary) / 0.16) 35px 36px, transparent 37px 74px),
              repeating-linear-gradient(118deg, transparent 0 40px, hsl(var(--accent) / 0.12) 41px 42px, transparent 43px 88px)
            `,
            maskImage: 'radial-gradient(ellipse at 50% 38%, black 0 48%, transparent 76%)',
            animation: reduceMotion ? 'none' : 'topology-pan 16s cubic-bezier(0.16, 1, 0.3, 1) infinite',
          }}
        />
        <div
          className="absolute left-[16%] top-[10%] h-[74vh] w-[30vw] blur-[10px]"
          style={{
            background: 'linear-gradient(100deg, transparent 0 38%, hsl(var(--foreground) / 0.36) 45%, hsl(var(--primary) / 0.46) 50%, transparent 59% 100%)',
            clipPath: 'polygon(45% 0, 61% 0, 50% 35%, 77% 35%, 38% 100%, 48% 52%, 28% 52%)',
            animation: reduceMotion ? 'none' : 'bolt-breathe 7s cubic-bezier(0.16, 1, 0.3, 1) infinite',
          }}
        />
        <div
          className="absolute bottom-[18%] left-1/2 h-px w-[64vw] -translate-x-1/2"
          style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--accent) / 0.45), transparent)' }}
        />
      </>
    );
  }

  if (variant === 'c') {
    return (
      <>
        <div
          className="absolute left-1/2 top-[42%] h-[76vmin] w-[76vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(circle, hsl(var(--background)) 0 28%, hsl(var(--foreground) / 0.18) 29%, transparent 31%), radial-gradient(circle, hsl(var(--foreground) / 0.2) 0 42%, transparent 63%)',
            filter: 'blur(2px)',
            animation: reduceMotion ? 'none' : 'eclipse-drift 14s cubic-bezier(0.16, 1, 0.3, 1) infinite',
          }}
        />
        <div
          className="absolute inset-x-[-8%] top-[30%] h-[28vh] -rotate-6 opacity-70"
          style={{
            background:
              'linear-gradient(90deg, transparent, hsl(var(--foreground) / 0.16) 22%, hsl(var(--primary) / 0.2) 50%, hsl(var(--foreground) / 0.16) 78%, transparent)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent 0 12px, currentColor 13px 14px)',
            maskImage: 'linear-gradient(to bottom, transparent, black 26%, transparent 74%)',
          }}
        />
      </>
    );
  }

  if (variant === 'd') {
    return (
      <>
        <div
          className="absolute left-1/2 top-[42%] h-[82vmin] w-[82vmin] rounded-full"
          style={{
            background:
              'repeating-conic-gradient(from 18deg, hsl(var(--foreground) / 0.28) 0deg 1deg, transparent 1deg 13deg), radial-gradient(circle, transparent 0 45%, hsl(var(--primary) / 0.16) 46% 47%, transparent 48% 58%, hsl(var(--accent) / 0.15) 59% 60%, transparent 61%)',
            maskImage: 'radial-gradient(circle, transparent 0 28%, black 31% 62%, transparent 68%)',
            animation: reduceMotion ? 'none' : 'ring-turn 18s cubic-bezier(0.16, 1, 0.3, 1) infinite',
          }}
        />
        <div
          className="absolute left-[24%] top-[18%] h-[56vh] w-px -rotate-[31deg]"
          style={{ background: 'linear-gradient(180deg, transparent, hsl(var(--foreground) / 0.55), transparent)' }}
        />
        <div
          className="absolute right-[23%] top-[9%] h-[72vh] w-px rotate-[24deg]"
          style={{ background: 'linear-gradient(180deg, transparent, hsl(var(--accent) / 0.48), transparent)' }}
        />
        <div
          className="absolute left-[18%] right-[18%] top-[42%] h-px"
          style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.44), transparent)' }}
        />
      </>
    );
  }

  return <CurrentAurora reduceMotion={reduceMotion} />;
}

export function HeroBackground({ variant = 'current' }: HeroBackgroundProps) {
  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = Boolean(shouldReduceMotion);

  return (
    <>
      {!reduceMotion && <style>{KEYFRAMES}</style>}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <VariantLayers variant={variant} reduceMotion={reduceMotion} />

        <div
          className="absolute inset-0 opacity-[0.08] dark:opacity-[0.15]"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 0%, transparent 42%, hsl(var(--background) / 0.66) 100%)',
          }}
        />

        <div
          className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, transparent 0%, hsl(var(--background) / 0.70) 50%, hsl(var(--background)) 100%)',
          }}
        />
      </div>
    </>
  );
}