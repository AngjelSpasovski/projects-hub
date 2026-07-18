import { Routes } from '@angular/router';

import { AdminShellComponent } from './layout/admin-shell/admin-shell.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'admin/dashboard'
  },
  {
    path: 'admin',
    component: AdminShellComponent,
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
    redirectTo: 'admin/dashboard'
  }
];
