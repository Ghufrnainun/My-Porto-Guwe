'use client';

import { Github, Linkedin, ArrowDown, ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { profile } from '@/data/profile';
import { AnimatedMeshGradient } from './AnimatedMeshGradient';

// ─── Per-character animated name line ────────────────────────────────────────

interface AnimatedNameLineProps {
  text: string;
  className?: string;
  charDelay?: number;
}

function AnimatedNameLine({ text, className = '', charDelay = 0 }: AnimatedNameLineProps) {
  const shouldReduceMotion = useReducedMotion();
  const chars = text.split('');

  return (
    // overflow-hidden clips chars as they rise — the core of the effect
    <span className="block overflow-hidden py-1" aria-label={text}>
      <span className={className} aria-hidden="true">
        {chars.map((char, i) => (
          <motion.span
            key={`${char}-${i}`}
            className="inline-block"
            initial={
              shouldReduceMotion ? { opacity: 0 } : { y: '115%', opacity: 0 }
            }
            animate={
              shouldReduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 }
            }
            transition={{
              duration: shouldReduceMotion ? 0.3 : 0.75,
              delay: shouldReduceMotion ? 0 : charDelay + i * 0.038,
              ease: [0.32, 0.72, 0, 1],
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </span>
    </span>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-[85vh] flex flex-col justify-center pt-32 pb-20 px-6 md:px-12 lg:px-24 overflow-hidden bg-transparent">
      {/* Animated mesh gradient background */}
      <AnimatedMeshGradient />

      {/* ── Status badge — top right ────────────────────────────────────── */}
      <motion.div
        className="absolute top-6 right-6 md:top-8 md:right-8 lg:right-12 z-10"
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          delay: 0.5,
          duration: shouldReduceMotion ? 0.25 : 0.6,
          ease: [0.32, 0.72, 0, 1],
        }}
      >
        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-secondary/80 backdrop-blur-sm border border-border/60 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full bg-primary opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 bg-primary" />
          </span>
          <span className="text-[10px] font-mono font-semibold text-foreground uppercase tracking-widest">
            Semester {profile.semester} &middot; {profile.availability}
          </span>
        </div>
      </motion.div>

      {/* ── Vertical social links — right side (desktop) ────────────────── */}
      <motion.div
        className="absolute right-8 lg:right-12 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-4 z-10"
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          delay: 0.8,
          duration: shouldReduceMotion ? 0.25 : 0.6,
          ease: [0.32, 0.72, 0, 1],
        }}
      >
        <div className="w-px h-16 bg-border/60" />
        <a
          href="https://github.com/Ghufrnainun"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
          aria-label="GitHub"
        >
          <Github className="w-5 h-5" strokeWidth={1.5} />
        </a>
        <a
          href="https://www.linkedin.com/in/ghufronainunnajib/"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
          aria-label="LinkedIn"
        >
          <Linkedin className="w-5 h-5" strokeWidth={1.5} />
        </a>
        <div className="w-px h-16 bg-border/60" />
      </motion.div>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="max-w-5xl relative z-10">
        {/* Name — per-character stagger reveal */}
        <h1 className="font-serif tracking-tight text-foreground mb-8">
          <AnimatedNameLine
            text="Ghufron"
            className="text-[12vw] md:text-[10vw] lg:text-[8vw] font-bold leading-[0.9]"
            charDelay={0}
          />
          <AnimatedNameLine
            text="Ainun Najib"
            className="text-[12vw] md:text-[10vw] lg:text-[8vw] font-normal text-muted-foreground/55 hover:text-primary/70 transition-colors duration-700 cursor-default leading-[0.9]"
            charDelay={0.22}
          />
        </h1>

        {/* Tagline */}
        <motion.div
          className="max-w-2xl mb-12"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0.35 : 0.8,
            delay: shouldReduceMotion ? 0.15 : 0.68,
            ease: [0.32, 0.72, 0, 1],
          }}
        >
          <h2 className="text-lg md:text-xl lg:text-2xl font-sans font-normal text-foreground/80 leading-relaxed text-wrap-pretty">
            Full-stack developer, semester five at Polines.{' '}
            <span className="font-serif text-foreground underline decoration-primary/40 decoration-2 underline-offset-8">
              Building real web products
            </span>{' '}
            — from backend APIs to the UI that ships them.
          </h2>
        </motion.div>

        {/* CTA row */}
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0.35 : 0.8,
            delay: shouldReduceMotion ? 0.2 : 0.82,
            ease: [0.32, 0.72, 0, 1],
          }}
        >
          {/* Primary */}
          <Link
            to="/projects"
            className="group relative inline-flex items-center justify-between pl-6 pr-2.5 py-2.5 bg-foreground text-background dark:bg-white dark:text-black rounded-lg font-display font-semibold text-[11px] uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg hover:shadow-soft"
          >
            <span>View Case Studies</span>
            <span className="w-8 h-8 rounded-md bg-background dark:bg-black/10 flex items-center justify-center text-foreground dark:text-white transition-transform duration-500 ease-out-spring group-hover:translate-x-1 group-hover:-rotate-45 ml-4">
              <ArrowRight
                className="w-4 h-4 transform -rotate-45 group-hover:rotate-0 transition-transform duration-500"
                strokeWidth={1.8}
              />
            </span>
          </Link>

          {/* Secondary */}
          <a
            href="mailto:ghufrnainunajib@gmail.com"
            className="group relative inline-flex items-center justify-between pl-6 pr-2.5 py-2.5 bg-secondary/50 hover:bg-secondary text-foreground rounded-lg font-display font-semibold text-[11px] uppercase tracking-widest transition-all active:scale-[0.97] border border-border/80"
          >
            <span>Email Me</span>
            <span className="w-8 h-8 rounded-md bg-background flex items-center justify-center text-foreground transition-transform duration-500 ease-out-spring group-hover:translate-x-1 ml-4">
              <ArrowRight className="w-4 h-4" strokeWidth={1.8} />
            </span>
          </a>

          {/* Mobile social icons */}
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

      {/* ── Scroll hint — bottom left ─────────────────────────────────── */}
      <motion.a
        href="#about"
        className="absolute bottom-8 left-6 md:left-12 lg:left-24 flex items-center gap-3 text-muted-foreground/60 dark:text-muted-foreground/40 hover:text-primary transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      >
        <motion.span
          animate={shouldReduceMotion ? {} : { y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ArrowDown className="size-4" aria-hidden="true" />
        </motion.span>
        <span className="text-[10px] font-mono uppercase tracking-widest font-semibold">
          Scroll
        </span>
      </motion.a>
    </section>
  );
}
