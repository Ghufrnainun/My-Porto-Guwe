import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { featuredProjects } from '@/data/featuredProjects';
import ScrollStack, { ScrollStackItem } from './ScrollStack';
import {
  VariantSwitcher,
  UniversalProjectCard,
  CardVariantType,
} from './project-cards';

export function ProjectsPreview() {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramVariant = searchParams.get('v') as CardVariantType | null;
  const [variant, setVariant] = useState<CardVariantType>(
    paramVariant === '2' || paramVariant === '3' ? paramVariant : '1'
  );

  useEffect(() => {
    if (paramVariant && (paramVariant === '1' || paramVariant === '2' || paramVariant === '3')) {
      setVariant(paramVariant);
    }
  }, [paramVariant]);

  const handleVariantChange = (newVariant: CardVariantType) => {
    setVariant(newVariant);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('v', newVariant);
    setSearchParams(newParams, { replace: true });
  };

  return (
    <section id="projects" className="relative bg-transparent py-20 md:py-32">
      <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-24">
        {/* Section header bar with Variant Switcher & View All link */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-6">
          <div className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
              Featured Work
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <VariantSwitcher
              currentVariant={variant}
              onVariantChange={handleVariantChange}
            />

            <Link
              to={`/projects?v=${variant}`}
              className="group inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground transition-colors duration-300 hover:text-primary pl-2"
            >
              View all
              <ArrowRight
                className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                strokeWidth={1.5}
              />
            </Link>
          </div>
        </div>

        <h2 className="mb-4 font-serif text-4xl font-bold leading-[0.95] tracking-tight text-foreground md:text-6xl">
          Shipped, not sketched.
        </h2>

        <p className="mb-10 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty">
          Recent builds with real ownership: auth architecture, content systems,
          deployment flow, and UI delivery.
        </p>

        {/* Project stack */}
        <ScrollStack
          className="mt-8 md:mt-12"
          itemDistance={96}
          itemScale={0.035}
          itemStackDistance={36}
          stackPosition="18%"
          scaleEndPosition="8%"
          baseScale={0.88}
          rotationAmount={0}
          blurAmount={0}
          useWindowScroll
        >
          {featuredProjects.map((project, index) => (
            <ScrollStackItem key={`${project.slug}-${variant}`} zIndex={index + 1}>
              <UniversalProjectCard
                project={project}
                index={index}
                variant={variant}
              />
            </ScrollStackItem>
          ))}
        </ScrollStack>

        {/* Bottom border cap */}
        <div className="mt-20 border-t border-border/40" />
      </div>
    </section>
  );
}
