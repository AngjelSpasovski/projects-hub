import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { ProjectDetailComponent } from './project-detail.component';

describe('ProjectDetailComponent', () => {
  let fixture: ComponentFixture<ProjectDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectDetailComponent],
      providers: [
        provideRouter([]),
        provideTranslateService({ lang: 'en', fallbackLang: 'en' }),
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ projectId: 'calculator' })) }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectDetailComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('renders project metadata and the live component in one workspace surface', () => {
    const element = fixture.nativeElement as HTMLElement;
    const workspace = element.querySelector('.project-workspace');

    expect(workspace).not.toBeNull();
    expect(workspace?.querySelector('.project-detail')).not.toBeNull();
    expect(workspace?.querySelector('.project-live .calculator-page')).not.toBeNull();
    expect(workspace?.querySelectorAll('.surface-panel').length).toBe(0);
  });

  it('uses the demo action to target the live project region', () => {
    const element = fixture.nativeElement as HTMLElement;
    const demoButton = element.querySelector('.project-actions .btn-primary');
    const liveRegion = element.querySelector('.project-live');

    expect(demoButton?.textContent).toContain('PROJECT.DEMO');
    expect(demoButton?.textContent).not.toContain('PROJECT.DEMO_PENDING');
    expect(liveRegion?.getAttribute('tabindex')).toBe('-1');
  });
});
