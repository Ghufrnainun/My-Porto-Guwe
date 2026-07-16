import { Github, ExternalLink } from 'lucide-react';
import { ProjectModal } from './ProjectModal';
import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

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
  const isReversed = index % 2 !== 0;

  const cardRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Motion values for 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  // Rotate between -5deg and 5deg
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const rectRef = useRef<DOMRect | null>(null);

  const handleMouseEnter = () => {
    if (cardRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    if (!rectRef.current) {
      if (cardRef.current) {
        rectRef.current = cardRef.current.getBoundingClientRect();
      } else {
        return;
      }
    }
    const rect = rectRef.current;
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    rectRef.current = null; // Clear cache on leave
  };

  return (
    <>
      <motion.div
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: prefersReducedMotion ? 0 : rotateX,
          rotateY: prefersReducedMotion ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
        className="w-full group perspective-1000"
      >
        {/* Outer Shell - Double Bezel Layout */}
        <div 
          className="bg-secondary/15 p-1.5 md:p-2.5 rounded-[2rem] border border-border/10 w-full shadow-lg hover:shadow-soft transition-all duration-500"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Inner Core */}
          <div 
            className="bg-card p-5 md:p-8 rounded-[calc(2rem-0.5rem)] border border-border/40 relative overflow-hidden"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Ambient Background Glow inside the card */}
            <div
              className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-25 pointer-events-none group-hover:scale-150 transition-transform duration-700"
              style={{ backgroundColor: project.color || 'var(--primary)' }}
            />

            <div
              className={`flex flex-col md:flex-row gap-6 md:gap-10 items-stretch ${
                isReversed ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Image Container - Double Bezel Nested */}
              <div className="w-full md:w-[50%] flex-shrink-0 flex items-center justify-center">
                <div
                  className="bg-secondary/30 p-1.5 rounded-[1.5rem] border border-border/10 cursor-pointer overflow-hidden w-full h-full"
                  onClick={() => setIsModalOpen(true)}
                >
                  <div className="aspect-[16/10] rounded-[calc(1.5rem-0.25rem)] overflow-hidden relative w-full h-full">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                  </div>
                </div>
              </div>

              {/* Content Column */}
              <div className="w-full md:w-[50%] flex flex-col justify-between py-1">
                <div>
                  <p className="text-primary font-mono text-[10px] uppercase tracking-[0.2em] font-semibold mb-2">
                    Featured Project
                  </p>

                  <h3
                    className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-foreground mb-4 cursor-pointer hover:text-primary transition-colors leading-tight tracking-tight"
                    onClick={() => setIsModalOpen(true)}
                  >
                    {project.title}
                  </h3>

                  {/* Description Box */}
                  <div className="bg-secondary/40 p-4 md:p-5 rounded-xl border border-border/50 text-muted-foreground text-xs md:text-sm leading-relaxed mb-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] text-wrap-pretty font-sans">
                    <p>{project.description}</p>
                  </div>
                </div>

                <div>
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-[9px] font-mono font-semibold text-muted-foreground bg-secondary/80 rounded-md border border-border/50"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links Row */}
                  <div className="flex items-center gap-3">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-md bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 border border-border/40"
                      aria-label="GitHub"
                    >
                      <Github className="w-4 h-4" strokeWidth={1.5} />
                    </a>
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-md bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 border border-border/40"
                        aria-label="External Link"
                      >
                        <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
                      </a>
                    )}
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="ml-auto text-[10px] font-mono font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider flex items-center gap-1"
                    >
                      <span>Details</span>
                      <span className="text-xs">↗</span>
                    </button>
                  </div>
                </div>
              </div>
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
