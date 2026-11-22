import type { WallpaperId } from '@/components/os/OsShellContext';

export type WeatherKind =
  | 'clear-day'
  | 'clear-night'
  | 'partly-cloudy-day'
  | 'partly-cloudy-night'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'storm';

export interface WeatherForecastSlot {
  time: string;
  tempC: number;
  tempF: number;
  condition: string;
  weatherCode: number;
  isDay: boolean;
  kind: WeatherKind;
}

export interface LiveWeatherData {
  tempC: number;
  tempF: number;
  condition: string;
  weatherCode: number;
  isDay: boolean;
  kind: WeatherKind;
  rainProbability: number;
  humidity: number;
  windSpeedKmH: number;
  sunrise: string;
  sunset: string;
  daylightDuration: string;
  forecast: WeatherForecastSlot[];
}

export function parseWmoWeather(
  code: number,
  isDay = true
): { condition: string; kind: WeatherKind } {
  if (code === 0) {
    return isDay
      ? { condition: 'Clear', kind: 'clear-day' }
      : { condition: 'Clear Night', kind: 'clear-night' };
  }
  if (code === 1 || code === 2) {
    return isDay
      ? { condition: 'Partly Cloudy', kind: 'partly-cloudy-day' }
      : { condition: 'Partly Cloudy', kind: 'partly-cloudy-night' };
  }
  if (code === 3) {
    return { condition: 'Cloudy', kind: 'cloudy' };
  }
  if (code === 45 || code === 48) {
    return { condition: 'Foggy', kind: 'fog' };
  }
  if (code >= 51 && code <= 57) {
    return { condition: 'Drizzle', kind: 'drizzle' };
  }
  if (code >= 61 && code <= 67) {
    return { condition: 'Rain', kind: 'rain' };
  }
  if (code >= 80 && code <= 82) {
    return { condition: 'Heavy Rain', kind: 'rain' };
  }
  if (code >= 95) {
    return { condition: 'Thunderstorm', kind: 'storm' };
  }
  return { condition: 'Cloudy', kind: 'cloudy' };
}

export function formatShortHour12(hour24: number): string {
  const normalized = ((hour24 % 24) + 24) % 24;
  if (normalized === 0) return '12AM';
  if (normalized === 12) return '12PM';
  return normalized < 12 ? `${normalized}AM` : `${normalized - 12}PM`;
}

export const DEFAULT_WEATHER_DATA: LiveWeatherData = {
  tempC: 26,
  tempF: 79,
  condition: 'Partly Cloudy',
  weatherCode: 2,
  isDay: false,
  kind: 'partly-cloudy-night',
  rainProbability: 25,
  humidity: 78,
  windSpeedKmH: 8,
  sunrise: '05:18',
  sunset: '17:42',
  daylightDuration: '12h 24m',
  forecast: [
    {
      time: 'Now',
      tempC: 26,
      tempF: 79,
      condition: 'Partly Cloudy',
      weatherCode: 2,
      isDay: false,
      kind: 'partly-cloudy-night',
    },
    {
      time: '12AM',
      tempC: 25,
      tempF: 77,
      condition: 'Clear Night',
      weatherCode: 0,
      isDay: false,
      kind: 'clear-night',
    },
    {
      time: '1AM',
      tempC: 25,
      tempF: 77,
      condition: 'Drizzle',
      weatherCode: 51,
      isDay: false,
      kind: 'drizzle',
    },
    {
      time: '2AM',
      tempC: 24,
      tempF: 75,
      condition: 'Cloudy',
      weatherCode: 3,
      isDay: false,
      kind: 'cloudy',
    },
  ],
};

export type GlassToneMode = 'auto' | 'light' | 'dark';

export interface WallpaperGlassProfile {
  /** Whether the wallpaper surface behind desktop widgets is bright/pastel */
  isLightSurface: boolean;
  /** Subtle chromatic refraction tint sampled from the wallpaper's palette */
  refractionPrimary: string;
  refractionSecondary: string;
  /** Chromatic edge tint for liquid-glass rim dispersion */
  rimTint: string;
}

