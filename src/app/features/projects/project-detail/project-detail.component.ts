import { NgComponentOutlet } from '@angular/common';
import { Component, DestroyRef, Type, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { PROJECTS } from '../project-registry';

const PROJECT_COMPONENT_LOADERS: Record<string, () => Promise<Type<unknown>>> = {
  'tic-tac-toe': () =>
    import('../tic-tac-toe/tic-tac-toe.component').then((component) => component.TicTacToeComponent),
  calculator: () => import('../calculator/calculator.component').then((component) => component.CalculatorComponent),
  'hang-man': () => import('../hang-man/hang-man.component').then((component) => component.HangManComponent),
  weather: () => import('../weather/weather.component').then((component) => component.WeatherComponent),
  'music-event': () => import('../music-event/music-event.component').then((component) => component.MusicEventComponent)
};

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [NgComponentOutlet, RouterLink, TranslatePipe],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly projectId = signal<string | null>(null);
  readonly projectComponent = signal<Type<unknown> | null>(null);
  readonly isComponentLoading = signal(false);

  readonly project = computed(() => {
    const projectId = this.projectId();
    return PROJECTS.find((project) => project.id === projectId);
  });

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((paramMap) => {
      const projectId = paramMap.get('projectId');
      this.projectId.set(projectId);
      void this.loadProjectComponent(projectId);
    });
  }

  private async loadProjectComponent(projectId: string | null): Promise<void> {
    this.projectComponent.set(null);

    if (!projectId || !PROJECT_COMPONENT_LOADERS[projectId]) {
      this.isComponentLoading.set(false);
      return;
    }

    this.isComponentLoading.set(true);

    try {
      this.projectComponent.set(await PROJECT_COMPONENT_LOADERS[projectId]());
    } finally {
      this.isComponentLoading.set(false);
    }
  }
}
