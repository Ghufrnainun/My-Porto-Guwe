import { Link } from 'react-router-dom';
import { EMAIL, END_LINKS, HERO, OWNER, STOPS, TOWN_HEX, hostOf } from '../content';
import type { ProjectStop, StoryStop } from '../types';
import { Accent } from './Accent';
import { CTA, FOCUS, MONO } from './classes';

const LINK = `inline-flex min-h-[44px] items-center font-semibold underline underline-offset-4 fine:min-h-0 ${FOCUS}`;
const WRAP = 'px-[var(--town-pad)] py-14 md:py-20';

type Tab = { tab: number | undefined };

interface Props {
  visible: boolean;
  /** Fired when a project link is followed, so the page knows the sheet was opened by a click. */
  onProjectLink: () => void;
}

const Story = ({ s, tab }: { s: StoryStop } & Tab) => (
  <section
    id={s.id}
    className={WRAP}
    style={{ background: TOWN_HEX[s.color], color: s.color === 'blue' ? '#ffffff' : '#141414' }}
  >
    <p className={MONO}>
      {s.district} · {s.kicker}
    </p>
    <h2 className="mb-4 mt-2.5 font-anton text-[clamp(44px,8vw,118px)] uppercase leading-[.9]">
      <Accent text={s.heading} />
    </h2>
    {s.body && <p className="max-w-[56ch] text-lg">{s.body}</p>}
    {s.rows && (
      <ul className="mt-5 max-w-3xl">
        {s.rows.map((r) => (
          <li key={r.label} className="border-t-2 border-current py-2.5">
            <span className="flex flex-wrap items-baseline justify-between gap-x-4">
              {r.href ? (
                <a href={r.href} target="_blank" rel="noreferrer" tabIndex={tab} className={LINK}>
                  {r.label} ↗
                </a>
              ) : (
                <b className="font-semibold">{r.label}</b>
              )}
              <span className={MONO}>{r.detail}</span>
            </span>
            {r.note && <span className="block text-sm opacity-80">{r.note}</span>}
          </li>
        ))}
      </ul>
    )}
  </section>
);

const Project = ({ p, tab, onOpen }: { p: ProjectStop; onOpen: () => void } & Tab) => (
  <article id={p.slug} className="grid gap-x-8 gap-y-2 border-t-2 border-town-fg py-6 md:grid-cols-[80px_1fr_1fr]">
    <span className="font-anton text-[40px] leading-none" style={{ color: TOWN_HEX[p.color] }}>
      {p.number}
    </span>
    <div>
      <h3 className="font-anton text-[clamp(34px,5.4vw,72px)] uppercase leading-[.9]">{p.name}</h3>
      <p className={`mt-2 ${MONO}`}>
        {p.role} · {p.year} · {p.stack.join(' · ')}
      </p>
    </div>
    <div>
      <p>{p.summary}</p>
      <p className="mt-1 flex flex-wrap gap-x-5">
        <Link to={`/town/${p.slug}`} onClick={onOpen} tabIndex={tab} className={LINK}>
          open project →
        </Link>
        {p.liveUrl && (
          <a href={p.liveUrl} target="_blank" rel="noreferrer" tabIndex={tab} className={LINK}>
            {hostOf(p.liveUrl)} ↗
          </a>
        )}
        {p.repoUrl && (
          <a href={p.repoUrl} target="_blank" rel="noreferrer" tabIndex={tab} className={LINK}>
            repository ↗
          </a>
        )}
      </p>
    </div>
  </article>
);

/**
 * The whole page as a plain document. It is the source for search engines and
 * screen readers while the 3D town runs (then `visible` is false and it is only
 * visually hidden), and it IS the page when the town cannot run.
 */
export const SceneList = ({ visible, onProjectLink }: Props) => {
  // hidden copy: reachable by a screen reader's reading cursor, skipped by Tab
  const tab = visible ? undefined : -1;

  const projects = STOPS.filter((s): s is ProjectStop => s.kind === 'project');
  const firstProject = STOPS.findIndex((s) => s.kind === 'project');

  return (
    // hidden: fixed as well as clipped, so the copy can never add scroll height after the ending (mobile browsers
    // have let clipped absolute content extend the page)
    <main className={visible ? 'bg-town-bg font-grotesk text-town-fg' : 'sr-only fixed left-0 top-0'}>
      <header className={`${WRAP} bg-town-blue pt-28 text-white`}>
        <p className={MONO}>{HERO.kicker}</p>
        <h1 className="mt-3 font-anton text-[clamp(60px,13vw,210px)] uppercase leading-[.9]">
          {HERO.lines[0]} <i className="block font-accent normal-case tracking-[-.02em]">{HERO.lines[1]}</i>
        </h1>
        <p className="mt-5 max-w-[46ch] text-lg">{HERO.body.join(' ')}</p>
        {visible && (
          <a href="#work" className={`mt-6 ${CTA} border-town-ink bg-town-yellow text-town-ink`}>
            See the work ↓
          </a>
        )}
      </header>

      {STOPS.map((s, i) => {
        if (s.kind === 'story') return <Story key={s.id} s={s} tab={tab} />;
        if (i !== firstProject) return null;
        return (
          <section key="work" id="work" className={WRAP}>
            <p className={MONO}>{s.district}</p>
            <h2 className="mb-6 mt-2.5 font-anton text-[clamp(44px,8vw,118px)] uppercase leading-[.9]">
              <Accent text={`${s.title[0]} *${s.title[1]}*`} />
            </h2>
            {projects.map((p) => (
              <Project key={p.slug} p={p} tab={tab} onOpen={onProjectLink} />
            ))}
          </section>
        );
      })}

      <footer className={`${WRAP} text-center`}>
        <h2 className="font-accent text-[clamp(48px,7vw,110px)] italic leading-[.9]">Say hi.</h2>
        <p className="mt-4 flex flex-wrap items-center justify-center gap-x-5">
          <a href={`mailto:${EMAIL}`} tabIndex={tab} className={LINK}>
            {EMAIL}
          </a>
          {END_LINKS.map((l) =>
            l.internal ? (
              <a key={l.label} href={l.href} target="_top" tabIndex={tab} className={LINK}>
                {l.label} →
              </a>
            ) : (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer" tabIndex={tab} className={LINK}>
                {l.label} ↗
              </a>
            ),
          )}
        </p>
        <p className={`mt-6 opacity-70 ${MONO}`}>
          © {new Date().getFullYear()} {OWNER}
        </p>
      </footer>
    </main>
  );
};
