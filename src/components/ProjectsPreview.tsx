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
    title: 'IMPP Organization Website',
    description:
      'Landing page & CMS for Ikatan Mahasiswa Pemalang Polines. Solo developed with admin panel to manage structure, activities, and gallery.',
    technologies: ['Laravel', 'MySQL', 'Tailwind CSS'],
    github: 'https://github.com/Ghufrnainun',
    demo: 'https://imppolines.my.id/',
    image: '/impp-screenshot.png',
  },
];

export function ProjectsPreview() {
  return (
    <section
      id="projects"
      className="py-24 md:py-32 bg-background relative overflow-hidden"
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start mb-10">
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

          {/* Description Column + CTA */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <motion.p
              className="text-muted-foreground text-lg leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Highlights of my recent development work. Each project represents
              a unique challenge and a tailored solution.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link
                to="/projects"
                className="group inline-flex items-center gap-2 px-5 py-2.5 bg-secondary/50 hover:bg-secondary text-foreground rounded-full font-mono text-xs uppercase tracking-wide transition-all border border-border hover:border-foreground/20"
              >
                View All
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-32">
          {featuredProjects.map((project, index) => (
            <div key={project.title}>
              <ProjectCard project={project} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
