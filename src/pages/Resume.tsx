import { ArrowLeft, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { featuredProjects } from '@/data/featuredProjects';
import {
  certifications,
  education,
  organizationExperience,
  profile,
  skillTiers,
} from '@/data/profile';
import { usePageMeta } from '@/hooks/usePageMeta';

const Resume = () => {
  usePageMeta({
    title: 'Resume | Ghufron Ainun Najib — Full-Stack Developer',
    description:
      'Resume of Ghufron Ainun Najib: full-stack developer experienced with TypeScript, React, Node.js, and shipping production web products.',
    canonicalPath: '/resume',
  });

  return (
  <div className="min-h-screen bg-gray-100 py-6 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 print:bg-white print:p-0">
    <nav className="fixed inset-x-0 top-0 z-50 flex flex-col gap-2 border-b border-gray-200 bg-white/90 p-3 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:p-4 dark:border-zinc-800 dark:bg-zinc-900/95 print:hidden">
      <Button
        variant="ghost"
        size="sm"
        className="w-full min-h-[44px] sm:min-h-9 gap-2 text-zinc-800 hover:text-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-white active:scale-[0.96] transition-all sm:w-auto"
        asChild
      >
        <Link to="/">
          <ArrowLeft className="size-4" />
          Back to Portfolio
        </Link>
      </Button>
      <Button
        onClick={() => window.print()}
        className="w-full min-h-[44px] sm:min-h-9 gap-2 active:scale-[0.96] transition-transform sm:w-auto"
      >
        <Printer className="size-4" />
        Print / Save as PDF
      </Button>
    </nav>

    <div className="h-28 sm:h-16 print:hidden" />

    <main className="relative mx-auto min-h-[297mm] max-w-[210mm] bg-white p-5 text-[10.5pt] leading-relaxed text-zinc-900 shadow-xl sm:p-8 md:p-[20mm] print:w-full print:p-[15mm] print:shadow-none">
      <header className="mb-6 text-center">
        <h1 className="mb-2 text-2xl font-bold uppercase tracking-wide text-black sm:text-3xl [text-wrap:balance]">
          {profile.name}
        </h1>
        <p className="mb-2 text-sm text-gray-800 tabular-nums">
          {profile.phone} | {profile.email} | {profile.location}
        </p>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm text-blue-700 underline">
          <a href={profile.website} className="inline-flex items-center min-h-[32px] hover:text-blue-900">ghufronainun.tech</a>
          <a href={profile.github} className="inline-flex items-center min-h-[32px] hover:text-blue-900">GitHub</a>
          <a href={profile.linkedin} className="inline-flex items-center min-h-[32px] hover:text-blue-900">LinkedIn</a>
        </div>
      </header>

      <section className="mb-6">
        <p className="text-justify text-gray-900">
          Full-stack developer and semester-{profile.semester} Computer Engineering student building
          responsive interfaces, APIs, and practical internal tools. Experienced in leading a
          five-person project, delivering an organization website and CMS independently, and
          contributing across Flutter and Next.js in a four-person product team. {profile.availability}.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-3 border-b-2 border-black text-lg font-bold uppercase [text-wrap:balance]">Education</h2>
        <div className="flex flex-col font-bold text-gray-900 sm:flex-row sm:justify-between sm:gap-4">
          <span>{education.university}</span>
          <span className="tabular-nums">{education.period}</span>
        </div>
        <p className="font-bold text-gray-900">{education.degree} - GPA <span className="tabular-nums">{education.gpa}</span></p>
        <p className="text-gray-900">Expected graduation: <span className="tabular-nums">{education.expectedGraduation}</span></p>
      </section>

      <section className="mb-6">
        <h2 className="mb-3 border-b-2 border-black text-lg font-bold uppercase [text-wrap:balance]">Featured Projects</h2>
        <div className="space-y-4">
          {featuredProjects.map((project) => (
            <article key={project.slug}>
              <div className="flex flex-col font-bold text-gray-900 sm:flex-row sm:justify-between sm:gap-4">
                <span>{project.title}</span>
                <span className="tabular-nums">{project.year}</span>
              </div>
              <p className="italic text-gray-800">
                {project.role} | {project.team.label} | {project.visibility === 'private' ? 'Private repository' : 'Public repository'}
              </p>
              <p className="text-justify text-gray-900">{project.summary}</p>
              <p className="text-gray-900"><strong>Technology:</strong> {project.technologies.join(', ')}</p>
              {project.repository && <a className="text-blue-700 underline hover:text-blue-900" href={project.repository}>{project.repository}</a>}
              {project.demo && <a className="block text-blue-700 underline hover:text-blue-900" href={project.demo}>{project.demo}</a>}
            </article>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="mb-3 border-b-2 border-black text-lg font-bold uppercase [text-wrap:balance]">Organizational Experience</h2>
        <div className="space-y-4">
          {organizationExperience.map((experience) => (
            <article key={`${experience.organization}-${experience.role}`}>
              <div className="flex flex-col font-bold text-gray-900 sm:flex-row sm:justify-between sm:gap-4">
                <span>{experience.organization}</span>
                <span className="tabular-nums">{experience.period}</span>
              </div>
              <p className="italic text-gray-800">{experience.role}</p>
              <ul className="ml-5 list-disc text-gray-900">
                {experience.responsibilities.map((responsibility) => <li key={responsibility}>{responsibility}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="mb-3 border-b-2 border-black text-lg font-bold uppercase [text-wrap:balance]">Skills</h2>
        <div className="space-y-1 text-gray-900">
          {skillTiers.map((tier) => (
            <p key={tier.label}><strong>{tier.label}:</strong> {tier.skills.map((skill) => skill.name).join(', ')}</p>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 border-b-2 border-black text-lg font-bold uppercase [text-wrap:balance]">Verified Credentials</h2>
        <ul className="ml-5 list-disc text-gray-900">
          {certifications.map((certification) => (
            <li key={certification.title}>{certification.title} - {certification.issuer}, <span className="tabular-nums">{certification.year}</span></li>
          ))}
        </ul>
      </section>
    </main>

    <style type="text/css" media="print">
      {`@page { size: auto; margin: 0; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } html, body { height: auto; overflow: visible !important; }`}
    </style>
  </div>
  );
};

export default Resume;
