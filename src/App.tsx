import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/hooks/useAuth';
import Index from './pages/Index';
import About from './pages/About';
import Projects from './pages/Projects';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';
import PostEditor from './pages/PostEditor';
import NotFound from './pages/NotFound';
import Resume from './pages/Resume';
import ProjectSectionPreview from './pages/ProjectSectionPreview';
import TestAnimate from './pages/TestAnimate';
import ProtectedRoute from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import LoadingScreen from '@/components/LoadingScreen';
import ScrollToTop from '@/components/ScrollToTop';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { InteractiveBackground } from '@/components/InteractiveBackground';
import { CursorFollower } from '@/components/CursorFollower';
import { useDelight } from '@/hooks/useDelight';
import React from 'react';

const queryClient = new QueryClient();

const AnimatedAppContent = ({
  isLoading,
  setIsLoading,
}: {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}) => {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <LoadingScreen
          key="loading"
          onLoadingComplete={() => setIsLoading(false)}
        />
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full min-h-screen"
        >
          <ScrollToTop />
          <ErrorBoundary>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={location.pathname}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -15 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0.15 }
                    : { duration: 0.42, ease: [0.22, 1, 0.36, 1] }
                }
                className="w-full"
              >
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:id" element={<BlogPost />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/resume" element={<Resume />} />
                  <Route path="/test-animate" element={<TestAnimate />} />
                  <Route
                    path="/project-section-preview"
                    element={<ProjectSectionPreview />}
                  />

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
              </motion.div>
            </AnimatePresence>
          </ErrorBoundary>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  useDelight();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <TooltipProvider>
            <InteractiveBackground />
            <CursorFollower />
            <div className="noise-overlay" />
            <Toaster />
            <Sonner />
            <BrowserRouter
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
              <AnimatedAppContent isLoading={isLoading} setIsLoading={setIsLoading} />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
