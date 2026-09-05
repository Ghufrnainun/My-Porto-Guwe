import { PortfolioProject } from '@/data/featuredProjects';
import { UniversalProjectCard, CardVariantType } from './project-cards';

interface ProjectCardProps {
  project: PortfolioProject;
  index: number;
  variant?: CardVariantType;
}

export function ProjectCard({ project, index, variant = '1' }: ProjectCardProps) {
  return <UniversalProjectCard project={project} index={index} variant={variant} />;
}
