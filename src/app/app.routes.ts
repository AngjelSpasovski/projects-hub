import { Routes } from '@angular/router';

import { AdminShellComponent } from './layout/admin-shell/admin-shell.component';
import { gateAccessGuard, gateWelcomeGuard } from './core/services/gate-access.service';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'welcome'
  },
  {
    path: 'welcome',
    canActivate: [gateWelcomeGuard],
    loadComponent: () =>
      import('./features/welcome/moria-gate.component').then((component) => component.MoriaGateComponent)
  },
  {
    path: 'admin',
    component: AdminShellComponent,
    canActivate: [gateAccessGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((component) => component.DashboardComponent)
      },
      {
        path: 'documentation',
        loadComponent: () =>
          import('./features/documentation/documentation.component').then(
            (component) => component.DocumentationComponent
          )
      },
      {
        path: 'projects/technical-documentation',
        pathMatch: 'full',
        redirectTo: 'documentation'
      },
      {
        path: 'projects/:projectId',
        loadComponent: () =>
          import('./features/projects/project-detail/project-detail.component').then(
            (component) => component.ProjectDetailComponent
          )
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'welcome'
  }
];
