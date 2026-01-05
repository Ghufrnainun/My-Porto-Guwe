import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

// Skills Data with clear grouping for ecosystem view
const skillGroups = {
  primary: [
    {
      name: 'Laravel',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg',
      color: '#FF2D20',
    },
    {
      name: 'React',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      color: '#61DAFB',
    },
    {
      name: 'Next.js',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
      color: '#000000',
    },
  ],
  supportStack: {
    backend: {
      label: 'Backend',
      items: [
        {
          name: 'PHP',
          icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
          color: '#777BB4',
        },
        {
          name: 'MySQL',
          icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
          color: '#4479A1',
        },
        {
          name: 'MongoDB',
          icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
          color: '#47A248',
        },
      ],
    },
    frontend: {
      label: 'Frontend',
      items: [
        {
          name: 'JavaScript',
          icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
          color: '#F7DF1E',
        },
        {
          name: 'Tailwind',
          icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
          color: '#06B6D4',
        },
      ],
    },
    infra: {
      label: 'Infra / Tools',
      items: [
        {
          name: 'Git',
          icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
          color: '#F05032',
        },
        {
          name: 'Python',
          icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
          color: '#3776AB',
        },
      ],
    },
  },
};

export function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="skills"
      className="py-24 md:py-32 bg-background relative overflow-hidden"
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Header Column */}
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              {/* Numbering */}
              <div className="mb-6">
                <span className="font-serif text-6xl md:text-8xl text-muted-foreground/20 font-bold leading-none select-none">
                  03
                </span>
              </div>

              <h2 className="text-sm font-mono text-primary mb-4 tracking-wider uppercase">
                Tech Stack
              </h2>
              <h3 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
                Tools of <br /> the Trade.
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                I select the right tool for the job. My primary stack is focused
                on high-performance, SEO-friendly web architectures.
              </p>
            </motion.div>
          </div>

          {/* Bento Grid Column */}
          <motion.div
            ref={ref}
            className="lg:col-span-8 space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Primary Stack - Big Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {skillGroups.primary.map((skill, idx) => (
                <motion.div
                  key={skill.name}
                  className="group relative p-6 rounded-3xl bg-secondary/30 border border-border transition-all duration-500 overflow-hidden min-h-[160px] flex flex-col justify-between cursor-default"
                  whileHover={{
                    y: -5,
                    scale: 1.02,
                    borderColor: skill.color,
                  }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  style={
                    { '--skill-color': skill.color } as React.CSSProperties
                  }
                >
                  <div className="absolute top-0 right-0 p-32 bg-gradient-to-br from-[var(--skill-color)]/10 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <img
                    src={skill.icon}
                    alt={skill.name}
                    className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm"
                  />
                  <div>
                    <h4 className="text-xl font-bold group-hover:text-[var(--skill-color)] transition-colors">
                      {skill.name}
                    </h4>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                      Primary
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Support Stack - Grouped by Category */}
            <div className="space-y-6">
              {Object.entries(skillGroups.supportStack).map(([key, group]) => (
                <div key={key} className="space-y-3">
                  {/* Group Label */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                      {group.label}
                    </span>
                    <div className="flex-1 h-px bg-border/50" />
                  </div>

                  {/* Group Items */}
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((skill) => (
                      <motion.div
                        key={skill.name}
                        className="group px-3 py-2 rounded-xl bg-secondary/30 border border-border flex items-center gap-2 hover:shadow-md hover:bg-background transition-all duration-300 cursor-default"
                        whileHover={{
                          y: -2,
                          borderColor: skill.color,
                        }}
                        style={
                          {
                            '--skill-color': skill.color,
                          } as React.CSSProperties
                        }
                      >
                        <img
                          src={skill.icon}
                          alt={skill.name}
                          className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all"
                        />
                        <span className="font-medium text-xs group-hover:text-[var(--skill-color)] transition-colors">
                          {skill.name}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
