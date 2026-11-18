import { renderToString } from 'react-dom/server';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ThemeProvider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { OsShell } from '@/components/os/OsShell';
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
import BlogPost from './pages/BlogPost';
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
  const routePath = path.split('?')[0];
  const appName = routePath.startsWith('/projects') ? 'Projects' : routePath.startsWith('/blog') ? 'Writing' : routePath === '/resume' ? 'Resume' : routePath === '/about' ? 'About' : 'Finder';

  const html = renderToString(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <TooltipProvider>
          <MemoryRouter initialEntries={[path]}>
            <OsShell appName={appName} mode={routePath === '/' ? 'desktop' : 'window'} lockScreen={routePath === '/'}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:slug" element={<ProjectCaseStudy />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogPost />} />
                <Route path="/resume" element={<Resume />} />
              </Routes>
            </OsShell>
          </MemoryRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );

  return { html, meta: getCapturedMeta() as PageMeta | null };
}
