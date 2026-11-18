import { ArrowUpRight, Award, Github, Globe, Linkedin, Mail, MapPin, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { featuredProjects } from '@/data/featuredProjects';
import { certifications, education, profile, skillTiers } from '@/data/profile';
import { usePageMeta } from '@/hooks/usePageMeta';

const profileActions = [
  { label: 'Email', href: `mailto:${profile.email}`, Icon: Mail },
  { label: 'Website', href: profile.website, Icon: Globe, external: true },
  { label: 'GitHub', href: profile.github, Icon: Github, external: true },
  { label: 'LinkedIn', href: profile.linkedin, Icon: Linkedin, external: true },
];

const About = () => {
  usePageMeta({
    title: 'About | Ghufron Ainun Najib — Full-Stack Developer',
    description:
      'Computer Engineering student and full-stack developer based in Semarang. Building reliable web products with TypeScript, React, and Node.js.',
    canonicalPath: '/about',
    jsonLd: {
      '@type': 'AboutPage',
      name: 'About Ghufron Ainun Najib',
      url: 'https://ghufronainun.tech/about',
      description:
        'Computer Engineering student and full-stack developer based in Semarang. Building reliable web products with TypeScript, React, and Node.js.',
      mainEntity: {
        '@type': 'Person',
        name: profile.name,
        url: profile.website,
        jobTitle: 'Full-Stack Developer',
      },
    },
  });

  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 px-4 py-5 text-white sm:px-6 sm:py-7">
      <section aria-labelledby="profile-name" className="mx-auto max-w-2xl rounded-xl border border-white/10 bg-[#171a1e] p-5 sm:p-7">
        <div className="flex flex-col items-center text-center">
          <img
            src="/Photo.webp"
            alt={`Portrait of ${profile.name}`}
            className="size-24 rounded-full border border-white/15 object-cover object-center shadow-lg sm:size-28"
          />
          <h1 id="profile-name" className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">{profile.name}</h1>
          <p className="mt-1 text-sm text-white/60">Full-Stack Developer <span aria-hidden="true">·</span> Computer Engineering Student</p>
          <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[.06] px-3 py-1 font-mono text-[11px] text-emerald-200/90">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-400" />{profile.availability}
          </span>

          <nav aria-label="Contact and profile links" className="mt-5 flex items-center gap-2">
            {profileActions.map(({ label, href, Icon, external }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                title={label}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer' : undefined}
                className="grid size-11 place-items-center rounded-lg border border-white/10 bg-white/[.035] text-white/70 transition-colors hover:border-blue-300/35 hover:bg-blue-300/10 hover:text-blue-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
              >
                <Icon size={17} aria-hidden="true" />
              </a>
            ))}
          </nav>
        </div>

        <dl className="mt-6 divide-y divide-white/[.08] border-t border-white/[.08]">
          <div className="grid gap-1 py-3 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-4">
            <dt className="text-xs text-white/45">Email</dt>
            <dd><a className="break-all text-sm text-white/85 hover:text-blue-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300" href={`mailto:${profile.email}`}>{profile.email}</a></dd>
          </div>
          <div className="grid gap-1 py-3 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-4">
            <dt className="text-xs text-white/45">Phone</dt>
            <dd><a className="text-sm text-white/85 hover:text-blue-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300" href={`tel:${profile.phone.replaceAll(' ', '')}`}>{profile.phone}</a></dd>
          </div>
          <div className="grid gap-1 py-3 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-4">
            <dt className="text-xs text-white/45">Location</dt>
            <dd className="inline-flex items-center gap-1.5 text-sm text-white/85"><MapPin size={14} aria-hidden="true" />{profile.location}</dd>
          </div>
          <div className="grid gap-1 py-3 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-4">
            <dt className="text-xs text-white/45">Education</dt>
            <dd className="text-sm leading-6 text-white/85">{education.degree}<span className="text-white/45"> · {education.university}</span></dd>
          </div>
        </dl>

        <Link to="/resume" className="mt-4 inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-sm text-blue-200 transition hover:bg-blue-300/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300">
          View resume <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </section>

      <section aria-labelledby="selected-work-title">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div><p className="font-mono text-[11px] uppercase tracking-[.16em] text-blue-300/75">Portfolio</p><h2 id="selected-work-title" className="mt-1 text-xl font-semibold tracking-tight">Selected projects</h2></div>
          <Link to="/projects" className="inline-flex min-h-9 items-center gap-1 rounded-lg px-2 text-sm text-blue-200 transition hover:bg-blue-300/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300">Browse all projects <ArrowUpRight size={14} /></Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {featuredProjects.slice(0, 2).map((project) => (
            <article key={project.slug} className="flex min-w-0 flex-col rounded-[10px] border border-white/10 bg-[#171a1e] p-4 transition-colors hover:border-blue-300/25 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[.14em] text-blue-300/75">Selected work</span>
                <span className="font-mono text-xs tabular-nums text-white/45">{project.year}</span>
              </div>
              <h3 className="mt-3 text-base font-semibold text-white">{project.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-white/60">{project.summary}</p>
              <p className="mt-3 text-xs leading-5 text-white/45">{project.technologies.slice(0, 4).join(' · ')}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link to={`/projects/${project.slug}`} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-white/10 px-3 text-xs font-medium text-white/75 transition hover:border-blue-300/30 hover:bg-white/[.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300">Project details <ArrowUpRight size={13} /></Link>
                {project.demo && <a href={project.demo} target="_blank" rel="noreferrer" className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-xs text-blue-200 transition hover:bg-blue-300/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300">Live project <ArrowUpRight size={13} /></a>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-[10px] border border-white/10 bg-[#171a1e] p-4 sm:p-5">
          <div className="flex items-center gap-2 text-blue-200"><GraduationCap size={16} aria-hidden="true" /><h2 className="text-base font-semibold">Education</h2></div>
          <p className="mt-3 text-sm font-medium leading-6 text-white/90">{education.degree}</p>
          <p className="mt-1 text-sm text-white/60">{education.university} · {education.period}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/55">
            <span className="rounded-md border border-white/10 bg-white/[.03] px-2.5 py-1.5">Semester {profile.semester}</span>
            <span className="rounded-md border border-white/10 bg-white/[.03] px-2.5 py-1.5">GPA {education.gpa}</span>
            <span className="rounded-md border border-white/10 bg-white/[.03] px-2.5 py-1.5">Expected {education.expectedGraduation}</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-white/50">Focus: {education.focusAreas.join(' · ')}</p>
        </section>

        <section className="rounded-[10px] border border-white/10 bg-[#171a1e] p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-blue-200"><Award size={16} aria-hidden="true" /><h2 className="text-base font-semibold">Certifications</h2></div>
            <span className="font-mono text-[10px] text-white/45">{certifications.length} total</span>
          </div>
          <ul className="mt-4 space-y-3">
            {certifications.slice(0, 3).map((cert) => <li key={cert.title} className="border-l border-blue-300/45 pl-3"><p className="text-sm font-medium leading-5 text-white/85">{cert.title}</p><p className="mt-1 text-xs text-white/45">{cert.issuer} · {cert.year}</p></li>)}
          </ul>
          <Link to="/resume" className="mt-4 inline-flex min-h-8 items-center gap-1 text-sm text-blue-200 hover:text-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300">View all credentials <ArrowUpRight size={13} /></Link>
        </section>
      </div>

      <section aria-labelledby="toolkit-title">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3"><div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-blue-300/75">Toolkit</p><h2 id="toolkit-title" className="mt-1 text-xl font-semibold tracking-tight">Tools I work with</h2></div><span className="text-xs text-white/40">A selection from my stack</span></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {skillTiers.map((tier) => <div key={tier.label} className="rounded-[10px] border border-white/10 bg-[#171a1e] p-4">
            <h3 className="mb-3 font-mono text-[10px] uppercase tracking-[.14em] text-white/45">{tier.label}</h3>
            <ul className="flex flex-wrap gap-1.5">{tier.skills.map((skill) => <li key={skill.name} className="rounded-md border border-white/[.08] bg-black/15 px-2.5 py-1.5 text-xs text-white/70">{skill.name}</li>)}</ul>
          </div>)}
        </div>
      </section>
    </main>
  );
};

export default About;
