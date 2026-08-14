import {
  ArrowRight,
  ArrowUpRight,
  Github,
  LockKeyhole,
  Mail,
  Sparkles,
} from 'lucide-react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useScroll,
  useTransform,
} from 'framer-motion';
import { MouseEvent, ReactNode, useRef } from 'react';
import { Link } from 'react-router-dom';
import { featuredProjects } from '@/data/featuredProjects';
import { ProjectCover } from '@/components/ProjectCover';
import { useLenisScroll } from '@/hooks/useLenisScroll';

const ease = [0.32, 0.72, 0, 1] as const;

const navItems = [
  { href: '#intro', label: 'Intro' },
  { href: '#craft', label: 'Craft' },
  { href: '#work', label: 'Work' },
  { href: '#stack', label: 'Stack' },
  { href: '#contact', label: 'Contact' },
];

const craftCards = [
  {
    title: 'Auth flows that stay readable',
    text: 'I shape permission, session, and dashboard flows so teams can extend them without fear.',
    metric: '01',
    className: 'md:col-span-7 md:row-span-2',
  },
  {
    title: 'CMS surfaces with calm control',
    text: 'Admin tools stay dense, predictable, and fast for repeated work.',
    metric: '02',
    className: 'md:col-span-5',
  },
  {
    title: 'Interfaces with quiet motion',
    text: 'Motion gives direction and polish without stealing attention from the content.',
    metric: '03',
    className: 'md:col-span-5',
  },
  {
    title: 'Frontend systems that ship',
    text: 'React, Tailwind, and Laravel-backed products with sensible boundaries and measurable ownership.',
    metric: '04',
    className: 'md:col-span-12',
  },
];

const stackItems = [
  'Laravel',
  'React',
  'TypeScript',
  'Tailwind CSS',
  'Supabase',
  'MySQL',
  'Livewire',
  'Vite',
];

const motionTickerItems = [
  'Laravel',
  'React',
  'Framer Motion',
  'Lenis',
  'CMS',
  'Auth',
  'Dashboard',
  'API',
  'Deploy',
];

const fadeUp = {
  hidden: { opacity: 0, y: 42, filter: 'blur(10px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.08,
    },
  },
};

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={reduceMotion ? undefined : fadeUp}
      initial={reduceMotion ? false : 'hidden'}
      whileInView={reduceMotion ? undefined : 'visible'}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.78, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

function MagneticLink({
  href,
  children,
  variant = 'primary',
}: {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
}) {
  const isPrimary = variant === 'primary';

  return (
    <a
      href={href}
      className={`group inline-flex items-center gap-4 rounded-full px-3 py-2 pl-6 font-display text-xs font-bold uppercase tracking-[0.16em] outline-none transition-colors duration-500 ease-premium focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] ${
        isPrimary
          ? 'bg-white text-black hover:bg-white/90'
          : 'border border-white/15 bg-white/[0.045] text-white hover:border-primary/45 hover:text-primary'
      }`}
    >
      <span>{children}</span>
      <span
        className={`grid size-9 place-items-center rounded-full transition-transform duration-500 ease-premium group-hover:translate-x-1 group-hover:-translate-y-0.5 ${
          isPrimary ? 'bg-black/95 text-white' : 'bg-white/10'
        }`}
      >
        <ArrowRight className="size-4" strokeWidth={1.5} />
      </span>
    </a>
  );
}

