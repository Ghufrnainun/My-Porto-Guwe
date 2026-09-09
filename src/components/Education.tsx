'use client';

import { useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import {
  Award,
  Code2,
  Globe,
  Check,
  GraduationCap,
  Calendar,
  MapPin,
  ArrowUpRight,
  Copy,
  ExternalLink,
  Database,
  Server,
  Network,
  Cpu,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  education,
  organizationExperience,
  certifications,
  credentialDomains,
  type CredentialDomain,
  type Certification,
} from '@/data/profile';
import { MaskedHeading } from '@/components/ui/masked-heading';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
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

// ─── Icon Resolver for Credentials ───────────────────────────────────────────
function getCertIcon(cert: Certification) {
  if (cert.title.includes('MikroTik') || cert.title.includes('MTCRE')) return Network;
  if (cert.title.includes('TEPPS')) return Globe;
  if (cert.domain === 'database') return Database;
  if (cert.domain === 'cloud') return Server;
  if (cert.domain === 'ai-data') return Cpu;
  if (cert.domain === 'flagship') return ShieldCheck;
  return Code2;
}

// ─── Interactive Credential Card ─────────────────────────────────────────────
function CertCard({
  cert,
  index,
  isInView,
  isCurrentHovered,
  isOtherHovered,
  onEnter,
  onLeave,
  onClick,
}: {
  cert: Certification;
  index: number;
  isInView: boolean;
  isCurrentHovered: boolean;
  isOtherHovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const Icon = getCertIcon(cert);

  return (
    <motion.div
      key={cert.title}
      layout="position"
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
      transition={{
        duration: 0.35,
        delay: Math.min(index * 0.04, 0.3),
        ease: easeExpo,
      }}
      whileHover={shouldReduceMotion ? {} : { y: -2 }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-haspopup="dialog"
      aria-label={`View accreditation details for ${cert.title}`}
      className={cn(
        'group relative flex flex-col justify-between rounded-2xl border p-5 sm:p-6 cursor-pointer select-none text-left',
        'transition-[transform,border-color,background-color,box-shadow] duration-150 ease-out active:scale-[0.98]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        isCurrentHovered
          ? 'border-primary/50 bg-secondary/60 dark:bg-white/[0.05] shadow-[0_10px_28px_rgba(0,0,0,0.06)]'
          : 'border-border/70 bg-card/40 dark:border-white/10 dark:bg-white/[0.02] hover:border-border hover:bg-secondary/30',
        isOtherHovered ? 'opacity-40' : 'opacity-100'
      )}
    >
      <div>
        {/* Top bar: Domain Icon + Status indicator */}
        <div className="mb-4 flex items-center justify-between gap-2">
          <div
            className={cn(
              'flex size-9 items-center justify-center rounded-xl border transition-colors duration-150',
              isCurrentHovered
                ? 'border-primary/40 bg-primary/15 text-primary'
                : 'border-border/70 bg-secondary text-foreground/80'
            )}
          >
            <Icon className="size-4.5 stroke-[2]" />
          </div>

          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground transition-colors duration-150 group-hover:text-primary">
            <span>Details</span>
            <ArrowUpRight className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>

        <h4 className="font-serif text-base font-bold leading-snug text-foreground transition-colors duration-150 group-hover:text-primary [text-wrap:pretty]">
          {cert.title}
        </h4>
        <p className="mt-1 font-sans text-xs text-muted-foreground leading-relaxed">
          {cert.issuer}
        </p>
      </div>

      {/* Bottom Metadata bar */}
      <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-3 font-mono text-[11px] text-muted-foreground">
        <span className="truncate max-w-[170px] tracking-tight">{cert.category || 'Accreditation'}</span>
        <span className="tabular-nums font-bold text-foreground/80 shrink-0 ml-2">{cert.year}</span>
      </div>
    </motion.div>
  );
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

  // Focus dimming states for storytelling
  const [hoveredExpIndex, setHoveredExpIndex] = useState<number | null>(null);
  const [hoveredCertIndex, setHoveredCertIndex] = useState<number | null>(null);

  // Filter state for credentials domain tabs
  const [activeDomain, setActiveDomain] = useState<CredentialDomain | 'all'>('all');

  // Dialog state for credential inspection
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const handleCopyId = (id?: string) => {
    if (!id) return;
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Filtered certifications based on selected tab
  const filteredCerts = useMemo(() => {
    if (activeDomain === 'all') return certifications;
    return certifications.filter((cert) => cert.domain === activeDomain);
  }, [activeDomain]);

  // Counts for each domain tab
  const domainCounts = useMemo(() => {
    const counts: Record<string, number> = { all: certifications.length };
    for (const d of credentialDomains) {
      if (d.id !== 'all') {
        counts[d.id] = certifications.filter((c) => c.domain === d.id).length;
      }
    }
    return counts;
  }, []);

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
          {/* Chapter III: Verified Credentials & Technical Ledger             */}
          {/* ================================================================ */}
          <div ref={ch3Ref} className="space-y-10">
            {/* Chapter Header */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={ch3InView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, ease: easeExpo }}
              className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-border/40 pb-4 gap-2"
            >
              <div>
                <MaskedHeading
                  as="h3"
                  text="Verified Credentials & Technical Ledger"
                  className="font-mono text-sm font-semibold uppercase tracking-widest text-foreground"
                  viewportMargin="-80px"
                  stagger={0.04}
                />
                <p className="mt-1 text-xs text-muted-foreground font-sans">
                  Accredited industrial certifications, international routing engineering, and database systems.
                </p>
              </div>

              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {filteredCerts.length} of {certifications.length} Credentials
              </span>
            </motion.div>

            {/* Flagship Landmark Feature Cards (MTCRE & Samsung SIC Spotlight) */}
            {activeDomain === 'all' && (
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
                animate={ch3InView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease: easeExpo }}
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
              >
                {/* MTCRE Spotlight */}
                <div className="group relative overflow-hidden rounded-2xl border border-primary/40 bg-gradient-to-br from-card/95 via-card/60 to-primary/5 p-6 shadow-sm transition-[transform,border-color,box-shadow] duration-200 hover:border-primary/60 hover:shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-10 items-center justify-center rounded-xl border border-primary/40 bg-primary/10 text-primary">
                        <Network className="size-5 stroke-[2.2]" />
                      </div>
                      <div>
                        <span className="inline-block rounded px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider bg-primary/15 text-primary border border-primary/25">
                          International Engineering
                        </span>
                        <p className="font-mono text-xs text-muted-foreground mt-0.5">MikroTik RouterOS</p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-semibold tabular-nums text-foreground/80 border border-border/70 rounded px-2 py-0.5 bg-secondary/50">
                      2025 – 2028
                    </span>
                  </div>

                  <h4 className="mt-4 font-serif text-lg font-bold text-foreground sm:text-xl leading-snug">
                    MikroTik Certified Routing Engineer (MTCRE)
                  </h4>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    Advanced routing architectures, multi-area OSPF, point-to-point tunnels, and VLAN switching verified by MikroTik.
                  </p>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-muted-foreground">ID:</span>
                      <code className="rounded bg-secondary px-2 py-0.5 font-mono text-xs font-semibold text-foreground">
                        2512RE1559
                      </code>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href="https://mikrotik.com/certificate/2512RE1559"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-[11px] text-primary hover:underline"
                      >
                        <span>Official Verify</span>
                        <ExternalLink className="size-3" />
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          const c = certifications.find((item) => item.credentialId === '2512RE1559');
                          if (c) setSelectedCert(c);
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-border bg-secondary/70 px-3 py-1 font-mono text-xs font-medium text-foreground hover:bg-secondary active:scale-[0.97] transition-transform"
                      >
                        <span>Curriculum</span>
                        <ArrowUpRight className="size-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Samsung SIC Spotlight */}
                <div className="group relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-card/95 via-card/60 to-secondary/30 p-6 shadow-sm transition-[transform,border-color,box-shadow] duration-200 hover:border-primary/40 hover:shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-10 items-center justify-center rounded-xl border border-border bg-secondary text-foreground">
                        <Award className="size-5 stroke-[2.2]" />
                      </div>
                      <div>
                        <span className="inline-block rounded px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider bg-secondary text-foreground/80 border border-border/70">
                          Global Acceleration
                        </span>
                        <p className="font-mono text-xs text-muted-foreground mt-0.5">Samsung &amp; Polines</p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-semibold tabular-nums text-foreground/80 border border-border/70 rounded px-2 py-0.5 bg-secondary/50">
                      2025 – 2026
                    </span>
                  </div>

                  <h4 className="mt-4 font-serif text-lg font-bold text-foreground sm:text-xl leading-snug">
                    Samsung Innovation Campus (SIC) Stage 7
                  </h4>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    AI, machine learning algorithms, and applied data engineering problem solving in partnership with Samsung.
                  </p>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-muted-foreground">Batch:</span>
                      <code className="rounded bg-secondary px-2 py-0.5 font-mono text-xs font-semibold text-foreground">
                        SIC 7 Mahasiswa
                      </code>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const c = certifications.find((item) => item.title.includes('Samsung'));
                        if (c) setSelectedCert(c);
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-secondary/70 px-3 py-1 font-mono text-xs font-medium text-foreground hover:bg-secondary active:scale-[0.97] transition-transform"
                    >
                      <span>Accreditation</span>
                      <ArrowUpRight className="size-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Segmented Category Filter Tabs */}
            <div className="relative">
              <div
                role="tablist"
                aria-label="Credential Categories"
                className="flex items-center gap-1.5 overflow-x-auto rounded-2xl border border-border/70 bg-secondary/30 p-1.5 text-xs backdrop-blur-sm no-scrollbar"
              >
                {credentialDomains.map((domain) => {
                  const isActive = activeDomain === domain.id;
                  const count = domainCounts[domain.id] || 0;

                  return (
                    <button
                      key={domain.id}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveDomain(domain.id)}
                      className={cn(
                        'group relative flex items-center gap-2 rounded-xl px-3.5 py-2 font-mono text-xs transition-colors whitespace-nowrap active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                        isActive ? 'text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="cert-domain-pill"
                          className="absolute inset-0 rounded-xl bg-background border border-border/80 shadow-xs dark:bg-zinc-900"
                          transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                        />
                      )}
                      <span className="relative z-10">{domain.label}</span>
                      <span
                        className={cn(
                          'relative z-10 rounded-md px-1.5 py-0.2 font-mono text-[10px] tabular-nums transition-colors',
                          isActive ? 'bg-primary/15 text-primary font-bold' : 'bg-secondary text-muted-foreground'
                        )}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filtered Credentials Card Grid */}
            <motion.div
              layout
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence mode="popLayout">
                {filteredCerts.map((cert, index) => (
                  <CertCard
                    key={cert.title}
                    cert={cert}
                    index={index}
                    isInView={ch3InView}
                    isCurrentHovered={hoveredCertIndex === index}
                    isOtherHovered={hoveredCertIndex !== null && hoveredCertIndex !== index}
                    onEnter={() => setHoveredCertIndex(index)}
                    onLeave={() => setHoveredCertIndex(null)}
                    onClick={() => {
                      setCopiedId(false);
                      setSelectedCert(cert);
                    }}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Credential Accreditation & Verification Modal */}
          <Dialog
            open={!!selectedCert}
            onOpenChange={(open) => {
              if (!open) {
                setSelectedCert(null);
                setCopiedId(false);
              }
            }}
          >
            <DialogContent className="max-w-lg border-border/80 bg-background/95 p-6 backdrop-blur-xl sm:rounded-2xl shadow-2xl">
              {selectedCert && (
                <div className="space-y-5">
                  <DialogHeader className="space-y-2 text-left">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-primary">
                        {selectedCert.category || 'Accredited Credential'}
                      </span>
                      <span className="font-mono text-xs tabular-nums text-muted-foreground border border-border/70 rounded px-2 py-0.5">
                        {selectedCert.year}
                      </span>
                    </div>
                    <DialogTitle className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                      {selectedCert.title}
                    </DialogTitle>
                    <DialogDescription className="font-sans text-xs text-muted-foreground">
                      Issued by <span className="font-medium text-foreground">{selectedCert.issuer}</span>
                      {selectedCert.issueDate && (
                        <span> · Issued on <span className="tabular-nums">{selectedCert.issueDate}</span></span>
                      )}
                      {selectedCert.validUntil && (
                        <span> · Valid through <span className="tabular-nums">{selectedCert.validUntil}</span></span>
                      )}
                    </DialogDescription>
                  </DialogHeader>

                  {/* Summary Description */}
                  {selectedCert.description && (
                    <p className="font-sans text-xs sm:text-sm text-foreground/90 leading-relaxed bg-secondary/35 dark:bg-white/[0.03] p-4 rounded-xl border border-border/50">
                      {selectedCert.description}
                    </p>
                  )}

                  {/* Core Competencies */}
                  {selectedCert.competencies && selectedCert.competencies.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Core Competencies Evaluated
                      </h4>
                      <ul className="space-y-2 font-sans text-xs text-foreground/85">
                        {selectedCert.competencies.map((comp) => (
                          <li key={comp} className="flex items-start gap-2">
                            <Check className="size-3.5 text-primary mt-0.5 shrink-0 stroke-[2.5]" />
                            <span className="leading-relaxed">{comp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Credential ID & Score Metadata Box */}
                  <div className="rounded-xl border border-border/60 bg-secondary/20 p-3.5 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                      <span className="text-muted-foreground">Credential ID</span>
                      <div className="flex items-center gap-1.5">
                        <code className="rounded bg-secondary px-2 py-0.5 font-mono text-xs font-semibold text-foreground select-all">
                          {selectedCert.credentialId || 'Verified Record'}
                        </code>
                        {selectedCert.credentialId && (
                          <button
                            type="button"
                            onClick={() => handleCopyId(selectedCert.credentialId)}
                            className="inline-flex items-center gap-1 rounded border border-border/70 bg-background px-2 py-0.5 text-[11px] text-muted-foreground hover:bg-secondary hover:text-foreground active:scale-[0.96] transition-all"
                            title="Copy Credential ID"
                          >
                            {copiedId ? (
                              <>
                                <Check className="size-3 text-emerald-500 stroke-[2.5]" />
                                <span className="text-emerald-500 font-medium">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="size-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {selectedCert.score && (
                      <div className="flex items-center justify-between font-mono text-xs border-t border-border/40 pt-2">
                        <span className="text-muted-foreground">Assessment Score</span>
                        <span className="font-bold text-foreground tabular-nums">{selectedCert.score}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Link Button if Available */}
                  {selectedCert.verificationUrl && (
                    <div className="flex items-center justify-end pt-1">
                      <a
                        href={selectedCert.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 font-mono text-xs font-semibold text-primary-foreground hover:bg-primary/90 active:scale-[0.97] transition-all shadow-sm"
                      >
                        <span>Verify Credential</span>
                        <ExternalLink className="size-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>

        </div>
      </div>
    </section>
  );
}
