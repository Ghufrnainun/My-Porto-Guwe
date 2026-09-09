import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { ProjectShowcase } from '@/components/ui/project-showcase';
import { MaskedHeading } from '@/components/ui/masked-heading';

const easeExpo = [0.16, 1, 0.3, 1] as const;

export function ProjectsPreview() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="projects" className="relative bg-transparent py-20 md:py-32">
      <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-24">
        {/* Section header bar with View All link */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: easeExpo }}
          className="mb-8 flex items-center justify-between border-b border-border/40 pb-6"
        >
          <div className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
              Selected Works
            </span>
          </div>

          <Link
            to="/projects"
            className="group inline-flex min-h-[44px] items-center gap-2 px-3 -mr-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground transition-colors duration-200 ease-out hover:text-primary active:scale-[0.96]"
            aria-label="View all projects"
          >
            View all
            <ArrowRight
              className="size-3.5 transition-transform duration-200 ease-out group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </Link>
        </motion.div>

        <MaskedHeading
          as="h2"
          text="Shipped, not sketched."
          className="mb-4 font-serif text-4xl font-bold leading-[0.95] tracking-tight text-foreground md:text-6xl"
          viewportMargin="-50px"
        />

        <motion.p
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.75, delay: shouldReduceMotion ? 0 : 0.16, ease: easeExpo }}
          className="mb-12 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty will-change-[transform,opacity,filter]"
        >
          Recent builds with real ownership: auth architecture, content systems,
          deployment flow, and UI delivery.
        </motion.p>

        {/* Minimalist Editorial Project Showcase */}
        <div className="w-full">
          <ProjectShowcase showTitle={false} />
        </div>
      </div>
    </section>
  );
}
