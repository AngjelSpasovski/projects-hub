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
        path: 'projects/tic-tac-toe',
        loadComponent: () =>
          import('./features/projects/tic-tac-toe/tic-tac-toe.component').then(
            (component) => component.TicTacToeComponent
          )
      },
      {
        path: 'projects/calculator',
        loadComponent: () =>
          import('./features/projects/calculator/calculator.component').then((component) => component.CalculatorComponent)
      },
      {
        path: 'projects/hang-man',
        loadComponent: () =>
          import('./features/projects/hang-man/hang-man.component').then((component) => component.HangManComponent)
      },
      {
        path: 'projects/weather',
        loadComponent: () =>
          import('./features/projects/weather/weather.component').then((component) => component.WeatherComponent)
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
