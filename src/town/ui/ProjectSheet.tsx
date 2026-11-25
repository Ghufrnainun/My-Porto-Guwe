import { useEffect, useRef } from 'react';
import { PROJECTS, TOWN_HEX, hostOf } from '../content';
import type { ProjectStop } from '../types';
import { CTA, MONO, PILL } from './classes';
import { Sticker, type StickerName } from './Sticker';

/** One sticker per project, stuck on the corner of its picture. */
const STICKER: Record<string, StickerName> = {
  pbundip: 'shuttle',
  'tempe-mail': 'mail',
  'curated-design': 'sparkle',
  sewainaja: 'key',
  'lsp-polines': 'rosette',
  'impp-website': 'flag',
};

interface Props {
  project: ProjectStop;
  /** Rect of the card it grows out of; absent when opened from a list or a direct link. */
  from: DOMRect | null;
  reducedMotion: boolean;
  onClose: () => void;
  onNext: (next: ProjectStop | null) => void;
}

const Column = ({ label, items }: { label: string; items: readonly string[] }) => (
  <div>
    <h3 className={MONO}>{label}</h3>
    {items.map((t) => (
      <p key={t} className="mt-1.5">
        {t}
      </p>
    ))}
  </div>
);

/** The project page: grows out of the card, lives at /town/<slug>. */
export const ProjectSheet = ({ project, from, reducedMotion, onClose, onNext }: Props) => {
  const el = useRef<HTMLDivElement>(null);
  const next = PROJECTS[PROJECTS.indexOf(project) + 1] ?? null;

  useEffect(() => {
    const node = el.current;
    if (!node) return;
    node.scrollTop = 0;
    node.focus();
    const r = from ?? new DOMRect(window.innerWidth / 2, window.innerHeight / 2, 0, 0);
    node.animate(
      [
        {
          clipPath: `inset(${r.top}px ${window.innerWidth - r.right}px ${window.innerHeight - r.bottom}px ${r.left}px round 24px)`,
        },
        { clipPath: 'inset(0 0 0 0 round 0px)' },
      ],
      { duration: reducedMotion ? 1 : 650, easing: 'cubic-bezier(.2,.9,.2,1)' },
    );
    // replay only when another project opens, not when the rect object changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', esc);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', esc);
    };
  }, [onClose]);

  return (
    <div
      ref={el}
      role="dialog"
      aria-modal="true"
      aria-label={project.name}
      tabIndex={-1}
      data-town-modal
      data-lenis-prevent
      style={{ background: TOWN_HEX[project.color] }}
      className="fixed inset-0 z-[8] overflow-y-auto px-[var(--town-pad)] pb-12 pt-[70px] font-grotesk text-town-ink outline-none"
    >
      <button type="button" onClick={onClose} className={`fixed right-[var(--town-pad)] top-3.5 z-[1] ${PILL} ${MONO}`}>
        close ✕
      </button>
      <span className={MONO}>
        {project.number} · {project.role} · {project.year}
      </span>
      <h2 className="mb-4 mt-2.5 font-anton text-[clamp(60px,12vw,200px)] uppercase leading-[.9]">{project.name}</h2>
      <p className="max-w-[40ch] text-[clamp(18px,2vw,26px)] leading-snug">{project.summary}</p>

      <div className="mt-6 flex flex-wrap gap-2.5">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className={`${CTA} border-town-ink bg-town-ink text-town-paper`}
          >
            Visit live site ↗<span className="sr-only"> ({hostOf(project.liveUrl)})</span>
          </a>
        )}
        {project.repoUrl && (
          <a href={project.repoUrl} target="_blank" rel="noreferrer" className={`${CTA} border-town-ink`}>
            View repository ↗
          </a>
        )}
        <a href={`/projects/${project.slug}`} target="_top" className={`${CTA} border-town-ink`}>
          Full case study →
        </a>
      </div>

      <div className="relative">
        {STICKER[project.slug] && (
          <Sticker
            key={project.slug}
            name={STICKER[project.slug]}
            tilt={10}
            className="absolute -top-7 right-[5%] z-[1] w-[clamp(68px,10vw,124px)]"
          />
        )}
      {project.image ? (
        <img
          src={project.image}
          alt={`${project.name} screenshot`}
          loading="lazy"
          className="my-9 aspect-[16/8] w-full rounded-[14px] bg-town-paper object-cover"
        />
      ) : (
        // no real screenshot: the project's clip, and a label that says what it is
        <figure className="my-9">
          <video
            key={project.slug}
            src={`${import.meta.env.BASE_URL}town/video/${project.slug}.mp4`}
            poster={`${import.meta.env.BASE_URL}town/video/${project.slug}.jpg`}
            muted
            loop
            playsInline
            autoPlay={!reducedMotion}
            controls={reducedMotion}
            preload={reducedMotion ? 'none' : 'metadata'}
            aria-label={`${project.name}: animated walkthrough`}
            className="aspect-video w-full rounded-[14px] bg-town-ink object-cover"
          />
          <figcaption className={`mt-2.5 ${MONO}`}>Animated walkthrough, not a screenshot</figcaption>
        </figure>
      )}
      </div>

      {project.why && (
        <div className="mb-9 border-t-2 border-town-ink pt-[18px]">
          <h3 className={MONO}>why it is built this way</h3>
          <p className="mt-1.5 max-w-[62ch] text-[clamp(17px,1.5vw,21px)] leading-snug">{project.why}</p>
        </div>
      )}

      <div className="mb-9 grid gap-7 border-t-2 border-town-ink pt-[18px] md:grid-cols-3">
        <Column label="stack" items={[project.stack.join(' · ')]} />
        <Column label="what I did" items={project.did} />
        <Column label="result" items={project.results} />
      </div>

      <button type="button" onClick={() => onNext(next)} className={`${CTA} border-town-ink bg-town-yellow text-town-ink`}>
        {next ? `next stop: ${next.name} →` : 'back to the road →'}
      </button>
    </div>
  );
};
