import { featuredProjects } from '@/data/featuredProjects';
import { githubFallbackContributions } from '@/data/githubActivity';
import { certifications, education, organizationExperience, profile, skillTiers } from '@/data/profile';
import { sideProjects, type SideProject } from '@/data/sideProjects';
import type { BuildingKind, HeroCopy, ProjectStop, Stop, StoryRow, StoryStop, TownColor } from './types';

export const TOWN_HEX: Record<TownColor, string> = {
  blue: '#1f3bff',
  yellow: '#ffd60a',
  pink: '#ff8fc7',
  green: '#19b866',
  red: '#ff4a2b',
};

/**
 * Story circles at night: a deep version of the district colour behind text in a bright version of it.
 * Every pair passes 4.5:1 (yellow 12, red 6.6, pink 7.6, green 6, blue 15). Same districts as the night ground.
 */
export const TOWN_NIGHT_PANEL: Record<TownColor, string> = {
  blue: '#0f1645',
  yellow: '#2b2006',
  pink: '#2e0e24',
  green: '#06291a',
  red: '#2e0d08',
};
export const TOWN_NIGHT_TEXT: Record<TownColor, string> = {
  blue: '#f3f1ea',
  yellow: '#ffd60a',
  pink: '#ff9fd0',
  green: '#3fd68a',
  red: '#ff8a70',
};

/** "Semarang State Polytechnic (Polines)" → ["Semarang State Polytechnic", "Polines"] */
const splitShortName = (full: string): [string, string] => {
  const m = full.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  return m ? [m[1], m[2]] : [full, full];
};

const [universityName, universityShort] = splitShortName(education.university);
const gpa = education.gpa.split('/')[0];

/* ---- projects: what the data cannot say (short name, one-line pitch, place in town) ---- */
interface ProjectPlace {
  name: string;
  summary: string;
  building: BuildingKind;
  side: -1 | 1;
  color: TownColor;
}

const PLACES: Record<string, ProjectPlace> = {
  pbundip: {
    name: 'PB Undip',
    summary: "Club portal and real-time tournament scoreboard for Undip's badminton club.",
    building: 'pbundip',
    side: -1,
    color: 'yellow',
  },
  'tempe-mail': {
    name: 'TempeMail',
    summary: 'Disposable email that runs entirely on Cloudflare Workers, with a REST API, webhooks and MCP.',
    building: 'tempe-mail',
    side: 1,
    color: 'pink',
  },
  'curated-design': {
    name: 'Curated Design',
    summary: 'A curated directory of design resources for AI coding, kept in plain markdown.',
    building: 'curated-design',
    side: 1,
    color: 'green',
  },
  sewainaja: {
    name: 'SewaInAja',
    summary: 'A rental platform: a Flutter mobile app plus a Next.js admin and API.',
    building: 'sewainaja',
    side: -1,
    color: 'red',
  },
  'lsp-polines': {
    name: 'LSP Polines',
    summary: 'A certification website built with a five-person team I led.',
    building: 'lsp-polines',
    side: -1,
    color: 'yellow',
  },
  'impp-website': {
    name: 'IMPP',
    summary: 'The public website and CMS for Ikatan Mahasiswa Pemalang Polines.',
    building: 'impp-website',
    side: 1,
    color: 'pink',
  },
};

const PROJECT_TITLE = ['Six things', 'shipped.'] as const;

const projectStops: ProjectStop[] = featuredProjects.map((p, i) => {
  const place = PLACES[p.slug];
  return {
    kind: 'project',
    district: 'Jl. Project',
    title: PROJECT_TITLE,
    building: place?.building ?? 'none',
    side: place?.side ?? -1,
    slug: p.slug,
    number: String(i + 1).padStart(2, '0'),
    name: place?.name ?? p.title,
    summary: place?.summary ?? p.summary,
    role: p.role,
    year: p.year,
    stack: p.technologies.slice(0, 4),
    color: place?.color ?? 'yellow',
    liveUrl: p.demo,
    repoUrl: p.repository,
    image: p.image,
    why: p.why,
    did: p.contributions.slice(0, 2),
    results: p.outcomes.slice(0, 2),
  };
});

/* ---- story stops ---- */
const side = (start: string): SideProject | undefined => sideProjects.find((s) => s.title.startsWith(start));

const sideRow = (p: SideProject | undefined, label: string, detail: string, note: string): StoryRow[] =>
  p ? [{ label, detail, note, href: p.demo ?? p.github }] : [];

/** One plain line each: the data's own descriptions were written for the old case-study pages and read as a spec sheet here. */
const SIDE_NOTE = {
  cepat: 'Matches students with small businesses within 2 km for freelance work, with bidding, escrow and chat.',
  mapContour: 'A web map for viewing and inspecting terrain contour data.',
  netra: 'Reads Rupiah banknotes out loud for people who cannot see them.',
  weather: 'A weather station that sends readings over LoRa and forecasts with a Random Forest model.',
};

const cepat = side('CEPAT');
const mapContour = side('Web Map Contour');
const netra = side('NetraSense');
const weather = side('Weather Prediction');

