'use client';

import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';
import { ContactModal } from '@/components/ContactModal';
import { toast } from 'sonner';

// Register ScrollTrigger safely for React
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// -------------------------------------------------------------------------
// 2. MAGNETIC BUTTON PRIMITIVE (Zero Dependency)
// -------------------------------------------------------------------------
export type MagneticButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> &
    React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      as?: React.ElementType;
    };

const MagneticButton = React.forwardRef<HTMLElement, MagneticButtonProps>(
  (
    { className, children, as: Component = 'button', ...props },
    forwardedRef,
  ) => {
    const localRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (typeof window === 'undefined') return;
      const element = localRef.current;
      if (!element) return;

      const ctx = gsap.context(() => {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = element.getBoundingClientRect();
          const h = rect.width / 2;
          const w = rect.height / 2;
          const x = e.clientX - rect.left - h;
          const y = e.clientY - rect.top - w;

          gsap.to(element, {
            x: x * 0.4,
            y: y * 0.4,
            rotationX: -y * 0.15,
            rotationY: x * 0.15,
            scale: 1.05,
            ease: 'power2.out',
            duration: 0.4,
          });
        };

        const handleMouseLeave = () => {
          gsap.to(element, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            ease: 'elastic.out(1, 0.3)',
            duration: 1.2,
          });
        };

        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseleave', handleMouseLeave);

        return () => {
          element.removeEventListener('mousemove', handleMouseMove);
          element.removeEventListener('mouseleave', handleMouseLeave);
        };
      }, element);

      return () => ctx.revert();
    }, []);

    return (
      <Component
        ref={(node: HTMLElement | null) => {
          localRef.current = node;
          if (typeof forwardedRef === 'function') {
            forwardedRef(node);
          } else if (forwardedRef) {
            forwardedRef.current = node;
          }
        }}
        className={cn('cursor-pointer', className)}
        {...props}
      >
        {children}
      </Component>
    );
  },
);
MagneticButton.displayName = 'MagneticButton';

// -------------------------------------------------------------------------
// 3. MAIN COMPONENT
// -------------------------------------------------------------------------
const MarqueeItem = () => (
  <div className="flex items-center space-x-12 px-6">
    <span>Full-Stack Engineering</span> <span className="text-primary/60">✦</span>
    <span>System Architecture</span> <span className="text-secondary/60">✦</span>
    <span>API Design</span> <span className="text-primary/60">✦</span>
    <span>Performance Optimization</span> <span className="text-secondary/60">✦</span>
    <span>Clean Code</span> <span className="text-primary/60">✦</span>
    <span>React & Node.js</span> <span className="text-secondary/60">✦</span>
  </div>
);

