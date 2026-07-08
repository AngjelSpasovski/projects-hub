import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ProjectDifficulty } from '../../../core/models/project.model';

@Component({
  selector: 'app-project-status-badge',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <span
      class="difficulty"
      [class.beginner]="difficulty() === 'beginner'"
      [class.intermediate]="difficulty() === 'intermediate'"
      [class.advanced]="difficulty() === 'advanced'"
    >
      {{ ('PROJECT.DIFFICULTY.' + difficulty().toUpperCase()) | translate }}
    </span>
  `,
  styles: `
    .difficulty {
      --difficulty-accent: #94a3b8;

      background: color-mix(in srgb, var(--difficulty-accent) 14%, var(--app-surface-muted));
      border: 1px solid color-mix(in srgb, var(--difficulty-accent) 26%, var(--app-border));
      border-radius: var(--app-radius-pill);
      color: color-mix(in srgb, var(--difficulty-accent) 58%, var(--app-text));
      display: inline-block;
      font-size: var(--app-font-size-xs);
      font-weight: 700;
      max-width: 8.5rem;
      overflow: hidden;
      padding: 0.25rem 0.55rem;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .difficulty.beginner {
      --difficulty-accent: #34d399;
    }

    .difficulty.intermediate {
      --difficulty-accent: #60a5fa;
    }

    .difficulty.advanced {
      --difficulty-accent: #f472b6;
    }
  `
})
export class ProjectStatusBadgeComponent {
  readonly difficulty = input.required<ProjectDifficulty>();
}
