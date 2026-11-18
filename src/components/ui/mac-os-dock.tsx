import { useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export type MacOSDockItem = {
  id: string;
  label: string;
  sprite: number;
  selected?: boolean;
};

type MacOSDockProps = {
  items: MacOSDockItem[];
  launcherOpen: boolean;
  onLauncher: () => void;
  onOpen: (id: string) => void;
  renderIcon: (sprite: number, className?: string) => ReactNode;
};

const MAX_RADIUS = 132;

export function MacOSDock({ items, launcherOpen, onLauncher, onOpen, renderIcon }: MacOSDockProps) {
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const navRef = useRef<HTMLElement | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const setMagnification = (pointerX: number) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const navBounds = navRef.current?.getBoundingClientRect();
    if (!navBounds) return;
    const localX = pointerX - navBounds.left - (navRef.current?.clientLeft ?? 0);
    const scales = itemRefs.current.map((button) => {
      if (!button) return 1;
      const centerX = button.offsetLeft + button.offsetWidth / 2;
      const distance = Math.abs(localX - centerX);
      const influence = Math.max(0, 1 - distance / MAX_RADIUS);
      return 1 + (0.42 * (1 + Math.cos(Math.PI * (1 - influence)))) / 2;
    });
    const extraWidths = scales.map((scale, index) => (scale - 1) * (itemRefs.current[index]?.offsetWidth ?? 46));
    for (const [index, button] of itemRefs.current.entries()) {
      if (!button) continue;
      button.style.setProperty('--dock-scale', scales[index].toFixed(3));
      const shift = extraWidths.reduce((sum, extra, neighborIndex) => sum + (neighborIndex < index ? extra / 2 : neighborIndex > index ? -extra / 2 : 0), 0);
      button.style.setProperty('--dock-shift', `${shift.toFixed(2)}px`);
    }
  };

  const resetMagnification = () => {
    for (const button of itemRefs.current) {
      button?.style.setProperty('--dock-scale', '1');
      button?.style.setProperty('--dock-shift', '0px');
    }
  };

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    setMagnification(event.clientX);
  };

  const focusItem = (index: number) => {
    const button = itemRefs.current[index];
    const nav = navRef.current;
    if (!button || !nav || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const localCenter = button.offsetLeft + button.offsetWidth / 2 + nav.clientLeft;
    setMagnification(nav.getBoundingClientRect().left + localCenter);
  };

  const handleClick = (button: HTMLButtonElement, action: () => void) => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      button.classList.remove('dock-bounce');
      void button.offsetWidth;
      button.classList.add('dock-bounce');
      window.setTimeout(() => button.classList.remove('dock-bounce'), 300);
    }
    action();
  };

  const renderItem = (item: MacOSDockItem, index: number) => (
    <button
      key={item.id}
      ref={(element) => { itemRefs.current[index] = element; }}
      type="button"
      onClick={(event) => handleClick(event.currentTarget, () => { setMobileExpanded(false); onOpen(item.id); })}
      onFocus={() => focusItem(index)}
      onBlur={resetMagnification}
      aria-label={`Open ${item.label}`}
      aria-current={item.selected ? 'page' : undefined}
      data-label={item.label}
      title={item.label}
      className={`dock-app dock-magnify-item grid place-items-center rounded-xl border ${item.selected ? 'os-selected' : 'os-dock-idle'}`}
      style={{ '--dock-scale': 1, '--dock-shift': '0px', '--dock-press': 1 } as CSSProperties}
    >
      {renderIcon(item.sprite, 'dock-icon')}
    </button>
  );

  return (
    <nav
      ref={navRef}
      aria-label="App dock"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetMagnification}
      className={`gh-mac-dock fixed bottom-[clamp(16px,2.5vh,24px)] left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/15 bg-transparent p-1.5 shadow-2xl backdrop-blur-2xl sm:gap-1.5 sm:p-2.5 sm:px-3 ${mobileExpanded ? 'dock-mobile-open' : ''}`}
    >
      <button type="button" className="dock-mobile-toggle items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-white/90" aria-label={mobileExpanded ? 'Close app dock' : 'Open app dock'} aria-expanded={mobileExpanded} onClick={() => { setMobileExpanded((expanded) => !expanded); resetMagnification(); }}>
        Apps {mobileExpanded ? <ChevronDown size={14} aria-hidden="true" /> : <ChevronUp size={14} aria-hidden="true" />}
      </button>
      <div id="dock-items" className="dock-items flex items-center gap-1 sm:gap-1.5">
        <button
          ref={(element) => { itemRefs.current[0] = element; }}
          type="button"
          onClick={(event) => handleClick(event.currentTarget, () => { setMobileExpanded(false); onLauncher(); })}
          onFocus={() => focusItem(0)}
          onBlur={resetMagnification}
          aria-label="Open app launcher"
          aria-expanded={launcherOpen}
          data-label="Apps"
          className="dock-app dock-magnify-item os-launcher-trigger grid place-items-center rounded-xl"
          style={{ '--dock-scale': 1, '--dock-shift': '0px', '--dock-press': 1 } as CSSProperties}
        >
          {renderIcon(0, 'dock-icon')}
        </button>
        <span aria-hidden="true" className="mx-1 h-7 w-px bg-white/15" />
        {items.map((item, index) => renderItem(item, index + 1))}
      </div>
    </nav>
  );
}
