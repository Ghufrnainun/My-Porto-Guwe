import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  playPanelOpenSound,
  playStepSound,
  playToggleSound,
} from '@/lib/soundEffects';
import type { OsAppId, OsLanguage } from '@/components/os/OsShellContext';

export interface QuickStartGuideProps {
  isOpen: boolean;
  language: OsLanguage;
  onLanguageChange: (lang: OsLanguage) => void;
  onOpenApp: (id: OsAppId) => void;
  onOpenSpotlight: () => void;
  onClose: () => void;
}

type TourStepId = 'desktop' | 'dock' | 'menubar';

interface TourStep {
  id: TourStepId;
  titleEn: string;
  titleId: string;
  bodyEn: string;
  bodyId: string;
  quickActionLabelEn?: string;
  quickActionLabelId?: string;
}

const TOUR_STEPS: readonly TourStep[] = [
  {
    id: 'desktop',
    titleEn: 'Start with CV & Projects',
    titleId: 'Mulai dari CV & Proyek',
    bodyEn:
      'Double-click CV.pdf or Projects here to jump straight into my resume and selected work.',
    bodyId:
      'Klik 2× CV.pdf atau Projects di sini untuk langsung buka resume dan proyek pilihan.',
    quickActionLabelEn: 'Open CV.pdf',
    quickActionLabelId: 'Buka CV.pdf',
  },
  {
    id: 'dock',
    titleEn: 'All apps live in the Dock',
    titleId: 'Semua app ada di Dock',
    bodyEn:
      'Switch between Finder, About, Writing Log, Terminal, Mail, and System Settings below.',
    bodyId:
      'Akses Finder, About, Blog, Terminal, Mail, dan System Settings langsung dari bawah.',
  },
  {
    id: 'menubar',
    titleEn: 'Instant search & guide',
    titleId: 'Cari cepat & panduan',
    bodyEn:
      'Press ⌘K anytime to search projects and apps, or click ? to replay this tour.',
    bodyId:
      'Tekan ⌘K kapan aja buat cari proyek & app, atau klik ? untuk mengulang panduan ini.',
    quickActionLabelEn: 'Try Spotlight (⌘K)',
    quickActionLabelId: 'Coba Spotlight (⌘K)',
  },
] as const;

interface TargetRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

const CARD_WIDTH = 292;
const CARD_EST_HEIGHT = 172;
const VIEWPORT_PAD = 12;
const TARGET_GAP = 14;
const EASE_OUT_EXPO = [0.23, 1, 0.32, 1] as const;

function measureTourTarget(stepId: TourStepId): TargetRect | null {
  if (typeof window === 'undefined') return null;

  if (stepId === 'desktop') {
    const desktopIcons = Array.from(
      document.querySelectorAll<HTMLElement>('[data-tour-desktop-icon="true"]')
    ).filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });

    if (desktopIcons.length > 0) {
      let minLeft = Infinity;
      let minTop = Infinity;
      let maxRight = -Infinity;
      let maxBottom = -Infinity;
      for (const el of desktopIcons) {
        const r = el.getBoundingClientRect();
        minLeft = Math.min(minLeft, r.left);
        minTop = Math.min(minTop, r.top);
        maxRight = Math.max(maxRight, r.right);
        maxBottom = Math.max(maxBottom, r.bottom);
      }
      return {
        left: minLeft - 6,
        top: minTop - 6,
        width: maxRight - minLeft + 12,
        height: maxBottom - minTop + 12,
      };
    }

    const mobileRow = document.querySelector<HTMLElement>(
      '[data-tour-target="desktop-icons-mobile"]'
    );
    if (mobileRow) {
      const r = mobileRow.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        return {
          left: r.left - 4,
          top: r.top - 4,
          width: r.width + 8,
          height: r.height + 8,
        };
      }
    }
    return null;
  }

  if (stepId === 'dock') {
    const dockEl =
      document.querySelector<HTMLElement>('[data-tour-target="dock"] nav') ??
      document.querySelector<HTMLElement>('[data-tour-target="dock"] > *');
    if (dockEl) {
      const r = dockEl.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        return {
          left: r.left - 4,
          top: r.top - 4,
          width: r.width + 8,
          height: r.height + 8,
        };
      }
    }
    return null;
  }

  if (stepId === 'menubar') {
    const controlsEl = document.querySelector<HTMLElement>(
      '[data-tour-target="menubar-controls"]'
    );
    if (controlsEl) {
      const r = controlsEl.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        return {
          left: r.left - 4,
          top: r.top - 2,
          width: r.width + 8,
          height: r.height + 4,
        };
      }
    }
    return null;
  }

  return null;
}

