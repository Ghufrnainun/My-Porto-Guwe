import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Resume = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-950 py-8 print:p-0 print:bg-white text-black font-sans">
      {/* Navigation UI - Hidden on Print */}
      <div className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 z-50 print:hidden">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button onClick={handlePrint} className="gap-2">
            <Printer className="w-4 h-4" />
            Print / Save as PDF
          </Button>
        </div>
      </div>

      {/* spacer for navbar */}
      <div className="h-16 print:hidden"></div>

      {/* ATS Container - A4 constrained */}
      <div className="mx-auto bg-white shadow-xl print:shadow-none print:w-full max-w-[210mm] min-h-[297mm] p-[15mm] md:p-[20mm] relative text-[11pt] leading-relaxed">
        {/* HEADER */}
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold uppercase tracking-wide mb-2 text-black">
            Ghufron Ainun Najib
          </h1>
          <div className="text-sm text-gray-800 mb-2 flex flex-wrap justify-center gap-x-1">
            <span>+62 896 0759 3219</span>
            <span>|</span>
            <span>ghufrnainunajib@gmail.com</span>
            <span>|</span>
            <span>Semarang, Indonesia</span>
          </div>
          <a
            href="https://www.linkedin.com/in/ghufronainunnajib/"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-blue-700 underline block"
          >
            https://www.linkedin.com/in/ghufronainunnajib/
          </a>
        </header>

        {/* SUMMARY */}
        <section className="mb-6">
          <p className="text-justify text-gray-900">
            A proactive and detail-oriented 3rd-Semester Computer Engineering
            Student specializing in Back-End Development (PHP, Laravel, MySQL)
            and Artificial Intelligence/Machine Learning. Experienced in
            applying the principles of software analysis, design, development,
            and testing in academic and organizational projects. A proven team
            player and innovative problem-solver committed to meeting objectives
            and delivering high-quality results.
          </p>
        </section>

        {/* EDUCATION */}
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b-2 border-black mb-3">
            Education
          </h2>
          <div className="mb-2">
            <div className="flex justify-between font-bold text-gray-900">
              <span>Semarang State Polytechnic</span>
              <span>Aug 2024–2028</span>
            </div>
            <div className="font-bold text-gray-900">
              Bachelor of Applied Science (Current GPA: 3.85/4.00)
            </div>
            <ul className="list-disc list-outside ml-5 mt-1 text-gray-900">
              <li>
                <span className="font-bold">Expected Graduation:</span> August
                2028.
              </li>
              <li>
                <span className="font-bold">Academic Focus:</span> Coursework
                and projects centered on Back-End Development and AI/ML
                Applications.
              </li>
            </ul>
          </div>
        </section>

        {/* FEATURED PROJECTS */}
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b-2 border-black mb-3">
            Featured Projects
          </h2>
          <div className="mb-4">
            <div className="font-bold text-gray-900 text-[11.5pt]">
              LSP Polines Certification Website (Project-Based Learning)
            </div>
            <div className="italic text-gray-800 mb-1">
              Technology: Tailwind CSS, JavaScript, PHP Laravel, MySQL
            </div>
            <p className="text-justify text-gray-900">
              Leading a team of 5 members in analyzing, designing, and
              developing a comprehensive website for the Polines Professional
              Certification Institute (LSP). Architected and configured the
              project's Git version control system, including setting up
              repository rules and branch strategies for a 4-team environment.
              Responsible for developing the authentication module.
            </p>
          </div>
        </section>

        {/* ORGANIZATIONAL EXPERIENCE */}
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b-2 border-black mb-3">
            Organizational Experience
          </h2>

          {/* IMPP 1 */}
          <div className="mb-4">
            <div className="flex justify-between font-bold text-gray-900">
              <span>Ikatan Mahasiswa Pemalang Polines (IMPP)</span>
              <span>June 2025 - Present</span>
            </div>
            <div className="italic text-gray-800 mb-1">
              Coordinator, Communication & Info. Division
            </div>
            <ul className="list-disc list-outside ml-5 text-gray-900 space-y-1">
              <li>
                Leading and coordinating the division in managing all digital
                platforms, including Instagram strategy, feed creation, and
                organizational email operations.
              </li>
              <li>
                Currently spearheading the development and maintenance of the
                official organizational website (IMPP).
              </li>
            </ul>
          </div>

          {/* PCC */}
          <div className="mb-4">
            <div className="flex justify-between font-bold text-gray-900">
              <span>UKM Polytechnic Computer Club (PCC)</span>
              <span>May 2025 - Present</span>
            </div>
            <div className="italic text-gray-800 mb-1">
              Staff, Maintenance Department
            </div>
            <ul className="list-disc list-outside ml-5 text-gray-900 space-y-1">
              <li>
                Acting as department treasurer, responsible for managing
                activity funds and maintaining accurate financial records.
              </li>
              <li>
                Providing technical support and device servicing (PC, laptop,
                printer) for the general public through the maintenance
                division.
              </li>
            </ul>
          </div>

          {/* IMPP 2 */}
          <div className="mb-4">
            <div className="flex justify-between font-bold text-gray-900">
              <span>Ikatan Mahasiswa Pemalang Polines (IMPP)</span>
              <span>Sept 2024 - May 2025</span>
            </div>
            <div className="italic text-gray-800 mb-1">
              Staff, Communication & Info. Division
            </div>
            <ul className="list-disc list-outside ml-5 text-gray-900 space-y-1">
              <li>
                Created and managed visual content for organizational social
                media, including Instagram feeds and stories for national
                holidays.
              </li>
              <li>
                Designed and edited campus materials for socialization and
                events, successfully increasing digital platform engagement.
              </li>
            </ul>
          </div>
        </section>

        {/* SKILLS AND LANGUAGE */}
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b-2 border-black mb-3">
            Skills and Language
          </h2>
          <div className="space-y-2 text-gray-900">
            <div>
              <span className="font-bold">Technical Skills: Languages:</span>{' '}
              PHP, JavaScript, Python, SQL, HTML5, CSS3 |{' '}
              <span className="font-bold">Frameworks:</span> Laravel, React.js,
              Next.js, Vue.js, Tailwind CSS |{' '}
              <span className="font-bold">Databases:</span> MySQL, MongoDB
            </div>
            <div>
              <span className="font-bold">Soft Skills:</span> Teamwork &
              Collaboration, Effective Communication, Time Management &
              Deadline-Oriented, Adaptable & Fast Learner, Detail-Oriented,
              Analytical & Problem-Solving.
            </div>
            <div>
              <span className="font-bold">Language:</span> Indonesian (Native),{' '}
              <span className="font-bold">English</span> (Professional Working
              Proficiency | TEPPS Score: 580)
            </div>
          </div>
        </section>
      </div>

      <style type="text/css" media="print">
        {`
          @page { size: auto; margin: 0mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          html, body { height: 100%; overflow: visible !important; }
        `}
      </style>
    </div>
  );
};

export default Resume;
