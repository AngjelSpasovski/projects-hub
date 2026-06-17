import { TestBed } from '@angular/core/testing';

import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    TestBed.resetTestingModule();
  });

  it('should default to light theme', () => {
    const service = TestBed.inject(ThemeService);

    expect(service.activeTheme()).toBe('light');
    expect(document.documentElement.dataset['theme']).toBe('light');
    expect(localStorage.getItem('projects-hub-theme')).toBe('light');
  });

  it('should restore a saved valid theme', () => {
    localStorage.setItem('projects-hub-theme', 'dark');

    const service = TestBed.inject(ThemeService);

    expect(service.activeTheme()).toBe('dark');
    expect(document.documentElement.dataset['theme']).toBe('dark');
  });

  it('should ignore an invalid saved theme', () => {
    localStorage.setItem('projects-hub-theme', 'pink');

    const service = TestBed.inject(ThemeService);

    expect(service.activeTheme()).toBe('light');
    expect(document.documentElement.dataset['theme']).toBe('light');
  });

  it('should update the active theme and persist it', () => {
    const service = TestBed.inject(ThemeService);

    service.setTheme('blue');

    expect(service.activeTheme()).toBe('blue');
    expect(document.documentElement.dataset['theme']).toBe('blue');
    expect(localStorage.getItem('projects-hub-theme')).toBe('blue');
  });
});
