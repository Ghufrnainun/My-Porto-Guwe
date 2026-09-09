'use client';

import React, { useMemo } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';

interface MaskedHeadingProps {
  text: string;
  as?: HeadingTag;
  className?: string;
  delay?: number;
  stagger?: number;
  viewportMargin?: string;
}

const easeExpo = [0.16, 1, 0.3, 1] as const;

export function MaskedHeading({
  text,
  as: Component = 'h2',
  className,
  delay = 0,
  stagger = 0.038,
  viewportMargin = '-60px',
}: MaskedHeadingProps) {
  const shouldReduceMotion = useReducedMotion();

  const words = useMemo(() => text.trim().split(/\s+/), [text]);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : stagger,
        delayChildren: shouldReduceMotion ? 0 : delay,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: {
      y: shouldReduceMotion ? '0%' : '120%',
      opacity: shouldReduceMotion ? 1 : 0,
    },
    visible: {
      y: '0%',
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.85,
        ease: easeExpo,
      },
    },
  };

  // Motion element corresponding to Component tag
  const MotionTag = motion[Component as keyof typeof motion] as typeof motion.h2;

  return (
    <MotionTag
      aria-label={text}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: viewportMargin }}
      variants={containerVariants}
      className={cn('inline-block', className)}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden align-top mr-[0.24em] last:mr-0 pb-[0.08em] -mb-[0.08em]"
          aria-hidden="true"
        >
          <motion.span
            variants={wordVariants}
            className="inline-block will-change-transform"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
