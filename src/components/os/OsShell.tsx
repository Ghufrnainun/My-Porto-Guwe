import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Github, Home, Mail, Search, StickyNote, X, ChevronLeft, ChevronRight, Code2, FolderKanban, UserRound, FileText, PenLine, NotebookPen, Settings2, LayoutGrid } from 'lucide-react';
import { profile } from '@/data/profile';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { OsShellContext } from '@/components/os/OsShellContext';
import { MacOSDock } from '@/components/ui/mac-os-dock';

type OsShellProps = { appName: string; mode: 'desktop' | 'window'; lockScreen?: boolean; children: ReactNode; renderWindow?: (path: string) => ReactNode };
type OsWindow = { id: string; path: string; slot: number; minimized?: boolean; position: { x: number; y: number }; maximized?: boolean };
const nextWindowSlot = (windows: OsWindow[]) => [0, 1, 2, 3].find((slot) => !windows.some((item) => item.slot === slot)) ?? 0;
const apps = [
  { id: 'projects', label: 'Projects', path: '/projects', sprite: 1, group: 'PINNED' },
  { id: 'about', label: 'About', path: '/about', sprite: 2, group: 'PINNED' },
  { id: 'resume', label: 'Resume', path: '/resume', sprite: 3, group: 'PINNED' },
  { id: 'blog', label: 'Writing', path: '/blog', sprite: 4, group: 'CREATIVE' },
  { id: 'notes', label: 'Notes', sprite: 5, group: 'CREATIVE' },
  { id: 'settings', label: 'Settings', sprite: 7, group: 'SYSTEM' },
  { id: 'contact', label: 'Contact', sprite: 6, group: 'TOOLS' },
] as const;

const appIcons = [LayoutGrid, FolderKanban, UserRound, FileText, PenLine, NotebookPen, Mail, Settings2];
const AppIcon = ({ index, className = '' }: { index: number; className?: string }) => {
  const Icon = appIcons[index] ?? LayoutGrid;
  return <span aria-hidden="true" className={`gh-app-icon gh-app-icon-${index} ${className}`}><Icon /></span>;
};

