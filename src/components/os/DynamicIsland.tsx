import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
import { useOsNote } from '@/components/os/OsShellContext';
import { playClickSound } from '@/lib/soundEffects';

export const DynamicIsland: React.FC = () => {
  const {
    activeTrack,
    isPlayingTrack,
    trackPlaybackSec,
    togglePlayTrack,
    nextTrack,
    prevTrack,
    openApp,
  } = useOsNote();

  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close expanded card on outside click
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
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded]);

  const formatSec = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = Math.min(100, (trackPlaybackSec / 30) * 100);

  return (
    <div
      ref={containerRef}
      className="pointer-events-auto absolute left-1/2 top-1.5 z-50 -translate-x-1/2 select-none"
    >
      <motion.div
        layout
        transition={{
          type: 'spring',
          stiffness: 420,
          damping: 32,
          mass: 0.8,
        }}
        onClick={() => {
          if (!isExpanded) {
            playClickSound();
            setIsExpanded(true);
          }
        }}
        className={cn(
          'relative flex cursor-pointer overflow-hidden border border-white/20 bg-black/90 text-white shadow-[0_16px_40px_rgba(0,0,0,0.65),inset_0_0_0_1px_rgba(255,255,255,0.15)] backdrop-blur-3xl transition-colors duration-200 hover:border-white/30',
          isExpanded
            ? 'h-[148px] w-[350px] rounded-[28px] p-3.5 max-sm:w-[calc(100vw-24px)]'
            : isPlayingTrack
              ? 'h-[28px] w-[220px] items-center justify-between rounded-full px-2.5 hover:scale-[1.02]'
              : 'h-[26px] w-[136px] items-center justify-between rounded-full px-3 hover:scale-[1.02]',
        )}
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            /* EXPANDED DYNAMIC ISLAND */
            <motion.div
              key="expanded"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.16 }}
              className="flex h-full w-full flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header row */}
              <div className="flex items-center justify-between text-[11px] text-white/50">
                <div className="flex items-center gap-1.5">
                  <span className="flex h-2 w-2 rounded-full bg-[#30d158] animate-pulse" />
                  <span className="font-semibold tracking-wider uppercase text-white/70">
                    Now Playing
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
                    className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/80 hover:bg-white/20"
                  >
                    <span>Safari</span>
                    <ExternalLink size={10} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    aria-label="Collapse Dynamic Island"
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 active:scale-90"
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

                  {/* Scrubber track */}
                  <div className="mt-2 flex items-center gap-2 text-[10px] text-white/40">
                    <span className="w-6 tabular-nums">
                      {formatSec(trackPlaybackSec)}
                    </span>
                    <div className="relative h-1 flex-grow overflow-hidden rounded-full bg-white/20">
                      <div
                        className="h-full rounded-full bg-white transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <span className="tabular-nums">0:30</span>
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
                  className="flex h-7 w-7 items-center justify-center rounded-full text-white/80 transition-transform hover:text-white active:scale-90"
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
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black shadow-md transition-transform hover:scale-105 active:scale-95"
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
                  className="flex h-7 w-7 items-center justify-center rounded-full text-white/80 transition-transform hover:text-white active:scale-90"
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
              transition={{ duration: 0.14 }}
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

              {/* Live equalizer animation bars */}
              <div className="flex items-end gap-[1.5px] shrink-0 pl-1">
                <span className="h-2 w-[2px] rounded-full bg-[#30d158] animate-pulse" />
                <span className="h-3.5 w-[2px] rounded-full bg-[#30d158] animate-pulse delay-75" />
                <span className="h-1.5 w-[2px] rounded-full bg-[#30d158] animate-pulse delay-150" />
              </div>
            </motion.div>
          ) : (
            /* COMPACT IDLE ISLAND */
            <motion.div
              key="compact-idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.14 }}
              className="flex w-full items-center justify-between text-[11px] text-white/75"
            >
              <div className="flex items-center gap-1.5">
                <span className="flex h-1.5 w-1.5 rounded-full bg-[#0a84ff]" />
                <span className="font-semibold tracking-tight">GanOS</span>
              </div>
              <div className="flex items-center gap-1 opacity-60 text-[10px]">
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
