import { Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type AppLanguage = 'mk' | 'en';
type LanguageChangeGuard = (language: AppLanguage) => boolean;

const STORAGE_KEY = 'projects-hub-language';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly languages: AppLanguage[] = ['mk', 'en'];
  readonly activeLanguage = signal<AppLanguage>('mk');
  private readonly guards = new Set<LanguageChangeGuard>();

  constructor(private readonly translate: TranslateService) {
    const savedLanguage = localStorage.getItem(STORAGE_KEY) as AppLanguage | null;
    this.translate.addLangs(this.languages);
    this.setLanguage(savedLanguage && this.languages.includes(savedLanguage) ? savedLanguage : 'mk', true);
  }

  setLanguage(language: AppLanguage, skipGuards = false): boolean {
    if (!skipGuards && language !== this.activeLanguage()) {
      for (const guard of this.guards) {
        if (!guard(language)) {
          return false;
        }
      }
    }

    this.activeLanguage.set(language);
    this.translate.use(language);
    localStorage.setItem(STORAGE_KEY, language);
    return true;
  }

  registerLanguageChangeGuard(guard: LanguageChangeGuard): () => void {
    this.guards.add(guard);
    return () => this.guards.delete(guard);
  }
}