export function CinematicFooter() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subHeadingRef = useRef<HTMLParagraphElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!wrapperRef.current) return;

    // React strict mode compatible GSAP context cleanup
    const ctx = gsap.context(() => {
      // Background Parallax: smooth vertical translate with scroll
      if (giantTextRef.current) {
        gsap.fromTo(
          giantTextRef.current,
          { y: '8vh' },
          {
            y: '0vh',
            ease: 'none',
            scrollTrigger: {
              trigger: wrapperRef.current,
              start: 'top bottom',
              end: 'bottom bottom',
              scrub: true,
            },
          },
        );
      }

      // Main Content Reveal: triggers once when footer enters viewport (top 95%)
      const elementsToAnimate = [
        headingRef.current,
        subHeadingRef.current,
        linksRef.current,
      ].filter(Boolean);

      if (elementsToAnimate.length > 0) {
        gsap.fromTo(
          elementsToAnimate,
          { y: 24, opacity: 0.2 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: wrapperRef.current,
              start: 'top 95%',
              toggleActions: 'play none none none',
            },
          },
        );
      }
    }, wrapperRef);

    // Refresh ScrollTrigger after route transition and layout shifts
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 350);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [location.pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    const email = 'ghufrnainunajib@gmail.com';
    navigator.clipboard.writeText(email);
    toast.success('Email copied to clipboard! ✦', {
      description: email,
      duration: 3500,
    });
  };

  return (
    <>
      {/* 
        The "Curtain Reveal" Wrapper:
        It sits in standard flow. Because it has clip-path, its contents
        are ONLY visible within its bounding box. 
      */}
      <div
        ref={wrapperRef}
        className="relative h-screen w-full"
        style={{ clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}
      >
        {/* The actual footer stays fixed to the viewport underneath everything */}
        <footer className="fixed bottom-0 left-0 flex h-screen w-full flex-col justify-between overflow-hidden bg-background text-foreground cinematic-footer-wrapper">
          {/* Ambient Light & Grid Background */}
          <div className="footer-aurora absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe rounded-[50%] blur-[80px] pointer-events-none z-0" />
          <div className="footer-bg-grid absolute inset-0 z-0 pointer-events-none" />

          {/* Giant background text */}
          <div
            ref={giantTextRef}
            className="footer-giant-bg-text absolute -bottom-[5vh] inset-x-0 w-full flex justify-center items-center text-center whitespace-nowrap z-0 pointer-events-none select-none"
          >
            GHUFRON
          </div>

          {/* 1. Diagonal Sleek Marquee (Top of footer) */}
          <div className="absolute top-24 -left-[5%] w-[110%] overflow-hidden border-y border-border/50 bg-background/90 py-3.5 z-10 -rotate-2 shadow-xl pointer-events-none select-none">
            <div className="flex w-max animate-footer-scroll-marquee text-xs md:text-sm font-bold tracking-[0.3em] text-muted-foreground uppercase">
              <MarqueeItem />
              <MarqueeItem />
              <MarqueeItem />
              <MarqueeItem />
            </div>
          </div>

          {/* 2. Main Center Content */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 mt-20 w-full max-w-5xl mx-auto">
            <h2
              ref={headingRef}
              className="text-5xl md:text-8xl font-black footer-text-glow tracking-tighter mb-4 text-center"
            >
              Let's work together
            </h2>
            <p
              ref={subHeadingRef}
              className="text-muted-foreground text-center max-w-md mb-12 text-sm md:text-base"
            >
              Have a role or project in mind?
              <br />
              Tell me what you're building or where I could help.
            </p>

            {/* Interactive Magnetic Pills Layout */}
            <div
              ref={linksRef}
              className="flex flex-col items-center gap-6 w-full"
            >
              {/* Primary Action */}
              <div className="flex flex-wrap justify-center gap-4 w-full">
                <MagneticButton
                  as="button"
                  onClick={() => setIsContactModalOpen(true)}
                  aria-label="Open contact form modal"
                  title="Start a Project"
                  className="footer-glass-pill px-10 py-5 min-h-[48px] rounded-full text-foreground font-bold text-sm md:text-base flex items-center gap-3 group outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.96] transition-transform"
                >
                  <svg
                    className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    ></path>
                  </svg>
                  Start a Conversation
                </MagneticButton>
              </div>

              {/* Secondary Text Links */}
              <div className="flex flex-wrap justify-center gap-3 md:gap-6 w-full mt-2">
                <MagneticButton
                  as="a"
                  href="https://www.linkedin.com/in/ghufronainunnajib/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit Ghufron's LinkedIn Profile"
                  title="Visit Ghufron's LinkedIn Profile"
                  className="footer-glass-pill px-6 py-3 min-h-[44px] inline-flex items-center justify-center rounded-full text-muted-foreground font-medium text-xs md:text-sm hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.96] transition-transform"
                >
                  LinkedIn
                </MagneticButton>
                <MagneticButton
                  as="a"
                  href="https://github.com/Ghufrnainun"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit Ghufron's GitHub Profile"
                  title="Visit Ghufron's GitHub Profile"
                  className="footer-glass-pill px-6 py-3 min-h-[44px] inline-flex items-center justify-center rounded-full text-muted-foreground font-medium text-xs md:text-sm hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.96] transition-transform"
                >
                  GitHub
                </MagneticButton>
                <MagneticButton
                  as="a"
                  href="mailto:ghufrnainunajib@gmail.com"
                  onClick={handleCopyEmail}
                  aria-label="Send an email to Ghufron"
                  title="Send an email to Ghufron"
                  className="footer-glass-pill px-6 py-3 min-h-[44px] inline-flex items-center justify-center rounded-full text-muted-foreground font-medium text-xs md:text-sm hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.96] transition-transform"
                >
                  Email
                </MagneticButton>
              </div>
            </div>
          </div>

          {/* 3. Bottom Bar / Credits */}
          <div className="relative z-20 w-full pb-8 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left side: Copyright */}
            <div className="text-muted-foreground text-[10px] md:text-xs font-semibold tracking-widest uppercase order-2 md:order-1 text-center md:text-left">
              © {new Date().getFullYear()} Ghufron. All rights reserved.
            </div>

            {/* Right side: Badge + Back to Top */}
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 order-1 md:order-2">
              {/* "Made with Love" Badge */}
              <div className="footer-glass-pill px-6 py-3 rounded-full flex items-center gap-2 cursor-default border-border/50">
                <span className="text-muted-foreground text-[10px] md:text-xs font-bold uppercase tracking-widest">
                  Crafted with
                </span>
                <span className="animate-footer-heartbeat text-sm md:text-base text-destructive">
                  ❤
                </span>
                <span className="text-muted-foreground text-[10px] md:text-xs font-bold uppercase tracking-widest">
                  by
                </span>
                <span className="text-foreground font-black text-xs md:text-sm tracking-normal ml-1">
                  Ghufron Ainun Najib
                </span>
              </div>

              {/* Back to top */}
              <MagneticButton
                as="button"
                onClick={scrollToTop}
                aria-label="Scroll back to top"
                title="Scroll back to top"
                className="w-12 h-12 rounded-full footer-glass-pill flex items-center justify-center text-muted-foreground hover:text-foreground group outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <svg
                  className="w-5 h-5 transform group-hover:-translate-y-1.5 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  ></path>
                </svg>
              </MagneticButton>
            </div>
          </div>
        </footer>
      </div>

      <ContactModal
        isOpen={isContactModalOpen}
        onOpenChange={setIsContactModalOpen}
      />
    </>
  );
}
