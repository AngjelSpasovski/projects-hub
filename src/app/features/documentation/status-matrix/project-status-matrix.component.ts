import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import type { PortfolioProject, ProjectStatus } from '../../../core/models/project.model';
import { LanguageService } from '../../../core/services/language.service';
import { PROJECTS } from '../../projects/project-registry';
import type { ProjectStatusDocumentation } from '../documentation.models';
import { PROJECT_DOCUMENTATION } from '../project-documentation.data';

export interface ProjectStatusView extends ProjectStatusDocumentation {
  project: PortfolioProject;
}

type MatrixStatusFilter = ProjectStatus | 'all';

@Component({
  selector: 'app-project-status-matrix',
  standalone: true,
  imports: [FormsModule, RouterLink, TranslatePipe],
  templateUrl: './project-status-matrix.component.html',
  styleUrl: './project-status-matrix.component.scss'
})
export class ProjectStatusMatrixComponent {
  private readonly languageService = inject(LanguageService);
  private readonly translate = inject(TranslateService);

  readonly query = signal('');
  readonly category = signal('all');
  readonly status = signal<MatrixStatusFilter>('all');
  readonly categories = [...new Set(PROJECTS.map((project) => project.categoryKey))];
  readonly statusOptions: readonly MatrixStatusFilter[] = ['all', 'ready', 'planned', 'migration'];
  readonly rows: readonly ProjectStatusView[] = PROJECTS.map((project) => {
    const documentation = PROJECT_DOCUMENTATION.find((entry) => entry.projectId === project.id);

    if (!documentation) {
      throw new Error(`Missing status documentation for project: ${project.id}`);
    }

    return {
      project,
      projectId: project.id,
      categoryKey: project.categoryKey,
      difficulty: project.difficulty,
      status: project.status,
      runtime: documentation.integration === 'api-style'
        ? 'api-style'
        : documentation.storage === 'local-storage'
          ? 'local-storage'
          : 'static',
      hasUnitTests: documentation.hasUnitTests,
      hasE2eCoverage: documentation.hasE2eCoverage,
      notesKey: documentation.futureKey
    };
  });
  readonly localStorageCount = this.rows.filter((entry) => entry.runtime === 'local-storage').length;
  readonly apiStyleCount = this.rows.filter((entry) => entry.runtime === 'api-style').length;

  readonly filteredRows = computed(() => {
    this.languageService.activeLanguage();
    const query = this.query().trim().toLowerCase();
    const category = this.category();
    const status = this.status();

    return this.rows.filter((entry) => {
      const matchesQuery = !query || this.searchText(entry).includes(query);
      const matchesCategory = category === 'all' || entry.categoryKey === category;
      const matchesStatus = status === 'all' || entry.status === status;

      return matchesQuery && matchesCategory && matchesStatus;
    });
  });

  updateQuery(value: string): void {
    this.query.set(value);
  }

  updateCategory(value: string): void {
    this.category.set(value);
  }

  updateStatus(value: MatrixStatusFilter): void {
    this.status.set(value);
  }

  clearFilters(): void {
    this.query.set('');
    this.category.set('all');
    this.status.set('all');
  }

  private searchText(entry: ProjectStatusView): string {
    return [
      this.translate.instant(entry.project.titleKey),
      this.translate.instant(entry.categoryKey),
      entry.difficulty,
      entry.status,
      entry.runtime,
      this.translate.instant(entry.notesKey)
    ]
      .join(' ')
      .toLowerCase();
  }
}
