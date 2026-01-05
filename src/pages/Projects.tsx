import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Projects as ProjectsSection } from '@/components/Projects';
import { Experiments } from '@/components/Experiments';
import { motion } from 'framer-motion';

const Projects = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Page Header */}
        <section className="pt-16 pb-0 md:pt-24 md:pb-0">
          <div className="container mx-auto px-6 md:px-12 lg:px-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-muted-foreground font-mono text-sm mb-2">
                My Work
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Projects
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                A collection of featured projects and side experiments.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Featured Projects */}
        <ProjectsSection className="pt-0 md:pt-0" />

        {/* Side Projects / Experiments */}
        <Experiments />
      </main>
      <Footer showCTA={false} />
    </div>
  );
};

export default Projects;
