import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { skillTiers, type Skill } from '@/data/profile';

const springEase = [0.32, 0.72, 0, 1];
const reiconLogoUrl = (slug: string) =>
  `https://cdn.reicon.dev/logos/${slug}/original.svg`;

/**
 * Both marquee rows scroll at this pixel speed so they visually match,
 * regardless of how many skills each row holds.
 */
const MARQUEE_SPEED = 60; // px per second

// Flatten and balance all skills into 2 sleek scrolling rows
const allSkills = skillTiers.flatMap((tier) => tier.skills);
const halfIndex = Math.ceil(allSkills.length / 2);

const marqueeRows = [
  {
    id: 'row-1',
    skills: allSkills.slice(0, halfIndex),
    reverse: false,
  },
  {
    id: 'row-2',
    skills: allSkills.slice(halfIndex),
    reverse: true,
  },
];

function SkillIcon({ skill }: { skill: Skill }) {
  const [hasError, setHasError] = useState(false);

  if (!skill.icon || hasError) {
    return (
      <span
        className="grid size-8 shrink-0 place-items-center rounded-md font-mono text-[10px] font-bold text-white shadow-sm"
        style={{ backgroundColor: skill.color }}
        aria-hidden="true"
      >
        {skill.name.slice(0, 2).toUpperCase()}
      </span>
    );
  }

  return (
    <img
      src={reiconLogoUrl(skill.icon)}
      alt=""
      className="size-7 shrink-0 object-contain transition-transform duration-300 group-hover:scale-110"
      loading="lazy"
      aria-hidden="true"
      onError={(e) => {
        const target = e.currentTarget;
        if (!target.dataset.triedFallback && skill.icon) {
          target.dataset.triedFallback = 'true';
          target.src = `https://cdn.simpleicons.org/${skill.icon}/${skill.color.replace('#', '')}`;
        } else {
          setHasError(true);
        }
      }}
    />
  );
}

function SkillPill({ skill }: { skill: Skill }) {
  return (
    <li
      className="group flex h-14 shrink-0 items-center gap-3 rounded-xl border border-border/60 bg-background/60 px-4 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-border hover:bg-secondary/80 hover:shadow-md"
      style={{
        '--brand-color': skill.color,
      } as React.CSSProperties}
    >
      <SkillIcon skill={skill} />
      <span className="whitespace-nowrap font-sans text-xs font-semibold text-foreground/80 transition-colors duration-300 group-hover:text-foreground">
        {skill.name}
      </span>
    </li>
  );
}

function SkillMarqueeRow({
  skills,
  reverse,
}: {
  skills: Skill[];
  reverse: boolean;
}) {
  const repeated = [...skills, ...skills, ...skills];
  const listRef = useRef<HTMLUListElement>(null);
  const [duration, setDuration] = useState('36s');

  // Duration must scale with row width, not be hardcoded: the keyframe
  // always moves exactly one set (-33.333%), so a shorter row with the same
  // duration would scroll slower. Measure one set and derive duration from
  // the shared MARQUEE_SPEED instead.
  useEffect(() => {
    let isCancelled = false;
    const measure = () => {
      if (isCancelled) return;
      const el = listRef.current;
      if (!el) return;
      // The list renders the skill set 3x; the keyframe scrolls exactly one
      // set (-33.333%), so duration = one set width / shared pixel speed.
      const setWidth = el.scrollWidth / 3;
      if (!isCancelled) setDuration(`${setWidth / MARQUEE_SPEED}s`);
    };
    measure();
    // Re-measure once web fonts finish swapping — text width can shift.
    document.fonts?.ready.then(measure).catch(() => {});
    return () => {
      isCancelled = true;
    };
  }, [skills, repeated.length]);

  return (
    <div className="group/row relative overflow-hidden py-1.5">
      <ul
        ref={listRef}
        className="skill-marquee flex w-max gap-3 group-hover/row:[animation-play-state:paused]"
        style={{
          animationDuration: duration,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {repeated.map((skill, index) => (
          <SkillPill key={`${skill.name}-${index}`} skill={skill} />
        ))}
      </ul>
    </div>
  );
}

export function Skills() {
  return (
    <section id="skills" className="relative overflow-hidden bg-transparent py-24 md:py-32">
      <style>{`
        @keyframes skill-marquee {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-33.333%, 0, 0); }
        }

        .skill-marquee {
          animation: skill-marquee 36s linear infinite;
          will-change: transform;
        }

        @media (prefers-reduced-motion: reduce) {
          .skill-marquee {
            animation: none;
            transform: none;
            flex-wrap: wrap;
            width: auto;
          }
        }
      `}</style>

      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="space-y-12">
          <motion.header
            className="mx-auto max-w-3xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: springEase }}
          >
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.24em] text-primary">
              Tech Stack
            </p>
            <h3 className="mb-6 font-serif text-5xl font-bold leading-[1.05] text-foreground md:text-6xl">
              Tools I keep reaching for.
            </h3>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Languages, frameworks, and workflow tools I keep coming back to across projects and GitHub work.
            </p>
          </motion.header>

          <motion.div
            className="relative -mx-6 space-y-4 md:mx-0"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: springEase }}
          >
            {/* Gradient Fades for Smooth Edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

            {marqueeRows.map((row) => (
              <SkillMarqueeRow key={row.id} {...row} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
