import { useEffect } from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { HeroBackground } from '@/components/HeroBackground';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <section className="cinematic-footer-wrapper relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 pb-20 pt-28 text-foreground">
      <HeroBackground />
      <div className="footer-aurora pointer-events-none absolute left-1/2 top-1/2 z-0 h-[52vh] w-[76vw] -translate-x-1/2 -translate-y-1/2 rounded-[50%] blur-[80px]" />
      <div className="footer-bg-grid pointer-events-none absolute inset-0 z-0" />

      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center text-center">
        <p className="mb-5 font-mono text-xs font-semibold uppercase tracking-[0.45em] text-muted-foreground">
          Route not found
        </p>
        <h1 className="footer-text-glow text-[34vw] font-black leading-[0.78] tracking-tight sm:text-[24vw] lg:text-[15rem]">
          404
        </h1>
        <div className="mt-8 max-w-2xl space-y-4">
          <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-5xl">
            Page slipped off the grid.
          </h2>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            The path <span className="font-mono text-foreground/80">{location.pathname}</span> does not exist. Head back to the portfolio or return to the previous page.
          </p>
        </div>

        <div className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <Link
            to="/"
            className="glass-pill-primary inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-bold outline-none transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto"
          >
            <Home className="size-4" aria-hidden="true" />
            Back to Overview
          </Link>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="glass-pill inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-bold text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Go Back
          </button>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
