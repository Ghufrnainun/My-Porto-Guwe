import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';

interface WordProps {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  reduceMotion: boolean | null;
}

function ScrubWord({ children, progress, range, reduceMotion }: WordProps) {
  const opacity = useTransform(progress, range, [0.24, 1]);
  const color = useTransform(
    progress,
    range,
    ['hsl(var(--muted-foreground) / 0.35)', 'hsl(var(--foreground))']
  );

  if (reduceMotion) {
    return <span className="inline-block mr-[0.26em] text-foreground">{children}</span>;
  }

  return (
    <motion.span
      style={{ opacity, color }}
      className="inline-block mr-[0.26em] transition-colors duration-150"
    >
      {children}
    </motion.span>
  );
}

export function AboutPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.45'],
  });

  // Authentic, human, craft-led statement without AI buzzwords (~45 words for optimal scroll scrub pacing)
  const statement =
    'I build web products from Semarang, focusing on clean backend systems and interfaces that feel good to use. As a Computer Engineering student at Polines, I care about the invisible details: database query speed, predictable APIs, and micro-interactions that make software feel responsive and physical. Practical code, built to last.';

  const words = statement.split(' ');

  return (
    <section id="about" className="relative overflow-hidden bg-transparent py-20 md:py-32">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div ref={containerRef} className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-14 items-start">
          {/* Left Column: Quiet Metadata */}
          <div className="md:col-span-4 lg:col-span-3 space-y-4">
            <div className="space-y-1 text-xs font-mono text-muted-foreground">
              <p className="font-sans font-semibold text-primary uppercase tracking-wider text-[11px]">
                (About & Craft)
              </p>
              <p className="text-foreground/90 font-medium">Ghufron Ainun Najib</p>
              <p>Semarang, Indonesia</p>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/40 px-3 py-1 text-xs text-foreground/85">
                <span className="size-1.5 rounded-full bg-primary" />
                <span>Open to opportunities</span>
              </div>
            </div>
          </div>

          {/* Right Column: Portox Typography Statement & Action */}
          <div className="md:col-span-8 lg:col-span-9 space-y-10">
            <h2 className="font-serif text-[clamp(1.85rem,3.4vw,2.9rem)] font-normal leading-[1.32] tracking-tight">
              {words.map((word, i) => {
                const start = i / words.length;
                const end = start + 1 / words.length;
                return (
                  <ScrubWord
                    key={`${word}-${i}`}
                    progress={scrollYProgress}
                    range={[start, end]}
                    reduceMotion={reduceMotion}
                  >
                    {word}
                  </ScrubWord>
                );
              })}
            </h2>

            {/* Direct & clean action links */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <Link
                to="/about"
                className="group inline-flex items-center gap-2.5 font-display text-sm font-semibold text-foreground hover:text-primary transition-colors duration-200"
              >
                <span>Explore full story</span>
                <span className="flex size-7 items-center justify-center rounded-full border border-border/80 bg-secondary/50 transition-[transform,background-color,border-color] duration-200 group-hover:translate-x-1 group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary">
                  <ArrowRight className="size-3.5" strokeWidth={1.5} />
                </span>
              </Link>

              <Link
                to="/resume"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <span>View credentials</span>
                <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
