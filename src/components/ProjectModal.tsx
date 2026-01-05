import { useState, useEffect } from 'react';
import {
  X,
  Github,
  ExternalLink,
  Users,
  Zap,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const projectDetails: Record<
  string,
  { role: string; impact: string; timeline: string }
> = {
  'LSP Polines Certification Platform': {
    role: 'Tech Lead',
    impact: '1,000+ Users',
    timeline: '6 Months',
  },
  'IMPP Organization Website': {
    role: 'Solo Developer',
    impact: '60+ Members',
    timeline: '1 Month',
  },
};

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!project) return null;

  const details = projectDetails[project.title] || {
    role: 'Developer',
    impact: 'In Production',
    timeline: 'Completed',
  };

  // Use images array if available, otherwise use single image
  const images = project.images || [project.image];

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Wrapper - Handles Backdrop Click */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="relative w-full max-w-5xl max-h-[90vh] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile Close Button (Floating) */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-[60] p-2 bg-black/50 hover:bg-black/70 rounded-full text-white lg:hidden"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
              {/* Split Layout: Image Left, Content Right */}
              <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
                {/* Left Column - Visual Showcase (60%) */}
                <div className="lg:w-[60%] bg-[#1a1a1a] relative">
                  {/* Image Container */}
                  <div className="aspect-video lg:aspect-auto lg:h-full relative overflow-hidden">
                    <motion.img
                      key={currentImageIndex}
                      src={images[currentImageIndex]}
                      alt={`${project.title} screenshot`}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Image Navigation (if multiple images) */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5 text-white" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                        >
                          <ChevronRight className="w-5 h-5 text-white" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Carousel Dots */}
                  {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentImageIndex
                              ? 'bg-white w-6'
                              : 'bg-white/40 hover:bg-white/60'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Column - Project Data (40%) */}
                <div className="lg:w-[40%] p-8 overflow-y-auto max-h-[60vh] lg:max-h-[90vh]">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white pr-4">
                      {project.title}
                    </h2>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors flex-shrink-0"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {project.description}
                  </p>

                  {/* Impact Grid */}
                  <div className="grid gap-3 mb-6">
                    <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg border border-border">
                      <Users className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          Role
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {details.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg border border-border">
                      <Zap className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          Impact
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {details.impact}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg border border-border">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          Timeline
                        </p>
                        <p className="text-sm font-medium text-white">
                          {details.timeline}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="mb-8">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">
                      Technologies
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs font-mono bg-secondary text-foreground px-3 py-1 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-foreground hover:bg-foreground/90 text-background font-medium py-3 rounded-lg transition-colors"
                  >
                    <Github className="w-5 h-5" />
                    View Source Code
                  </a>

                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full mt-3 border border-border hover:border-foreground/50 font-medium py-3 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
