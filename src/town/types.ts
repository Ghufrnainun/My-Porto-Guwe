/**
 * Contract between the three parts of the town page.
 *   content.ts  builds STOPS from src/data
 *   world/      draws the 3D town from numbers, owns no text of its own
 *   ui/         shows the DOM for the active stop
 * Change this file only together with every part that reads it.
 */

export type TownColor = 'blue' | 'yellow' | 'pink' | 'green' | 'red';

/** Which 3D building stands at a stop. One per stop, in STOPS order. */
export type BuildingKind =
  | 'start'
  | 'pbundip'
  | 'tempe-mail'
  | 'curated-design'
  | 'sewainaja'
  | 'lsp-polines'
  | 'impp-website'
  | 'side-alley'
  | 'campus'
  | 'certificates'
  | 'ai-site'
  | 'none';

interface StopBase {
  /** District name shown in the top label and on street signs, e.g. "Jl. Project". */
  district: string;
  /** Two-line scene title, second line set in italic. Empty strings hide it. */
  title: readonly [string, string];
  building: BuildingKind;
  /** -1 = building left of the road, 1 = right. Story stops are always -1. */
  side: -1 | 1;
}

export interface StoryRow {
  label: string;
  detail: string;
  /** Optional third line under the row, e.g. a period or credential id. */
  note?: string;
  href?: string;
}

/** A stop that is read: the colour circle. */
export interface StoryStop extends StopBase {
  kind: 'story';
  id: string;
  color: TownColor;
  kicker: string;
  /** Heading; wrap the accent word(s) in *asterisks* to set them in italic serif. */
  heading: string;
  body?: string;
  rows?: readonly StoryRow[];
}

/** A stop that is opened: the project card. */
export interface ProjectStop extends StopBase {
  kind: 'project';
  slug: string;
  number: string;
  name: string;
  summary: string;
  role: string;
  year: string;
  stack: readonly string[];
  color: TownColor;
  /** Live site, when one exists. Shown on the card, the project sheet and the plain list. */
  liveUrl?: string;
  repoUrl?: string;
  image?: string;
  /** Screen recording for the building's screen. Absent = "no signal". */
  video?: string;
  /** Why it is built this way. Only where there is a real reason to tell. */
  why?: string;
  did: readonly string[];
  results: readonly string[];
}

export interface GateStop extends StopBase {
  kind: 'gate';
}

export interface EndStop extends StopBase {
  kind: 'end';
}

export type Stop = StoryStop | ProjectStop | GateStop | EndStop;

/** Everything the world needs each frame. No DOM, no React. */
export interface WorldFrame {
  /** Seconds since the previous frame, already clamped. */
  dt: number;
  /** 0 = hero (straight down on the blue page), 1 = town. */
  heroProgress: number;
  /** Position along the tour in stop units, 0..STOPS.length-1. */
  tour: number;
  mode: 'tour' | 'drive';
  /** Held keys while driving. */
  keys: { forward: boolean; back: boolean; left: boolean; right: boolean };
  /** 0 = day, 1 = night. The world eases towards it by itself. */
  night: 0 | 1;
}

export interface World {
  update(frame: WorldFrame): void;
  resize(width: number, height: number): void;
  /** Screen position (CSS px) of a stop's building, for the card's fly-out origin. */
  project(stopIndex: number): { x: number; y: number };
  /** Tour position nearest to the car right now. Used when leaving drive mode. */
  nearestTour(): number;
  /** False after the frame rate stayed low and quality was reduced. */
  readonly healthy: boolean;
  dispose(): void;
}

export interface WorldOptions {
  canvas: HTMLCanvasElement;
  stops: readonly Stop[];
  /** Commits per day for the last year, oldest first. One city block per day. */
  commits: readonly number[];
  /** Painted on the blue page the car starts on. */
  hero: HeroCopy;
  /** Stack groups for the roadside billboards, e.g. "TYPESCRIPT · REACT · NEXT.JS". */
  billboards: readonly string[];
  reducedMotion: boolean;
}

export interface HeroCopy {
  kicker: string;
  /** Two display lines: the first in Anton, the second in italic serif. */
  lines: readonly [string, string];
  body: readonly string[];
}

export type CreateWorld = (options: WorldOptions) => World;
