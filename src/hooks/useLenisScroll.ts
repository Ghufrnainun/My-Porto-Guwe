import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const premiumEase = (t: number) => 1 - Math.pow(1 - t, 4);

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useLenisScroll(enabled = true) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || prefersReducedMotion()) {
      return;
    }

    const lenis = new Lenis({
      smoothWheel: true,
      syncTouch: false,
      lerp: 0.085,
      wheelMultiplier: 0.95,
      easing: premiumEase,
    });

    let frameId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    };

    const scrollToHash = (hash: string, immediate = false) => {
      const target = document.querySelector(hash);

      if (!target) {
        return;
      }

      lenis.scrollTo(target as HTMLElement, {
        offset: -88,
        duration: immediate ? 0 : 1.05,
        easing: premiumEase,
        immediate,
      });
    };

    const handleAnchorClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );

      if (!link || link.hash.length <= 1) {
        return;
      }

      const target = document.querySelector(link.hash);

      if (!target) {
        return;
      }

      event.preventDefault();
      window.history.pushState(null, '', link.hash);
      scrollToHash(link.hash);
    };

    const handleHashChange = () => {
      if (window.location.hash) {
        scrollToHash(window.location.hash);
      }
    };

    frameId = requestAnimationFrame(raf);
    document.addEventListener('click', handleAnchorClick);
    window.addEventListener('hashchange', handleHashChange);

    if (window.location.hash) {
      window.requestAnimationFrame(() => scrollToHash(window.location.hash, true));
    }

    return () => {
      cancelAnimationFrame(frameId);
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('hashchange', handleHashChange);
      lenis.destroy();
    };
  }, [enabled]);
}