function computeCardPosition(
  stepId: TourStepId,
  target: TargetRect | null
): { x: number; y: number; origin: string } {
  if (typeof window === 'undefined') {
    return { x: 24, y: 64, origin: 'center' };
  }

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const width = Math.min(CARD_WIDTH, vw - VIEWPORT_PAD * 2);

  const clampX = (rawX: number) =>
    Math.max(VIEWPORT_PAD, Math.min(rawX, vw - width - VIEWPORT_PAD));
  const clampY = (rawY: number) =>
    Math.max(42, Math.min(rawY, vh - CARD_EST_HEIGHT - VIEWPORT_PAD));

  if (!target) {
    return {
      x: clampX((vw - width) / 2),
      y: clampY(vh * 0.24),
      origin: 'center',
    };
  }

  if (stepId === 'desktop') {
    // Desktop: float neatly to the left of the right-edge desktop icons
    if (vw >= 640 && target.left > width + TARGET_GAP + VIEWPORT_PAD) {
      return {
        x: clampX(target.left - width - TARGET_GAP),
        y: clampY(target.top + 8),
        origin: 'top right',
      };
    }
    // Mobile: float neatly above the 4-icon shortcut row
    return {
      x: clampX((vw - width) / 2),
      y: clampY(target.top - CARD_EST_HEIGHT - TARGET_GAP),
      origin: 'bottom center',
    };
  }

  if (stepId === 'dock') {
    return {
      x: clampX(target.left + target.width / 2 - width / 2),
      y: clampY(target.top - CARD_EST_HEIGHT - TARGET_GAP),
      origin: 'bottom center',
    };
  }

  // menubar: drop neatly right below the ? + Spotlight controls
  return {
    x: clampX(target.left + target.width - width),
    y: clampY(target.top + target.height + 10),
    origin: 'top right',
  };
}

