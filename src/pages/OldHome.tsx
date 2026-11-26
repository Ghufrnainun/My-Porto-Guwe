import { useEffect } from 'react';
import { Hero } from '@/components/Hero';
import { AboutPreview } from '@/components/AboutPreview';
import { Skills } from '@/components/Skills';
import { ProjectsPreview } from '@/components/ProjectsPreview';
import { BlogPreview } from '@/components/BlogPreview';
import { HomeCanvas } from '@/components/HomeCanvas';
import { usePageMeta } from '@/hooks/usePageMeta';
import { ensureFontGroup } from '@/lib/loadFont';

const OldHome = () => {
  useEffect(() => {
    ensureFontGroup('editorial');
  }, []);
  usePageMeta({
    title: 'Ghufron Ainun Najib | Legacy Portfolio',
    description:
      'Full-stack developer in Semarang, Indonesia. TypeScript, React, Node.js, Cloudflare Workers, Flutter, Laravel, PostgreSQL — web products built end to end.',
    canonicalPath: '/old',
    noindex: true,
  });

  return (
    <HomeCanvas>
      <div className="relative h-screen w-full" style={{ clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}>
        <section id="hero" className="fixed top-0 left-0 w-full h-screen z-0">
          <Hero />
        </section>
      </div>

      <main className="relative z-10 home-sections bg-background rounded-t-[2.5rem] shadow-[0_-30px_60px_-15px_rgba(0,0,0,0.8)] -mt-16 border-t border-border/50">
        <div className="home-panel pt-8">
          <AboutPreview />
        </div>
        <div className="home-panel">
          <Skills />
        </div>
        <div className="home-panel home-panel-feature">
          <ProjectsPreview />
        </div>
        <div className="home-panel home-panel-compact">
          <BlogPreview />
        </div>
      </main>
    </HomeCanvas>
  );
};

export default OldHome;
