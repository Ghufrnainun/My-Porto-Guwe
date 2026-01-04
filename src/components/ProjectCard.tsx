import { Github, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProjectModal } from './ProjectModal';
import { useState } from 'react';

interface Project {
  title: string;
  description: string;
  technologies: string[];
  github: string;
  demo: string;
  image: string;
  images?: string[];
  color?: string;
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isReversed = index % 2 !== 0;

  return (
    <>
      <motion.div
        className="relative group"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Desktop Layout */}
        <div className="hidden md:block relative min-h-[400px]">
          {/* Image - Positioned to left or right */}
          <div
            className={`relative w-[60%] ${isReversed ? 'ml-auto' : 'mr-auto'}`}
          >
            <div
              className="block relative rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              <div className="aspect-[16/10] relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Overlay */}
                <div
                  className="absolute inset-0 bg-primary/20 mix-blend-multiply transition-opacity duration-300"
                  style={{ opacity: isHovered ? 0 : 1 }}
                />
              </div>
            </div>
          </div>

          {/* Content - Absolute positioned to overlap */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-[50%] z-10 ${
              isReversed ? 'left-0 text-left' : 'right-0 text-right'
            }`}
          >
            <p className="text-primary font-mono text-xs mb-3 tracking-wider uppercase">
              Featured Project
            </p>

            <h3
              className="text-3xl font-bold text-foreground mb-6 cursor-pointer hover:text-primary transition-colors leading-tight"
              onClick={() => setIsModalOpen(true)}
            >
              {project.title}
            </h3>

            {/* Description Card */}
            <div
              className={`bg-card/95 backdrop-blur-sm p-6 rounded-xl border border-border shadow-xl mb-6 hover:border-primary/50 transition-colors ${
                !isReversed && 'items-end'
              }`}
            >
              <p className="text-muted-foreground text-sm leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Tech Stack */}
            <div
              className={`flex flex-wrap gap-2 mb-6 ${
                isReversed ? 'justify-start' : 'justify-end'
              }`}
            >
              {project.technologies.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 text-xs font-mono font-medium text-primary bg-primary/10 rounded-full"
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
                className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-secondary rounded-full"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-secondary rounded-full"
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
            className="relative rounded-2xl overflow-hidden mb-6 shadow-lg"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="aspect-video relative">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 bg-primary/20 mix-blend-multiply transition-opacity duration-300"
                style={{ opacity: isHovered ? 0 : 1 }}
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="text-primary font-mono text-xs mb-2 tracking-wider">
              Featured Project
            </p>

            <h3
              className="text-2xl font-bold text-foreground mb-4 cursor-pointer hover:text-primary transition-colors"
              onClick={() => setIsModalOpen(true)}
            >
              {project.title}
            </h3>

            <div className="bg-card border border-border p-5 rounded-xl shadow-sm mb-4">
              <p className="text-muted-foreground text-sm leading-relaxed">
                {project.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 text-xs font-mono text-muted-foreground bg-secondary rounded-md"
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
                className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                <Github className="w-4 h-4" />
                Code
              </a>
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <ProjectModal
        project={project}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
