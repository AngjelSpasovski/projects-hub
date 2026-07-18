import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { DocumentationComponent } from './documentation.component';

describe('DocumentationComponent', () => {
  let component: DocumentationComponent;
  let fixture: ComponentFixture<DocumentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentationComponent],
      providers: [provideTranslateService({ lang: 'en', fallbackLang: 'en' })]
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create with the seven content architecture sections', () => {
    expect(component).toBeTruthy();
    expect(component.sections.length).toBe(7);
    expect(component.selectedSection()?.id).toBe('overview');
    expect(component.totalReferences).toBe(21);
  });

  it('should select maintenance guidance with typed topics and references', () => {
    component.selectSection('maintenance');

    expect(component.selectedSection()?.id).toBe('maintenance');
    expect(component.selectedSection()?.topics.length).toBe(3);
    expect(component.selectedSection()?.codeRefs.every((reference) => reference.kind === 'documentation')).toBeTrue();
  });

  it('should expose typed technical code examples', () => {
    expect(component.codeExamples.length).toBe(3);
    expect(component.codeExamples.map((example) => example.language)).toEqual(['typescript', 'typescript', 'html']);
    expect(component.codeExamples.every((example) => example.code.length > 0)).toBeTrue();
  });

  it('should keep documentation aligned with all 28 registry projects', () => {
    expect(component.projectDocumentation.length).toBe(28);
    expect(component.projectDocumentation.map((entry) => entry.project.id)).toEqual(
      component.projectDocumentation.map((entry) => entry.documentation.projectId)
    );
    expect(component.projectDocumentation.every((entry) => entry.documentation.featureKeys.length >= 3)).toBeTrue();
    expect(component.projectDocumentation.every((entry) => entry.documentation.hasUnitTests)).toBeTrue();
    expect(component.projectDocumentation.every((entry) => entry.documentation.hasE2eCoverage)).toBeTrue();
  });

  it('should find and select a documented project through the shared search', () => {
    component.updateQuery('chat');

    expect(component.filteredSections().map((section) => section.id)).toEqual(['projects']);
    expect(component.filteredProjectDocumentation().map((entry) => entry.project.id)).toEqual(['chat-app']);
    expect(component.selectedProjectDocumentation()?.project.id).toBe('chat-app');
  });

  it('should filter sections by keys and code references', () => {
    component.updateQuery('i18n');

    expect(component.filteredSections().map((section) => section.id)).toEqual(['technical-guide']);
    expect(component.selectedSection()?.id).toBe('technical-guide');
  });

  it('should clear search and return to overview', () => {
    component.updateQuery('no-match');
    expect(component.filteredSections().length).toBe(0);

    component.clearSearch();

    expect(component.query()).toBe('');
    expect(component.selectedSection()?.id).toBe('overview');
  });
});
