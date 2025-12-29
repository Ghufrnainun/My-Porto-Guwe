import { Header } from '@/components/Header';
import { CursorFollower } from '@/components/CursorFollower';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Skills } from '@/components/Skills';
import { Projects } from '@/components/Projects';
import { Education } from '@/components/Education';
// import { BlogPreview } from '@/components/BlogPreview'; // TODO: Enable when blog content is ready
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { useEasterEggs } from '@/hooks/useEasterEggs';

const Index = () => {
  // Enable keyboard shortcuts (1-6 for section navigation)
  useKeyboardNavigation();

  // Enable easter eggs (console message, G+A shortcut)
  useEasterEggs();

  return (
    <div className="min-h-screen bg-background">
      <CursorFollower />
      <Header />
      <main>
        <section id="hero">
          <Hero />
        </section>
        <About />
        <Skills />
        <Projects />
        <Education />
        {/* <BlogPreview /> */} {/* TODO: Enable when blog content is ready */}
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
