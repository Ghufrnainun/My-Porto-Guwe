import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/hooks/useAuth';
import Index from './pages/Index';
import ProtectedRoute from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import ScrollToTop from '@/components/ScrollToTop';
import { Header } from '@/components/Header';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { InteractiveBackground } from '@/components/InteractiveBackground';
import { useDelight } from '@/hooks/useDelight';
import { useAnalytics } from '@/hooks/useAnalytics';
import React, { lazy, Suspense, useEffect } from 'react';
import { CinematicFooter } from '@/components/ui/motion-footer';
import { lazyWithRetry } from '@/lib/lazyWithRetry';
import { AppPreloader } from '@/components/AppPreloader';

const About = lazyWithRetry(() => import('./pages/About'), 'About');
const Projects = lazyWithRetry(() => import('./pages/Projects'), 'Projects');
const ProjectCaseStudy = lazyWithRetry(() => import('./pages/ProjectCaseStudy'), 'ProjectCaseStudy');
const Blog = lazyWithRetry(() => import('./pages/Blog'), 'Blog');
const BlogPost = lazyWithRetry(() => import('./pages/BlogPost'), 'BlogPost');
const Auth = lazyWithRetry(() => import('./pages/Auth'), 'Auth');
const AdminDashboard = lazyWithRetry(() => import('./pages/AdminDashboard'), 'AdminDashboard');
const PostEditor = lazyWithRetry(() => import('./pages/PostEditor'), 'PostEditor');
const NotFound = lazyWithRetry(() => import('./pages/NotFound'), 'NotFound');
const Resume = lazyWithRetry(() => import('./pages/Resume'), 'Resume');
const TestAnimate = lazyWithRetry(() => import('./pages/TestAnimate'), 'TestAnimate');
const HeroPreview = lazyWithRetry(() => import('./pages/HeroPreview'), 'HeroPreview');

const queryClient = new QueryClient();

const AnimatedAppContent = () => {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  // SPA route change → send GA4 page_view (gtag doesn't auto-track client routing)
  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: location.pathname,
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }, [location.pathname]);

  return (
    // NOTE: overflow-x-hidden is on this wrapper (not on <main>)
    <div className="relative w-full bg-background min-h-screen font-sans selection:bg-white/20 overflow-x-hidden">
      <main className="relative z-10 w-full min-h-screen bg-transparent border-b border-border shadow-md rounded-b-3xl pb-20">
        <ScrollToTop />
        <Header />
        <ErrorBoundary>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <Suspense fallback={null}>
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<Index />} />
                  <Route path="/overview" element={<Navigate to="/" replace />} />
                  <Route path="/home" element={<Navigate to="/" replace />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/projects" element={<Projects />} />
                  {/* Direct Layout Variant Routes */}
                  <Route path="/1" element={<Navigate to="/projects?v=1" replace />} />
                  <Route path="/2" element={<Navigate to="/projects?v=2" replace />} />
                  <Route path="/3" element={<Navigate to="/projects?v=3" replace />} />
                  <Route path="/projects/1" element={<Navigate to="/projects?v=1" replace />} />
                  <Route path="/projects/2" element={<Navigate to="/projects?v=2" replace />} />
                  <Route path="/projects/3" element={<Navigate to="/projects?v=3" replace />} />
                  <Route path="/projects/:slug" element={<ProjectCaseStudy />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:id" element={<BlogPost />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/resume" element={<Resume />} />
                  <Route path="/test-animate" element={<TestAnimate />} />
                  <Route path="/preview-preloader-boot" element={<div className="min-h-screen"><AppPreloader><div className="pt-32 text-center text-xl font-mono text-foreground">Boot complete!</div></AppPreloader></div>} />
                  <Route path="/preview-hero/a" element={<HeroPreview variant="a" label="Variant A — Prism Angle" />} />
                  <Route path="/preview-hero/b" element={<HeroPreview variant="b" label="Variant B — Topology Bolt" />} />
                  <Route path="/preview-hero/c" element={<HeroPreview variant="c" label="Variant C — Eclipse Horizon" />} />
                  <Route path="/preview-hero/d" element={<HeroPreview variant="d" label="Variant D — Compass Orbit" />} />
                  {/* Protected Admin Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route
                      path="/admin/posts/:id"
                      element={<PostEditor />}
                    />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </ErrorBoundary>
      </main>
      <CinematicFooter />
    </div>
  );
};

const App = () => {
  useDelight();
  useAnalytics();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <AuthProvider>
          <TooltipProvider>
            <InteractiveBackground />
            <div className="noise-overlay" />
            <Toaster />
            <Sonner />
            <BrowserRouter
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
              <AnimatedAppContent />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
