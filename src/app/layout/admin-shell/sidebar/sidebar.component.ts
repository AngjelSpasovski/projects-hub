import { AfterViewInit, Component, ElementRef, computed, inject, signal } from '@angular/core';
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
export class SidebarComponent implements AfterViewInit {
  private readonly router = inject(Router);
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly projects = PROJECTS;
  readonly totalProjects = PROJECTS.length;
  readonly activeUrl = signal(this.router.url);
  readonly openGroups = signal<Record<ProjectDifficulty, boolean>>({
    beginner: false,
    intermediate: false,
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
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe((event) => {
      this.activeUrl.set(event.urlAfterRedirects);
      this.scrollActiveProjectIntoView();
    });
  }

  ngAfterViewInit(): void {
    this.scrollActiveProjectIntoView();
  }

  toggleGroup(difficulty: ProjectDifficulty): void {
    this.openGroups.update((groups) => ({
      ...groups,
      [difficulty]: !groups[difficulty]
    }));
    this.scrollActiveProjectIntoView();
  }

  isGroupOpen(difficulty: ProjectDifficulty): boolean {
    return this.openGroups()[difficulty];
  }

  isProjectActive(project: PortfolioProject): boolean {
    return this.activeUrl().startsWith(project.route);
  }

  private scrollActiveProjectIntoView(): void {
    setTimeout(() => {
      this.host.nativeElement.querySelector('.group-links a.project-active')?.scrollIntoView({
        block: 'nearest',
        inline: 'nearest'
      });
    });
  }
}
