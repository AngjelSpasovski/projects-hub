import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, signal } from '@angular/core';

export type AppTheme = 'light' | 'dark' | 'blue';

const STORAGE_KEY = 'projects-hub-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly themes: AppTheme[] = ['light', 'dark', 'blue'];
  readonly activeTheme = signal<AppTheme>('light');

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    const savedTheme = localStorage.getItem(STORAGE_KEY) as AppTheme | null;
    this.setTheme(savedTheme && this.themes.includes(savedTheme) ? savedTheme : 'light');
  }

  setTheme(theme: AppTheme): void {
    this.activeTheme.set(theme);
    this.document.documentElement.dataset['theme'] = theme;
    localStorage.setItem(STORAGE_KEY, theme);
  }
}
