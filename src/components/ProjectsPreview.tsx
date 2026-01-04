import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ProjectCard } from './ProjectCard';
import { motion } from 'framer-motion';

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

const featuredProjects: Project[] = [
  {
    title: 'LSP Polines Certification Platform',
    description:
      'Led a 5-person team to build the official certification website. Engineered the auth system from scratch and optimized Git workflows for 4 development teams.',
    technologies: ['Laravel', 'Livewire', 'Tailwind CSS', 'MySQL'],
    github: 'https://github.com/Ghufrnainun',
    demo: '',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
  },
  {
    title: 'UKM PCC Online Election System',
    description:
      'A secure voting platform with one-time vote validation. Handled complex auth logic and real-time dashboard updates with zero disputes.',
    technologies: ['Laravel', 'Alpine.js', 'MySQL'],
    github: 'https://github.com/Ghufrnainun',
    demo: '',
    image:
      'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=500&fit=crop',
  },
];

export function ProjectsPreview() {
  return (
    <section
      id="projects"
      className="py-24 md:py-32 bg-background relative overflow-hidden"
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-16">
          {/* Header Column */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
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

              <p className="text-sm font-mono text-primary mb-4 tracking-wider uppercase">
                Selected Works
              </p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
                Featured <br /> Projects.
              </h2>
            </motion.div>
          </div>

          {/* Description Column */}
          <div className="lg:col-span-8 flex items-end">
            <motion.p
              className="text-muted-foreground text-lg leading-relaxed max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Highlights of my recent development work. Each project represents
              a unique challenge and a tailored solution.
            </motion.p>
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-32 mb-24">
          {featuredProjects.map((project, index) => (
            <div key={project.title}>
              <ProjectCard project={project} index={index} />
            </div>
          ))}
        </div>

        {/* CTA to Full Projects Page */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Link
            to="/projects"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background rounded-full font-display font-medium text-sm uppercase tracking-wide transition-all hover:bg-foreground/90 active:scale-[0.98]"
          >
            View All Projects
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
