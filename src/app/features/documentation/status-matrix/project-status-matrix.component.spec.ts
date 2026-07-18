import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';

import { ProjectStatusMatrixComponent } from './project-status-matrix.component';

describe('ProjectStatusMatrixComponent', () => {
  let component: ProjectStatusMatrixComponent;
  let fixture: ComponentFixture<ProjectStatusMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectStatusMatrixComponent],
      providers: [provideRouter([]), provideTranslateService({ lang: 'en', fallbackLang: 'en' })]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectStatusMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should derive all status rows from registry-aligned documentation', () => {
    expect(component.rows.length).toBe(28);
    expect(component.rows.every((entry) => entry.projectId === entry.project.id)).toBeTrue();
    expect(component.rows.every((entry) => entry.status === 'ready')).toBeTrue();
    expect(component.rows.every((entry) => entry.hasUnitTests && entry.hasE2eCoverage)).toBeTrue();
    expect(component.localStorageCount).toBe(10);
    expect(component.apiStyleCount).toBe(5);
  });

  it('should filter rows by query, category, and status', () => {
    component.updateQuery('chat');
    expect(component.filteredRows().map((entry) => entry.projectId)).toEqual(['chat-app']);

    component.updateQuery('');
    component.updateCategory('CATEGORIES.GAMES');
    expect(component.filteredRows().every((entry) => entry.categoryKey === 'CATEGORIES.GAMES')).toBeTrue();

    component.updateStatus('planned');
    expect(component.filteredRows()).toEqual([]);
  });

  it('should reset all filters', () => {
    component.updateQuery('timer');
    component.updateCategory('CATEGORIES.UTILITIES');
    component.updateStatus('planned');
    component.clearFilters();

    expect(component.query()).toBe('');
    expect(component.category()).toBe('all');
    expect(component.status()).toBe('all');
    expect(component.filteredRows().length).toBe(28);
  });
});
