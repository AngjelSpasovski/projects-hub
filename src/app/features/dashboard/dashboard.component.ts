import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { PROJECTS } from '../projects/project-registry';

type DashboardViewMode = 'big' | 'list' | 'detailed';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  readonly projects = PROJECTS;
  readonly viewMode = signal<DashboardViewMode>('big');

  setViewMode(viewMode: DashboardViewMode): void {
    this.viewMode.set(viewMode);
  }
}