const story = (s: Omit<StoryStop, 'kind' | 'side'>): StoryStop => ({ kind: 'story', side: -1, ...s });

const start = story({
  id: 'start',
  district: 'Start',
  title: ['Start', 'here.'],
  building: 'start',
  color: 'yellow',
  kicker: 'about',
  heading: "Hi, I'm *Ghufron.*",
  body: 'I build websites and the systems under them. Mostly alone, sometimes leading a team. Every block along the road is one day of my GitHub year: the taller and darker blue it stands, the more I committed that day.',
});

const sideAlley = story({
  id: 'side-alley',
  district: 'Gg. Side Alley',
  title: ['Side', 'alley.'],
  building: 'side-alley',
  color: 'red',
  kicker: 'smaller builds',
  heading: 'Built *on the side.*',
  rows: [
    ...sideRow(cepat, 'CEPAT', cepat?.badge?.label ?? cepat?.year ?? '', SIDE_NOTE.cepat),
    ...sideRow(mapContour, 'Web Map Contour', mapContour?.technologies.slice(0, 2).join(' · ') ?? '', SIDE_NOTE.mapContour),
  ],
});

const campus = story({
  id: 'campus',
  district: 'Jl. Kampus',
  title: ['Still in', 'school.'],
  building: 'campus',
  color: 'pink',
  kicker: `${universityShort} · semester ${profile.semester}`,
  heading: `GPA *${gpa}.*`,
  body: `${education.degree} at ${universityName}, ${education.period.replace(' - ', ' to ')}.`,
  rows: organizationExperience.map((o) => ({
    label: `${splitShortName(o.organization)[1]} · ${o.role}`,
    detail: o.period,
    note: o.responsibilities[0],
  })),
});

const certificates = story({
  id: 'certificates',
  district: 'Jl. Kampus',
  title: ['On', 'paper.'],
  building: 'certificates',
  color: 'blue',
  kicker: 'certificates',
  heading: 'Five on *paper.*',
  body: "The two MikroTik ones can be checked on MikroTik's own site.",
  rows: certifications.map((c) => ({
    label: c.title,
    detail: `${c.issuer} · ${c.year}`,
    note: [c.credentialId && `ID ${c.credentialId}`, c.score && `Score ${c.score}`].filter(Boolean).join(' · ') || undefined,
    href: c.verificationUrl,
  })),
});

const aiSite = story({
  id: 'ai-site',
  district: 'Jl. AI Site',
  title: ['Under', 'construction.'],
  building: 'ai-site',
  color: 'green',
  kicker: 'learning',
  heading: 'Learning how machines *think.*',
  body: 'Not an AI engineer yet. Two things built so far:',
  rows: [
    ...sideRow(netra, 'NetraSense', netra?.category ?? '', SIDE_NOTE.netra),
    ...sideRow(
      weather,
      'Weather Prediction',
      weather?.category ?? '',
      SIDE_NOTE.weather,
    ),
  ],
});

export const STOPS: readonly Stop[] = [
  start,
  ...projectStops,
  sideAlley,
  campus,
  certificates,
  aiSite,
  { kind: 'gate', district: 'Bukit', title: ['Almost', 'there.'], building: 'none', side: -1 },
  { kind: 'end', district: 'End', title: ['', ''], building: 'none', side: -1 },
];

export const PROJECTS: readonly ProjectStop[] = projectStops;

export const HERO: HeroCopy = {
  kicker: 'PORTFOLIO · FULLSTACK DEVELOPER · SEMARANG',
  lines: [profile.name, 'builds the whole thing.'],
  body: ['Front to back, usually solo. Open to internships, freelance and project work.', 'Now learning how AI actually works.'],
};

/* ---- billboards: real skill names only ---- */
const known = new Set(skillTiers.flatMap((t) => t.skills.map((s) => s.name)));
const board = (names: string[]) =>
  names
    .filter((n) => known.has(n))
    .join(' · ')
    .toUpperCase();

export const BILLBOARDS: readonly string[] = [
  board(['TypeScript', 'React', 'Next.js']),
  board(['Laravel', 'Node.js', 'PostgreSQL']),
  board(['Flutter', 'Supabase', 'Convex']),
].filter(Boolean);

export const EMAIL = profile.email;
export const OWNER = profile.name;

export interface EndLink {
  label: string;
  href: string;
  /** In-app route (react-router) rather than an outside site. */
  internal?: boolean;
}

export const END_LINKS: readonly EndLink[] = [
  { label: 'resume', href: '/resume', internal: true },
  { label: 'blog', href: '/blog', internal: true },
  { label: 'github', href: profile.github },
  { label: 'linkedin', href: profile.linkedin },
];

/** One line of facts for the "All work" footer. */
export const FACTS: readonly string[] = [
  `${universityShort} · GPA ${gpa}`,
  `${certifications.length} certificates`,
  ...(cepat?.badge ? [cepat.badge.label] : []),
];

/** Commits per day for the last year, oldest first. */
export const COMMITS: readonly number[] = githubFallbackContributions.map((d) => d.count);

/** "https://pbundip.web.id/" → "pbundip.web.id" */
export const hostOf = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');
