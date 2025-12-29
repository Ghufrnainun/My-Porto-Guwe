import { ExternalLink, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ParallaxBackground } from '@/components/ParallaxBackground';
import { ProjectDrawer } from '@/components/ProjectDrawer';
import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface Project {
  title: string;
  description: string;
  technologies: string[];
  github: string;
  demo: string;
  image: string;
  color: string;
}

const projects: Project[] = [
  {
    title: 'LSP Polines Certification Platform',
    description:
      'Led a 5-person team to build the official certification website for Polines. Set up Git workflows for 4 teams, built the auth system from scratch, and shipped on deadline. Now serving 1,000+ students and professionals seeking industry certifications.',
    technologies: ['Laravel', 'Livewire', 'Tailwind CSS', 'MySQL'],
    github: 'https://github.com/ghufronainun',
    demo: '',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    color: '#10B981',
  },
  {
    title: 'UKM PCC Online Election System',
    description:
      'Built a secure voting platform with one-time vote validation and live results. Handled auth logic, vote integrity checks, and real-time dashboard — zero disputes on election day. Successfully processed 300+ votes with 100% data integrity.',
    technologies: ['Laravel', 'Alpine.js', 'MySQL'],
    github: 'https://github.com/ghufronainun',
    demo: '',
    image:
      'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop',
    color: '#6366F1',
  },
  {
    title: 'IMPP Organization Website',
    description:
      "Own the full development and maintenance of my organization's official site. Also manage Instagram content strategy and email operations. Increased member engagement by 40% through integrated digital presence.",
    technologies: ['React', 'Tailwind CSS', 'Vite'],
    github: 'https://github.com/ghufronainun',
    demo: '',
    image:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop',
    color: '#0EA5E9',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

export function Projects() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <section
      id="projects"
      className="py-24 md:py-32 bg-background relative overflow-hidden"
    >
      <ParallaxBackground variant="circles" />

      <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            What I've Built
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real projects solving real problems — shipped, deployed, and used by
            actual users
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              variants={cardVariants}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              whileHover={{ y: -8 }}
              className="group h-full"
            >
              <motion.div
                className="h-full bg-card rounded-2xl border border-border overflow-hidden cursor-pointer"
                onClick={() => handleProjectClick(project)}
                animate={{
                  scale: hoveredIndex === index ? 1.02 : 1,
                  boxShadow:
                    hoveredIndex === index
                      ? `0 25px 50px -12px ${project.color}30`
                      : '0 0 0 0 transparent',
                }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {/* Project Image - 16:9 aspect ratio */}
                <div className="aspect-video overflow-hidden relative">
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    animate={{
                      scale: hoveredIndex === index ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.4 }}
                  />
                  {/* Hover Overlay */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center gap-4"
                    style={{
                      background: `linear-gradient(to top, ${project.color}90, transparent)`,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-background/90 rounded-full"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => e.stopPropagation()}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{
                        y: hoveredIndex === index ? 0 : 20,
                        opacity: hoveredIndex === index ? 1 : 0,
                      }}
                      transition={{ delay: 0.1 }}
                    >
                      <Github className="h-5 w-5" />
                    </motion.a>
                    {project.demo && (
                      <motion.a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-background/90 rounded-full"
                        whileHover={{ scale: 1.2, rotate: -5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => e.stopPropagation()}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{
                          y: hoveredIndex === index ? 0 : 20,
                          opacity: hoveredIndex === index ? 1 : 0,
                        }}
                        transition={{ delay: 0.15 }}
                      >
                        <ExternalLink className="h-5 w-5" />
                      </motion.a>
                    )}
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <motion.h3
                    className="text-xl font-bold mb-3 transition-colors"
                    animate={{
                      color: hoveredIndex === index ? project.color : undefined,
                    }}
                  >
                    {project.title}
                  </motion.h3>

                  {/* Description - limited to 3 lines */}
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tech Badges */}
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <motion.span
                        key={tech}
                        className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          y: hoveredIndex === index ? -2 : 0,
                        }}
                        transition={{ delay: techIndex * 0.05 }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              asChild
              className="group hover:border-primary/50 transition-colors"
            >
              <a
                href="https://github.com/ghufronainun"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                View More on GitHub
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <ProjectDrawer
        project={selectedProject}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </section>
  );
}
