import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';

import { LanguageService } from './language.service';

class TranslateServiceStub {
  readonly addLangs = jasmine.createSpy('addLangs');
  readonly use = jasmine.createSpy('use');
}

describe('LanguageService', () => {
  let translateService: TranslateServiceStub;

  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    translateService = new TranslateServiceStub();

    TestBed.configureTestingModule({
      providers: [{ provide: TranslateService, useValue: translateService }]
    });
  });

  it('should default to Macedonian language', () => {
    const service = TestBed.inject(LanguageService);

    expect(service.activeLanguage()).toBe('mk');
    expect(translateService.addLangs).toHaveBeenCalledOnceWith(['mk', 'en']);
    expect(translateService.use).toHaveBeenCalledWith('mk');
    expect(localStorage.getItem('projects-hub-language')).toBe('mk');
  });

  it('should restore a saved valid language', () => {
    localStorage.setItem('projects-hub-language', 'en');

    const service = TestBed.inject(LanguageService);

    expect(service.activeLanguage()).toBe('en');
    expect(translateService.use).toHaveBeenCalledWith('en');
  });

  it('should ignore an invalid saved language', () => {
    localStorage.setItem('projects-hub-language', 'de');

    const service = TestBed.inject(LanguageService);

    expect(service.activeLanguage()).toBe('mk');
    expect(translateService.use).toHaveBeenCalledWith('mk');
  });

  it('should update the active language and persist it', () => {
    const service = TestBed.inject(LanguageService);

    const changed = service.setLanguage('en');

    expect(changed).toBeTrue();
    expect(service.activeLanguage()).toBe('en');
    expect(translateService.use).toHaveBeenCalledWith('en');
    expect(localStorage.getItem('projects-hub-language')).toBe('en');
  });

  it('should allow registered guards to block language changes', () => {
    const service = TestBed.inject(LanguageService);
    const unregister = service.registerLanguageChangeGuard(() => false);

    const changed = service.setLanguage('en');

    expect(changed).toBeFalse();
    expect(service.activeLanguage()).toBe('mk');

    unregister();

    expect(service.setLanguage('en')).toBeTrue();
    expect(service.activeLanguage()).toBe('en');
  });
});
