
import { About as AboutSection } from '@/components/About';
import { Skills } from '@/components/Skills';
import { Education } from '@/components/Education';
import { motion } from 'framer-motion';
import { usePageMeta } from '@/hooks/usePageMeta';

const About = () => {
  usePageMeta({
    title: 'About Me | Ghufron Ainun Najib — Full-Stack Developer',
    description:
      'Background, skills, and journey of Ghufron Ainun Najib — a full-stack developer building web products with TypeScript, React, and Node.js.',
    canonicalPath: '/about',
  });

  return (
    <div className="min-h-screen bg-background">
      
      <main className="pt-20">
        {/* Page Header */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-6 md:px-12 lg:px-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-primary font-mono text-sm mb-3 tracking-wider uppercase">
                // about
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                The Person Behind the Code
              </h1>
            </motion.div>
          </div>
        </section>

        {/* Bio Section - Editorial Style */}
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
