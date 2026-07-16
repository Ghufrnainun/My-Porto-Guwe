import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { AboutPreview } from '@/components/AboutPreview';
import { Skills } from '@/components/Skills';
import { ProjectsPreview } from '@/components/ProjectsPreview';
import { BlogPreview } from '@/components/BlogPreview';
import { ContactCTA } from '@/components/ContactCTA';
import { Footer } from '@/components/Footer';
import { ContactModal } from '@/components/ContactModal';
import { HomeCanvas } from '@/components/HomeCanvas';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';

import { useState } from 'react';

const Index = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Enable keyboard shortcuts (1-6 for section navigation)
  useKeyboardNavigation();

  return (
    <HomeCanvas>
      <Header />
      <div className="home-sections">
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
        <div className="home-panel home-panel-compact">
          <ContactCTA onGetInTouch={() => setIsContactModalOpen(true)} />
        </div>
      </div>
      <Footer showCTA={false} />
      <ContactModal
        isOpen={isContactModalOpen}
        onOpenChange={setIsContactModalOpen}
      />
    </HomeCanvas>
  );
};

export default Index;
