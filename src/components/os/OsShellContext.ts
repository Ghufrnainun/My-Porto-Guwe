import { createContext, useContext, type Dispatch, type RefObject, type SetStateAction } from 'react';
import type { ListeningTrack } from '@/data/recentTracks';

export type WallpaperId =
  | 'zephyr'
  | 'crimson'
  | 'twilight'
  | 'matsukaze'
  | 'okibi'
  | 'dusk'
  | 'ocean'
  | 'sunrise'
  | 'graphite'
  | 'lagoon'
  | 'neptune'
  | 'cinema'
  | 'aurora';

export type OsAppId =
  | 'projects'
  | 'safari'
  | 'about'
  | 'resume'
  | 'blog'
  | 'notes'
  | 'terminal'
  | 'mail'
  | 'settings';

export type SettingsPaneId = 'appearance' | 'wallpaper' | 'displays' | 'about';
export type OsAppearance = 'light' | 'dark' | 'auto';
export type OsPowerState = 'on' | 'locked' | 'sleeping';

export interface WallpaperOption {
  id: WallpaperId;
  label: string;
  subtitle: string;
  background: string;
  preview: string;
  isLight?: boolean;
}

export const WALLPAPERS: readonly WallpaperOption[] = [
  {
    id: 'zephyr',
    label: 'Iridescent Cloud',
    subtitle: 'FeralUI Flow · Moon White, Lapis, Peach Pink & Ancient Purple',
    background: [
      'linear-gradient(180deg, rgba(14, 21, 48, 0.38) 0%, rgba(14, 21, 48, 0) 9%)',
      'radial-gradient(ellipse 68% 42% at 62% 22%, rgba(234, 244, 252, 0.92) 0%, rgba(234, 244, 252, 0) 68%)',
      'radial-gradient(ellipse 64% 52% at 44% 72%, rgba(234, 244, 252, 0.88) 0%, rgba(234, 244, 252, 0) 64%)',
      'radial-gradient(ellipse 58% 48% at 92% 16%, rgba(30, 80, 162, 0.92) 0%, rgba(30, 80, 162, 0) 66%)',
      'radial-gradient(ellipse 52% 46% at 78% 42%, rgba(240, 145, 153, 0.78) 0%, rgba(240, 145, 153, 0) 64%)',
      'radial-gradient(ellipse 68% 58% at 86% 84%, rgba(137, 91, 138, 0.94) 0%, rgba(137, 91, 138, 0) 70%)',
      'linear-gradient(135deg, #c3c8df 0%, #eaf4fc 38%, #1e50a2 64%, #f09199 81%, #895b8a 100%)',
    ].join(', '),
    preview:
      'linear-gradient(135deg, #c3c8df 0%, #eaf4fc 34%, #1e50a2 60%, #f09199 78%, #895b8a 100%)',
  },
  {
    id: 'crimson',
    label: 'Crimson Flash',
    subtitle: 'FeralUI Bokashi · Beni-no-sen (紅の閃)',
    background: [
      'linear-gradient(180deg, rgba(8, 28, 54, 0.42) 0%, rgba(8, 28, 54, 0) 10%)',
      'radial-gradient(ellipse 80% 50% at 24% 18%, rgba(230, 242, 246, 0.55) 0%, transparent 65%)',
      'linear-gradient(162deg, #B6D1EF 0%, #E6F2F6 24.5%, #F6E4E0 51.5%, #F26176 64%, #E72351 73.5%, #79224A 81.5%, #39335A 89%, #08345C 95%, #08345C 100%)',
    ].join(', '),
    preview:
      'linear-gradient(162deg, #B6D1EF 0%, #E6F2F6 24%, #F6E4E0 50%, #F26176 64%, #E72351 74%, #79224A 82%, #39335A 90%, #08345C 100%)',
  },
  {
    id: 'twilight',
    label: 'Twilight Wheel',
    subtitle: 'FeralUI Angular · Yoi-no-wa (宵の輪)',
    background: [
      'linear-gradient(180deg, rgba(20, 32, 66, 0.36) 0%, rgba(20, 32, 66, 0) 10%)',
      'radial-gradient(ellipse 72% 58% at 32% 36%, rgba(160, 216, 239, 0.42) 0%, transparent 65%)',
      'radial-gradient(ellipse 68% 55% at 72% 68%, rgba(244, 179, 194, 0.45) 0%, transparent 65%)',
      'conic-gradient(from 215deg at 52% 50%, #223A70 0deg, #824880 95deg, #F4B3C2 190deg, #A0D8EF 280deg, #223A70 360deg)',
    ].join(', '),
    preview:
      'conic-gradient(from 215deg at 52% 50%, #223A70 0deg, #824880 95deg, #F4B3C2 190deg, #A0D8EF 280deg, #223A70 360deg)',
  },
  {
    id: 'matsukaze',
    label: 'Pine Wind',
    subtitle: 'FeralUI Mist · Matsukaze (松風)',
    background: [
      'linear-gradient(180deg, rgba(35, 56, 44, 0.4) 0%, rgba(35, 56, 44, 0) 11%)',
      'radial-gradient(ellipse 95% 36% at 64% 42%, rgba(242, 247, 237, 0.68) 0%, rgba(222, 235, 213, 0.25) 48%, transparent 75%)',
      'radial-gradient(ellipse 80% 45% at 28% 54%, rgba(182, 207, 177, 0.5) 0%, transparent 70%)',
      'linear-gradient(180deg, #DEEBD5 0%, #F2F7ED 28%, #B6CFB1 48%, #88AB8D 66%, #5C8267 84%, #375343 100%)',
    ].join(', '),
    preview:
      'linear-gradient(180deg, #F2F7ED 0%, #DEEBD5 22%, #B6CFB1 45%, #88AB8D 66%, #5C8267 84%, #375343 100%)',
  },
  {
    id: 'okibi',
    label: 'Ember Glow',
    subtitle: 'FeralUI Smesh · Okibi (熾火)',
    background: [
      'radial-gradient(ellipse 68% 52% at 82% 76%, rgba(255, 224, 184, 0.85) 0%, rgba(247, 158, 114, 0.45) 42%, transparent 72%)',
      'radial-gradient(ellipse 74% 58% at 62% 54%, rgba(214, 93, 83, 0.72) 0%, transparent 68%)',
      'radial-gradient(ellipse 75% 62% at 28% 34%, rgba(138, 54, 72, 0.68) 0%, transparent 68%)',
      'linear-gradient(135deg, #1C1013 0%, #4A1E2A 24%, #8A3648 48%, #D65D53 68%, #F79E72 86%, #FFE0B8 100%)',
    ].join(', '),
    preview:
      'linear-gradient(135deg, #1C1013 0%, #4A1E2A 24%, #8A3648 48%, #D65D53 68%, #F79E72 86%, #FFE0B8 100%)',
  },
  {
    id: 'dusk',
    label: 'Dusk',
    subtitle: 'Violet indigo & warm horizon',
    background: 'linear-gradient(160deg, #2b1055 0%, #7597de 55%, #f6b2a8 100%)',
    preview: 'linear-gradient(160deg, #2b1055 0%, #7597de 55%, #f6b2a8 100%)',
  },
  {
    id: 'ocean',
    label: 'Ocean',
    subtitle: 'Deep teal & slate waters',
    background: 'linear-gradient(200deg, #0f2027 0%, #203a43 45%, #2c7a8c 100%)',
    preview: 'linear-gradient(200deg, #0f2027 0%, #203a43 45%, #2c7a8c 100%)',
  },
  {
    id: 'sunrise',
    label: 'Sunrise',
    subtitle: 'Peach dusk & orchid',
    background: 'linear-gradient(180deg, #f9d5a7 0%, #f6a192 50%, #b06ab3 100%)',
    preview: 'linear-gradient(180deg, #f9d5a7 0%, #f6a192 50%, #b06ab3 100%)',
    isLight: true,
  },
  {
    id: 'graphite',
    label: 'Graphite',
    subtitle: 'Monochrome studio dark',
    background: 'radial-gradient(circle at 30% 20%, #4b4b52 0%, #1c1c1f 70%)',
    preview: 'radial-gradient(circle at 30% 20%, #4b4b52 0%, #1c1c1f 70%)',
  },
  {
    id: 'lagoon',
    label: 'Feral Lagoon',
    subtitle: 'Abyssal cobalt & aqua',
    background:
      "radial-gradient(ellipse 85% 65% at 78% 18%, rgba(99, 237, 232, 0.34), transparent 60%), radial-gradient(ellipse 75% 60% at 18% 82%, rgba(29, 93, 219, 0.44), transparent 62%), url('/ghufron-os-wallpaper.svg') center/cover no-repeat",
    preview: 'linear-gradient(135deg, #02074A 0%, #1D5DDB 50%, #63EDE8 100%)',
  },
  {
    id: 'neptune',
    label: 'Feral Neptune',
    subtitle: 'Ultraviolet & electric cyan',
    background:
      'radial-gradient(ellipse 78% 60% at 80% 16%, rgba(125, 227, 242, 0.34), transparent 58%), radial-gradient(ellipse 72% 58% at 22% 28%, rgba(94, 65, 234, .48), transparent 60%), linear-gradient(155deg, #1B053C 0%, #401B7C 46%, #0D1B4C 100%)',
    preview: 'linear-gradient(135deg, #1B053C 0%, #5E41EA 52%, #7DE3F2 100%)',
  },
  {
    id: 'cinema',
    label: 'Feral Cinema',
    subtitle: 'Midnight teal & warm amber',
    background:
      'radial-gradient(ellipse 68% 54% at 82% 24%, rgba(255, 159, 69, 0.34), transparent 58%), radial-gradient(ellipse 74% 58% at 54% 38%, rgba(232, 80, 91, 0.38), transparent 60%), linear-gradient(155deg, #041935 0%, #1C1B47 52%, #071936 100%)',
    preview: 'linear-gradient(135deg, #041935 0%, #E8505B 55%, #FF9F45 100%)',
  },
  {
    id: 'aurora',
    label: 'Feral Aurora',
    subtitle: 'Emerald & nocturnal plum',
    background:
      'radial-gradient(ellipse 76% 58% at 22% 20%, rgba(102, 248, 167, 0.3), transparent 58%), radial-gradient(ellipse 72% 60% at 76% 24%, rgba(76, 196, 184, 0.34), transparent 60%), linear-gradient(160deg, #160422 0%, #26032C 48%, #071F26 100%)',
    preview: 'linear-gradient(135deg, #26032C 0%, #4CC4B8 55%, #66F8A7 100%)',
  },
];

export type SystemFontId = 'inter' | 'geist' | 'jakarta';
export type OsLanguage = 'en' | 'id';

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
  trackPlaybackSec: number;
  setTrackPlaybackSec: Dispatch<SetStateAction<number>>;
  trackDurationSec: number;
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
  shuffleTrack: () => void;
  audioRef: RefObject<HTMLAudioElement | null>;
};

export const OsShellContext = createContext<NoteContext | null>(null);
export const WindowFocusContext = createContext<boolean>(true);

export const useOsNote = (): NoteContext => {
  const ctx = useContext(OsShellContext);
  if (!ctx) {
    throw new Error('useOsNote must be used inside <OsShell>');
  }
  return ctx;
};

export const useWindowFocus = (): boolean => useContext(WindowFocusContext);
