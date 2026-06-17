export type ProjectStatus = 'ready' | 'planned' | 'migration';

export interface PortfolioProject {
  id: string;
  titleKey: string;
  summaryKey: string;
  categoryKey: string;
  tags: string[];
  status: ProjectStatus;
  image: string;
  route: string;
}