export function OsShell({ appName, mode, children, renderWindow }: OsShellProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const routeToApp = apps.find((app) => 'path' in app && (location.pathname === app.path || location.pathname.startsWith(`${app.path}/`)));
  const currentRouteApp = routeToApp?.id ?? (location.pathname.startsWith('/blog') ? 'blog' : null);
  const routePath = `${location.pathname}${location.search}${location.hash}`;
  const [now, setNow] = useState(new Date());
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [utilityWindow, setUtilityWindow] = useState<'notes' | 'settings' | 'contact' | null>(null);
  const [closingWindowId, setClosingWindowId] = useState<string | null>(null);
  const [windows, setWindows] = useState<OsWindow[]>(() => currentRouteApp ? [{ id: currentRouteApp, path: routePath, slot: 0, position: { x: 0, y: 0 } }] : []);
  const [note, setNote] = useState('A note to self: make useful things, keep learning, and leave the codebase better than you found it.');
  const closeTimer = useRef<number | null>(null);
  const windowRef = useRef<HTMLElement | null>(null);
  const dragOrigin = useRef<{ pointerX: number; pointerY: number; x: number; y: number; left: number; right: number; top: number; bottom: number } | null>(null);
  const filteredApps = useMemo(() => apps.filter((app) => app.label.toLowerCase().includes(query.toLowerCase())), [query]);
  const appGroups = ['PINNED', 'CREATIVE', 'SYSTEM', 'TOOLS'] as const;
  useEffect(() => { const id = window.setInterval(() => setNow(new Date()), 1000); return () => window.clearInterval(id); }, []);
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setLauncherOpen(false); setUtilityWindow(null); }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setLauncherOpen(true); }
      if (event.altKey && event.key === 'ArrowLeft') navigate(-1);
      if (event.altKey && event.key === 'ArrowRight') navigate(1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [navigate]);
  useEffect(() => {
    if (currentRouteApp) setWindows((current) => {
      const existing = current.find((item) => item.id === currentRouteApp);
      if (existing) return [...current.filter((item) => item.id !== currentRouteApp), { ...existing, path: routePath, minimized: false }];
      const slot = nextWindowSlot(current);
      return [...current, { id: currentRouteApp, path: routePath, slot, position: { x: slot * 34, y: slot * 34 } }];
    });
  }, [currentRouteApp, routePath]);
  useEffect(() => { setClosingWindowId(null); }, [currentRouteApp]);
  useEffect(() => () => { if (closeTimer.current !== null) window.clearTimeout(closeTimer.current); }, []);
  useEffect(() => {
    const clampWindowOnResize = () => setWindows((current) => current.map((item) => {
      if (window.innerWidth < 640) return item;
      if (item.id !== currentRouteApp) return item;
      const rect = windowRef.current?.getBoundingClientRect();
      if (!rect) return item;
      return { ...item, position: {
        x: Math.max(-rect.left + item.position.x, Math.min(item.position.x, window.innerWidth - rect.right + item.position.x)),
        y: Math.max(40 - rect.top + item.position.y, Math.min(item.position.y, window.innerHeight - 72 - rect.bottom + item.position.y)),
      } };
    }));
    window.addEventListener('resize', clampWindowOnResize);
    return () => window.removeEventListener('resize', clampWindowOnResize);
  }, [currentRouteApp]);

  const formattedTime = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Jakarta' }).format(now);
  const formattedDate = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'Asia/Jakarta' }).format(now);
  const activeWindow = windows.find((item) => item.id === currentRouteApp);
  const windowPosition = activeWindow?.position ?? { x: 0, y: 0 };
  const maximized = activeWindow?.maximized ?? false;
  const openApp = (app: (typeof apps)[number]) => {
    setLauncherOpen(false); setQuery('');
    if ('path' in app) { const existing = windows.find((item) => item.id === app.id); const path = existing?.path ?? app.path; setWindows((current) => { if (existing) return [...current.filter((item) => item.id !== app.id), { ...existing, minimized: false }]; const slot = nextWindowSlot(current); return [...current, { id: app.id, path, slot, position: { x: slot * 34, y: slot * 34 } }]; }); if (routePath !== path) navigate(path); }
    else setUtilityWindow(app.id);
  };
  const closeRouteWindow = (id: string) => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    setClosingWindowId(id);
    closeTimer.current = window.setTimeout(() => { closeTimer.current = null; setClosingWindowId(null); const remaining = windows.filter((item) => item.id !== id); setWindows(remaining); const nextPath = [...remaining].reverse().find((item) => !item.minimized)?.path ?? '/'; if (nextPath !== routePath) navigate(nextPath); }, 150);
  };
  const moveWindowTo = (x: number, y: number) => {
    const rect = windowRef.current?.getBoundingClientRect();
    if (!rect) return;
    setWindows((current) => current.map((item) => item.id === currentRouteApp ? { ...item, position: {
      x: Math.max(-rect.left + windowPosition.x, Math.min(x, window.innerWidth - rect.right + windowPosition.x)),
      y: Math.max(40 - rect.top + windowPosition.y, Math.min(y, window.innerHeight - 72 - rect.bottom + windowPosition.y)),
    } } : item));
  };
  const startWindowDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || !window.matchMedia('(min-width: 640px) and (pointer: fine)').matches || maximized || (event.target as HTMLElement).closest('button')) return;
    const rect = windowRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragOrigin.current = { pointerX: event.clientX, pointerY: event.clientY, ...windowPosition, left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveWindowDrag = (event: PointerEvent<HTMLDivElement>) => {
    const origin = dragOrigin.current;
    if (!origin) return;
    setWindows((current) => current.map((item) => item.id === currentRouteApp ? { ...item, position: {
      x: Math.max(-origin.left + origin.x, Math.min(origin.x + event.clientX - origin.pointerX, window.innerWidth - origin.right + origin.x)),
      y: Math.max(40 - origin.top + origin.y, Math.min(origin.y + event.clientY - origin.pointerY, window.innerHeight - 72 - origin.bottom + origin.y)),
    } } : item));
  };
  const stopWindowDrag = () => { dragOrigin.current = null; };
  const handleWindowDragKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('button') || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key) || maximized) return;
    event.preventDefault();
    moveWindowTo(windowPosition.x + (event.key === 'ArrowLeft' ? -16 : event.key === 'ArrowRight' ? 16 : 0), windowPosition.y + (event.key === 'ArrowUp' ? -16 : event.key === 'ArrowDown' ? 16 : 0));
  };
  const focusWindow = (id: string) => { const item = windows.find((window) => window.id === id); if (!item) return; setWindows((current) => { const target = current.find((window) => window.id === id); return target ? [...current.filter((window) => window.id !== id), { ...target, minimized: false }] : current; }); if (item.path !== routePath) navigate(item.path); };
  const minimizeWindow = (id: string) => { const next = windows.map((item) => item.id === id ? { ...item, minimized: true } : item); setWindows(next); const nextPath = [...next].reverse().find((item) => !item.minimized && item.id !== id)?.path ?? '/'; if (nextPath !== routePath) navigate(nextPath); };
  const shellNoteContext = { note, setNote, activePath: routePath };

  return (
    <OsShellContext.Provider value={shellNoteContext}>
      <main className="gh-os relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden bg-[var(--os-wallpaper-navy)] text-[var(--os-text-primary)] selection:bg-[#176FC0]/30">
        <div aria-hidden="true" className="gh-os-wallpaper fixed inset-0 -z-10" />
        <header className="os-menubar relative z-20 flex h-7 shrink-0 items-center justify-between border-b px-2 text-[10px] backdrop-blur-xl sm:px-4">
          <div className="flex min-w-0 items-center gap-2">
            <button type="button" aria-label="Go to desktop" onClick={() => navigate('/')} className="os-control grid h-6 w-6 shrink-0 place-items-center rounded-md hover:bg-white/10 focus-visible:outline focus-visible:outline-2"><Home size={13} /></button>
            <img src="/brand-logo.svg" alt="" className="h-4 w-4 shrink-0" />
            <span className="shrink-0 font-semibold tracking-wide text-white">Ghufron OS</span>
            <span className="hidden truncate text-white/45 md:inline">{appName}</span>
            <span className="hidden truncate border-l border-white/15 pl-3 text-white/45 xl:inline">Built in Semarang · systems + interfaces</span>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 text-white/70"><button aria-label="Search apps (Ctrl or Command + K)" title="Search apps" onClick={() => { setQuery(''); setLauncherOpen(true); }} className="rounded-md p-1 hover:bg-white/10"><Search size={13} /></button><button aria-label="Go back" title="Go back" onClick={() => navigate(-1)} className="rounded-md p-1 hover:bg-white/10"><ChevronLeft size={13} /></button><button aria-label="Go forward" title="Go forward" onClick={() => navigate(1)} className="rounded-md p-1 hover:bg-white/10"><ChevronRight size={13} /></button><span className="hidden md:inline">{formattedDate}</span><span className="font-mono tabular-nums">{formattedTime.slice(0, 5)} WIB</span></div>
        </header>

        {windows.map((item, index) => {
          const active = item.id === currentRouteApp;
          const label = apps.find((app) => app.id === item.id)?.label ?? appName;
          return <section key={item.id} ref={active ? windowRef : undefined} onPointerDown={(event) => { if (!(event.target as HTMLElement).closest('button')) focusWindow(item.id); }} style={{ zIndex: active ? windows.length + 2 : index + 1, display: item.minimized ? 'none' : 'flex', translate: item.maximized && active ? '0 0' : `calc(-50% + ${item.position.x}px) calc(-50% + ${item.position.y}px)` }} className={`os-window fixed flex-col overflow-hidden border shadow-[0_28px_100px_rgba(0,0,0,.48)] backdrop-blur-2xl ${closingWindowId === item.id ? 'os-window--closing' : ''} ${item.maximized && active ? 'os-window--maximized inset-x-0 bottom-0 top-7 rounded-none' : 'left-1/2 top-1/2 h-[65vh] w-[75vw] max-w-[1200px] rounded-[14px] max-sm:left-3 max-sm:right-3 max-sm:top-[max(76px,15svh)] max-sm:bottom-[max(112px,18svh)] max-sm:h-auto max-sm:w-auto max-sm:max-w-none'} `}>
          <div role="group" tabIndex={0} aria-label={`Move ${label} window`} aria-description="Drag with a mouse, or focus this bar and use the arrow keys to move the window." title="Drag to move; use arrow keys while focused" onPointerDown={(event) => { if (!(event.target as HTMLElement).closest('button') && active) startWindowDrag(event); }} onPointerMove={moveWindowDrag} onPointerUp={stopWindowDrag} onPointerCancel={stopWindowDrag} onKeyDown={handleWindowDragKey} className={`os-window-titlebar flex h-11 shrink-0 items-center justify-between border-b px-3 ${maximized ? '' : 'cursor-grab active:cursor-grabbing'} sm:px-4`}>
            <div className="flex items-center gap-2.5"><button aria-label="Close window" onClick={() => closeRouteWindow(item.id)} className="h-3 w-3 rounded-full bg-[#ff5f57] shadow-inner" /><button aria-label="Minimize window" onClick={() => minimizeWindow(item.id)} className="h-3 w-3 rounded-full bg-[#febc2e] shadow-inner" /><button aria-label={item.maximized ? 'Restore window' : 'Maximize window'} onClick={() => { setWindows((current) => current.map((window) => window.id === item.id ? { ...window, maximized: !window.maximized } : window)); focusWindow(item.id); }} className="h-3 w-3 rounded-full bg-[#28c840] shadow-inner" /></div>
            <span className="text-xs font-medium text-white/75">{label}</span><span className="w-[54px]" />
          </div>
          <div className="os-window-content flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">{renderWindow ? renderWindow(item.path) : children}</div>
        </section>;
        })}
        {mode === 'desktop' && <section className="relative z-0 min-h-0 flex-1">{children}</section>}

        <MacOSDock
          items={apps.map((app) => ({ ...app, selected: currentRouteApp === app.id || utilityWindow === app.id }))}
          launcherOpen={launcherOpen}
          onLauncher={() => { setLauncherOpen((open) => !open); setUtilityWindow(null); }}
          onOpen={(id) => { const app = apps.find((item) => item.id === id); if (app) openApp(app); }}
          renderIcon={(sprite, className) => <AppIcon index={sprite} className={className} />}
        />

        {launcherOpen && <>
          <button aria-label="Close launcher" onClick={() => setLauncherOpen(false)} className="fixed inset-0 z-30 cursor-default bg-black/45 backdrop-blur-sm" />
          <section aria-label="App launcher" className="os-launcher fixed left-1/2 top-1/2 z-40 flex max-h-[calc(100svh-2rem)] w-[min(670px,calc(100vw-1.5rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[18px] border p-4 shadow-2xl backdrop-blur-2xl sm:p-5">
            <label className="flex h-11 shrink-0 items-center gap-2 rounded-lg border border-white/10 bg-black/25 px-3"><Search size={16} className="text-white/45" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search apps and tools" className="w-full bg-transparent text-sm outline-none placeholder:text-white/35" /><kbd className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-white/40">ESC</kbd></label>
            <div className="min-h-0 flex-1 overflow-y-auto pt-4">{appGroups.map((group) => {
              const groupApps = filteredApps.filter((app) => app.group === group);
              if (!groupApps.length && !(group === 'TOOLS' && 'github'.includes(query.toLowerCase()))) return null;
              return <div key={group} className="mb-4"><p className="mb-2 px-1 text-[10px] font-medium tracking-[.18em] text-white/40">{group}</p><div className="grid grid-cols-3 gap-2 sm:grid-cols-4">{groupApps.map((app) => <button key={app.id} onClick={() => openApp(app)} className="flex min-h-[100px] flex-col items-center justify-center gap-2 rounded-lg border border-transparent p-3 text-xs text-white/75 hover:border-white/10 hover:bg-white/[.06]"><span className="grid h-12 w-12 place-items-center rounded-lg border border-white/10 bg-[#252622]"><AppIcon index={app.sprite} className="h-10 w-10" /></span>{app.label}</button>)}{group === 'TOOLS' && 'github'.includes(query.toLowerCase()) && <a href={profile.github} target="_blank" rel="noreferrer" onClick={() => setLauncherOpen(false)} className="flex min-h-[100px] flex-col items-center justify-center gap-2 rounded-lg p-3 text-xs text-white/75 hover:bg-white/[.06]"><span className="grid h-12 w-12 place-items-center rounded-lg border border-white/10 bg-[#252622] text-zinc-200"><Github size={21} /></span>GitHub</a>}</div></div>;
            })}</div>
            <div className="flex shrink-0 items-center justify-between border-t border-white/[.08] pt-3 text-[10px] text-white/40"><span>GHUFRON OS</span><span>Ctrl/⌘ K to search</span></div>
          </section>
        </>}

        <Dialog open={utilityWindow !== null} onOpenChange={(open) => { if (!open) setUtilityWindow(null); }}>
          {utilityWindow && <DialogContent overlayClassName="bg-transparent motion-reduce:animate-none" className="os-utility-window w-[calc(100%-1rem)] max-w-xl gap-0 overflow-hidden rounded-[14px] border p-0 shadow-[0_30px_100px_rgba(0,0,0,.65)] motion-reduce:animate-none motion-reduce:transition-none">
            <DialogDescription className="sr-only">{utilityWindow === 'notes' ? 'Edit your personal note.' : utilityWindow === 'settings' ? 'View Ghufron OS system information.' : 'Contact Ghufron by email.'}</DialogDescription>
            <header className="os-window-titlebar flex h-11 items-center justify-between border-b px-4"><div className="flex items-center gap-2"><button aria-label="Close window" onClick={() => setUtilityWindow(null)} className="h-3 w-3 rounded-full bg-[#ff5f57]" /><button aria-label="Minimize window" onClick={() => setUtilityWindow(null)} className="h-3 w-3 rounded-full bg-[#febc2e]" /><span className="h-3 w-3 rounded-full bg-[#28c840]" /></div><DialogTitle className="text-xs font-medium text-[var(--os-text-primary)]">{apps.find((app) => app.id === utilityWindow)?.label}</DialogTitle><button aria-label="Close window" onClick={() => setUtilityWindow(null)} className="text-white/50 hover:text-white"><X size={16} /></button></header>
            <div className="max-h-[72svh] overflow-y-auto p-6">
              {utilityWindow === 'notes' && <div className="mx-auto max-w-lg rounded-lg bg-[#efe3ce] p-5 text-[#241f19]"><div className="flex items-center justify-between"><p className="text-[10px] font-semibold uppercase tracking-[.16em] text-black/50">Semarang · systems + interfaces</p><StickyNote size={16} /></div><textarea aria-label="Personal note" value={note} onChange={(event) => setNote(event.target.value)} className="mt-4 min-h-48 w-full resize-none bg-transparent font-serif text-lg leading-7 outline-none" /></div>}
              {utilityWindow === 'settings' && <><p className="text-[10px] uppercase tracking-[.18em] text-[#e49a65]">System</p><h2 className="mt-2 text-2xl font-semibold">Ghufron OS</h2><p className="mt-3 text-sm leading-6 text-white/65">Engineer’s workstation · Built in Semarang, Indonesia.</p><p className="mt-4 flex items-center gap-2 text-xs text-white/45"><Code2 size={14} /> Systems, interfaces, and practical software.</p></>}
              {utilityWindow === 'contact' && <><p className="text-[10px] uppercase tracking-[.18em] text-[#e49a65]">Contact</p><h2 className="mt-2 text-2xl font-semibold">Have a useful thing to build?</h2><p className="mt-3 text-sm leading-6 text-white/65">I’m {profile.availability.toLowerCase()}. Send a note with a little about the product and the problem it should solve.</p><a href={`mailto:${profile.email}`} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#d97736] px-4 py-2.5 text-sm font-medium text-[#191512] hover:bg-[#e7945a]">Email {profile.email} <Mail size={14} /></a></>}
            </div>
          </DialogContent>}
        </Dialog>
        <style>{`
          .gh-os{--os-wallpaper-navy:#071C33;--os-wallpaper-cobalt:#0B64B6;--os-wallpaper-bright-blue:#1789E8;--os-panel:#17191D;--os-raised:#202329;--os-border:#424853;--os-text-primary:#F5F7FA;--os-text-secondary:#B7C0CB;--os-accent-solid:#176FC0;--os-accent-hover:#2385D9;--os-accent-soft:#123A5C;--os-accent-link:#56A8ED;--os-accent-text:#041426;color:var(--os-text-primary)}
          .gh-os-wallpaper{background:url('/ghufron-os-wallpaper.svg') center/cover no-repeat}
          .os-menubar{position:relative;background:rgba(9,22,36,.58);border-color:rgba(210,225,242,.13);box-shadow:inset 0 1px rgba(255,255,255,.08);backdrop-filter:blur(24px) saturate(1.35)}
          .os-window{max-width:min(100vw,1200px);background:var(--os-raised);border-color:var(--os-border)}.os-window--maximized{max-width:none}.os-utility-window{--os-panel:#17191D;--os-raised:#202329;--os-border:#424853;--os-text-primary:#F5F7FA;max-width:min(100vw,36rem);background:var(--os-raised);border-color:var(--os-border)}
          .os-window-titlebar{background:var(--os-panel);border-color:var(--os-border)}
          .os-window-content{overflow-x:hidden;background:var(--os-panel)}
          .os-launcher{position:fixed;background:rgba(23,25,29,.86);border-color:rgba(183,192,203,.24);box-shadow:0 24px 80px rgba(0,0,0,.52),inset 0 1px rgba(255,255,255,.09);backdrop-filter:blur(28px)}
          .os-launcher-trigger,.os-dock-idle{background:var(--os-raised);border-color:var(--os-border)}.os-launcher-trigger[aria-expanded="true"]{background:var(--os-accent-soft);border-color:var(--os-accent-solid)}
          .os-selected{background:var(--os-accent-soft);border-color:var(--os-accent-solid)}
          .os-menubar::before,.gh-mac-dock::before,.os-launcher::before{content:"";position:absolute;z-index:1;top:0;left:12px;right:12px;height:1px;pointer-events:none;background:linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent)}
          .os-control:focus-visible,.os-lockscreen:focus-visible,.dock-app:focus-visible{outline:2px solid var(--os-accent-hover);outline-offset:3px}
          .gh-os [class*="text-[#e3945c]"],.gh-os [class*="text-[#e7a06d]"],.gh-os [class*="text-[#e7b184]"],.gh-os [class*="text-[#edc39f]"],.gh-os [class*="text-[#d9a477]"],.gh-os [class*="text-[#c78b5b]"],.gh-os [class*="text-[#e58a4c]"],.gh-os [class*="text-[#f0b184]"],.gh-os [class*="text-[#e58b4d]"],.gh-os [class*="text-[#f4a36c]"],.gh-os [class*="text-[#eaa06f]"]{color:var(--os-accent-link)!important}
          .gh-os [class*="text-[#aaa39a]"],.gh-os [class*="text-[#c5beb4]"]{color:var(--os-text-secondary)!important}
          .gh-os [class*="text-[#f0ece6]"],.gh-os [class*="text-[#f2eee8]"]{color:var(--os-text-primary)!important}
          .gh-os [class~="text-white/40"],.gh-os [class~="text-white/45"],.gh-os [class~="text-white/50"],.gh-os [class~="text-white/55"],.gh-os [class~="text-white/60"],.gh-os [class~="text-white/65"],.gh-os [class~="text-white/70"],.gh-os [class~="text-white/75"]{color:var(--os-text-secondary)!important}
          .gh-os .os-lockscreen [class*="text-white/"]{color:var(--os-text-primary)!important}.gh-os .os-weather [class*="text-white/"]{color:var(--os-text-primary)!important}
          .gh-os [class~="bg-[#171716]"],.gh-os [class~="bg-[#171716]/95"]{background-color:var(--os-panel)!important}
          .gh-os [class~="bg-[#1d1c1a]"],.gh-os [class~="bg-[#211c18]"],.gh-os [class~="bg-[#211d19]"],.gh-os [class~="bg-[#22211f]"],.gh-os [class~="bg-[#252522]"]{background-color:var(--os-raised)!important}
          .gh-os [class*="from-[#252522]"]{background-image:linear-gradient(135deg,var(--os-panel),var(--os-raised) 60%,var(--os-accent-soft))!important}
          .gh-os [class*="bg-[#c78b5b]"],.gh-os [class*="bg-[#d97736]"],.gh-os [class*="bg-[#e58a4c]"],.gh-os [class*="bg-[#e58b4d]"]{background-color:color-mix(in srgb,var(--os-accent-solid) 12%,transparent)!important}
          .gh-os [class~="bg-[#d97736]"]{background-color:var(--os-accent-solid)!important;color:#fff!important}
          .gh-os [class~="hover:bg-[#e58a4c]"]:hover,.gh-os [class~="hover:bg-[#e58b4d]"]:hover,.gh-os [class~="hover:bg-[#e7945a]"]:hover,.gh-os [class~="hover:bg-[#2385D9]"]:hover{background-color:var(--os-accent-hover)!important;color:var(--os-accent-text)!important}
          .gh-os [class*="hover:bg-[var(--os-accent-hover)]"]:hover{color:var(--os-accent-text)!important}
          .gh-os [class*="border-[#d97736]"],.gh-os [class*="border-[#c78b5b]"]{border-color:color-mix(in srgb,var(--os-accent-solid) 38%,transparent)!important}
          .gh-app-icon{display:grid;height:42px;width:42px;place-items:center;border-radius:11px;background:linear-gradient(145deg,#253a50,#142436);color:#b8dcff;box-shadow:inset 0 1px rgba(255,255,255,.24),0 3px 8px rgba(0,0,0,.22)}
          .gh-app-icon svg{height:21px;width:21px;stroke-width:1.8}
          .gh-app-icon-1{background:linear-gradient(145deg,#4587c3,#22517f);color:#e5f3ff}.gh-app-icon-2{background:linear-gradient(145deg,#b9d0dd,#708da3);color:#18344a}.gh-app-icon-3{background:linear-gradient(145deg,#e5e9ee,#9eacbd);color:#36526e}.gh-app-icon-4{background:linear-gradient(145deg,#d4b78b,#95734e);color:#fff5df}.gh-app-icon-5{background:linear-gradient(145deg,#e8ce88,#ac873e);color:#493714}.gh-app-icon-6{background:linear-gradient(145deg,#81bfca,#367f8d);color:#f0ffff}.gh-app-icon-7{background:linear-gradient(145deg,#a8b6c9,#65758a);color:#f5f8ff}
          .gh-mac-dock{position:fixed;max-width:calc(100vw - 16px);background:linear-gradient(180deg,rgba(40,48,58,.88),rgba(18,24,32,.82));border-color:rgba(220,232,245,.28);box-shadow:0 18px 48px rgba(0,0,0,.5),inset 0 1px rgba(255,255,255,.22);backdrop-filter:blur(28px) saturate(1.35)}.dock-mobile-toggle{display:none}
          .dock-app{position:relative;z-index:0;height:46px;width:46px;flex:0 0 46px;border-radius:13px;--dock-press:1;transition:transform .16s cubic-bezier(.2,.8,.2,1),border-color .16s,background .16s;transform:translateY(var(--dock-lift,0px)) scale(calc(var(--dock-scale,1) * var(--dock-press,1)));transform-origin:bottom center}.dock-app:active{--dock-press:.96}.dock-app:hover,.dock-app:focus-visible{z-index:2}
          .dock-app[data-label]::after{content:attr(data-label);position:absolute;left:50%;bottom:calc(100% + 12px);transform:translate(-50%,4px);border:1px solid rgba(255,255,255,.14);border-radius:7px;background:rgba(12,18,25,.94);padding:5px 8px;color:#f5f7fa;font:500 11px/1.2 system-ui,sans-serif;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .12s,transform .12s;box-shadow:0 5px 16px #0006}
          .dock-app:hover[data-label]::after,.dock-app:focus-visible[data-label]::after{opacity:1;transform:translate(-50%,0)}
          .dock-app[aria-current="page"]::before{content:"";position:absolute;bottom:-6px;left:50%;height:4px;width:4px;border-radius:50%;background:#f4f8ff;box-shadow:0 0 7px #89c8ff;transform:translateX(-50%)}
          .dock-icon{transform:none}
          .dock-bounce{animation:dock-bounce .28s ease-out}@keyframes dock-bounce{0%,100%{transform:translateX(var(--dock-shift,0px)) translateY(var(--dock-lift,0px)) scale(calc(var(--dock-scale,1) * var(--dock-press,1)))}45%{transform:translateX(var(--dock-shift,0px)) translateY(calc(var(--dock-lift,0px) - 5px)) scale(calc(var(--dock-scale,1) * var(--dock-press,1)))}}
          .os-window{animation:gh-window-in .25s cubic-bezier(.22,1,.36,1) both}.os-window--closing{animation:gh-window-out .15s cubic-bezier(.22,1,.36,1) both}
          @keyframes gh-window-in{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}@keyframes gh-window-out{from{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(.96)}}
          @media(hover:hover) and (pointer:fine){.dock-app:hover{--dock-lift:-2px}}
          @media(max-width:640px){.gh-mac-dock{bottom:calc(env(safe-area-inset-bottom,0px) + 12px);flex-direction:column-reverse;gap:8px;border:0;background:transparent;padding:0;box-shadow:none;backdrop-filter:none}.gh-mac-dock::before{display:none}.dock-mobile-toggle{display:flex;border-color:rgba(220,232,245,.28);background:linear-gradient(180deg,rgba(40,48,58,.94),rgba(18,24,32,.92));box-shadow:0 8px 24px rgba(0,0,0,.42),inset 0 1px rgba(255,255,255,.2);backdrop-filter:blur(24px) saturate(1.35)}.gh-mac-dock:not(.dock-mobile-open) .dock-items{display:none}.gh-mac-dock.dock-mobile-open .dock-items{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;max-width:calc(100vw - 24px);padding:8px;border:1px solid rgba(220,232,245,.28);border-radius:18px;background:linear-gradient(180deg,rgba(40,48,58,.96),rgba(18,24,32,.94));box-shadow:0 12px 32px rgba(0,0,0,.48),inset 0 1px rgba(255,255,255,.2);backdrop-filter:blur(24px) saturate(1.35)}.dock-items>span{display:none}.dock-app{height:38px;width:38px;flex-basis:38px;border-radius:10px;--dock-scale:1!important;--dock-shift:0px!important}.gh-app-icon{height:34px;width:34px;border-radius:9px}.os-window{bottom:max(176px,24svh)!important}}
          @media(max-width:360px){.gh-mac-dock{gap:1px;padding:5px}.dock-app{width:32px;height:34px;flex-basis:32px}.gh-app-icon{height:29px;width:29px}}
          @media(min-width:641px) and (max-width:1023px){.os-window--maximized{bottom:calc(clamp(16px,2.5vh,24px) + 76px)!important}}
          @media(max-width:639px){.os-window{translate:0 0!important}}
          @media(prefers-reduced-motion:reduce){.dock-app,.dock-app::after,.dock-icon,.os-window{transition:none;animation:none}.dock-app:hover,.dock-app:active{transform:none}}
        `}</style>
      </main>
    </OsShellContext.Provider>
  );
}
