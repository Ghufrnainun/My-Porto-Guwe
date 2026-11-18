import React, { useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export type MacOSDockItem = {
  key: string;
  title: string;
  iconSrc: string;
  isRunning?: boolean;
  isMinimizedWindow?: boolean;
  isLaunching?: boolean;
  onClick: () => void;
};

type MacOSDockProps = {
  groups: MacOSDockItem[][];
  isHidden?: boolean;
  onRevealChange?: (revealed: boolean) => void;
};

const DOCK_BASE = 56;
const DOCK_MAX = 84;
const DOCK_RANGE = 170;

const magnify = (distance: number) => {
  if (Math.abs(distance) > DOCK_RANGE) return DOCK_BASE;
  return DOCK_BASE + (DOCK_MAX - DOCK_BASE) * Math.cos((distance / DOCK_RANGE) * (Math.PI / 2));
};

const springConfig = { mass: 0.2, stiffness: 520, damping: 42 };

const MinimizedThumbnail: React.FC<{ iconSrc: string }> = ({ iconSrc }) => (
  <div className="absolute inset-[8%] overflow-hidden rounded-[6px] bg-[#e8e6ea] shadow-[0_2px_6px_rgba(0,0,0,0.35)] ring-[0.5px] ring-black/30 dark:bg-[#3a3039]">
    <div className="flex gap-[2px] p-[4px]">
      <span className="h-[4px] w-[4px] rounded-full bg-[#ff5f57]" />
      <span className="h-[4px] w-[4px] rounded-full bg-[#febc2e]" />
      <span className="h-[4px] w-[4px] rounded-full bg-[#28c840]" />
    </div>
    <img
      src={iconSrc}
      alt=""
      draggable={false}
      className="absolute -bottom-[6%] -right-[6%] h-[55%] w-[55%] object-contain select-none"
    />
  </div>
);

const DockItemButton: React.FC<{
  item: MacOSDockItem;
  mouseX: MotionValue<number>;
}> = ({ item, mouseX }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);
  const reduceMotion = useReducedMotion();

  const distance = useTransform(mouseX, (val) => {
    if (reduceMotion) return Infinity;
    const rect = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - rect.x - rect.width / 2;
  });

  const size = useSpring(useTransform(distance, magnify), springConfig);

  return (
    <div className="relative flex items-end">
      <motion.button
        ref={ref}
        type="button"
        aria-label={item.title}
        data-dock-id={item.key}
        style={{ width: size, height: size }}
        onClick={item.onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        animate={
          item.isLaunching && !reduceMotion
            ? { y: [0, -24, 0, -11, 0] }
            : { y: 0 }
        }
        transition={{
          duration: 0.75,
          times: [0, 0.3, 0.55, 0.78, 1],
          ease: 'easeInOut',
        }}
        className="relative flex cursor-default items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0a84ff]"
      >
        <AnimatePresence>
          {hovered && (
            <motion.span
              role="tooltip"
              initial={{ opacity: 0, x: '-50%' }}
              animate={{ opacity: 1, x: '-50%' }}
              exit={{ opacity: 0, x: '-50%', transition: { duration: 0.1 } }}
              transition={{ duration: 0.1 }}
              className="pointer-events-none absolute -top-[38px] left-1/2 flex h-[26px] items-center whitespace-pre rounded-[8px] bg-[#1e1e1e]/80 px-2.5 text-[13px] text-white shadow-[0_4px_12px_rgba(0,0,0,0.25),inset_0_0_0_0.5px_rgba(255,255,255,0.18)] backdrop-blur-xl"
            >
              {item.title}
            </motion.span>
          )}
        </AnimatePresence>

        <span className="relative h-full w-full active:brightness-[0.55]">
          {item.isMinimizedWindow ? (
            <MinimizedThumbnail iconSrc={item.iconSrc} />
          ) : (
            <img
              src={item.iconSrc}
              alt=""
              draggable={false}
              className="h-full w-full object-contain select-none"
            />
          )}
        </span>

        {item.isRunning && (
          <span
            aria-hidden="true"
            className="absolute -bottom-[5px] h-[5px] w-[5px] rounded-full bg-white/75"
          />
        )}
      </motion.button>
    </div>
  );
};

const DesktopDock: React.FC<{ groups: MacOSDockItem[][] }> = ({ groups }) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <nav
      aria-label="Dock"
      onMouseMove={(event) => mouseX.set(event.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="mx-auto hidden h-[70px] items-end rounded-[26px] bg-white/[0.18] px-1.5 pb-[7px] shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.35),inset_0_1px_0_rgba(255,255,255,0.25),0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-2xl backdrop-saturate-150 md:flex dark:bg-black/[0.2]"
    >
      {groups.map((items, groupIndex) => (
        <React.Fragment key={groupIndex}>
          {groupIndex > 0 && (
            <div
              role="separator"
              className="mx-1.5 h-[46px] w-px self-center bg-white/25"
            />
          )}
          {items.map((item) => (
            <DockItemButton key={item.key} item={item} mouseX={mouseX} />
          ))}
        </React.Fragment>
      ))}
    </nav>
  );
};

const MobileDock: React.FC<{ items: MacOSDockItem[] }> = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav aria-label="Dock" className="relative block md:hidden">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="absolute inset-x-0 bottom-full mb-2 flex flex-col items-center gap-2"
          >
            {items.map((item, index) => (
              <motion.button
                key={item.key}
                type="button"
                aria-label={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  y: 10,
                  transition: { delay: index * 0.03 },
                }}
                transition={{ delay: (items.length - 1 - index) * 0.03 }}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className="relative h-12 w-12"
              >
                <img
                  src={item.iconSrc}
                  alt=""
                  draggable={false}
                  className="h-full w-full object-contain select-none"
                />
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        aria-label={isOpen ? 'Hide Dock' : 'Show Dock'}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex h-11 w-11 items-center justify-center rounded-full bg-white/20 shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.35)] backdrop-blur-2xl transition-transform dark:bg-black/25',
          isOpen && 'rotate-180',
        )}
      >
        <ChevronUp className="h-5 w-5 text-white" aria-hidden="true" />
      </button>
    </nav>
  );
};

export const MacOSDock: React.FC<MacOSDockProps> = ({
  groups,
  isHidden = false,
  onRevealChange,
}) => {
  return (
    <>
      {isHidden && (
        <div
          className="fixed inset-x-0 bottom-0 z-30 hidden h-2 md:block"
          onMouseEnter={() => onRevealChange?.(true)}
        />
      )}
      <motion.div
        className="hidden md:block"
        animate={{ y: isHidden ? 120 : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
        onMouseLeave={() => onRevealChange?.(false)}
      >
        <DesktopDock groups={groups} />
      </motion.div>
      <MobileDock items={groups.flat()} />
    </>
  );
};
