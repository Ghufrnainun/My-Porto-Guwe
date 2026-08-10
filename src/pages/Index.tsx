import { Hero } from '@/components/Hero';
import { AboutPreview } from '@/components/AboutPreview';
import { Skills } from '@/components/Skills';
import { ProjectsPreview } from '@/components/ProjectsPreview';
import { BlogPreview } from '@/components/BlogPreview';
import { HomeCanvas } from '@/components/HomeCanvas';

const Index = () => {
  return (
    <HomeCanvas>
      {/* 
        HERO FIXED BACKGROUND LAYER
        It sits at z-index 0. It is fixed to the viewport so it never scrolls.
        The wrapper has h-screen, giving space for the scrollable content below.
      */}
      <div className="relative h-screen w-full" style={{ clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}>
        <section id="hero" className="fixed top-0 left-0 w-full h-screen z-0">
          <Hero />
        </section>
      </div>

      {/* 
        SCROLLABLE FOREGROUND PANELS
        These render sequentially AFTER the hero's h-screen space.
        As you scroll down, these panels slide UP OVER the fixed hero.
        They all have a solid background and rounded tops via CSS.
      */}
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

export default Index;
