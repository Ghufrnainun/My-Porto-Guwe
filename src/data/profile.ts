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

export type CredentialDomain = 'flagship' | 'cloud' | 'database' | 'ai-data' | 'foundations';

export interface Certification {
  title: string;
  issuer: string;
  year: string;
  category?: string;
  highlight?: string;
  credentialType?: 'national' | 'industry' | 'language' | 'vendor' | 'academic';
  domain: CredentialDomain;
  isFlagship?: boolean;
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
  { id: 'flagship', label: 'Flagship & Verified' },
  { id: 'cloud', label: 'Cloud & Back-End' },
  { id: 'database', label: 'Database & SQL' },
  { id: 'ai-data', label: 'AI & Data Science' },
  { id: 'foundations', label: 'Web & Foundations' },
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
    domain: 'flagship',
    isFlagship: true,
    credentialId: '2512RE1559',
    verificationUrl: 'https://mikrotik.com/certificate/2512RE1559',
    description:
      'Sertifikasi internasional rekayasa routing tingkat lanjut dari MikroTik. Mencakup arsitektur routing statis dan dinamis, protokol OSPF (multi-area, virtual link, summarization), VPN tunnel point-to-point (IPIP, EoIP, GRE, PPTP, L2TP), serta implementasi VLAN dan routing inter-VLAN enterprise.',
    competencies: [
      'Static Routing: recursive routing, ECMP, policy-based routing',
      'Dynamic Routing OSPF: single-area, multi-area, virtual links, LSA types, summarization',
      'Point-to-Point VPN Tunnels: IPIP, EoIP, GRE, PPTP, L2TP, SSTP',
      'VLAN & Inter-VLAN Enterprise Routing: Q-in-Q, bridge VLAN filtering',
      'Network Diagnostics, MTU Path Discovery & BFD Protocol',
    ],
  },
  {
    title: 'Samsung Innovation Campus (SIC) Stage 7',
    issuer: 'Samsung Electronics Indonesia & Polines',
    year: '2025',
    category: 'Global Tech Program',
    highlight: 'Samsung Innovation Campus',
    credentialType: 'industry',
    domain: 'flagship',
    isFlagship: true,
    credentialId: '0890/SEIN-CC-SIC7/CP/Mahasiswa/2025-2026',
    description:
      'Program akselerasi talenta teknologi global oleh Samsung Electronics Indonesia. Berfokus pada pemahaman kecerdasan buatan terapan, rekayasa data, pemecahan masalah algoritma, dan implementasi proyek berbasis industri.',
    competencies: [
      'Artificial Intelligence & Machine Learning Fundamentals',
      'Python Programming & Data Manipulation Pipelines',
      'Industrial Problem Solving & Solution Prototyping',
      'Ethics, Security & Governance in Applied AI Systems',
    ],
  },
  {
    title: 'BNSP Junior Web Developer',
    issuer: 'Badan Nasional Sertifikasi Profesi (BNSP)',
    year: '2025',
    category: 'National Competence (SKKNI)',
    highlight: 'Certified Web Developer',
    credentialType: 'national',
    domain: 'flagship',
    isFlagship: true,
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
    title: 'TEPPS 580 (English Proficiency for Technical Purposes)',
    issuer: 'English Proficiency Center',
    year: '2024',
    category: 'Language Proficiency',
    highlight: 'Score 580 (High Working Proficiency)',
    credentialType: 'language',
    domain: 'flagship',
    isFlagship: true,
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
      'Sertifikasi resmi Oracle Academy yang memvalidasi kemahiran dalam manipulasi data relasional, penulisan query kompleks SQL (joins, subqueries, aggregation), serta pembuatan dan pengelolaan objek basis data tingkat enterprise.',
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
      'Sertifikasi arsitektur basis data relasional dari Oracle Academy. Memvalidasi kemampuan pemodelan Entity-Relationship (ERD), normalisasi data (1NF, 2NF, 3NF), pemetaan konseptual ke fisik, dan integritas referensial.',
    competencies: [
      'Entity-Relationship Diagram (ERD) & Conceptual Data Modeling',
      'Database Normalization: First through Third Normal Form (1NF to 3NF)',
      'Unique Identifiers (UID), Primary Keys, and Foreign Key Constraints',
      'Mapping Conceptual Data Models to Physical Relational Schemas',
      'Historical Data Modeling & Business Rule Constraints',
    ],
  },
  {
    title: 'Database Developer Competency Certification',
    issuer: 'Professional Competency Board',
    year: '2026',
    issueDate: '07 January 2026',
    category: 'Database Engineering',
    highlight: 'Database Developer',
    credentialType: 'industry',
    domain: 'database',
    credentialId: '2819586339GN',
    description:
      'Sertifikat pengujian kompetensi terapan sebagai Database Developer, mencakup implementasi skema relasional, optimasi query, dan pengelolaan integritas data tingkat produksi.',
    competencies: [
      'Relational Schema Optimization & Indexing Strategy',
      'Stored Procedures, Triggers & Scripting Fundamentals',
      'Data Integrity & ACID Transaction Principles',
    ],
  },
  {
    title: 'Belajar Dasar Structured Query Language (SQL)',
    issuer: 'Dicoding Indonesia',
    year: '2025',
    category: 'Database & Query',
    highlight: 'Structured Query Language',
    credentialType: 'industry',
    domain: 'database',
    credentialId: 'ERZREJ5WOXYV',
    verificationUrl: 'https://www.dicoding.com/certificates/ERZREJ5WOXYV',
    description:
      'Penguasaan dasar-dasar pengelolaan basis data relasional menggunakan bahasa SQL standar: seleksi data terarah, agregasi, filtering bertingkat, dan penggabungan relasi multi-tabel.',
    competencies: [
      'Data Retrieval with SELECT, Filtering with WHERE & LIKE',
      'Aggregate Functions & GROUP BY / HAVING Clauses',
      'Inner Join, Left Join, and Multi-Table Relationships',
    ],
  },
  {
    title: 'Cloud Practitioner Essentials (Belajar Dasar AWS Cloud)',
    issuer: 'Dicoding Indonesia & AWS',
    year: '2025',
    category: 'Cloud Infrastructure',
    highlight: 'AWS Cloud Fundamentals',
    credentialType: 'industry',
    domain: 'cloud',
    credentialId: '1OP82L641PQK',
    verificationUrl: 'https://www.dicoding.com/certificates/1OP82L641PQK',
    description:
      'Kursus terakreditasi AWS yang mencakup konsep dasar komputasi awan, infrastruktur global AWS, layanan komputasi (EC2, Lambda), penyimpanan (S3, EBS), jaringan (VPC), serta keamanan dan manajemen biaya.',
    competencies: [
      'Konsep Komputasi Awan & Model Deployment',
      'Infrastruktur Global AWS: Regions, Availability Zones, Edge Locations',
      'Layanan Inti: Amazon EC2, AWS Lambda, Amazon S3, Amazon RDS',
      'Prinsip Keamanan Cloud, AWS IAM, & Shared Responsibility Model',
      'Arsitektur Cloud Andal (AWS Well-Architected Framework)',
    ],
  },
  {
    title: 'Membuat Aplikasi Back-End untuk Pemula dengan Google Cloud',
    issuer: 'Dicoding Indonesia & Google Cloud',
    year: '2025',
    category: 'Cloud Back-End',
    highlight: 'Google Cloud Deployment',
    credentialType: 'industry',
    domain: 'cloud',
    credentialId: 'GRX536K1YZ0M',
    verificationUrl: 'https://www.dicoding.com/certificates/GRX536K1YZ0M',
    description:
      'Membangun layanan RESTful API dengan Node.js dan mendeploy aplikasi ke platform Google Cloud (Google Compute Engine / Cloud Storage) dengan arsitektur scalable dan aman.',
    competencies: [
      'Arsitektur RESTful API dengan Node.js (Hapi Framework)',
      'Deployment Aplikasi ke Google Compute Engine (Virtual Machine)',
      'Integrasi Google Cloud Storage untuk Media & Assets',
      'Postman Automated API Testing & Validation',
    ],
  },
  {
    title: 'Belajar Back-End Pemula dengan JavaScript',
    issuer: 'Dicoding Indonesia',
    year: '2025',
    category: 'Back-End Engineering',
    highlight: 'Node.js REST API',
    credentialType: 'industry',
    domain: 'cloud',
    credentialId: '0LZ0R2OMRP65',
    verificationUrl: 'https://www.dicoding.com/certificates/0LZ0R2OMRP65',
    description:
      'Pengembangan server HTTP dan RESTful API modern berbasis Node.js, pengelolaan route dinamis, penanganan request payload JSON, dan persistent storage handling.',
    competencies: [
      'Node.js Core Modules & Event-Driven Architecture',
      'Membangun Web Service RESTful dengan Framework Hapi',
      'Routing, Request Body Parsing, Query Parameter Handling',
      'CORS, Error Handling, & Automated Testing',
    ],
  },
  {
    title: 'Belajar Dasar AI',
    issuer: 'Dicoding Indonesia',
    year: '2024',
    category: 'Artificial Intelligence',
    highlight: 'Artificial Intelligence',
    credentialType: 'industry',
    domain: 'ai-data',
    credentialId: '1OP84O29LZQK',
    verificationUrl: 'https://www.dicoding.com/certificates/1OP84O29LZQK',
    description:
      'Pengenalan komprehensif konsep Artificial Intelligence: Machine Learning, Deep Learning, Natural Language Processing (NLP), Computer Vision, serta etika implementasi AI.',
    competencies: [
      'Taksonomi AI: Machine Learning, Supervised vs Unsupervised',
      'Konsep Deep Learning, Jaringan Saraf Tiruan, Computer Vision',
      'Natural Language Processing & Generative AI Principles',
      'Tata Kelola & Etika Penerapan Sistem AI',
    ],
  },
  {
    title: 'Belajar Dasar Data Science',
    issuer: 'Dicoding Indonesia',
    year: '2025',
    category: 'Data Science',
    highlight: 'Data Science Pipeline',
    credentialType: 'industry',
    domain: 'ai-data',
    credentialId: 'RVZKW709EZD5',
    verificationUrl: 'https://www.dicoding.com/certificates/RVZKW709EZD5',
    description:
      'Siklus hidup data science: perumusan masalah analitik, pengumpulan data, data wrangling, eksplorasi data (EDA), dan interpretasi insight bisnis terukur.',
    competencies: [
      'Data Science Life Cycle & Problem Framing',
      'Data Wrangling, Cleaning, and Preprocessing',
      'Exploratory Data Analysis (EDA) Fundamentals',
      'Komunikasi Temuan Berdasarkan Bukti Data',
    ],
  },
  {
    title: 'Belajar Dasar Visualisasi Data',
    issuer: 'Dicoding Indonesia',
    year: '2024',
    category: 'Data Visualization',
    highlight: 'Visual Data Analytics',
    credentialType: 'industry',
    domain: 'ai-data',
    credentialId: '0LZ042O0NP65',
    verificationUrl: 'https://www.dicoding.com/certificates/0LZ042O0NP65',
    description:
      'Prinsip desain visualisasi data yang efektif: pemilihan jenis bagan grafis, eksplorasi visual terarah, persepsi kognitif, dan komunikasi insight analitik secara jernih.',
    competencies: [
      'Prinsip Desain Visualisasi & Kognisi Penglihatan',
      'Chart Selection Strategy (Distribusi, Komposisi, Komparasi)',
      'Storytelling with Data & Insight Delivery',
    ],
  },
  {
    title: 'Memulai Pemrograman dengan Python',
    issuer: 'Dicoding Indonesia',
    year: '2025',
    category: 'Python Programming',
    highlight: 'Python Language Fundamentals',
    credentialType: 'industry',
    domain: 'ai-data',
    credentialId: 'JLX19Y4QGP72',
    verificationUrl: 'https://www.dicoding.com/certificates/JLX19Y4QGP72',
    description:
      'Pemrograman Python modern: tipe data dinamis, kontrol alur logika, struktur fungsi modular, manipulasi berkas, dan pemrograman berorientasi objek dalam ekosistem Python.',
    competencies: [
      'Python Syntax, Control Flow, and Exception Handling',
      'Data Structures: Lists, Tuples, Dictionaries, Sets',
      'Functions, Variable Scope, and Reusable Modules',
      'Object-Oriented Programming (OOP) in Python',
    ],
  },
  {
    title: 'Belajar Dasar Pemrograman Web',
    issuer: 'Dicoding Indonesia',
    year: '2025',
    category: 'Web Foundations',
    highlight: 'Front-End Web Foundations',
    credentialType: 'industry',
    domain: 'foundations',
    credentialId: 'KEXL7N2WWXG2',
    verificationUrl: 'https://www.dicoding.com/certificates/KEXL7N2WWXG2',
    description:
      'Penguasaan fondasi web modern: semantik HTML5, CSS3 layouting (Flexbox, Grid), responsivitas multi-device, dan interaktivitas JavaScript DOM standar industri.',
    competencies: [
      'Semantic HTML5 Architecture & Accessibility Standards',
      'Modern CSS Layouts: Flexbox, CSS Grid, Media Queries',
      'Responsive Web Design for Mobile and Desktop Viewports',
      'JavaScript DOM Manipulation & Event Listeners',
    ],
  },
  {
    title: 'Belajar Dasar Pemrograman JavaScript',
    issuer: 'Dicoding Indonesia',
    year: '2025',
    category: 'JavaScript Foundations',
    highlight: 'ECMAScript 6+ Modern',
    credentialType: 'industry',
    domain: 'foundations',
    credentialId: 'GRX53D2WYZ0M',
    verificationUrl: 'https://www.dicoding.com/certificates/GRX53D2WYZ0M',
    description:
      'Fondasi mendalam bahasa JavaScript: sintaks ES6+, Object-Oriented Programming (OOP), Functional Programming, dan penanganan asinkron (Promises, Async/Await).',
    competencies: [
      'JavaScript ES6+ Syntax, Data Structures & Modules',
      'Object-Oriented Programming (OOP) & Prototypal Inheritance',
      'Functional Programming Paradigms (Map, Filter, Reduce)',
      'Asynchronous JavaScript: Callback, Promise, Async/Await',
    ],
  },
  {
    title: 'Pengenalan ke Logika Pemrograman (Programming Logic 101)',
    issuer: 'Dicoding Indonesia',
    year: '2024',
    category: 'Computer Science Logic',
    highlight: 'Algorithm & Logic',
    credentialType: 'industry',
    domain: 'foundations',
    credentialId: 'JLX14ERYNX72',
    verificationUrl: 'https://www.dicoding.com/certificates/JLX14ERYNX72',
    description:
      'Berpikir komputasional dan logika algoritma dasar: abstraksi masalah, perancangan flowchart standar, pseudocode, rekursi, dan efisiensi algoritma pemrograman.',
    competencies: [
      'Computational Thinking & Problem Decomposition',
      'Flowchart and Pseudocode Standardization',
      'Algorithmic Branching, Looping, and Recursion',
    ],
  },
  {
    title: 'RevoU Tech Fundamental Course',
    issuer: 'RevoU',
    year: '2024',
    issueDate: '07 June 2024',
    category: 'Tech Fundamentals',
    highlight: 'Tech Foundation Certified',
    credentialType: 'industry',
    domain: 'foundations',
    description:
      'Pelatihan intensif 2 pekan mengenai lanskap industri teknologi modern, metodologi agile, framework produk digital, dan problem solving perangkat lunak terapan.',
    competencies: [
      'Tech Industry Landscape & Product Methodologies',
      'Practical Problem Solving & Analytical Thinking',
      'Collaboration in Agile Development Environments',
    ],
  },
  {
    title: 'Pendidikan Dasar & Sertifikasi IT Hardware PCC',
    issuer: 'Polytechnic Computer Club (PCC)',
    year: '2024',
    category: 'Hardware & Infrastructure',
    highlight: 'IT Hardware & Support',
    credentialType: 'academic',
    domain: 'foundations',
    credentialId: '5081/PL4.6.2/DT.01.01/2024',
    description:
      'Pelatihan dan pengujian teknis perangkat keras komputer, perakitan, troubleshooting hardware, infrastruktur jaringan kabel/nirkabel lokal, dan pendukung operasional IT.',
    competencies: [
      'Computer Hardware Assembly, Maintenance & Diagnostics',
      'Local Area Networking (LAN) Installation & Configuration',
      'Peripherals, Power Supply & Storage Troubleshooting',
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
