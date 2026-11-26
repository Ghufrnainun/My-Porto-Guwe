import { useCallback, useEffect, useRef, useState, type MutableRefObject } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { usePageMeta } from '@/hooks/usePageMeta';
import { ensureFontGroup } from '@/lib/loadFont';
import {
  playClickSound,
  playPanelOpenSound,
  playStepSound,
  playToggleSound,
  playWindowCloseSound,
  playWindowOpenSound,
} from '@/lib/soundEffects';
import { BILLBOARDS, COMMITS, HERO, PROJECTS, STOPS } from '@/town/content';
import type { CreateWorld, ProjectStop, World } from '@/town/types';
import { useTownNight } from '@/town/useNight';
import { SCREENS_PER_STOP, useTour } from '@/town/useTour';
import { DriveHint } from '@/town/ui/DriveHint';
import { EndLinks } from '@/town/ui/EndLinks';
import { HeroButtons } from '@/town/ui/HeroButtons';
import { HeroPoster } from '@/town/ui/HeroPoster';
import { ProjectCard } from '@/town/ui/ProjectCard';
import { ProjectSheet } from '@/town/ui/ProjectSheet';
import { SceneList } from '@/town/ui/SceneList';
import { SceneTitle } from '@/town/ui/SceneTitle';
import { StoryPanel } from '@/town/ui/StoryPanel';
import { TopBar } from '@/town/ui/TopBar';
import { WorkDialog } from '@/town/ui/WorkDialog';

const inBrowser = typeof window !== 'undefined';

const prefersReducedMotion = () => inBrowser && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const hasWebGL = () => {
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') ?? c.getContext('webgl'));
  } catch {
    return false;
  }
};

const loadWorld = (): Promise<{ createWorld: CreateWorld }> => import('@/town/world');

interface TourProps {
  night: boolean;
  onToggleNight: () => void;
  onWork: () => void;
  onOpenProject: (project: ProjectStop, from: DOMRect) => void;
  /** The 3D town cannot run here: fall back to the plain page. */
  onFail: () => void;
  goToRef: MutableRefObject<((stop: number) => void) | null>;
}

