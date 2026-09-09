import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';
import Logo from '@/components/ui/Logo';

type AppPreloaderProps = {
  children?: ReactNode;
  forceShow?: boolean;
};

const easeOutQuint = [0.22, 1, 0.36, 1] as const;

export function AppPreloader({ children, forceShow = false }: AppPreloaderProps) {
  const shouldReduceMotion = useReducedMotion();
  const [showPreloader, setShowPreloader] = useState(() => {
    // If in browser and already booted this session, don't show unless forced
    if (typeof window !== 'undefined' && !forceShow) {
      try {
        return sessionStorage.getItem('portfolio_booted') !== 'true';
      } catch {
        return true;
      }
    }
    return true;
  });

  useEffect(() => {
    if (!showPreloader) return;

    // Fast, lightweight 0.9s boot sequence compliant with Web Interface Guidelines
    const delay = shouldReduceMotion ? 120 : 900;
    const timer = window.setTimeout(() => {
      setShowPreloader(false);
      try {
        sessionStorage.setItem('portfolio_booted', 'true');
      } catch {
        // Ignore private browsing storage errors
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [shouldReduceMotion, showPreloader]);

  return (
    <>
      {children}
      <AnimatePresence mode="wait">
        {showPreloader && (
          <motion.div
            className="fixed inset-0 z-[10000] flex flex-col items-center justify-center overflow-hidden bg-background text-foreground select-none pointer-events-auto"
            initial={{ opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.35, ease: easeOutQuint }}
            role="status"
            aria-live="polite"
            aria-label="Loading portfolio"
          >
            {/* Atmospheric Background Layers */}
            <div
              className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,hsl(var(--primary)/0.15),transparent_70%)] pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,hsl(var(--accent)/0.09),transparent_50%)] pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,hsl(var(--background)/0.85)_100%)] pointer-events-none"
              aria-hidden="true"
            />

            {/* Centerpiece: Loading SVG with Animated Ring & Brand Mark */}
            <motion.div
              className="relative flex flex-col items-center justify-center"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: shouldReduceMotion ? 0.1 : 0.45, ease: easeOutQuint }}
            >
              {/* Pulsing ambient halo behind logo */}
              <div
                className="absolute size-28 rounded-full bg-primary/20 blur-2xl pointer-events-none animate-pulse"
                aria-hidden="true"
              />

              {/* SVG Ring Loader */}
              <div className="relative flex items-center justify-center size-28 sm:size-32">
                <svg
                  className="absolute inset-0 size-full -rotate-90 pointer-events-none"
                  viewBox="0 0 120 120"
                  aria-hidden="true"
                >
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    className="stroke-foreground/10"
                    strokeWidth="2"
                    fill="none"
                  />
                  <motion.circle
                    cx="60"
                    cy="60"
                    r="52"
                    className="stroke-primary"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray="327"
                    initial={{ strokeDashoffset: 327 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{
                      duration: shouldReduceMotion ? 0.1 : 0.85,
                      ease: easeOutQuint,
                    }}
                  />
                </svg>

                {/* Brand Logo inside the ring */}
                <div className="relative flex items-center justify-center p-4">
                  <Logo className="size-14 sm:size-16 text-primary" animated={!shouldReduceMotion} />
                </div>
              </div>

              {/* Minimalist Loading Label */}
              <motion.div
                className="mt-6 flex items-center gap-2.5 font-mono text-[11px] tracking-[0.28em] text-muted-foreground uppercase"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0.1 : 0.4,
                  delay: shouldReduceMotion ? 0 : 0.15,
                  ease: easeOutQuint,
                }}
              >
                <span className="inline-block size-1.5 rounded-full bg-primary animate-pulse" aria-hidden="true" />
                <span>Loading…</span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
