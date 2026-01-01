import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export function AboutPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="about"
      ref={ref}
      className="py-24 md:py-32 relative overflow-hidden bg-background"
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        {/* Section Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-muted-foreground font-mono text-sm mb-2">
            Who I Am
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            About Me
          </h2>
        </motion.div>

        {/* Preview Content */}
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-start gap-6 mb-8">
            <img
              src="Photo.png"
              alt="Ghufron A.N."
              className="w-20 h-20 rounded-full object-cover ring-2 ring-border flex-shrink-0"
            />
            <div>
              <h3 className="text-xl font-bold mb-1">Ghufron A.N.</h3>
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-4">
                <MapPin className="w-3.5 h-3.5" />
                <span>Semarang, ID</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                I build web applications that solve real operational problems.
                Currently leading a 5-person development team for my
                polytechnic's official certification platform. My approach to
                code is pragmatic: I value{' '}
                <span className="text-foreground font-medium">
                  clean architecture
                </span>
                ,{' '}
                <span className="text-foreground font-medium">tested code</span>
                , and{' '}
                <span className="text-foreground font-medium">
                  systems that scale
                </span>
                .
              </p>
            </div>
          </div>

          {/* CTA */}
          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors group"
          >
            Learn more about me
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
