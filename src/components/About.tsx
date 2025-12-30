import { MapPin } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef, useState, useCallback } from 'react';

// Stats data
const stats = [
  { label: 'Focus', value: 'Full-Stack' },
  { label: 'Status', value: 'Student', isBadge: true },
];

// BentoCard component with spotlight hover effect
interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

function BentoCard({ children, className = '', delay = 0 }: BentoCardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update mouse position for spotlight effect
    setMousePos({ x, y });

    // Subtle tilt (max ±3 degrees)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = ((y - centerY) / centerY) * -3;
    const tiltY = ((x - centerX) / centerX) * 3;

    setTilt({ x: tiltX, y: tiltY });
  }, []);

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      className={`
        relative overflow-hidden rounded-2xl
        bg-card border border-border
        shadow-card
        transition-all duration-300 ease-out
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${
          tilt.y
        }deg) scale(${isHovered ? 1.01 : 1})`,
      }}
    >
      {/* Spotlight Effect - Only visible on hover (Desktop only) */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 hidden md:block"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(20, 184, 166, 0.08), transparent 40%)`,
        }}
      />
      {children}
    </motion.div>
  );
}

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const biographyText =
    "I build web applications that solve real operational problems. Currently leading a 5-person development team for my polytechnic's official certification platform. My approach to code is pragmatic: I value ";

  return (
    <section
      id="about"
      ref={ref}
      className="py-32 md:py-48 relative overflow-hidden bg-background"
    >
      {/* Clean background - no orbs */}

      <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        {/* Section Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-muted-foreground font-mono text-sm mb-2">
            Who I Am
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            About Me
          </h2>
        </motion.div>

        {/* Bento Grid - 60/40 Split */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column - Main Content (3/5) */}
          <BentoCard className="lg:col-span-3 p-8" delay={0.1}>
            <div className="h-full flex flex-col justify-center">
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                {biographyText}
                <span className="text-foreground font-medium">
                  clean architecture
                </span>
                ,{' '}
                <span className="text-foreground font-medium">tested code</span>
                , and{' '}
                <span className="text-foreground font-medium">
                  systems that scale
                </span>
                .
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {['Laravel', 'React', 'Next.js', 'Tailwind'].map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-1.5 text-sm font-mono bg-secondary rounded-full text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </BentoCard>

          {/* Right Column - Two stacked cards (2/5) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Top Right Card - Profile */}
            <BentoCard className="p-6 flex-1" delay={0.2}>
              <div className="h-full flex items-center gap-4">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <img
                    src="Photo.png"
                    alt="Ghufron A.N."
                    className="w-20 h-20 rounded-full object-cover ring-2 ring-border"
                  />
                </motion.div>

                {/* Name & Location */}
                <div>
                  <h3 className="text-xl font-bold mb-1">Ghufron A.N.</h3>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Semarang, ID</span>
                  </div>
                </div>
              </div>
            </BentoCard>

            {/* Bottom Right Card - Quick Stats */}
            <BentoCard className="p-6 flex-1" delay={0.3}>
              <div className="h-full flex flex-col justify-center space-y-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <span className="text-muted-foreground text-sm">
                      {stat.label}
                    </span>
                    {stat.isBadge ? (
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-secondary text-foreground border border-border">
                        {stat.value}
                      </span>
                    ) : (
                      <span className="font-semibold">{stat.value}</span>
                    )}
                  </motion.div>
                ))}
              </div>
            </BentoCard>
          </div>
        </div>
      </div>
    </section>
  );
}
