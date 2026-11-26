export type OnDemandFontGroup = 'inter' | 'geist' | 'town' | 'editorial';

const FONT_STYLESHEETS: Record<OnDemandFontGroup, string> = {
  inter: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  geist: 'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap',
  town: 'https://fonts.googleapis.com/css2?family=Anton&family=Instrument+Serif:ital@1&family=Schibsted+Grotesk:wght@400;600&display=swap',
  editorial:
    'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Space+Grotesk:wght@400;500;600&display=swap',
};

const loadedGroups = new Set<OnDemandFontGroup>();

/** Injects non-critical Google Font families on demand once per group. */
export function ensureFontGroup(group: OnDemandFontGroup): void {
  if (typeof document === 'undefined' || loadedGroups.has(group)) return;
  loadedGroups.add(group);

  const existing = document.head.querySelector(`link[data-font-group="${group}"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = FONT_STYLESHEETS[group];
  link.setAttribute('data-font-group', group);
  document.head.appendChild(link);
}
