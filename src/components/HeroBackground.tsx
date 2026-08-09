import { useReducedMotion } from 'framer-motion';

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
`;

export function HeroBackground() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      {!shouldReduceMotion && <style>{KEYFRAMES}</style>}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        {/* Hardware-accelerated vibrant Aurora Orbs */}
        
        {/* Orb 1 - Primary */}
        <div
          className="absolute rounded-full pointer-events-none opacity-60 dark:opacity-75"
          style={{
            width: '60vw',
            height: '60vw',
            left: '-10%',
            top: '-20%',
            background: 'radial-gradient(circle, hsl(var(--primary) / 0.6) 0%, hsl(var(--primary) / 0.15) 45%, transparent 70%)',
            willChange: 'transform',
            animation: shouldReduceMotion ? 'none' : 'aurora-1 14s ease-in-out infinite alternate',
          }}
        />

        {/* Orb 2 - Accent */}
        <div
          className="absolute rounded-full pointer-events-none opacity-60 dark:opacity-70"
          style={{
            width: '55vw',
            height: '55vw',
            right: '-10%',
            bottom: '-15%',
            background: 'radial-gradient(circle, hsl(var(--accent) / 0.55) 0%, hsl(var(--accent) / 0.15) 45%, transparent 70%)',
            willChange: 'transform',
            animation: shouldReduceMotion ? 'none' : 'aurora-2 16s ease-in-out infinite alternate',
          }}
        />

        {/* Orb 3 - Secondary Blend */}
        <div
          className="absolute rounded-full pointer-events-none opacity-40 dark:opacity-50"
          style={{
            width: '45vw',
            height: '45vw',
            left: '25%',
            top: '15%',
            background: 'radial-gradient(circle, hsl(var(--primary) / 0.4) 0%, hsl(var(--accent) / 0.1) 45%, transparent 70%)',
            willChange: 'transform',
            animation: shouldReduceMotion ? 'none' : 'aurora-3 12s ease-in-out infinite alternate',
          }}
        />

        {/* Static Hardware-Friendly Grid Layer */}
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

        {/* Bottom fade — blends Hero into the next section seamlessly */}
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