/** The town itself: one canvas, one frame loop, and the DOM for whichever stop is active. */
const TownTour = ({ night, onToggleNight, onWork, onOpenProject, onFail, goToRef }: TourProps) => {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const world = useRef<World | null>(null);
  const nightRef = useRef(night);
  const [ready, setReady] = useState(false);
  const tour = useTour(STOPS, world);
  const { goTo } = tour;
  // the frame loop reads these through a ref, so it never restarts (and never rebuilds the world) when they change
  const latest = useRef({ tour, onFail });

  useEffect(() => {
    nightRef.current = night;
    latest.current = { tour, onFail };
  });

  useEffect(() => {
    goToRef.current = goTo;
    return () => {
      goToRef.current = null;
    };
  }, [goTo, goToRef]);

  useEffect(() => {
    let alive = true;
    let raf = 0;
    let last = performance.now();
    const fail = (err: unknown) => {
      console.error('[town] world failed', err);
      if (!alive) return;
      alive = false;
      latest.current.onFail();
    };

    let lastHero = '';
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden) {
        last = now;
        return;
      }
      const dt = Math.min(0.1, Math.max(0.001, (now - last) / 1000));
      last = now;
      const { frame, hero, pos, mode, keys } = latest.current.tour;
      frame(now);
      const nextHero = hero.current.toFixed(3);
      if (nextHero !== lastHero) {
        lastHero = nextHero;
        root.current?.style.setProperty('--hero', nextHero);
      }
      try {
        world.current?.update({
          dt,
          heroProgress: hero.current,
          tour: pos.current,
          mode: mode.current,
          keys: keys.current,
          night: nightRef.current ? 1 : 0,
        });
      } catch (err) {
        fail(err);
      }
    };
    raf = requestAnimationFrame(loop);

    const resize = () => world.current?.resize(window.innerWidth, window.innerHeight);
    window.addEventListener('resize', resize);

    // after first paint, so the hero words are on screen before three.js is fetched
    const start = window.setTimeout(() => {
      loadWorld()
        .then(({ createWorld }) => {
          if (!alive || !canvas.current) return;
          const w = createWorld({
            canvas: canvas.current,
            stops: STOPS,
            commits: COMMITS,
            hero: HERO,
            billboards: BILLBOARDS,
            reducedMotion: false,
          });
          w.resize(window.innerWidth, window.innerHeight);
          world.current = w;
          setReady(true);
        })
        .catch(fail);
    }, 0);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.clearTimeout(start);
      window.removeEventListener('resize', resize);
      world.current?.dispose();
      world.current = null;
    };
  }, []);

  const stop = tour.active >= 0 ? STOPS[tour.active] : null;
  const story = stop?.kind === 'story' ? stop : null;
  const project = stop?.kind === 'project' ? stop : null;
  const nearStop = tour.near >= 0 ? STOPS[tour.near] : null;
  const projectIndex = project ? tour.active : -1;

  const origin = useCallback(
    () => (projectIndex >= 0 && world.current ? world.current.project(projectIndex) : null),
    [projectIndex],
  );

  return (
    <div ref={root}>
      {/* the scroll track: one hero screen, then the tour */}
      <div aria-hidden style={{ height: `${(2 + (STOPS.length - 1) * SCREENS_PER_STOP) * 100}vh` }} />
      <canvas ref={canvas} aria-hidden className="fixed inset-0 z-0 h-full w-full" />

      {/* the hero's own words until the world has painted them */}
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-0 z-[1] bg-town-blue transition-opacity duration-500 ${ready ? 'opacity-0' : 'opacity-100'}`}
      >
        <HeroPoster />
      </div>

      <TopBar
        district={nearStop?.district ?? ''}
        night={night}
        onToggleNight={onToggleNight}
        onWork={onWork}
      />
      <HeroButtons
        gone={tour.started}
        onExplore={() => {
          playClickSound();
          goTo(0);
        }}
        onWork={onWork}
      />
      <SceneTitle
        title={nearStop?.title ?? ['', '']}
        hidden={story !== null || project?.side === 1 || tour.driving}
        // ink on light grounds: every day district, and the gold project district at night. White on the blue page
        // and on the other night grounds.
        onDark={nearStop?.building === 'start' || (night && nearStop?.kind !== 'project')}
        counter={nearStop?.kind === 'project' ? `${nearStop.number} / ${String(PROJECTS.length).padStart(2, '0')}` : undefined}
      />
      <StoryPanel stop={story} night={night} />
      <ProjectCard stop={project} origin={origin} onOpen={onOpenProject} />
      <EndLinks visible={stop?.kind === 'end'} onTop={tour.toTop} />
      <DriveHint show={tour.driving || (tour.near >= 0 && !story && !project && nearStop?.kind !== 'end')} driving={tour.driving} />
    </div>
  );
};

const DESCRIPTION =
  'A small 3D town with one stop per project. Scroll or drive through the work of Ghufron Ainun Najib, fullstack developer in Semarang, Indonesia.';

const SITE = 'https://ghufronainun.tech';
/** Where a project opens inside the town. */
const pathOf = (p: ProjectStop) => `/town/${p.slug}`;
/** The project's own page in GanOS: the address search engines should keep. */
const pageOf = (p: ProjectStop) => `/projects/${p.slug}`;

const workOf = (p: ProjectStop) => ({
  '@type': 'CreativeWork',
  name: p.name,
  description: p.summary,
  url: `${SITE}${pageOf(p)}`,
  dateCreated: p.year,
  keywords: p.stack.join(', '),
  creator: { '@id': `${SITE}/#person` },
  ...(p.liveUrl || p.repoUrl ? { sameAs: [p.liveUrl, p.repoUrl].filter(Boolean) } : {}),
});

/** The six projects as structured data, so a crawler reads them as a list of works and not just page text. */
const PROJECT_LIST = {
  '@type': 'ItemList',
  name: 'Projects by Ghufron Ainun Najib',
  itemListElement: PROJECTS.map((p, i) => ({ '@type': 'ListItem', position: i + 1, item: workOf(p) })),
};

