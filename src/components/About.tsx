import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowUpRight, FileText } from 'lucide-react';
import { profile, education } from '@/data/profile';
import { ContactModal } from '@/components/ContactModal';

export function About() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <section
      id="about"
      ref={ref}
      className="relative overflow-hidden bg-background pt-4 pb-16 md:pb-24"
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        {/* Top Editorial Header & Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mb-12 md:mb-16"
        >
          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs font-mono text-muted-foreground uppercase tracking-wider mb-5">
            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-secondary/80 border border-border text-foreground">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              {profile.availability}
            </span>
            <span className="text-border">/</span>
            <span>{education.university}</span>
            <span className="text-border">/</span>
            <span>Semester {profile.semester}</span>
          </div>

          {/* Editorial Display Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-foreground [text-wrap:balance] leading-[1.12]">
            Turning complex systems into calm, dependable software.
          </h1>
        </motion.div>

        {/* Asymmetric Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Portrait Card & Direct Actions */}
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="group relative rounded-2xl p-2.5 bg-gradient-to-b from-card via-card/70 to-card/40 border border-border/80 shadow-2xl shadow-black/40 ring-1 ring-white/5">
              {/* Photo */}
              <div className="overflow-hidden rounded-xl bg-muted relative aspect-[4/5]">
                <img
                  src="/Photo.webp"
                  alt={profile.name}
                  className="w-full h-full object-cover transition-all duration-700 filter grayscale contrast-105 group-hover:grayscale-0 group-hover:contrast-100 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl pointer-events-none" />
              </div>

              {/* Tactile Location & Coordinates Tag */}
              <div className="mt-3 px-3 py-2 rounded-lg bg-background/80 border border-border/60 text-xs font-mono flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-1.5 text-foreground/90">
                  <MapPin className="size-3.5 text-primary" />
                  Semarang, Indonesia
                </span>
                <span className="tabular-nums opacity-75">7.05° S · 110.43° E</span>
              </div>
            </div>

            {/* Quick Action CTAs */}
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsContactModalOpen(true)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm transition-all duration-200 hover:brightness-110 active:scale-[0.96]"
              >
                Get in touch
                <ArrowUpRight className="size-4" />
              </button>
              <Link
                to="/resume"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-secondary/80 hover:bg-secondary border border-border/70 text-foreground font-medium text-sm transition-all duration-200 active:scale-[0.96]"
              >
                <FileText className="size-4 text-muted-foreground" />
                Resume
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
                I'm a fifth-semester Computer Engineering student at Semarang State Polytechnic (Polines). My work lives at the intersection of backend reliability, edge infrastructure, and clean interface engineering—building web products that stay fast and dependable when real users arrive.
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-5 sm:p-6 rounded-2xl bg-card/40 border border-border/60">
            <div className="flex items-center gap-3.5">
              <span className="size-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <p className="text-base sm:text-lg md:text-xl font-serif text-foreground tracking-tight leading-snug">
                Open for software engineering internships and select freelance collaborations.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsContactModalOpen(true)}
              className="inline-flex items-center gap-2 self-start sm:self-auto px-4 py-2 rounded-xl bg-secondary/80 hover:bg-secondary border border-border/70 text-xs font-mono uppercase tracking-wider text-foreground transition-all duration-200 hover:text-primary active:scale-[0.96] shrink-0"
            >
              <span>Discuss an opportunity</span>
              <ArrowUpRight className="size-3.5 text-primary" />
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
