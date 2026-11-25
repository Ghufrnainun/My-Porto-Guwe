import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';
import { BRAND_LOGO_PATH, BRAND_LOGO_VIEWBOX } from '@/components/ui/Logo';
import { PreloaderContext } from '@/hooks/usePreloader';

type AppPreloaderProps = {
  children?: ReactNode;
  forceShow?: boolean;
};

const BOOT_STORAGE_KEY = 'portfolio_booted';
const VISITOR_CITY_STORAGE_KEY = 'ganos_visitor_city';
const BOOT_SPLASH_ID = 'boot-splash';
const easeOutExpo = [0.23, 1, 0.32, 1] as const;

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getTimezoneFallbackCity(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const parts = tz.split('/');
    if (parts.length >= 2 && parts[0] !== 'Etc') {
      return parts[parts.length - 1].replace(/_/g, ' ');
    }
  } catch {
    /* ignore */
  }
  return '';
}

function readCachedVisitorCity(): string {
  if (typeof window === 'undefined') return '';
  try {
    return sessionStorage.getItem(VISITOR_CITY_STORAGE_KEY)?.trim() ?? '';
  } catch {
    return '';
  }
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
    if (/^\/town(\/|$)/.test(window.location.pathname)) return false;
    // When the unified inline #boot-splash is already on screen, drive it directly
    // instead of mounting a second overlay (zero jump, single state).
    if (document.getElementById(BOOT_SPLASH_ID)) return false;
    return !hasBootedSession();
  });

  const [isReady, setIsReady] = useState(() => {
    if (typeof window === 'undefined') return true;
    if (forceShow) return false;
    if (/^\/town(\/|$)/.test(window.location.pathname)) return true;
    if (document.getElementById(BOOT_SPLASH_ID)) return false;
    return hasBootedSession();
  });

  const [greeting] = useState(() => getTimeGreeting());
  const [visitorCity, setVisitorCity] = useState(() => readCachedVisitorCity());

  // Resolve visitor city cleanly for the React fallback / preview route
  useEffect(() => {
    if (!showReactPreloader || visitorCity) return;

    let cancelled = false;
    const tzCity = getTimezoneFallbackCity();
    const fallbackTimer = window.setTimeout(() => {
      if (!cancelled && tzCity) {
        setVisitorCity((curr) => curr || tzCity);
      }
    }, 340);

    const controller = new AbortController();
    const abortTimer = window.setTimeout(() => controller.abort(), 650);

    fetch('https://get.geojs.io/v1/ip/geo.json', { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { city?: unknown } | null) => {
        const city = typeof data?.city === 'string' ? data.city.trim() : '';
        if (!cancelled && city) {
          window.clearTimeout(fallbackTimer);
          try {
            sessionStorage.setItem(VISITOR_CITY_STORAGE_KEY, city);
          } catch {
            /* ignore */
          }
          setVisitorCity(city);
        }
      })
      .catch(() => {
        /* Fallback timer handles timezone city silently */
      });

    return () => {
      cancelled = true;
      window.clearTimeout(fallbackTimer);
      window.clearTimeout(abortTimer);
      controller.abort();
    };
  }, [showReactPreloader, visitorCity]);

  useEffect(() => {
    const splash = document.getElementById(BOOT_SPLASH_ID);

    // If explicitly previewing the React preloader, ensure the initial DOM splash is gone.
    if (forceShow && splash) {
      splash.remove();
    }

    // Path 1: Seamless handoff from the single inline #boot-splash rendered at t=0ms.
    if (!forceShow && splash) {
      const elapsed = typeof performance !== 'undefined' ? performance.now() : 0;
      const minTotalMs = shouldReduceMotion ? 220 : 1080;
      const holdDuration = Math.max(shouldReduceMotion ? 120 : 480, Math.round(minTotalMs - elapsed));
      const exitDuration = shouldReduceMotion ? 140 : 340;

      let removeTimer: number | undefined;
      const exitTimer = window.setTimeout(() => {
        setIsReady(true);
        markBootedSession();
        splash.classList.add('is-exiting');
        splash.style.pointerEvents = 'none';
        splash.style.opacity = '0';
        if (!shouldReduceMotion) {
          splash.style.transform = 'scale(1.015)';
        }
        removeTimer = window.setTimeout(() => {
          splash.remove();
        }, exitDuration);
      }, holdDuration);

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
    const delay = shouldReduceMotion ? 220 : 1120;
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
            className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden bg-[#09090b] text-[#f5f5f7] select-none pointer-events-auto"
            initial={{ opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.015 }}
            transition={{ duration: shouldReduceMotion ? 0.14 : 0.34, ease: easeOutExpo }}
            role="status"
            aria-live="polite"
            aria-label="Loading portfolio"
          >
            {/* Subtle overhead ambient falloff */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 540px 360px at 50% 44%, rgba(255, 255, 255, 0.035) 0%, transparent 70%)',
              }}
              aria-hidden="true"
            />

            {/* Minimal Editorial Center Stack */}
            <motion.div
              className="relative z-10 flex flex-col items-center px-6 text-center"
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -5 }}
              transition={{ duration: shouldReduceMotion ? 0.1 : 0.2, ease: easeOutExpo }}
            >
              <motion.svg
                className="h-[23px] w-[28px]"
                viewBox={BRAND_LOGO_VIEWBOX}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                initial={shouldReduceMotion ? { opacity: 0.78 } : { opacity: 0, y: 4 }}
                animate={{ opacity: 0.78, y: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.32, ease: easeOutExpo }}
              >
                <defs>
                  <linearGradient id="gn-react-boot-grad" x1="18%" y1="0%" x2="82%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#a1a1aa" />
                  </linearGradient>
                </defs>
                <path fillRule="evenodd" d={BRAND_LOGO_PATH} fill="url(#gn-react-boot-grad)" />
              </motion.svg>

              <motion.p
                className="mt-4 text-[clamp(22px,3.2vw,30px)] font-[450] leading-[1.25] tracking-[-0.025em] text-[#f5f5f7]/[0.94]"
                initial={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : { opacity: 0, y: 6, filter: 'blur(4px)' }
                }
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.4,
                  delay: shouldReduceMotion ? 0 : 0.07,
                  ease: easeOutExpo,
                }}
              >
                <span>{greeting}</span>
                {visitorCity && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.28, ease: easeOutExpo }}
                  >
                    {` in ${visitorCity}`}
                  </motion.span>
                )}
              </motion.p>

              <motion.p
                className="mt-2.5 text-[12px] font-normal tracking-[0.01em] text-[#f5f5f7]/[0.38]"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.36,
                  delay: shouldReduceMotion ? 0 : 0.15,
                  ease: easeOutExpo,
                }}
              >
                Ghufron Ainun Najib
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PreloaderContext.Provider>
  );
}
