import { Github } from 'lucide-react';
import { motion } from 'framer-motion';

interface Experiment {
  title: string;
  description: string;
  stack: string;
  year: string;
  link: string;
}

const experiments: Experiment[] = [
  {
    title: 'ISO 9001:2015 Audit System',
    description:
      'High-performance audit logging with optimized caching strategies.',
    stack: 'Laravel • Redis',
    year: '2024',
    link: 'https://github.com/Ghufrnainun',
  },
  {
    title: 'LSP Certification Tracker',
    description: 'Real-time certification status tracking using WebSockets.',
    stack: 'Laravel Reverb • React',
    year: '2024',
    link: 'https://github.com/Ghufrnainun',
  },
  {
    title: 'CLI Dev Scaffolder',
    description:
      'Command-line tool to automate project setup and boilerplate generation.',
    stack: 'Node.js • TypeScript',
    year: '2023',
    link: 'https://github.com/Ghufrnainun',
  },
  {
    title: 'First Portfolio',
    description: 'Static HTML/CSS version with manual build pipeline.',
    stack: 'HTML • CSS • Tailwind CSS',
    year: '2022',
    link: 'https://github.com/Ghufrnainun/Portfolio-tailwind-web',
  },
];

export function Experiments() {
  return (
    <section id="experiments" className="py-24 bg-background">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        {/* Header */}
        <div className="flex items-end justify-between mb-12 border-b border-border pb-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Side Projects
          </h2>
          <span className="hidden md:block font-mono text-sm text-muted-foreground">
            // engineering_logs
          </span>
        </div>

        {/* List */}
        <div className="flex flex-col">
          {experiments.map((item, index) => (
            <motion.a
              key={item.title}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-border/50 hover:bg-transparent transition-all"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              {/* Left: Title & Description */}
              <div className="flex flex-col gap-1 md:w-3/5">
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">
                  {item.description}
                </p>
              </div>

              {/* Right: Meta & Icon */}
              <div className="flex items-center justify-between md:justify-end gap-6 mt-4 md:mt-0 md:w-2/5">
                <span className="font-mono text-xs text-muted-foreground/60">
                  {item.stack}
                </span>

                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-muted-foreground/40">
                    {item.year}
                  </span>
                  <Github className="w-5 h-5 text-muted-foreground opacity-50 group-hover:opacity-100 group-hover:text-foreground transition-all" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
