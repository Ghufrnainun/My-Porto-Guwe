import { createContext, useContext, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowUpRight, Clock3, Code2, Github, MapPin } from 'lucide-react';
import { motion, useDragControls, useMotionValue } from 'framer-motion';
import { usePageMeta } from '@/hooks/usePageMeta';
import { featuredProjects } from '@/data/featuredProjects';
import { profile } from '@/data/profile';
import { useOsNote } from '@/components/os/OsShellContext';

type WidgetOffset = { x: number; y: number };
const WIDGET_POSITIONS_KEY = 'portoku-widget-positions-v2';
const WidgetDragContext = createContext(false);

const MoveHandle = ({ children, label, className }: { children: ReactNode; label: string; className: string }) => {
  const enabled = useContext(WidgetDragContext);
  return <div data-drag-handle={enabled ? '' : undefined} tabIndex={enabled ? 0 : -1} role={enabled ? 'button' : undefined} aria-label={enabled ? label : undefined} className={className}>{children}</div>;
};

const parseWidgetOffset = (value: unknown): WidgetOffset | null => {
  if (typeof value !== 'object' || value === null) return null;
  const { x, y } = value as Record<string, unknown>;
  return typeof x === 'number' && Number.isFinite(x) && typeof y === 'number' && Number.isFinite(y) ? { x, y } : null;
};

const canRestoreWidgetLayout = (savedWidth: unknown, width: number) => typeof savedWidth === 'number'
  && Number.isFinite(savedWidth)
  && savedWidth > 0
  && (savedWidth >= 900) === (width >= 900)
  && (savedWidth < 1200) === (width < 1200)
  && Math.abs(savedWidth - width) / savedWidth <= 0.1;

const readWidgetOffset = (id: string): WidgetOffset | null => {
  try {
    const stored: unknown = JSON.parse(window.localStorage.getItem(WIDGET_POSITIONS_KEY) ?? 'null');
    if (typeof stored !== 'object' || stored === null || !canRestoreWidgetLayout((stored as Record<string, unknown>).width, window.innerWidth)) return null;
    const positions = (stored as Record<string, unknown>).positions;
    return typeof positions === 'object' && positions !== null ? parseWidgetOffset((positions as Record<string, unknown>)[id]) : null;
  } catch { return null; }
};

const readTopWidget = (): string | null => {
  try {
    const stored: unknown = JSON.parse(window.localStorage.getItem(WIDGET_POSITIONS_KEY) ?? 'null');
    return typeof stored === 'object' && stored !== null && typeof (stored as Record<string, unknown>).top === 'string' ? (stored as { top: string }).top : null;
  } catch { return null; }
};

