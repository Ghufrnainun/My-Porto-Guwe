'use client';

import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  motion,
  SpringOptions,
  useMotionValue,
  useSpring,
  AnimatePresence,
  Transition,
  Variant,
} from 'framer-motion';
import { cn } from '@/lib/utils';

export type CursorProps = {
  children: React.ReactNode;
  className?: string;
  springConfig?: SpringOptions;
  attachToParent?: boolean;
  targetRef?: React.RefObject<HTMLElement>;
  transition?: Transition;
  variants?: {
    initial: Variant;
    animate: Variant;
    exit: Variant;
  };
  onPositionChange?: (x: number, y: number) => void;
};

export function Cursor({
  children,
  className,
  springConfig,
  attachToParent = false,
  targetRef,
  variants,
  transition,
  onPositionChange,
}: CursorProps) {
  const cursorX = useMotionValue(-1000);
  const cursorY = useMotionValue(-1000);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(!attachToParent && !targetRef);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const defaultSpringConfig: SpringOptions = {
    damping: 28,
    stiffness: 350,
    mass: 0.5,
  };

  const cursorXSpring = useSpring(cursorX, springConfig || defaultSpringConfig);
  const cursorYSpring = useSpring(cursorY, springConfig || defaultSpringConfig);

  useEffect(() => {
    if (!isMounted) return;

    const updatePosition = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      onPositionChange?.(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', updatePosition, { passive: true });

    let targetElement: HTMLElement | null = null;

    if (targetRef && targetRef.current) {
      targetElement = targetRef.current;
    } else if (attachToParent && anchorRef.current) {
      targetElement = anchorRef.current.parentElement;
    }

    if (targetElement) {
      const handleMouseEnter = () => {
        setIsVisible(true);
      };
      const handleMouseLeave = () => {
        setIsVisible(false);
      };

      targetElement.addEventListener('mouseenter', handleMouseEnter);
      targetElement.addEventListener('mouseleave', handleMouseLeave);

      // Check if mouse is already inside when element mounts
      if (targetElement.matches(':hover')) {
        setIsVisible(true);
      }

      return () => {
        window.removeEventListener('mousemove', updatePosition);
        if (targetElement) {
          targetElement.removeEventListener('mouseenter', handleMouseEnter);
          targetElement.removeEventListener('mouseleave', handleMouseLeave);
        }
      };
    }

    return () => {
      window.removeEventListener('mousemove', updatePosition);
    };
  }, [attachToParent, targetRef, isMounted, onPositionChange, cursorX, cursorY]);

  if (!isMounted) {
    return <div ref={anchorRef} style={{ display: 'none' }} aria-hidden="true" />;
  }

  return (
    <>
      <div ref={anchorRef} style={{ display: 'none' }} aria-hidden="true" />
      {createPortal(
        <motion.div
          className={cn(
            'pointer-events-none fixed top-0 left-0 z-[99999] select-none will-change-transform',
            className
          )}
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
          }}
          aria-hidden="true"
        >
          <div className="-translate-x-1/2 -translate-y-1/2">
            <AnimatePresence mode="wait">
              {isVisible && (
                <motion.div
                  initial={
                    variants?.initial || {
                      scale: 0.4,
                      opacity: 0,
                    }
                  }
                  animate={
                    variants?.animate || {
                      scale: 1,
                      opacity: 1,
                    }
                  }
                  exit={
                    variants?.exit || {
                      scale: 0.4,
                      opacity: 0,
                    }
                  }
                  transition={
                    transition || {
                      type: 'spring',
                      damping: 24,
                      stiffness: 350,
                    }
                  }
                >
                  {children}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>,
        document.body
      )}
    </>
  );
}
