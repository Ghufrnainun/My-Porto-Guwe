import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Globe, Calendar } from 'lucide-react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

export function AboutPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="about"
      ref={ref}
      className="relative bg-transparent py-16 md:py-24"
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        {/* Layout: Marginalia (Left Column Stats, Right Column Content) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Left Column: Marginalia / Stats */}
          <motion.div
            className="md:col-span-3 lg:col-span-3 flex flex-row md:flex-col gap-8 md:gap-12 border-t md:border-t-0 border-border md:border-r pt-8 md:pt-0 md:pr-8"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -15 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: shouldReduceMotion ? 0.2 : 0.6, delay: shouldReduceMotion ? 0.1 : 0.2 }}
          >
            {/* Section Header */}
            <div className="mb-6 md:mb-12">
              <p className="text-sm font-mono text-primary mb-2 tracking-wider uppercase">
                About Me
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 gap-4 w-full">
              {/* Stat 1 */}
              <div className="group bg-secondary/20 p-1.5 rounded-[1.5rem] border border-border/10">
                <div className="bg-card p-4 rounded-[calc(1.5rem-0.375rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border border-border/40 hover:border-primary/30 transition-all duration-500 ease-premium hover:translate-y-[-2px] hover:shadow-soft flex items-center gap-4">
                  <div className="p-2.5 rounded-md bg-secondary/80 text-primary group-hover:scale-110 transition-transform duration-500">
                    <MapPin className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                      Location
                    </p>
                    <p className="text-xs font-semibold text-foreground">Semarang, ID</p>
                  </div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="group bg-secondary/20 p-1.5 rounded-[1.5rem] border border-border/10">
                <div className="bg-card p-4 rounded-[calc(1.5rem-0.375rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border border-border/40 hover:border-primary/30 transition-all duration-500 ease-premium hover:translate-y-[-2px] hover:shadow-soft flex items-center gap-4">
                  <div className="p-2.5 rounded-md bg-secondary/80 text-primary group-hover:scale-110 transition-transform duration-500">
                    <Globe className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                      Status
                    </p>
                    <p className="text-xs font-semibold text-foreground">Open to Work</p>
                  </div>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="group bg-secondary/20 p-1.5 rounded-[1.5rem] border border-border/10">
                <div className="bg-card p-4 rounded-[calc(1.5rem-0.375rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border border-border/40 hover:border-primary/30 transition-all duration-500 ease-premium hover:translate-y-[-2px] hover:shadow-soft flex items-center gap-4">
                  <div className="p-2.5 rounded-md bg-secondary/80 text-primary group-hover:scale-110 transition-transform duration-500">
                    <Calendar className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                      Experience
                    </p>
                    <p className="text-xs font-semibold text-foreground">1+ Years</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Main Content */}
          <div className="md:col-span-9 lg:col-span-8 flex flex-col justify-center">
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: shouldReduceMotion ? 0.25 : 0.8, ease: [0.32, 0.72, 0, 1] }}
              className="mb-8"
            >
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 text-foreground leading-[1.05] tracking-tight text-wrap-pretty">
                Passionate about{' '}
                <span className="italic text-primary/80">clean code</span>{' '}
                and{' '}
                <span className="italic text-muted-foreground/80">
                  intuitive experiences.
                </span>
              </h2>

              <div className="prose prose-lg text-muted-foreground/90 leading-relaxed font-sans max-w-2xl text-wrap-pretty">
                <p className="mb-6 text-base md:text-lg">
                  I'm a Full Stack Developer located in Indonesia. I have a
                  serious passion for UI effects, animations, and creating
                  intuitive, dynamic user experiences.
                </p>
                <p className="text-base md:text-lg">
                  Currently leading a 5-person development team for my
                  polytechnic's official certification platform. My approach to
                  code is pragmatic: I value systems that scale and
                  architectures that are easy to maintain.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: shouldReduceMotion ? 0.25 : 0.8, delay: shouldReduceMotion ? 0.1 : 0.2, ease: [0.32, 0.72, 0, 1] }}
            >
              <Link
                to="/about"
                className="group inline-flex items-center gap-3 text-sm font-semibold font-display text-primary hover:text-primary/80 transition-colors uppercase tracking-widest"
              >
                <span className="border-b border-primary/20 group-hover:border-primary transition-all pb-1">
                  Read full story
                </span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