function MotionTicker({
  items,
  reverse = false,
  emphasis = false,
}: {
  items: string[];
  reverse?: boolean;
  emphasis?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const loopItems = [...items, ...items];

  return (
    <div className="relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
      <motion.div
        className="flex min-w-max gap-3 pr-3"
        initial={reduceMotion ? false : { x: reverse ? '-50%' : '0%' }}
        animate={
          reduceMotion
            ? undefined
            : { x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }
        }
        transition={{
          duration: emphasis ? 16 : 22,
          ease: 'linear',
          repeat: Infinity,
        }}
      >
        {loopItems.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className={`rounded-full border px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] ${
              emphasis
                ? 'border-primary/30 bg-primary/15 text-primary shadow-[0_0_38px_-24px_hsl(var(--primary))]'
                : 'border-white/10 bg-white/[0.045] text-white/55'
            }`}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function ScrollProgressRail() {
  const { scrollYProgress } = useScroll();

  return (
    <div
      aria-hidden="true"
      className="fixed right-5 top-1/2 z-40 hidden h-40 w-px -translate-y-1/2 overflow-hidden rounded-full bg-white/10 lg:block"
    >
      <motion.div
        className="h-full w-full origin-top rounded-full bg-primary"
        style={{ scaleY: scrollYProgress }}
      />
    </div>
  );
}

function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 80, damping: 24, mass: 0.4 });
  const smoothY = useSpring(pointerY, { stiffness: 80, damping: 24, mass: 0.4 });
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, reduceMotion ? 0 : -72],
  );
  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, reduceMotion ? 0 : 92],
  );
  const imageScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, reduceMotion ? 1 : 1.08],
  );
  const stageOpacity = useTransform(scrollYProgress, [0, 0.74], [1, 0.18]);
  const imageX = useTransform(smoothX, [-1, 1], reduceMotion ? [0, 0] : [-18, 18]);
  const railX = useTransform(smoothX, [-1, 1], reduceMotion ? [0, 0] : [26, -26]);
  const railY = useTransform(smoothY, [-1, 1], reduceMotion ? [0, 0] : [-18, 18]);

  const handlePointerMove = (event: MouseEvent<HTMLElement>) => {
    if (reduceMotion) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      id="intro"
      ref={heroRef}
      onMouseMove={handlePointerMove}
      className="relative min-h-[100dvh] scroll-mt-24 overflow-hidden bg-[#050505] px-4 pb-16 pt-28 text-white md:px-8 md:pt-24 lg:px-12"
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ opacity: stageOpacity }}
      >
        <motion.div
          className="absolute -left-24 top-10 h-[34rem] w-[34rem] rounded-full bg-primary/20 blur-[110px]"
          animate={reduceMotion ? undefined : { scale: [1, 1.16, 1], opacity: [0.5, 0.86, 0.5] }}
          transition={{ duration: 7, repeat: Infinity, ease }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(255,255,255,0.08),transparent_30rem),linear-gradient(90deg,rgba(34,211,197,0.08),transparent_32%,rgba(255,255,255,0.035)_70%,transparent)]" />
        <motion.div
          className="absolute inset-y-0 right-[-8%] w-[62%] skew-x-[-10deg] bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.11)_0px,rgba(255,255,255,0.11)_1px,transparent_1px,transparent_64px)] opacity-30"
          style={{ x: railX, y: railY }}
        />
        <motion.div
          className="absolute bottom-0 left-0 h-48 w-full bg-[linear-gradient(180deg,transparent,rgba(5,5,5,0.92))]"
          animate={reduceMotion ? undefined : { opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 4.6, repeat: Infinity, ease }}
        />
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity: stageOpacity }}
        className="relative z-10 mx-auto max-w-[1500px]"
      >
        <div className="grid min-h-[78dvh] gap-8 lg:grid-cols-[0.58fr_0.42fr] lg:items-end">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="relative z-20"
          >
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.72, ease }}
              className="mb-8 flex flex-wrap items-center gap-3"
            >
              <span className="rounded-full border border-primary/40 bg-primary/15 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-primary shadow-[0_0_35px_-18px_hsl(var(--primary))]">
                Test motion build
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                Laravel / React / Systems
              </span>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.86, ease }}
              className="font-serif text-[clamp(4.6rem,13vw,13.8rem)] font-bold uppercase leading-[0.72] tracking-[-0.045em] text-white"
            >
              <span className="block">Ghufron</span>
              <span className="block pl-[0.12em] text-white/70">Ainun</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.82, ease }}
              className="mt-7 max-w-2xl text-base leading-8 text-white/58 md:text-lg md:leading-8"
            >
              Full-stack developer building web platforms, CMS
              systems, and motion-aware interfaces with Laravel, React, and
              code that stays simple on purpose.
            </motion.p>
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.78, ease }}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <MagneticLink href="#work">View work</MagneticLink>
              <MagneticLink href="#craft" variant="secondary">
                See craft
              </MagneticLink>
            </motion.div>
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.78, ease }}
              className="mt-10 grid max-w-2xl grid-cols-3 gap-2 border-y border-white/10 py-4"
            >
              {[
                ['Role', 'Full-stack'],
                ['Base', 'Semarang'],
                ['Focus', 'Web systems'],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-primary">
                    {label}
                  </p>
                  <p className="mt-1 font-display text-xs font-semibold uppercase tracking-[0.12em] text-white/80">
                    {value}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            aria-hidden="true"
            style={{ y: imageY, scale: imageScale, x: imageX }}
            className="relative z-10 hidden min-h-[680px] lg:block"
          >
            <motion.div
              className="absolute right-0 top-4 h-[650px] w-[455px] rotate-[4deg] rounded-[3.2rem] border border-primary/20 bg-white/[0.04] p-2 shadow-[0_80px_180px_-110px_hsl(var(--primary)/0.95)]"
              initial={reduceMotion ? false : { opacity: 0, y: 60, rotate: -2 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0, rotate: 4 }}
              transition={{ duration: 0.9, delay: 0.2, ease }}
            >
              <div className="relative h-full overflow-hidden rounded-[calc(3.2rem-0.5rem)] border border-white/10 bg-[#0a0a0a] shadow-[inset_0_1px_1px_rgba(255,255,255,0.16)]">
                <img
                  src="/Photo.webp"
                  alt=""
                  className="h-full w-full object-cover object-[50%_20%] grayscale-[25%] contrast-110 saturate-[0.86]"
                  width="1519"
                  height="2048"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,transparent,rgba(5,5,5,0.15)_46%,rgba(5,5,5,0.88)_100%)]" />
                <motion.div
                  className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/20 to-transparent"
                  animate={reduceMotion ? undefined : { y: [-90, 720] }}
                  transition={{ duration: 3.8, repeat: Infinity, ease }}
                />
              </div>
            </motion.div>
            <motion.div
              className="absolute bottom-20 left-0 w-[430px] -rotate-[4deg] rounded-[2.4rem] border border-primary/25 bg-[#070807]/90 p-2 shadow-[0_50px_130px_-70px_hsl(var(--primary)/0.8)]"
              initial={reduceMotion ? false : { opacity: 0, x: -64, y: 28 }}
              animate={reduceMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.82, delay: 0.42, ease }}
            >
              <div className="rounded-[calc(2.4rem-0.5rem)] border border-white/10 bg-white/[0.035] p-7 shadow-[inset_0_1px_1px_rgba(255,255,255,0.13)]">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                  <span>Build signal</span>
                  <span>Live preview</span>
                </div>
                <div className="mt-7 space-y-3">
                  {[
                    ['Architecture', 'Scalable'],
                    ['Interface motion', 'Framer-led'],
                    ['Delivery focus', 'Production'],
                  ].map(([label, value], index) => (
                    <div key={label}>
                      <div className="mb-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
                        <span>{label}</span>
                        <span className="text-primary">{value}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          className="h-full rounded-full bg-primary"
                          initial={reduceMotion ? false : { scaleX: 0 }}
                          animate={
                            reduceMotion
                              ? undefined
                              : { scaleX: [0.58, 0.9, 0.74, 0.96][index] }
                          }
                          transition={{ duration: 1, delay: 0.62 + index * 0.12, ease }}
                          style={{ transformOrigin: 'left' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            <motion.div
              className="absolute right-14 top-24 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-primary"
              animate={reduceMotion ? undefined : { y: [0, -12, 0], opacity: [0.72, 1, 0.72] }}
              transition={{ duration: 3.2, repeat: Infinity, ease }}
            >
              Open to work
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="relative z-20 mx-auto mt-8 max-w-[1500px] space-y-3 border-t border-white/10 pt-5"
        initial={reduceMotion ? false : { opacity: 0, y: 28 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7, ease }}
      >
        <MotionTicker items={motionTickerItems} emphasis />
        <MotionTicker items={[...motionTickerItems].reverse()} reverse />
      </motion.div>
    </section>
  );
}

function CraftSection() {
  return (
    <section id="craft" className="scroll-mt-24 px-4 py-28 md:px-8 md:py-40 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-16 max-w-4xl">
          <p className="mb-5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
            Craft system
          </p>
          <h2 className="font-serif text-5xl font-bold leading-[0.94] tracking-tight text-foreground md:text-7xl">
            Premium motion works best when structure already feels solid.
          </h2>
        </Reveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10% 0px' }}
          className="grid grid-flow-dense gap-5 md:grid-cols-12"
        >
          {craftCards.map((card) => (
            <motion.article
              key={card.title}
              variants={fadeUp}
              transition={{ duration: 0.78, ease }}
              className={card.className}
            >
              <div className="group h-full rounded-[2rem] border border-foreground/10 bg-foreground/[0.035] p-1.5">
                <div className="flex h-full min-h-[250px] flex-col justify-between rounded-[calc(2rem-0.375rem)] border border-foreground/10 bg-card p-7 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] md:p-9">
                  <div className="flex items-start justify-between gap-8">
                    <h3 className="max-w-xl font-serif text-3xl font-bold leading-[0.98] text-foreground md:text-5xl">
                      {card.title}
                    </h3>
                    <span className="font-mono text-xs text-primary">
                      {card.metric}
                    </span>
                  </div>
                  <p className="mt-10 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
                    {card.text}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function WorkSection() {
  return (
    <section
      id="work"
      className="relative scroll-mt-24 overflow-hidden px-4 py-28 md:px-8 md:py-40 lg:px-12"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-24 h-[36rem] bg-[radial-gradient(circle_at_52%_20%,hsl(var(--primary)/0.18),transparent_32rem)]"
      />
      <div className="container relative z-10 mx-auto max-w-7xl px-0">
        <motion.div
          initial={{ opacity: 0, y: 34, filter: 'blur(12px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-12% 0px' }}
          transition={{ duration: 0.8, ease }}
          className="mb-14 flex flex-col gap-7 md:mb-20 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <span className="inline-flex w-fit rounded-full border border-primary/25 bg-primary/10 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
              Selected works
            </span>
            <h2 className="mt-6 max-w-3xl font-serif text-5xl font-bold leading-[0.95] tracking-tight text-white md:text-7xl md:leading-[0.9]">
              Projects with more depth.
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-base leading-8 text-white/55 md:text-lg">
              Recent builds with real ownership: auth architecture, content
              systems, deployment flow, and UI delivery.
            </p>
            <Link
              to="/projects"
              className="group mt-7 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 pl-5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white outline-none transition-colors duration-500 ease-premium hover:border-primary/30 hover:bg-white/[0.07] focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98]"
            >
              View all
              <span className="grid size-8 place-items-center rounded-full bg-white/10 text-primary transition-transform duration-700 ease-premium group-hover:translate-x-1">
                <ArrowRight className="size-3.5" strokeWidth={1.5} />
              </span>
            </Link>
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-x-0 lg:gap-y-16">
          {featuredProjects.map((project, index) => {
            const isLeft = index % 2 === 0;

            return (
              <motion.article
                key={project.title}
                initial={{
                  opacity: 0,
                  y: 56,
                  filter: 'blur(14px)',
                  rotate: isLeft ? -1.4 : 1.4,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  rotate: isLeft ? -0.8 : 0.8,
                }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.85, delay: index * 0.12, ease }}
                whileHover={{ y: -14, rotate: 0, scale: 1.015 }}
                className={`group relative ${
                  isLeft
                    ? 'lg:translate-x-2 lg:translate-y-8'
                    : 'lg:-translate-x-2 lg:-translate-y-4'
                }`}
                style={{ zIndex: featuredProjects.length - index }}
              >
                <div className="rounded-[2.4rem] border border-white/10 bg-white/[0.055] p-2 shadow-[0_45px_130px_-78px_hsl(var(--primary)/0.75)] transition-transform duration-700 ease-premium group-hover:-translate-y-3 group-hover:rotate-0">
                  <div className="overflow-hidden rounded-[calc(2.4rem-0.5rem)] border border-white/10 bg-card shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]">
                    <a
                      href={project.demo || project.repository || `/projects/${project.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.title} project preview`}
                      className="relative block aspect-[4/3] w-full overflow-hidden text-left outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <ProjectCover
                        project={project}
                        className="absolute inset-0 size-full object-cover transition-transform duration-1000 ease-premium group-hover:scale-105"
                      />
                      <div
                        className="absolute inset-0 opacity-60 mix-blend-screen"
                        style={{
                          background: `radial-gradient(circle at 80% 15%, ${project.color}55, transparent 34%)`,
                        }}
                      />
                      <motion.div
                        aria-hidden="true"
                        className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/25 to-transparent opacity-0 group-hover:opacity-100"
                        animate={{ y: ['-120%', '520%'] }}
                        transition={{
                          duration: 2.6,
                          repeat: Infinity,
                          ease,
                        }}
                      />
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/90 to-transparent" />
                      <span className="absolute left-5 top-5 rounded-full border border-white/15 bg-background/45 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/80">
                        /{String(index + 1).padStart(2, '0')}
                      </span>
                    </a>

                    <div className="p-6 md:p-7">
                      <div className="flex items-start justify-between gap-5">
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                            {project.role}
                          </p>
                          <h3 className="mt-3 font-serif text-3xl font-bold leading-[0.98] text-white md:text-4xl">
                            {project.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          {project.repository && (
                            <a
                              href={project.repository}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${project.title} GitHub`}
                              className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-white/70 outline-none transition-colors duration-500 ease-premium hover:border-primary/30 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98]"
                            >
                              <Github className="size-4" strokeWidth={1.35} />
                            </a>
                          )}
                          {project.visibility === 'private' && (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-white/55">
                              <LockKeyhole className="size-3" />
                              Private repository
                            </span>
                          )}
                          {project.demo && (
                            <a
                              href={project.demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${project.title} live demo`}
                              className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-white/70 outline-none transition-colors duration-500 ease-premium hover:border-primary/30 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98]"
                            >
                              <ArrowUpRight className="size-4" strokeWidth={1.35} />
                            </a>
                          )}
                        </div>
                      </div>

                      <p className="mt-5 text-sm leading-7 text-white/55">
                        {project.summary}
                      </p>

                      <div className="mt-6 flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-white/50"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="mt-7 font-mono text-[10px] uppercase tracking-[0.18em] text-white/42">
                        {project.team.label} / {project.year}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StackSection() {
  return (
    <section id="stack" className="scroll-mt-24 overflow-hidden px-4 py-28 md:px-8 md:py-40 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <Reveal className="grid gap-10 lg:grid-cols-[0.8fr_1fr] lg:items-end">
          <div>
            <p className="mb-5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
              Stack rhythm
            </p>
            <h2 className="font-serif text-5xl font-bold leading-[0.94] md:text-7xl">
              Tools move in support of the product.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
            The stack stays recognizable, but the presentation leans into
            editorial pacing: readable first, animated second.
          </p>
        </Reveal>

        <div className="mt-16 space-y-4 rounded-[2.5rem] border border-white/10 bg-white/[0.025] p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] md:p-6">
          <MotionTicker items={stackItems} emphasis />
          <MotionTicker items={[...stackItems].reverse()} reverse />
          <MotionTicker
            items={[
              'REST API',
              'Auth',
              'CMS',
              'RLS',
              'SEO',
              'Deployment',
              'Team Lead',
              'UI Motion',
            ]}
            emphasis
          />
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-24 px-4 py-28 md:px-8 md:py-40 lg:px-12">
      <Reveal>
        <div className="mx-auto max-w-7xl rounded-[3rem] border border-primary/20 bg-primary/10 p-2">
          <div className="rounded-[calc(3rem-0.5rem)] border border-white/10 bg-foreground p-8 text-background shadow-[inset_0_1px_1px_rgba(255,255,255,0.18)] md:p-14 lg:p-18">
            <div className="grid gap-10 lg:grid-cols-[1fr_0.55fr] lg:items-end">
              <div>
                <p className="mb-6 inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
                  <Sparkles className="size-3.5" strokeWidth={1.5} />
                  Available for serious builds
                </p>
                <h2 className="max-w-5xl font-serif text-5xl font-bold leading-[0.9] tracking-tight md:text-7xl lg:text-8xl">
                  Let&apos;s make the interface feel inevitable.
                </h2>
              </div>
              <div className="flex flex-col gap-4">
                <a
                  href="mailto:ghufrnainunajib@gmail.com"
                  className="group inline-flex w-fit items-center gap-4 rounded-full bg-background px-3 py-2 pl-6 font-display text-xs font-bold uppercase tracking-[0.16em] text-foreground outline-none transition-colors duration-500 hover:bg-background/90 focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98]"
                >
                  Start a conversation
                  <span className="grid size-10 place-items-center rounded-full bg-foreground/10 transition-transform duration-500 ease-premium group-hover:translate-x-1 group-hover:-translate-y-0.5">
                    <Mail className="size-4" strokeWidth={1.5} />
                  </span>
                </a>
                <Link
                  to="/"
                  className="w-fit font-mono text-xs uppercase tracking-[0.18em] text-background/60 outline-none transition-colors duration-300 hover:text-background focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Back to original home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default function TestAnimate() {
  useLenisScroll();

  return (
    <main className="dark min-h-screen w-full max-w-full overflow-x-hidden bg-[#050505] text-white">
      <ScrollProgressRail />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_18%_10%,hsl(var(--primary)/0.14),transparent_32rem),radial-gradient(circle_at_82%_26%,hsl(var(--foreground)/0.08),transparent_30rem),linear-gradient(180deg,hsl(var(--background)),hsl(var(--background)))]"
      />
      <nav className="fixed left-1/2 top-5 z-40 hidden -translate-x-1/2 rounded-full border border-foreground/10 bg-background/75 px-2 py-2 shadow-[0_24px_80px_-60px_hsl(var(--foreground)/0.45)] backdrop-blur-xl md:block">
        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground outline-none transition-colors duration-300 hover:bg-foreground/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
      <div className="relative z-10">
        <Hero />
        <CraftSection />
        <WorkSection />
        <StackSection />
        <ContactSection />
      </div>
    </main>
  );
}
