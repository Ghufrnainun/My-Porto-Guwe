import { useParallax } from "@/hooks/use-parallax";

interface ParallaxBackgroundProps {
  variant?: "dots" | "grid" | "circles" | "waves" | "gradient";
  className?: string;
}

export function ParallaxBackground({ variant = "dots", className = "" }: ParallaxBackgroundProps) {
  const offset = useParallax(0.3);

  const patterns = {
    dots: (
      <>
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
            transform: `translateY(${offset * 0.2}px)`,
          }}
        />
        <div 
          className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"
          style={{ transform: `translateY(${-offset * 0.4}px)` }}
        />
        <div 
          className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl"
          style={{ transform: `translateY(${offset * 0.3}px)` }}
        />
      </>
    ),
    grid: (
      <>
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            transform: `translateY(${offset * 0.15}px)`,
          }}
        />
        <div 
          className="absolute top-1/4 right-0 w-[300px] h-[600px] bg-gradient-to-l from-primary/8 to-transparent"
          style={{ transform: `translateY(${-offset * 0.2}px)` }}
        />
        <div 
          className="absolute bottom-1/4 left-0 w-[300px] h-[600px] bg-gradient-to-r from-accent/8 to-transparent"
          style={{ transform: `translateY(${offset * 0.25}px)` }}
        />
      </>
    ),
    circles: (
      <>
        <div 
          className="absolute top-10 left-10 w-64 h-64 border border-primary/10 rounded-full"
          style={{ transform: `translateY(${-offset * 0.5}px) rotate(${offset * 0.05}deg)` }}
        />
        <div 
          className="absolute top-20 left-20 w-48 h-48 border border-primary/5 rounded-full"
          style={{ transform: `translateY(${-offset * 0.4}px) rotate(${-offset * 0.03}deg)` }}
        />
        <div 
          className="absolute bottom-10 right-10 w-80 h-80 border border-accent/10 rounded-full"
          style={{ transform: `translateY(${offset * 0.3}px) rotate(${offset * 0.04}deg)` }}
        />
        <div 
          className="absolute bottom-20 right-20 w-56 h-56 border border-accent/5 rounded-full"
          style={{ transform: `translateY(${offset * 0.35}px) rotate(${-offset * 0.02}deg)` }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-3xl"
          style={{ transform: `translate(-50%, -50%) translateY(${offset * 0.1}px)` }}
        />
      </>
    ),
    waves: (
      <>
        <svg 
          className="absolute bottom-0 left-0 w-full h-40 opacity-5"
          viewBox="0 0 1440 320" 
          preserveAspectRatio="none"
          style={{ transform: `translateY(${offset * 0.2}px)` }}
        >
          <path 
            fill="currentColor" 
            className="text-primary"
            d="M0,160L48,170.7C96,181,192,203,288,186.7C384,171,480,117,576,117.3C672,117,768,171,864,186.7C960,203,1056,181,1152,154.7C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
        <svg 
          className="absolute top-0 left-0 w-full h-32 opacity-5 rotate-180"
          viewBox="0 0 1440 320" 
          preserveAspectRatio="none"
          style={{ transform: `rotate(180deg) translateY(${offset * 0.15}px)` }}
        >
          <path 
            fill="currentColor" 
            className="text-accent"
            d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,96C960,107,1056,149,1152,154.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
        <div 
          className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl"
          style={{ transform: `translateY(${-offset * 0.25}px)` }}
        />
      </>
    ),
    gradient: (
      <>
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3"
        />
        <div 
          className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]"
          style={{ transform: `translateY(${-offset * 0.2}px)` }}
        />
        <div 
          className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px]"
          style={{ transform: `translateY(${offset * 0.15}px)` }}
        />
      </>
    ),
  };

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {patterns[variant]}
    </div>
  );
}
