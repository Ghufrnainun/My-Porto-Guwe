'use client';

import { ArrowDown } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { HeroBackground, HeroBackgroundVariant } from './HeroBackground';
import { usePreloader } from '@/hooks/usePreloader';

// Confident, silky deceleration curve aligned with /animation-systems
const easeExpo = [0.16, 1, 0.3, 1] as const;

type HeroProps = {
  backgroundVariant?: HeroBackgroundVariant;
};

export function Hero({ backgroundVariant = 'current' }: HeroProps) {
  const shouldReduceMotion = useReducedMotion();
  const { isReady } = usePreloader();

  // Scroll pushback: when scrolling down, hero content scales back, blurs, and fades
  const { scrollY } = useScroll();
  const pushbackScale = useTransform(scrollY, [0, 600], [1, 0.93]);
  const pushbackOpacity = useTransform(scrollY, [0, 500], [1, 0.28]);
  const pushbackY = useTransform(scrollY, [0, 600], [0, 48]);
  const pushbackBlur = useTransform(scrollY, [0, 450], ['blur(0px)', 'blur(6px)']);
  const scrollHintOpacity = useTransform(scrollY, [0, 120], [1, 0]);

  const initialMotion = shouldReduceMotion
    ? { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }
    : { opacity: 0, y: 44, filter: 'blur(14px)', scale: 0.97 };

  const animateMotion = { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 };
  const currentMotion = isReady || shouldReduceMotion ? animateMotion : initialMotion;

  const initialAccent = shouldReduceMotion
    ? { opacity: 1, y: 0 }
    : { opacity: 0, y: 20 };
  const animateAccent = { opacity: 1, y: 0 };
  const currentAccent = isReady || shouldReduceMotion ? animateAccent : initialAccent;

  const initialTagline = shouldReduceMotion
    ? { opacity: 1, y: 0, filter: 'blur(0px)' }
    : { opacity: 0, y: 16, filter: 'blur(6px)' };
  const animateTagline = { opacity: 1, y: 0, filter: 'blur(0px)' };
  const currentTagline = isReady || shouldReduceMotion ? animateTagline : initialTagline;

  const initialScroll = shouldReduceMotion
    ? { opacity: 1, y: 0 }
    : { opacity: 0, y: -8 };
  const animateScroll = { opacity: 1, y: 0 };
  const currentScroll = isReady || shouldReduceMotion ? animateScroll : initialScroll;

  return (
    <section className="relative w-full h-full min-h-screen flex flex-col justify-center items-center pt-24 pb-20 px-4 sm:px-6 overflow-hidden bg-transparent">
      {/* Animated dynamic background */}
      <HeroBackground variant={backgroundVariant} />

      {/* ── Main content (Typography & Tagline with 3D Scroll Pushback) ──────────────── */}
      <motion.div
        style={{
          scale: shouldReduceMotion ? 1 : pushbackScale,
          opacity: shouldReduceMotion ? 1 : pushbackOpacity,
          y: shouldReduceMotion ? 0 : pushbackY,
          filter: shouldReduceMotion ? 'none' : pushbackBlur,
        }}
        className="relative z-10 w-full flex-1 flex flex-col items-center justify-center will-change-[transform,opacity,filter]"
      >
        <div className="relative text-center flex flex-col items-center justify-center max-w-full select-none">
          {/* Full name — single h1 for SEO; spans keep the split-size visual */}
          <motion.h1
            initial={initialMotion}
            animate={currentMotion}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.9,
              delay: shouldReduceMotion ? 0 : 0.08,
              ease: easeExpo,
            }}
            className="w-full font-sans text-[17vw] sm:text-[16vw] md:text-[15vw] lg:text-[14vw] leading-none tracking-tighter text-foreground font-black uppercase footer-text-glow will-change-[transform,opacity,filter]"
          >
            <motion.span
              className="block whitespace-nowrap"
              initial={initialMotion}
              animate={currentMotion}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.9,
                delay: shouldReduceMotion ? 0 : 0.08,
                ease: easeExpo,
              }}
            >
              GHUFRON
            </motion.span>
            <motion.span
              className="block whitespace-nowrap -mt-4 md:-mt-8 lg:-mt-12"
              initial={initialMotion}
              animate={currentMotion}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.9,
                delay: shouldReduceMotion ? 0 : 0.24,
                ease: easeExpo,
              }}
            >
              AINUN
            </motion.span>
            <motion.span
              className="block text-right whitespace-nowrap text-[4.5vw] md:text-[3vw] lg:text-[2.2vw] leading-none tracking-[0.4em] text-foreground/40 font-bold uppercase px-2 md:px-12 lg:px-24 md:-mt-2"
              initial={initialAccent}
              animate={currentAccent}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.75,
                delay: shouldReduceMotion ? 0 : 0.4,
                ease: easeExpo,
              }}
            >
              NAJIB
            </motion.span>
          </motion.h1>
        </div>

        {/* ── Tagline (Bottom) ───────────────────────────────────────────── */}
        <div className="absolute bottom-20 md:bottom-24 w-full flex flex-col items-center justify-center px-6">
          <div className="max-w-sm text-center">
            <motion.p
              initial={initialTagline}
              animate={currentTagline}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.75,
                delay: shouldReduceMotion ? 0 : 0.54,
                ease: easeExpo,
              }}
              className="font-sans text-[13px] md:text-[15px] lg:text-base text-foreground/60 tracking-wide text-center text-wrap-pretty font-light leading-relaxed will-change-[transform,opacity,filter]"
            >
              Full-stack developer in Semarang. Backends that hold up, frontends that feel right.
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* ── Scroll hint — bottom center ─────────────────────────────────── */}
      <motion.a
        href="#about"
        aria-label="Scroll down to about section"
        style={{
          opacity: shouldReduceMotion ? undefined : scrollHintOpacity,
        }}
        className="absolute bottom-8 z-20 flex flex-col items-center text-foreground/40 hover:text-foreground/90 active:scale-[0.97] transition-[transform,color] duration-150 ease-out cursor-pointer"
        initial={initialScroll}
        animate={currentScroll}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.6,
          delay: shouldReduceMotion ? 0 : 0.72,
          ease: easeExpo,
        }}
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
