
import { About as AboutSection } from '@/components/About';
import { Skills } from '@/components/Skills';
import { Education } from '@/components/Education';
import { usePageMeta } from '@/hooks/usePageMeta';

const About = () => {
  usePageMeta({
    title: 'About | Ghufron Ainun Najib — Full-Stack Developer',
    description:
      'Computer Engineering student and full-stack developer based in Semarang. Building reliable web products with TypeScript, React, and Node.js.',
    canonicalPath: '/about',
  });

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 pb-16">
        {/* Unified Editorial Bio & Hero */}
        <AboutSection />

        {/* Tech Stack Section */}
        <Skills />

        {/* Education & Experience Section */}
        <Education />
      </main>
    </div>
  );
};

export default About;
