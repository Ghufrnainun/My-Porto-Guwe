import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { AboutPreview } from '@/components/AboutPreview';
import { Skills } from '@/components/Skills';
import { ProjectsPreview } from '@/components/ProjectsPreview';
import { BlogPreview } from '@/components/BlogPreview';
import { ContactCTA } from '@/components/ContactCTA';
import { Footer } from '@/components/Footer';
import { ContactModal } from '@/components/ContactModal';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';

import { useState } from 'react';

const Index = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Enable keyboard shortcuts (1-6 for section navigation)
  useKeyboardNavigation();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section id="hero">
          <Hero />
        </section>
        <AboutPreview />
        <Skills />
        <ProjectsPreview />
        <BlogPreview />
        <ContactCTA onGetInTouch={() => setIsContactModalOpen(true)} />
      </main>
      <Footer showCTA={false} />
      <ContactModal
        isOpen={isContactModalOpen}
        onOpenChange={setIsContactModalOpen}
      />
    </div>
  );
};

export default Index;
