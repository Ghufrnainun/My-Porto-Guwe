import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { skillTiers, type Skill } from '@/data/profile';
import { MaskedHeading } from '@/components/ui/masked-heading';
import { cn } from '@/lib/utils';

const easeExpo = [0.16, 1, 0.3, 1] as const;
const reiconLogoUrl = (slug: string) =>
  `https://cdn.reicon.dev/logos/${slug}/original.svg`;

/**
 * Both marquee rows scroll at this pixel speed so they visually match,
 * regardless of how many skills each row holds.
 */
const MARQUEE_SPEED = 60; // px per second

const categories = ['All', 'Backend & data', 'Frontend', 'Languages', 'Workflow'] as const;
type SkillCategory = (typeof categories)[number];

const skillCategoryMap: Record<string, SkillCategory> = {
  JavaScript: 'Languages',
  TypeScript: 'Languages',
  PHP: 'Languages',
  Python: 'Languages',
  Dart: 'Languages',
  HTML: 'Languages',
  CSS: 'Languages',
  SQL: 'Languages',
  React: 'Frontend',
  'Next.js': 'Frontend',
  'Tailwind CSS': 'Frontend',
  Flutter: 'Frontend',
  Laravel: 'Backend & data',
  'Node.js': 'Backend & data',
  Convex: 'Backend & data',
  Supabase: 'Backend & data',
  Firebase: 'Backend & data',
  PostgreSQL: 'Backend & data',
  Git: 'Workflow',
  GitHub: 'Workflow',
  Docker: 'Workflow',
  Figma: 'Workflow',
};

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

function SkillPill({
  skill,
  isDimmed,
}: {
  skill: Skill;
  isDimmed: boolean;
}) {
  return (
    <li
      className={cn(
        "group flex h-14 shrink-0 items-center gap-3 rounded-xl border border-border/60 bg-background/60 px-4 shadow-sm backdrop-blur-md transition-[transform,opacity,border-color,background-color,box-shadow] duration-200 ease-out",
        isDimmed
          ? "opacity-25 scale-[0.97]"
          : "opacity-100 scale-100 hover:-translate-y-0.5 hover:border-[var(--brand-color)]/60 hover:bg-secondary/80 hover:shadow-md active:scale-[0.97] cursor-default"
      )}
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
  activeCategory,
}: {
  skills: Skill[];
  reverse: boolean;
  activeCategory: SkillCategory;
}) {
  const repeated = [...skills, ...skills, ...skills];
  const listRef = useRef<HTMLUListElement>(null);
  const [duration, setDuration] = useState('36s');

  useEffect(() => {
    let isCancelled = false;
    const measure = () => {
      if (isCancelled) return;
      const el = listRef.current;
      if (!el) return;
      const setWidth = el.scrollWidth / 3;
      if (!isCancelled) setDuration(`${setWidth / MARQUEE_SPEED}s`);
    };
    measure();
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
        {repeated.map((skill, index) => {
          const isDimmed =
            activeCategory !== 'All' &&
            skillCategoryMap[skill.name] !== activeCategory;

          return (
            <SkillPill
              key={`${skill.name}-${index}`}
              skill={skill}
              isDimmed={isDimmed}
            />
          );
        })}
      </ul>
    </div>
  );
}

export function Skills() {
  const shouldReduceMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<SkillCategory>('All');

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
        <div className="space-y-10">
          <header className="mx-auto max-w-3xl text-center">
            <motion.p
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: easeExpo }}
              className="mb-4 font-mono text-xs uppercase tracking-[0.24em] text-primary"
            >
              Tech Stack
            </motion.p>
            <MaskedHeading
              as="h3"
              text="Tools I keep reaching for."
              className="mb-6 font-serif text-5xl font-bold leading-[1.05] text-foreground md:text-6xl"
              viewportMargin="-50px"
            />
            <motion.p
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.75, delay: shouldReduceMotion ? 0 : 0.16, ease: easeExpo }}
              className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg will-change-[transform,opacity,filter]"
            >
              Languages, frameworks, and workflow tools I keep coming back to across projects and GitHub work.
            </motion.p>
          </header>

          {/* Interactive Liquid Glass Category Filter */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.2, ease: easeExpo }}
            className="flex justify-center"
          >
            <div
              className="relative inline-flex flex-wrap items-center justify-center p-1 rounded-full border border-border/80 dark:border-white/12 bg-secondary/40 dark:bg-black/50 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.08)]"
              role="tablist"
              aria-label="Filter skills by category"
            >
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "relative px-4 py-2 rounded-full text-xs font-medium transition-colors duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
                      isActive
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground/80 hover:text-foreground"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeCategoryPill"
                        className="absolute inset-0 rounded-full bg-background/90 dark:bg-white/15 border border-border/90 dark:border-white/20 shadow-[0_2px_10px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.2)] backdrop-blur-md"
                        transition={{ type: "spring", stiffness: 420, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10">{cat}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            className="relative -mx-6 space-y-4 md:mx-0"
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 28, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: shouldReduceMotion ? 0 : 0.22, ease: easeExpo }}
          >
            {/* Gradient Fades for Smooth Edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

            {marqueeRows.map((row) => (
              <SkillMarqueeRow
                key={row.id}
                {...row}
                activeCategory={activeCategory}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
