import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';
import { BRAND_LOGO_PATH, BRAND_LOGO_VIEWBOX } from '@/components/ui/Logo';
import { PreloaderContext } from '@/hooks/usePreloader';

type AppPreloaderProps = {
  children?: ReactNode;
  forceShow?: boolean;
};

const BOOT_STORAGE_KEY = 'portfolio_booted';
const BOOT_SPLASH_ID = 'boot-splash';
const BOOT_BAR_ID = 'boot-splash-bar';
const easeOutQuint = [0.22, 1, 0.36, 1] as const;

function readCurrentScaleX(el: HTMLElement): number {
  const transform = window.getComputedStyle(el).transform;
  if (!transform || transform === 'none') return 0.35;
  const match = transform.match(/^matrix\(([^,]+),/);
  const parsed = match ? Number.parseFloat(match[1]) : 0.35;
  if (!Number.isFinite(parsed)) return 0.35;
  return Math.min(0.95, Math.max(0.08, parsed));
}

function hasBootedSession(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return sessionStorage.getItem(BOOT_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function markBootedSession() {
  try {
    sessionStorage.setItem(BOOT_STORAGE_KEY, 'true');
  } catch {
    // Ignore private browsing storage errors
  }
}

export function AppPreloader({ children, forceShow = false }: AppPreloaderProps) {
  const shouldReduceMotion = useReducedMotion();

  const [showReactPreloader, setShowReactPreloader] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (forceShow) return true;
    // When the unified inline #boot-splash is already on screen, drive it directly
    // instead of mounting a second overlay (zero jump, single state).
    if (document.getElementById(BOOT_SPLASH_ID)) return false;
    return !hasBootedSession();
  });

  const [isReady, setIsReady] = useState(() => {
    if (typeof window === 'undefined') return true;
    if (forceShow) return false;
    if (document.getElementById(BOOT_SPLASH_ID)) return false;
    return hasBootedSession();
  });

  useEffect(() => {
    const splash = document.getElementById(BOOT_SPLASH_ID);

    // If explicitly previewing the React preloader, ensure the initial DOM splash is gone.
    if (forceShow && splash) {
      splash.remove();
    }

    // Path 1: Seamless handoff from the single inline #boot-splash rendered at t=0ms.
    if (!forceShow && splash) {
      const bar = document.getElementById(BOOT_BAR_ID);
      const elapsed = typeof performance !== 'undefined' ? performance.now() : 0;
      const fillDuration = shouldReduceMotion ? 80 : Math.max(360, Math.round(760 - elapsed));
      const holdDuration = shouldReduceMotion ? 40 : 120;
      const exitDuration = shouldReduceMotion ? 120 : 400;

      if (bar) {
        const currentScale = readCurrentScaleX(bar);
        bar.style.animation = 'none';
        bar.style.transform = `scaleX(${currentScale})`;
        // Commit start scale before transitioning to 100%.
        void bar.offsetWidth;
        bar.style.transition = `transform ${fillDuration}ms cubic-bezier(0.22, 1, 0.36, 1)`;
        bar.style.transform = 'scaleX(1)';
      }

      let removeTimer: number | undefined;
      const exitTimer = window.setTimeout(() => {
        setIsReady(true);
        markBootedSession();
        splash.style.pointerEvents = 'none';
        splash.style.opacity = '0';
        if (!shouldReduceMotion) {
          splash.style.transform = 'scale(1.025)';
        }
        removeTimer = window.setTimeout(() => {
          splash.remove();
        }, exitDuration);
      }, fillDuration + holdDuration);

      return () => {
        window.clearTimeout(exitTimer);
        if (removeTimer !== undefined) {
          window.clearTimeout(removeTimer);
        }
      };
    }

    // Path 2: Already booted this session and not forced.
    if (!showReactPreloader) {
      setIsReady(true);
      return;
    }

    // Path 3: Preview route (/preview-preloader-boot) or fallback when #boot-splash isn't present.
    const delay = shouldReduceMotion ? 140 : 920;
    const timer = window.setTimeout(() => {
      setShowReactPreloader(false);
      setIsReady(true);
      if (!forceShow) {
        markBootedSession();
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [forceShow, shouldReduceMotion, showReactPreloader]);

  return (
    <PreloaderContext.Provider value={{ isReady }}>
      {children}
      <AnimatePresence mode="wait">
        {showReactPreloader && (
          <motion.div
            className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden bg-[#070709] select-none pointer-events-auto"
            initial={{ opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.025 }}
            transition={{ duration: shouldReduceMotion ? 0.12 : 0.4, ease: easeOutQuint }}
            role="status"
            aria-live="polite"
            aria-label="Starting GanOS"
          >
            {/* Atmospheric Warm Spotlight & Edge Vignette */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 460px 340px at 50% 46%, rgba(217, 119, 54, 0.14) 0%, rgba(217, 119, 54, 0.04) 45%, transparent 72%)',
              }}
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 80% 75% at 50% 50%, transparent 45%, rgba(0, 0, 0, 0.58) 100%)',
              }}
              aria-hidden="true"
            />

            {/* Unified Center Stack */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative flex items-center justify-center">
                <div
                  className="pointer-events-none absolute h-[112px] w-[148px] rounded-full blur-[20px]"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(217, 119, 54, 0.24) 0%, transparent 70%)',
                  }}
                  aria-hidden="true"
                />
                <svg
                  className="relative h-[63px] w-[78px]"
                  style={{
                    filter:
                      'drop-shadow(0 0 22px rgba(217, 119, 54, 0.28)) drop-shadow(0 8px 20px rgba(0, 0, 0, 0.55))',
                  }}
                  viewBox={BRAND_LOGO_VIEWBOX}
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="gn-react-boot-grad" x1="15%" y1="5%" x2="85%" y2="95%">
                      <stop offset="0%" stopColor="#f4b782" />
                      <stop offset="48%" stopColor="#d97736" />
                      <stop offset="100%" stopColor="#a8501c" />
                    </linearGradient>
                    <linearGradient id="gn-react-boot-sheen" x1="0%" y1="0%" x2="100%" y2="25%">
                      <stop offset="0%" stopColor="#fff4e8" stopOpacity="0" />
                      <stop offset="40%" stopColor="#fff4e8" stopOpacity="0" />
                      <stop offset="50%" stopColor="#fff4e8" stopOpacity="0.58" />
                      <stop offset="60%" stopColor="#fff4e8" stopOpacity="0" />
                      <stop offset="100%" stopColor="#fff4e8" stopOpacity="0" />
                    </linearGradient>
                    <path id="gn-react-boot-path" fillRule="evenodd" d={BRAND_LOGO_PATH} />
                    <mask
                      id="gn-react-boot-mask"
                      maskUnits="userSpaceOnUse"
                      x="207"
                      y="223"
                      width="2243"
                      height="1811"
                    >
                      <use href="#gn-react-boot-path" fill="#ffffff" />
                    </mask>
                  </defs>
                  <use href="#gn-react-boot-path" fill="url(#gn-react-boot-grad)" />
                  {!shouldReduceMotion && (
                    <g mask="url(#gn-react-boot-mask)">
                      <motion.rect
                        x="207"
                        y="223"
                        width="2243"
                        height="1811"
                        fill="url(#gn-react-boot-sheen)"
                        initial={{ x: -2400 }}
                        animate={{ x: 2400 }}
                        transition={{
                          duration: 1.4,
                          ease: [0.4, 0, 0.2, 1],
                          repeat: Infinity,
                          repeatDelay: 0.7,
                        }}
                      />
                    </g>
                  )}
                </svg>
              </div>

              {/* Sleek macOS-style horizontal boot bar */}
              <div
                className="mt-[30px] h-[4px] w-[176px] overflow-hidden rounded-full bg-white/[0.09] shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.08)]"
                aria-hidden="true"
              >
                <motion.div
                  className="h-full w-full origin-left rounded-full shadow-[0_0_12px_rgba(217,119,54,0.55)]"
                  style={{
                    background:
                      'linear-gradient(90deg, #b55920 0%, #d97736 58%, #f6c08f 100%)',
                  }}
                  initial={{ scaleX: shouldReduceMotion ? 0.65 : 0.06 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: shouldReduceMotion ? 0.1 : 0.8,
                    ease: easeOutQuint,
                  }}
                />
              </div>

              {/* Understated GanOS wordmark */}
              <span className="mt-4 pl-[0.28em] font-sans text-[11px] font-medium tracking-[0.28em] text-white/[0.38] uppercase">
                GanOS
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PreloaderContext.Provider>
  );
}
