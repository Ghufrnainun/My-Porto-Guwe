import { ArrowLeft, ArrowUpRight, ExternalLink, Github } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';

import { Footer } from '@/components/Footer';

import { ProjectCover } from '@/components/ProjectCover';
import { PortfolioProject, getPortfolioProject } from '@/data/featuredProjects';
import NotFound from './NotFound';

const ease = [0.22, 1, 0.36, 1] as const;

function ProjectLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-foreground transition-all duration-500 hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary"
    >
      {children}
      <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  );
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
        {title}
      </p>
      <ul className="mt-5 space-y-4">
        {items.map((item) => (
          <li
            key={item}
            className="border-l border-white/15 pl-5 text-sm leading-7 text-muted-foreground md:text-base"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function CaseStudy({ project }: { project: PortfolioProject }) {
  return (
    <div className="min-h-screen bg-background">
      
      <main className="overflow-hidden pt-24">
        <section className="relative py-16 md:py-24">
          {/* Decorative glow — radial-gradient, no filter:blur() */}
          <div
            className="pointer-events-none absolute right-[-12rem] top-0 size-[28rem] rounded-full"
            style={{
              background: `radial-gradient(circle, ${project.color}33 0%, ${project.color}10 50%, transparent 70%)`,
            }}
          />
          <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-24">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
            >
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-primary"
              >
                <ArrowLeft className="size-3.5" />
                All projects
              </Link>

              <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
                <div>
                  <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                    <span>{project.year}</span>
                    <span className="size-1 rounded-full bg-primary/50" />
                    <span>{project.role}</span>
                  </div>
                  <h1 className="mt-6 max-w-5xl font-serif text-5xl font-bold leading-[0.92] tracking-tight text-foreground md:text-7xl lg:text-8xl">
                    {project.title}
                  </h1>
                  <p className="mt-8 max-w-3xl text-lg leading-8 text-muted-foreground md:text-xl">
                    {project.summary}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
                  <div className="bg-card p-5">
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                      Team
                    </p>
                    <p className="mt-2 text-sm font-semibold text-foreground">
                      {project.team.label}
                    </p>
                  </div>
                  <div className="bg-card p-5">
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                      Repository
                    </p>
                    <p className="mt-2 text-sm font-semibold capitalize text-foreground">
                      {project.visibility}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="container mx-auto px-6 md:px-12 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.12, ease }}
            className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-2 shadow-[0_50px_140px_-80px_hsl(var(--primary)/0.8)]"
          >
            <ProjectCover
              project={project}
              className="aspect-[16/9] w-full rounded-[calc(2rem-0.5rem)] object-cover"
            />
          </motion.div>
        </section>

        <section className="container mx-auto grid gap-14 px-6 py-20 md:px-12 md:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24 lg:px-24">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
              The problem
            </p>
            <p className="mt-5 font-serif text-3xl font-semibold leading-tight text-foreground md:text-4xl">
              {project.problem}
            </p>

            <div className="mt-10 flex flex-wrap gap-2">
              {project.technologies.map((technology) => (
                <span
                  key={technology}
                  className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 font-mono text-[10px] font-semibold text-muted-foreground"
                >
                  {technology}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-14 md:grid-cols-2">
            <DetailList title="Contributions" items={project.contributions} />
            <DetailList title="Outcomes" items={project.outcomes} />
          </div>
        </section>

        {(project.gallery?.length ?? 0) > 1 && (
          <section className="container mx-auto grid gap-5 px-6 pb-20 md:grid-cols-2 md:px-12 md:pb-28 lg:px-24">
            {project.gallery?.map((image, index) => (
              <img
                key={image}
                src={image}
                alt={`${project.title} gallery ${index + 1}`}
                className="aspect-[4/3] w-full rounded-2xl border border-white/10 object-cover"
                loading="lazy"
              />
            ))}
          </section>
        )}

        {(project.repository || project.demo) && (
          <section className="border-y border-white/10 bg-white/[0.025]">
            <div className="container mx-auto flex flex-col gap-6 px-6 py-14 md:flex-row md:items-center md:justify-between md:px-12 lg:px-24">
              <p className="font-serif text-3xl font-semibold text-foreground">
                Explore the project
              </p>
              <div className="flex flex-wrap gap-3">
                {project.repository && (
                  <ProjectLink href={project.repository}>
                    <Github className="size-4" />
                    Public repository
                  </ProjectLink>
                )}
                {project.demo && (
                  <ProjectLink href={project.demo}>
                    <ExternalLink className="size-4" />
                    Live website
                  </ProjectLink>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default function ProjectCaseStudy() {
  const { slug = '' } = useParams();
  const project = getPortfolioProject(slug);

  return project ? <CaseStudy project={project} /> : <NotFound />;
}
