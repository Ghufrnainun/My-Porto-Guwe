import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ExternalLink,
  FastForward,
  Pause,
  Play,
  Rewind,
  Volume2,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useOsMusicPlayback,
  useOsNote,
} from '@/components/os/OsShellContext';
import { playClickSound, playPanelOpenSound } from '@/lib/soundEffects';

export const DynamicIsland: React.FC = () => {
  const {
    activeTrack,
    isPlayingTrack,
    togglePlayTrack,
    nextTrack,
    prevTrack,
    seekTrack,
    openApp,
  } = useOsNote();
  const { trackPlaybackSec, trackDurationSec } = useOsMusicPlayback();
  const reduceMotion = useReducedMotion();

  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close expanded card on outside click or Escape
  useEffect(() => {
    if (!isExpanded) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsExpanded(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsExpanded(false);
    };
    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExpanded]);

  const formatSec = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const effectiveDuration = trackDurationSec || 30;
  const progressRatio = Math.min(
    1,
    Math.max(0, trackPlaybackSec / effectiveDuration)
  );

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seekTrack(ratio * effectiveDuration);
  };

  return (
    <div
      ref={containerRef}
      className="pointer-events-auto absolute left-1/2 top-1 z-50 hidden -translate-x-1/2 select-none md:block"
    >
      <motion.div
        layout={!reduceMotion}
        transition={
          reduceMotion
            ? { duration: 0.01 }
            : {
                type: 'spring',
                stiffness: 440,
                damping: 34,
                mass: 0.78,
              }
        }
        onClick={() => {
          if (!isExpanded) {
            playPanelOpenSound(true);
            setIsExpanded(true);
          }
        }}
        className={cn(
          'relative flex cursor-pointer overflow-hidden border border-white/20 bg-black/90 text-white shadow-[0_16px_40px_rgba(0,0,0,0.65),inset_0_0_0_1px_rgba(255,255,255,0.15)] backdrop-blur-2xl transition-colors duration-150 hover:border-white/30',
          isExpanded
            ? 'h-[148px] w-[350px] rounded-[28px] p-3.5'
            : isPlayingTrack
              ? 'h-[26px] w-[216px] items-center justify-between rounded-full px-2.5'
              : 'h-[24px] w-[172px] items-center justify-between rounded-full px-3',
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isExpanded ? (
            /* EXPANDED DYNAMIC ISLAND */
            <motion.div
              key="expanded"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
              className="flex h-full w-full flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header row */}
              <div className="flex items-center justify-between text-[11px] text-white/50">
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      'flex h-2 w-2 rounded-full bg-[#30d158]',
                      isPlayingTrack && 'animate-pulse',
                    )}
                  />
                  <span className="font-semibold tracking-wider uppercase text-white/70">
                    {isPlayingTrack ? 'Now Playing' : 'Paused'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      openApp(
                        'safari',
                        `https://www.youtube.com/embed/${activeTrack.ytId}?autoplay=1`,
                      );
                      setIsExpanded(false);
                    }}
                    title="Open track video in Safari"
                    className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/80 transition-[background-color,transform] duration-150 hover:bg-white/20 active:scale-[0.96]"
                  >
                    <span>Safari</span>
                    <ExternalLink size={10} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playPanelOpenSound(false);
                      setIsExpanded(false);
                    }}
                    aria-label="Collapse Dynamic Island"
                    className="relative flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-white/70 transition-[background-color,transform] duration-150 after:absolute after:-inset-1.5 hover:bg-white/20 active:scale-[0.96]"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>

              {/* Middle row: Artwork + Details */}
              <div className="flex items-center gap-3 py-1">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[14px] shadow-lg ring-1 ring-white/20">
                  <img
                    src={activeTrack.coverImage}
                    alt={activeTrack.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/15" />
                </div>
                <div className="min-w-0 flex-grow">
                  <div className="truncate text-[14px] font-bold text-white">
                    {activeTrack.title}
                  </div>
                  <div className="truncate text-[12px] font-medium text-white/60">
                    {activeTrack.artist}
                  </div>

                  {/* Interactive GPU Scrubber track */}
                  <div className="mt-2 flex items-center gap-2 text-[10px] text-white/45">
                    <span className="w-6 tabular-nums">
                      {formatSec(trackPlaybackSec)}
                    </span>
                    <div
                      onClick={handleScrub}
                      role="slider"
                      aria-label="Track progress"
                      aria-valuemin={0}
                      aria-valuemax={effectiveDuration}
                      aria-valuenow={trackPlaybackSec}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowRight') {
                          seekTrack(Math.min(effectiveDuration, trackPlaybackSec + 5));
                        } else if (e.key === 'ArrowLeft') {
                          seekTrack(Math.max(0, trackPlaybackSec - 5));
                        }
                      }}
                      title="Click to seek"
                      className="group/di-scrub relative flex h-3 flex-grow cursor-pointer items-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/60"
                    >
                      <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/20">
                        <div
                          className="h-full w-full origin-left rounded-full bg-white transition-transform duration-150 ease-linear"
                          style={{ transform: `scaleX(${progressRatio})` }}
                        />
                      </div>
                    </div>
                    <span className="tabular-nums">
                      {formatSec(effectiveDuration)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Controls bar */}
              <div className="flex items-center justify-center gap-5 pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    prevTrack();
                  }}
                  title="Previous Track"
                  aria-label="Previous Track"
                  className="flex h-7 w-7 items-center justify-center rounded-full text-white/80 transition-[color,transform] duration-150 hover:text-white active:scale-[0.96]"
                >
                  <Rewind size={15} fill="currentColor" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    togglePlayTrack();
                  }}
                  title={isPlayingTrack ? 'Pause' : 'Play'}
                  aria-label={isPlayingTrack ? 'Pause' : 'Play'}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black shadow-md transition-transform duration-150 hover:scale-105 active:scale-[0.96]"
                >
                  {isPlayingTrack ? (
                    <Pause size={14} fill="currentColor" />
                  ) : (
                    <Play size={14} fill="currentColor" className="translate-x-0.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    nextTrack();
                  }}
                  title="Next Track"
                  aria-label="Next Track"
                  className="flex h-7 w-7 items-center justify-center rounded-full text-white/80 transition-[color,transform] duration-150 hover:text-white active:scale-[0.96]"
                >
                  <FastForward size={15} fill="currentColor" />
                </button>
              </div>
            </motion.div>
          ) : isPlayingTrack ? (
            /* COMPACT NOW-PLAYING ISLAND */
            <motion.div
              key="compact-playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="flex w-full items-center justify-between gap-2 text-[11px]"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <img
                  src={activeTrack.coverImage}
                  alt=""
                  className="h-4 w-4 shrink-0 rounded-full object-cover ring-0.5 ring-white/30"
                />
                <span className="truncate font-semibold tracking-tight text-white/90">
                  {activeTrack.title}
                </span>
              </div>

              {/* Live GPU equalizer bars */}
              <div className="flex h-3 items-end gap-[1.5px] shrink-0 pl-1" aria-hidden="true">
                <span className="ganos-eq-bar h-2.5 w-[2px] rounded-full bg-[#30d158]" />
                <span className="ganos-eq-bar ganos-eq-bar-2 h-3 w-[2px] rounded-full bg-[#30d158]" />
                <span className="ganos-eq-bar ganos-eq-bar-3 h-2 w-[2px] rounded-full bg-[#30d158]" />
              </div>
            </motion.div>
          ) : (
            /* COMPACT IDLE ISLAND */
            <motion.div
              key="compact-idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="flex w-full items-center justify-between gap-2 text-[11px] text-white/75"
            >
              <div className="flex shrink-0 items-center gap-1.5">
                <img
                  src="/brand-logo.svg"
                  alt=""
                  aria-hidden="true"
                  className="h-3.5 w-3.5 shrink-0 object-contain"
                />
                <span className="font-semibold tracking-tight">Ghufron</span>
              </div>
              <div className="flex shrink-0 items-center gap-1 text-[10px] opacity-60">
                <Volume2 size={11} />
                <span>Ready</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
