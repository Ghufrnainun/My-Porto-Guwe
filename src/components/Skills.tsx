import { motion } from 'framer-motion';
import { skillTiers, type Skill } from '@/data/profile';

const springEase = [0.32, 0.72, 0, 1];
const simpleIconUrl = (slug: string, color: string) =>
  `https://cdn.simpleicons.org/${slug}/${color.replace('#', '')}`;

const marqueeRows = [
  {
    label: 'Languages / Frameworks',
    skills: [
      ...skillTiers[0].skills,
      ...skillTiers[1].skills,
      ...skillTiers[2].skills,
    ],
    duration: '44s',
    reverse: false,
  },
  {
    label: 'Mobile / Workflow',
    skills: [...skillTiers[3].skills, ...skillTiers[4].skills],
    duration: '38s',
    reverse: true,
  },
];

function SkillIcon({ skill }: { skill: Skill }) {
  if (!skill.icon) {
    return (
      <span
        className="grid size-9 place-items-center rounded-md text-xs font-bold text-background"
        style={{ backgroundColor: skill.color }}
        aria-hidden="true"
      >
        {skill.name.slice(0, 2).toUpperCase()}
      </span>
    );
  }

  return (
    <img
      src={simpleIconUrl(skill.icon, skill.color)}
      alt=""
      className="size-9"
      loading="lazy"
      aria-hidden="true"
    />
  );
}

function SkillPill({ skill }: { skill: Skill }) {
  return (
    <li className="group flex h-16 shrink-0 items-center gap-3 rounded-lg border border-border/60 bg-background/70 px-5 shadow-card backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:bg-secondary/70">
      <SkillIcon skill={skill} />
      <span className="whitespace-nowrap text-sm font-semibold text-foreground/70 transition-colors duration-300 group-hover:text-foreground">
        {skill.name}
      </span>
    </li>
  );
}

function SkillMarqueeRow({
  label,
  skills,
  duration,
  reverse,
}: {
  label: string;
  skills: Skill[];
  duration: string;
  reverse: boolean;
}) {
  const repeated = [...skills, ...skills, ...skills];

  return (
    <div className="group/row relative overflow-hidden py-2">
      <div className="mb-3 flex items-center gap-4 px-1">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </span>
        <span className="h-px flex-1 bg-border/50" />
      </div>
      <ul
        className="skill-marquee flex w-max gap-3 group-hover/row:[animation-play-state:paused]"
        style={{
          animationDuration: duration,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {repeated.map((skill, index) => (
          <SkillPill key={`${label}-${skill.name}-${index}`} skill={skill} />
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
            className="relative -mx-6 space-y-6 md:mx-0"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: springEase }}
          >
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />
            {marqueeRows.map((row) => (
              <SkillMarqueeRow key={row.label} {...row} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

