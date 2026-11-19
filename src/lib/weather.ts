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
  zephyr: {
    isLightSurface: true,
    refractionPrimary: 'rgba(104, 152, 232, 0.22)',
    refractionSecondary: 'rgba(240, 145, 165, 0.20)',
    rimTint: 'rgba(196, 224, 255, 0.55)',
  },
  crimson: {
    isLightSurface: true,
    refractionPrimary: 'rgba(182, 209, 239, 0.26)',
    refractionSecondary: 'rgba(242, 97, 118, 0.18)',
    rimTint: 'rgba(255, 220, 226, 0.58)',
  },
  matsukaze: {
    isLightSurface: true,
    refractionPrimary: 'rgba(136, 171, 141, 0.24)',
    refractionSecondary: 'rgba(222, 235, 213, 0.26)',
    rimTint: 'rgba(225, 245, 222, 0.58)',
  },
  sunrise: {
    isLightSurface: true,
    refractionPrimary: 'rgba(246, 161, 146, 0.24)',
    refractionSecondary: 'rgba(176, 106, 179, 0.18)',
    rimTint: 'rgba(255, 232, 206, 0.62)',
  },
  twilight: {
    isLightSurface: false,
    refractionPrimary: 'rgba(160, 216, 239, 0.20)',
    refractionSecondary: 'rgba(244, 179, 194, 0.22)',
    rimTint: 'rgba(216, 210, 255, 0.34)',
  },
  okibi: {
    isLightSurface: false,
    refractionPrimary: 'rgba(247, 158, 114, 0.24)',
    refractionSecondary: 'rgba(214, 93, 83, 0.20)',
    rimTint: 'rgba(255, 208, 180, 0.34)',
  },
  dusk: {
    isLightSurface: false,
    refractionPrimary: 'rgba(117, 151, 222, 0.22)',
    refractionSecondary: 'rgba(246, 178, 168, 0.24)',
    rimTint: 'rgba(224, 204, 255, 0.34)',
  },
  ocean: {
    isLightSurface: false,
    refractionPrimary: 'rgba(72, 184, 204, 0.22)',
    refractionSecondary: 'rgba(32, 86, 108, 0.24)',
    rimTint: 'rgba(164, 232, 244, 0.32)',
  },
  graphite: {
    isLightSurface: false,
    refractionPrimary: 'rgba(212, 218, 232, 0.14)',
    refractionSecondary: 'rgba(148, 163, 184, 0.14)',
    rimTint: 'rgba(235, 240, 248, 0.28)',
  },
  lagoon: {
    isLightSurface: false,
    refractionPrimary: 'rgba(99, 237, 232, 0.22)',
    refractionSecondary: 'rgba(54, 118, 238, 0.24)',
    rimTint: 'rgba(165, 242, 248, 0.34)',
  },
  neptune: {
    isLightSurface: false,
    refractionPrimary: 'rgba(125, 227, 242, 0.22)',
    refractionSecondary: 'rgba(124, 92, 246, 0.24)',
    rimTint: 'rgba(196, 222, 255, 0.36)',
  },
  cinema: {
    isLightSurface: false,
    refractionPrimary: 'rgba(255, 159, 69, 0.22)',
    refractionSecondary: 'rgba(232, 80, 91, 0.20)',
    rimTint: 'rgba(255, 210, 182, 0.34)',
  },
  aurora: {
    isLightSurface: false,
    refractionPrimary: 'rgba(102, 248, 167, 0.20)',
    refractionSecondary: 'rgba(76, 196, 184, 0.22)',
    rimTint: 'rgba(180, 250, 220, 0.34)',
  },
};

export function getWallpaperGlassProfile(
  wallpaperId: WallpaperId,
  mode: GlassToneMode = 'auto'
): WallpaperGlassProfile {
  const base = WALLPAPER_GLASS_PROFILES[wallpaperId] ?? WALLPAPER_GLASS_PROFILES.zephyr;
  if (mode === 'auto') return base;
  return {
    ...base,
    isLightSurface: mode === 'light',
  };
}
