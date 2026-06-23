import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { MultiSelect } from 'primeng/multiselect';
import { Select } from 'primeng/select';

import { LanguageService } from '../../core/services/language.service';
import { PortfolioProject } from '../../core/models/project.model';
import { PROJECTS } from '../projects/project-registry';
import { ProjectCardComponent, ProjectCardViewMode } from '../../shared/ui/project-card/project-card.component';
import { ProjectPreviewDialogComponent } from '../../shared/ui/project-preview-dialog/project-preview-dialog.component';

type DashboardSortMode = 'order' | 'title' | 'category' | 'status' | 'updated';

interface FilterOption {
  label: string;
  value: string;
}

interface TagOption {
  label: string;
  value: string;
}

const VIEW_MODE_STORAGE_KEY = 'projects-hub-dashboard-view-mode';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, MultiSelect, ProjectCardComponent, ProjectPreviewDialogComponent, Select, TranslatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly languageService = inject(LanguageService);
  private readonly translate = inject(TranslateService);
  private loadingTimer: number | undefined;

  readonly projects = PROJECTS;
  readonly skeletonCards = Array.from({ length: 5 }, (_, index) => index);
  readonly isCatalogLoading = signal(true);
  readonly searchTerm = signal('');
  readonly selectedCategory = signal('all');
  readonly selectedTags = signal<string[]>([]);
  readonly sortMode = signal<DashboardSortMode>('order');
  readonly viewMode = signal<ProjectCardViewMode>(this.getInitialViewMode());
  readonly previewProject = signal<PortfolioProject | null>(null);

  readonly categoryOptions = computed<FilterOption[]>(() => {
    this.languageService.activeLanguage();

    return [
      { label: this.translateKey('FILTERS.ALL_CATEGORIES'), value: 'all' },
      ...Array.from(new Set(this.projects.map((project) => project.categoryKey)))
        .sort((first, second) => this.translateKey(first).localeCompare(this.translateKey(second)))
        .map((categoryKey) => ({ label: this.translateKey(categoryKey), value: categoryKey }))
    ];
  });

  readonly sortOptions = computed<FilterOption[]>(() => {
    this.languageService.activeLanguage();

    return [
      { label: this.translateKey('FILTERS.SORT_ORDER'), value: 'order' },
      { label: this.translateKey('FILTERS.SORT_TITLE'), value: 'title' },
      { label: this.translateKey('FILTERS.SORT_CATEGORY'), value: 'category' },
      { label: this.translateKey('FILTERS.SORT_STATUS'), value: 'status' },
      { label: this.translateKey('FILTERS.SORT_UPDATED'), value: 'updated' }
    ];
  });

  readonly tagOptions = computed<TagOption[]>(() =>
    Array.from(new Set(this.projects.flatMap((project) => project.tags)))
      .sort()
      .map((tag) => ({ label: tag, value: tag }))
  );

  readonly filteredProjects = computed(() => {
    this.languageService.activeLanguage();

    const query = this.searchTerm().trim().toLowerCase();
    const category = this.selectedCategory();
    const selectedTags = this.selectedTags();
    const sortMode = this.sortMode();

    return [...this.projects]
      .filter((project) => this.matchesSearch(project, query))
      .filter((project) => category === 'all' || project.categoryKey === category)
      .filter((project) => selectedTags.length === 0 || selectedTags.every((tag) => project.tags.includes(tag)))
      .sort((first, second) => this.compareProjects(first, second, sortMode));
  });

  ngOnInit(): void {
    this.loadingTimer = window.setTimeout(() => this.isCatalogLoading.set(false), 250);
  }

  ngOnDestroy(): void {
    window.clearTimeout(this.loadingTimer);
  }

  setViewMode(viewMode: ProjectCardViewMode): void {
    this.viewMode.set(viewMode);
    localStorage.setItem(VIEW_MODE_STORAGE_KEY, viewMode);
  }

  updateSearchTerm(value: string): void {
    this.searchTerm.set(value);
  }

  updateSelectedCategory(value: string): void {
    this.selectedCategory.set(value);
  }

  updateSelectedTags(value: string[]): void {
    this.selectedTags.set(value);
  }

  updateSortMode(value: string): void {
    this.sortMode.set(value as DashboardSortMode);
  }

  resetFilters(): void {
    this.searchTerm.set('');
    this.selectedCategory.set('all');
    this.selectedTags.set([]);
    this.sortMode.set('order');
  }

  openPreview(project: PortfolioProject): void {
    this.previewProject.set(project);
  }

  closePreview(): void {
    this.previewProject.set(null);
  }

  private getInitialViewMode(): ProjectCardViewMode {
    const savedViewMode = localStorage.getItem(VIEW_MODE_STORAGE_KEY);
    return savedViewMode === 'big' || savedViewMode === 'list' || savedViewMode === 'detailed' ? savedViewMode : 'big';
  }

  private matchesSearch(project: PortfolioProject, query: string): boolean {
    if (!query) {
      return true;
    }

    return [
      this.translateKey(project.titleKey),
      this.translateKey(project.summaryKey),
      this.translateKey(project.categoryKey),
      project.status,
      ...project.tags
    ]
      .join(' ')
      .toLowerCase()
      .includes(query);
  }

  private compareProjects(first: PortfolioProject, second: PortfolioProject, sortMode: DashboardSortMode): number {
    if (sortMode === 'order') {
      return first.order - second.order;
    }

    if (sortMode === 'updated') {
      return second.updatedAt.localeCompare(first.updatedAt);
    }

    if (sortMode === 'status') {
      return first.status.localeCompare(second.status);
    }

    if (sortMode === 'category') {
      return this.translateKey(first.categoryKey).localeCompare(this.translateKey(second.categoryKey));
    }

    return this.translateKey(first.titleKey).localeCompare(this.translateKey(second.titleKey));
  }

  private translateKey(key: string): string {
    return String(this.translate.instant(key));
  }
}