export const QuickStartGuide: React.FC<QuickStartGuideProps> = ({
  isOpen,
  language,
  onLanguageChange,
  onOpenApp,
  onOpenSpotlight,
  onClose,
}) => {
  const reduceMotion = useReducedMotion();
  const isId = language === 'id';
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);

  const step = TOUR_STEPS[stepIndex] ?? TOUR_STEPS[0];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === TOUR_STEPS.length - 1;

  // Reset to step 0 every time the tour opens
  useEffect(() => {
    if (isOpen) {
      setStepIndex(0);
    }
  }, [isOpen]);

  const updateMeasurement = useCallback(() => {
    if (!isOpen) return;
    setTargetRect(measureTourTarget(step.id));
  }, [isOpen, step.id]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    updateMeasurement();
    const rafId = window.requestAnimationFrame(updateMeasurement);
    window.addEventListener('resize', updateMeasurement);
    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateMeasurement);
    };
  }, [isOpen, updateMeasurement]);

  const handleNext = useCallback(() => {
    if (isLast) {
      playPanelOpenSound(false);
      onClose();
    } else {
      playStepSound(true);
      setStepIndex((curr) => Math.min(curr + 1, TOUR_STEPS.length - 1));
    }
  }, [isLast, onClose]);

  const handleBack = useCallback(() => {
    playStepSound(false);
    setStepIndex((curr) => Math.max(curr - 1, 0));
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleNext();
      } else if (event.key === 'ArrowLeft' && !isFirst) {
        event.preventDefault();
        handleBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFirst, onClose, handleNext, handleBack]);

  const cardPos = computeCardPosition(step.id, targetRect);

  const handleQuickAction = () => {
    if (step.id === 'desktop') {
      onClose();
      onOpenApp('resume');
    } else if (step.id === 'menubar') {
      onClose();
      onOpenSpotlight();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Subtle non-blocking highlight ring around the active UI element */}
          {targetRect && (
            <motion.div
              aria-hidden="true"
              initial={
                reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }
              }
              animate={{
                opacity: 1,
                scale: 1,
                x: targetRect.left,
                y: targetRect.top,
                width: targetRect.width,
                height: targetRect.height,
              }}
              exit={{ opacity: 0, transition: { duration: 0.14 } }}
              transition={{
                duration: reduceMotion ? 0.12 : 0.24,
                ease: EASE_OUT_EXPO,
              }}
              style={{ left: 0, top: 0 }}
              className="pointer-events-none fixed z-[34] rounded-[16px] ring-2 ring-[#0a84ff]/85 shadow-[0_0_0_4px_rgba(10,132,255,0.18),0_0_24px_rgba(10,132,255,0.22)]"
            />
          )}

          {/* Compact Anchored Tour Popover */}
          <motion.aside
            role="region"
            aria-label={isId ? 'Panduan Singkat' : 'Quick Tour'}
            initial={
              reduceMotion
                ? { opacity: 0, x: cardPos.x, y: cardPos.y }
                : { opacity: 0, scale: 0.95, x: cardPos.x, y: cardPos.y + 6 }
            }
            animate={{
              opacity: 1,
              scale: 1,
              x: cardPos.x,
              y: cardPos.y,
            }}
            exit={
              reduceMotion
                ? { opacity: 0, transition: { duration: 0.12 } }
                : {
                    opacity: 0,
                    scale: 0.96,
                    transition: { duration: 0.14, ease: EASE_OUT_EXPO },
                  }
            }
            transition={{
              duration: reduceMotion ? 0.12 : 0.24,
              ease: EASE_OUT_EXPO,
            }}
            style={{
              left: 0,
              top: 0,
              transformOrigin: cardPos.origin,
            }}
            className={cn(
              'pointer-events-auto fixed z-[36] w-[min(292px,calc(100vw-24px))]',
              'rounded-[18px] bg-[#f5f5f7]/[0.94] p-3.5 text-[#111216] ring-1 ring-black/[0.12]',
              'shadow-[0_18px_48px_-10px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.65)]',
              'backdrop-blur-2xl backdrop-saturate-150',
              'dark:bg-[#19191d]/[0.92] dark:text-[#f5f5f7] dark:ring-white/[0.14]',
              'dark:shadow-[0_22px_56px_-10px_rgba(0,0,0,0.72),inset_0_1px_0_rgba(255,255,255,0.12)]'
            )}
          >
            {/* Top Meta Row: Step counter + optional EN/ID switch on Step 1 + Close */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[10.5px] font-semibold tabular-nums text-[#0066cc] dark:text-[#66b2ff]">
                  {stepIndex + 1} / {TOUR_STEPS.length}
                </span>
                <div className="flex items-center gap-1" aria-hidden="true">
                  {TOUR_STEPS.map((item, idx) => (
                    <span
                      key={item.id}
                      className={cn(
                        'h-1 rounded-full transition-[width,background-color] duration-200 ease-smooth-out',
                        idx === stepIndex
                          ? 'w-3.5 bg-[#0a84ff]'
                          : 'w-1 bg-black/15 dark:bg-white/20'
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1">
                {isFirst && (
                  <div
                    role="group"
                    aria-label={isId ? 'Bahasa' : 'Language'}
                    className="inline-flex items-center rounded-full bg-black/[0.06] p-0.5 text-[10px] font-medium dark:bg-white/[0.08]"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (language !== 'en') {
                          playToggleSound(false);
                          onLanguageChange('en');
                        }
                      }}
                      aria-pressed={language === 'en'}
                      className={cn(
                        'rounded-full px-1.5 py-[1px] transition-[background-color,color] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff]',
                        language === 'en'
                          ? 'bg-white text-black shadow-sm dark:bg-white/20 dark:text-white'
                          : 'text-black/55 dark:text-white/55'
                      )}
                    >
                      EN
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (language !== 'id') {
                          playToggleSound(true);
                          onLanguageChange('id');
                        }
                      }}
                      aria-pressed={language === 'id'}
                      className={cn(
                        'rounded-full px-1.5 py-[1px] transition-[background-color,color] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff]',
                        language === 'id'
                          ? 'bg-white text-black shadow-sm dark:bg-white/20 dark:text-white'
                          : 'text-black/55 dark:text-white/55'
                      )}
                    >
                      ID
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  aria-label={isId ? 'Tutup panduan' : 'Close tour'}
                  className="flex h-6 w-6 items-center justify-center rounded-full text-black/45 transition-[background-color,color,transform] duration-150 ease-smooth-out active:scale-[0.94] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] dark:text-white/50 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-black/[0.07] [@media(hover:hover)_and_(pointer:fine)]:hover:text-black dark:[@media(hover:hover)_and_(pointer:fine)]:hover:bg-white/[0.1] dark:[@media(hover:hover)_and_(pointer:fine)]:hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Step Copy */}
            <div className="mt-2">
              <h2 className="text-[13.5px] font-semibold leading-snug tracking-[-0.01em]">
                {isId ? step.titleId : step.titleEn}
              </h2>
              <p className="mt-1 text-[12px] leading-[1.45] text-black/65 dark:text-white/65">
                {isId ? step.bodyId : step.bodyEn}
              </p>

              {(step.quickActionLabelEn || step.quickActionLabelId) && (
                <button
                  type="button"
                  onClick={handleQuickAction}
                  className="mt-2 inline-flex items-center gap-1 text-[11.5px] font-medium text-[#0066cc] transition-[opacity,transform] duration-150 ease-smooth-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] dark:text-[#66b2ff] [@media(hover:hover)_and_(pointer:fine)]:hover:opacity-80"
                >
                  <span>
                    {isId ? step.quickActionLabelId : step.quickActionLabelEn}
                  </span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Footer Actions: Skip / Back / Next */}
            <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-black/[0.07] pt-2.5 dark:border-white/[0.08]">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full px-2 py-1 text-[11.5px] font-medium text-black/50 transition-[color,background-color] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] dark:text-white/45 [@media(hover:hover)_and_(pointer:fine)]:hover:text-black dark:[@media(hover:hover)_and_(pointer:fine)]:hover:text-white"
              >
                {isId ? 'Lewati' : 'Skip'}
              </button>

              <div className="flex items-center gap-1.5">
                {!isFirst && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="whitespace-nowrap rounded-full bg-black/[0.06] px-2.5 py-1 text-[11.5px] font-medium text-black/75 transition-[background-color,transform] duration-150 ease-smooth-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] dark:bg-white/[0.09] dark:text-white/80 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-black/[0.11] dark:[@media(hover:hover)_and_(pointer:fine)]:hover:bg-white/[0.15]"
                  >
                    {isId ? 'Kembali' : 'Back'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleNext}
                  className="whitespace-nowrap rounded-full bg-[#111216] px-3 py-1 text-[11.5px] font-medium text-white transition-[background-color,transform] duration-150 ease-smooth-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] dark:bg-white dark:text-[#111216] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-black/85 dark:[@media(hover:hover)_and_(pointer:fine)]:hover:bg-white/90"
                >
                  {isLast
                    ? isId
                      ? 'Selesai'
                      : 'Done'
                    : isId
                    ? 'Lanjut'
                    : 'Next'}
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
