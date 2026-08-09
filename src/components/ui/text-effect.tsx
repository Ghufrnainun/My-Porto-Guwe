"use client";
import { motion, Variants } from "framer-motion";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type TextEffectProps = {
  children?: string;
  text?: string;
  as?: keyof HTMLElementTagNameMap | React.ElementType;
  className?: string;
  delay?: number;
  per?: "word" | "char";
};

export function TextEffect({
  children,
  text,
  as: Component = "p",
  className,
  delay = 0,
  per = "word",
}: TextEffectProps) {
  const content = (children || text || "").trim();

  // We can't rely on AnimatePresence initial={false} being in the tree,
  // so we manually trigger the animation after mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: per === "word" ? 0.08 : 0.03,
        delayChildren: delay,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      filter: "blur(10px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  if (per === "word") {
    const words = content.split(/\s+/);
    return (
      <Component className={cn("inline-block", className)}>
        <motion.span
          variants={containerVariants}
          initial="hidden"
          animate={mounted ? "visible" : "hidden"}
          className="inline-block"
        >
          {words.map((word, i) => (
            <motion.span
              key={`${word}-${i}`}
              variants={itemVariants}
              className="inline-block mr-[0.28em]"
            >
              {word}
            </motion.span>
          ))}
        </motion.span>
      </Component>
    );
  }

  const chars = content.split("");
  return (
    <Component className={cn("inline-block", className)}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        animate={mounted ? "visible" : "hidden"}
        className="inline-block"
      >
        {chars.map((char, i) => (
          <motion.span
            key={`${char}-${i}`}
            variants={itemVariants}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.span>
    </Component>
  );
}
