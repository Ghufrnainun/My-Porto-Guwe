import { Link } from 'react-router-dom';
import { ArrowRight, Braces, Database, MapPin } from 'lucide-react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

const ease = [0.32, 0.72, 0, 1] as const;

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
};

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.72, ease },
  },
};

const phraseVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.08 + i * 0.1, ease },
  }),
};

const proof = [
  ['Backend', 'Auth, APIs, data flow, deployment path'],
  ['Frontend', 'Responsive layout, motion timing, interaction states'],
  ['Now', 'Shipping a certification platform with a small team'],
];

export function AboutPreview() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="about" className="relative overflow-hidden bg-transparent px-4 py-24 md:py-32">
      <motion.div
        className="container mx-auto max-w-7xl"
        variants={sectionVariants}
        initial={reduceMotion ? false : 'hidden'}
        whileInView={reduceMotion ? undefined : 'visible'}
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <motion.div variants={revealVariants} className="lg:col-span-8">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <MapPin className="size-4 text-primary" strokeWidth={1.5} />
              <span>Semarang, Indonesia</span>
            </div>

            <h2 className="mt-8 text-balance font-serif text-[clamp(2.7rem,5.4vw,5.6rem)] leading-[1.04] tracking-tight text-foreground">
              <motion.span custom={0} variants={phraseVariants} className="block">
                Backend logic that
              </motion.span>
              <motion.span custom={1} variants={phraseVariants} className="block text-primary md:pl-[12vw]">
                scales.
              </motion.span>
              <motion.span custom={2} variants={phraseVariants} className="block text-foreground/75">
                Interfaces that feel alive.
              </motion.span>
            </h2>
          </motion.div>

          <motion.div variants={revealVariants} className="lg:col-span-4 lg:pt-16">
            <p className="max-w-xl text-pretty text-lg leading-8 text-foreground/86">
              I turn messy product workflows into maintainable APIs, clear screens, and interactions people can operate without thinking twice.
            </p>

            <Link
              to="/about"
              className="group mt-8 inline-flex min-h-11 w-fit items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-5 py-2.5 font-display text-sm font-semibold text-primary transition-[background-color,border-color,transform] duration-200 ease-out hover:border-primary/45 hover:bg-primary/10 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span>Read full story</span>
              <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 transition-transform duration-200 ease-out group-hover:translate-x-1">
                <ArrowRight className="size-4" strokeWidth={1.5} />
              </span>
            </Link>
          </motion.div>

          <motion.div variants={revealVariants} className="lg:col-span-12">
            <div className="grid grid-cols-1 border-y border-border/70 md:grid-cols-3">
              {proof.map(([label, value], index) => (
                <div
                  key={label}
                  className="flex min-h-36 flex-col justify-between gap-8 border-b border-border/70 py-6 md:border-b-0 md:px-6 first:md:pl-0 last:md:pr-0 md:[&:not(:last-child)]:border-r"
                >
                  <div className="flex items-center justify-between gap-4">
                    {index === 0 ? (
                      <Database className="size-5 text-primary" strokeWidth={1.5} />
                    ) : (
                      <Braces className="size-5 text-primary" strokeWidth={1.5} />
                    )}
                    <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground/60">
                      {label}
                    </span>
                  </div>
                  <p className="max-w-sm text-pretty text-sm leading-7 text-muted-foreground">{value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
