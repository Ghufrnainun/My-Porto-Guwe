import { ExternalLink, Github } from 'lucide-react';
import { ProjectModal } from '@/components/ProjectModal';
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
      'Led a 5-person team to build the official certification website. Engineered the auth system from scratch and optimized Git workflows for 4 development teams. Now serving 1,000+ students and professionals seeking industry certifications.',
    technologies: ['Laravel', 'Livewire', 'Tailwind CSS', 'MySQL'],
    github: 'https://github.com/Ghufrnainun',
    demo: '',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
    color: '#10B981',
  },
  {
    title: 'UKM PCC Online Election System',
    description:
      'A secure voting platform with one-time vote validation. Handled complex auth logic and real-time dashboard updates with zero disputes. Successfully processed 300+ votes with 100% data integrity.',
    technologies: ['Laravel', 'Alpine.js', 'MySQL'],
    github: 'https://github.com/Ghufrnainun',
    demo: '',
    image:
      'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=500&fit=crop',
    color: '#6366F1',
  },
];

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section
      id="projects"
      className="py-20 md:py-32 bg-background relative overflow-hidden"
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        {/* Section Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-muted-foreground font-mono text-sm mb-2">
            What I've Built
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Featured Projects
          </h2>
        </motion.div>

        {/* Projects Container */}
        <div ref={ref} className="space-y-32">
          {projects.map((project, index) => {
            const isReversed = index % 2 !== 0;
            const isHovered = hoveredIndex === index;

            return (
              <motion.div
                key={project.title}
                className="relative"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Desktop Layout */}
                <div className="hidden md:block relative">
                  {/* Image - Positioned to left or right */}
                  <div
                    className={`relative w-[60%] ${
                      isReversed ? 'ml-auto' : ''
                    }`}
                  >
                    <a
                      href="#"
                      className="block relative rounded-2xl overflow-hidden"
                      onClick={(e) => {
                        e.preventDefault();
                        handleProjectClick(project);
                      }}
                    >
                      <div className="aspect-[16/10] relative">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                        {/* Teal Overlay - fades on hover */}
                        <div
                          className="absolute inset-0 bg-primary/40 mix-blend-multiply transition-opacity duration-300"
                          style={{ opacity: isHovered ? 0 : 1 }}
                        />
                      </div>
                    </a>
                  </div>

                  {/* Content - Absolute positioned to overlap */}
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 w-[50%] ${
                      isReversed ? 'left-0 text-left' : 'right-0 text-right'
                    }`}
                  >
                    <p className="text-muted-foreground font-mono text-xs mb-2">
                      Featured Project
                    </p>

                    <h3
                      className="text-2xl lg:text-3xl font-bold text-foreground mb-5 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => handleProjectClick(project)}
                    >
                      {project.title}
                    </h3>

                    {/* Description Card */}
                    <div className="bg-card p-6 rounded shadow-xl mb-5">
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {/* Tech Stack */}
                    <div
                      className={`flex flex-wrap gap-4 mb-4 ${
                        isReversed ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs font-mono text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    <div
                      className={`flex gap-4 ${
                        isReversed ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:text-primary transition-colors"
                        aria-label="GitHub"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                      {project.demo && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-foreground hover:text-primary transition-colors"
                          aria-label="External Link"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mobile Layout - Stacked */}
                <div className="md:hidden">
                  {/* Image */}
                  <div
                    className="relative rounded-2xl overflow-hidden mb-6"
                    onClick={() => handleProjectClick(project)}
                  >
                    <div className="aspect-video relative">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className="absolute inset-0 bg-primary/40 mix-blend-multiply transition-opacity duration-300"
                        style={{ opacity: isHovered ? 0 : 1 }}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <p className="text-muted-foreground font-mono text-xs mb-2">
                      Featured Project
                    </p>

                    <h3
                      className="text-xl font-bold text-foreground mb-4 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => handleProjectClick(project)}
                    >
                      {project.title}
                    </h3>

                    <div className="bg-card p-5 rounded shadow-lg mb-4">
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-4">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs font-mono text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-4">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:text-primary transition-colors"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                      {project.demo && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-foreground hover:text-primary transition-colors"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* GitHub CTA */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <a
            href="https://github.com/Ghufrnainun"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary font-mono text-sm transition-colors"
          >
            <span>View More on GitHub</span>
            <Github className="w-4 h-4" />
          </a>
        </motion.div>
      </div>

      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
}
