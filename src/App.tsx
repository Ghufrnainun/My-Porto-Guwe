import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import ProtectedRoute from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import LoadingScreen from '@/components/LoadingScreen';
import ScrollToTop from '@/components/ScrollToTop';
import { AnimatePresence } from 'framer-motion';
import React from 'react';

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AnimatePresence mode="wait">
              {isLoading ? (
                <LoadingScreen
                  key="loading"
                  onLoadingComplete={() => setIsLoading(false)}
                />
              ) : (
                <BrowserRouter
                  future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                  }}
                >
                  <ScrollToTop />
                  <ErrorBoundary>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/projects" element={<Projects />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/blog/:id" element={<BlogPost />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/resume" element={<Resume />} />

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
                  </ErrorBoundary>
                </BrowserRouter>
              )}
            </AnimatePresence>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
