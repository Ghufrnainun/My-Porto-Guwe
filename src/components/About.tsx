import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowUpRight, FileText, Clock } from 'lucide-react';
import { profile } from '@/data/profile';
import { ContactModal } from '@/components/ContactModal';

export function About() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // 3D Spring Tilt & Glare States
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [timeString, setTimeString] = useState('');

  // Live Semarang Clock (WIB / UTC+7)
  useEffect(() => {
    const updateClock = () => {
      const formatted = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(new Date());
      setTimeString(formatted);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // 3D Spring Physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 22, stiffness: 240, mass: 0.35 };
  const rawRotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6.5, -6.5]), springConfig);
  const rawRotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6.5, 6.5]), springConfig);

  const rotateX = shouldReduceMotion ? 0 : rawRotateX;
  const rotateY = shouldReduceMotion ? 0 : rawRotateY;

  // Specular sheen / dynamic glare
  const glareX = useSpring(useTransform(mouseX, [-0.5, 0.5], [10, 90]), springConfig);
  const glareY = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, 90]), springConfig);
  const glareBackground = useMotionTemplate`radial-gradient(circle 320px at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.55) 0%, rgba(245, 158, 11, 0.22) 35%, transparent 70%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseEnter = () => {
    if (!shouldReduceMotion) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      id="about"
      ref={ref}
      className="relative overflow-hidden bg-background pt-4 pb-16 md:pb-24"
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        {/* Top Editorial Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mb-12 md:mb-16"
        >

          {/* Editorial Display Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-foreground [text-wrap:balance] leading-[1.12]">
            Turning complex systems into calm, dependable software.
          </h1>
        </motion.div>

        {/* Asymmetric Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Refined Interactive Portrait Card with True Z-Depth */}
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div style={{ perspective: 1000 }} className="w-full">
              <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: 'preserve-3d',
                }}
                className="group relative rounded-2xl p-2.5 bg-card/70 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:shadow-[0_24px_60px_rgba(235,94,40,0.15)] cursor-pointer select-none"
              >
                {/* Luminous Ambient Border Gradient */}
                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-primary/50 via-accent/30 to-border/40 opacity-60 transition-all duration-500 group-hover:opacity-100 group-hover:from-primary/80 group-hover:via-amber-500/40 group-hover:to-primary/40 -z-10 blur-[0.5px]" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-card via-card/90 to-card/70 -z-10" />

                {/* Photo Container with Layered Parallax Depth (translateZ: 16px) */}
                <div
                  style={{
                    transform: shouldReduceMotion ? 'none' : 'translateZ(16px)',
                    transformStyle: 'preserve-3d',
                  }}
                  className="overflow-hidden rounded-xl bg-muted relative aspect-[4/5]"
                >
                  <img
                    src="/Photo.webp"
                    alt={profile.name}
                    className="w-full h-full object-cover transition-[transform,filter] duration-500 ease-out filter grayscale contrast-105 group-hover:grayscale-0 group-hover:contrast-100 group-hover:scale-[1.03]"
                  />

                  {/* Dynamic Specular Sheen / Glare Floating on Lens Plane (translateZ: 34px) */}
                  <motion.div
                    className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300 mix-blend-overlay"
                    style={{
                      background: glareBackground,
                      opacity: isHovered && !shouldReduceMotion ? 0.95 : 0,
                      transform: shouldReduceMotion ? 'none' : 'translateZ(34px)',
                    }}
                  />

                  {/* Analog Viewfinder HUD Corner Accents (translateZ: 26px) */}
                  <div
                    style={{
                      transform: shouldReduceMotion ? 'none' : 'translateZ(26px)',
                    }}
                    className="pointer-events-none absolute inset-2.5 flex flex-col justify-between opacity-35 transition-opacity duration-300 group-hover:opacity-90"
                  >
                    <div className="flex justify-between items-start">
                      <span className="size-2 border-t border-l border-white/80" />
                      <span className="size-2 border-t border-r border-white/80" />
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="size-2 border-b border-l border-white/80" />
                      <span className="size-2 border-b border-r border-white/80" />
                    </div>
                  </div>

                  {/* Inner Sharp Rim Outline */}
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/15 rounded-xl pointer-events-none" />
                </div>

                {/* Tactile Location & Live Semarang Clock Tag (translateZ: 12px) */}
                <div
                  style={{
                    transform: shouldReduceMotion ? 'none' : 'translateZ(12px)',
                  }}
                  className="mt-3 px-3.5 py-2.5 rounded-xl bg-background/85 border border-border/60 text-xs font-mono flex flex-wrap items-center justify-between gap-2 text-muted-foreground transition-colors duration-300 group-hover:border-primary/40 shadow-sm"
                >
                  <span className="flex items-center gap-1.5 text-foreground/90 font-medium">
                    <MapPin className="size-3.5 text-primary" />
                    Semarang, ID
                  </span>

                  <div className="flex items-center gap-2 tabular-nums">
                    <span className="inline-flex items-center gap-1.5 text-foreground/90 font-semibold tracking-tight">
                      <Clock className="size-3 text-primary animate-pulse" />
                      {timeString || '--:--:--'}{' '}
                      <span className="text-[10px] text-muted-foreground font-normal">WIB</span>
                    </span>
                    <span className="text-border">·</span>
                    <span className="text-[11px] opacity-75">7.05° S · 110.43° E</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Quick Action CTAs with Emil Polish & Balanced Proportions */}
            <div className="mt-4 grid grid-cols-5 gap-3">
              <button
                type="button"
                onClick={() => setIsContactModalOpen(true)}
                className="group col-span-3 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-b from-primary via-primary to-primary/95 text-primary-foreground font-medium text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_14px_rgba(0,0,0,0.15)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_8px_24px_rgba(235,94,40,0.28)] hover:brightness-105 active:scale-[0.97] transition-[transform,background-color,box-shadow,filter] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer select-none"
              >
                <span>Get in touch</span>
                <ArrowUpRight className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
              <Link
                to="/resume"
                className="group col-span-2 inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-card/85 hover:bg-card border border-border/80 hover:border-primary/40 text-foreground font-medium text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_4px_12px_rgba(0,0,0,0.15)] active:scale-[0.97] transition-[transform,background-color,border-color] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer select-none"
              >
                <FileText className="size-4 text-muted-foreground transition-transform duration-200 ease-out group-hover:scale-110" />
                <span>Resume</span>
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Grounded Human Story */}
          <motion.div
            className="lg:col-span-7 flex flex-col justify-start"
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Story Prose */}
            <div className="space-y-5 text-base sm:text-lg text-muted-foreground leading-relaxed [text-wrap:pretty]">
              <p>
                I'm a fifth-semester Computer Engineering student at Semarang State Polytechnic (Polines). My work lives at the intersection of backend reliability, edge infrastructure, and clean interface engineering, building web products that stay fast and dependable when real users arrive.
              </p>

              <p>
                That craft spans both solo engineering and team delivery. I engineered <strong className="font-medium text-foreground">TempeMail</strong> to handle instant, disposable email workflows on Cloudflare Workers directly at the edge. As lead developer for an institutional certification platform, I coordinated team delivery, designed the database schema, and implemented multi-role authorization. Across client work, I've shipped rental marketplaces and CMS-driven platforms using Next.js, Flutter, and PostgreSQL.
              </p>

              <p>
                I value pragmatic decisions over hype: clear architecture, low-latency APIs, and code that is easy to understand six months down the line. I am actively looking for software engineering internships and collaborative product teams where I can take ownership and deliver solid, production-grade work.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Full-width Availability Tagline Strip (Directly above Tech Stack) */}
        <motion.div
          className="mt-14 md:mt-20 pt-8 border-t border-border/60"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-5 sm:p-6 rounded-2xl bg-card/40 border border-border/60 hover:border-border/90 transition-colors duration-300">
            <div className="flex items-center gap-3.5">
              <span className="size-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <p className="text-base sm:text-lg md:text-xl font-serif text-foreground tracking-tight leading-snug">
                Open for software engineering internships and select freelance collaborations.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsContactModalOpen(true)}
              className="group inline-flex items-center gap-2 self-start sm:self-auto px-4 py-2 rounded-xl bg-secondary/80 hover:bg-secondary border border-border/70 text-xs font-mono uppercase tracking-wider text-foreground transition-[transform,background-color,color] duration-150 ease-out hover:text-primary active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shrink-0 select-none"
            >
              <span>Discuss an opportunity</span>
              <ArrowUpRight className="size-3.5 text-primary transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Interactive Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onOpenChange={setIsContactModalOpen}
      />
    </section>
  );
}
