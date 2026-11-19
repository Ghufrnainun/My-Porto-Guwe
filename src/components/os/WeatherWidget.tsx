/* Hallmark · component: weather-widget · genre: atmospheric · theme: adaptive-liquid-glass
 * states: default · hover · focus-visible · active · selected · refreshing · light-glass · dark-glass
 * pre-emit critique: P5 H5 E5 S5 R5 V5
 */
import { useEffect, useId, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion';
import { Droplets, MoreHorizontal, RefreshCw, Sparkles, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WallpaperId } from '@/components/os/OsShellContext';
import {
  getWallpaperGlassProfile,
  type GlassToneMode,
  type LiveWeatherData,
  type WeatherKind,
} from '@/lib/weather';

const EMIL_EASE_OUT = [0.23, 1, 0.32, 1] as const;

function HeroWeatherArtwork({
  kind,
  size,
  lightGlass,
}: {
  kind: WeatherKind;
  size: number;
  lightGlass: boolean;
}) {
  const uid = useId().replace(/:/g, '');
  const cloudFill = `w-cloud-${uid}`;
  const cloudShadow = `w-cloud-shadow-${uid}`;
  const cloudRear = `w-cloud-rear-${uid}`;
  const moonFill = `w-moon-${uid}`;
  const sunFill = `w-sun-${uid}`;
  const sunGlow = `w-sun-glow-${uid}`;
  const dropFill = `w-drop-${uid}`;
  const boltFill = `w-bolt-${uid}`;
  const softShadow = `w-shadow-${uid}`;

  const isStormOrRain = kind === 'rain' || kind === 'drizzle' || kind === 'storm';

  const cloudTopColor = lightGlass
    ? isStormOrRain
      ? '#94a3b8'
      : '#ffffff'
    : isStormOrRain
      ? '#cbd5e1'
      : '#f1f5f9';
  const cloudMidColor = lightGlass
    ? isStormOrRain
      ? '#64748b'
      : '#cbd5e1'
    : isStormOrRain
      ? '#7e8fa8'
      : '#a7b5cc';
  const cloudBottomColor = lightGlass
    ? isStormOrRain
      ? '#334155'
      : '#64748b'
    : isStormOrRain
      ? '#45536b'
      : '#5e6d87';

  const moonTopColor = lightGlass ? '#64748b' : '#f8fafc';
  const moonMidColor = lightGlass ? '#475569' : '#cbd5e1';
  const moonBottomColor = lightGlass ? '#1e293b' : '#72839e';

  return (
    <svg
      width={size}
      height={Math.round(size * 0.86)}
      viewBox="0 0 84 72"
      fill="none"
      aria-hidden="true"
      className="shrink-0 overflow-visible"
    >
      <defs>
        <filter id={softShadow} x="-22%" y="-22%" width="148%" height="154%">
          <feDropShadow
            dx="0"
            dy="4"
            stdDeviation="3.4"
            floodColor={lightGlass ? '#0f172a' : '#050812'}
            floodOpacity={lightGlass ? '0.26' : '0.45'}
          />
        </filter>

        <linearGradient
          id={moonFill}
          x1="48"
          y1="8"
          x2="72"
          y2="42"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={moonTopColor} />
          <stop offset="52%" stopColor={moonMidColor} />
          <stop offset="100%" stopColor={moonBottomColor} />
        </linearGradient>

        <radialGradient id={sunFill} cx="36%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="48%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#ea580c" />
        </radialGradient>

        <radialGradient id={sunGlow} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.48" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>

        <radialGradient id={cloudFill} cx="36%" cy="20%" r="78%">
          <stop offset="0%" stopColor={cloudTopColor} />
          <stop offset="56%" stopColor={cloudMidColor} />
          <stop offset="100%" stopColor={cloudBottomColor} />
        </radialGradient>

        <linearGradient
          id={cloudShadow}
          x1="20"
          y1="26"
          x2="54"
          y2="60"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.34" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop
            offset="100%"
            stopColor="#0f172a"
            stopOpacity={lightGlass ? '0.22' : '0.3'}
          />
        </linearGradient>

        <linearGradient
          id={cloudRear}
          x1="34"
          y1="14"
          x2="70"
          y2="46"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            offset="0%"
            stopColor={lightGlass ? '#64748b' : '#94a3b8'}
            stopOpacity="0.92"
          />
          <stop
            offset="100%"
            stopColor={lightGlass ? '#334155' : '#475569'}
            stopOpacity="0.92"
          />
        </linearGradient>

        <linearGradient id={dropFill} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lightGlass ? '#38bdf8' : '#bae6fd'} />
          <stop offset="100%" stopColor={lightGlass ? '#0284c7' : '#38bdf8'} />
        </linearGradient>

        <linearGradient
          id={boltFill}
          x1="36"
          y1="42"
          x2="46"
          y2="68"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      {kind === 'clear-day' && (
        <g filter={`url(#${softShadow})`}>
          <circle cx="42" cy="36" r="28" fill={`url(#${sunGlow})`} />
          <circle cx="42" cy="36" r="17.5" fill={`url(#${sunFill})`} />
          <circle
            cx="42"
            cy="36"
            r="17.5"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="0.9"
          />
        </g>
      )}

      {kind === 'clear-night' && (
        <g filter={`url(#${softShadow})`}>
          <path
            d="M46.5 13C35.2 14.3 26.8 24.4 28.2 35.8C29.6 47.2 39.9 55.3 51.3 53.9C56.1 53.3 60.4 51.1 63.5 47.8C54.9 48.2 46.8 42.1 45.4 33C44.2 25.1 48 17.6 54.4 13.7C51.9 12.9 49.2 12.7 46.5 13Z"
            fill={`url(#${moonFill})`}
            stroke="rgba(255,255,255,0.38)"
            strokeWidth="0.8"
          />
          <path
            d="M22 18L23.2 21.3L26.5 22.5L23.2 23.7L22 27L20.8 23.7L17.5 22.5L20.8 21.3L22 18Z"
            fill={lightGlass ? '#334155' : '#e2e8f0'}
            opacity="0.85"
          />
          <path
            d="M65 20L65.8 22.2L68 23L65.8 23.8L65 26L64.2 23.8L62 23L64.2 22.2L65 20Z"
            fill={lightGlass ? '#475569' : '#cbd5e1'}
            opacity="0.7"
          />
        </g>
      )}

      {kind === 'partly-cloudy-day' && (
        <g filter={`url(#${softShadow})`}>
          <circle cx="56" cy="24" r="22" fill={`url(#${sunGlow})`} />
          <circle cx="55.5" cy="24.5" r="13.5" fill={`url(#${sunFill})`} />
          <path
            d="M22 56H58.5C65.4 56 71 50.6 71 43.9C71 37.7 66.2 32.6 60 32C58.1 23.2 50.2 16.6 40.7 16.6C30.4 16.6 22 24.4 21.1 34.4C14.8 35.2 10 40.4 10 46.8C10 51.9 15.3 56 22 56Z"
            fill={`url(#${cloudFill})`}
          />
          <path
            d="M22 56H58.5C65.4 56 71 50.6 71 43.9C71 37.7 66.2 32.6 60 32C58.1 23.2 50.2 16.6 40.7 16.6C30.4 16.6 22 24.4 21.1 34.4C14.8 35.2 10 40.4 10 46.8C10 51.9 15.3 56 22 56Z"
            fill={`url(#${cloudShadow})`}
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="0.9"
          />
        </g>
      )}

      {kind === 'partly-cloudy-night' && (
        <g filter={`url(#${softShadow})`}>
          <path
            d="M55.8 8.5C46.6 9.8 39.8 18.2 41.1 27.4C42.4 36.6 50.9 43.1 60.1 41.8C64.2 41.2 67.8 39.2 70.3 36.3C63.2 36.7 56.6 31.8 55.4 24.4C54.3 18 57.4 11.9 62.6 8.9C60.4 8.3 58.1 8.2 55.8 8.5Z"
            fill={`url(#${moonFill})`}
            stroke="rgba(255,255,255,0.36)"
            strokeWidth="0.8"
          />
          <path
            d="M21 57H56.5C63.4 57 69 51.7 69 45.2C69 39.1 64.2 34.1 58.1 33.5C56.1 25 48.4 18.6 39.2 18.6C29.2 18.6 21 26.2 20.1 35.9C13.9 36.7 9 41.8 9 48C9 53 14.3 57 21 57Z"
            fill={`url(#${cloudFill})`}
          />
          <path
            d="M21 57H56.5C63.4 57 69 51.7 69 45.2C69 39.1 64.2 34.1 58.1 33.5C56.1 25 48.4 18.6 39.2 18.6C29.2 18.6 21 26.2 20.1 35.9C13.9 36.7 9 41.8 9 48C9 53 14.3 57 21 57Z"
            fill={`url(#${cloudShadow})`}
            stroke="rgba(255,255,255,0.38)"
            strokeWidth="0.9"
          />
        </g>
      )}

      {kind === 'cloudy' && (
        <g filter={`url(#${softShadow})`}>
          <path
            d="M36 42H64.5C69.7 42 74 37.9 74 32.8C74 28.2 70.4 24.4 65.8 23.9C64.2 17.5 58.3 12.8 51.3 12.8C43.7 12.8 37.4 18.5 36.8 25.9C32.2 26.6 28.6 30.4 28.6 35.1C28.6 39 31.8 42 36 42Z"
            fill={`url(#${cloudRear})`}
          />
          <path
            d="M20 57H56C62.6 57 68 51.9 68 45.6C68 39.7 63.4 34.9 57.5 34.3C55.6 26.2 48.3 20.1 39.5 20.1C29.8 20.1 21.9 27.4 21 36.8C15 37.5 10.4 42.4 10.4 48.4C10.4 53.2 14.6 57 20 57Z"
            fill={`url(#${cloudFill})`}
          />
          <path
            d="M20 57H56C62.6 57 68 51.9 68 45.6C68 39.7 63.4 34.9 57.5 34.3C55.6 26.2 48.3 20.1 39.5 20.1C29.8 20.1 21.9 27.4 21 36.8C15 37.5 10.4 42.4 10.4 48.4C10.4 53.2 14.6 57 20 57Z"
            fill={`url(#${cloudShadow})`}
            stroke="rgba(255,255,255,0.36)"
            strokeWidth="0.9"
          />
        </g>
      )}

      {kind === 'fog' && (
        <g filter={`url(#${softShadow})`}>
          <path
            d="M21 47H57C63.6 47 69 41.9 69 35.6C69 29.7 64.4 24.9 58.5 24.3C56.6 16.2 49.3 10.1 40.5 10.1C30.8 10.1 22.9 17.4 22 26.8C16 27.5 11.4 32.4 11.4 38.4C11.4 43.2 15.6 47 21 47Z"
            fill={`url(#${cloudFill})`}
          />
          <path
            d="M21 47H57C63.6 47 69 41.9 69 35.6C69 29.7 64.4 24.9 58.5 24.3C56.6 16.2 49.3 10.1 40.5 10.1C30.8 10.1 22.9 17.4 22 26.8C16 27.5 11.4 32.4 11.4 38.4C11.4 43.2 15.6 47 21 47Z"
            fill={`url(#${cloudShadow})`}
            stroke="rgba(255,255,255,0.34)"
            strokeWidth="0.9"
          />
          <rect
            x="16"
            y="53"
            width="46"
            height="3.2"
            rx="1.6"
            fill={lightGlass ? '#475569' : '#cbd5e1'}
            opacity="0.6"
          />
          <rect
            x="24"
            y="60"
            width="34"
            height="3.2"
            rx="1.6"
            fill={lightGlass ? '#64748b' : '#94a3b8'}
            opacity="0.45"
          />
        </g>
      )}

      {(kind === 'drizzle' || kind === 'rain') && (
        <g filter={`url(#${softShadow})`}>
          <path
            d="M20 47H57C63.6 47 69 41.9 69 35.6C69 29.7 64.4 24.9 58.5 24.3C56.6 16.2 49.3 10.1 40.5 10.1C30.8 10.1 22.9 17.4 22 26.8C16 27.5 11.4 32.4 11.4 38.4C11.4 43.2 15.6 47 20 47Z"
            fill={`url(#${cloudFill})`}
          />
          <path
            d="M20 47H57C63.6 47 69 41.9 69 35.6C69 29.7 64.4 24.9 58.5 24.3C56.6 16.2 49.3 10.1 40.5 10.1C30.8 10.1 22.9 17.4 22 26.8C16 27.5 11.4 32.4 11.4 38.4C11.4 43.2 15.6 47 20 47Z"
            fill={`url(#${cloudShadow})`}
            stroke="rgba(255,255,255,0.34)"
            strokeWidth="0.9"
          />
          <path
            d="M27.5 52C27.5 52 24 57.3 24 59.6C24 61.5 25.6 63 27.5 63C29.4 63 31 61.5 31 59.6C31 57.3 27.5 52 27.5 52Z"
            fill={`url(#${dropFill})`}
          />
          <path
            d="M41.5 54C41.5 54 38 59.3 38 61.6C38 63.5 39.6 65 41.5 65C43.4 65 45 63.5 45 61.6C45 59.3 41.5 54 41.5 54Z"
            fill={`url(#${dropFill})`}
          />
          {kind === 'rain' && (
            <path
              d="M55.5 52C55.5 52 52 57.3 52 59.6C52 61.5 53.6 63 55.5 63C57.4 63 59 61.5 59 59.6C59 57.3 55.5 52 55.5 52Z"
              fill={`url(#${dropFill})`}
            />
          )}
        </g>
      )}

      {kind === 'storm' && (
        <g filter={`url(#${softShadow})`}>
          <path
            d="M20 46H57C63.6 46 69 40.9 69 34.6C69 28.7 64.4 23.9 58.5 23.3C56.6 15.2 49.3 9.1 40.5 9.1C30.8 9.1 22.9 16.4 22 25.8C16 26.5 11.4 31.4 11.4 37.4C11.4 42.2 15.6 46 20 46Z"
            fill={`url(#${cloudFill})`}
          />
          <path
            d="M20 46H57C63.6 46 69 40.9 69 34.6C69 28.7 64.4 23.9 58.5 23.3C56.6 15.2 49.3 9.1 40.5 9.1C30.8 9.1 22.9 16.4 22 25.8C16 26.5 11.4 31.4 11.4 37.4C11.4 42.2 15.6 46 20 46Z"
            fill={`url(#${cloudShadow})`}
            stroke="rgba(255,255,255,0.32)"
            strokeWidth="0.9"
          />
          <path
            d="M44 42L35.5 55.2H42L38.8 66.5L50 51.5H43.4L44 42Z"
            fill={`url(#${boltFill})`}
          />
          <path
            d="M26 51.5C26 51.5 23.5 55.4 23.5 57.1C23.5 58.5 24.6 59.6 26 59.6C27.4 59.6 28.5 58.5 28.5 57.1C28.5 55.4 26 51.5 26 51.5Z"
            fill={`url(#${dropFill})`}
            opacity="0.9"
          />
        </g>
      )}
    </svg>
  );
}

