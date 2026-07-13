import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

import { DashboardComponent } from './dashboard.component';
import { PROJECTS } from '../projects/project-registry';
import { LanguageService } from '../../core/services/language.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [provideRouter([]), provideTranslateService({ lang: 'en', fallbackLang: 'en' })]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter projects by search term', () => {
    component.updateSearchTerm('keyboard');

    expect(component.filteredProjects().map((project) => project.id)).toEqual(['calculator']);
  });

  it('should filter projects by category', () => {
    component.updateSelectedCategory('CATEGORIES.GAMES');

    expect(component.filteredProjects().map((project) => project.id)).toEqual([
      'tic-tac-toe',
      'hang-man',
      'javascript-quiz',
      'memory-game'
    ]);
  });

  it('should keep registry order stable across languages', () => {
    const expectedOrder = PROJECTS.map((project) => project.id);
    const languageService = TestBed.inject(LanguageService);

    languageService.setLanguage('en');
    expect(component.filteredProjects().map((project) => project.id)).toEqual(expectedOrder);

    languageService.setLanguage('mk');
    expect(component.filteredProjects().map((project) => project.id)).toEqual(expectedOrder);
  });

  it('should filter projects by selected tags', () => {
    component.updateSelectedTags(['Keyboard']);

    expect(component.filteredProjects().map((project) => project.id)).toEqual(['calculator']);
  });

  it('should sort projects by difficulty', () => {
    component.updateSortMode('difficulty');

    const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2 };
    const difficulties = component.filteredProjects().map((project) => difficultyOrder[project.difficulty]);

    expect(difficulties).toEqual([...difficulties].sort((first, second) => first - second));
  });

  it('should reset filters and sorting', () => {
    component.updateSearchTerm('calculator');
    component.updateSelectedCategory('CATEGORIES.UTILITIES');
    component.updateSelectedTags(['Keyboard']);
    component.updateSortMode('updated');

    component.resetFilters();

    expect(component.searchTerm()).toBe('');
    expect(component.selectedCategory()).toBe('all');
    expect(component.selectedTags()).toEqual([]);
    expect(component.sortMode()).toBe('order');
  });

  it('should persist selected view mode', () => {
    component.setViewMode('detailed');

    expect(localStorage.getItem('projects-hub-dashboard-view-mode')).toBe('detailed');
  });

  it('should expose compact dashboard widgets', () => {
    component.now.set(new Date('2026-07-03T14:05:00'));

    expect(component.clockTime()).toContain('02:05');
    expect(component.dashboardWeather.city).toBe('Skopje');
    expect(component.dashboardWeather.temperature).toBe(31);
  });

  it('should open and close a project preview', () => {
    component.openPreview(PROJECTS[0]);

    expect(component.previewProject()).toEqual(PROJECTS[0]);

    component.closePreview();

    expect(component.previewProject()).toBeNull();
  });
});
