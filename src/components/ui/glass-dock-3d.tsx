/* Hallmark · component: 3d-glass-dock · genre: atmospheric · theme: ganos-adaptive
 * states: default · hover · focus · active · running · launching · minimized · hidden
 * pre-emit critique: P5 H5 E5 S5 R5 V5
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  clampDockSettings,
  stepSpring,
  writeDockIconTargets,
  type DockSettings,
} from '@/lib/dock-physics';

export interface GlassDock3DItem {
  key: string;
  title: string;
  iconSrc: string;
  isRunning?: boolean;
  isMinimizedWindow?: boolean;
  isLaunching?: boolean;
  isDropTarget?: boolean;
  badge?: number | string | null;
  onClick: () => void;
}

export interface GlassDock3DProps {
  groups: GlassDock3DItem[][];
  mobileItems?: GlassDock3DItem[];
  activeKey?: string | null;
  isHidden?: boolean;
  onRevealChange?: (revealed: boolean) => void;
  settings?: Partial<DockSettings>;
  showTooltips?: boolean;
  showReflections?: boolean;
  className?: string;
}

type LayoutSlot =
  | {
      kind: 'item';
      item: GlassDock3DItem;
      flatIndex: number;
      marginLeft: number;
    }
  | {
      kind: 'divider';
      key: string;
      width: number;
    };

function computeGroupLayout(
  groups: GlassDock3DItem[][],
  baseSize: number,
  gap: number,
  dividerWidth: number,
): {
  slots: LayoutSlot[];
  flatItems: GlassDock3DItem[];
  itemCenters: number[];
  totalRowWidth: number;
} {
  const nonEmptyGroups = groups.filter((g) => g.length > 0);
  const slots: LayoutSlot[] = [];
  const flatItems: GlassDock3DItem[] = [];
  const itemCenters: number[] = [];

  let cursorX = 0;

  nonEmptyGroups.forEach((group, groupIndex) => {
    if (groupIndex > 0) {
      slots.push({
        kind: 'divider',
        key: `divider-${groupIndex}`,
        width: dividerWidth,
      });
      cursorX += dividerWidth;
    }

    group.forEach((item, indexInGroup) => {
      const marginLeft = indexInGroup === 0 ? 0 : gap;
      cursorX += marginLeft;
      const flatIndex = flatItems.length;
      flatItems.push(item);
      itemCenters.push(cursorX + baseSize / 2);
      slots.push({
        kind: 'item',
        item,
        flatIndex,
        marginLeft,
      });
      cursorX += baseSize;
    });
  });

  return {
    slots,
    flatItems,
    itemCenters,
    totalRowWidth: cursorX,
  };
}

function computeDesktopMetrics(viewportWidth: number): {
  baseSize: number;
  gap: number;
} {
  if (viewportWidth >= 1280) {
    return { baseSize: 52, gap: 9 };
  }
  if (viewportWidth >= 960) {
    return { baseSize: 48, gap: 8 };
  }
  return { baseSize: 44, gap: 6 };
}

const MinimizedThumbnail3D: React.FC<{ iconSrc: string }> = ({ iconSrc }) => (
  <div className="relative flex h-full w-full items-center justify-center p-[6%]">
    <div className="relative h-full w-full overflow-hidden rounded-[22%] border border-white/45 bg-gradient-to-b from-[#f0eef2]/90 to-[#dcd8e0]/80 shadow-[0_6px_14px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.75)] dark:border-white/20 dark:from-[#3a323e]/90 dark:to-[#221d26]/90">
      <div className="flex gap-[2.5px] p-[5px]">
        <span className="h-[4px] w-[4px] rounded-full bg-[#ff5f57]" />
        <span className="h-[4px] w-[4px] rounded-full bg-[#febc2e]" />
        <span className="h-[4px] w-[4px] rounded-full bg-[#28c840]" />
      </div>
      <img
        src={iconSrc}
        alt=""
        draggable={false}
        className="absolute -bottom-[6%] -right-[6%] h-[56%] w-[56%] object-contain select-none"
      />
    </div>
  </div>
);

const StaticShelfReflections = React.memo(function StaticShelfReflections({
  slots,
  baseSize,
  totalRowWidth,
  reflectionStartTop,
  reflectionOpacity,
}: {
  slots: LayoutSlot[];
  baseSize: number;
  totalRowWidth: number;
  reflectionStartTop: number;
  reflectionOpacity: number;
}) {
  return (
    <div
      className="pointer-events-none absolute left-1/2 flex items-start"
      style={{
        top: `${reflectionStartTop}px`,
        width: `${totalRowWidth}px`,
        height: `${baseSize}px`,
        opacity: reflectionOpacity,
        filter: 'blur(1px) saturate(1.2)',
        transform: 'translate(-50%, 0) translateZ(0)',
        contain: 'layout style',
        maskImage:
          'linear-gradient(to bottom, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.52) 26%, rgba(0,0,0,0.14) 48%, transparent 62%)',
        WebkitMaskImage:
          'linear-gradient(to bottom, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.52) 26%, rgba(0,0,0,0.14) 48%, transparent 62%)',
      }}
    >
      {slots.map((slot) => {
        if (slot.kind === 'divider') {
          return (
            <div
              key={slot.key}
              className="shrink-0"
              style={{ width: `${slot.width}px` }}
            />
          );
        }
        return (
          <div
            key={slot.item.key}
            className="shrink-0"
            style={{
              width: `${baseSize}px`,
              height: `${baseSize}px`,
              marginLeft: `${slot.marginLeft}px`,
              transformOrigin: 'center top',
              // Flip downward from icon bottom into the masked reflection zone
              transform: 'translateY(55%) scale(1, -0.55)',
            }}
          >
            {slot.item.isMinimizedWindow ? (
              <MinimizedThumbnail3D iconSrc={slot.item.iconSrc} />
            ) : (
              <img
                src={slot.item.iconSrc}
                alt=""
                draggable={false}
                className="h-full w-full object-contain select-none"
              />
            )}
          </div>
        );
      })}
    </div>
  );
});

const DesktopGlassDock3D: React.FC<{
  groups: GlassDock3DItem[][];
  activeKey?: string | null;
  settings?: Partial<DockSettings>;
  showTooltips: boolean;
  showReflections: boolean;
  className?: string;
}> = ({
  groups,
  activeKey = null,
  settings,
  showTooltips,
  showReflections,
  className = '',
}) => {
  const resolvedSettings = useMemo(
    () => clampDockSettings(settings ?? {}),
    [settings],
  );

  const [{ baseSize, gap }, setMetrics] = useState<{
    baseSize: number;
    gap: number;
  }>(() =>
    computeDesktopMetrics(
      typeof window !== 'undefined' ? window.innerWidth : 1440,
    ),
  );

  const dividerWidth = Math.round(baseSize * 0.36);

  const { slots, flatItems, itemCenters, totalRowWidth } = useMemo(
    () => computeGroupLayout(groups, baseSize, gap, dividerWidth),
    [groups, baseSize, gap, dividerWidth],
  );

  const appCount = flatItems.length;

  const navRef = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<Array<HTMLDivElement | null>>([]);
  const visualRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const animRafRef = useRef<number>(0);
  const warmTimerRef = useRef<number | null>(null);
  const coolTimerRef = useRef<number | null>(null);

  const rowRectRef = useRef<{ left: number; width: number } | null>(null);
  const reduceMotionRef = useRef<boolean>(false);
  const pendingClientXRef = useRef<number | null>(null);
  const pointerActiveRef = useRef<boolean>(false);

  const currentScalesRef = useRef<number[]>([]);
  const scaleVelsRef = useRef<number[]>([]);
  const targetScalesRef = useRef<number[]>([]);

  const currentLiftsRef = useRef<number[]>([]);
  const liftVelsRef = useRef<number[]>([]);
  const targetLiftsRef = useRef<number[]>([]);

  const currentOffsetsXRef = useRef<number[]>([]);
  const offsetXVelsRef = useRef<number[]>([]);
  const targetOffsetsXRef = useRef<number[]>([]);

  const targetZIndicesRef = useRef<number[]>([]);
  const lastZIndicesRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef<number>(0);

  if (currentScalesRef.current.length !== appCount) {
    currentScalesRef.current = new Array(appCount).fill(1);
    scaleVelsRef.current = new Array(appCount).fill(0);
    targetScalesRef.current = new Array(appCount).fill(1);
    currentLiftsRef.current = new Array(appCount).fill(0);
    liftVelsRef.current = new Array(appCount).fill(0);
    targetLiftsRef.current = new Array(appCount).fill(0);
    currentOffsetsXRef.current = new Array(appCount).fill(0);
    offsetXVelsRef.current = new Array(appCount).fill(0);
    targetOffsetsXRef.current = new Array(appCount).fill(0);
    targetZIndicesRef.current = new Array(appCount).fill(3);
    lastZIndicesRef.current = new Array(appCount).fill(3);
  }

  const measureRowRect = useCallback(() => {
    const rowEl = rowRef.current;
    if (!rowEl) return null;
    const rect = rowEl.getBoundingClientRect();
    rowRectRef.current = { left: rect.left, width: rect.width };
    return rowRectRef.current;
  }, []);

  useEffect(() => {
    rowRectRef.current = null;
  }, [totalRowWidth, appCount]);

  useEffect(() => {
    const handleResize = () => {
      rowRectRef.current = null;
      const next = computeDesktopMetrics(window.innerWidth);
      setMetrics((prev) =>
        prev.baseSize === next.baseSize && prev.gap === next.gap ? prev : next,
      );
    };
    window.addEventListener('resize', handleResize);

    const rowEl = rowRef.current;
    let resizeObserver: ResizeObserver | null = null;
    if (rowEl && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        rowRectRef.current = null;
      });
      resizeObserver.observe(rowEl);
    }

    const mq =
      typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;
    if (mq) {
      reduceMotionRef.current = mq.matches;
      const handleMotionChange = (event: MediaQueryListEvent) => {
        reduceMotionRef.current = event.matches;
      };
      mq.addEventListener('change', handleMotionChange);
      return () => {
        window.removeEventListener('resize', handleResize);
        resizeObserver?.disconnect();
        mq.removeEventListener('change', handleMotionChange);
      };
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver?.disconnect();
    };
  }, []);

  const effectiveSettings = useMemo<DockSettings>(() => {
    const ratio = baseSize / 52;
    return {
      ...resolvedSettings,
      influenceRadius: resolvedSettings.influenceRadius * Math.max(0.78, ratio),
      maxLift: resolvedSettings.maxLift * Math.max(0.75, ratio),
      maxSpread: resolvedSettings.maxSpread * Math.max(0.75, ratio),
    };
  }, [resolvedSettings, baseSize]);

  // Proportional 3D extruded glass shelf dimensions
  const shelfPadX = Math.round(baseSize * 0.42);
  const shelfTotalWidth = totalRowWidth + shelfPadX * 2;
  const shelfHeight = Math.round(baseSize * 0.56);
  const shelfThickness = Math.round(baseSize * 0.29);
  const shelfFrontDeck = Math.round(baseSize * 0.16);
  const shelfRadius = Math.round(shelfHeight * 0.5);
  const iconsBottomOffset = shelfThickness + shelfFrontDeck;
  const reflectionStartTop = shelfHeight - shelfFrontDeck;
  const dotBottomOffset = Math.round(shelfFrontDeck + shelfThickness * 0.52);

  const geometryRef = useRef({
    itemCenters,
    effectiveSettings,
    appCount,
    shelfPadX,
  });
  geometryRef.current = { itemCenters, effectiveSettings, appCount, shelfPadX };

  const updateSpotlight = useCallback((relativePointerX: number | null) => {
    const spotEl = spotlightRef.current;
    if (!spotEl) return;
    if (relativePointerX === null) {
      spotEl.style.opacity = '0';
      return;
    }
    const { shelfPadX: padX } = geometryRef.current;
    const xInShelf = relativePointerX + padX;
    spotEl.style.opacity = '1';
    spotEl.style.transform = `translate3d(${xInShelf.toFixed(1)}px, 0, 0) translateX(-50%)`;
  }, []);

  const applyTargets = useCallback(
    (relativePointerX: number | null) => {
      const {
        itemCenters: centers,
        effectiveSettings: cfg,
        appCount: count,
      } = geometryRef.current;

      writeDockIconTargets({
        itemCenters: centers,
        pointerX: relativePointerX,
        settings: cfg,
        outScales: targetScalesRef.current,
        outLifts: targetLiftsRef.current,
        outOffsetsX: targetOffsetsXRef.current,
        outZIndices: targetZIndicesRef.current,
      });

      updateSpotlight(relativePointerX);

      for (let i = 0; i < count; i++) {
        const nextZ = targetZIndicesRef.current[i];
        if (lastZIndicesRef.current[i] !== nextZ) {
          lastZIndicesRef.current[i] = nextZ;
          const slotEl = slotRefs.current[i];
          if (slotEl) {
            slotEl.style.zIndex = String(nextZ);
          }
        }
      }
    },
    [updateSpotlight],
  );

  const stepAnimation = useCallback(
    (now: number) => {
      if (pointerActiveRef.current && pendingClientXRef.current !== null) {
        const rect = rowRectRef.current ?? measureRowRect();
        if (rect) {
          applyTargets(pendingClientXRef.current - rect.left);
        }
        pendingClientXRef.current = null;
      }

      const prevTime = lastFrameTimeRef.current || now - 16.667;
      const dt = (now - prevTime) / 1000;
      lastFrameTimeRef.current = now;

      let needsNextFrame = false;
      const { appCount: count } = geometryRef.current;

      for (let i = 0; i < count; i++) {
        const targetScale = targetScalesRef.current[i];
        const targetLift = targetLiftsRef.current[i];
        const targetOffsetX = targetOffsetsXRef.current[i];

        const prevScale = currentScalesRef.current[i];
        const prevLift = currentLiftsRef.current[i];
        const prevOffsetX = currentOffsetsXRef.current[i];

        const scaleStep = stepSpring(
          prevScale,
          scaleVelsRef.current[i],
          targetScale,
          dt,
          {
            stiffness: 460,
            damping: 34,
            valueThreshold: 0.0005,
            velocityThreshold: 0.002,
          },
        );
        const liftStep = stepSpring(
          prevLift,
          liftVelsRef.current[i],
          targetLift,
          dt,
          {
            stiffness: 460,
            damping: 34,
            valueThreshold: 0.02,
            velocityThreshold: 0.08,
          },
        );
        const offsetXStep = stepSpring(
          prevOffsetX,
          offsetXVelsRef.current[i],
          targetOffsetX,
          dt,
          {
            stiffness: 440,
            damping: 36,
            valueThreshold: 0.02,
            velocityThreshold: 0.08,
          },
        );

        currentScalesRef.current[i] = scaleStep.value;
        scaleVelsRef.current[i] = scaleStep.velocity;
        currentLiftsRef.current[i] = liftStep.value;
        liftVelsRef.current[i] = liftStep.velocity;
        currentOffsetsXRef.current[i] = offsetXStep.value;
        offsetXVelsRef.current[i] = offsetXStep.velocity;

        if (!scaleStep.settled || !liftStep.settled || !offsetXStep.settled) {
          needsNextFrame = true;
        }

        if (
          scaleStep.value !== prevScale ||
          liftStep.value !== prevLift ||
          offsetXStep.value !== prevOffsetX ||
          !scaleStep.settled ||
          !liftStep.settled ||
          !offsetXStep.settled
        ) {
          const visualEl = visualRefs.current[i];
          if (visualEl) {
            visualEl.style.transform = `translate3d(${offsetXStep.value.toFixed(2)}px, ${liftStep.value.toFixed(2)}px, 0) scale(${scaleStep.value.toFixed(4)})`;
          }
        }
      }

      if (needsNextFrame) {
        animRafRef.current = requestAnimationFrame(stepAnimation);
      } else {
        animRafRef.current = 0;
        lastFrameTimeRef.current = 0;
      }
    },
    [applyTargets, measureRowRect],
  );

  const ensureAnimationLoop = useCallback(() => {
    const { appCount: count } = geometryRef.current;
    // Under prefers-reduced-motion: skip spring oscillation but still apply crisp gentle hover highlight
    if (reduceMotionRef.current) {
      if (pointerActiveRef.current && pendingClientXRef.current !== null) {
        const rect = rowRectRef.current ?? measureRowRect();
        if (rect) {
          applyTargets(pendingClientXRef.current - rect.left);
        }
        pendingClientXRef.current = null;
      }
      for (let i = 0; i < count; i++) {
        const subtleScale = 1 + (targetScalesRef.current[i] - 1) * 0.35;
        currentScalesRef.current[i] = subtleScale;
        currentLiftsRef.current[i] = 0;
        currentOffsetsXRef.current[i] = 0;
        scaleVelsRef.current[i] = 0;
        liftVelsRef.current[i] = 0;
        offsetXVelsRef.current[i] = 0;
        const visualEl = visualRefs.current[i];
        if (visualEl) {
          visualEl.style.transform = `translate3d(0, 0, 0) scale(${subtleScale.toFixed(4)})`;
        }
      }
      return;
    }

    if (!animRafRef.current) {
      lastFrameTimeRef.current = 0;
      animRafRef.current = requestAnimationFrame(stepAnimation);
    }
  }, [applyTargets, measureRowRect, stepAnimation]);

  const resetDock = useCallback(() => {
    pointerActiveRef.current = false;
    pendingClientXRef.current = null;
    if (warmTimerRef.current) {
      window.clearTimeout(warmTimerRef.current);
      warmTimerRef.current = null;
    }
    if (coolTimerRef.current) {
      window.clearTimeout(coolTimerRef.current);
    }
    coolTimerRef.current = window.setTimeout(() => {
      navRef.current?.removeAttribute('data-dock-warm');
      coolTimerRef.current = null;
    }, 160);

    applyTargets(null);
    ensureAnimationLoop();
  }, [applyTargets, ensureAnimationLoop]);

  useEffect(() => {
    window.addEventListener('blur', resetDock);
    return () => {
      window.removeEventListener('blur', resetDock);
      if (animRafRef.current) cancelAnimationFrame(animRafRef.current);
      if (warmTimerRef.current) window.clearTimeout(warmTimerRef.current);
      if (coolTimerRef.current) window.clearTimeout(coolTimerRef.current);
    };
  }, [resetDock]);

  const handlePointerEnter = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (event.pointerType === 'touch') return;
      if (coolTimerRef.current) {
        window.clearTimeout(coolTimerRef.current);
        coolTimerRef.current = null;
      }
      if (!warmTimerRef.current) {
        warmTimerRef.current = window.setTimeout(() => {
          navRef.current?.setAttribute('data-dock-warm', 'true');
          warmTimerRef.current = null;
        }, 110);
      }
      measureRowRect();
      pointerActiveRef.current = true;
      pendingClientXRef.current = event.clientX;
      ensureAnimationLoop();
    },
    [measureRowRect, ensureAnimationLoop],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (event.pointerType === 'touch') return;
      pointerActiveRef.current = true;
      pendingClientXRef.current = event.clientX;
      ensureAnimationLoop();
    },
    [ensureAnimationLoop],
  );

  return (
    <nav
      ref={navRef}
      aria-label="Dock"
      data-testid="glass-dock-3d"
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetDock}
      className={cn(
        'dock-3d-nav relative hidden flex-col items-center justify-center select-none md:flex',
        className,
      )}
    >
      <div
        className="relative flex flex-col items-center"
        style={{
          paddingTop: `${Math.round(baseSize * 0.65)}px`,
          paddingBottom: `${iconsBottomOffset + 2}px`,
        }}
      >
        {/* Fixed 3D Extruded Frosted Glass Shelf (isolated GPU layer, never resizes) */}
        <div
          aria-hidden="true"
          data-testid="glass-shelf-3d"
          className="pointer-events-none absolute left-1/2 -translate-x-1/2"
          style={{
            width: `${shelfTotalWidth}px`,
            height: `${shelfHeight + shelfThickness}px`,
            bottom: '2px',
            contain: 'layout style',
            transform: 'translate(-50%, 0) translateZ(0)',
          }}
        >
          {/* Extruded Frosted Acrylic Slab */}
          <div
            className="dock-3d-slab absolute inset-x-0 bottom-0 overflow-hidden backdrop-blur-2xl backdrop-saturate-150"
            style={{
              height: `${shelfHeight + shelfThickness}px`,
              borderRadius: `${shelfRadius}px`,
            }}
          >
            {showReflections && resolvedSettings.reflectionOpacity > 0 && (
              <StaticShelfReflections
                slots={slots}
                baseSize={baseSize}
                totalRowWidth={totalRowWidth}
                reflectionStartTop={reflectionStartTop}
                reflectionOpacity={resolvedSettings.reflectionOpacity}
              />
            )}

            {/* Dynamic cursor specular glow gliding across the frosted glass shelf */}
            <div
              ref={spotlightRef}
              className="dock-3d-spotlight pointer-events-none absolute inset-y-0 left-0 w-[140px] opacity-0 transition-opacity duration-200 ease-out"
            />

            {/* Curved glass end-cap specular pillars */}
            <div className="dock-3d-cap-left absolute inset-y-0 left-0 w-8" />
            <div className="dock-3d-cap-right absolute inset-y-0 right-0 w-8" />
          </div>

          {/* Upper Receding Glass Deck Rim */}
          <div
            className="dock-3d-deck absolute inset-x-0 top-0"
            style={{
              height: `${shelfHeight}px`,
              borderRadius: `${shelfRadius}px`,
            }}
          />

          {/* Crisp front specular lip highlight */}
          <div
            className="dock-3d-lip absolute inset-x-3"
            style={{
              top: `${shelfHeight - 1}px`,
              height: '1.5px',
              borderRadius: '999px',
            }}
          />
        </div>

        {/* Interactive Icons Row */}
        <div
          ref={rowRef}
          className="relative z-10 flex items-end"
          style={{ width: `${totalRowWidth}px` }}
        >
          {slots.map((slot) => {
            if (slot.kind === 'divider') {
              return (
                <div
                  key={slot.key}
                  role="separator"
                  aria-orientation="vertical"
                  className="flex shrink-0 items-center justify-center self-center"
                  style={{
                    width: `${slot.width}px`,
                    height: `${Math.round(baseSize * 0.68)}px`,
                  }}
                >
                  <span className="h-full w-px rounded-full bg-white/35 shadow-[0_0_6px_rgba(255,255,255,0.35)] dark:bg-white/25" />
                </div>
              );
            }

            const { item, flatIndex, marginLeft } = slot;
            const isActive = activeKey === item.key;

            return (
              <div
                key={item.key}
                ref={(el) => {
                  slotRefs.current[flatIndex] = el;
                }}
                data-active={isActive ? 'true' : 'false'}
                className="dock-3d-item dock-3d-slot relative flex shrink-0 flex-col items-center"
                style={{
                  width: `${baseSize}px`,
                  height: `${baseSize}px`,
                  marginLeft: `${marginLeft}px`,
                  zIndex: 3,
                }}
              >
                {showTooltips && (
                  <div
                    role="tooltip"
                    className="dock-3d-tooltip pointer-events-none absolute left-1/2 whitespace-nowrap rounded-lg px-2.5 py-1 text-[11.5px] font-medium tracking-wide shadow-lg"
                    style={{
                      bottom: `${Math.round(baseSize * Math.max(1.36, resolvedSettings.magnification) + effectiveSettings.maxLift + 8)}px`,
                    }}
                  >
                    {item.title}
                    <span
                      aria-hidden="true"
                      className="dock-3d-tooltip-arrow absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45"
                    />
                  </div>
                )}

                <button
                  type="button"
                  aria-label={item.title}
                  aria-pressed={isActive}
                  data-dock-id={item.key}
                  onClick={item.onClick}
                  className={cn(
                    'dock-3d-btn relative h-full w-full cursor-pointer rounded-[22%] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40',
                    item.isLaunching && 'dock-3d-launching',
                    item.isDropTarget &&
                      'scale-[1.18] -translate-y-1.5 ring-2 ring-[#ff453a]/90 shadow-[0_0_24px_rgba(255,69,58,0.55)]',
                  )}
                >
                  <span
                    ref={(el) => {
                      visualRefs.current[flatIndex] = el;
                    }}
                    className="dock-3d-visual relative block h-full w-full"
                  >
                    {item.isMinimizedWindow ? (
                      <MinimizedThumbnail3D iconSrc={item.iconSrc} />
                    ) : (
                      <img
                        src={item.iconSrc}
                        alt=""
                        draggable={false}
                        className="h-full w-full object-contain select-none"
                      />
                    )}

                    <AnimatePresence>
                      {Boolean(item.badge) && (
                        <motion.span
                          aria-label={`${item.badge} notifications`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.92 }}
                          transition={{
                            duration: 0.15,
                            ease: [0.23, 1, 0.32, 1],
                          }}
                          className="pointer-events-none absolute -right-1 -top-1 z-20 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#ff3b30] px-1 text-[10px] font-bold tracking-tight text-white shadow-[0_2px_6px_rgba(0,0,0,0.45),0_0_0_1.5px_rgba(255,255,255,0.88)]"
                        >
                          {item.badge}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </button>

                {/* Running / Active Indicator seated on the front 3D glass lip (GPU transform + opacity only) */}
                <span
                  aria-hidden="true"
                  className={cn(
                    'dock-3d-dot pointer-events-none absolute left-1/2 rounded-full transition-[opacity,transform] duration-150 ease-out',
                    item.isRunning ? 'opacity-100' : 'opacity-0',
                    isActive && 'dock-3d-dot-active',
                  )}
                  style={{
                    bottom: `-${dotBottomOffset}px`,
                    width: '11px',
                    height: '4.5px',
                    transform: `translate3d(-50%, 0, 0) scaleX(${
                      !item.isRunning ? 0.32 : isActive ? 1 : 0.41
                    })`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

const MobileGlassDock3D: React.FC<{
  items: GlassDock3DItem[];
  activeKey?: string | null;
}> = ({ items, activeKey }) => {
  const visibleItems = items.slice(0, 5);

  return (
    <nav
      aria-label="Dock"
      className="relative flex w-full max-w-[calc(100vw-20px)] justify-center select-none md:hidden"
    >
      <div className="relative px-3.5 pb-3.5 pt-1.5">
        {/* Compact 3D Frosted Glass Shelf for Mobile */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[44px]"
        >
          <div className="dock-3d-slab absolute inset-0 overflow-hidden rounded-[18px] backdrop-blur-2xl backdrop-saturate-150">
            <div className="dock-3d-cap-left absolute inset-y-0 left-0 w-6" />
            <div className="dock-3d-cap-right absolute inset-y-0 right-0 w-6" />
          </div>
          <div className="dock-3d-deck absolute inset-x-0 top-0 h-[28px] rounded-[18px]" />
          <div className="dock-3d-lip absolute inset-x-3 top-[27px] h-[1.5px] rounded-full" />
        </div>

        <div className="relative z-10 flex items-end gap-2.5">
          {visibleItems.map((item) => {
            const isActive = activeKey === item.key;
            return (
              <div
                key={item.key}
                className="relative flex flex-col items-center"
              >
                <button
                  type="button"
                  aria-label={item.title}
                  aria-pressed={isActive}
                  data-dock-id={item.key}
                  onClick={item.onClick}
                  className={cn(
                    'dock-3d-btn relative h-12 w-12 min-h-[44px] min-w-[44px] rounded-[22%] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/90',
                    item.isLaunching && 'dock-3d-launching',
                  )}
                >
                  <img
                    src={item.iconSrc}
                    alt=""
                    draggable={false}
                    className="h-full w-full object-contain select-none"
                  />
                  {Boolean(item.badge) && (
                    <span
                      aria-label={`${item.badge} notifications`}
                      className="pointer-events-none absolute -right-0.5 -top-0.5 z-20 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff3b30] px-1 text-[9px] font-bold text-white shadow-sm ring-1 ring-white"
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
                <span
                  aria-hidden="true"
                  className={cn(
                    'dock-3d-dot pointer-events-none absolute -bottom-2.5 left-1/2 rounded-full transition-[opacity,transform] duration-150 ease-out',
                    item.isRunning ? 'opacity-100' : 'opacity-0',
                    isActive && 'dock-3d-dot-active',
                  )}
                  style={{
                    width: '10px',
                    height: '4px',
                    transform: `translate3d(-50%, 0, 0) scaleX(${
                      !item.isRunning ? 0.32 : isActive ? 1 : 0.4
                    })`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export const GlassDock3D: React.FC<GlassDock3DProps> = ({
  groups,
  mobileItems,
  activeKey = null,
  isHidden = false,
  onRevealChange,
  settings,
  showTooltips = true,
  showReflections = true,
  className,
}) => {
  const flatMobileItems = useMemo(
    () => mobileItems ?? groups.flat().slice(0, 5),
    [mobileItems, groups],
  );

  return (
    <>
      {isHidden && (
        <div
          aria-hidden="true"
          className="fixed inset-x-0 bottom-0 z-30 hidden h-2.5 md:block"
          onMouseEnter={() => onRevealChange?.(true)}
        />
      )}
      <div
        className="hidden transition-transform ease-drawer md:block"
        style={{
          transform: isHidden
            ? 'translate3d(0, 128px, 0)'
            : 'translate3d(0, 0, 0)',
          transitionDuration: '260ms',
          transitionTimingFunction: 'var(--ease-drawer)',
        }}
        onMouseLeave={() => onRevealChange?.(false)}
      >
        <DesktopGlassDock3D
          groups={groups}
          activeKey={activeKey}
          settings={settings}
          showTooltips={showTooltips}
          showReflections={showReflections}
          className={className}
        />
      </div>
      <MobileGlassDock3D items={flatMobileItems} activeKey={activeKey} />
    </>
  );
};
