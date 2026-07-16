import { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Code2,
  ExternalLink,
  Github,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

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

const modalEase = [0.32, 0.72, 0, 1] as const;

function MetaRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: string;
}) {
  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.045] p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] transition-all duration-500 ease-premium hover:-translate-y-0.5 hover:border-primary/25 hover:bg-white/[0.06]">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/[0.055] text-foreground/70 transition-colors duration-500 group-hover:text-primary">
        <Icon className="size-4" strokeWidth={1.45} />
      </span>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

function ModalLink({
  href,
  children,
  variant = 'primary',
}: {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'ghost';
}) {
  const classes =
    variant === 'primary'
      ? 'border-foreground bg-foreground text-background hover:bg-foreground/90'
      : 'border-white/15 bg-white/[0.035] text-foreground hover:border-primary/30 hover:text-primary';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex w-full items-center justify-center gap-3 rounded-xl border px-5 py-3 text-sm font-semibold transition-all duration-700 ease-premium hover:-translate-y-0.5 active:scale-[0.98] ${classes}`}
    >
      {children}
      <ArrowUpRight className="size-4 transition-transform duration-700 ease-premium group-hover:translate-x-1 group-hover:-translate-y-0.5" />
    </a>
  );
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) setCurrentImageIndex(0);
  }, [isOpen, project?.title]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!project) return null;

  const details = projectDetails[project.title] || {
    role: 'Developer',
    impact: 'In Production',
    timeline: 'Completed',
  };
  const images = project.images?.length ? project.images : [project.image];
  const activeImage = images[currentImageIndex];

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
          <motion.button
            type="button"
            aria-label="Close project modal"
            className="fixed inset-0 z-50 cursor-default overflow-hidden bg-black/82"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: modalEase }}
            onClick={onClose}
          >
            <img
              src={activeImage}
              alt=""
              className="size-full scale-110 object-cover opacity-20 blur-xl"
            />
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,hsl(var(--primary)/0.22),transparent_30%),linear-gradient(180deg,rgba(0,0,0,0.55),rgba(0,0,0,0.92))]" />
          </motion.button>

          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.article
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-modal-title"
              className="relative flex max-h-[90dvh] w-full max-w-7xl flex-col overflow-hidden rounded-[1.5rem] border border-white/12 bg-card shadow-[0_60px_180px_-90px_hsl(var(--primary)/0.85)] md:rounded-[2rem] lg:grid lg:grid-cols-[minmax(0,1fr)_420px]"
              initial={{ opacity: 0, y: 42, scale: 0.96, filter: 'blur(14px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 24, scale: 0.98, filter: 'blur(8px)' }}
              transition={{ duration: 0.7, ease: modalEase }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative min-h-[280px] overflow-hidden bg-[#080808] p-3 md:min-h-[430px] md:p-5 lg:min-h-[660px]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,hsl(var(--primary)/0.18),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_34%)]" />
                <div className="relative h-full overflow-hidden rounded-[1.15rem] border border-white/10 bg-black/35 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] md:rounded-[1.5rem]">
                  <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between border-b border-white/10 bg-black/35 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-red-400/70" />
                      <span className="size-2 rounded-full bg-yellow-300/70" />
                      <span className="size-2 rounded-full bg-primary/80" />
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/55">
                      Case file
                    </span>
                  </div>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    src={activeImage}
                    alt={`${project.title} screenshot`}
                    className="absolute inset-0 size-full object-cover pt-10"
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.55, ease: modalEase }}
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-background/55 via-transparent to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-end justify-between gap-3">
                    <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3">
                      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-primary">
                        Preview
                      </p>
                      <p className="mt-1 max-w-sm text-sm font-semibold text-white">
                        {project.title}
                      </p>
                    </div>
                    <div className="rounded-full border border-white/10 bg-black/50 px-3 py-1 font-mono text-[10px] text-white/70">
                      {currentImageIndex + 1}/{images.length}
                    </div>
                  </div>

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/45 text-white transition-all duration-500 ease-premium hover:bg-black/65 active:scale-[0.98]"
                      aria-label="Previous project image"
                    >
                      <ChevronLeft className="size-5" strokeWidth={1.5} />
                    </button>
                    <button
                      type="button"
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/45 text-white transition-all duration-500 ease-premium hover:bg-black/65 active:scale-[0.98]"
                      aria-label="Next project image"
                    >
                      <ChevronRight className="size-5" strokeWidth={1.5} />
                    </button>
                    <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
                      {images.map((image, index) => (
                        <button
                          type="button"
                          key={image}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`h-1.5 rounded-full transition-all duration-500 ease-premium ${
                            index === currentImageIndex
                              ? 'w-8 bg-white'
                              : 'w-1.5 bg-white/45 hover:bg-white/70'
                          }`}
                          aria-label={`Show project image ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
                </div>
              </div>

              <div className="relative flex min-h-0 flex-col overflow-y-auto border-t border-white/10 bg-[#101010] lg:border-l lg:border-t-0">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/[0.045] to-transparent" />
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute right-5 top-5 z-20 grid size-9 place-items-center rounded-full text-muted-foreground transition-all duration-500 ease-premium hover:bg-white/[0.07] hover:text-foreground active:scale-[0.98]"
                  aria-label="Close modal"
                >
                  <X className="size-5" strokeWidth={1.4} />
                </button>

                <div className="relative p-6 pb-0 md:p-8 md:pb-0">
                  <div className="pr-10">
                    <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
                      Featured project
                    </span>
                    <h2
                      id="project-modal-title"
                      className="mt-5 font-serif text-3xl font-bold leading-[0.98] text-foreground md:text-4xl"
                    >
                      {project.title}
                    </h2>
                  </div>

                  <p className="mt-6 text-sm leading-7 text-muted-foreground md:text-[15px]">
                    {project.description}
                  </p>

                  <div className="mt-6 grid gap-3">
                    <MetaRow icon={Users} label="Role" value={details.role} />
                    <MetaRow icon={Zap} label="Impact" value={details.impact} />
                    <MetaRow
                      icon={Calendar}
                      label="Timeline"
                      value={details.timeline}
                    />
                  </div>

                  <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                    <div className="flex items-center gap-2">
                      <Code2 className="size-4 text-primary" strokeWidth={1.45} />
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        Technologies
                      </p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 font-mono text-[10px] font-semibold text-foreground/85 transition-colors duration-500 hover:border-primary/25 hover:text-primary"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="sticky bottom-0 mt-8 space-y-3 border-t border-white/10 bg-[#101010]/95 p-6 shadow-[0_-18px_48px_rgba(0,0,0,0.35)] md:p-8">
                  <ModalLink href={project.github}>
                    <Github className="size-4" strokeWidth={1.5} />
                    View Source Code
                  </ModalLink>
                  {project.demo && (
                    <ModalLink href={project.demo} variant="ghost">
                      <ExternalLink className="size-4" strokeWidth={1.5} />
                      Live Demo
                    </ModalLink>
                  )}
                </div>
              </div>
            </motion.article>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
