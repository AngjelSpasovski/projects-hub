import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import type { DocumentationCodeExample } from '../documentation.models';
import { DocumentationCodeBlockComponent } from './documentation-code-block.component';

const example: DocumentationCodeExample = {
  id: 'test-example',
  titleKey: 'TITLE',
  descriptionKey: 'DESCRIPTION',
  filename: 'example.ts',
  language: 'typescript',
  code: "const value = signal('ready');\nconst active = computed(() => value() === 'ready');"
};

describe('DocumentationCodeBlockComponent', () => {
  let component: DocumentationCodeBlockComponent;
  let fixture: ComponentFixture<DocumentationCodeBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentationCodeBlockComponent],
      providers: [provideTranslateService({ lang: 'en', fallbackLang: 'en' })]
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentationCodeBlockComponent);
    fixture.componentRef.setInput('example', example);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render clean source lines with line numbers enabled by default', () => {
    expect(component.lines()).toEqual(example.code.split('\n'));
    expect(component.showLineNumbers()).toBeTrue();
    expect(component.wrapLines()).toBeFalse();
    expect(fixture.nativeElement.querySelectorAll('.code-line').length).toBe(2);
  });

  it('should toggle wrapping and line numbers independently', () => {
    component.toggleWrap();
    component.toggleLineNumbers();

    expect(component.wrapLines()).toBeTrue();
    expect(component.showLineNumbers()).toBeFalse();
  });

  it('should copy the original source without rendered line numbers', async () => {
    const writeText = spyOn(navigator.clipboard, 'writeText').and.resolveTo();

    await component.copyCode();

    expect(writeText).toHaveBeenCalledOnceWith(example.code);
    expect(component.copyState()).toBe('copied');
  });

  it('should fall back to a temporary textarea when clipboard permission is denied', async () => {
    spyOn(navigator.clipboard, 'writeText').and.rejectWith(new Error('Permission denied'));
    const execCommand = spyOn(document, 'execCommand').and.returnValue(true);

    await component.copyCode();

    expect(execCommand).toHaveBeenCalledOnceWith('copy');
    expect(component.copyState()).toBe('copied');
    expect(document.querySelector('textarea[readonly]')).toBeNull();
  });
});
