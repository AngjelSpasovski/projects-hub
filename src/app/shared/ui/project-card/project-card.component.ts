import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { PortfolioProject } from '../../../core/models/project.model';
import { ProjectStatusBadgeComponent } from '../project-status-badge/project-status-badge.component';

export type ProjectCardViewMode = 'big' | 'list' | 'detailed';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [ProjectStatusBadgeComponent, RouterLink, TranslatePipe],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss'
})
export class ProjectCardComponent {
  readonly project = input.required<PortfolioProject>();
  readonly viewMode = input<ProjectCardViewMode>('big');
  readonly preview = output<PortfolioProject>();
}
