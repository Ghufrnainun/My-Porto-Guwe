export interface FeaturedProject {
  title: string;
  description: string;
  technologies: string[];
  github: string;
  demo: string;
  image: string;
  images?: string[];
  color: string;
  role: string;
  year: string;
  metric: string;
}

export const featuredProjects: FeaturedProject[] = [
  {
    title: 'LSP Polines Certification Platform',
    description:
      'Led a 5-person team to build the official certification website. Engineered the auth system from scratch and optimized Git workflows for 4 development teams.',
    technologies: ['Laravel', 'Livewire', 'Tailwind CSS', 'MySQL'],
    github: 'https://github.com/Ghufrnainun',
    demo: '',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=900&fit=crop',
    color: '#22d3c5',
    role: 'Lead developer',
    year: '2025',
    metric: '5-person team',
  },
  {
    title: 'IMPP Organization Website',
    description:
      'Landing page and CMS for Ikatan Mahasiswa Pemalang Polines. Solo developed with admin panel to manage structure, activities, and gallery.',
    technologies: ['Laravel', 'MySQL', 'Tailwind CSS'],
    github: 'https://github.com/Ghufrnainun',
    demo: 'https://imppolines.my.id/',
    image: '/impp-screenshot.png',
    color: '#38bdf8',
    role: 'Solo developer',
    year: '2025',
    metric: 'CMS + gallery',
  },
];
