import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Dialog } from 'primeng/dialog';

import { PortfolioProject } from '../../../core/models/project.model';
import { ProjectStatusBadgeComponent } from '../project-status-badge/project-status-badge.component';

@Component({
  selector: 'app-project-preview-dialog',
  standalone: true,
  imports: [Dialog, ProjectStatusBadgeComponent, RouterLink, TranslatePipe],
  templateUrl: './project-preview-dialog.component.html',
  styleUrl: './project-preview-dialog.component.scss'
})
export class ProjectPreviewDialogComponent {
  readonly project = input<PortfolioProject | null>(null);
  readonly closed = output<void>();

  onVisibleChange(visible: boolean): void {
    if (!visible) {
      this.closed.emit();
    }
  }
}
