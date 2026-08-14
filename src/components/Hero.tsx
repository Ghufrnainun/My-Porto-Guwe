'use client';

import { ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { HeroBackground } from './HeroBackground';
import { TextEffect } from './ui/text-effect';

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center items-center pt-24 pb-20 px-6 overflow-hidden bg-transparent">
      {/* Animated dynamic background */}
      <HeroBackground />

      {/* ── Main content (Centered Typography & Portrait) ──────────────── */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        <div className="relative text-center flex flex-col items-center justify-center">
          {/* Top Word */}
          <div className="relative z-0 -mb-4 md:-mb-8 lg:-mb-12">
            <TextEffect
              as="h1"
              per="char"
              delay={0.1}
              className="font-sans text-[18vw] md:text-[15vw] lg:text-[14vw] leading-none tracking-tighter text-foreground font-black uppercase footer-text-glow"
              text="GHUFRON"
            />
          </div>
          
          {/* Bottom Word */}
          <div className="relative z-0">
            <TextEffect
              as="h1"
              per="char"
              delay={0.35}
              className="font-sans text-[18vw] md:text-[15vw] lg:text-[14vw] leading-none tracking-tighter text-foreground font-black uppercase footer-text-glow"
              text="AINUN"
            />
          </div>

          {/* Third Word (Accent) */}
          <div className="relative z-0 mt-0 md:-mt-2 w-full flex justify-end px-2 md:px-12 lg:px-24">
            <TextEffect
              as="h2"
              per="char"
              delay={0.6}
              className="font-sans text-[4vw] md:text-[3vw] lg:text-[2.5vw] leading-none tracking-[0.4em] text-foreground/40 font-bold uppercase"
              text="NAJIB"
            />
          </div>
        </div>
      </div>

      {/* ── Tagline (Bottom) ───────────────────────────────────────────── */}
      <div className="absolute bottom-20 md:bottom-24 w-full flex flex-col items-center justify-center px-6">
        <div className="max-w-sm text-center">
          <TextEffect 
            per="word"
            delay={0.7}
            className="font-sans text-[13px] md:text-[15px] lg:text-base text-foreground/60 tracking-wide text-center text-wrap-pretty font-light leading-relaxed"
            text="Full-stack developer in Semarang. Backends that hold up, frontends that feel right."
          />
        </div>
      </div>

      {/* ── Scroll hint — bottom center ─────────────────────────────────── */}
      <motion.a
        href="#about"
        className="absolute bottom-8 flex flex-col items-center text-foreground/40 hover:text-foreground/90 transition-colors cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
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
