export interface OrganizationExperience {
  organization: string;
  role: string;
  period: string;
  active: boolean;
  responsibilities: string[];
}

export const profile = {
  name: 'Ghufron Ainun Najib',
  semester: 5,
  availability: 'Open to opportunities',
  location: 'Semarang, Indonesia',
  email: 'ghufrnainunajib@gmail.com',
  phone: '+62 896 0759 3219',
  website: 'https://ghufronainun.tech',
  github: 'https://github.com/Ghufrnainun',
  linkedin: 'https://www.linkedin.com/in/ghufronainunnajib/',
} as const;

export const education = {
  degree: 'Bachelor of Applied Science in Computer Engineering',
  university: 'Semarang State Polytechnic (Polines)',
  period: 'August 2024 - August 2028',
  expectedGraduation: 'August 2028',
  gpa: '3.89/4.00',
  focusAreas: ['Web Development', 'System Design', 'Database Design', 'Software Engineering'],
} as const;

export const organizationExperience: OrganizationExperience[] = [
  {
    organization: 'Ikatan Mahasiswa Pemalang Polines (IMPP)',
    role: 'Coordinator, Communication & Information Division',
    period: 'June 2025 - June 2026',
    active: false,
    responsibilities: [
      'Coordinated the division responsible for the organization\'s digital communication channels.',
      'Developed and maintained the organization website and its content workflow.',
    ],
  },
  {
    organization: 'Polytechnic Computer Club (PCC)',
    role: 'Maintenance Staff',
    period: 'May 2025 - May 2026',
    active: false,
    responsibilities: [
      'Supported maintenance activities and managed departmental financial records.',
      'Provided technical support for computers, laptops, and printers.',
    ],
  },
  {
    organization: 'Ikatan Mahasiswa Pemalang Polines (IMPP)',
    role: 'Staff, Communication & Information Division',
    period: 'September 2024 - May 2025',
    active: false,
    responsibilities: [
      'Created visual content for the organization\'s social media channels.',
      'Prepared communication materials for organization activities and events.',
    ],
  },
];

export const certifications = [
  { title: 'Dicoding Web', issuer: 'Dicoding Indonesia', year: '2024' },
  { title: 'BNSP Junior Web Developer', issuer: 'BNSP', year: '2025' },
  { title: 'TEPPS 580', issuer: 'English Proficiency', year: '2024' },
] as const;

export interface Skill {
  name: string;
  /** Simple Icons slug — https://simpleicons.org */
  icon: string | null;
  /** Hex color used when hovered (visible on dark bg) */
  color: string;
}

export interface SkillTier {
  label: string;
  skills: Skill[];
}

export const skillTiers: SkillTier[] = [
  {
    label: 'Core',
    skills: [
      { name: 'Next.js',     icon: 'nextdotjs',   color: '#E2E8F0' },
      { name: 'TypeScript',  icon: 'typescript',  color: '#3178C6' },
      { name: 'React',       icon: 'react',       color: '#61DAFB' },
    ],
  },
  {
    label: 'Working',
    skills: [
      { name: 'Node.js',     icon: 'nodedotjs',   color: '#339933' },
      { name: 'Express.js',  icon: 'express',     color: '#E2E8F0' },
      { name: 'Docker',      icon: 'docker',      color: '#2496ED' },
      { name: 'Firebase',    icon: 'firebase',    color: '#FFCA28' },
      { name: 'Supabase',    icon: 'supabase',    color: '#3ECF8E' },
      { name: 'Convex',      icon: null,          color: '#F97316' },
      { name: 'MongoDB',     icon: 'mongodb',     color: '#47A248' },
      { name: 'PostgreSQL',  icon: 'postgresql',  color: '#4169E1' },
      { name: 'Nginx',       icon: 'nginx',       color: '#009639' },
    ],
  },
  {
    label: 'Familiar',
    skills: [
      { name: 'PHP',     icon: 'php',     color: '#777BB4' },
      { name: 'Python',  icon: 'python',  color: '#3776AB' },
      { name: 'Dart',    icon: 'dart',    color: '#0175C2' },
      { name: 'Flutter', icon: 'flutter', color: '#54C5F8' },
    ],
  },
];
