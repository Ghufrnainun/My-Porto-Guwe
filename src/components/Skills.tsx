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
  return (
    <section id="skills" className="relative bg-transparent py-12 md:py-16">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Header Column */}
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <div>
              <h3 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
                Tools of <br /> the Trade.
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8 text-wrap-pretty">
                I don't treat frameworks as religions. I pick the stack that ships fastest and runs best for the specific problem.
              </p>
            </div>
          </div>

          {/* Bento Grid Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Primary Stack - Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Laravel */}
              <div className="group bg-card p-6 md:p-8 rounded-[1.5rem] shadow-sm border border-border/40 hover:border-primary/30 min-h-[160px] flex flex-col justify-between relative overflow-hidden transition-[border-color,box-shadow,transform] duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-default col-span-1 md:col-span-2"
                   style={{ '--skill-color': '#FF2D20' } as React.CSSProperties}>
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-[var(--skill-color)]/10 rounded-full blur-2xl group-hover:scale-150 group-hover:opacity-100 opacity-40 transition-all duration-700 ease-premium pointer-events-none" />

                <div className="flex justify-between items-start">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg"
                    alt="Laravel"
                    className="w-12 h-12 transition-transform duration-500 ease-out-spring group-hover:scale-110 drop-shadow-sm"
                  />
                  <span className="px-2.5 py-1 text-[9px] font-mono font-semibold text-muted-foreground bg-secondary/80 rounded-md border border-border/50">
                    Backend Core
                  </span>
                </div>
                <div className="mt-4">
                  <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    Laravel
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                    The foundation for relational data, robust auth, and APIs that don't break under load.
                  </p>
                </div>
              </div>

              {/* Card 2: React (Tall Card) */}
              <div className="group bg-card p-6 md:p-8 rounded-[1.5rem] shadow-sm border border-border/40 hover:border-primary/30 h-full flex flex-col justify-between relative overflow-hidden transition-[border-color,box-shadow,transform] duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-default col-span-1 md:row-span-2 min-h-[340px]"
                   style={{ '--skill-color': '#61DAFB' } as React.CSSProperties}>
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-[var(--skill-color)]/10 rounded-full blur-2xl group-hover:scale-150 group-hover:opacity-100 opacity-40 transition-all duration-700 ease-premium pointer-events-none" />

                <div className="flex justify-between items-start">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
                    alt="React"
                    className="w-12 h-12 transition-transform duration-500 ease-out-spring drop-shadow-sm group-hover:scale-110 group-hover:rotate-[30deg]"
                  />
                  <span className="px-2.5 py-1 text-[9px] font-mono font-semibold text-muted-foreground bg-secondary/80 rounded-md border border-border/50">
                    Frontend Core
                  </span>
                </div>
                <div className="mt-8">
                  <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    React.js
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Component architectures that stay predictable even when application state gets complex.
                  </p>
                </div>
              </div>

              {/* Card 3: Next.js */}
              <div className="group bg-card p-6 md:p-8 rounded-[1.5rem] shadow-sm border border-border/40 hover:border-primary/30 min-h-[160px] flex flex-col justify-between relative overflow-hidden transition-[border-color,box-shadow,transform] duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-default col-span-1 md:col-span-2"
                   style={{ '--skill-color': '#000000' } as React.CSSProperties}>
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-[var(--skill-color)]/10 rounded-full blur-2xl group-hover:scale-150 group-hover:opacity-100 opacity-40 transition-all duration-700 ease-premium pointer-events-none" />

                <div className="flex justify-between items-start">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg"
                    alt="Next.js"
                    className="w-12 h-12 dark:invert transition-transform duration-500 ease-out-spring group-hover:scale-110 drop-shadow-sm"
                  />
                  <span className="px-2.5 py-1 text-[9px] font-mono font-semibold text-muted-foreground bg-secondary/80 rounded-md border border-border/50">
                    Meta Framework
                  </span>
                </div>
                <div className="mt-4">
                  <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    Next.js
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                    Server-rendered React for when SEO and time-to-first-byte actually matter.
                  </p>
                </div>
              </div>
            </div>

            {/* Support Stack - Grouped by Category */}
            <div className="space-y-6">
              {Object.entries(skillGroups.supportStack).map(([key, group]) => (
                <div key={key} className="space-y-3">
                  {/* Group Label */}
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest font-semibold">
                      {group.label}
                    </span>
                    <div className="flex-1 h-px bg-border/40" />
                  </div>

                  {/* Group Items */}
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((skill) => (
                      <div
                        key={skill.name}
                        className="group px-4 py-2.5 rounded-md bg-secondary/20 border border-border/50 flex items-center gap-2.5 hover:bg-card hover:border-primary/30 transition-[border-color,background-color,transform,box-shadow] duration-300 ease-out cursor-default hover:-translate-y-0.5 hover:shadow-sm"
                        style={{ '--skill-color': skill.color } as React.CSSProperties}
                      >
                        <img
                          src={skill.icon}
                          alt={skill.name}
                          className="w-4 h-4 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-300 ease-out-spring"
                        />
                        <span className="font-semibold text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                          {skill.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
