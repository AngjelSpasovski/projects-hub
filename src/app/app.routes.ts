import { Routes } from '@angular/router';

import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ProjectDetailComponent } from './features/projects/project-detail/project-detail.component';
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
        component: DashboardComponent
      },
      {
        path: 'projects/:projectId',
        component: ProjectDetailComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'admin/dashboard'
  }
];
