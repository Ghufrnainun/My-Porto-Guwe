export interface OrganizationExperience {
  organization: string;
  role: string;
  period: string;
  active: boolean;
  responsibilities: string[];
  category?: string;
  badge?: string;
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
  gpa: '3.91/4.00',
  focusAreas: ['Web Development', 'System Design', 'Database Design', 'Software Engineering'],
} as const;

export const organizationExperience: OrganizationExperience[] = [
  {
    organization: 'Ikatan Mahasiswa Pemalang Polines (IMPP)',
    role: 'Coordinator, Communication & Information Division',
    period: 'June 2025 - June 2026',
    active: false,
    category: 'Web & Digital Systems',
    badge: 'Division Head',
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
    category: 'IT Hardware & Support',
    badge: 'Hardware Support',
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
    category: 'Media & Publishing',
    badge: 'Staff',
    responsibilities: [
      'Created visual content for the organization\'s social media channels.',
      'Prepared communication materials for organization activities and events.',
    ],
  },
];

export interface Certification {
  title: string;
  issuer: string;
  year: string;
  category?: string;
  highlight?: string;
  credentialType?: 'national' | 'industry' | 'language';
  score?: string;
  credentialId?: string;
  verificationUrl?: string;
  description?: string;
  competencies?: readonly string[];
}

export const certifications: readonly Certification[] = [
  {
    title: 'BNSP Junior Web Developer',
    issuer: 'Badan Nasional Sertifikasi Profesi',
    year: '2025',
    category: 'National Competence (SKKNI)',
    highlight: 'Certified Web Developer',
    credentialType: 'national',
    credentialId: 'BNSP-JWD-2025-0982',
    description:
      'Sertifikasi kompetensi kerja nasional bidang pengembangan web berbasis Standar Kompetensi Kerja Nasional Indonesia (SKKNI). Menilai kemampuan teknis pemrograman terstruktur, implementasi logika algoritma, dan arsitektur web standar industri.',
    competencies: [
      'Mengimplementasikan Pemrograman Terstruktur',
      'Menerapkan Logika & Algoritma Pemrograman Tingkat Dasar',
      'Merancang & Mengelola Struktur Basis Data Relasional',
      'Mengimplementasikan Antarmuka Web Responsif Standar SKKNI',
      'Menerapkan Prinsip Keamanan & Validasi Input Aplikasi Web',
    ],
  },
  {
    title: 'Dicoding Web',
    issuer: 'Dicoding Indonesia',
    year: '2024',
    category: 'Industry Specialization',
    highlight: 'Front-End Web Development',
    credentialType: 'industry',
    credentialId: 'DCDG-FE-2024-4192',
    verificationUrl: 'https://www.dicoding.com/certificates/DCDG-FE-2024-4192',
    description:
      'Program spesialisasi front-end web modern terakreditasi industri (Google Developers Authorized Partner). Berfokus pada pembangunan web aplikasi interaktif, konsumsi RESTful API, dan Progressive Web Apps (PWA).',
    competencies: [
      'Modern JavaScript ES6+, DOM Manipulation & State Management',
      'Konsumsi REST API Asinkron & Penanganan Error Terstruktur',
      'Arsitektur Web Components & Modular Codebase',
      'Progressive Web Apps (PWA) & Offline Caching Strategy',
    ],
  },
  {
    title: 'TEPPS 580',
    issuer: 'English Proficiency',
    year: '2024',
    category: 'Language Proficiency',
    highlight: 'Score 580 (High Working Proficiency)',
    credentialType: 'language',
    score: '580 / 677',
    credentialId: 'TEPPS-2024-580-LP3I',
    description:
      'Test of English for Professional Purposes (TEPPS) dengan skor 580 dari skala 677. Mengindikasikan kecakapan kerja tingkat tinggi (High Working Proficiency / Setara CEFR B2), mampu berdiskusi teknis, memahami dokumentasi rekayasa perangkat lunak, serta berkolaborasi dalam tim internasional.',
    competencies: [
      'Reading Comprehension: Dokumentasi Teknis & Spesifikasi Perangkat Lunak',
      'Listening Comprehension: Diskusi Tim Teknis & Pertemuan Bisnis',
      'Language Structure & Grammar: Komunikasi Profesional Tertulis',
    ],
  },
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
    label: 'Languages',
    skills: [
      { name: 'JavaScript', icon: 'javascript', color: '#F7DF1E' },
      { name: 'TypeScript', icon: 'typescript', color: '#3178C6' },
      { name: 'PHP', icon: 'php', color: '#777BB4' },
      { name: 'Python', icon: 'python', color: '#3776AB' },
      { name: 'Dart', icon: 'dart', color: '#0175C2' },
      { name: 'HTML', icon: 'html5', color: '#E34F26' },
      { name: 'CSS', icon: 'css', color: '#1572B6' },
      { name: 'SQL', icon: 'mysql', color: '#4479A1' },
    ],
  },
  {
    label: 'Frontend',
    skills: [
      { name: 'React', icon: 'react', color: '#61DAFB' },
      { name: 'Next.js', icon: 'nextdotjs', color: '#E2E8F0' },
      { name: 'Tailwind CSS', icon: 'tailwindcss', color: '#06B6D4' },
    ],
  },
  {
    label: 'Backend & data',
    skills: [
      { name: 'Laravel', icon: 'laravel', color: '#FF2D20' },
      { name: 'Node.js', icon: 'nodedotjs', color: '#5FA04E' },
      { name: 'Convex', icon: 'convex', color: '#F97316' },
      { name: 'Supabase', icon: 'supabase', color: '#3ECF8E' },
      { name: 'Firebase', icon: 'firebase', color: '#FFCA28' },
      { name: 'PostgreSQL', icon: 'postgresql', color: '#4169E1' },
    ],
  },
  {
    label: 'Mobile & AI',
    skills: [
      { name: 'Flutter', icon: 'flutter', color: '#02569B' },
    ],
  },
  {
    label: 'Workflow',
    skills: [
      { name: 'Git', icon: 'git', color: '#F05032' },
      { name: 'GitHub', icon: 'github', color: '#E2E8F0' },
      { name: 'Docker', icon: 'docker', color: '#2496ED' },
      { name: 'Figma', icon: 'figma', color: '#F24E1E' },
    ],
  },
];