const Town = () => {
  const [reducedMotion] = useState(prefersReducedMotion);
  const [plain, setPlain] = useState(() => !inBrowser || reducedMotion || !hasWebGL());
  const [night, setNight] = useTownNight();

  useEffect(() => {
    ensureFontGroup('town');
  }, []);
  const [workOpen, setWorkOpen] = useState(false);
  const workOpenRef = useRef(workOpen);
  workOpenRef.current = workOpen;
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const goToRef = useRef<((stop: number) => void) | null>(null);
  const from = useRef<DOMRect | null>(null);
  /** Sheets opened by a click in this session: closing those goes Back instead of piling up history. */
  const pushed = useRef(0);
  const suppressWorkCloseSound = useRef(false);

  // /town/<slug> is the town with that sheet open. ?p=<slug> is the earlier form of the same link.
  const { slug: pathSlug } = useParams();
  const slug = pathSlug ?? params.get('p');
  const project = PROJECTS.find((p) => p.slug === slug) ?? null;

  usePageMeta({
    title: project
      ? `${project.name}: ${project.role}, ${project.year} | Ghufron Ainun Najib`
      : 'Ghufron Town: drive through my work | Ghufron Ainun Najib',
    description: project ? `${project.summary} Built with ${project.stack.join(', ')}.` : DESCRIPTION,
    // a project's sheet here repeats its GanOS page, so that page is the canonical one
    canonicalPath: project ? pageOf(project) : '/town',
    jsonLd: project ? workOf(project) : PROJECT_LIST,
  });

  const openProject = useCallback(
    (p: ProjectStop, rect: DOMRect | null = null) => {
      from.current = rect;
      pushed.current += 1;
      suppressWorkCloseSound.current = true;
      setWorkOpen(false);
      playWindowOpenSound();
      navigate(pathOf(p));
    },
    [navigate],
  );

  const closeProject = useCallback(() => {
    from.current = null;
    playWindowCloseSound();
    if (pushed.current > 0) {
      pushed.current -= 1;
      navigate(-1);
    } else {
      navigate('/town', { replace: true });
    }
  }, [navigate]);

  const nextProject = useCallback(
    (next: ProjectStop | null) => {
      if (goToRef.current && project) {
        const at = STOPS.indexOf(project);
        closeProject();
        goToRef.current(at + 1);
      } else if (next) {
        from.current = null;
        playStepSound(true);
        navigate(pathOf(next), { replace: true });
      } else {
        closeProject();
      }
    },
    [closeProject, project, navigate],
  );

  const toggleNight = useCallback(() => {
    playToggleSound(!night);
    setNight(!night);
  }, [night, setNight]);

  const openWork = useCallback(() => {
    suppressWorkCloseSound.current = false;
    playPanelOpenSound(true);
    setWorkOpen(true);
  }, []);

  const closeWork = useCallback(() => {
    if (workOpenRef.current && !suppressWorkCloseSound.current) {
      playPanelOpenSound(false);
    }
    suppressWorkCloseSound.current = false;
    setWorkOpen(false);
  }, []);
  const fail = useCallback(() => setPlain(true), []);

  // /town/<slug> of something that is not in town: the start of the town
  if (pathSlug && !project) return <Navigate to="/town" replace />;

  return (
    <div
      className="town relative min-h-screen bg-town-bg font-grotesk text-town-fg antialiased"
      data-night={night ? '' : undefined}
    >
      {plain ? (
        <TopBar district="" night={night} onToggleNight={toggleNight} onWork={openWork} />
      ) : (
        <TownTour
          night={night}
          onToggleNight={toggleNight}
          onWork={openWork}
          onOpenProject={openProject}
          onFail={fail}
          goToRef={goToRef}
        />
      )}
      <SceneList
        visible={plain}
        onProjectLink={() => {
          from.current = null;
          pushed.current += 1;
        }}
      />
      <WorkDialog open={workOpen} onClose={closeWork} onPick={openProject} />
      {project && (
        <ProjectSheet
          project={project}
          from={from.current}
          reducedMotion={reducedMotion}
          onClose={closeProject}
          onNext={nextProject}
        />
      )}
    </div>
  );
};

export default Town;
