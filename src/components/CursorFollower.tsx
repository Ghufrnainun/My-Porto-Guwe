import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export function CursorFollower() {
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Performance-optimized Motion Values for position tracking
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Springs for the main dot (snappy)
  const dotX = useSpring(cursorX, { stiffness: 800, damping: 35, mass: 0.15 });
  const dotY = useSpring(cursorY, { stiffness: 800, damping: 35, mass: 0.15 });

  // Springs for the outer trailing ring
  const ringX = useSpring(cursorX, { stiffness: 300, damping: 22, mass: 0.1 });
  const ringY = useSpring(cursorY, { stiffness: 300, damping: 22, mass: 0.1 });

  // Center offsets
  const dotTranslateX = useTransform(dotX, (x) => x - 6);
  const dotTranslateY = useTransform(dotY, (y) => y - 6);
  const ringTranslateX = useTransform(ringX, (x) => x - 16);
  const ringTranslateY = useTransform(ringY, (y) => y - 16);

  useEffect(() => {
    // Check for touch device
    const checkTouchDevice = () => {
      setIsTouchDevice(
        'ontouchstart' in window || navigator.maxTouchPoints > 0
      );
    };
    checkTouchDevice();

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);

    if (isTouchDevice || mediaQuery.matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);

      // Check if hovering over interactive element
      const target = e.target as HTMLElement;
      if (!target) return;
      const isInteractive = !!target.closest(
        'a, button, [role="button"], .cursor-pointer, input, select, textarea'
      );

      setIsPointer(isInteractive);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      mediaQuery.removeEventListener('change', listener);
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isTouchDevice, cursorX, cursorY]);

  // Don't render on touch devices or if user prefers reduced motion
  if (isTouchDevice || prefersReducedMotion) return null;

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 rounded-full bg-primary pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: dotTranslateX,
          y: dotTranslateY,
        }}
        animate={{
          scale: isPointer ? 0.5 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          duration: 0.15,
          ease: 'easeOut',
        }}
      />

      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-primary pointer-events-none z-[9998] mix-blend-difference"
        style={{
          x: ringTranslateX,
          y: ringTranslateY,
        }}
        animate={{
          scale: isPointer ? 2.2 : 1,
          backgroundColor: isPointer ? 'rgba(20, 184, 166, 0.15)' : 'rgba(20, 184, 166, 0)',
          borderColor: isPointer ? 'rgba(20, 184, 166, 0.8)' : 'rgba(20, 184, 166, 0.5)',
          opacity: isVisible ? 0.8 : 0,
        }}
        transition={{
          duration: 0.15,
          ease: 'easeOut',
        }}
      />
    </>
  );
}
