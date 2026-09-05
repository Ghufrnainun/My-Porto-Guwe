'use client';

import { motion, useReducedMotion, Variants } from 'framer-motion';
import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

type TextEffectProps = {
  children?: string;
  text?: string;
  as?: keyof HTMLElementTagNameMap | React.ElementType;
  className?: string;
  delay?: number;
  per?: 'word' | 'char';
};

export function TextEffect({
  children,
  text,
  as: Component = 'p',
  className,
  delay = 0,
  per = 'word',
}: TextEffectProps) {
  const content = (children || text || '').trim();
  const shouldReduceMotion = useReducedMotion();

  const itemVariants: Variants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        filter: shouldReduceMotion ? 'none' : 'blur(8px)',
        y: shouldReduceMotion ? 0 : 16,
      },
      visible: (customIndex: number = 0) => ({
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        transition: {
          delay: shouldReduceMotion
            ? 0
            : delay + customIndex * (per === 'word' ? 0.06 : 0.025),
          duration: shouldReduceMotion ? 0 : 0.5,
          ease: [0.22, 1, 0.36, 1],
        },
      }),
    }),
    [delay, per, shouldReduceMotion],
  );

  if (!content) return null;

  if (per === 'word') {
    const words = content.split(/\s+/);
    return (
      <Component className={cn('inline-block', className)}>
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            custom={i}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="inline-block mr-[0.28em] will-change-[transform,opacity,filter]"
          >
            {word}
          </motion.span>
        ))}
      </Component>
    );
  }

  const words = content.split(' ');
  let charCounter = 0;

  return (
    <Component className={cn('inline-block', className)}>
      {words.map((word, wordIdx) => (
        <span
          key={`${word}-${wordIdx}`}
          className="inline-block whitespace-nowrap mr-[0.28em] last:mr-0"
        >
          {word.split('').map((char) => {
            const currentIndex = charCounter++;
            return (
              <motion.span
                key={`${char}-${currentIndex}`}
                custom={currentIndex}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="inline-block will-change-[transform,opacity,filter]"
              >
                {char}
              </motion.span>
            );
          })}
        </span>
      ))}
    </Component>
  );
}
