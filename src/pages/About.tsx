import { ExternalLink, FileText, Globe, Mail, StickyNote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Toolbar, SettingsGroup, SettingsRow } from '@/components/os/OsWindowChrome';
import { useOsNote } from '@/components/os/OsShellContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import {
  certifications,
  education,
  organizationExperience,
  profile,
  skillTiers,
} from '@/data/profile';

export default function About() {
  usePageMeta({
    title: `About ${profile.name} — Contacts`,
    description: `${profile.name} is a semester ${profile.semester} Computer Engineering student at ${education.university} and full-stack developer based in ${profile.location}.`,
    canonicalPath: '/about',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      mainEntity: {
        '@type': 'Person',
        name: profile.name,
        url: profile.website,
        email: `mailto:${profile.email}`,
        sameAs: [profile.github, profile.linkedin],
        alumniOf: {
          '@type': 'CollegeOrUniversity',
          name: education.university,
        },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Semarang',
          addressCountry: 'ID',
        },
      },
    },
  });

  const { openApp } = useOsNote();

  return (
    <div className="flex h-full flex-col bg-white text-black/85 dark:bg-[#282025] dark:text-white/90">
      <Toolbar hasControls title="Contacts" centerTitle />

      <div className="flex-1 overflow-y-auto px-6 pb-8 pt-2 sm:px-10">
        <div className="mx-auto max-w-2xl">
          {/* Contact Header Card */}
          <div className="flex flex-col items-center border-b border-black/5 pb-6 text-center dark:border-white/[0.08]">
            <div className="relative h-24 w-24 overflow-hidden rounded-full bg-gradient-to-b from-[#a8adb8] to-[#7e838f] shadow-md ring-1 ring-black/10 dark:ring-white/15">
              <img
                src="/Photo.webp"
                alt={profile.name}
                className="h-full w-full object-cover object-top"
              />
            </div>

            <h1 className="mt-3.5 text-[22px] font-semibold tracking-tight text-black/90 dark:text-white">
              {profile.name}
            </h1>
            <p className="mt-0.5 text-[13px] text-black/55 dark:text-white/55">
              Full-Stack Developer · Computer Engineering Student (Semester {profile.semester})
            </p>
            <p className="mt-1 text-[12px] font-medium text-[#0a84ff]">
              {profile.availability} · {profile.location}
            </p>

            {/* 4 Quick Action Pills */}
            <div className="mt-5 flex items-center justify-center gap-5 sm:gap-7">
              <button
                type="button"
                onClick={() => openApp('mail')}
                className="group flex flex-col items-center gap-1.5 text-[11px] font-medium text-[#0a84ff]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0a84ff] text-white shadow-sm transition-transform group-hover:scale-105 group-active:scale-95">
                  <Mail className="h-[18px] w-[18px]" />
                </span>
                <span>Mail</span>
              </button>

              <button
                type="button"
                onClick={() => openApp('resume')}
                className="group flex flex-col items-center gap-1.5 text-[11px] font-medium text-[#0a84ff]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0a84ff] text-white shadow-sm transition-transform group-hover:scale-105 group-active:scale-95">
                  <FileText className="h-[18px] w-[18px]" />
                </span>
                <span>CV</span>
              </button>

              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-1.5 text-[11px] font-medium text-[#0a84ff]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0a84ff] text-white shadow-sm transition-transform group-hover:scale-105 group-active:scale-95">
                  <Globe className="h-[18px] w-[18px]" />
                </span>
                <span>Website</span>
              </a>

              <button
                type="button"
                onClick={() => openApp('notes')}
                className="group flex flex-col items-center gap-1.5 text-[11px] font-medium text-[#0a84ff]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0a84ff] text-white shadow-sm transition-transform group-hover:scale-105 group-active:scale-95">
                  <StickyNote className="h-[18px] w-[18px]" />
                </span>
                <span>Notes</span>
              </button>
            </div>
          </div>

          {/* macOS Contacts 2-Column Details */}
          <dl className="mt-5 grid grid-cols-[96px_1fr] gap-x-5 gap-y-2.5 border-b border-black/5 pb-6 text-[13px] sm:grid-cols-[120px_1fr] dark:border-white/[0.08]">
            <dt className="text-right font-medium text-black/45 dark:text-white/45">work</dt>
            <dd className="text-black/85 dark:text-white/90">Full-Stack Web &amp; Systems Developer</dd>

            <dt className="text-right font-medium text-black/45 dark:text-white/45">education</dt>
            <dd className="text-black/85 dark:text-white/90">
              {education.degree} — {education.university} ({education.period})
            </dd>

            <dt className="text-right font-medium text-black/45 dark:text-white/45">gpa</dt>
            <dd className="text-black/85 dark:text-white/90">{education.gpa}</dd>

            <dt className="text-right font-medium text-black/45 dark:text-white/45">focus</dt>
            <dd className="text-black/85 dark:text-white/90">{education.focusAreas.join(' · ')}</dd>

            <dt className="text-right font-medium text-black/45 dark:text-white/45">email</dt>
            <dd>
              <a
                href={`mailto:${profile.email}`}
                className="text-[#0a84ff] hover:underline"
              >
                {profile.email}
              </a>
            </dd>

            <dt className="text-right font-medium text-black/45 dark:text-white/45">phone</dt>
            <dd className="text-black/85 dark:text-white/90">{profile.phone}</dd>

            <dt className="text-right font-medium text-black/45 dark:text-white/45">homepage</dt>
            <dd>
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0a84ff] hover:underline"
              >
                {profile.website}
              </a>
            </dd>

            <dt className="text-right font-medium text-black/45 dark:text-white/45">GitHub</dt>
            <dd>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#0a84ff] hover:underline"
              >
                <span>@Ghufrnainun</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </dd>

            <dt className="text-right font-medium text-black/45 dark:text-white/45">LinkedIn</dt>
            <dd>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#0a84ff] hover:underline"
              >
                <span>in/ghufronainunnajib</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </dd>

            <dt className="text-right font-medium text-black/45 dark:text-white/45">note</dt>
            <dd className="leading-relaxed text-black/75 dark:text-white/75">
              I build practical web products and tools where clean backend engineering and responsive interfaces meet.
              Explore my recent case studies in{' '}
              <Link to="/projects" className="text-[#0a84ff] hover:underline">
                Finder
              </Link>{' '}
              or read longer notes on the{' '}
              <Link to="/blog" className="text-[#0a84ff] hover:underline">
                Blog
              </Link>
              .
            </dd>
          </dl>

          {/* Background, Certifications & Toolkit in clean macOS SettingsGroup cards */}
          <div className="mt-6 space-y-5">
            <section>
              <h2 className="mb-2 px-1 text-[12px] font-semibold uppercase tracking-wide text-black/45 dark:text-white/45">
                Experience
              </h2>
              <SettingsGroup>
                {organizationExperience.map((item) => (
                  <div key={`${item.organization}-${item.period}`} className="py-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="text-[13px] font-semibold text-black/85 dark:text-white/90">
                        {item.role}
                      </span>
                      <span className="text-[12px] text-black/45 dark:text-white/45">
                        {item.period}
                      </span>
                    </div>
                    <div className="mt-0.5 text-[12px] font-medium text-[#0a84ff]">
                      {item.organization}
                    </div>
                    <ul className="mt-1.5 list-disc space-y-1 pl-4 text-[12.5px] leading-relaxed text-black/70 dark:text-white/70">
                      {item.responsibilities.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </SettingsGroup>
            </section>

            <section>
              <h2 className="mb-2 px-1 text-[12px] font-semibold uppercase tracking-wide text-black/45 dark:text-white/45">
                Certifications
              </h2>
              <SettingsGroup>
                {certifications.map((cert) => (
                  <SettingsRow key={`${cert.title}-${cert.year}`} label={cert.title}>
                    <div className="flex items-center gap-2 text-right text-[12px] text-black/55 dark:text-white/55">
                      <span>
                        {cert.issuer} · {cert.year}
                        {cert.score ? ` · ${cert.score}` : ''}
                      </span>
                      {cert.isVerifiedTransaction && cert.verificationUrl && cert.credentialId && (
                        <a
                          href={cert.verificationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-0.5 text-[#0a84ff] hover:underline"
                          title={`Credential ID: ${cert.credentialId}`}
                        >
                          <span>Verify</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </SettingsRow>
                ))}
              </SettingsGroup>
            </section>

            <section>
              <h2 className="mb-2 px-1 text-[12px] font-semibold uppercase tracking-wide text-black/45 dark:text-white/45">
                Technical Toolkit
              </h2>
              <SettingsGroup>
                {skillTiers.map((tier) => (
                  <SettingsRow key={tier.label} label={tier.label}>
                    <div className="flex flex-wrap justify-end gap-1.5">
                      {tier.skills.map((skill) => (
                        <span
                          key={skill.name}
                          className="rounded-md bg-black/[0.05] px-2 py-0.5 text-[11.5px] font-medium text-black/75 dark:bg-white/[0.08] dark:text-white/80"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </SettingsRow>
                ))}
              </SettingsGroup>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
