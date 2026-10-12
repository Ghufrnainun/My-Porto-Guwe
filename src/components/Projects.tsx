import { Github, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProjectShowcase } from '@/components/ui/project-showcase';
import { SideProjects } from '@/components/SideProjects';
import { ContributionSkyline } from '@/components/ui/contribution-skyline';
import { useGithubContributions } from '@/hooks/useGithubContributions';
import { profile } from '@/data/profile';

export function Projects({ className = '' }: { className?: string }) {
  const { data: contributions } = useGithubContributions('Ghufrnainun');

  return (
    <section
      id="projects"
      className={`py-16 md:py-28 bg-background relative ${className}`}
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">

        {/* Minimalist Editorial Project Showcase */}
        <div className="w-full">
          <ProjectShowcase showTitle={false} />
        </div>

        {/* Side Projects Section */}
        <div className="mt-20 md:mt-28 pt-16 border-t border-border/30">
          <SideProjects hasContainer={false} className="py-0 md:py-0" />
        </div>

        {/* GitHub Contributions & 3D Skyline Section */}
        <div id="github-activity" className="mt-20 md:mt-28 pt-16 border-t border-border/30 scroll-mt-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4"
          >
            <div>
              <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-emerald-500/[0.08] dark:bg-emerald-500/[0.12] border border-emerald-500/25 hover:border-emerald-500/40 hover:bg-emerald-500/[0.14] transition-[border-color,background-color] duration-150 ease-out font-mono text-[11px] font-medium tracking-wide text-emerald-800 dark:text-emerald-300 mb-3 select-none">
                <span className="relative flex size-2 items-center justify-center shrink-0">
                  <span className="absolute inline-flex size-full rounded-full bg-emerald-400 opacity-75 motion-safe:animate-ping [animation-duration:2.5s]" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                </span>
                <span>Live Commit Cadence</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif tracking-tight text-foreground">
                Activity & Open Source
              </h2>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl">
                A year of active building on GitHub visualized as an interactive heat map and procedural 3D Git City skyline.
              </p>
            </div>

            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 self-start md:self-auto rounded-xl border border-border/60 bg-secondary/40 px-4 py-2 font-mono text-xs font-medium text-foreground hover:border-emerald-500/40 hover:text-emerald-500 transition-all duration-200 active:scale-[0.97]"
            >
              <Github className="size-4" />
              <span>@Ghufrnainun on GitHub</span>
              <ExternalLink className="size-3.5 opacity-60" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full"
          >
            <ContributionSkyline
              data={contributions}
              palette="github"
              defaultView="3d"
              heightScale={1.1}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
