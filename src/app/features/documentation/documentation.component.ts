import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { LanguageService } from '../../core/services/language.service';
import type { PortfolioProject } from '../../core/models/project.model';
import { PROJECTS } from '../projects/project-registry';
import { DOCUMENTATION_SECTIONS } from './documentation.data';
import { DOCUMENTATION_CODE_EXAMPLES } from './documentation-code-examples.data';
import type {
  DocumentationSection,
  DocumentationSectionId,
  ProjectDocumentation
} from './documentation.models';
import { PROJECT_DOCUMENTATION } from './project-documentation.data';
import { ProjectStatusMatrixComponent } from './status-matrix/project-status-matrix.component';
import { DocumentationCodeBlockComponent } from './code-block/documentation-code-block.component';

export interface ProjectDocumentationView {
  project: PortfolioProject;
  documentation: ProjectDocumentation;
}

@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    TranslatePipe,
    ProjectStatusMatrixComponent,
    DocumentationCodeBlockComponent
  ],
  templateUrl: './documentation.component.html',
  styleUrl: './documentation.component.scss'
})
export class DocumentationComponent {
  private readonly languageService = inject(LanguageService);
  private readonly translate = inject(TranslateService);

  readonly sections = DOCUMENTATION_SECTIONS;
  readonly codeExamples = DOCUMENTATION_CODE_EXAMPLES;
  readonly projectDocumentation: readonly ProjectDocumentationView[] = PROJECTS.map((project) => {
    const documentation = PROJECT_DOCUMENTATION.find((entry) => entry.projectId === project.id);

    if (!documentation) {
      throw new Error(`Missing documentation for project: ${project.id}`);
    }

    return { project, documentation };
  });
  readonly query = signal('');
  readonly selectedSectionId = signal<DocumentationSectionId>(DOCUMENTATION_SECTIONS[0].id);
  readonly selectedProjectId = signal(this.projectDocumentation[0].project.id);
  readonly totalReferences = this.sections.reduce((total, section) => total + section.codeRefs.length, 0);

  readonly filteredSections = computed(() => {
    this.languageService.activeLanguage();
    const query = this.query().trim().toLowerCase();

    if (!query) {
      return this.sections;
    }

    return this.sections.filter((section) => this.searchText(section).includes(query));
  });

  readonly selectedSection = computed(() => {
    const filteredSections = this.filteredSections();
    return filteredSections.find((section) => section.id === this.selectedSectionId()) ?? filteredSections[0] ?? null;
  });

  readonly activeSectionId = computed(() => this.selectedSection()?.id ?? null);

  readonly filteredProjectDocumentation = computed(() => {
    this.languageService.activeLanguage();
    const query = this.query().trim().toLowerCase();

    if (!query) {
      return this.projectDocumentation;
    }

    return this.projectDocumentation.filter((entry) => this.projectSearchText(entry).includes(query));
  });

  readonly selectedProjectDocumentation = computed(() => {
    const visibleProjects = this.filteredProjectDocumentation();
    return visibleProjects.find((entry) => entry.project.id === this.selectedProjectId()) ?? visibleProjects[0] ?? null;
  });

  updateQuery(value: string): void {
    this.query.set(value);
  }

  selectSection(sectionId: DocumentationSectionId): void {
    this.selectedSectionId.set(sectionId);
  }

  selectProject(projectId: string): void {
    this.selectedProjectId.set(projectId);
  }

  isProjectSelected(projectId: string): boolean {
    return this.selectedProjectDocumentation()?.project.id === projectId;
  }

  clearSearch(): void {
    this.query.set('');
    this.selectedSectionId.set(DOCUMENTATION_SECTIONS[0].id);
  }

  private searchText(section: DocumentationSection): string {
    const projectText = section.id === 'projects'
      ? this.projectDocumentation.map((entry) => this.projectSearchText(entry)).join(' ')
      : '';

    return [
      this.translateKey(section.titleKey),
      this.translateKey(section.summaryKey),
      ...section.topics.flatMap((topic) => [this.translateKey(topic.titleKey), this.translateKey(topic.bodyKey)]),
      ...section.codeRefs.map((reference) => reference.path),
      projectText
    ]
      .join(' ')
      .toLowerCase();
  }

  private translateKey(key: string): string {
    return String(this.translate.instant(key));
  }

  private projectSearchText(entry: ProjectDocumentationView): string {
    return [
      this.translateKey(entry.project.titleKey),
      this.translateKey(entry.project.summaryKey),
      this.translateKey(entry.project.categoryKey),
      entry.project.difficulty,
      entry.project.status,
      ...entry.project.tags,
      ...entry.documentation.featureKeys.map((key) => this.translateKey(key)),
      this.translateKey(entry.documentation.limitationKey),
      this.translateKey(entry.documentation.futureKey)
    ]
      .join(' ')
      .toLowerCase();
  }

}
