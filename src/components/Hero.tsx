'use client';

import { Github, Linkedin, ArrowRight } from 'lucide-react';
import { motion, useScroll } from 'framer-motion';
import { useRef } from 'react';

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-center px-6 py-20 md:px-12 lg:px-24 overflow-hidden bg-background"
    >
      {/* Clean background - no orbs */}

      <div className="absolute right-0 top-0 w-1/2 h-full hidden lg:block pointer-events-none select-none overflow-hidden">
        {/* Abstract dot grid - no teal glow */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-20">
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            className="text-muted-foreground"
          >
            {/* Grid of dots */}
            {[...Array(7)].map((_, row) =>
              [...Array(7)].map((_, col) => (
                <circle
                  key={`${row}-${col}`}
                  cx={20 + col * 28}
                  cy={20 + row * 28}
                  r={row === 3 && col === 3 ? 4 : 2}
                  fill="currentColor"
                  opacity={
                    Math.abs(row - 3) + Math.abs(col - 3) < 3 ? 0.6 : 0.3
                  }
                />
              ))
            )}
          </svg>
        </div>

        {/* Minimal text */}
        <p className="absolute right-12 bottom-1/3 text-xs font-mono text-muted-foreground/50 tracking-wide">
          Engineering systems, not just interfaces.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.21, 0.45, 0.32, 0.9] }}
        className="max-w-5xl relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs font-mono font-medium text-foreground uppercase tracking-wider">
            Open to Work
          </span>
        </div>

        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-foreground dark:text-white mb-8 leading-[0.9]">
          Ghufron <br />
          <span className="text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors duration-500 cursor-default">
            Ainun Najib
          </span>
        </h1>

        <div className="max-w-2xl mb-10">
          <h2 className="text-xl md:text-2xl font-medium text-foreground/90 leading-snug text-balance">
            Building high-performance{' '}
            <span className="italic font-serif underline decoration-primary decoration-2 underline-offset-4">
              web architectures
            </span>{' '}
            with Laravel and React. Currently a Computer Engineering student at
            Polines.
          </h2>
        </div>

        {/* CTAs Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="px-6 py-3 bg-foreground text-background rounded-lg font-medium transition-all hover:bg-foreground/90 active:scale-[0.98]"
            >
              View Projects
            </a>
            <a
              href="mailto:ghufrnainunajib@gmail.com"
              className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-foreground hover:text-primary hover:underline underline-offset-4 transition-colors"
            >
              Email Me
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {/* Separator - Desktop Only */}
          <div className="hidden md:block w-px h-6 bg-border" />

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Ghufrnainun"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com/in/ghufronainun"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </motion.div>

      {/* Scroll Hint - Bottom Center on Mobile, Bottom Right on Desktop */}
      <motion.a
        href="#about"
        className="absolute bottom-8 inset-x-0 mx-auto w-fit md:inset-x-auto md:mx-0 md:right-8 flex flex-col items-center gap-2 text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-pointer"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <span className="text-xs font-mono tracking-wider">
          Scroll to explore
        </span>
        <motion.span
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          ↓
        </motion.span>
      </motion.a>
    </section>
  );
}
