export interface PortfolioProject {
  title: string;
  slug: string;
  summary: string;
  year: string;
  role: string;
  team: {
    size: number;
    label: string;
  };
  visibility: 'public' | 'private';
  problem: string;
  contributions: string[];
  outcomes: string[];
  technologies: string[];
  image?: string;
  gallery?: string[];
  color: string;
  repository?: string;
  demo?: string;
}

export const featuredProjects: PortfolioProject[] = [
  {
    title: 'TempeMail',
    slug: 'tempe-mail',
    summary:
      'Disposable email service that runs entirely on Cloudflare Workers. Multi-domain, no VPS, no SMTP server, with a REST API, webhooks, and an MCP server for AI agents.',
    year: '2026',
    role: 'Solo Developer',
    team: { size: 1, label: 'Solo project' },
    visibility: 'public',
    problem:
      'Temp mail services are usually slow, single-domain, or closed-source. I wanted one that is self-hosted, multi-domain, and costs nothing to run.',
    contributions: [
      'Built the worker, email ingestion, and auto-provisioning for 20+ domains.',
      'Designed the REST API, HMAC-signed webhook delivery, and MCP server.',
      'Shipped a dark-theme vanilla JS frontend with inbox search and API key management.',
    ],
    outcomes: [
      'Runs on the Cloudflare edge with zero server cost.',
      '110 tests passing across 20+ live domains.',
    ],
    technologies: ['TypeScript', 'Cloudflare Workers', 'D1', 'Hono'],
    color: '#fb923c',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1400&auto=format&fit=crop',
    repository: 'https://github.com/Ghufrnainun/tempe-mail',
    demo: 'https://temp.atminku.my.id',
  },
  {
    title: 'SewaInAja',
    slug: 'sewainaja',
    summary:
      'A rental platform spanning a Flutter mobile experience and a Next.js 16 admin and API surface, built with TypeScript 5, Firebase, and Midtrans.',
    year: '2026',
    role: 'Full-Stack Developer',
    team: { size: 4, label: '4-person team' },
    visibility: 'public',
    problem:
      'The product needed one connected workflow for renters, owners, administrators, and payment handling across mobile and web surfaces.',
    contributions: [
      'Built customer-facing mobile flows with Flutter.',
      'Worked across the Next.js 16 administration and API surface with TypeScript 5.',
      'Integrated Firebase services and Midtrans payment handling.',
    ],
    outcomes: [
      'Connected the mobile product with the administration workflow.',
      'Delivered the project as a shared, publicly documented codebase.',
    ],
    technologies: ['Flutter', 'Next.js 16', 'TypeScript 5', 'Firebase', 'Midtrans'],
    color: '#14b8a6',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop',
    repository: 'https://github.com/sewainaja-pbl',
  },
  {
    title: 'LSP Polines Certification Platform',
    slug: 'lsp-polines',
    summary:
      'A certification website developed with a five-person team, with ownership across team leadership, authentication, and Git workflow setup.',
    year: '2025',
    role: 'Team Lead',
    team: { size: 5, label: '5-person team' },
    visibility: 'private',
    problem:
      'The team needed to deliver a certification platform while keeping authentication work and collaborative development coordinated.',
    contributions: [
      'Led a five-person team through analysis, design, and implementation.',
      'Developed the authentication module.',
      'Set up repository rules, branching strategy, and the shared Git workflow.',
    ],
    outcomes: [
      'Delivered the certification website as a coordinated team project.',
      'Established a repeatable contribution workflow for the development team.',
    ],
    technologies: ['Laravel', 'Livewire', 'Tailwind CSS', 'MySQL'],
    color: '#22d3c5',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1400&auto=format&fit=crop',
  },
  {
    title: 'IMPP Organization Website',
    slug: 'impp-website',
    summary:
      'The public website and CMS for Ikatan Mahasiswa Pemalang Polines, built independently with tools for managing organization content.',
    year: '2025',
    role: 'Solo Developer',
    team: { size: 1, label: 'Solo project' },
    visibility: 'private',
    problem:
      'The organization needed a maintained public presence and a practical way to update its structure, activities, and gallery.',
    contributions: [
      'Designed and developed the public-facing website independently.',
      'Built the CMS and administration workflow for organization content.',
      'Implemented content management for activities, structure, and the gallery.',
    ],
    outcomes: [
      'Published the organization website for public access.',
      'Centralized routine website updates in a dedicated CMS.',
    ],
    technologies: ['Laravel', 'MySQL', 'Tailwind CSS'],
    image: '/impp-screenshot.png',
    gallery: ['/impp-screenshot.png'],
    color: '#38bdf8',
    demo: 'https://imppolines.my.id/',
  },
];

export function getPortfolioProject(slug: string) {
  return featuredProjects.find((project) => project.slug === slug);
}
