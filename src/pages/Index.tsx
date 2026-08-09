import { Hero } from '@/components/Hero';
import { AboutPreview } from '@/components/AboutPreview';
import { Skills } from '@/components/Skills';
import { ProjectsPreview } from '@/components/ProjectsPreview';
import { BlogPreview } from '@/components/BlogPreview';
import { HomeCanvas } from '@/components/HomeCanvas';

const Index = () => {

  return (
    <HomeCanvas>
      <main className="home-sections">
        <section id="hero" className="home-panel home-panel-hero">
          <Hero />
        </section>
        <div className="home-panel">
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
