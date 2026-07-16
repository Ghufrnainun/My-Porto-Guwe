'use client';

import { Github, Linkedin, ArrowRight } from 'lucide-react';
import { motion, useScroll, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-center px-6 py-20 md:px-12 lg:px-24 overflow-hidden bg-transparent"
    >
      {/* Drifting Ambient Glowing Orbs */}
      <div 
        className="absolute top-1/4 left-1/4 w-[30vw] h-[30vw] bg-primary/5 rounded-full blur-[80px] pointer-events-none animate-float" 
        style={{ animationDuration: '22s', willChange: 'transform', transform: 'translate3d(0, 0, 0)' }} 
      />
      <div 
        className="absolute -bottom-20 right-1/4 w-[30vw] h-[30vw] bg-primary/8 rounded-full blur-[90px] pointer-events-none animate-float" 
        style={{ animationDuration: '30s', animationDelay: '-8s', willChange: 'transform', transform: 'translate3d(0, 0, 0)' }} 
      />

      {/* Status Badge - Top Right Corner */}
      <motion.div
        className="absolute top-8 right-8 lg:right-12"
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: shouldReduceMotion ? 0.25 : 0.6, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-secondary/80 backdrop-blur-sm border border-border/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full bg-primary opacity-75"></span>
            <span className="relative inline-flex h-1.5 w-1.5 bg-primary"></span>
          </span>
          <span className="text-[10px] font-mono font-semibold text-foreground uppercase tracking-widest">
            Full-Stack Developer
          </span>
        </div>
      </motion.div>

      {/* Vertical Social Links - Right Side */}
      <motion.div
        className="absolute right-8 lg:right-12 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-4"
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: shouldReduceMotion ? 0.25 : 0.6, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="w-px h-16 bg-border/60" />
        <a
          href="https://github.com/Ghufrnainun"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
          aria-label="GitHub"
        >
          <Github className="w-5 h-5" strokeWidth={1.5} />
        </a>
        <a
          href="https://www.linkedin.com/in/ghufronainunnajib/"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
          aria-label="LinkedIn"
        >
          <Linkedin className="w-5 h-5" strokeWidth={1.5} />
        </a>
        <div className="w-px h-16 bg-border/60" />
      </motion.div>

      {/* Main Content - Left Aligned */}
      <div className="max-w-5xl relative z-10">
        {/* Name - Viewport-Relative, Staggered Split-Reveal */}
        <h1 className="font-serif tracking-tight text-foreground mb-8">
          <div className="overflow-hidden py-1 mb-2">
            <motion.span
              className="block text-[12vw] md:text-[10vw] lg:text-[8vw] font-normal italic leading-[0.9]"
              initial={shouldReduceMotion ? { opacity: 0 } : { y: "110%", rotate: 2 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { y: 0, rotate: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.35 : 0.9, ease: [0.32, 0.72, 0, 1] }}
            >
              Ghufron
            </motion.span>
          </div>
          <div className="overflow-hidden py-1">
            <motion.span
              className="block text-[12vw] md:text-[10vw] lg:text-[8vw] font-normal text-muted-foreground/40 dark:text-muted-foreground/20 hover:text-primary/70 transition-colors duration-700 cursor-default leading-[0.9]"
              initial={shouldReduceMotion ? { opacity: 0 } : { y: "110%", rotate: -2 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { y: 0, rotate: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.35 : 0.9, delay: shouldReduceMotion ? 0.1 : 0.15, ease: [0.32, 0.72, 0, 1] }}
            >
              Ainun Najib
            </motion.span>
          </div>
        </h1>

        {/* Tagline - Space Grotesk accent */}
        <motion.div
          className="max-w-2xl mb-12"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.35 : 0.8, delay: shouldReduceMotion ? 0.15 : 0.3, ease: [0.32, 0.72, 0, 1] }}
        >
          <h2 className="text-lg md:text-xl lg:text-2xl font-sans font-normal text-foreground/80 leading-relaxed text-wrap-pretty">
            Building high-performance{' '}
            <span className="font-serif italic text-foreground underline decoration-primary/40 decoration-2 underline-offset-8">
              web architectures
            </span>{' '}
            with{' '}
            <span className="font-display font-medium text-primary">
              Laravel
            </span>{' '}
            and{' '}
            <span className="font-display font-medium text-primary">React</span>
            . Currently Computer Engineering student at Polines.
          </h2>
        </motion.div>

        {/* CTAs Row */}
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.35 : 0.8, delay: shouldReduceMotion ? 0.2 : 0.45, ease: [0.32, 0.72, 0, 1] }}
        >
          {/* Rectangular Primary Button */}
          <a
            href="#projects"
            className="group relative inline-flex items-center justify-between pl-6 pr-2.5 py-2.5 bg-foreground text-background dark:bg-white dark:text-black rounded-lg font-display font-semibold text-[11px] uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-soft"
          >
            <span>View Projects</span>
            <span className="w-8 h-8 rounded-md bg-background dark:bg-black/10 flex items-center justify-center text-foreground dark:text-white transition-transform duration-500 ease-out-spring group-hover:translate-x-1 group-hover:-rotate-45 ml-4">
              <ArrowRight className="w-4 h-4 transform -rotate-45 group-hover:rotate-0 transition-transform duration-500" strokeWidth={1.8} />
            </span>
          </a>

          {/* Rectangular Secondary Button */}
          <a
            href="mailto:ghufrnainunajib@gmail.com"
            className="group relative inline-flex items-center justify-between pl-6 pr-2.5 py-2.5 bg-secondary/50 hover:bg-secondary text-foreground rounded-lg font-display font-semibold text-[11px] uppercase tracking-widest transition-all active:scale-[0.98] border border-border/80"
          >
            <span>Email Me</span>
            <span className="w-8 h-8 rounded-md bg-background flex items-center justify-center text-foreground transition-transform duration-500 ease-out-spring group-hover:translate-x-1 ml-4">
              <ArrowRight className="w-4 h-4" strokeWidth={1.8} />
            </span>
          </a>

          {/* Mobile Social Links */}
          <div className="flex items-center gap-3 md:hidden mt-2 sm:mt-0">
            <div className="w-px h-6 bg-border" />
            <a
              href="https://github.com/Ghufrnainun"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-md bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-primary transition-all duration-300"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" strokeWidth={1.5} />
            </a>
            <a
              href="https://www.linkedin.com/in/ghufronainunnajib/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-md bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-primary transition-all duration-300"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" strokeWidth={1.5} />
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll Hint - Bottom Left on Desktop */}
      <motion.a
        href="#about"
        className="absolute bottom-8 left-6 md:left-12 lg:left-24 flex items-center gap-3 text-muted-foreground/60 dark:text-muted-foreground/40 hover:text-primary transition-colors cursor-pointer"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      >
        <motion.span
          className="text-lg font-bold"
          animate={shouldReduceMotion ? {} : { y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          ↓
        </motion.span>
        <span className="text-[10px] font-mono uppercase tracking-widest font-semibold">
          Scroll
        </span>
      </motion.a>
    </section>
  );
}
