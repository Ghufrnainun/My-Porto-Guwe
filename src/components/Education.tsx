'use client';

import { useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import {
  ShieldCheck,
  Globe,
  Check,
  GraduationCap,
  Calendar,
  MapPin,
  ArrowUpRight,
  Copy,
  ExternalLink,
  Database,
  Network,
} from 'lucide-react';
import {
  education,
  organizationExperience,
  certifications,
  profile,
} from '@/data/profile';
import { MaskedHeading } from '@/components/ui/masked-heading';
import { cn } from '@/lib/utils';

const easeExpo = [0.16, 1, 0.3, 1] as const;

// ─── Animated GPA Number ─────────────────────────────────────────────────────
function AnimatedGPA({ value, isInView }: { value: number; isInView: boolean }) {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <>{value.toFixed(2)}</>;

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.01 }}
    >
      <CountUp from={0} to={value} duration={1.4} delay={0.35} decimals={2} isInView={isInView} />
    </motion.span>
  );
}

function CountUp({
  from,
  to,
  duration,
  delay,
  decimals,
  isInView,
}: {
  from: number;
  to: number;
  duration: number;
  delay: number;
  decimals: number;
  isInView: boolean;
}) {
  const [display, setDisplay] = useState(from.toFixed(decimals));
  const hasRun = useRef(false);

  if (isInView && !hasRun.current) {
    hasRun.current = true;
    const start = performance.now() + delay * 1000;
    const step = (now: number) => {
      if (now < start) { requestAnimationFrame(step); return; }
      const elapsed = now - start;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplay((from + (to - from) * eased).toFixed(decimals));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  return <>{display}</>;
}

// ─── Org Experience Item — per-item scroll reveal ────────────────────────────
function OrgExpItem({
  exp,
  isCurrentHovered,
  onEnter,
  onLeave,
}: {
  exp: (typeof organizationExperience)[0];
  isCurrentHovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  // Each card gets its own InView — reveals independently on scroll
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.article
      ref={ref}
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16, filter: 'blur(4px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.6, ease: easeExpo }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={cn(
        'group relative rounded-xl p-4 sm:p-5 transition-all duration-200 cursor-default border',
        isCurrentHovered
          ? 'bg-secondary/35 dark:bg-white/[0.04] border-border/70 dark:border-white/12 shadow-[0_4px_20px_rgba(0,0,0,0.04)]'
          : 'border-transparent hover:bg-secondary/20 hover:border-border/40'
      )}
    >
      {/* Timeline Waypoint Node — precisely centered on the 2px rail */}
      <div className="pointer-events-none absolute -left-[25px] sm:-left-[33px] top-[24px] sm:top-[28px] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <motion.span
          aria-hidden="true"
          initial={shouldReduceMotion ? { scale: 1, opacity: 1 } : { scale: 0.6, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.6, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          className={cn(
            'size-3 rounded-full border-2 border-background transition-all duration-200',
            isCurrentHovered
              ? 'bg-primary scale-125 ring-4 ring-primary/25 shadow-[0_0_10px_rgba(235,94,40,0.6)]'
              : 'bg-muted-foreground/45 group-hover:bg-primary/80'
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:gap-6">
        {/* Left col */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.12, ease: easeExpo }}
          className="space-y-1.5 sm:col-span-4"
        >
          <span className="inline-flex items-center gap-1.5 font-mono text-xs tabular-nums text-muted-foreground">
            <Calendar className="size-3 text-muted-foreground/80" />
            {exp.period}
          </span>

          <p className="font-serif text-base font-bold text-foreground sm:text-lg leading-snug">
            {exp.organization}
          </p>

          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            {exp.badge && (
              <span
                className={cn(
                  'inline-flex items-center rounded-md px-2.5 py-0.5 font-mono text-[10px] font-semibold tracking-wide uppercase',
                  exp.badge === 'Division Head'
                    ? 'border border-primary/30 bg-primary/10 text-primary'
                    : 'border border-border/70 bg-secondary/70 text-foreground/80'
                )}
              >
                {exp.badge}
              </span>
            )}
            {exp.category && (
              <span className="inline-flex items-center rounded-md border border-border/60 bg-secondary/60 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                {exp.category}
              </span>
            )}
          </div>
        </motion.div>

        {/* Right col */}
        <div className="space-y-3 sm:col-span-8">
          <motion.h4
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.16, ease: easeExpo }}
            className={cn(
              'font-serif text-lg font-bold leading-snug sm:text-xl tracking-tight transition-colors duration-200',
              isCurrentHovered ? 'text-primary' : 'text-foreground'
            )}
          >
            {exp.role}
          </motion.h4>

          {/* Bullet points — each reveals one-by-one */}
          <ul className="space-y-2.5">
            {exp.responsibilities.map((resp, ri) => (
              <motion.li
                key={resp}
                initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.45,
                  delay: 0.2 + ri * 0.1,
                  ease: easeExpo,
                }}
                className="flex items-center gap-3 text-sm leading-relaxed"
              >
                {/* Dot — refined terracotta waypoint */}
                <span
                  aria-hidden="true"
                  className="size-1.5 shrink-0 rounded-full bg-primary/70 transition-transform duration-200 group-hover:scale-125"
                />
                <span className="text-foreground/85 font-sans leading-relaxed">{resp}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export function Education() {
  const shouldReduceMotion = useReducedMotion();

  // Per-chapter InView refs — each chapter scrolls in independently
  const headerRef = useRef<HTMLElement>(null);
  const ch1Ref = useRef<HTMLDivElement>(null);
  const ch2Ref = useRef<HTMLDivElement>(null);
  const ch3Ref = useRef<HTMLDivElement>(null);

  const headerInView = useInView(headerRef, { once: true, margin: '-60px' });
  const ch1InView = useInView(ch1Ref, { once: true, margin: '-80px' });
  const ch2InView = useInView(ch2Ref, { once: true, margin: '-80px' });
  const ch3InView = useInView(ch3Ref, { once: true, margin: '-80px' });

  // Focus dimming state for the organization timeline
  const [hoveredExpIndex, setHoveredExpIndex] = useState<number | null>(null);

  // GPA calculation
  const gpaValue = parseFloat(education.gpa.split('/')[0]) || 3.91;
  const gpaMax = parseFloat(education.gpa.split('/')[1]) || 4.0;

  return (
    <section
      id="education"
      className="relative bg-background py-20 md:py-32"
    >
      <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-24">
        <div className="mx-auto max-w-4xl space-y-16 md:space-y-24">

          {/* ================================================================ */}
          {/* Section Header: Masked Reveal                                    */}
          {/* ================================================================ */}
          <header ref={headerRef} className="border-b border-border/50 pb-8">
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: easeExpo }}
              className="mb-3 flex items-center gap-2"
            >
              <motion.span
                className="size-2 rounded-full bg-primary"
                animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-primary">
                Academic &amp; Experience
              </p>
            </motion.div>

            <MaskedHeading
              as="h2"
              text="Foundations, organization, and credentials."
              className="mb-4 font-serif text-3xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl"
              viewportMargin="-60px"
            />

            <motion.p
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16, filter: 'blur(4px)' }}
              animate={headerInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.65, delay: 0.18, ease: easeExpo }}
              className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg will-change-[transform,opacity,filter] [text-wrap:pretty]"
            >
              Where computer engineering coursework connects with organization work,
              hardware maintenance, and verified technical competencies.
            </motion.p>
          </header>

          {/* ================================================================ */}
          {/* Chapter I: Academic Foundation                                   */}
          {/* ================================================================ */}
          <div ref={ch1Ref}>
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
              animate={ch1InView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, ease: easeExpo }}
              className="group relative rounded-2xl border border-border/80 bg-card/60 p-6 sm:p-8 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-card/85 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:bg-white/[0.02] dark:hover:bg-white/[0.04]"
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  animate={ch1InView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2, ease: easeExpo }}
                  className="flex items-start gap-4"
                >
                  <motion.div
                    animate={ch1InView ? { scale: [0.7, 1.1, 1], opacity: [0, 1] } : { scale: 0.7, opacity: 0 }}
                    transition={{ duration: 0.55, delay: 0.25, ease: easeExpo }}
                    className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-secondary/80 text-foreground transition-transform duration-300 group-hover:scale-105"
                  >
                    <GraduationCap className="size-6 text-primary" />
                  </motion.div>
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground/90">{education.university}</span>
                      <span className="text-border">·</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3 text-muted-foreground" />
                        Semarang, ID
                      </span>
                    </div>
                    <h3 className="font-serif text-xl font-bold tracking-tight text-foreground sm:text-2xl pt-0.5">
                      {education.degree}
                    </h3>
                    <p className="font-mono text-xs text-muted-foreground">
                      {education.period} · Expected graduation: {education.expectedGraduation}
                    </p>
                  </div>
                </motion.div>

                {/* GPA Widget */}
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                  animate={ch1InView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.28, ease: easeExpo }}
                  className="shrink-0 self-start rounded-xl border border-border/70 bg-secondary/40 px-5 py-3 sm:px-6 sm:py-3.5 dark:border-white/10 dark:bg-white/[0.03]"
                >
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-mono text-3xl font-bold tabular-nums tracking-tight text-foreground sm:text-4xl">
                      <AnimatedGPA value={gpaValue} isInView={ch1InView} />
                    </span>
                    <span className="font-mono text-sm text-muted-foreground/70">
                      / {gpaMax.toFixed(2)}
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Core Curriculum Focus Chips */}
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                animate={ch1InView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.36, ease: easeExpo }}
                className="mt-6 border-t border-border/50 pt-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <span className="shrink-0 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Core Engineering Focus:
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {education.focusAreas.map((area, i) => (
                      <motion.span
                        key={area}
                        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                        animate={ch1InView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.4, delay: 0.42 + i * 0.06, ease: easeExpo }}
                        className="inline-flex items-center rounded-lg border border-border/60 bg-secondary/60 px-3 py-1 font-mono text-xs text-foreground/85 transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-secondary hover:text-foreground"
                      >
                        {area}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* ================================================================ */}
          {/* Chapter II: Organization (Connected Timeline)                    */}
          {/* ================================================================ */}
          <div ref={ch2Ref} className="space-y-8">
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={ch2InView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, ease: easeExpo }}
              className="flex items-baseline justify-between border-b border-border/40 pb-3"
            >
              <MaskedHeading
                as="h3"
                text="Organization"
                className="font-mono text-sm font-semibold uppercase tracking-widest text-foreground"
                viewportMargin="-80px"
                stagger={0.04}
              />
            </motion.div>

            {/* Editorial Journey Rail */}
            <div className="relative border-l-2 border-border/60 pl-6 sm:pl-8 space-y-6 my-2 dark:border-white/15">
              <motion.div
                aria-hidden="true"
                initial={{ scaleY: 0, originY: 0 }}
                animate={ch2InView ? { scaleY: 1 } : {}}
                transition={{ duration: 1.2, delay: 0.1, ease: easeExpo }}
                className="pointer-events-none absolute -left-[2px] top-0 h-full w-[2px] origin-top bg-gradient-to-b from-primary via-primary/50 to-primary/10"
              />

              {organizationExperience.map((exp, index) => (
                <OrgExpItem
                  key={`${exp.organization}-${exp.role}`}
                  exp={exp}
                  isCurrentHovered={hoveredExpIndex === index}
                  onEnter={() => setHoveredExpIndex(index)}
                  onLeave={() => setHoveredExpIndex(null)}
                />
              ))}
            </div>
          </div>

          {/* ================================================================ */}
          {/* Chapter III: Credentials                                          */}
          {/* ================================================================ */}
          <div ref={ch3Ref} className="space-y-6">
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={ch3InView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, ease: easeExpo }}
              className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border/40 pb-3"
            >
              <MaskedHeading
                as="h3"
                text="Credentials"
                className="font-mono text-sm font-semibold uppercase tracking-widest text-foreground"
                viewportMargin="-80px"
                stagger={0.04}
              />
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-[32px] items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors duration-200 hover:text-primary"
              >
                <span>Full list on LinkedIn</span>
                <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </motion.div>

            <ul className="space-y-0">
              {certifications.map((cert, i) => (
                <motion.li
                  key={cert.title}
                  initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  animate={ch3InView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.08 + i * 0.06, ease: easeExpo }}
                  className="flex flex-col gap-1 border-b border-border/30 py-3 last:border-b-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                >
                  <div className="min-w-0">
                    <span className="font-serif text-base font-bold text-foreground">{cert.title}</span>
                    <span className="font-sans text-sm text-muted-foreground"> — {cert.issuer}</span>
                  </div>

                  <div className="flex shrink-0 items-center gap-3 font-mono text-xs tabular-nums text-muted-foreground">
                    {cert.credentialId && (
                      <span className="text-[11px]">ID {cert.credentialId}</span>
                    )}
                    {cert.score && <span className="text-[11px]">{cert.score}</span>}
                    <span className="text-[11px] font-semibold text-foreground/80">{cert.year}</span>
                    {cert.verificationUrl && (
                      <a
                        href={cert.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
                      >
                        verify
                        <ExternalLink className="size-3" />
                      </a>
                    )}
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
