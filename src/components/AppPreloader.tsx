import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';

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
            className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden bg-background text-foreground pointer-events-auto"
            initial={{ opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.015 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.35, ease: easeOutQuint }}
            role="status"
            aria-live="polite"
            aria-label="Loading portfolio"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.18),transparent_26rem),radial-gradient(circle_at_80%_70%,hsl(var(--accent)/0.12),transparent_30rem)]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,hsl(var(--foreground)/0.035)_1px,transparent_1px),linear-gradient(180deg,hsl(var(--foreground)/0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-45" />

            <motion.div
              className="relative flex w-[min(28rem,calc(100vw-3rem))] flex-col gap-7 rounded-[2rem] border border-foreground/10 bg-background/70 p-2 shadow-[inset_0_1px_1px_hsl(var(--foreground)/0.08)] backdrop-blur-md"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: shouldReduceMotion ? 0.1 : 0.45, ease: easeOutQuint }}
            >
              <div className="rounded-[calc(2rem-0.5rem)] bg-foreground/[0.03] px-6 py-7 shadow-[inset_0_1px_1px_hsl(var(--foreground)/0.1)]">
                <div className="flex items-center justify-between gap-6 font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/45">
                  <span>portfolio boot</span>
                  <span className="tabular-nums">00.90s</span>
                </div>

                <div className="mt-8 grid grid-cols-4 gap-2" aria-hidden="true">
                  {[0, 1, 2, 3].map((index) => (
                    <motion.div
                      key={index}
                      className="h-24 rounded-2xl bg-gradient-to-b from-foreground/18 to-foreground/[0.03]"
                      initial={{ opacity: 0.25, scaleY: 0.45 }}
                      animate={{ opacity: [0.25, 1, 0.35], scaleY: [0.45, 1, 0.58] }}
                      transition={{
                        duration: shouldReduceMotion ? 0.1 : 0.65,
                        ease: easeOutQuint,
                        delay: shouldReduceMotion ? 0 : index * 0.06,
                      }}
                      style={{ transformOrigin: 'bottom' }}
                    />
                  ))}
                </div>

                <div className="mt-8 space-y-3">
                  <p className="font-serif text-[clamp(2rem,8vw,4.4rem)] italic leading-[0.9] tracking-[-0.06em] text-foreground [text-wrap:balance]">
                    warming up…
                  </p>
                  <p className="max-w-xs font-mono text-[11px] uppercase tracking-[0.22em] text-foreground/45">
                    preparing motion, canvas, and route shell
                  </p>
                </div>

                <div className="mt-8 h-px overflow-hidden rounded-full bg-foreground/10" aria-hidden="true">
                  <motion.div
                    className="h-full origin-left bg-foreground"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: shouldReduceMotion ? 0.1 : 0.75, ease: easeOutQuint }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
