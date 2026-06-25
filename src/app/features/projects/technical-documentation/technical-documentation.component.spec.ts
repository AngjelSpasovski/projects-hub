import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { TechnicalDocumentationComponent } from './technical-documentation.component';

describe('TechnicalDocumentationComponent', () => {
  let component: TechnicalDocumentationComponent;
  let fixture: ComponentFixture<TechnicalDocumentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnicalDocumentationComponent],
      providers: [provideTranslateService({ lang: 'en', fallbackLang: 'en' })]
    }).compileComponents();

    fixture = TestBed.createComponent(TechnicalDocumentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create with documentation sections', () => {
    expect(component).toBeTruthy();
    expect(component.sections.length).toBe(4);
    expect(component.selectedSection()?.id).toBe('architecture');
  });

  it('should filter sections by translated text and code references', () => {
    component.updateQuery('i18n');

    expect(component.filteredSections().map((section) => section.id)).toEqual(['i18n']);
    expect(component.selectedSection()?.id).toBe('i18n');
  });

  it('should clear search and return to the first section', () => {
    component.updateQuery('no-match');
    expect(component.filteredSections().length).toBe(0);

    component.clearSearch();

    expect(component.query()).toBe('');
    expect(component.selectedSection()?.id).toBe('architecture');
  });
});