const saveWidgetOffset = (id: string, offset: WidgetOffset, raise = false) => {
  if (parseWidgetOffset(offset) === null) return;
  try {
    const stored: unknown = JSON.parse(window.localStorage.getItem(WIDGET_POSITIONS_KEY) ?? 'null');
    const positions = typeof stored === 'object' && stored !== null && !Array.isArray(stored)
      && canRestoreWidgetLayout((stored as Record<string, unknown>).width, window.innerWidth)
      && typeof (stored as Record<string, unknown>).positions === 'object'
      ? (stored as { positions: Record<string, unknown> }).positions
      : {};
    positions[id] = offset;
    window.localStorage.setItem(WIDGET_POSITIONS_KEY, JSON.stringify({ width: window.innerWidth, positions, ...(raise ? { top: id } : typeof stored === 'object' && stored !== null && typeof (stored as Record<string, unknown>).top === 'string' ? { top: (stored as { top: string }).top } : {}) }));
  } catch { /* Storage can be unavailable in private browsing or when full. */ }
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const clampWidgetOffset = (card: HTMLElement | null, bounds: HTMLElement | null, offset: WidgetOffset, current: WidgetOffset = offset): WidgetOffset => {
  if (!card || !bounds) return { x: 0, y: 0 };
  const cardRect = card.getBoundingClientRect();
  const boundsRect = bounds.getBoundingClientRect();
  const left = cardRect.left - current.x;
  const right = cardRect.right - current.x;
  const top = cardRect.top - current.y;
  const bottom = cardRect.bottom - current.y;
  return {
    x: clamp(offset.x, boundsRect.left - left, boundsRect.right - right),
    y: clamp(offset.y, boundsRect.top - top, boundsRect.bottom - bottom),
  };
};

const DraggableCard = ({ id, children, className, bounds, resetToken }: { id: string; children: ReactNode; className: string; bounds: React.RefObject<HTMLElement>; resetToken: number }) => {
  const controls = useDragControls();
  const cardRef = useRef<HTMLElement>(null);
  const desktopActive = useRef(false);
  const layoutWidth = useRef<number | null>(null);
  const layoutInvalidated = useRef(false);
  const previousResetToken = useRef(resetToken);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [enabled, setEnabled] = useState(false);
  const [raised, setRaised] = useState(false);

  useEffect(() => {
    if (previousResetToken.current === resetToken) return;
    previousResetToken.current = resetToken;
    x.set(0);
    y.set(0);
    setRaised(false);
    layoutInvalidated.current = false;
  }, [resetToken, x, y]);

  useEffect(() => {
    const query = window.matchMedia('(min-width: 900px) and (pointer: fine)');
    const update = () => {
      setEnabled(query.matches);
      if (!query.matches) { desktopActive.current = false; x.set(0); y.set(0); return; }
      if (desktopActive.current) return;
      desktopActive.current = true;
      layoutWidth.current = window.innerWidth;
      layoutInvalidated.current = false;
      const saved = readWidgetOffset(id);
      if (saved) {
        setRaised(readTopWidget() === id);
        const restored = clampWidgetOffset(cardRef.current, bounds.current, saved, { x: 0, y: 0 });
        x.set(restored.x);
        y.set(restored.y);
        saveWidgetOffset(id, restored);
      }
    };
    const resize = () => {
      if (!query.matches || !desktopActive.current) return;
      if (!canRestoreWidgetLayout(layoutWidth.current, window.innerWidth)) {
        x.set(0);
        y.set(0);
        layoutInvalidated.current = true;
        return;
      }
      if (layoutInvalidated.current) {
        const saved = readWidgetOffset(id);
        const restored = saved ? clampWidgetOffset(cardRef.current, bounds.current, saved, { x: 0, y: 0 }) : { x: 0, y: 0 };
        x.set(restored.x);
        y.set(restored.y);
        layoutInvalidated.current = false;
        return;
      }
      const current = clampWidgetOffset(cardRef.current, bounds.current, { x: x.get(), y: y.get() });
      x.set(current.x);
      y.set(current.y);
      saveWidgetOffset(id, current);
    };
    update();
    query.addEventListener('change', update);
    window.addEventListener('resize', resize);
    return () => { query.removeEventListener('change', update); window.removeEventListener('resize', resize); };
  }, [bounds, id, x, y]);

  const saveCurrentOffset = () => {
    const offset = clampWidgetOffset(cardRef.current, bounds.current, { x: x.get(), y: y.get() });
    x.set(offset.x);
    y.set(offset.y);
    saveWidgetOffset(id, offset, true);
  };

  const moveWithKeyboard = (event: KeyboardEvent<HTMLElement>) => {
    if (!enabled || !(event.target as HTMLElement).matches('[data-drag-handle]')) return;
    const delta = event.shiftKey ? 40 : 16;
    const offset = { x: x.get(), y: y.get() };
    if (event.key === 'ArrowLeft') offset.x -= delta;
    else if (event.key === 'ArrowRight') offset.x += delta;
    else if (event.key === 'ArrowUp') offset.y -= delta;
    else if (event.key === 'ArrowDown') offset.y += delta;
    else return;
    const clamped = clampWidgetOffset(cardRef.current, bounds.current, offset, { x: x.get(), y: y.get() });
    x.set(clamped.x);
    y.set(clamped.y);
    setRaised(true);
    saveWidgetOffset(id, clamped, true);
    event.preventDefault();
  };

  return <motion.article ref={cardRef} drag={enabled} dragListener={false} dragControls={controls} dragConstraints={bounds} dragMomentum={false} onDragStart={() => setRaised(true)} onDragEnd={saveCurrentOffset} style={{ x: enabled ? x : 0, y: enabled ? y : 0, zIndex: raised ? 10 : undefined, touchAction: 'pan-y' }} className={`min-w-0 max-w-full ${className}`} onPointerDownCapture={(event: PointerEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (enabled && target.closest('[data-drag-handle]') && !target.closest('a, button, input, textarea, select, [contenteditable="true"]')) controls.start(event);
  }} onKeyDown={moveWithKeyboard}><WidgetDragContext.Provider value={enabled}>{children}</WidgetDragContext.Provider></motion.article>;
};

const Index = () => {
  const [now, setNow] = useState(new Date());
  const [widgetResetToken, setWidgetResetToken] = useState(0);
  const desktopBounds = useRef<HTMLElement>(null);
  const { note, setNote } = useOsNote();
  usePageMeta({ title: 'Ghufron Ainun Najib | Portfolio', description: 'Ghufron Ainun Najib is a full-stack developer in Semarang, Indonesia, building practical web products, APIs, and mobile apps.', canonicalPath: '/' });
  useEffect(() => { const id = window.setInterval(() => setNow(new Date()), 1000); return () => window.clearInterval(id); }, []);

  const time = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Jakarta' }).format(now);
  const date = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'Asia/Jakarta' }).format(now);

  return (
    <section ref={desktopBounds} aria-label="Ghufron's desktop" className="gh-desktop relative mx-auto h-[calc(100svh-28px)] max-h-[calc(100svh-28px)] min-h-0 w-full max-w-[1600px] overflow-x-hidden overflow-y-auto">
      <main className="mx-auto min-h-full min-w-0 w-full max-w-[1200px] px-3 pb-[calc(160px+env(safe-area-inset-bottom))] pt-4 sm:px-6 sm:pb-28 sm:pt-5">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3 sm:mb-5 sm:pb-4">
          <div><p className="text-[10px] font-medium uppercase tracking-[.2em] text-white/45">Personal desktop</p><h1 className="mt-1 text-lg font-semibold tracking-tight text-white">Workspace</h1></div>
          <div className="flex flex-wrap items-center gap-3"><nav aria-label="Portfolio shortcuts" className="flex gap-3 text-xs text-white/65"><Link to="/projects" className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#9ABCFB]">Projects</Link><Link to="/about" className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#9ABCFB]">About</Link><Link to="/resume" className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#9ABCFB]">Resume</Link></nav><button type="button" onClick={() => { try { window.localStorage.removeItem(WIDGET_POSITIONS_KEY); } catch { /* Storage can be unavailable. */ } setWidgetResetToken((token) => token + 1); }} className="min-h-9 rounded-lg border border-white/15 px-3 text-[11px] text-white/55 hover:bg-white/[.06] hover:text-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#9ABCFB]">Reset layout</button></div>
        </header>
        <div className="grid grid-cols-1 content-start gap-3 sm:gap-4 min-[900px]:grid-cols-2 min-[1200px]:grid-cols-3">
      <DraggableCard id="profile" bounds={desktopBounds} resetToken={widgetResetToken} className="os-card flex min-h-[250px] flex-col justify-between p-4 sm:p-5 min-[1200px]:p-6">
        <div>
          <MoveHandle label="Move profile card. Use arrow keys to move; hold Shift for larger steps." className="mb-4 flex cursor-grab select-none items-center justify-between focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2385D9]"><span className="text-[10px] font-medium uppercase tracking-[.18em] text-white/45">Ghufron Ainun Najib</span><span className="flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] text-emerald-200"><i className="h-1.5 w-1.5 rounded-full bg-emerald-300" />Available</span></MoveHandle>
          <div className="flex items-center gap-4"><img src="/Photo.webp" alt={`${profile.name} profile`} className="h-[68px] w-[68px] shrink-0 rounded-2xl border border-white/15 object-cover shadow-lg" /><div><p className="text-[11px] text-white/45">Engineer’s workstation</p><h1 className="mt-1 text-xl font-semibold leading-tight sm:text-2xl">{profile.name}</h1><p className="mt-1 text-xs text-white/55">Full-stack developer</p></div></div>
          <p className="mt-4 max-w-md text-sm leading-5 text-white/70">I build practical web products and tools. I like where systems and interfaces meet.</p>
          <div className="mt-4 space-y-2 text-[11px] text-white/55"><p className="flex items-center gap-2"><MapPin size={13} className="text-[#56A8ED]" />{profile.location}</p><p className="flex items-center gap-2"><Code2 size={13} className="text-[#56A8ED]" />Computer Engineering · Polines</p></div>
          <div className="mt-4 flex flex-wrap gap-1.5">{['TypeScript', 'React', 'Node.js', 'Flutter'].map((skill) => <span key={skill} className="rounded-lg border border-white/[.09] bg-white/[.045] px-2.5 py-1.5 text-[10px] text-white/60">{skill}</span>)}</div>
        </div>
        <div className="mt-4 flex gap-2"><Link to="/about" className="rounded-lg bg-[var(--os-accent-solid)] px-3 py-2 text-xs font-medium text-white hover:bg-[var(--os-accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2385D9]">About me <ArrowUpRight className="ml-1 inline" size={13} /></Link><a href={profile.github} target="_blank" rel="noreferrer" className="rounded-lg border border-white/15 px-3 py-2 text-xs text-white/75 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2385D9]"><Github className="mr-1 inline" size={13} /> GitHub</a></div>
      </DraggableCard>

      <DraggableCard id="recent-projects" bounds={desktopBounds} resetToken={widgetResetToken} className="os-card min-h-[174px] overflow-hidden p-5 sm:p-6 min-[900px]:min-h-[158px] min-[900px]:p-4 min-[1200px]:min-h-[174px] min-[1200px]:p-6"><MoveHandle label="Move recent projects card. Use arrow keys to move; hold Shift for larger steps." className="flex cursor-grab select-none items-center justify-between focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2385D9]"><div><p className="text-[10px] uppercase tracking-[.16em] text-white/45">Recent projects</p><h2 className="mt-1.5 text-base font-semibold">Latest work</h2></div><Activity size={18} className="text-[#56A8ED]" /></MoveHandle><div className="mt-4 space-y-2">{featuredProjects.slice(0, 2).map((project) => <Link key={project.slug} to={`/projects/${project.slug}`} className="flex w-full items-center gap-2.5 rounded-xl border border-white/[.08] bg-black/15 px-3 py-2.5 text-left transition-colors hover:border-[#56A8ED]/40 hover:bg-white/[.05]"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#56A8ED]" /><span className="min-w-0 flex-1 truncate text-[11px] font-medium">{project.title}</span><span className="text-[10px] text-white/40">{project.year}</span><ArrowUpRight size={12} className="text-white/35" /></Link>)}</div></DraggableCard>

      <DraggableCard id="local-time" bounds={desktopBounds} resetToken={widgetResetToken} className="os-card flex min-h-[174px] flex-col justify-between p-5 sm:p-6 min-[900px]:min-h-[140px] min-[900px]:p-4 min-[1200px]:min-h-[174px] min-[1200px]:p-6"><MoveHandle label="Move local time card. Use arrow keys to move; hold Shift for larger steps." className="flex cursor-grab select-none items-start justify-between focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2385D9]"><div><p className="text-[10px] uppercase tracking-[.16em] text-white/45">Local time</p><h2 className="mt-1.5 text-xs text-white/60">Semarang, Indonesia</h2></div><Clock3 size={17} className="text-[#56A8ED]" /></MoveHandle><div className="os-clock font-mono text-[clamp(1.75rem,4vw,3rem)] font-light tracking-[.04em]">{time.slice(0, 5)}<span>:{time.slice(-2)}</span></div><div className="flex items-center justify-between text-[10px] text-white/40"><span>WIB · UTC+7</span><span>{date}</span></div></DraggableCard>

      <DraggableCard id="github" bounds={desktopBounds} resetToken={widgetResetToken} className="os-card flex min-h-[174px] flex-col justify-between p-4 min-[900px]:min-h-[140px] min-[1200px]:min-h-[174px]"><MoveHandle label="Move GitHub card. Use arrow keys to move; hold Shift for larger steps." className="flex cursor-grab select-none items-center justify-between focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2385D9]"><p className="text-[10px] uppercase tracking-[.16em] text-white/45">GitHub</p><Github size={15} className="text-[#56A8ED]" /></MoveHandle><div><p className="text-sm font-medium">@Ghufrnainun</p><p className="mt-1 text-[10px] text-white/45">Code & projects</p></div><a href={profile.github} target="_blank" rel="noreferrer" className="text-[11px] text-[#56A8ED] hover:text-white">View profile <ArrowUpRight className="inline" size={11} /></a></DraggableCard>
      <DraggableCard id="sticky-note" bounds={desktopBounds} resetToken={widgetResetToken} className="os-note min-h-[174px] p-4 min-[900px]:min-h-[140px] min-[1200px]:min-h-[174px]"><MoveHandle label="Move sticky note card. Use arrow keys to move; hold Shift for larger steps." className="flex cursor-grab select-none items-center justify-between focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#947355]"><p className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#473b2e]/65">Sticky note</p><span className="h-2 w-2 rounded-full bg-[#b8845e]/70" /></MoveHandle><textarea aria-label="Personal sticky note" value={note} onChange={(event) => setNote(event.target.value)} className="os-note-text mt-2 h-[80px] w-full resize-none overflow-y-auto bg-transparent font-serif text-xs leading-4 text-[#32291f]/80 outline-none placeholder:text-black/45 min-[1200px]:h-[112px]" /></DraggableCard>

      <DraggableCard id="work-base" bounds={desktopBounds} resetToken={widgetResetToken} className="os-weather flex min-h-[174px] items-center justify-between overflow-hidden p-5 sm:p-6 min-[900px]:min-h-[140px] min-[900px]:p-4 min-[1200px]:min-h-[174px] min-[1200px]:p-6"><div><MoveHandle label="Move work base card. Use arrow keys to move; hold Shift for larger steps." className="cursor-grab select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2385D9]"><p className="text-[10px] uppercase tracking-[.16em] text-white/70">Work base</p><h2 className="mt-2 text-xl font-semibold">Semarang</h2><p className="mt-1 text-xs text-white/85">Systems + interfaces</p></MoveHandle><a href={`mailto:${profile.email}`} className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[var(--os-accent-solid)] px-3 py-1.5 text-xs text-white hover:bg-[var(--os-accent-hover)]">Get in touch <ArrowUpRight size={12} /></a></div><div aria-hidden="true" className="grid h-12 w-12 place-items-center rounded-2xl border border-white/20 bg-white/[.06] text-lg font-medium text-white/90">ID</div></DraggableCard>
        </div>
      <style>{`.os-card,.os-note,.os-weather{position:relative;border:1px solid rgba(255,255,255,.13);border-radius:16px;box-shadow:0 12px 32px rgba(0,0,0,.16),inset 0 1px rgba(255,255,255,.045);transition:border-color .18s ease,box-shadow .18s ease}.os-card{background:linear-gradient(145deg,rgba(20,24,29,.99),rgba(15,19,24,.99))}.os-card:hover,.os-weather:hover{border-color:rgba(255,255,255,.22);box-shadow:0 16px 38px rgba(0,0,0,.2),inset 0 1px rgba(255,255,255,.06)}.os-note{background:repeating-linear-gradient(to bottom,#e9ddc9 0,#e9ddc9 24px,#d9cbb5 25px,#e9ddc9 26px);box-shadow:0 12px 30px rgba(0,0,0,.18),inset 0 1px rgba(255,255,255,.65)}.os-note-text{scrollbar-width:none}.os-note-text::-webkit-scrollbar{display:none}.os-weather{background:radial-gradient(ellipse at 100% 0,rgba(86,168,237,.15),transparent 58%),linear-gradient(145deg,#202a33,#17212a 65%,#1c252b)}[data-drag-handle]{position:relative}[data-drag-handle]::before{content:'';position:absolute;top:-10px;left:50%;width:24px;height:3px;border-radius:999px;background:rgba(255,255,255,.17);transform:translateX(-50%);opacity:.65;transition:opacity .16s,background .16s}[data-drag-handle]:hover::before,[data-drag-handle]:focus-visible::before{opacity:1;background:rgba(86,168,237,.8)}[data-drag-handle]:active{cursor:grabbing}.os-clock{background-image:linear-gradient(180deg,#f5f9fc,#b6c9d9);background-clip:text;-webkit-background-clip:text;-webkit-text-fill-color:transparent}`}</style>
      </main>
    </section>
  );
};

export default Index;
