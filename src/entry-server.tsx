import { renderToString } from 'react-dom/server';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ThemeProvider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Header } from '@/components/Header';
import { CinematicFooter } from '@/components/ui/motion-footer';
import {
  clearCapturedMeta,
  getCapturedMeta,
  type PageMeta,
} from '@/hooks/usePageMeta';

import Index from './pages/Index';
import About from './pages/About';
import Projects from './pages/Projects';
import ProjectCaseStudy from './pages/ProjectCaseStudy';
import Blog from './pages/Blog';
import Resume from './pages/Resume';

/**
 * Server-side entry used by scripts/prerender.mjs to emit static HTML
 * snapshots for the public routes. Mirrors src/App.tsx but with eager page
 * imports (client keeps code splitting via lazy) and a MemoryRouter.
 * Kept deliberately minimal: dynamic routes (/blog/:id, /admin/*) fall back
 * to the normal SPA shell at request time.
 */
export function renderRoute(path: string) {
  clearCapturedMeta();
  const queryClient = new QueryClient();

  const html = renderToString(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <TooltipProvider>
          <MemoryRouter initialEntries={[path]}>
            <Header />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:slug" element={<ProjectCaseStudy />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/resume" element={<Resume />} />
            </Routes>
            <CinematicFooter />
          </MemoryRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );

  return { html, meta: getCapturedMeta() as PageMeta | null };
}