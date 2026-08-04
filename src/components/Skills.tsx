import { motion } from 'framer-motion';

const primary = [
  {
    name: 'Laravel',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg',
    tag: 'Backend Core',
    description: "The foundation for relational data, robust auth, and APIs that don't break under load.",
  },
  {
    name: 'React',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    tag: 'Frontend Core',
    description: 'Component architectures that stay predictable even when application state gets complex.',
  },
  {
    name: 'Next.js',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
    tag: 'Meta Framework',
    description: 'Server-rendered React for when SEO and time-to-first-byte actually matter.',
  },
];

const support = [
  { name: 'PHP', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg' },
  { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
  { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
  { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { name: 'Tailwind', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg' },
  { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
  { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
];

const springEase = [0.32, 0.72, 0, 1];

export function Skills() {
  return (
    <section id="skills" className="relative bg-transparent py-24 md:py-32 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Header Column */}
          <motion.div 
            className="lg:col-span-4 lg:sticky lg:top-32 pr-0 lg:pr-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: springEase }}
          >
            <div className="mb-8">
              <h3 className="font-serif text-5xl md:text-6xl font-bold mb-6 text-foreground leading-[1.05] tracking-tight">
                Tools of <br /> the Trade.
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed text-wrap-pretty max-w-sm">
                I don't treat frameworks as religions. I pick the stack that ships fastest and runs best for the specific problem.
              </p>
            </div>
          </motion.div>

          {/* List Column */}
          <div className="lg:col-span-8">
            <div className="flex flex-col border-b border-border/40">
              {primary.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.7, delay: index * 0.1, ease: springEase }}
                  className="group relative border-t border-border/40 py-10 md:py-14 cursor-default overflow-hidden"
                >
                  {/* Background hover reveal */}
                  <div className="absolute inset-0 bg-secondary/30 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out-spring -z-10" />

                  <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-8 md:gap-12 px-4 md:px-8">
                    <div className="flex flex-col gap-3">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors duration-300">
                        0{index + 1} &mdash; {skill.tag}
                      </span>
                      <h4 className="font-serif text-5xl md:text-7xl font-bold text-foreground/30 group-hover:text-foreground transition-colors duration-500">
                        {skill.name}
                      </h4>
                    </div>
                    
                    <div className="flex flex-col justify-end md:text-right mt-auto max-w-[280px]">
                      <div className="hidden md:flex justify-end mb-6 opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 ease-out-spring">
                        <img 
                          src={skill.icon} 
                          alt={skill.name} 
                          className={`w-10 h-10 ${skill.name === 'Next.js' ? 'dark:invert' : ''}`}
                          loading="lazy"
                        />
                      </div>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                        {skill.description}
                      </p>
                      
                      {/* Mobile icon (shows only on small screens) */}
                      <div className="md:hidden mt-6">
                         <img 
                          src={skill.icon} 
                          alt={skill.name} 
                          className={`w-8 h-8 opacity-50 grayscale ${skill.name === 'Next.js' ? 'dark:invert' : ''}`}
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Support Stack */}
            <motion.div 
              className="mt-16 px-4 md:px-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: 0.3, ease: springEase }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-8">
                The Ecosystem
              </p>
              <div className="flex flex-wrap gap-x-8 gap-y-6">
                {support.map((item) => (
                  <div key={item.name} className="flex items-center gap-3 group cursor-default">
                    <img 
                      src={item.icon} 
                      alt={item.name}
                      className="w-5 h-5 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ease-out-spring" 
                      loading="lazy"
                    />
                    <span className="text-sm font-medium text-foreground/50 group-hover:text-foreground transition-colors duration-300">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
