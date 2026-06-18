import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

import { DashboardComponent } from './dashboard.component';
import { PROJECTS } from '../projects/project-registry';

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
    component.updateSearchTerm('calculator');

    expect(component.filteredProjects().map((project) => project.id)).toEqual(['calculator']);
  });

  it('should filter projects by category', () => {
    component.updateSelectedCategory('CATEGORIES.GAMES');

    expect(component.filteredProjects().map((project) => project.id)).toEqual(['hang-man', 'tic-tac-toe']);
  });

  it('should filter projects by selected tags', () => {
    component.updateSelectedTags(['Keyboard']);

    expect(component.filteredProjects().map((project) => project.id)).toEqual(['calculator']);
  });

  it('should sort projects by status', () => {
    component.updateSortMode('status');

    const statuses = component.filteredProjects().map((project) => project.status);

    expect(statuses).toEqual([...statuses].sort());
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
    expect(component.sortMode()).toBe('title');
  });

  it('should persist selected view mode', () => {
    component.setViewMode('detailed');

    expect(localStorage.getItem('projects-hub-dashboard-view-mode')).toBe('detailed');
  });

  it('should open and close a project preview', () => {
    component.openPreview(PROJECTS[0]);

    expect(component.previewProject()).toEqual(PROJECTS[0]);

    component.closePreview();

    expect(component.previewProject()).toBeNull();
  });
});
