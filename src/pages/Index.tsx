import { Header } from '@/components/Header';
import { ScrollProgress } from '@/components/ScrollProgress';
import { SectionNavigator } from '@/components/SectionNavigator';
import { CursorFollower } from '@/components/CursorFollower';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Skills } from '@/components/Skills';
import { Projects } from '@/components/Projects';
import { Education } from '@/components/Education';
import { BlogPreview } from '@/components/BlogPreview';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';

const Index = () => {
  // Enable keyboard shortcuts (1-6 for section navigation)
  useKeyboardNavigation();

  return (
    <div className="min-h-screen bg-background">
      <CursorFollower />
      <Header />
      <ScrollProgress />
      <SectionNavigator />
      <main>
        <section id="hero">
          <Hero />
        </section>
        <About />
        <Skills />
        <Projects />
        <Education />
        <BlogPreview />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
