import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { About as AboutSection } from '@/components/About';
import { Skills } from '@/components/Skills';
import { Education } from '@/components/Education';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Page Header */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6 md:px-12 lg:px-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-muted-foreground font-mono text-sm mb-2">
                About Me
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                The Full Story
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                A deeper look at who I am, what I do, and how I got here.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Bio Section - Reusing About component */}
        <AboutSection />

        {/* Skills Section */}
        <Skills />

        {/* Education & Experience Section */}
        <Education />
      </main>
      <Footer showCTA={false} />
    </div>
  );
};

export default About;