function MiniWeatherIcon({
  kind,
  size,
  active,
  lightGlass,
}: {
  kind: WeatherKind;
  size: number;
  active: boolean;
  lightGlass: boolean;
}) {
  const opacity = active ? 1 : 0.78;
  const cloudPrimary = lightGlass ? '#334155' : '#f1f5f9';
  const cloudSecondary = lightGlass ? '#64748b' : '#cbd5e1';
  const cloudRearFill = lightGlass ? '#64748b' : '#94a3b8';
  const moonPrimary = lightGlass ? '#475569' : '#cbd5e1';
  const rainPrimary = lightGlass ? '#0284c7' : '#38bdf8';
  const rainLight = lightGlass ? '#0ea5e9' : '#7dd3fc';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ opacity }}
      className="shrink-0 transition-opacity duration-150"
    >
      {kind === 'clear-day' && (
        <g>
          <circle cx="12" cy="12" r="4.6" fill="#f59e0b" />
          <g stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round">
            <line x1="12" y1="3" x2="12" y2="5" />
            <line x1="12" y1="19" x2="12" y2="21" />
            <line x1="3" y1="12" x2="5" y2="12" />
            <line x1="19" y1="12" x2="21" y2="12" />
            <line x1="5.6" y1="5.6" x2="7.1" y2="7.1" />
            <line x1="16.9" y1="16.9" x2="18.4" y2="18.4" />
            <line x1="18.4" y1="5.6" x2="16.9" y2="7.1" />
            <line x1="7.1" y1="16.9" x2="5.6" y2="18.4" />
          </g>
        </g>
      )}

      {kind === 'clear-night' && (
        <g>
          <path
            d="M14.2 5.2C10.5 5.6 7.8 8.9 8.2 12.6C8.6 16.3 11.9 19 15.6 18.6C17.2 18.4 18.5 17.7 19.5 16.6C16.7 16.8 14.1 14.8 13.7 11.9C13.3 9.3 14.6 6.8 16.7 5.5C15.9 5.2 15.1 5.1 14.2 5.2Z"
            fill={moonPrimary}
          />
          <path
            d="M17.2 6.8L17.7 8.1L19 8.6L17.7 9.1L17.2 10.4L16.7 9.1L15.4 8.6L16.7 8.1L17.2 6.8Z"
            fill={cloudPrimary}
          />
          <circle cx="6.8" cy="7.5" r="0.9" fill={moonPrimary} opacity="0.85" />
        </g>
      )}

      {kind === 'partly-cloudy-day' && (
        <g>
          <circle cx="15.8" cy="8.5" r="3.8" fill="#f59e0b" />
          <path
            d="M6.8 18.2H16.8C18.8 18.2 20.5 16.6 20.5 14.6C20.5 12.8 19.1 11.3 17.3 11.1C16.7 8.6 14.5 6.8 11.8 6.8C8.9 6.8 6.5 9 6.3 11.9C4.5 12.2 3.2 13.7 3.2 15.5C3.2 17 4.8 18.2 6.8 18.2Z"
            fill={cloudPrimary}
          />
        </g>
      )}

      {kind === 'partly-cloudy-night' && (
        <g>
          <path
            d="M15.6 4.8C13.2 5.1 11.4 7.3 11.7 9.7C12 12.1 14.2 13.9 16.6 13.6C17.7 13.5 18.6 13 19.3 12.2C17.4 12.3 15.7 11 15.4 9.1C15.1 7.4 15.9 5.8 17.3 5C16.7 4.8 16.2 4.7 15.6 4.8Z"
            fill={moonPrimary}
          />
          <path
            d="M6.6 18.5H16.6C18.6 18.5 20.2 17 20.2 15.1C20.2 13.3 18.8 11.9 17.1 11.7C16.5 9.2 14.3 7.5 11.7 7.5C8.9 7.5 6.6 9.6 6.3 12.4C4.6 12.7 3.3 14.1 3.3 15.9C3.3 17.4 4.8 18.5 6.6 18.5Z"
            fill={cloudPrimary}
          />
        </g>
      )}

      {kind === 'cloudy' && (
        <g>
          <path
            d="M10.5 13.8H18.4C19.9 13.8 21.1 12.6 21.1 11.1C21.1 9.8 20.1 8.7 18.8 8.5C18.3 6.7 16.7 5.4 14.7 5.4C12.5 5.4 10.7 7 10.5 9.2C9.2 9.4 8.2 10.5 8.2 11.8C8.2 12.9 9.2 13.8 10.5 13.8Z"
            fill={cloudRearFill}
          />
          <path
            d="M6.4 18.5H16.2C18.1 18.5 19.7 17 19.7 15.1C19.7 13.4 18.4 12 16.7 11.8C16.1 9.4 14 7.7 11.5 7.7C8.7 7.7 6.4 9.8 6.2 12.5C4.5 12.8 3.2 14.2 3.2 15.9C3.2 17.4 4.6 18.5 6.4 18.5Z"
            fill={cloudPrimary}
          />
        </g>
      )}

      {kind === 'fog' && (
        <g>
          <path
            d="M6.6 14.5H16.8C18.6 14.5 20.1 13.1 20.1 11.3C20.1 9.7 18.8 8.3 17.2 8.1C16.6 5.9 14.6 4.4 12.2 4.4C9.5 4.4 7.3 6.4 7.1 9C5.5 9.3 4.3 10.6 4.3 12.2C4.3 13.5 5.3 14.5 6.6 14.5Z"
            fill={cloudSecondary}
          />
          <line
            x1="5.5"
            y1="17.2"
            x2="18.5"
            y2="17.2"
            stroke={cloudRearFill}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <line
            x1="7.5"
            y1="20"
            x2="16.5"
            y2="20"
            stroke={cloudRearFill}
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.7"
          />
        </g>
      )}

      {(kind === 'drizzle' || kind === 'rain') && (
        <g>
          <path
            d="M6.4 14.8H16.8C18.6 14.8 20.1 13.4 20.1 11.6C20.1 10 18.8 8.6 17.2 8.4C16.6 6.2 14.6 4.6 12.2 4.6C9.5 4.6 7.3 6.6 7.1 9.2C5.5 9.5 4.3 10.8 4.3 12.4C4.3 13.8 5.2 14.8 6.4 14.8Z"
            fill={cloudSecondary}
          />
          <line
            x1="8.6"
            y1="17"
            x2="7.5"
            y2="20"
            stroke={rainLight}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <line
            x1="12.6"
            y1="17.4"
            x2="11.5"
            y2="20.4"
            stroke={rainPrimary}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          {kind === 'rain' && (
            <line
              x1="16.4"
              y1="17"
              x2="15.3"
              y2="20"
              stroke={rainLight}
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          )}
        </g>
      )}

      {kind === 'storm' && (
        <g>
          <path
            d="M6.4 14.4H16.8C18.6 14.4 20.1 13 20.1 11.2C20.1 9.6 18.8 8.2 17.2 8C16.6 5.8 14.6 4.2 12.2 4.2C9.5 4.2 7.3 6.2 7.1 8.8C5.5 9.1 4.3 10.4 4.3 12C4.3 13.4 5.2 14.4 6.4 14.4Z"
            fill={cloudSecondary}
          />
          <path
            d="M13 13.2L9.8 17.8H12.2L11.2 21.4L15.2 16.5H12.8L13 13.2Z"
            fill="#f59e0b"
          />
        </g>
      )}
    </svg>
  );
}

