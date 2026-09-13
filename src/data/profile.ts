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

export type CredentialDomain = 'verified' | 'database' | 'language';

export interface Certification {
  title: string;
  issuer: string;
  year: string;
  category?: string;
  highlight?: string;
  credentialType?: 'national' | 'industry' | 'language' | 'vendor' | 'academic';
  domain: CredentialDomain;
  isFlagship?: boolean;
  /**
   * True only when the issuer hosts a public lookup page where anyone can check
   * the ID themselves. Everything else is self-attested and must not claim otherwise.
   */
  isVerifiedTransaction?: boolean;
  score?: string;
  credentialId?: string;
  verificationUrl?: string;
  issueDate?: string;
  validUntil?: string;
  description?: string;
  competencies?: readonly string[];
}

export const credentialDomains: { id: CredentialDomain | 'all'; label: string; count?: number }[] = [
  { id: 'all', label: 'All Credentials' },
  { id: 'verified', label: 'Network Engineering' },
  { id: 'database', label: 'Database & SQL' },
  { id: 'language', label: 'Language' },
];

export const certifications: readonly Certification[] = [
  {
    title: 'MikroTik Certified Routing Engineer (MTCRE)',
    issuer: 'MikroTik',
    year: '2025',
    issueDate: '09 December 2025',
    validUntil: '09 December 2028',
    category: 'International Networking',
    highlight: 'Certified Routing Engineer',
    credentialType: 'vendor',
    domain: 'verified',
    isFlagship: true,
    isVerifiedTransaction: true,
    credentialId: '2512RE1559',
    verificationUrl: 'https://mikrotik.com/certificates',
    description:
      'Sertifikasi tingkat lanjut rekayasa routing dari MikroTik, jenjang setelah MTCNA. Mencakup routing statis dan dinamis, OSPF multi-area, VPN tunnel point-to-point, serta VLAN dan routing inter-VLAN.',
    competencies: [
      'Static Routing: recursive routing, ECMP, policy-based routing',
      'Dynamic Routing OSPF: single-area, multi-area, virtual links, LSA types, summarization',
      'Point-to-Point VPN Tunnels: IPIP, EoIP, GRE, PPTP, L2TP, SSTP',
      'VLAN & Inter-VLAN Enterprise Routing: Q-in-Q, bridge VLAN filtering',
      'Network Diagnostics, MTU Path Discovery & BFD Protocol',
    ],
  },
  {
    title: 'MikroTik Certified Network Associate (MTCNA)',
    issuer: 'MikroTik',
    year: '2025',
    issueDate: '28 November 2025',
    validUntil: '28 November 2028',
    category: 'International Networking',
    highlight: 'Certified Network Associate',
    credentialType: 'vendor',
    domain: 'verified',
    isFlagship: true,
    isVerifiedTransaction: true,
    credentialId: '2511NA7322',
    verificationUrl: 'https://mikrotik.com/certificates',
    description:
      'Sertifikasi asosiasi resmi MikroTik, prasyarat untuk jenjang MTCRE. Menguji dasar RouterOS, konfigurasi routing dan bridging, manajemen bandwidth, firewall, serta setup jaringan nirkabel.',
    competencies: [
      'RouterOS Fundamentals & Configuration Management',
      'Routing & Bridging Basics, DHCP Client and Server',
      'Firewall, NAT & Bandwidth Management (Queue)',
      'Wireless Fundamentals (802.11) & Security Profiles',
      'Network Troubleshooting & Monitoring Tools',
    ],
  },
  {
    title: 'Oracle Database Programming with SQL',
    issuer: 'Oracle Academy',
    year: '2024',
    issueDate: '25 December 2024',
    category: 'Enterprise Database',
    highlight: 'Database Programming with SQL',
    credentialType: 'vendor',
    domain: 'database',
    description:
      'Sertifikasi resmi Oracle Academy yang memvalidasi kemahiran menulis query SQL kompleks, dari join dan subquery hingga pengelolaan objek basis data tingkat enterprise.',
    competencies: [
      'Complex SQL Queries: Joins, Aggregation Functions, and Grouping',
      'Subqueries: Single-row, Multiple-row, and Correlated Subqueries',
      'Data Definition Language (DDL) and Data Manipulation Language (DML)',
      'Database Constraints, Views, Indexes, and Sequences Management',
      'Transaction Control and Relational Data Integrity',
    ],
  },
  {
    title: 'Oracle Database Design',
    issuer: 'Oracle Academy',
    year: '2024',
    issueDate: '23 December 2024',
    category: 'Database Architecture',
    highlight: 'Database Design',
    credentialType: 'vendor',
    domain: 'database',
    description:
      'Sertifikasi arsitektur basis data relasional dari Oracle Academy, mencakup pemodelan Entity-Relationship, normalisasi, dan pemetaan model konseptual ke skema fisik.',
    competencies: [
      'Entity-Relationship Diagram (ERD) & Conceptual Data Modeling',
      'Database Normalization: First through Third Normal Form (1NF to 3NF)',
      'Unique Identifiers (UID), Primary Keys, and Foreign Key Constraints',
      'Mapping Conceptual Data Models to Physical Relational Schemas',
      'Historical Data Modeling & Business Rule Constraints',
    ],
  },
  {
    title: 'TEPPS 580 (English Proficiency for Technical Purposes)',
    issuer: 'English Proficiency Center',
    year: '2024',
    category: 'Language Proficiency',
    highlight: 'Score 580 (High Working Proficiency)',
    credentialType: 'language',
    domain: 'language',
    isFlagship: true,
    score: '580 / 677',
    description:
      'Test of English for Professional Purposes dengan skor 580 dari 677, setara CEFR B2. Mencakup pemahaman dokumentasi teknis dan komunikasi profesional tertulis.',
    competencies: [
      'Reading Comprehension: Documentation & Software Specifications',
      'Listening Comprehension: Technical Discussions & Business Meetings',
      'Language Structure & Grammar: Written Professional Communication',
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
