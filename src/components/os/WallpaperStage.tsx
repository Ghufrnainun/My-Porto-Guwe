import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { WallpaperOption } from '@/components/os/OsShellContext';
import { cn } from '@/lib/utils';

interface WallpaperStageProps {
  wallpaper: WallpaperOption;
  animate?: boolean;
  paused?: boolean;
  className?: string;
}

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];
const CROSSFADE_MS = 350;

const SingleWallpaperLayer: React.FC<{
  wallpaper: WallpaperOption;
  animate: boolean;
  paused: boolean;
}> = React.memo(({ wallpaper, animate, paused }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoReady, setVideoReady] = useState(false);

  const shouldPlay = animate && !paused;

  useEffect(() => {
    setVideoReady(false);
  }, [wallpaper.videoSrc, shouldPlay]);

  useEffect(() => {
    if (wallpaper.kind !== 'video') return;
    const video = videoRef.current;
    if (!video) return;

    const syncPlayback = () => {
      if (document.visibilityState === 'hidden' || !shouldPlay) {
        video.pause();
      } else {
        void video.play().catch(() => {
          /* autoplay blocked; poster remains visible */
        });
      }
    };

    syncPlayback();
    document.addEventListener('visibilitychange', syncPlayback);
    return () => {
      document.removeEventListener('visibilitychange', syncPlayback);
      video.pause();
      // Release hardware decoder & video buffer immediately on unmount/switch
      video.removeAttribute('src');
      video.load();
    };
  }, [wallpaper.kind, wallpaper.videoSrc, shouldPlay]);

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: wallpaper.background, contain: 'strict' }}
    >
      {/* Instant WebP poster / high-res still layer (0ms first paint) */}
      {(wallpaper.imageSrc || wallpaper.poster) && (
        <img
          src={wallpaper.imageSrc ?? wallpaper.poster}
          alt=""
          decoding="async"
          fetchPriority="high"
          className={cn(
            'h-full w-full object-cover transition-opacity duration-300 ease-smooth-out motion-reduce:transition-none',
            wallpaper.kind === 'video' && videoReady && shouldPlay
              ? 'opacity-0'
              : 'opacity-100',
          )}
        />
      )}

      {/* Hardware-decoded H.264 MP4 seamless loop on an isolated GPU layer */}
      {wallpaper.kind === 'video' && wallpaper.videoSrc && shouldPlay && (
        <video
          ref={videoRef}
          src={wallpaper.videoSrc}
          poster={wallpaper.poster}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          onCanPlay={() => setVideoReady(true)}
          onPlaying={() => setVideoReady(true)}
          className={cn(
            'absolute inset-0 h-full w-full transform-gpu object-cover transition-opacity duration-300 ease-smooth-out motion-reduce:transition-none',
            videoReady ? 'opacity-100' : 'opacity-0',
          )}
        />
      )}
    </div>
  );
});

export const WallpaperStage: React.FC<WallpaperStageProps> = React.memo(
  ({ wallpaper, animate = true, paused = false, className }) => {
    const prefersReducedMotion = useReducedMotion();
    const effectiveAnimate = animate && !prefersReducedMotion;
    const isMotionActive =
      wallpaper.kind === 'video' && effectiveAnimate && !paused;

    const [active, setActive] = useState<WallpaperOption>(wallpaper);
    const [previous, setPrevious] = useState<WallpaperOption | null>(null);

    if (wallpaper.id !== active.id) {
      setPrevious(active);
      setActive(wallpaper);
    }

    useEffect(() => {
      if (!previous) return;
      const prevId = previous.id;
      const timer = window.setTimeout(() => {
        setPrevious((still) => (still?.id === prevId ? null : still));
      }, CROSSFADE_MS + 40);
      return () => window.clearTimeout(timer);
    }, [previous]);

    return (
      <div
        aria-hidden="true"
        data-wallpaper-active={isMotionActive ? 'true' : 'false'}
        className={cn('pointer-events-none absolute inset-0 bg-black', className)}
        style={{ contain: 'strict' }}
      >
        {previous && (
          <div
            key={`prev-${previous.id}`}
            className="absolute inset-0"
            style={{ background: previous.background }}
          >
            {(previous.imageSrc || previous.poster) && (
              <img
                src={previous.imageSrc ?? previous.poster}
                alt=""
                className="h-full w-full object-cover"
              />
            )}
          </div>
        )}
        <motion.div
          key={wallpaper.id}
          initial={previous && !prefersReducedMotion ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: CROSSFADE_MS / 1000, ease: EASE_OUT }}
          className="absolute inset-0"
        >
          <SingleWallpaperLayer
            wallpaper={wallpaper}
            animate={effectiveAnimate}
            paused={paused}
          />
        </motion.div>
      </div>
    );
  },
);
