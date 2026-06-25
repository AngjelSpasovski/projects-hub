import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ProjectDifficulty } from '../../../core/models/project.model';

@Component({
  selector: 'app-project-status-badge',
  standalone: true,
  imports: [TranslatePipe],
  template: `<span class="difficulty">{{ ('PROJECT.DIFFICULTY.' + difficulty().toUpperCase()) | translate }}</span>`,
  styles: `
    .difficulty {
      background: var(--app-surface-muted);
      border: 1px solid var(--app-border);
      border-radius: var(--app-radius-pill);
      color: var(--app-text-muted);
      display: inline-block;
      font-size: var(--app-font-size-xs);
      font-weight: 700;
      max-width: 8.5rem;
      overflow: hidden;
      padding: 0.25rem 0.55rem;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `
})
export class ProjectStatusBadgeComponent {
  readonly difficulty = input.required<ProjectDifficulty>();
}
