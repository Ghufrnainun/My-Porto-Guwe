import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Award, Code2, Globe, Check, GraduationCap, Calendar, MapPin } from 'lucide-react';
import {
  education,
  organizationExperience,
  certifications,
} from '@/data/profile';

// Product-grade ease-out curve (Linear / Stripe standard)
const easeOutCirc = [0.23, 1, 0.32, 1] as const;

export function Education() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' });
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="education" ref={sectionRef} className="py-20 md:py-32 bg-background relative">
      <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        <div className="max-w-4xl space-y-16 md:space-y-24">
          
          {/* Editorial Section Header */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, ease: easeOutCirc }}
            className="border-b border-border/50 pb-8"
          >
            <div className="flex items-center gap-2 mb-2.5">
              <span className="size-2 rounded-full bg-primary" />
              <p className="text-primary font-mono text-[11px] tracking-widest uppercase font-semibold">
                Academic & Experience
              </p>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.12]">
              Foundations, leadership, and credentials.
            </h2>
            <p className="mt-3.5 max-w-xl text-base text-muted-foreground leading-relaxed">
              Where computer engineering coursework connects with active organization leadership, hardware maintenance, and verified technical competencies.
            </p>
          </motion.div>

          {/* 1. Academic Foundation Block */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.1, ease: easeOutCirc }}
            className="rounded-2xl border border-border/70 bg-card/40 p-6 sm:p-8 backdrop-blur-xs transition-[border-color,background-color] duration-200 hover:border-border/90"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="flex size-11 sm:size-12 shrink-0 items-center justify-center rounded-xl bg-secondary border border-border/70 text-foreground">
                  <GraduationCap className="size-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-muted-foreground">
                    <span>{education.university}</span>
                    <span className="text-border">·</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3 text-muted-foreground" />
                      Semarang, ID
                    </span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground tracking-tight pt-1">
                    {education.degree}
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono pt-1">
                    Class of 2024 - 2028 · Expected graduation: {education.expectedGraduation}
                  </p>
                </div>
              </div>

              {/* High-Performance GPA Stat */}
              <div className="shrink-0 self-start md:self-auto rounded-xl bg-secondary/50 border border-border/60 px-4 py-2.5">
                <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Cumulative GPA
                </p>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="font-mono text-xl sm:text-2xl font-bold text-foreground tabular-nums">
                    {education.gpa.split('/')[0]}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    / {education.gpa.split('/')[1] || '4.00'}
                  </span>
                </div>
              </div>
            </div>

            {/* Curriculum Focus Areas */}
            <div className="mt-6 pt-5 border-t border-border/50 flex flex-col sm:flex-row sm:items-center gap-3 text-xs">
              <span className="font-mono uppercase tracking-wider text-muted-foreground shrink-0">
                Core Focus:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {education.focusAreas.map((area) => (
                  <span
                    key={area}
                    className="inline-flex items-center rounded-md bg-secondary/70 border border-border/50 px-2.5 py-1 font-mono text-[11px] text-foreground/80 hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 2. Organization Experience */}
          <div className="space-y-8">
            <div className="flex items-baseline justify-between border-b border-border/40 pb-3">
              <h3 className="text-sm font-mono uppercase tracking-widest font-semibold text-foreground/90">
                Organization Leadership
              </h3>
              <span className="text-xs font-mono text-muted-foreground">
                3 Roles
              </span>
            </div>

            <div className="divide-y divide-border/40">
              {organizationExperience.map((exp, index) => (
                <motion.article
                  key={`${exp.organization}-${exp.role}`}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.4,
                    delay: 0.15 + index * 0.07,
                    ease: easeOutCirc,
                  }}
                  className="group py-6 first:pt-2 last:pb-2 -mx-3 sm:-mx-4 px-3 sm:px-4 rounded-xl transition-[background-color] duration-200 hover:bg-secondary/25"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6">
                    {/* Date & Organization Column */}
                    <div className="sm:col-span-4 space-y-1">
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground tabular-nums">
                        <Calendar className="size-3 text-muted-foreground/80" />
                        {exp.period}
                      </span>
                      <p className="text-sm font-medium text-foreground/85">
                        {exp.organization}
                      </p>
                      {exp.category && (
                        <p className="text-xs font-mono text-muted-foreground/70">
                          {exp.category}
                        </p>
                      )}
                    </div>

                    {/* Role & Deliverables Column */}
                    <div className="sm:col-span-8 space-y-2.5">
                      <h4 className="text-base sm:text-lg font-medium text-foreground leading-snug group-hover:text-primary transition-colors duration-150">
                        {exp.role}
                      </h4>

                      <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                        {exp.responsibilities.map((resp) => (
                          <li key={resp} className="flex items-start gap-2.5">
                            <span className="text-primary/70 select-none mt-0.5">•</span>
                            <span className="text-foreground/80">{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          {/* 3. Verified Credentials */}
          <div className="space-y-8">
            <div className="flex items-baseline justify-between border-b border-border/40 pb-3">
              <h3 className="text-sm font-mono uppercase tracking-widest font-semibold text-foreground/90">
                Verified Credentials
              </h3>
              <span className="text-xs font-mono text-muted-foreground">
                3 Certifications
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {certifications.map((cert, index) => {
                const isBNSP = cert.title.includes('BNSP');
                const isLanguage = cert.title.includes('TEPPS');

                return (
                  <motion.div
                    key={cert.title}
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                      duration: 0.4,
                      delay: 0.25 + index * 0.06,
                      ease: easeOutCirc,
                    }}
                    className="group relative flex flex-col justify-between rounded-xl border border-border/60 bg-card/40 p-5 transition-[border-color,background-color,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card/70"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3.5">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-secondary border border-border/70 text-foreground/80 group-hover:text-primary transition-colors">
                          {isBNSP ? (
                            <Award className="size-[18px]" />
                          ) : isLanguage ? (
                            <Globe className="size-[18px]" />
                          ) : (
                            <Code2 className="size-[18px]" />
                          )}
                        </div>

                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground group-hover:text-foreground transition-colors">
                          <Check className="size-3 text-primary" />
                          Verified
                        </span>
                      </div>

                      <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                        {cert.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {cert.issuer}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-border/50 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                      <span>{cert.category || 'Certification'}</span>
                      <span className="tabular-nums font-medium text-foreground/75">
                        {cert.year}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
