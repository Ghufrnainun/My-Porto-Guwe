import { ArrowUpRight, ExternalLink, Printer } from 'lucide-react';
import { featuredProjects } from '@/data/featuredProjects';
import { certifications, education, organizationExperience, profile, skillTiers } from '@/data/profile';
import { usePageMeta } from '@/hooks/usePageMeta';

const sectionTitle = 'border-b border-white/10 pb-2 font-mono text-xs font-medium uppercase tracking-[.16em] text-blue-200/65';

const Resume = () => {
  usePageMeta({
    title: 'Resume | Ghufron Ainun Najib — Software Developer',
    description:
      'Resume of Ghufron Ainun Najib: Computer Engineering student and developer building web and mobile products with Flutter, TypeScript, and Node.js.',
    canonicalPath: '/resume',
    jsonLd: {
      '@type': 'ProfilePage',
      name: 'Resume — Ghufron Ainun Najib',
      url: 'https://ghufronainun.tech/resume',
      description:
        'Resume of Ghufron Ainun Najib: Computer Engineering student and developer building web and mobile products with Flutter, TypeScript, and Node.js.',
      mainEntity: {
        '@type': 'Person',
        name: profile.name,
        url: profile.website,
        jobTitle: 'Software Developer',
      },
    },
  });

  return (
    <>
    <main className="resume-document mx-auto w-full max-w-5xl p-4 text-white sm:p-7 lg:p-9">
      <header className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-[.2em] text-blue-300">Document <span className="text-white/25">/</span> Resume</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-.035em] sm:text-4xl">{profile.name}</h1>
          <p className="mt-2 text-base text-white/60">Software Developer · Computer Engineering Student</p>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/70">I build web and mobile products and ship them to real users. My recent work spans an edge-hosted email service, a Flutter and Next.js marketplace, and a certification platform built with a campus team.</p>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/55">
            <a className="break-all transition hover:text-blue-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300" href={`mailto:${profile.email}`}>{profile.email}</a>
            <span>{profile.phone}</span>
            <span>{profile.location}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-xs">
            {[
              { label: 'Website', href: profile.website },
              { label: 'GitHub', href: profile.github },
              { label: 'LinkedIn', href: profile.linkedin },
            ].map(({ label, href }) => <a key={label} href={href} target="_blank" rel="noreferrer" className="inline-flex min-h-8 items-center gap-1 text-sm text-blue-200 transition hover:text-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300">{label}<ArrowUpRight size={12} /></a>)}
          </div>
        </div>
        <button onClick={() => window.print()} aria-label="Print resume or save as PDF" className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 self-start rounded-lg border border-white/15 px-3 text-sm text-white/75 transition hover:border-blue-300/50 hover:bg-blue-300/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 print:hidden">
          <Printer size={15} /> Print / Save PDF
        </button>
      </header>

      <div className="grid gap-8 pt-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,.8fr)]">
        <div className="min-w-0 space-y-8">
          <section>
            <h2 className={sectionTitle}>Selected projects</h2>
            <div className="mt-4 space-y-5">
              {featuredProjects.map((project) => <article key={project.slug} className="resume-entry border-l border-blue-300/45 pl-4">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-medium text-white/90">{project.title}</h3><span className="text-xs tabular-nums text-white/40">{project.year}</span>
                </div>
                <p className="mt-1 text-xs text-white/45">{project.role} · {project.team.label} · {project.visibility === 'private' ? 'Private repository' : 'Public repository'}</p>
                {project.contributions.length ? <ul className="mt-2 list-disc space-y-1 pl-4 text-base leading-7 text-white/70">{project.contributions.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="mt-2 text-base leading-7 text-white/70">{project.summary}</p>}
                <p className="mt-2 text-xs text-white/45">{project.technologies.join(' · ')}</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                  {project.repository && <a className="inline-flex min-h-8 items-center gap-1 text-sm text-blue-200 hover:text-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300" href={project.repository} target="_blank" rel="noreferrer">Repository <ExternalLink size={12} /></a>}
                  {project.demo && <a className="inline-flex min-h-8 items-center gap-1 text-sm text-blue-200 hover:text-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300" href={project.demo} target="_blank" rel="noreferrer">Demo <ExternalLink size={12} /></a>}
                </div>
              </article>)}
            </div>
          </section>

          <section>
            <h2 className={sectionTitle}>Leadership &amp; experience</h2>
            <div className="mt-4 space-y-5">
              {organizationExperience.map((item) => <article key={`${item.organization}-${item.role}`} className="resume-entry border-l border-white/20 pl-4">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1"><h3 className="font-medium text-white/90">{item.role}</h3><span className="text-xs tabular-nums text-white/40">{item.period}</span></div>
                <p className="mt-1 text-sm text-white/55">{item.organization}</p>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-base leading-7 text-white/70">{item.responsibilities.map((responsibility) => <li key={responsibility}>{responsibility}</li>)}</ul>
              </article>)}
            </div>
          </section>
        </div>

        <aside className="min-w-0 space-y-8">
          <section>
            <h2 className={sectionTitle}>Education</h2>
            <article className="mt-4">
              <h3 className="font-medium leading-6 text-white/90">{education.degree}</h3>
              <p className="mt-1 text-base text-white/60">{education.university}</p>
              <p className="mt-2 text-xs text-white/45">{education.period}</p>
              <p className="mt-2 text-base leading-7 text-white/70">GPA <span className="tabular-nums">{education.gpa}</span> · Expected graduation {education.expectedGraduation}</p>
            </article>
          </section>

          <section>
            <h2 className={sectionTitle}>Skills</h2>
            <div className="mt-4 space-y-3">
              {skillTiers.map((tier) => <div key={tier.label}><h3 className="text-xs font-medium text-white/45">{tier.label}</h3><p className="mt-1 text-base leading-7 text-white/70">{tier.skills.map((skill) => skill.name).join(' · ')}</p></div>)}
            </div>
          </section>

          <section>
            <h2 className={sectionTitle}>Certifications</h2>
            <ul className="mt-4 space-y-3">
              {certifications.map((cert) => <li key={cert.title}>
                <p className="text-base font-medium leading-6 text-white/85">{cert.title}</p>
                <p className="mt-1 text-sm text-white/50">{cert.issuer} · {cert.year}{cert.score ? ` · ${cert.score}` : ''}</p>
                {cert.credentialId && <p className="mt-1 break-all font-mono text-[11px] text-white/40">ID {cert.credentialId}</p>}
                {cert.isVerifiedTransaction && cert.verificationUrl && <a href={cert.verificationUrl} target="_blank" rel="noreferrer" className="mt-1 inline-flex min-h-8 items-center gap-1 text-sm text-blue-200 hover:text-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300">Verify credential <ExternalLink size={12} /></a>}
              </li>)}
            </ul>
          </section>
        </aside>
      </div>
    </main>
    <style>{`@media print {
      @page { size: A4; margin: 12mm; }
      html, body, #root, .gh-os, .os-window { height: auto !important; min-height: 0 !important; overflow: visible !important; background: #fff !important; color: #111 !important; }
      .gh-os { position: static !important; display: block !important; }
      .gh-os > :not(.os-window) { display: none !important; }
      .os-window { position: static !important; inset: auto !important; display: block !important; width: auto !important; box-shadow: none !important; border: 0 !important; backdrop-filter: none !important; }
      .os-window > :first-child { display: none !important; }
      .os-window > :last-child { display: block !important; height: auto !important; min-height: 0 !important; overflow: visible !important; background: #fff !important; }
      .resume-document { width: 100% !important; max-width: none !important; padding: 0 !important; background: #fff !important; color: #111 !important; }
      .resume-document * { background-color: transparent !important; border-color: #d1d5db !important; color: #222 !important; }
      .resume-document h1 { font-size: 26pt !important; }
      .resume-document h2 { color: #1d4ed8 !important; font-size: 11pt !important; }
      .resume-document h3 { font-size: 10pt !important; }
      .resume-document p, .resume-document li { font-size: 9.5pt !important; line-height: 1.4 !important; }
      .resume-document .resume-entry { break-inside: avoid; }
      .resume-document a { text-decoration: underline; }
    }`}</style>
    </>
  );
};

export default Resume;
