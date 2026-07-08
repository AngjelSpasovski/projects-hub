import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { filter } from 'rxjs';

import { PortfolioProject, ProjectDifficulty } from '../../../core/models/project.model';
import { PROJECTS } from '../../../features/projects/project-registry';

interface SidebarProjectGroup {
  difficulty: ProjectDifficulty;
  labelKey: string;
  projects: PortfolioProject[];
}

const DIFFICULTY_LABEL_KEYS: Record<ProjectDifficulty, string> = {
  beginner: 'NAV.BEGINNER',
  intermediate: 'NAV.INTERMEDIATE',
  advanced: 'NAV.ADVANCED'
};

const DIFFICULTY_ORDER: ProjectDifficulty[] = ['beginner', 'intermediate', 'advanced'];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  private readonly router = inject(Router);

  readonly projects = PROJECTS;
  readonly totalProjects = PROJECTS.length;
  readonly activeUrl = signal(this.router.url);
  readonly openGroups = signal<Record<ProjectDifficulty, boolean>>({
    beginner: true,
    intermediate: true,
    advanced: false
  });

  readonly projectGroups = computed<SidebarProjectGroup[]>(() =>
    DIFFICULTY_ORDER.map((difficulty) => ({
      difficulty,
      labelKey: DIFFICULTY_LABEL_KEYS[difficulty],
      projects: this.projects.filter((project) => project.difficulty === difficulty)
    }))
  );

  constructor() {
    this.openActiveProjectGroup(this.router.url);

    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe((event) => {
      this.activeUrl.set(event.urlAfterRedirects);
      this.openActiveProjectGroup(event.urlAfterRedirects);
    });
  }

  toggleGroup(difficulty: ProjectDifficulty): void {
    this.openGroups.update((groups) => ({
      ...groups,
      [difficulty]: !groups[difficulty]
    }));
  }

  isGroupOpen(difficulty: ProjectDifficulty): boolean {
    return this.openGroups()[difficulty];
  }

  isProjectActive(project: PortfolioProject): boolean {
    return this.activeUrl().startsWith(project.route);
  }

  private openActiveProjectGroup(url: string): void {
    const activeProject = this.projects.find((project) => url.startsWith(project.route));

    if (!activeProject) {
      return;
    }

    this.openGroups.update((groups) => ({
      ...groups,
      [activeProject.difficulty]: true
    }));
  }
}
