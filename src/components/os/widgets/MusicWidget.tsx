import {
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
  Youtube,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ListeningTrack } from '@/data/recentTracks';

interface MusicWidgetProps {
  activeTrack: ListeningTrack;
  visibleTracks: readonly ListeningTrack[];
  isPlaying: boolean;
  viewMode: 'grid' | 'player';
  onChangeViewMode: (mode: 'grid' | 'player') => void;
  ytEmbedTrack: ListeningTrack | null;
  onSetYtEmbedTrack: (track: ListeningTrack | null) => void;
  playbackSec: number;
  durationSec: number;
  volume: number;
  isMuted: boolean;
  onSetVolume: (vol: number) => void;
  onToggleMute: () => void;
  isLooping: boolean;
  onToggleLoop: () => void;
  onTogglePlay: (track?: ListeningTrack) => void;
  onPrevTrack: () => void;
  onNextTrack: () => void;
  onShuffle: () => void;
  onSeek: (sec: number) => void;
  onOpenSafari: (track: ListeningTrack) => void;
  size: { width: number; height: number };
}

function formatSec(total: number): string {
  const safe = Math.max(0, Math.floor(total));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

export function MusicWidget({
  activeTrack,
  visibleTracks,
  isPlaying,
  viewMode,
  onChangeViewMode,
  ytEmbedTrack,
  onSetYtEmbedTrack,
  playbackSec,
  durationSec,
  volume,
  isMuted,
  onSetVolume,
  onToggleMute,
  isLooping,
  onToggleLoop,
  onTogglePlay,
  onPrevTrack,
  onNextTrack,
  onShuffle,
  onSeek,
  onOpenSafari,
  size,
}: MusicWidgetProps) {
  const isCompact = size.width < 350 || size.height < 182;
  const isWide = size.width >= 380;
  const effectiveDuration = durationSec || 30;
  const progressPct = Math.min(
    100,
    Math.max(0, (playbackSec / effectiveDuration) * 100)
  );

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(ratio * effectiveDuration);
  };

  const VolumeIcon =
    isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-[#141418] text-white select-none">
      {/* Dynamic Album-Art Atmospheric Color Wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{ background: activeTrack.coverBg }}
      />
      <img
        src={activeTrack.coverImage}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full scale-125 object-cover opacity-55 blur-2xl saturate-150 transition-opacity duration-500"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(155deg, rgba(16,16,22,0.5) 0%, rgba(12,12,18,0.72) 55%, rgba(10,10,15,0.86) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
      />

      <div
        className={cn(
          'relative z-10 flex h-full w-full flex-col justify-between',
          isCompact ? 'p-3' : 'p-3.5'
        )}
      >
        {/* Minimal Frosted Top Bar */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            {!ytEmbedTrack ? (
              <div
                role="tablist"
                aria-label="Music widget view"
                className="inline-flex shrink-0 items-center rounded-full bg-white/[0.11] p-[2px] backdrop-blur-md ring-1 ring-white/[0.14]"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={viewMode === 'player'}
                  onClick={() => onChangeViewMode('player')}
                  className={cn(
                    'rounded-full px-2.5 py-[3px] text-[10px] font-medium leading-none transition-[background-color,color,transform] duration-150 ease-out-spring active:scale-95',
                    viewMode === 'player'
                      ? 'bg-white text-[#111216] shadow-sm'
                      : 'text-white/75 hover:text-white'
                  )}
                >
                  Now
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={viewMode === 'grid'}
                  onClick={() => onChangeViewMode('grid')}
                  className={cn(
                    'rounded-full px-2.5 py-[3px] text-[10px] font-medium leading-none transition-[background-color,color,transform] duration-150 ease-out-spring active:scale-95',
                    viewMode === 'grid'
                      ? 'bg-white text-[#111216] shadow-sm'
                      : 'text-white/75 hover:text-white'
                  )}
                >
                  Recent
                </button>
              </div>
            ) : (
              <span className="truncate text-[11px] font-medium text-white/85">
                {ytEmbedTrack.title} · {ytEmbedTrack.artist}
              </span>
            )}

            {isPlaying && !ytEmbedTrack && (
              <span
                aria-label="Playing"
                className="flex h-3 items-end gap-[2px]"
              >
                <span className="h-2.5 w-[2px] animate-pulse rounded-full bg-white/90" />
                <span className="h-3 w-[2px] animate-pulse rounded-full bg-white/90 delay-75" />
                <span className="h-1.5 w-[2px] animate-pulse rounded-full bg-white/90 delay-150" />
              </span>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            {ytEmbedTrack ? (
              <>
                <button
                  type="button"
                  onClick={() => onOpenSafari(ytEmbedTrack)}
                  className="inline-flex items-center gap-1 rounded-full bg-white/[0.12] px-2.5 py-1 text-[10px] font-medium text-white/90 backdrop-blur-md ring-1 ring-white/15 transition-[background-color,transform] duration-150 hover:bg-white/[0.2] active:scale-95"
                  title="Open inside Safari window"
                >
                  <img
                    src="/macos-icons/safari.png"
                    alt=""
                    className="h-3 w-3 object-contain"
                  />
                  <span>Safari</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSetYtEmbedTrack(null)}
                  className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-[#111216] transition-[opacity,transform] duration-150 hover:opacity-90 active:scale-95"
                >
                  Done
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onSetYtEmbedTrack(activeTrack)}
                  title="Watch music video inside widget"
                  aria-label="Watch music video inside widget"
                  className="inline-flex h-6 items-center gap-1 rounded-full bg-white/[0.10] px-2 text-[10px] font-medium text-white/80 backdrop-blur-md ring-1 ring-white/[0.12] transition-[background-color,color,transform] duration-150 hover:bg-white/[0.18] hover:text-white active:scale-95"
                >
                  <Youtube className="h-3 w-3 text-[#ff453a]" />
                  <span>Video</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenSafari(activeTrack)}
                  title="Open in Safari"
                  aria-label="Open track in Safari"
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.10] backdrop-blur-md ring-1 ring-white/[0.12] transition-[background-color,transform] duration-150 hover:bg-white/[0.18] active:scale-95"
                >
                  <img
                    src="/macos-icons/safari.png"
                    alt=""
                    className="h-3.5 w-3.5 object-contain"
                  />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Body Views */}
        {ytEmbedTrack ? (
          <div className="mt-2 min-h-[118px] flex-1 w-full overflow-hidden rounded-[14px] bg-black ring-1 ring-white/15">
            <iframe
              src={`https://www.youtube.com/embed/${ytEmbedTrack.ytId}?autoplay=1&controls=1&modestbranding=1&rel=0`}
              title={`${ytEmbedTrack.title} — ${ytEmbedTrack.artist}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen
              className="h-full w-full border-0"
            />
          </div>
        ) : viewMode === 'player' ? (
          /* Apple Music Now Playing View */
          <div className="my-auto flex flex-col gap-2.5 pt-1.5">
            <div className="flex items-center gap-3.5">
              {/* Album Art */}
              <button
                type="button"
                onClick={() => onTogglePlay(activeTrack)}
                title={`${isPlaying ? 'Pause' : 'Play'} ${activeTrack.title}`}
                className={cn(
                  'group/cover relative shrink-0 overflow-hidden rounded-[14px] shadow-[0_10px_24px_rgba(0,0,0,0.45)] ring-1 ring-white/20 transition-transform duration-200 ease-out-spring active:scale-[0.96]',
                  isCompact ? 'h-[72px] w-[72px]' : 'h-[82px] w-[82px]'
                )}
                style={{ background: activeTrack.coverBg }}
              >
                <img
                  src={activeTrack.coverImage}
                  alt={activeTrack.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover/cover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div
                  className={cn(
                    'absolute inset-0 flex items-center justify-center bg-black/35 transition-opacity duration-150',
                    isPlaying
                      ? 'opacity-0 group-hover/cover:opacity-100'
                      : 'opacity-100'
                  )}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#111216] shadow-md">
                    {isPlaying ? (
                      <Pause className="h-3.5 w-3.5 fill-current" />
                    ) : (
                      <Play className="h-3.5 w-3.5 translate-x-0.5 fill-current" />
                    )}
                  </span>
                </div>
              </button>

              {/* Track Info + Tactile Transport */}
              <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch py-0.5">
                <div className="min-w-0">
                  <div className="truncate text-[15px] font-semibold leading-tight tracking-[-0.02em] text-white">
                    {activeTrack.title}
                  </div>
                  <div className="mt-0.5 truncate text-[12px] font-normal text-white/65">
                    {activeTrack.artist}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onPrevTrack}
                    aria-label="Previous track"
                    title="Previous track"
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.11] text-white/85 transition-[background-color,color,transform] duration-150 hover:bg-white/[0.2] hover:text-white active:scale-90"
                  >
                    <SkipBack className="h-3.5 w-3.5 fill-current" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onTogglePlay(activeTrack)}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                    title={isPlaying ? 'Pause' : 'Play'}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#111216] shadow-[0_4px_14px_rgba(0,0,0,0.3)] transition-[transform,opacity] duration-150 ease-out-spring hover:opacity-95 active:scale-[0.93]"
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4 fill-current" />
                    ) : (
                      <Play className="h-4 w-4 translate-x-0.5 fill-current" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={onNextTrack}
                    aria-label="Next track"
                    title="Next track"
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.11] text-white/85 transition-[background-color,color,transform] duration-150 hover:bg-white/[0.2] hover:text-white active:scale-90"
                  >
                    <SkipForward className="h-3.5 w-3.5 fill-current" />
                  </button>

                  {/* Volume & Shuffle/Repeat */}
                  <div className="ml-auto flex items-center gap-1">
                    {isWide && (
                      <div className="mr-1 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={onToggleMute}
                          aria-label={isMuted ? 'Unmute' : 'Mute'}
                          title={isMuted ? 'Unmute' : 'Mute'}
                          className="flex h-6 w-6 items-center justify-center rounded-full text-white/65 transition-[color,background-color,transform] duration-150 hover:bg-white/[0.1] hover:text-white active:scale-90"
                        >
                          <VolumeIcon className="h-3 w-3" />
                        </button>
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.05}
                          value={isMuted ? 0 : volume}
                          onChange={(e) => onSetVolume(Number(e.target.value))}
                          aria-label="Volume"
                          className="h-1 w-11 cursor-pointer accent-white opacity-75 transition-opacity hover:opacity-100"
                        />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={onShuffle}
                      aria-label="Shuffle tracks"
                      title="Shuffle"
                      className="flex h-6 w-6 items-center justify-center rounded-full text-white/65 transition-[color,background-color,transform] duration-150 hover:bg-white/[0.1] hover:text-white active:scale-90"
                    >
                      <Shuffle className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={onToggleLoop}
                      aria-label="Toggle repeat"
                      aria-pressed={isLooping}
                      title={isLooping ? 'Repeat on' : 'Repeat off'}
                      className={cn(
                        'flex h-6 w-6 items-center justify-center rounded-full transition-[color,background-color,transform] duration-150 active:scale-90',
                        isLooping
                          ? 'bg-white/20 text-white'
                          : 'text-white/65 hover:bg-white/[0.1] hover:text-white'
                      )}
                    >
                      <Repeat className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Scrubber */}
            <div>
              <div
                onClick={handleScrub}
                role="progressbar"
                aria-valuenow={playbackSec}
                aria-valuemin={0}
                aria-valuemax={effectiveDuration}
                title="Click to seek"
                className="group/scrubber relative flex h-3 w-full cursor-pointer items-center"
              >
                <div className="relative h-[3.5px] w-full overflow-hidden rounded-full bg-white/20 transition-[height] duration-150 group-hover/scrubber:h-[5px]">
                  <div
                    className="h-full rounded-full bg-white transition-[width] duration-150 ease-linear"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
              <div className="mt-0.5 flex items-center justify-between text-[9.5px] font-medium text-white/55 tabular-nums">
                <span>{formatSec(playbackSec)}</span>
                <span>{formatSec(effectiveDuration)}</span>
              </div>
            </div>
          </div>
        ) : (
          /* Recent 4-Album Artwork Shelf */
          <div className="my-auto grid grid-cols-4 gap-2.5 pt-1.5">
            {visibleTracks.map((track) => {
              const isTrackActive = activeTrack.id === track.id;
              const isTrackPlaying = isPlaying && isTrackActive;
              return (
                <div
                  key={track.id}
                  className="group/album flex min-w-0 flex-col"
                >
                  <button
                    type="button"
                    onClick={() => onTogglePlay(track)}
                    onDoubleClick={() => onOpenSafari(track)}
                    title={`Play ${track.title} — ${track.artist}`}
                    className={cn(
                      'relative aspect-square w-full overflow-hidden rounded-[12px] shadow-[0_6px_16px_rgba(0,0,0,0.38)] transition-[transform,box-shadow] duration-200 ease-out-spring hover:scale-[1.03] active:scale-[0.96]',
                      isTrackPlaying
                        ? 'ring-2 ring-white'
                        : isTrackActive
                          ? 'ring-1 ring-white/50'
                          : 'ring-1 ring-white/15'
                    )}
                    style={{ background: track.coverBg }}
                  >
                    <img
                      src={track.coverImage}
                      alt={track.title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />

                    {isTrackPlaying && (
                      <div
                        aria-hidden="true"
                        className="absolute bottom-1.5 right-1.5 flex items-end gap-[1.5px] rounded-full bg-black/70 px-1.5 py-1 backdrop-blur-md"
                      >
                        <span className="h-2 w-[2px] animate-pulse rounded-full bg-white" />
                        <span className="h-2.5 w-[2px] animate-pulse rounded-full bg-white delay-75" />
                        <span className="h-1.5 w-[2px] animate-pulse rounded-full bg-white delay-150" />
                      </div>
                    )}

                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-150 group-hover/album:opacity-100">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#111216] shadow-md">
                        {isTrackPlaying ? (
                          <Pause className="h-3.5 w-3.5 fill-current" />
                        ) : (
                          <Play className="h-3.5 w-3.5 translate-x-0.5 fill-current" />
                        )}
                      </span>
                    </div>
                  </button>

                  <div className="mt-1.5 truncate text-[11px] font-semibold leading-tight text-white">
                    {track.title}
                  </div>
                  <div className="truncate text-[9.5px] text-white/60">
                    {track.artist}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
