import { GraduationCap, Trophy } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

// Data structures
interface EducationData {
  degree: string;
  university: string;
  period: string;
  gpa: string;
  focusAreas: string[];
}

interface OrganizationExperience {
  organization: string;
  role: string;
  period: string;
  isCurrent: boolean;
  responsibilities: string[];
}

interface Certification {
  title: string;
  issuer: string;
  year: string;
  type: 'technical' | 'language' | 'workshop';
}

const education: EducationData = {
  degree: 'Bachelor of Applied Science in Computer Engineering',
  university: 'Semarang State Polytechnic (Polines)',
  period: 'Aug 2024 - 2028 (Expected)',
  gpa: '3.85 / 4.00',
  focusAreas: [
    'Backend Engineering',
    'System Architecture',
    'Database Design',
    'Web Development',
    'Version Control',
  ],
};

const experiences: OrganizationExperience[] = [
  {
    organization: 'IMPP (Polytechnic Student Association)',
    role: 'Communications Division Coordinator',
    period: '2024 - Present',
    isCurrent: true,
    responsibilities: [
      'Managed internal and external organizational communication strategies',
      'Led the creative team in content production and public relations',
      'Developed information systems to streamline organizational workflows',
    ],
  },
  {
    organization: 'Polytechnic Computer Club (PCC)',
    role: 'IT Staff & Developer',
    period: '2024 - Present',
    isCurrent: false,
    responsibilities: [
      'Contributed to the development of internal club IT projects',
      'Mentored new members in programming workshops and technical training',
      "Maintained and optimized the club's technical infrastructure",
    ],
  },
];

const certifications: Certification[] = [
  {
    title: 'Belajar Dasar Pemrograman Web',
    issuer: 'Dicoding Indonesia',
    year: '2024',
    type: 'technical',
  },
  {
    title: 'Junior Web Developer',
    issuer: 'BNSP',
    year: '2025',
    type: 'technical',
  },
  {
    title: 'TEPPS English Proficiency',
    issuer: 'Score: 580',
    year: '2024',
    type: 'language',
  },
  {
    title: 'React & Next.js Deep Dive',
    issuer: 'Workshop',
    year: '2024',
    type: 'workshop',
  },
];

export function Education() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="education"
      className="py-20 md:py-32 relative overflow-hidden bg-background"
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        {/* Section Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-muted-foreground font-mono text-sm mb-2">
            Background
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Education & Experience
          </h2>
        </motion.div>

        {/* PART 1: Education Card */}
        <motion.div
          ref={ref}
          className="bg-card border border-border rounded-2xl p-8 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left: Education Info (2 cols) */}
            <div className="md:col-span-2">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{education.degree}</h3>
                  <p className="text-muted-foreground">
                    {education.university}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mt-3">
                    <span className="text-muted-foreground font-mono text-sm">
                      {education.period}
                    </span>
                    <span className="bg-secondary text-foreground text-xs px-2 py-1 rounded font-medium">
                      GPA: {education.gpa}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Focus Areas (1 col) */}
            <div>
              <p className="text-xs uppercase text-muted-foreground tracking-wider mb-3">
                Focus Areas
              </p>
              <div className="flex flex-wrap gap-2">
                {education.focusAreas.map((area) => (
                  <span
                    key={area}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* PART 2: Experience Timeline - NO CARDS */}
        <div className="max-w-4xl mx-auto">
          <motion.p
            className="text-muted-foreground font-mono text-sm mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Organization Experience
          </motion.p>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-[7px] top-3 bottom-3 w-px bg-border" />

            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <motion.div
                  key={exp.organization}
                  className="relative pl-10"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                >
                  {/* Timeline Dot */}
                  <div
                    className={`absolute left-0 top-1.5 w-4 h-4 rounded-full ${
                      exp.isCurrent
                        ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]'
                        : 'border-2 border-muted bg-background'
                    }`}
                  />

                  {/* Content - No Card */}
                  <div>
                    {/* Header */}
                    <div className="mb-3">
                      <h4 className="text-lg font-bold">{exp.role}</h4>
                      <p className="text-muted-foreground">
                        {exp.organization}
                      </p>
                      <p className="text-muted-foreground font-mono text-sm mt-1">
                        {exp.period}
                      </p>
                    </div>

                    {/* Responsibilities */}
                    <ul className="space-y-2">
                      {exp.responsibilities.map((resp, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-muted-foreground text-sm"
                        >
                          <span className="text-gray-600 mt-1.5">•</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="mt-16 max-w-4xl mx-auto">
          <motion.p
            className="text-muted-foreground font-mono text-sm mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Certifications
          </motion.p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.title}
                className="p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-mono uppercase">
                    {cert.type}
                  </span>
                </div>
                <h4 className="font-medium text-sm mb-1 line-clamp-2">
                  {cert.title}
                </h4>
                <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {cert.year}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
