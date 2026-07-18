import type { ProjectDifficulty, ProjectStatus } from '../../core/models/project.model';

export type DocumentationSectionId =
  | 'overview'
  | 'user-guide'
  | 'technical-guide'
  | 'projects'
  | 'status-matrix'
  | 'maintenance'
  | 'release';

export type DocumentationReferenceKind = 'source' | 'documentation' | 'test';

export interface DocumentationTopic {
  id: string;
  titleKey: string;
  bodyKey: string;
}

export interface DocumentationCodeReference {
  path: string;
  kind: DocumentationReferenceKind;
}

export type DocumentationCodeLanguage = 'typescript' | 'html';

export interface DocumentationCodeExample {
  id: string;
  titleKey: string;
  descriptionKey: string;
  filename: string;
  language: DocumentationCodeLanguage;
  code: string;
}

export interface DocumentationSection {
  id: DocumentationSectionId;
  icon: string;
  titleKey: string;
  summaryKey: string;
  topics: readonly DocumentationTopic[];
  codeRefs: readonly DocumentationCodeReference[];
}

export interface ProjectDocumentation {
  projectId: string;
  featureKeys: readonly string[];
  storage: 'memory' | 'local-storage';
  integration: 'local' | 'api-style' | 'external-links';
  limitationKey: string;
  futureKey: string;
  hasUnitTests: boolean;
  hasE2eCoverage: boolean;
}

export interface ProjectStatusDocumentation {
  projectId: string;
  categoryKey: string;
  difficulty: ProjectDifficulty;
  status: ProjectStatus;
  runtime: 'static' | 'local-storage' | 'api-style';
  hasUnitTests: boolean;
  hasE2eCoverage: boolean;
  notesKey: string;
}
