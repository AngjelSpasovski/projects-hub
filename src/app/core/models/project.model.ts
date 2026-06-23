export type ProjectStatus = 'ready' | 'planned' | 'migration';
export type ProjectDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface PortfolioProject {
  order: number;
  id: string;
  titleKey: string;
  summaryKey: string;
  categoryKey: string;
  tags: string[];
  status: ProjectStatus;
  image: string;
  route: string;
  updatedAt: string;
  createdAt: string;
  difficulty: ProjectDifficulty;
  repositoryUrl?: string | null;
  demoUrl?: string | null;
}
