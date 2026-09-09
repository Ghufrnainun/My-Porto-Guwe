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
            className="inline-flex items-center gap-2.5 rounded-full border border-border/50 bg-secondary/30 px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:border-primary/40 hover:text-primary transition-[transform,border-color,color] duration-200 ease-out hover:scale-105 active:scale-[0.97]"
          >
            <span>Explore More on GitHub</span>
            <Github className="size-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
