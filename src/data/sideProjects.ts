export interface SideProjectBadge {
  label: string;
  variant?: 'accent' | 'default' | 'outline';
}

export interface SideProject {
  title: string;
  category: string;
  description: string;
  year: string;
  technologies: readonly string[];
  github: string;
  demo?: string;
  badge?: SideProjectBadge;
}

export const sideProjects: readonly SideProject[] = [
  {
    title: 'CEPAT (Itechno-CEPAT)',
    category: 'Hyperlocal Micro-freelancing',
    description:
      'Hyperlocal freelance and skill exchange platform connecting students with local MSMEs via PostGIS radius calculations (under 2 km), sealed bidding, escrow balance protection, and realtime chat.',
    year: '2026',
    technologies: ['Next.js 16', 'React 19', 'Supabase', 'PostGIS', 'Prisma', 'Midtrans'],
    github: 'https://github.com/Ghufrnainun/Itechno-CEPAT',
    demo: 'https://cepat-steel.vercel.app/',
    badge: {
      label: 'Finalist ITECHNO CUP 2026',
      variant: 'accent',
    },
  },
  {
    title: 'NetraSense',
    category: 'Assistive Computer Vision',
    description:
      'Assistive vision system designed to help visually impaired individuals identify Indonesian Rupiah banknotes using deep learning models and real-time audio feedback with multi-note summation.',
    year: '2026',
    technologies: ['Python', 'PyTorch', 'YOLOv8', 'YOLOv10', 'OpenCV', 'gTTS'],
    github: 'https://github.com/Ghufrnainun/NetraSense',
  },
  {
    title: 'scoreHub',
    category: 'Real-time Sports Platform',
    description:
      'Web-based live scoreboard and match controller for badminton with mobile umpire control, live spectator display view, and OWASP-compliant temporary PIN access codes.',
    year: '2026',
    technologies: ['Next.js', 'Convex', 'TypeScript', 'Tailwind CSS', 'Shadcn UI'],
    github: 'https://github.com/Ghufrnainun/scoreHub',
  },
  {
    title: 'Weather Prediction IoT',
    category: 'IoT & Machine Learning',
    description:
      'End-to-end weather monitoring station using ESP32 with LoRa SX1278 transmission, FastAPI server, Supabase, Random Forest ML forecasting, and Flutter mobile dashboard.',
    year: '2025',
    technologies: ['ESP32', 'LoRa', 'FastAPI', 'Supabase', 'Scikit-learn', 'Flutter'],
    github: 'https://github.com/bagaskraa/Weather_Predicition-IoT',
  },
  {
    title: 'Web Map Contour Dashboard',
    category: 'Web GIS & Spatial Data',
    description:
      'Web GIS dashboard for topographic contour mapping, spatial data inspection, and geographic visualization built with Laravel and interactive mapping layers.',
    year: '2025',
    technologies: ['Laravel', 'PHP', 'Leaflet', 'MySQL', 'Tailwind CSS'],
    github: 'https://github.com/Ghufrnainun/Dashboard-Web-Map-Contour',
  },
] as const;
