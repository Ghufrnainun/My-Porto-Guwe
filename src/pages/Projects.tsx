
import { Projects as ProjectsSection } from '@/components/Projects';
import { motion } from 'framer-motion';
import { usePageMeta } from '@/hooks/usePageMeta';

const Projects = () => {
  usePageMeta({
    title: 'Projects | Ghufron Ainun Najib — Full-Stack Developer',
    description:
      'Selected projects by Ghufron Ainun Najib: TempeMail, Curated Design, SewaInAja, LSP Polines certification platform, and the IMPP organization website.',
    canonicalPath: '/projects',
    jsonLd: [
      {
        '@type': 'CollectionPage',
        name: 'Projects — Ghufron Ainun Najib',
        url: 'https://ghufronainun.tech/projects',
        description: 'Portfolio of full-stack web and mobile engineering projects by Ghufron Ainun Najib',
      },
      {
        '@type': 'ItemList',
        name: 'Featured Projects',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'TempeMail', url: 'https://ghufronainun.tech/projects/tempe-mail' },
          { '@type': 'ListItem', position: 2, name: 'Curated Design', url: 'https://ghufronainun.tech/projects/curated-design' },
          { '@type': 'ListItem', position: 3, name: 'SewaInAja', url: 'https://ghufronainun.tech/projects/sewainaja' },
          { '@type': 'ListItem', position: 4, name: 'LSP Polines', url: 'https://ghufronainun.tech/projects/lsp-polines' },
          { '@type': 'ListItem', position: 5, name: 'IMPP Website', url: 'https://ghufronainun.tech/projects/impp-website' },
        ],
      },
    ],
  });

  return (
    <div className="min-h-screen bg-background">
      
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
                Selected case studies covering mobile products, cloud infrastructure,
                and content systems, alongside focused side projects and prototypes.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Featured Projects */}
        <ProjectsSection className="pt-0 md:pt-0" />

      </main>
    </div>
  );
};

export default Projects;
