import { useParallax } from '@/hooks/use-parallax';

interface ParallaxBackgroundProps {
  variant?: 'dots' | 'grid' | 'circles' | 'waves' | 'gradient';
  className?: string;
}

export function ParallaxBackground({
  variant = 'dots',
  className = '',
}: ParallaxBackgroundProps) {
  const offset = useParallax(0.2);

  // Unified ambient glow - visible in both light and dark mode
  // Light mode: uses higher opacity for visibility on white
  // Dark mode: uses existing HSL variables
  const ambientGlow = (
    <>
      {/* Primary glow orb - top right */}
      <div
        className="absolute -top-20 -right-20 w-[450px] h-[450px] rounded-full blur-[100px] bg-primary/15 dark:bg-primary/10"
        style={{ transform: `translateY(${-offset * 0.15}px)` }}
      />
      {/* Secondary glow orb - bottom left */}
      <div
        className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full blur-[80px] bg-accent/12 dark:bg-accent/8"
        style={{ transform: `translateY(${offset * 0.1}px)` }}
      />
    </>
  );

  const patterns = {
    dots: (
      <>
        {ambientGlow}
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
            transform: `translateY(${offset * 0.1}px)`,
          }}
        />
      </>
    ),
    grid: (
      <>
        {ambientGlow}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            transform: `translateY(${offset * 0.1}px)`,
          }}
        />
      </>
    ),
    circles: (
      <>
        {ambientGlow}
        {/* Subtle decorative circles - more visible in light mode */}
        <div
          className="absolute top-10 left-10 w-48 h-48 border border-primary/10 dark:border-primary/5 rounded-full"
          style={{ transform: `translateY(${-offset * 0.2}px)` }}
        />
        <div
          className="absolute bottom-10 right-10 w-64 h-64 border border-accent/10 dark:border-accent/5 rounded-full"
          style={{ transform: `translateY(${offset * 0.15}px)` }}
        />
      </>
    ),
    waves: (
      <>
        {ambientGlow}
        {/* Center glow for waves */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] bg-primary/10 dark:bg-primary/5"
          style={{
            transform: `translate(-50%, -50%) translateY(${offset * 0.05}px)`,
          }}
        />
      </>
    ),
    gradient: (
      <>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 dark:from-primary/3 via-transparent to-accent/6 dark:to-accent/2" />
        {ambientGlow}
      </>
    ),
  };

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {patterns[variant]}
    </div>
  );
}