const WALLPAPER_GLASS_PROFILES: Record<WallpaperId, WallpaperGlassProfile> = {
  prism: {
    isLightSurface: false,
    refractionPrimary: 'rgba(142, 91, 232, 0.24)',
    refractionSecondary: 'rgba(127, 168, 240, 0.24)',
    rimTint: 'rgba(226, 206, 255, 0.42)',
  },
  glassy: {
    isLightSurface: true,
    refractionPrimary: 'rgba(59, 210, 187, 0.22)',
    refractionSecondary: 'rgba(199, 243, 233, 0.28)',
    rimTint: 'rgba(218, 250, 244, 0.62)',
  },
  aurora: {
    isLightSurface: false,
    refractionPrimary: 'rgba(95, 232, 150, 0.22)',
    refractionSecondary: 'rgba(46, 122, 106, 0.24)',
    rimTint: 'rgba(182, 250, 214, 0.36)',
  },
  sky: {
    isLightSurface: true,
    refractionPrimary: 'rgba(242, 184, 160, 0.24)',
    refractionSecondary: 'rgba(199, 126, 158, 0.22)',
    rimTint: 'rgba(255, 228, 212, 0.60)',
  },
  watercolor: {
    isLightSurface: true,
    refractionPrimary: 'rgba(175, 137, 237, 0.24)',
    refractionSecondary: 'rgba(121, 191, 234, 0.24)',
    rimTint: 'rgba(232, 226, 255, 0.60)',
  },
  perla: {
    isLightSurface: false,
    refractionPrimary: 'rgba(194, 177, 248, 0.24)',
    refractionSecondary: 'rgba(0, 177, 206, 0.22)',
    rimTint: 'rgba(245, 224, 248, 0.40)',
  },
  kai: {
    isLightSurface: false,
    refractionPrimary: 'rgba(143, 217, 200, 0.22)',
    refractionSecondary: 'rgba(224, 122, 154, 0.22)',
    rimTint: 'rgba(232, 244, 240, 0.36)',
  },
  'silk-gold': {
    isLightSurface: false,
    refractionPrimary: 'rgba(242, 194, 76, 0.24)',
    refractionSecondary: 'rgba(154, 103, 18, 0.22)',
    rimTint: 'rgba(255, 234, 168, 0.42)',
  },
  lagoon: {
    isLightSurface: false,
    refractionPrimary: 'rgba(99, 237, 232, 0.24)',
    refractionSecondary: 'rgba(29, 93, 219, 0.26)',
    rimTint: 'rgba(176, 246, 250, 0.38)',
  },
  'kasane-crimson': {
    isLightSurface: true,
    refractionPrimary: 'rgba(182, 209, 239, 0.26)',
    refractionSecondary: 'rgba(231, 35, 81, 0.18)',
    rimTint: 'rgba(255, 224, 230, 0.60)',
  },
  'kasane-violet': {
    isLightSurface: false,
    refractionPrimary: 'rgba(154, 136, 209, 0.24)',
    refractionSecondary: 'rgba(233, 184, 189, 0.20)',
    rimTint: 'rgba(228, 214, 248, 0.40)',
  },
  'kasane-ochre': {
    isLightSurface: false,
    refractionPrimary: 'rgba(177, 178, 212, 0.22)',
    refractionSecondary: 'rgba(176, 94, 7, 0.20)',
    rimTint: 'rgba(236, 228, 216, 0.38)',
  },
  forms: {
    isLightSurface: false,
    refractionPrimary: 'rgba(154, 107, 255, 0.24)',
    refractionSecondary: 'rgba(255, 100, 125, 0.22)',
    rimTint: 'rgba(235, 214, 255, 0.38)',
  },
  mist: {
    isLightSurface: false,
    refractionPrimary: 'rgba(130, 162, 214, 0.20)',
    refractionSecondary: 'rgba(58, 74, 107, 0.24)',
    rimTint: 'rgba(206, 222, 248, 0.34)',
  },
  glint: {
    isLightSurface: true,
    refractionPrimary: 'rgba(255, 176, 124, 0.24)',
    refractionSecondary: 'rgba(158, 78, 116, 0.20)',
    rimTint: 'rgba(255, 234, 210, 0.60)',
  },
  rings: {
    isLightSurface: true,
    refractionPrimary: 'rgba(238, 187, 203, 0.24)',
    refractionSecondary: 'rgba(137, 91, 138, 0.20)',
    rimTint: 'rgba(250, 232, 240, 0.58)',
  },
};

export function getWallpaperGlassProfile(
  wallpaperId: WallpaperId,
  mode: GlassToneMode = 'auto'
): WallpaperGlassProfile {
  const base = WALLPAPER_GLASS_PROFILES[wallpaperId] ?? WALLPAPER_GLASS_PROFILES.prism;
  if (mode === 'auto') return base;
  return {
    ...base,
    isLightSurface: mode === 'light',
  };
}
