import { createContext, useContext, type Dispatch, type RefObject, type SetStateAction } from 'react';
import type { ListeningTrack } from '@/data/recentTracks';

export type WallpaperId =
  | 'prism'
  | 'glassy'
  | 'aurora'
  | 'sky'
  | 'watercolor'
  | 'perla'
  | 'kai'
  | 'silk-gold'
  | 'lagoon'
  | 'kasane-crimson'
  | 'kasane-violet'
  | 'kasane-ochre'
  | 'forms'
  | 'mist'
  | 'glint'
  | 'rings';

export type WallpaperKind = 'video' | 'image';
export type WallpaperCategory = 'motion' | 'stills';

export type OsAppId =
  | 'projects'
  | 'safari'
  | 'about'
  | 'resume'
  | 'blog'
  | 'notes'
  | 'terminal'
  | 'mail'
  | 'settings'
  | 'town';

export type SettingsPaneId = 'appearance' | 'wallpaper' | 'displays' | 'about';
export type OsAppearance = 'light' | 'dark' | 'auto';
export type OsPowerState = 'on' | 'locked' | 'sleeping';

export interface WallpaperOption {
  id: WallpaperId;
  label: string;
  subtitle: string;
  category: WallpaperCategory;
  kind: WallpaperKind;
  /** Instant CSS fallback gradient rendered at 0ms before media mounts */
  background: string;
  preview: string;
  /** Crisp 480x270 WebP thumbnail for System Settings */
  thumbnail: string;
  /** Hardware-decoded seamless H.264 MP4 loop (for kind === 'video') */
  videoSrc?: string;
  /** Instant first-paint / reduced-motion WebP poster */
  poster?: string;
  /** 2560x1440 rendered WebP still (for kind === 'image') */
  imageSrc?: string;
  isLight?: boolean;
}

