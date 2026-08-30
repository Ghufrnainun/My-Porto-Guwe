#!/usr/bin/env node
/**
 * Static sitemap generator.
 *
 * Reads the canonical route set plus every featured-project case-study slug
 * straight from source, then writes public/sitemap.xml. Blog post URLs are
 * intentionally omitted for now because the Supabase project is paused — when
 * it comes back online, fetch published posts here and append /blog/<slug>.
 *
 * Run automatically as part of `npm run build` (see package.json).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_URL = 'https://ghufronainun.tech';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Routes that always exist and should be indexed.
const staticRoutes = [
  { path: '/', changefreq: 'monthly', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.8' },
  { path: '/projects', changefreq: 'monthly', priority: '0.8' },
  { path: '/blog', changefreq: 'weekly', priority: '0.7' },
  { path: '/resume', changefreq: 'monthly', priority: '0.6' },
];

// Pull project slugs from source so case-study pages stay in sync automatically.
const projectsSource = readFileSync(
  resolve(root, 'src/data/featuredProjects.ts'),
  'utf8'
);
const projectSlugs = [...projectsSource.matchAll(/slug:\s*'([^']+)'/g)].map(
  (match) => match[1]
);

const projectRoutes = projectSlugs.map((slug) => ({
  path: `/projects/${slug}`,
  changefreq: 'monthly',
  priority: '0.8',
}));

// TODO(supabase): when the Supabase project is unpaused, fetch published
// blog posts and push { path: `/blog/${post.slug}`, ... } entries here so
// individual articles get indexed.

const today = new Date().toISOString().slice(0, 10);
const routes = [...staticRoutes, ...projectRoutes];

const urlEntries = routes
  .map(
    (route) => `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;

const outPath = resolve(root, 'public/sitemap.xml');
writeFileSync(outPath, sitemap, 'utf8');
console.log(
  `[sitemap] wrote ${routes.length} URLs (${staticRoutes.length} static + ${projectRoutes.length} projects) -> public/sitemap.xml`
);
