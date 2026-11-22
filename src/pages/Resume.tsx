import { ArrowUpRight, ExternalLink, Printer } from 'lucide-react';
import { Toolbar } from '@/components/os/OsWindowChrome';
import { useOsNotification } from '@/components/os/OsNotificationContext';
import { featuredProjects } from '@/data/featuredProjects';
import {
  certifications,
  education,
  organizationExperience,
  profile,
  skillTiers,
} from '@/data/profile';
import { usePageMeta } from '@/hooks/usePageMeta';

const sectionTitle =
  'border-b border-black/10 pb-2 font-mono text-[11px] font-semibold uppercase tracking-[.16em] text-[#0a84ff] dark:border-white/10';

const Resume = () => {
  const { pushNotification } = useOsNotification();

  const handlePrint = () => {
    pushNotification({
      appId: 'resume',
      appName: 'Preview',
      appIcon: '/macos-icons/pdf.png',
      title: 'CV.pdf',
      body: 'Preparing document for print / PDF export dialog.',
    });
    window.print();
  };

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
    <div className="flex h-full flex-col bg-white text-black/85 dark:bg-[#282025] dark:text-white/90">
      <Toolbar
        hasControls
        title="CV.pdf"
        centerTitle
        className="print:hidden"
        trailing={
          <button
            type="button"
            onClick={handlePrint}
            aria-label="Print resume or save as PDF"
            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-[#0a84ff] px-3 text-[12.5px] font-medium text-white shadow-sm transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a84ff]"
          >
            <Printer size={14} aria-hidden="true" />
            <span>Print / PDF</span>
          </button>
        }
      />

      <main className="resume-document mx-auto w-full flex-1 overflow-y-auto px-5 pb-8 pt-2 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <header className="flex flex-col gap-5 border-b border-black/10 pb-6 sm:flex-row sm:items-start sm:justify-between dark:border-white/10">
            <div>
              <p className="font-mono text-xs font-medium uppercase tracking-[.2em] text-[#0a84ff]">
                Document <span className="text-black/40 dark:text-white/40">/</span> Resume
              </p>
              <h1 className="mt-2.5 text-3xl font-semibold tracking-[-.035em] text-black/90 sm:text-4xl dark:text-white">
                {profile.name}
              </h1>
              <p className="mt-1.5 text-base text-black/60 dark:text-white/60">
                Software Developer · Computer Engineering Student
              </p>
              <p className="mt-3.5 max-w-3xl text-[15px] leading-7 text-black/70 dark:text-white/75">
                I build web and mobile products and ship them to real users. My recent work spans an edge-hosted
                email service, a Flutter and Next.js marketplace, and a certification platform built with a campus team.
              </p>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-black/55 dark:text-white/55">
                <a
                  className="break-all transition hover:text-[#0a84ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0a84ff]"
                  href={`mailto:${profile.email}`}
                >
                  {profile.email}
                </a>
                <span>{profile.phone}</span>
                <span>{profile.location}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-xs">
                {[
                  { label: 'Website', href: profile.website },
                  { label: 'GitHub', href: profile.github },
                  { label: 'LinkedIn', href: profile.linkedin },
                ].map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-8 items-center gap-1 text-sm font-medium text-[#0a84ff] transition hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0a84ff]"
                  >
                    {label}
                    <ArrowUpRight size={12} />
                  </a>
                ))}
              </div>
            </div>
          </header>

          <div className="grid gap-8 pt-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,.8fr)]">
            <div className="min-w-0 space-y-8">
              <section>
                <h2 className={sectionTitle}>Selected projects</h2>
                <div className="mt-4 space-y-5">
                  {featuredProjects.map((project) => (
                    <article
                      key={project.slug}
                      className="resume-entry border-l-2 border-[#0a84ff]/55 pl-4"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <h3 className="font-semibold text-black/90 dark:text-white">
                          {project.title}
                        </h3>
                        <span className="text-xs tabular-nums text-black/50 dark:text-white/50">
                          {project.year}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-black/50 dark:text-white/50">
                        {project.role} · {project.team.label} ·{' '}
                        {project.visibility === 'private' ? 'Private repository' : 'Public repository'}
                      </p>
                      {project.contributions.length ? (
                        <ul className="mt-2 list-disc space-y-1 pl-4 text-[14.5px] leading-6 text-black/70 dark:text-white/75">
                          {project.contributions.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 text-[14.5px] leading-6 text-black/70 dark:text-white/75">
                          {project.summary}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-black/50 dark:text-white/50">
                        {project.technologies.join(' · ')}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                        {project.repository && (
                          <a
                            className="inline-flex min-h-8 items-center gap-1 text-sm text-[#0a84ff] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0a84ff]"
                            href={project.repository}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Repository <ExternalLink size={12} />
                          </a>
                        )}
                        {project.demo && (
                          <a
                            className="inline-flex min-h-8 items-center gap-1 text-sm text-[#0a84ff] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0a84ff]"
                            href={project.demo}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Demo <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section>
                <h2 className={sectionTitle}>Leadership &amp; experience</h2>
                <div className="mt-4 space-y-5">
                  {organizationExperience.map((item) => (
                    <article
                      key={`${item.organization}-${item.role}`}
                      className="resume-entry border-l-2 border-black/10 pl-4 dark:border-white/10"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <h3 className="font-semibold text-black/90 dark:text-white">
                          {item.role}
                        </h3>
                        <span className="text-xs tabular-nums text-black/50 dark:text-white/50">
                          {item.period}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-black/55 dark:text-white/55">
                        {item.organization}
                      </p>
                      <ul className="mt-2 list-disc space-y-1 pl-4 text-[14.5px] leading-6 text-black/70 dark:text-white/75">
                        {item.responsibilities.map((responsibility) => (
                          <li key={responsibility}>{responsibility}</li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            <aside className="min-w-0 space-y-8">
              <section>
                <h2 className={sectionTitle}>Education</h2>
                <article className="mt-4">
                  <h3 className="font-semibold leading-6 text-black/90 dark:text-white">
                    {education.degree}
                  </h3>
                  <p className="mt-1 text-[15px] text-black/70 dark:text-white/75">
                    {education.university}
                  </p>
                  <p className="mt-1.5 text-xs text-black/50 dark:text-white/50">
                    {education.period}
                  </p>
                  <p className="mt-2 text-[14.5px] leading-6 text-black/70 dark:text-white/75">
                    GPA <span className="tabular-nums">{education.gpa}</span> · Expected graduation{' '}
                    {education.expectedGraduation}
                  </p>
                </article>
              </section>

              <section>
                <h2 className={sectionTitle}>Skills</h2>
                <div className="mt-4 space-y-3">
                  {skillTiers.map((tier) => (
                    <div key={tier.label}>
                      <h3 className="text-xs font-semibold text-black/50 dark:text-white/50">
                        {tier.label}
                      </h3>
                      <p className="mt-1 text-[14.5px] leading-6 text-black/70 dark:text-white/75">
                        {tier.skills.map((skill) => skill.name).join(' · ')}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className={sectionTitle}>Certifications</h2>
                <ul className="mt-4 space-y-3">
                  {certifications.map((cert) => (
                    <li key={cert.title}>
                      <p className="text-[15px] font-medium leading-6 text-black/90 dark:text-white">
                        {cert.title}
                      </p>
                      <p className="mt-0.5 text-sm text-black/65 dark:text-white/65">
                        {cert.issuer} · {cert.year}
                        {cert.score ? ` · ${cert.score}` : ''}
                      </p>
                      {cert.credentialId && (
                        <p className="mt-1 break-all font-mono text-[11px] text-black/50 dark:text-white/50">
                          ID {cert.credentialId}
                        </p>
                      )}
                      {cert.isVerifiedTransaction && cert.verificationUrl && (
                        <a
                          href={cert.verificationUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-flex min-h-8 items-center gap-1 text-sm text-[#0a84ff] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0a84ff]"
                        >
                          Verify credential <ExternalLink size={12} />
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            </aside>
          </div>
        </div>
      </main>

      <style>{`@media print {
        @page { size: A4; margin: 12mm; }
        html, body, #root, .gh-os { height: auto !important; min-height: 0 !important; overflow: visible !important; background: #fff !important; color: #111 !important; }
        .gh-os { position: static !important; display: block !important; }
        .gh-os > :not([role="dialog"]), .gh-os [role="dialog"]:not(:has(.resume-document)) { display: none !important; }
        .gh-os [role="dialog"]:has(.resume-document) { position: static !important; inset: auto !important; display: block !important; width: auto !important; height: auto !important; border-radius: 0 !important; box-shadow: none !important; overflow: visible !important; }
        .gh-os [role="dialog"]:has(.resume-document) > div { display: block !important; height: auto !important; border-radius: 0 !important; box-shadow: none !important; background: #fff !important; backdrop-filter: none !important; overflow: visible !important; }
        .gh-os .window-controls { display: none !important; }
        .resume-document { width: 100% !important; max-width: none !important; height: auto !important; overflow: visible !important; padding: 0 !important; background: #fff !important; color: #111 !important; }
        .resume-document * { background-color: transparent !important; border-color: #d1d5db !important; color: #222 !important; }
        .resume-document h1 { font-size: 26pt !important; }
        .resume-document h2 { color: #1d4ed8 !important; font-size: 11pt !important; }
        .resume-document h3 { font-size: 10pt !important; }
        .resume-document p, .resume-document li { font-size: 9.5pt !important; line-height: 1.4 !important; }
        .resume-document .resume-entry { break-inside: avoid; }
        .resume-document a { text-decoration: underline; }
      }`}</style>
    </div>
  );
};

export default Resume;
