import { Component, computed, inject, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Dialog } from 'primeng/dialog';

import { LanguageService } from '../../../core/services/language.service';
import { PortfolioProject } from '../../../core/models/project.model';
import { ProjectStatusBadgeComponent } from '../project-status-badge/project-status-badge.component';

export type ProjectCardViewMode = 'big' | 'list' | 'detailed';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [Dialog, ProjectStatusBadgeComponent, RouterLink, TranslatePipe],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss'
})
export class ProjectCardComponent {
  private readonly languageService = inject(LanguageService);
  private readonly translate = inject(TranslateService);

  readonly project = input.required<PortfolioProject>();
  readonly viewMode = input<ProjectCardViewMode>('big');
  readonly preview = output<PortfolioProject>();
  readonly summaryVisible = signal(false);
  readonly translatedSummary = computed(() => {
    this.languageService.activeLanguage();

    return String(this.translate.instant(this.project().summaryKey));
  });
  readonly hasLongSummary = computed(() => this.viewMode() !== 'list' && this.translatedSummary().length > 82);

  openSummary(): void {
    this.summaryVisible.set(true);
  }

  closeSummary(): void {
    this.summaryVisible.set(false);
  }
}
