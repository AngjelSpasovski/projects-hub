import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { DevLoggerComponent } from './dev-logger.component';

describe('DevLoggerComponent', () => {
  let component: DevLoggerComponent;
  let fixture: ComponentFixture<DevLoggerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevLoggerComponent],
      providers: [provideTranslateService({ lang: 'en', fallbackLang: 'en' })]
    }).compileComponents();

    fixture = TestBed.createComponent(DevLoggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('starts with demo logs and derived level counts', () => {
    expect(component.logs().length).toBe(3);
    expect(component.infoCount()).toBe(1);
    expect(component.warningCount()).toBe(1);
    expect(component.errorCount()).toBe(1);
  });

  it('adds a validated log entry', () => {
    component.updateText('Check migration output');
    component.updateLevel('warning');

    component.submitLog();

    expect(component.logs()[0].text).toBe('Check migration output');
    expect(component.logs()[0].level).toBe('warning');
    expect(component.draftText()).toBe('');
  });

  it('does not add empty log text', () => {
    component.submitLog();

    expect(component.logs().length).toBe(3);
    expect(component.isTextInvalid()).toBeTrue();
  });

  it('edits and deletes logs', () => {
    const selected = component.logs()[0];

    component.editLog(selected);
    component.updateText('Updated log message');
    component.updateLevel('info');
    component.submitLog();

    expect(component.logs().find((log) => log.id === selected.id)?.text).toBe('Updated log message');

    component.deleteLog(selected.id);

    expect(component.logs().some((log) => log.id === selected.id)).toBeFalse();
  });

  it('filters by level and search text', () => {
    component.updateFilter('warning');

    expect(component.filteredLogs().length).toBe(1);
    expect(component.filteredLogs()[0].level).toBe('warning');

    component.updateFilter('all');
    component.updateSearch('legacy');

    expect(component.filteredLogs().length).toBe(1);
    expect(component.filteredLogs()[0].text).toContain('Legacy');
  });
});
