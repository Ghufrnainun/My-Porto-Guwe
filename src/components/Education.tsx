import { GraduationCap, Trophy } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { certifications, education, organizationExperience } from '@/data/profile';

export function Education() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="education" className="relative overflow-hidden bg-background py-20 md:py-32">
      <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-24">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-2 font-mono text-sm text-muted-foreground">Background</p>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Education & Experience</h2>
        </motion.div>

        <motion.div
          ref={ref}
          className="mb-16 rounded-2xl border border-border bg-card p-5 sm:p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <GraduationCap className="size-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="mb-1 text-xl font-bold">{education.degree}</h3>
                  <p className="text-muted-foreground">{education.university}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <span className="font-mono text-sm text-muted-foreground">{education.period}</span>
                    <span className="rounded bg-secondary px-2 py-1 text-xs font-medium text-foreground">
                      GPA: {education.gpa}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">Focus Areas</p>
              <div className="flex flex-wrap gap-2">
                {education.focusAreas.map((area) => (
                  <span key={area} className="text-sm text-muted-foreground">{area}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mx-auto max-w-4xl">
          <motion.p
            className="mb-8 font-mono text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Organization Experience
          </motion.p>
          <div className="relative">
            <div className="absolute bottom-3 left-[7px] top-3 w-px bg-border" />
            <div className="space-y-12">
              {organizationExperience.map((experience, index) => (
                <motion.article
                  key={`${experience.organization}-${experience.role}`}
                  className="relative pl-10"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                >
                  <div className="absolute left-0 top-1.5 size-4 rounded-full border-2 border-muted bg-background" />
                  <h3 className="text-lg font-bold">{experience.role}</h3>
                  <p className="text-muted-foreground">{experience.organization}</p>
                  <p className="mt-1 font-mono text-sm text-muted-foreground">{experience.period}</p>
                  <ul className="mt-3 space-y-2">
                    {experience.responsibilities.map((responsibility) => (
                      <li key={responsibility} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span aria-hidden="true">-</span>
                        <span>{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </motion.article>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-4xl">
          <motion.p
            className="mb-6 font-mono text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Verified Credentials
          </motion.p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {certifications.map((certification, index) => (
              <motion.article
                key={certification.title}
                className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <Trophy className="size-4 text-muted-foreground" />
                  <span className="font-mono text-xs uppercase text-muted-foreground">Verified</span>
                </div>
                <h3 className="mb-1 text-sm font-medium">{certification.title}</h3>
                <p className="text-xs text-muted-foreground">{certification.issuer}</p>
                <p className="mt-1 text-xs text-muted-foreground">{certification.year}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
