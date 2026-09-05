import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Github } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { featuredProjects } from '@/data/featuredProjects';
import {
  VariantSwitcher,
  UniversalProjectCard,
  CardVariantType,
} from './project-cards';

export function Projects({
  className = '',
  initialVariant,
}: {
  className?: string;
  initialVariant?: CardVariantType;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramVariant = searchParams.get('v') as CardVariantType | null;

  const [variant, setVariant] = useState<CardVariantType>(() => {
    if (initialVariant) return initialVariant;
    if (paramVariant === '1' || paramVariant === '2' || paramVariant === '3') {
      return paramVariant;
    }
    return '1';
  });

  useEffect(() => {
    if (initialVariant) {
      setVariant(initialVariant);
    } else if (paramVariant && (paramVariant === '1' || paramVariant === '2' || paramVariant === '3')) {
      setVariant(paramVariant);
    }
  }, [initialVariant, paramVariant]);

  const handleVariantChange = (newVariant: CardVariantType) => {
    setVariant(newVariant);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('v', newVariant);
    setSearchParams(newParams, { replace: true });
  };

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="projects"
      className={`py-16 md:py-28 bg-background relative overflow-hidden ${className}`}
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        {/* Section Header with Live Variant Switcher */}
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-border/40 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="size-2 rounded-full bg-primary" />
              <p className="text-primary font-mono text-[11px] tracking-widest uppercase font-semibold">
                Portfolio Showcase
              </p>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              Selected Projects
            </h2>
          </div>

          <div className="flex items-center">
            <VariantSwitcher
              currentVariant={variant}
              onVariantChange={handleVariantChange}
            />
          </div>
        </div>

        {/* Projects Container */}
        <div ref={ref} className="flex flex-col gap-14 md:gap-24">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={`${project.title}-${variant}`}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="w-full"
            >
              <UniversalProjectCard
                project={project}
                index={index}
                variant={variant}
              />
            </motion.div>
          ))}
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
