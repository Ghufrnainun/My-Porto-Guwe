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
      {/* Editorial Numbering - Giant ghost "01" */}
      {/* Editorial Numbering - Giant ghost "01" */}
      <div className="absolute top-1/2 -translate-y-1/2 right-4 lg:right-12 pointer-events-none select-none overflow-hidden opacity-50 md:opacity-100">
        <span className="text-[10rem] md:text-[20rem] font-serif font-bold text-muted-foreground/[0.03] leading-none mix-blend-difference">
          01
        </span>
      </div>

      {/* Status Badge - Top Right Corner */}
      <motion.div
        className="absolute top-8 right-8 lg:right-12"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 backdrop-blur-sm border border-border">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs font-display font-medium text-foreground uppercase tracking-wider">
            FullStack Developer
          </span>
        </div>
      </motion.div>

      {/* Vertical Social Links - Right Side */}
      <motion.div
        className="absolute right-8 lg:right-12 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-4"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <div className="w-px h-16 bg-border" />
        <a
          href="https://github.com/Ghufrnainun"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="GitHub"
        >
          <Github className="w-5 h-5" />
        </a>
        <a
          href="https://linkedin.com/in/ghufronainun"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="LinkedIn"
        >
          <Linkedin className="w-5 h-5" />
        </a>
        <div className="w-px h-16 bg-border" />
      </motion.div>

      {/* Main Content - Left Aligned */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.21, 0.45, 0.32, 0.9] }}
        className="max-w-5xl relative z-10"
      >
        {/* Name - Viewport-Relative, Dramatic Serif */}
        <h1 className="font-serif tracking-tight text-foreground dark:text-white mb-6 leading-[0.85]">
          <span className="block text-[12vw] md:text-[10vw] lg:text-[8vw] font-normal italic">
            Ghufron
          </span>
          <span className="block text-[12vw] md:text-[10vw] lg:text-[8vw] font-normal text-muted-foreground/30 hover:text-muted-foreground/50 transition-colors duration-500 cursor-default">
            Ainun Najib
          </span>
        </h1>

        {/* Tagline - Inter with Space Grotesk accent */}
        <div className="max-w-2xl mb-10">
          <h2 className="text-lg md:text-xl lg:text-2xl font-sans font-normal text-foreground/80 leading-relaxed">
            Building high-performance{' '}
            <span className="font-serif italic text-foreground underline decoration-primary/50 decoration-2 underline-offset-4">
              web architectures
            </span>{' '}
            with{' '}
            <span className="font-display font-medium text-primary">
              Laravel
            </span>{' '}
            and{' '}
            <span className="font-display font-medium text-primary">React</span>
            . Currently a Computer Engineering student at Polines.
          </h2>
        </div>

        {/* CTAs Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <a
            href="#projects"
            className="group inline-flex items-center gap-3 px-6 py-3.5 bg-foreground text-background rounded-full font-display font-medium text-sm uppercase tracking-wide transition-all hover:bg-foreground/90 active:scale-[0.98]"
          >
            View Projects
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="mailto:ghufrnainunajib@gmail.com"
            className="group flex items-center gap-2 text-sm font-display font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="underline underline-offset-4 decoration-border hover:decoration-primary transition-colors">
              Email Me
            </span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>

          {/* Mobile Social Links */}
          <div className="flex items-center gap-3 md:hidden">
            <div className="w-px h-6 bg-border" />
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

      {/* Scroll Hint - Bottom Left on Desktop */}
      <motion.a
        href="#about"
        className="absolute bottom-8 left-6 md:left-12 lg:left-24 flex items-center gap-3 text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-pointer"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <motion.span
          className="text-2xl"
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          ↓
        </motion.span>
        <span className="text-xs font-display uppercase tracking-widest">
          Scroll
        </span>
      </motion.a>
    </section>
  );
}
