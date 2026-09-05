'use client';

import { ArrowDown } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { HeroBackground } from './HeroBackground';

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  const initialMotion = shouldReduceMotion
    ? { opacity: 0 }
    : { opacity: 0, y: 36, filter: 'blur(10px)' };

  const animateMotion = { opacity: 1, y: 0, filter: 'blur(0px)' };

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center items-center pt-24 pb-20 px-4 sm:px-6 overflow-hidden bg-transparent">
      {/* Animated dynamic background */}
      <HeroBackground />

      {/* ── Main content (Centered Typography & Portrait) ──────────────── */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        <div className="relative text-center flex flex-col items-center justify-center max-w-full select-none">
          {/* Top Word */}
          <div className="relative z-0 -mb-4 md:-mb-8 lg:-mb-12">
            <motion.h1
              initial={initialMotion}
              animate={animateMotion}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.85,
                delay: shouldReduceMotion ? 0 : 0.1,
                ease,
              }}
              className="font-sans text-[17vw] sm:text-[16vw] md:text-[15vw] lg:text-[14vw] leading-none tracking-tighter text-foreground font-black uppercase footer-text-glow whitespace-nowrap"
            >
              GHUFRON
            </motion.h1>
          </div>

          {/* Bottom Word */}
          <div className="relative z-0">
            <motion.h1
              initial={initialMotion}
              animate={animateMotion}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.85,
                delay: shouldReduceMotion ? 0 : 0.28,
                ease,
              }}
              className="font-sans text-[17vw] sm:text-[16vw] md:text-[15vw] lg:text-[14vw] leading-none tracking-tighter text-foreground font-black uppercase footer-text-glow whitespace-nowrap"
            >
              AINUN
            </motion.h1>
          </div>

          {/* Third Word (Accent) */}
          <div className="relative z-0 mt-0 md:-mt-2 w-full flex justify-end px-2 md:px-12 lg:px-24">
            <motion.h2
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.7,
                delay: shouldReduceMotion ? 0 : 0.45,
                ease,
              }}
              className="font-sans text-[4.5vw] md:text-[3vw] lg:text-[2.2vw] leading-none tracking-[0.4em] text-foreground/40 font-bold uppercase whitespace-nowrap"
            >
              NAJIB
            </motion.h2>
          </div>
        </div>
      </div>

      {/* ── Tagline (Bottom) ───────────────────────────────────────────── */}
      <div className="absolute bottom-20 md:bottom-24 w-full flex flex-col items-center justify-center px-6">
        <div className="max-w-sm text-center">
          <motion.p
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.7,
              delay: shouldReduceMotion ? 0 : 0.62,
              ease,
            }}
            className="font-sans text-[13px] md:text-[15px] lg:text-base text-foreground/60 tracking-wide text-center text-wrap-pretty font-light leading-relaxed"
          >
            Full-stack developer in Semarang. Backends that hold up, frontends that feel right.
          </motion.p>
        </div>
      </div>

      {/* ── Scroll hint — bottom center ─────────────────────────────────── */}
      <motion.a
        href="#about"
        className="absolute bottom-8 flex flex-col items-center text-foreground/40 hover:text-foreground/90 transition-colors cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ArrowDown className="w-5 h-5" strokeWidth={1.5} />
        </motion.div>
      </motion.a>
    </section>
  );
}
