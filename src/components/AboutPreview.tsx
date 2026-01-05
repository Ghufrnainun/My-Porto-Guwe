import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Globe, Calendar } from 'lucide-react';
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
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        {/* Layout: Marginalia (Left Column Stats, Right Column Content) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Left Column: Marginalia / Stats */}
          <motion.div
            className="md:col-span-3 lg:col-span-3 flex flex-row md:flex-col gap-8 md:gap-12 border-t md:border-t-0 border-border md:border-r pt-8 md:pt-0 md:pr-8"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Numbering */}
            <div className="mb-6 md:mb-12">
              <p className="text-sm font-mono text-primary mb-2 tracking-wider uppercase">
                About Me
              </p>
              <span className="font-serif text-6xl md:text-8xl text-muted-foreground/20 font-bold leading-none select-none">
                02
              </span>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-secondary/50">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium font-mono">
                    Location
                  </p>
                  <p className="text-sm font-medium">Semarang, ID</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-secondary/50">
                  <Globe className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium font-mono">
                    Status
                  </p>
                  <p className="text-sm font-medium">Open to Work</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-secondary/50">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium font-mono">
                    Experience
                  </p>
                  <p className="text-sm font-medium">1+ Years</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Main Content */}
          <div className="md:col-span-9 lg:col-span-8 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 text-foreground">
                Passionate about{' '}
                <span className="italic text-muted-foreground">clean code</span>{' '}
                &{' '}
                <span className="italic text-muted-foreground">
                  user experience.
                </span>
              </h2>

              <div className="prose prose-lg text-muted-foreground/90 leading-relaxed font-sans max-w-2xl">
                <p className="mb-6">
                  I'm a Full Stack Developer located in Indonesia. I have a
                  serious passion for UI effects, animations and creating
                  intuitive, dynamic user experiences.
                </p>
                <p>
                  Currently leading a 5-person development team for my
                  polytechnic's official certification platform. My approach to
                  code is pragmatic: I value systems that scale and
                  architectures that are easy to maintain.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link
                to="/about"
                className="group inline-flex items-center gap-3 text-lg font-medium font-display text-primary hover:text-primary/80 transition-colors"
              >
                <span className="border-b border-primary/30 group-hover:border-primary transition-colors pb-1">
                  Read full story
                </span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
