import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { Button } from '@/components/ui/button';
import { MorphIcon, type IconNode } from 'morphicons/react';

const SUN_ICON: IconNode = [
  ['circle', { cx: '12', cy: '12', r: '4' }],
  ['path', { d: 'M12 2v2' }],
  ['path', { d: 'M12 20v2' }],
  ['path', { d: 'm4.93 4.93 1.41 1.41' }],
  ['path', { d: 'm17.66 17.66 1.41 1.41' }],
  ['path', { d: 'M2 12h2' }],
  ['path', { d: 'M20 12h2' }],
  ['path', { d: 'm6.34 17.66-1.41 1.41' }],
  ['path', { d: 'm19.07 4.93-1.41 1.41' }],
];

const MOON_ICON: IconNode = [
  ['path', { d: 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z' }],
];

interface ThemeToggleProps {
  maskGifUrl?: string;
  duration?: string;
}

export function ThemeToggle({
  maskGifUrl = 'https://media.tenor.com/cyORI7kwShQAAAAi/shigure-ui-dance.gif',
  duration = '2.5s',
}: ThemeToggleProps = {}) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Preload GIF mask image in background for instant zero-latency playback
    if (typeof window !== 'undefined' && maskGifUrl) {
      const img = new Image();
      img.src = maskGifUrl;
    }
  }, [maskGifUrl]);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="relative h-9 w-9 rounded-full"
      >
        <span className="w-5 h-5 rounded-full bg-foreground/20" />
      </Button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  const toggleTheme = () => {
    const nextTheme = isDark ? 'light' : 'dark';

    // 1. Accessibility Check: Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    // 2. Fallback if Reduced Motion is enabled or View Transitions API is not supported
    const doc = document as unknown as {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };

    if (prefersReducedMotion || !doc.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    doc.startViewTransition(() => {
      flushSync(() => {
        setTheme(nextTheme);
      });
    });
  };

  return (
    <>
      {/* Dynamic View Transition 2.5s GIF Mask Style - Smooth Easing Curve */}
      <style>{`
        ::view-transition-group(root) {
          animation-timing-function: cubic-bezier(0.25, 1, 0.5, 1);
        }

        ::view-transition-old(root) {
          z-index: 1;
          animation: none;
        }

        ::view-transition-new(root) {
          z-index: 9999;
          -webkit-mask: url('${maskGifUrl}') center / 0 no-repeat;
          mask: url('${maskGifUrl}') center / 0 no-repeat;
          animation: mask-gif-scale ${duration} cubic-bezier(0.25, 1, 0.5, 1) forwards;
          mix-blend-mode: normal;
          will-change: mask-size, -webkit-mask-size;
        }

        @keyframes mask-gif-scale {
          0% {
            -webkit-mask-size: 0vmax;
            mask-size: 0vmax;
          }
          20% {
            -webkit-mask-size: 45vmax;
            mask-size: 45vmax;
          }
          75% {
            -webkit-mask-size: 65vmax;
            mask-size: 65vmax;
          }
          100% {
            -webkit-mask-size: 3500vmax;
            mask-size: 3500vmax;
          }
        }
      `}</style>

      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="relative h-9 w-9 rounded-full overflow-hidden hover:bg-secondary/80 active:scale-[0.92] transition-transform duration-150 focus-visible:ring-2 focus-visible:ring-primary flex items-center justify-center cursor-pointer"
        aria-label="Toggle theme"
        title="Toggle Light/Dark Theme (Morph Icon + Spring Physics)"
      >
        <MorphIcon
          icon={isDark ? MOON_ICON : SUN_ICON}
          size={20}
          strokeWidth={2}
          spring="snappy"
          reducedMotion="user"
          className="text-foreground transition-colors duration-200"
        />
      </Button>
    </>
  );
}