export const WALLPAPERS: readonly WallpaperOption[] = [
  // ── Dynamic (Hardware-Decoded Seamless MP4 Loops) ────────────────────────
  {
    id: 'prism',
    label: 'Ultraviolet',
    subtitle: 'Refracted cobalt, periwinkle & soft orchid',
    category: 'motion',
    kind: 'video',
    background:
      'linear-gradient(135deg, #1E3AB8 0%, #7FA8F0 32%, #8E5BE8 62%, #F8B8E8 100%)',
    preview:
      'linear-gradient(135deg, #1E3AB8 0%, #8E5BE8 55%, #F8B8E8 100%)',
    thumbnail: '/wallpapers/prism-thumb.webp',
    poster: '/wallpapers/prism-poster.webp',
    videoSrc: '/wallpapers/prism.mp4',
  },
  {
    id: 'glassy',
    label: 'Frosted Mint',
    subtitle: 'Luminous mint beneath architectural frosted glass',
    category: 'motion',
    kind: 'video',
    background:
      'linear-gradient(145deg, #EFF5F2 0%, #C7F3E9 34%, #3BD2BB 70%, #0AB5A2 100%)',
    preview:
      'linear-gradient(145deg, #EFF5F2 0%, #88E7D5 52%, #0AB5A2 100%)',
    thumbnail: '/wallpapers/glassy-thumb.webp',
    poster: '/wallpapers/glassy-poster.webp',
    videoSrc: '/wallpapers/glassy.mp4',
    isLight: true,
  },
  {
    id: 'aurora',
    label: 'Northern Glow',
    subtitle: 'Arctic emerald light over starlit midnight',
    category: 'motion',
    kind: 'video',
    background:
      'linear-gradient(165deg, #132B45 0%, #2E7A6A 48%, #5FE896 82%, #EDFFEB 100%)',
    preview:
      'linear-gradient(165deg, #132B45 0%, #2E7A6A 50%, #5FE896 84%, #EDFFEB 100%)',
    thumbnail: '/wallpapers/aurora-thumb.webp',
    poster: '/wallpapers/aurora-poster.webp',
    videoSrc: '/wallpapers/aurora.mp4',
  },
  {
    id: 'sky',
    label: 'Madder Dusk',
    subtitle: 'Drifting clouds in warm peach, rose & plum',
    category: 'motion',
    kind: 'video',
    background:
      'linear-gradient(180deg, #FFE3C7 0%, #F2B8A0 34%, #C77E9E 68%, #7A5E9E 100%)',
    preview:
      'linear-gradient(180deg, #FFE3C7 0%, #C77E9E 54%, #7A5E9E 100%)',
    thumbnail: '/wallpapers/sky-thumb.webp',
    poster: '/wallpapers/sky-poster.webp',
    videoSrc: '/wallpapers/sky.mp4',
    isLight: true,
  },
  {
    id: 'watercolor',
    label: 'Sea Orchid',
    subtitle: 'Soft violet & aqua pigment wash',
    category: 'motion',
    kind: 'video',
    background:
      'linear-gradient(135deg, #F8F7FC 0%, #DFD6F7 44%, #C2E5F6 76%, #9EE3DF 100%)',
    preview:
      'linear-gradient(135deg, #F8F7FC 0%, #AF89ED 54%, #2DC9C1 100%)',
    thumbnail: '/wallpapers/watercolor-thumb.webp',
    poster: '/wallpapers/watercolor-poster.webp',
    videoSrc: '/wallpapers/watercolor.mp4',
    isLight: true,
  },
  {
    id: 'perla',
    label: 'Iridescent Pearl',
    subtitle: 'Deep cobalt, luminous pearl & rose quartz',
    category: 'motion',
    kind: 'video',
    background:
      'linear-gradient(145deg, #010419 0%, #003EB4 26%, #C2B1F8 52%, #FFA5C8 74%, #3F0B19 100%)',
    preview:
      'linear-gradient(145deg, #010419 0%, #00B1CE 32%, #FBDEF0 60%, #E36654 100%)',
    thumbnail: '/wallpapers/perla-thumb.webp',
    poster: '/wallpapers/perla-poster.webp',
    videoSrc: '/wallpapers/perla.mp4',
  },
  {
    id: 'kai',
    label: 'Jade Blush',
    subtitle: 'Deep forest jade & soft rose light',
    category: 'motion',
    kind: 'video',
    background:
      'linear-gradient(145deg, #03161A 0%, #1E8C7A 34%, #F6E8EC 62%, #E07A9A 82%, #2A0A24 100%)',
    preview:
      'linear-gradient(145deg, #03161A 0%, #1E8C7A 38%, #F3C3CF 68%, #2A0A24 100%)',
    thumbnail: '/wallpapers/kai-thumb.webp',
    poster: '/wallpapers/kai-poster.webp',
    videoSrc: '/wallpapers/kai.mp4',
  },
  {
    id: 'silk-gold',
    label: 'Champagne',
    subtitle: 'Woven burnished gold satin folds',
    category: 'motion',
    kind: 'video',
    background:
      'linear-gradient(140deg, #5A3A08 0%, #9A6712 32%, #D69A23 62%, #FFE08A 88%, #FFF4C8 100%)',
    preview:
      'linear-gradient(140deg, #5A3A08 0%, #D69A23 52%, #FFF4C8 100%)',
    thumbnail: '/wallpapers/silk-gold-thumb.webp',
    poster: '/wallpapers/silk-gold-poster.webp',
    videoSrc: '/wallpapers/silk-gold.mp4',
  },
  {
    id: 'lagoon',
    label: 'Cobalt Tide',
    subtitle: 'Abyssal cobalt, cerulean & electric aqua',
    category: 'motion',
    kind: 'video',
    background:
      'linear-gradient(155deg, #02074A 0%, #1D5DDB 46%, #46B4D5 76%, #D2FEFA 100%)',
    preview:
      'linear-gradient(155deg, #02074A 0%, #1D5DDB 48%, #63EDE8 82%, #D2FEFA 100%)',
    thumbnail: '/wallpapers/lagoon-thumb.webp',
    poster: '/wallpapers/lagoon-poster.webp',
    videoSrc: '/wallpapers/lagoon.mp4',
  },

  // ── Stills ───────────────────────────────────────────────────────────────
  {
    id: 'kasane-crimson',
    label: 'Crimson Flash',
    subtitle: 'Glacial sky, crimson horizon & deep navy',
    category: 'stills',
    kind: 'image',
    background:
      'linear-gradient(180deg, #B6D1EF 0%, #E6F2F6 26%, #F26176 62%, #79224A 82%, #08345C 100%)',
    preview:
      'linear-gradient(180deg, #B6D1EF 0%, #F6E4E0 36%, #E72351 68%, #08345C 100%)',
    thumbnail: '/wallpapers/kasane-crimson-thumb.webp',
    imageSrc: '/wallpapers/kasane-crimson.webp',
    isLight: true,
  },
  {
    id: 'kasane-violet',
    label: 'Violet Night',
    subtitle: 'Nocturnal plum, royal violet & rose pearl',
    category: 'stills',
    kind: 'image',
    background:
      'linear-gradient(180deg, #1D0F26 0%, #463291 42%, #9A88D1 76%, #E9B8BD 100%)',
    preview:
      'linear-gradient(180deg, #1D0F26 0%, #5D49AA 50%, #E9B8BD 100%)',
    thumbnail: '/wallpapers/kasane-violet-thumb.webp',
    imageSrc: '/wallpapers/kasane-violet.webp',
  },
  {
    id: 'kasane-ochre',
    label: 'Navy Ochre',
    subtitle: 'Prussian navy, silver mist & warm ochre',
    category: 'stills',
    kind: 'image',
    background:
      'linear-gradient(180deg, #0F1E42 0%, #293073 24%, #DCE1E5 54%, #A86715 86%, #B05E07 100%)',
    preview:
      'linear-gradient(180deg, #0F1E42 0%, #DCE1E5 52%, #B05E07 100%)',
    thumbnail: '/wallpapers/kasane-ochre-thumb.webp',
    imageSrc: '/wallpapers/kasane-ochre.webp',
  },
  {
    id: 'forms',
    label: 'Obsidian Orbit',
    subtitle: 'Geometric glow over matte obsidian',
    category: 'stills',
    kind: 'image',
    background:
      'radial-gradient(circle at 68% 52%, rgba(154,107,255,0.42), rgba(255,100,125,0.22) 45%, #15131B 80%)',
    preview:
      'linear-gradient(135deg, #15131B 0%, #9A6BFF 48%, #FF647D 76%, #FFD466 100%)',
    thumbnail: '/wallpapers/forms-thumb.webp',
    imageSrc: '/wallpapers/forms.webp',
  },
  {
    id: 'mist',
    label: 'Moonlit Ridge',
    subtitle: 'Atmospheric indigo mountain silhouettes',
    category: 'stills',
    kind: 'image',
    background:
      'linear-gradient(180deg, #101828 0%, #3A4A6B 34%, #26324C 68%, #111826 100%)',
    preview:
      'linear-gradient(180deg, #101828 0%, #3A4A6B 46%, #111826 100%)',
    thumbnail: '/wallpapers/mist-thumb.webp',
    imageSrc: '/wallpapers/mist.webp',
  },
  {
    id: 'glint',
    label: 'Golden Horizon',
    subtitle: 'Warm sunset reflection & water shimmer',
    category: 'stills',
    kind: 'image',
    background:
      'linear-gradient(180deg, #FFF0D4 0%, #FFB07C 36%, #9E4E74 72%, #2E2A5E 100%)',
    preview:
      'linear-gradient(180deg, #FFF0D4 0%, #F47C6D 48%, #2E2A5E 100%)',
    thumbnail: '/wallpapers/glint-thumb.webp',
    imageSrc: '/wallpapers/glint.webp',
    isLight: true,
  },
  {
    id: 'rings',
    label: 'Velvet Ripple',
    subtitle: 'Concentric plum & pearl echoes',
    category: 'stills',
    kind: 'image',
    background:
      'radial-gradient(circle at 50% 50%, #FEF4F4 0%, #EEBBCB 30%, #895B8A 66%, #3C3044 100%)',
    preview:
      'radial-gradient(circle at 50% 50%, #FEF4F4 0%, #EEBBCB 34%, #895B8A 68%, #3C3044 100%)',
    thumbnail: '/wallpapers/rings-thumb.webp',
    imageSrc: '/wallpapers/rings.webp',
    isLight: true,
  },
];

