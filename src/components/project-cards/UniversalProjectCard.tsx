import { PortfolioProject } from '@/data/featuredProjects';
import { CardVariantType } from './VariantSwitcher';
import { ProjectCardVariant1 } from './ProjectCardVariant1';
import { ProjectCardVariant2 } from './ProjectCardVariant2';
import { ProjectCardVariant3 } from './ProjectCardVariant3';

export function UniversalProjectCard({
  project,
  index = 0,
  variant = '1',
}: {
  project: PortfolioProject;
  index?: number;
  variant?: CardVariantType;
}) {
  switch (variant) {
    case '2':
      return <ProjectCardVariant2 project={project} index={index} />;
    case '3':
      return <ProjectCardVariant3 project={project} index={index} />;
    case '1':
    default:
      return <ProjectCardVariant1 project={project} index={index} />;
  }
}
