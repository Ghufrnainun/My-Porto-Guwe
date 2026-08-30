import { useEffect } from 'react';

const SITE_URL = 'https://ghufronainun.tech';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
const SITE_NAME = 'Ghufron Ainun Portfolio';

export interface PageMeta {
  /** Page title (50-60 chars ideal) */
  title: string;
  /** Meta description (150-160 chars ideal) */
  description?: string;
  /** Path portion of the canonical URL, e.g. '/about' */
  canonicalPath?: string;
  /** Open Graph type */
  ogType?: 'website' | 'article';
  /** Absolute URL of the social share image */
  ogImage?: string;
  /** Additional JSON-LD structured data objects (schema.org) */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  /** Set true to keep page out of search index (admin, auth, test routes) */
  noindex?: boolean;
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

const JSON_LD_ID = 'page-jsonld';

function upsertJsonLd(data: Record<string, unknown> | Record<string, unknown>[]) {
  let el = document.getElementById(JSON_LD_ID) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.id = JSON_LD_ID;
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(Array.isArray(data) ? data : [data]);
}

/**
 * Declarative per-route SEO meta. Call once at the top of each page component.
 * Updates title, description, canonical, Open Graph, Twitter Card, robots
 * directive and JSON-LD structured data without a full page reload.
 */
export function usePageMeta(meta: PageMeta) {
  // Serialize so effect re-runs when jsonLd contents change (e.g. async post load)
  const jsonLdKey = meta.jsonLd ? JSON.stringify(meta.jsonLd) : '';

  useEffect(() => {
    const url = `${SITE_URL}${meta.canonicalPath ?? ''}`;
    const description = meta.description ?? '';
    const image = meta.ogImage ?? DEFAULT_OG_IMAGE;

    document.title = meta.title;
    upsertMeta('name', 'title', meta.title);
    if (description) upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', meta.noindex ? 'noindex, nofollow' : 'index, follow');

    upsertCanonical(url);

    upsertMeta('property', 'og:type', meta.ogType ?? 'website');
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:title', meta.title);
    if (description) upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:image', image);
    upsertMeta('property', 'og:site_name', SITE_NAME);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:url', url);
    upsertMeta('name', 'twitter:title', meta.title);
    if (description) upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', image);

    if (meta.jsonLd) {
      upsertJsonLd(meta.jsonLd);
    } else {
      document.getElementById(JSON_LD_ID)?.remove();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.title, meta.description, meta.canonicalPath, meta.ogType, meta.ogImage, meta.noindex, jsonLdKey]);
}

export const seoConstants = { SITE_URL, DEFAULT_OG_IMAGE, SITE_NAME };
