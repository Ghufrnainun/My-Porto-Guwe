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
import { AppPreloader } from '@/components/AppPreloader';

const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectCaseStudy = lazy(() => import('./pages/ProjectCaseStudy'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Auth = lazy(() => import('./pages/Auth'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const PostEditor = lazy(() => import('./pages/PostEditor'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Resume = lazy(() => import('./pages/Resume'));
const TestAnimate = lazy(() => import('./pages/TestAnimate'));
const HeroPreview = lazy(() => import('./pages/HeroPreview'));

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
                  <Route path="/projects/:slug" element={<ProjectCaseStudy />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:id" element={<BlogPost />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/resume" element={<Resume />} />
                  <Route path="/test-animate" element={<TestAnimate />} />
                  <Route path="/hero-a" element={<HeroPreview variant="a" label="A / volumetric spotlight" />} />
                  <Route path="/hero-b" element={<HeroPreview variant="b" label="B / liquid caustics" />} />
                  <Route path="/hero-c" element={<HeroPreview variant="c" label="C / gradient field" />} />
                  <Route path="/hero-d" element={<HeroPreview variant="d" label="D / orbital halos" />} />
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
              <AppPreloader>
                <AnimatedAppContent />
              </AppPreloader>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
