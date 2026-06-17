import { Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type AppLanguage = 'mk' | 'en';

const STORAGE_KEY = 'projects-hub-language';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly languages: AppLanguage[] = ['mk', 'en'];
  readonly activeLanguage = signal<AppLanguage>('mk');

  constructor(private readonly translate: TranslateService) {
    const savedLanguage = localStorage.getItem(STORAGE_KEY) as AppLanguage | null;
    this.translate.addLangs(this.languages);
    this.setLanguage(savedLanguage && this.languages.includes(savedLanguage) ? savedLanguage : 'mk');
  }

  setLanguage(language: AppLanguage): void {
    this.activeLanguage.set(language);
    this.translate.use(language);
    localStorage.setItem(STORAGE_KEY, language);
  }
}
