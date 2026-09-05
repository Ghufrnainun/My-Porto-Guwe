import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectCursorProps {
  cardRef: React.RefObject<HTMLElement>;
  label?: string;
  isHoveringAction?: boolean;
}

export function ProjectCursor({
  cardRef,
  label = 'View Case Study',
  isHoveringAction = false,
}: ProjectCursorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  // Smooth spring physics matching high-end Framer/Portox feel
  const springConfig = { damping: 26, stiffness: 320, mass: 0.45 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setIsMounted(true);
    // Only enable custom cursor on non-touch devices
    const media = window.matchMedia('(pointer: fine)');
    setIsFinePointer(media.matches);

    const updateMedia = (e: MediaQueryListEvent) => setIsFinePointer(e.matches);
    media.addEventListener('change', updateMedia);
    return () => media.removeEventListener('change', updateMedia);
  }, []);

  useEffect(() => {
    if (!isMounted || !isFinePointer) return;

    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Initial check if mouse is already hovering
    if (card.matches(':hover')) {
      setIsVisible(true);
    }

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [cardRef, isMounted, isFinePointer, mouseX, mouseY]);

  if (!isMounted || !isFinePointer) return null;

  const showCursor = isVisible && !isHoveringAction;

  return createPortal(
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[9999] select-none will-change-transform"
      style={{
        x: smoothX,
        y: smoothY,
      }}
      aria-hidden="true"
    >
      <div className="-translate-x-1/2 -translate-y-1/2">
        <AnimatePresence>
          {showCursor && (
            <motion.div
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.3, opacity: 0 }}
              transition={{
                type: 'spring',
                damping: 22,
                stiffness: 350,
                mass: 0.4,
              }}
              className={cn(
                'flex items-center gap-2 rounded-full px-4 py-2',
                'bg-neutral-950/90 text-white backdrop-blur-md',
                'border border-white/20 shadow-[0_16px_36px_rgba(0,0,0,0.65)]',
                'font-mono text-[10px] font-semibold uppercase tracking-[0.16em]'
              )}
            >
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              <span>{label}</span>
              <ArrowUpRight className="size-3.5 text-primary stroke-[2.2]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>,
    document.body
  );
}
