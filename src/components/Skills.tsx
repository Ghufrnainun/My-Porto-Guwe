import { ParallaxBackground } from '@/components/ParallaxBackground';
import { useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';

type Category = 'all' | 'frontend' | 'backend' | 'database' | 'tools';

const categories: { id: Category; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'database', label: 'Database' },
  { id: 'tools', label: 'Tools' },
];

// Sorted by priority: Primary Stack > Backend/DB > Secondary Frameworks > Tools
// Removed: HTML5, CSS3 (implied)
const skills = [
  // Primary Stack (Next.js/React ecosystem)
  {
    name: 'Next.js',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
    color: '#000000',
    category: 'frontend' as Category,
  },
  {
    name: 'React',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    color: '#61DAFB',
    category: 'frontend' as Category,
  },
  {
    name: 'JavaScript',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
    color: '#F7DF1E',
    category: 'frontend' as Category,
  },
  {
    name: 'Tailwind',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
    color: '#06B6D4',
    category: 'frontend' as Category,
  },
  // Backend / Database
  {
    name: 'Laravel',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg',
    color: '#FF2D20',
    category: 'backend' as Category,
  },
  {
    name: 'PHP',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
    color: '#777BB4',
    category: 'backend' as Category,
  },
  {
    name: 'Python',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    color: '#3776AB',
    category: 'backend' as Category,
  },
  {
    name: 'MySQL',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
    color: '#4479A1',
    category: 'database' as Category,
  },
  {
    name: 'MongoDB',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
    color: '#47A248',
    category: 'database' as Category,
  },
  // Secondary Frameworks
  {
    name: 'Vue.js',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
    color: '#4FC08D',
    category: 'frontend' as Category,
  },
  // Tools
  {
    name: 'Git',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
    color: '#F05032',
    category: 'tools' as Category,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 12,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: -20,
    transition: { duration: 0.2 },
  },
};

export function Skills() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const filteredSkills =
    activeCategory === 'all'
      ? skills
      : skills.filter((skill) => skill.category === activeCategory);

  return (
    <section
      id="skills"
      className="py-24 md:py-32 bg-background relative overflow-hidden"
    >
      <ParallaxBackground variant="grid" />

      <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Tech Stack
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Technologies I actively use to build robust and scalable
            applications
          </p>
        </motion.div>

        {/* Category Filter Tabs */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative ${
                activeCategory === category.id
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground bg-background/50 border border-border hover:border-primary/30'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {activeCategory === category.id && (
                <motion.span
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-primary rounded-full -z-10"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              {category.label}
              {activeCategory === category.id && (
                <span className="ml-2 text-xs opacity-80">
                  ({filteredSkills.length})
                </span>
              )}
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          ref={ref}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill) => (
              <motion.div
                key={skill.name}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                className="group relative"
                onMouseEnter={() => setHoveredSkill(skill.name)}
                onMouseLeave={() => setHoveredSkill(null)}
                whileHover={{
                  y: -8,
                  transition: { type: 'spring', stiffness: 300 },
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="flex flex-col items-center gap-3 p-4 md:p-5 bg-card rounded-2xl border border-border 
                             hover:border-primary/50 transition-colors duration-300 cursor-pointer"
                  style={{
                    boxShadow:
                      hoveredSkill === skill.name
                        ? `0 20px 40px -15px ${skill.color}40`
                        : undefined,
                  }}
                  animate={{
                    scale: hoveredSkill === skill.name ? 1.05 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  data-skill={skill.name.toLowerCase().replace(/\s+/g, '-')}
                >
                  {/* Glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl -z-10"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: hoveredSkill === skill.name ? 1 : 0,
                    }}
                    style={{
                      background: `radial-gradient(circle at center, ${skill.color}15, transparent 70%)`,
                    }}
                    transition={{ duration: 0.3 }}
                  />

                  <motion.div
                    className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center"
                    animate={{
                      rotate: hoveredSkill === skill.name ? [0, -10, 10, 0] : 0,
                      scale: hoveredSkill === skill.name ? 1.2 : 1,
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <img
                      src={skill.icon}
                      alt={skill.name}
                      className="w-10 h-10 md:w-12 md:h-12 object-contain drop-shadow-lg"
                    />
                  </motion.div>
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {skill.name}
                  </span>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
