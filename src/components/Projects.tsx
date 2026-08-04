import { Github } from 'lucide-react';
import { ProjectCard } from './ProjectCard';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { featuredProjects } from '@/data/featuredProjects';

export function Projects({ className = '' }: { className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="projects"
      className={`py-20 md:py-32 bg-background relative overflow-hidden ${className}`}
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        {/* Section Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Section Header */}
          <div className="mb-2">
            <p className="text-primary font-mono text-sm mb-2 tracking-wider uppercase">
              What I've Built
            </p>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Featured Projects
          </h2>
        </motion.div>

        {/* Projects Container (Simple Modern Layout) */}
        <div ref={ref} className="flex flex-col gap-12 md:gap-20">
          {featuredProjects.map((project, index) => (
            <div key={project.title} className="w-full">
              <ProjectCard project={project} index={index} />
            </div>
          ))}
        </div>

        {/* GitHub CTA */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <a
            href="https://github.com/Ghufrnainun"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary font-mono text-sm transition-colors"
          >
            <span>View More on GitHub</span>
            <Github className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
