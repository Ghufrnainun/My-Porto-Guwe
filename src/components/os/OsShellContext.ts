import { createContext, useContext, type Dispatch, type SetStateAction } from 'react';

export type WallpaperId =
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
      'radial-gradient(ellipse 78% 60% at 80% 16%, rgba(125, 227, 242, 0.34), transparent 58%), radial-gradient(ellipse 72% 58% at 22% 28%, rgba(94, 65, 234, 0.48), transparent 60%), linear-gradient(155deg, #1B053C 0%, #401B7C 46%, #0D1B4C 100%)',
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
  isDark: boolean;
  brightness: number;
  setBrightness: (value: number) => void;
  openApp: (id: OsAppId, payload?: string) => void;
  settingsPane: SettingsPaneId;
  setSettingsPane: (pane: SettingsPaneId) => void;
  power: OsPowerState;
  setPower: (power: OsPowerState) => void;
  isFocused: boolean;
};

export const OsShellContext = createContext<NoteContext | null>(null);
export const WindowFocusContext = createContext<boolean>(true);

export const useOsNote = () => {
  const context = useContext(OsShellContext);
  if (!context) throw new Error('useOsNote must be used inside OsShell');
  return context;
};

export const useWindowFocus = () => useContext(WindowFocusContext);
