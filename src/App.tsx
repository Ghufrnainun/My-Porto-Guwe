import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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
import React, { lazy, Suspense } from 'react';

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

const queryClient = new QueryClient();

const AnimatedAppContent = () => {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      key="content"
      initial={{ opacity: 1 }}
      className="w-full min-h-screen"
    >
      <ScrollToTop />
      <Header />
      <ErrorBoundary>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -15, filter: 'blur(4px)' }}
            transition={
              shouldReduceMotion
                ? { duration: 0.15 }
                : { duration: 0.5, ease: [0.32, 0.72, 0, 1] }
            }
            className="w-full"
          >
            <Suspense fallback={null}>
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:slug" element={<ProjectCaseStudy />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogPost />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/resume" element={<Resume />} />
                <Route path="/test-animate" element={<TestAnimate />} />
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
    </motion.div>
  );
};

const App = () => {
  useDelight();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