export type SystemFontId = 'inter' | 'geist' | 'jakarta';
export type OsLanguage = 'en' | 'id';
export const GANOS_VERSION = '2.4';

export type MusicPlaybackContextValue = {
  trackPlaybackSec: number;
  trackDurationSec: number;
};

export type NoteContext = {
  note: string;
  setNote: Dispatch<SetStateAction<string>>;
  activePath?: string;
  wallpaperId: WallpaperId;
  wallpaperLabel: string;
  setWallpaperId: (id: WallpaperId) => void;
  cycleWallpaper: () => void;
  autoRotateWallpaper: boolean;
  setAutoRotateWallpaper: Dispatch<SetStateAction<boolean>>;
  wallpaperMotion: boolean;
  setWallpaperMotion: Dispatch<SetStateAction<boolean>>;
  appearance: OsAppearance;
  setAppearance: (appearance: OsAppearance) => void;
  systemFont: SystemFontId;
  setSystemFont: (font: SystemFontId) => void;
  language: OsLanguage;
  setLanguage: (lang: OsLanguage) => void;
  isDark: boolean;
  brightness: number;
  setBrightness: (value: number) => void;
  openApp: (id: OsAppId, payload?: string) => void;
  settingsPane: SettingsPaneId;
  setSettingsPane: (pane: SettingsPaneId) => void;
  power: OsPowerState;
  setPower: (power: OsPowerState) => void;
  widgetGalleryOpen: boolean;
  setWidgetGalleryOpen: Dispatch<SetStateAction<boolean>>;
  isFocused: boolean;
  activeTrack: ListeningTrack;
  setActiveTrack: (track: ListeningTrack) => void;
  isPlayingTrack: boolean;
  setIsPlayingTrack: Dispatch<SetStateAction<boolean>>;
  volume: number;
  isMuted: boolean;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  seekTrack: (sec: number) => void;
  isLooping: boolean;
  toggleLoop: () => void;
  togglePlayTrack: (track?: ListeningTrack) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  shuffleTrack: () => ListeningTrack;
  audioRef: RefObject<HTMLAudioElement | null>;
};

export const OsShellContext = createContext<NoteContext | null>(null);
export const OsMusicPlaybackContext = createContext<MusicPlaybackContextValue>({
  trackPlaybackSec: 0,
  trackDurationSec: 30,
});
export const WindowFocusContext = createContext<boolean>(true);

export const useOsNote = (): NoteContext => {
  const ctx = useContext(OsShellContext);
  if (!ctx) {
    throw new Error('useOsNote must be used inside <OsShell>');
  }
  return ctx;
};

export const useOsMusicPlayback = (): MusicPlaybackContextValue =>
  useContext(OsMusicPlaybackContext);

export const useWindowFocus = (): boolean => useContext(WindowFocusContext);