interface WeatherWidgetProps {
  weather: LiveWeatherData;
  unit: 'C' | 'F';
  onToggleUnit: () => void;
  activeHourlyIdx: number;
  onSelectHourly: (index: number) => void;
  size: { width: number; height: number };
  wallpaperId: WallpaperId;
  glassMode: GlassToneMode;
  onChangeGlassMode: (mode: GlassToneMode) => void;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  widgetGalleryOpen?: boolean;
}

export function WeatherWidget({
  weather,
  unit,
  onToggleUnit,
  activeHourlyIdx,
  onSelectHourly,
  size,
  wallpaperId,
  glassMode,
  onChangeGlassMode,
  isRefreshing = false,
  onRefresh,
  widgetGalleryOpen = false,
}: WeatherWidgetProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showExtraStats, setShowExtraStats] = useState(false);
  const [pointerInside, setPointerInside] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Emil-style spring-interpolated specular caustic across liquid glass
  const rawPointerX = useMotionValue(50);
  const rawPointerY = useMotionValue(20);
  const springX = useSpring(rawPointerX, { stiffness: 160, damping: 24, mass: 0.6 });
  const springY = useSpring(rawPointerY, { stiffness: 160, damping: 24, mass: 0.6 });

  const profile = getWallpaperGlassProfile(wallpaperId, glassMode);
  const lightGlass = profile.isLightSurface;

  const specularCaustic = useMotionTemplate`radial-gradient(180px circle at ${springX}% ${springY}%, ${
    lightGlass ? 'rgba(255, 255, 255, 0.44)' : 'rgba(255, 255, 255, 0.16)'
  } 0%, transparent 72%)`;

  useEffect(() => {
    if (!menuOpen) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  const handleSurfacePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !rootRef.current) return;
    const rect = rootRef.current.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const pctX = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const pctY = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    rawPointerX.set(pctX);
    rawPointerY.set(pctY);
  };

  const activeSlot = weather.forecast[activeHourlyIdx] ?? weather.forecast[0];
  const displayTemp = unit === 'C' ? activeSlot.tempC : activeSlot.tempF;

  const { width, height } = size;
  const isCompact = width < 220 || height < 200;
  const isWide = width >= 285;
  const isTall = height >= 248;
  const showTelemetry = showExtraStats || (isTall && width >= 220);

  // Smooth continuous scaling so resizing feels fluid at every pixel size
  const scale = Math.max(
    0.72,
    Math.min(1.26, Math.min(width / 238, height / 218))
  );
  const tempFontSize = Math.round(
    (showTelemetry && !isTall ? 46 : 58) * scale
  );
  const heroIconSize = Math.round(
    (showTelemetry && !isTall ? 52 : 64) * scale
  );
  const miniIconSize = Math.round(Math.max(13, Math.min(20, 16.5 * scale)));
  const subtitleFontSize = Math.round(
    Math.max(10.5, Math.min(14, 12.5 * scale))
  );

  const locationLabel = width >= 210 ? 'Semarang, ID' : 'Semarang';

  // Optical glass layers: keep base veil low-alpha so the live wallpaper refracts through
  const baseGlassVeil = lightGlass
    ? 'linear-gradient(155deg, rgba(255, 255, 255, 0.42) 0%, rgba(255, 255, 255, 0.22) 52%, rgba(255, 255, 255, 0.30) 100%)'
    : 'linear-gradient(155deg, rgba(16, 22, 38, 0.42) 0%, rgba(16, 22, 38, 0.22) 52%, rgba(14, 20, 36, 0.34) 100%)';

  const wallpaperRefraction = `radial-gradient(ellipse 78% 64% at 18% 96%, ${profile.refractionSecondary} 0%, transparent 72%), radial-gradient(ellipse 74% 62% at 86% 18%, ${profile.refractionPrimary} 0%, transparent 72%)`;

  const nextGlassMode: GlassToneMode =
    glassMode === 'auto' ? 'light' : glassMode === 'light' ? 'dark' : 'auto';
  const glassModeLabel =
    glassMode === 'auto' ? 'Auto' : glassMode === 'light' ? 'Light' : 'Dark';

  return (
    <div
      ref={rootRef}
      onPointerEnter={() => setPointerInside(true)}
      onPointerLeave={() => setPointerInside(false)}
      onPointerMove={handleSurfacePointerMove}
      className={cn(
        'relative flex h-full w-full flex-col justify-between overflow-hidden select-none',
        lightGlass ? 'text-slate-900' : 'text-white'
      )}
    >
      {/* Layer 1: Translucent Liquid Glass Veil (lets live wallpaper bleed through) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{ background: baseGlassVeil }}
      />

      {/* Layer 2: Wallpaper-Harmonized Chromatic Refraction */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{ background: wallpaperRefraction }}
      />

      {/* Layer 3: Curved Glass Optical Meniscus Sheen */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: lightGlass
            ? 'linear-gradient(132deg, rgba(255, 255, 255, 0.42) 0%, rgba(255, 255, 255, 0.08) 34%, transparent 56%, rgba(255, 255, 255, 0.16) 100%)'
            : 'linear-gradient(132deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.03) 34%, transparent 58%, rgba(255, 255, 255, 0.06) 100%)',
        }}
      />

      {/* Layer 4: Spring-Interpolated Pointer Specular Caustic */}
      {!prefersReducedMotion && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-200 ease-out"
          style={{
            background: specularCaustic,
            opacity: pointerInside ? 1 : 0,
          }}
        />
      )}

      {/* Layer 5: Prismatic Top Specular Rim Highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-4 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${profile.rimTint} 50%, transparent 100%)`,
        }}
      />

      {/* Inner Content Container */}
      <div
        className={cn(
          'relative z-10 flex h-full w-full flex-col justify-between',
          isCompact ? 'px-2.5 pt-2.5 pb-2' : 'px-3.5 pt-3 pb-2.5'
        )}
      >
        {/* Top Bar: Subtle 2-dot chrome on left + interactive "..." options on right */}
        <div className="relative flex items-center justify-between">
          <div
            aria-hidden="true"
            className={cn(
              'flex items-center gap-1.5 transition-opacity duration-150',
              widgetGalleryOpen
                ? 'opacity-0'
                : 'opacity-100 group-hover/widget:opacity-0'
            )}
          >
            <span
              className={cn(
                'h-[6.5px] w-[6.5px] rounded-full ring-1',
                lightGlass
                  ? 'bg-slate-900/20 ring-white/60'
                  : 'bg-white/35 ring-white/15'
              )}
            />
            <span
              className={cn(
                'h-[6.5px] w-[6.5px] rounded-full ring-1',
                lightGlass
                  ? 'bg-slate-900/15 ring-white/50'
                  : 'bg-white/25 ring-white/10'
              )}
            />
          </div>

          <div ref={menuRef} className="relative flex items-center">
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Weather widget options"
              aria-expanded={menuOpen}
              title="Weather options"
              className={cn(
                'flex h-5 items-center justify-center rounded-full px-1 transition-[transform,background-color,color] duration-150 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2',
                lightGlass
                  ? cn(
                      'text-slate-700/70 hover:bg-white/50 hover:text-slate-950 focus-visible:ring-slate-900/35',
                      menuOpen && 'bg-white/65 text-slate-950'
                    )
                  : cn(
                      'text-white/60 hover:bg-white/15 hover:text-white focus-visible:ring-white/40',
                      menuOpen && 'bg-white/20 text-white'
                    )
              )}
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  role="menu"
                  initial={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.94, y: -3 }
                  }
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.95, y: -2 }
                  }
                  transition={{ duration: 0.16, ease: EMIL_EASE_OUT }}
                  className={cn(
                    'absolute right-0 top-6 z-40 w-[142px] origin-top-right rounded-xl border p-1 text-[10.5px] backdrop-blur-2xl',
                    lightGlass
                      ? 'border-white/75 bg-white/80 text-slate-900 shadow-[0_14px_30px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.9)]'
                      : 'border-white/20 bg-[#101626]/85 text-white/95 shadow-[0_16px_34px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.18)]'
                  )}
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onToggleUnit();
                      setMenuOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left transition-[transform,background-color] duration-150 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]',
                      lightGlass ? 'hover:bg-slate-900/[0.07]' : 'hover:bg-white/10'
                    )}
                  >
                    <span>Unit</span>
                    <span
                      className={cn(
                        'font-mono text-[10px] font-semibold',
                        lightGlass ? 'text-slate-600' : 'text-white/70'
                      )}
                    >
                      °{unit} → °{unit === 'C' ? 'F' : 'C'}
                    </span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => onChangeGlassMode(nextGlassMode)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left transition-[transform,background-color] duration-150 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]',
                      lightGlass ? 'hover:bg-slate-900/[0.07]' : 'hover:bg-white/10'
                    )}
                  >
                    <span className="inline-flex items-center gap-1">
                      <Sparkles className="h-2.5 w-2.5 opacity-70" />
                      <span>Glass</span>
                    </span>
                    <span
                      className={cn(
                        'font-mono text-[9.5px] font-semibold',
                        lightGlass ? 'text-slate-600' : 'text-white/70'
                      )}
                    >
                      {glassModeLabel}
                    </span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setShowExtraStats((prev) => !prev);
                      setMenuOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left transition-[transform,background-color] duration-150 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]',
                      lightGlass ? 'hover:bg-slate-900/[0.07]' : 'hover:bg-white/10'
                    )}
                  >
                    <span>Details</span>
                    <span
                      className={cn(
                        'font-mono text-[9.5px]',
                        lightGlass ? 'text-slate-600' : 'text-white/65'
                      )}
                    >
                      {showTelemetry ? 'On' : 'Off'}
                    </span>
                  </button>

                  {onRefresh && (
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        onRefresh();
                        setMenuOpen(false);
                      }}
                      className={cn(
                        'flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left transition-[transform,background-color] duration-150 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]',
                        lightGlass ? 'hover:bg-slate-900/[0.07]' : 'hover:bg-white/10'
                      )}
                    >
                      <span>Refresh</span>
                      <RefreshCw
                        className={cn(
                          'h-3 w-3',
                          lightGlass ? 'text-slate-600' : 'text-white/70',
                          isRefreshing && 'animate-spin'
                        )}
                      />
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Center Hero: Giant Temperature + Volumetric Weather Artwork + Condition Subtitle */}
        <div className="my-auto flex flex-col items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${activeHourlyIdx}-${unit}-${activeSlot.kind}`}
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0.45, filter: 'blur(2px)', y: 1 }
              }
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0.45, filter: 'blur(2px)', y: -1 }
              }
              transition={{ duration: 0.17, ease: EMIL_EASE_OUT }}
              className="flex w-full flex-col items-center"
            >
              <div
                className={cn(
                  'flex w-full items-center justify-center',
                  isWide ? 'gap-5' : isCompact ? 'gap-2.5' : 'gap-3.5'
                )}
              >
                <button
                  type="button"
                  onClick={onToggleUnit}
                  title={`Click to switch to °${unit === 'C' ? 'F' : 'C'}`}
                  aria-label={`${displayTemp} degrees ${
                    unit === 'C' ? 'Celsius' : 'Fahrenheit'
                  }. Click to switch unit.`}
                  className={cn(
                    'inline-flex items-start rounded-lg leading-none tracking-[-0.04em] tabular-nums transition-[transform,opacity] duration-150 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] hover:opacity-85 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2',
                    lightGlass
                      ? 'text-slate-900 focus-visible:ring-slate-900/35'
                      : 'text-[#f8fafc] focus-visible:ring-white/40'
                  )}
                  style={{
                    fontSize: `${tempFontSize}px`,
                    textShadow: lightGlass
                      ? '0 1px 0 rgba(255, 255, 255, 0.55)'
                      : '0 2px 16px rgba(0, 0, 0, 0.28)',
                  }}
                >
                  <span className="font-normal">{displayTemp}</span>
                  <span
                    className={cn(
                      'font-light',
                      lightGlass ? 'text-slate-800/80' : 'text-white/90'
                    )}
                    style={{
                      fontSize: `${Math.round(tempFontSize * 0.62)}px`,
                      marginTop: `${Math.round(tempFontSize * 0.05)}px`,
                      marginLeft: '1px',
                    }}
                  >
                    °
                  </span>
                </button>

                <HeroWeatherArtwork
                  kind={activeSlot.kind}
                  size={heroIconSize}
                  lightGlass={lightGlass}
                />
              </div>

              {/* Subtitle: Condition • Location */}
              <div
                className={cn(
                  'mt-1 flex max-w-full items-center justify-center gap-1.5 truncate text-center font-medium tracking-[-0.01em]',
                  lightGlass ? 'text-slate-900/85' : 'text-white/90'
                )}
                style={{ fontSize: `${subtitleFontSize}px` }}
              >
                <span className="truncate">{activeSlot.condition}</span>
                <span
                  aria-hidden="true"
                  className={lightGlass ? 'text-slate-900/35' : 'text-white/45'}
                >
                  •
                </span>
                <span
                  className={cn(
                    'truncate font-normal',
                    lightGlass ? 'text-slate-800/75' : 'text-white/80'
                  )}
                >
                  {locationLabel}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Optional compact telemetry row (when resized tall or toggled from ...) */}
          {showTelemetry && (
            <div
              className={cn(
                'mt-1.5 flex items-center justify-center gap-2.5 text-[9.5px] font-medium tabular-nums',
                lightGlass ? 'text-slate-800/70' : 'text-white/65'
              )}
            >
              <span className="inline-flex items-center gap-1">
                <Droplets
                  className={cn(
                    'h-2.5 w-2.5',
                    lightGlass ? 'text-sky-600' : 'text-sky-300/90'
                  )}
                />
                <span>{weather.rainProbability}%</span>
              </span>
              <span className={lightGlass ? 'text-slate-900/25' : 'text-white/30'}>
                •
              </span>
              <span>RH {weather.humidity}%</span>
              <span className={lightGlass ? 'text-slate-900/25' : 'text-white/30'}>
                •
              </span>
              <span className="inline-flex items-center gap-1">
                <Wind
                  className={cn(
                    'h-2.5 w-2.5',
                    lightGlass ? 'text-slate-700/70' : 'text-white/60'
                  )}
                />
                <span>{weather.windSpeedKmH} km/h</span>
              </span>
            </div>
          )}
        </div>

        {/* Hairline Glass Divider + 4-Column Hourly Forecast */}
        <div className="w-full">
          <div
            aria-hidden="true"
            className={cn(
              'h-px w-full bg-gradient-to-r',
              lightGlass
                ? 'from-slate-900/0 via-slate-900/15 to-slate-900/0'
                : 'from-white/0 via-white/20 to-white/0',
              isCompact ? 'mb-1.5' : 'mb-2'
            )}
          />

          <div
            className={cn(
              'grid grid-cols-4',
              isCompact ? 'gap-0.5' : 'gap-1'
            )}
          >
            {weather.forecast.slice(0, 4).map((slot, idx) => {
              const slotTemp = unit === 'C' ? `${slot.tempC}°` : `${slot.tempF}°`;
              const isSelected = activeHourlyIdx === idx;
              return (
                <button
                  key={`${slot.time}-${idx}`}
                  type="button"
                  onClick={() => onSelectHourly(idx)}
                  title={`${slot.time}: ${slotTemp} · ${slot.condition}`}
                  aria-label={`${slot.time} forecast ${slotTemp}, ${slot.condition}`}
                  aria-pressed={isSelected}
                  className={cn(
                    'flex flex-col items-center justify-center rounded-xl transition-[transform,background-color,box-shadow] duration-150 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2',
                    isCompact ? 'py-1 px-0.5 gap-0.5' : 'py-1.5 px-1 gap-1',
                    lightGlass
                      ? cn(
                          'focus-visible:ring-slate-900/35',
                          isSelected
                            ? 'bg-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_12px_rgba(15,23,42,0.08)] ring-1 ring-white/75'
                            : 'hover:bg-white/30'
                        )
                      : cn(
                          'focus-visible:ring-white/40',
                          isSelected
                            ? 'bg-white/[0.16] shadow-[inset_0_1px_0_rgba(255,255,255,0.34),0_4px_14px_rgba(0,0,0,0.2)] ring-1 ring-white/25'
                            : 'hover:bg-white/[0.08]'
                        )
                  )}
                >
                  <MiniWeatherIcon
                    kind={slot.kind}
                    size={miniIconSize}
                    active={isSelected}
                    lightGlass={lightGlass}
                  />

                  {isWide ? (
                    <span
                      className={cn(
                        'truncate whitespace-nowrap text-[10px] leading-none tabular-nums',
                        lightGlass
                          ? isSelected
                            ? 'font-semibold text-slate-950'
                            : 'font-medium text-slate-800/75'
                          : isSelected
                            ? 'font-medium text-white'
                            : 'font-normal text-white/80'
                      )}
                    >
                      {slot.time}: {slotTemp}
                    </span>
                  ) : (
                    <div className="flex flex-col items-center leading-tight tabular-nums">
                      <span
                        className={cn(
                          isCompact ? 'text-[8px]' : 'text-[9px]',
                          lightGlass
                            ? isSelected
                              ? 'font-medium text-slate-900/80'
                              : 'text-slate-700/65'
                            : isSelected
                              ? 'text-white/85'
                              : 'text-white/55'
                        )}
                      >
                        {slot.time}
                      </span>
                      <span
                        className={cn(
                          'font-medium',
                          isCompact ? 'text-[9.5px]' : 'text-[10.5px]',
                          lightGlass
                            ? isSelected
                              ? 'font-semibold text-slate-950'
                              : 'text-slate-900/85'
                            : isSelected
                              ? 'text-white'
                              : 'text-white/90'
                        )}
                      >
                        {slotTemp}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
