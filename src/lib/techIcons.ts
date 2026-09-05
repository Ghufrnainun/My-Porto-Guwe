export interface TechInfo {
  cleanName: string;
  slug?: string;
  lucideIcon?: 'credit-card' | 'database' | 'code' | 'layers';
  color: string;
}

const TECH_MAP: Record<string, Omit<TechInfo, 'cleanName'>> = {
  // Frontend & Languages
  javascript: { slug: 'javascript', color: '#F7DF1E' },
  typescript: { slug: 'typescript', color: '#3178C6' },
  react: { slug: 'react', color: '#61DAFB' },
  'next.js': { slug: 'nextjs', color: '#E2E8F0' },
  nextjs: { slug: 'nextjs', color: '#E2E8F0' },
  'tailwind css': { slug: 'tailwindcss', color: '#06B6D4' },
  tailwindcss: { slug: 'tailwindcss', color: '#06B6D4' },
  html: { slug: 'html5', color: '#E34F26' },
  html5: { slug: 'html5', color: '#E34F26' },
  css: { slug: 'css', color: '#1572B6' },
  css3: { slug: 'css3', color: '#1572B6' },

  // Mobile
  flutter: { slug: 'flutter', color: '#02569B' },
  dart: { slug: 'dart', color: '#0175C2' },

  // Backend & DB
  laravel: { slug: 'laravel', color: '#FF2D20' },
  livewire: { slug: 'livewire', color: '#FB70A9' },
  php: { slug: 'php', color: '#777BB4' },
  python: { slug: 'python', color: '#3776AB' },
  'node.js': { slug: 'nodejs', color: '#5FA04E' },
  nodejs: { slug: 'nodejs', color: '#5FA04E' },
  mysql: { slug: 'mysql', color: '#4479A1' },
  postgresql: { slug: 'postgresql', color: '#4169E1' },
  sql: { slug: 'mysql', color: '#4479A1' },
  supabase: { slug: 'supabase', color: '#3ECF8E' },
  firebase: { slug: 'firebase', color: '#FFCA28' },
  convex: { slug: 'convex', color: '#F97316' },

  // Cloud & Edge
  'cloudflare workers': { slug: 'cloudflare-workers', color: '#F38020' },
  'cloudflare-workers': { slug: 'cloudflare-workers', color: '#F38020' },
  cloudflare: { slug: 'cloudflare', color: '#F38020' },
  hono: { slug: 'hono', color: '#E36002' },
  d1: { slug: 'cloudflare', color: '#F38020' },

  // Payments / Services
  midtrans: { lucideIcon: 'credit-card', color: '#00529C' },

  // Tools & Workflow
  git: { slug: 'git', color: '#F05032' },
  github: { slug: 'github', color: '#E2E8F0' },
  docker: { slug: 'docker', color: '#2496ED' },
  figma: { slug: 'figma', color: '#F24E1E' },
};

/**
 * Normalizes tech name (e.g. "Next.js 16" -> "Next.js", "TypeScript 5" -> "TypeScript")
 * and resolves its icon slug/color.
 */
export function getTechInfo(tech: string): TechInfo {
  const normalized = tech.trim();
  // Strip version numbers like " 16", " 5", " v2" for mapping
  const baseKey = normalized
    .replace(/\s+\d+(\.\d+)*$/i, '')
    .toLowerCase();

  const found = TECH_MAP[baseKey] || TECH_MAP[normalized.toLowerCase()];

  if (found) {
    return {
      cleanName: normalized,
      ...found,
    };
  }

  // Fallback if tech not in dictionary
  return {
    cleanName: normalized,
    lucideIcon: 'code',
    color: '#38bdf8',
  };
}

/**
 * Returns the Reicon Brand Logo CDN URL (official full-color vector SVG).
 */
export function getReiconLogoUrl(slug: string, variant: 'original' | 'monochrome' = 'original'): string {
  return `https://cdn.reicon.dev/logos/${slug}/${variant}.svg`;
}

/**
 * Alias for backward compatibility. Defaults to Reicon official logo CDN.
 */
export function getSimpleIconUrl(slug: string, color?: string): string {
  return getReiconLogoUrl(slug, 'original');
}
