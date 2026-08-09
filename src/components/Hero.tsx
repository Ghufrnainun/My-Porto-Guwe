'use client';

import { ArrowDown, Github, Linkedin, ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { profile } from '@/data/profile';
import { HeroBackground } from './HeroBackground';

// ─── BlurText animation component (Adapted for framer-motion) ───────────────

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
}

function BlurText({ text, delay = 0.08, className = '' }: BlurTextProps) {
  const shouldReduceMotion = useReducedMotion();
  const chars = text.split('');

  return (
    <span className={`inline-flex flex-wrap justify-center ${className}`}>
      {chars.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          className="inline-block"
          initial={
            shouldReduceMotion
              ? { opacity: 0 }
              : { filter: 'blur(12px)', opacity: 0, y: -20 }
          }
          animate={
            shouldReduceMotion
              ? { opacity: 1 }
              : { filter: 'blur(0px)', opacity: 1, y: 0 }
          }
          transition={{
            duration: 0.8,
            delay: shouldReduceMotion ? 0 : i * delay,
            ease: [0.32, 0.72, 0, 1],
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center items-center pt-24 pb-20 px-6 overflow-hidden bg-transparent">
      {/* Animated dynamic background */}
      <HeroBackground />

      {/* ── Main content (Centered Typography & Portrait) ──────────────── */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        
        <div className="relative text-center flex flex-col items-center justify-center">
          {/* Top Word */}
          <div className="relative z-0 -mb-4 md:-mb-8 lg:-mb-12">
            <BlurText
              text="GHUFRON"
              delay={0.06}
              className="font-serif text-[18vw] md:text-[15vw] lg:text-[14vw] leading-none tracking-tight text-foreground font-bold uppercase"
            />
          </div>
          
          {/* Bottom Word */}
          <div className="relative z-0">
            <BlurText
              text="AINUN"
              delay={0.06}
              className="font-serif text-[18vw] md:text-[15vw] lg:text-[14vw] leading-none tracking-tight text-foreground font-bold uppercase"
            />
          </div>
        </div>
      </div>

      {/* ── Tagline (Bottom) ───────────────────────────────────────────── */}
      <motion.div
        className="absolute bottom-20 md:bottom-24 w-full flex flex-col items-center justify-center px-6"
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
      >
        <p className="font-sans text-[13px] md:text-[15px] lg:text-base text-foreground/60 tracking-wide text-center max-w-sm text-wrap-pretty font-light">
          Designing human experiences in code. <br className="hidden md:block" />
          From robust backends to tactile interfaces.
        </p>
      </motion.div>

      {/* ── Scroll hint — bottom center ─────────────────────────────────── */}
      <motion.a
        href="#about"
        className="absolute bottom-8 flex flex-col items-center text-foreground/40 hover:text-foreground/90 transition-colors cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ArrowDown className="w-5 h-5" strokeWidth={1.5} />
        </motion.div>
      </motion.a>
    </section>
  );
}
