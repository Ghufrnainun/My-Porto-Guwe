import { Github } from 'lucide-react';
import { ProjectCard } from './ProjectCard';
import { useRef } from 'react';
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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

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
          {/* Numbering */}
          <div className="mb-6">
            <span className="font-serif text-6xl md:text-8xl text-muted-foreground/10 font-bold leading-none select-none">
              04
            </span>
          </div>

          <p className="text-primary font-mono text-sm mb-2 tracking-wider uppercase">
            What I've Built
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Featured Projects
          </h2>
        </motion.div>

        {/* Projects Container */}
        <div ref={ref} className="space-y-32">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
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
    </section>
  );
}
