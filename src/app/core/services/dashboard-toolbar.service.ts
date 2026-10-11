import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { LanguageService } from './language.service';
import { ProjectCardViewMode } from '../../shared/ui/project-card/project-card.component';

const VIEW_MODE_STORAGE_KEY = 'projects-hub-dashboard-view-mode';

@Injectable({ providedIn: 'root' })
export class DashboardToolbarService {
  private readonly languageService = inject(LanguageService);
  private readonly destroyRef = inject(DestroyRef);

  readonly viewMode = signal<ProjectCardViewMode>(this.getInitialViewMode());
  readonly now = signal(new Date());
  readonly dashboardWeather = {
    city: 'Skopje',
    conditionKey: 'WEATHER.CONDITION.SUNNY',
    temperature: 31,
    icon: 'pi pi-sun'
  };

  readonly clockTime = computed(() =>
    new Intl.DateTimeFormat(this.activeLocale(), {
      hour: '2-digit',
      minute: '2-digit'
    }).format(this.now())
  );

  readonly clockDate = computed(() =>
    new Intl.DateTimeFormat(this.activeLocale(), {
      day: '2-digit',
      month: 'short',
      weekday: 'short'
    }).format(this.now())
  );

  constructor() {
    const timer = window.setInterval(() => this.now.set(new Date()), 1000);
    this.destroyRef.onDestroy(() => window.clearInterval(timer));
  }

  setViewMode(viewMode: ProjectCardViewMode): void {
    this.viewMode.set(viewMode);
    localStorage.setItem(VIEW_MODE_STORAGE_KEY, viewMode);
  }

  private getInitialViewMode(): ProjectCardViewMode {
    const savedViewMode = localStorage.getItem(VIEW_MODE_STORAGE_KEY);
    return savedViewMode === 'big' || savedViewMode === 'list' || savedViewMode === 'detailed' ? savedViewMode : 'big';
  }

  private activeLocale(): string {
    return this.languageService.activeLanguage() === 'mk' ? 'mk-MK' : 'en-US';
  }
}
