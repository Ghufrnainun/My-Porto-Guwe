import { Github } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProjectShowcase } from '@/components/ui/project-showcase';

export function Projects({ className = '' }: { className?: string }) {
  return (
    <section
      id="projects"
      className={`py-16 md:py-28 bg-background relative ${className}`}
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        <div className="mb-14 border-b border-border/40 pb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="size-2 rounded-full bg-primary" />
            <p className="text-primary font-mono text-[11px] tracking-widest uppercase font-semibold">
              Portfolio Showcase
            </p>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            Selected Projects
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            A curated index of production applications, backend architectures, and open-source software systems.
          </p>
        </div>

        {/* Minimalist Editorial Project Showcase */}
        <div className="w-full">
          <ProjectShowcase showTitle={false} />
        </div>

        {/* GitHub CTA */}
        <motion.div
          className="text-center mt-24 pt-12 border-t border-border/30"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <a
            href="https://github.com/Ghufrnainun"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full border border-border/50 bg-secondary/30 px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:border-primary/40 hover:text-primary transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <span>Explore More on GitHub</span>
            <Github className="size-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
