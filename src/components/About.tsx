import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="about"
      ref={ref}
      className="py-24 md:py-32 relative overflow-hidden bg-background"
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        {/* Editorial Layout: Photo Left + Text Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column - Vertical Photo */}
          <motion.div
            className="lg:col-span-4"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <img
                src="/Photo.png"
                alt="Ghufron Ainun Najib"
                className="w-full aspect-[3/4] object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-700"
              />
              {/* Subtle caption */}
              <p className="mt-4 text-xs font-mono text-muted-foreground text-center">
                Semarang, Indonesia
              </p>
            </div>
          </motion.div>

          {/* Right Column - Long-form Text */}
          <motion.div
            className="lg:col-span-8 flex flex-col justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Section Label */}
            <p className="text-sm font-mono text-primary mb-6 tracking-wider uppercase">
              Who I Am
            </p>

            {/* Editorial Text */}
            <div className="space-y-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
              {/* Paragraph 1: What problems I like solving */}
              <p>
                I'm drawn to problems where{' '}
                <span className="text-foreground">
                  messy operations meet code
                </span>
                —the kind where spreadsheets pile up, processes break down, and
                people waste hours on things that should be automated. Building
                systems that actually get used in production, not just demo'd,
                is what keeps me going.
              </p>

              {/* Paragraph 2: How I think / work */}
              <p>
                My approach is pragmatic:{' '}
                <span className="text-foreground">
                  ship fast, refactor later, document always
                </span>
                . I believe in readable code over clever code, and in
                understanding the problem deeply before writing the first line.
                Whether leading a team or working solo, I optimize for
                momentum—small wins compound.
              </p>

              {/* Paragraph 3: Where I'm going */}
              <p>
                Right now I'm finishing my studies while building production
                systems for real organizations. What's next?{' '}
                <span className="text-foreground">
                  Roles where I can own problems end-to-end
                </span>
                —from architecture decisions to shipping and iterating based on
                user feedback.
              </p>
            </div>

            {/* Philosophy divider */}
            <div className="mt-12 pt-8 border-t border-border/50">
              <p className="text-sm font-mono text-muted-foreground/60 italic">
                "Good systems disappear into the workflow. The best code is the
                code users never have to think about."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
