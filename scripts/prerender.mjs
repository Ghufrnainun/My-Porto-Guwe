#!/usr/bin/env node
/**
 * Static HTML prerenderer.
 *
 * Renders every public route to a static HTML snapshot with:
 *   - per-route <title>, description, canonical, OG/Twitter meta and JSON-LD
 *     (captured from usePageMeta during the server render), and
 *   - the real page markup inside <div id="root">, so crawlers and no-JS
 *     clients see content without executing React.
 *
 * Dynamic routes (/blog/:id, /admin/*) are intentionally left to the SPA
 * fallback in public/_redirects.
 *
 * Run after `vite build` (see package.json "build").
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const SITE_URL = 'https://ghufronainun.tech';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = resolve(root, 'dist');

// Keep network fetches (supabase, remote images) from firing during the
// server render: React Query stays pending and the static snapshot carries
// the loading shells the real page would show without JS.
globalThis.fetch = () => new Promise(() => {});
// src/integrations/supabase/client.ts reads localStorage at module scope;
// supabase-js then only touches storage when auth actually runs (it never
// does during prerender), so an inert Storage stub suffices.
globalThis.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  key: () => null,
  length: 0,
};

// Mirror of scripts/generate-sitemap.mjs route set.
const staticRoutes = ['/', '/about', '/projects', '/blog', '/resume'];
const projectsSource = readFileSync(
  resolve(root, 'src/data/featuredProjects.ts'),
  'utf8'
);
const projectSlugs = [...new Set(
  [...projectsSource.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1])
)];
const routes = [...staticRoutes, ...projectSlugs.map((s) => `/projects/${s}`)];

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function absoluteUrl(path) {
  return /^https?:\/\//.test(path) ? path : `${SITE_URL}${path}`;
}

/** Per-route <head>: retitle + rewrite canonical/OG/Twitter/robots/jsonLd. */
function renderHead(tpl, meta, routePath) {
  const url = meta?.canonicalPath ? `${SITE_URL}${meta.canonicalPath}` : `${SITE_URL}${routePath}`;
  const title = meta?.title ? escapeHtml(meta.title) : null;
  const description = meta?.description ? escapeHtml(meta.description) : null;
  const image = meta?.ogImage ? absoluteUrl(meta.ogImage) : null;

  let out = tpl;
  if (title) {
    out = out.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
    out = out.replace(/(<meta\s+name="title"\s+content=")[^"]*(")/, `$1${title}$2`);
    out = out.replace(/(property="og:title"\s*content=")[^"]*(")/, `$1${title}$2`);
    out = out.replace(/(name="twitter:title"\s*content=")[^"]*(")/, `$1${title}$2`);
  }
  if (description) {
    out = out.replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${description}$2`);
    out = out.replace(/(property="og:description"\s*content=")[^"]*(")/, `$1${description}$2`);
    out = out.replace(/(name="twitter:description"\s*content=")[^"]*(")/, `$1${description}$2`);
  }
  out = out.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);
  out = out.replace(/(property="og:url"\s*content=")[^"]*(")/, `$1${url}$2`);
  out = out.replace(/(name="twitter:url"\s*content=")[^"]*(")/, `$1${url}$2`);
  out = out.replace(/(<meta name="robots" content=")[^"]*(")/, `$1${meta?.noindex ? 'noindex, nofollow' : 'index, follow'}$2`);
  if (image) {
    out = out.replace(/(property="og:image"\s+content=")[^"]*(")/, `$1${image}$2`);
    out = out.replace(/(name="twitter:image"\s+content=")[^"]*(")/, `$1${image}$2`);
  }

  const jsonLd = meta?.jsonLd;
  if (jsonLd) {
    const rawItems = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
    const block = rawItems.map((item) => {
      if (item && typeof item === 'object' && '@context' in item) {
        const { '@context': _, ...rest } = item;
        return rest;
      }
      return item;
    });
    const payload = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': block,
    });
    out = out.replace(
      '</head>',
      `<script id="page-jsonld" type="application/ld+json">${payload}</script>\n  </head>`
    );
  }
  return out;
}

const server = await createServer({
  configFile: resolve(root, 'vite.config.mts'),
  mode: 'production',
  server: { middlewareMode: true, appType: 'custom' },
  logLevel: 'error',
});

try {
  const { renderRoute } = await server.ssrLoadModule('/src/entry-server.tsx');
  const template = readFileSync(resolve(distDir, 'index.html'), 'utf8');
  let count = 0;

  for (const routePath of routes) {
    const { html, meta } = renderRoute(routePath);
    const withHead = renderHead(template, meta, routePath);
    // Replace the entire #root container (and any dev preloader/noscript stub)
    // with the clean server-rendered markup right before </body>.
    const final = withHead.replace(
      /<div id="root">[\s\S]*?(?=\s*<\/body>)/,
      `<div id="root">\n${html}\n    </div>`
    );

    const outPath =
      routePath === '/'
        ? resolve(distDir, 'index.html')
        : resolve(distDir, routePath.slice(1), 'index.html');
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, final, 'utf8');
    count += 1;
  }

  console.log(`[prerender] wrote ${count} static pages -> ${distDir}`);
} finally {
  await server.close();
}