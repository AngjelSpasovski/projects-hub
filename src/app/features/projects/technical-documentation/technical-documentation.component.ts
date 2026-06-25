import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { LanguageService } from '../../../core/services/language.service';

interface DocumentationSection {
  id: string;
  icon: string;
  tone: 'blue' | 'green' | 'amber' | 'rose';
  titleKey: string;
  summaryKey: string;
  items: string[];
  codeRefs: string[];
}

const DOCUMENTATION_SECTIONS: DocumentationSection[] = [
  {
    id: 'architecture',
    icon: 'pi pi-sitemap',
    tone: 'blue',
    titleKey: 'TECHNICAL_DOCS.SECTIONS.ARCHITECTURE.TITLE',
    summaryKey: 'TECHNICAL_DOCS.SECTIONS.ARCHITECTURE.SUMMARY',
    items: [
      'TECHNICAL_DOCS.SECTIONS.ARCHITECTURE.ITEMS.ROUTES',
      'TECHNICAL_DOCS.SECTIONS.ARCHITECTURE.ITEMS.SHELL',
      'TECHNICAL_DOCS.SECTIONS.ARCHITECTURE.ITEMS.LAZY'
    ],
    codeRefs: ['src/app/app.routes.ts', 'src/app/layout', 'src/app/features/projects/project-detail']
  },
  {
    id: 'project-flow',
    icon: 'pi pi-folder-plus',
    tone: 'green',
    titleKey: 'TECHNICAL_DOCS.SECTIONS.PROJECT_FLOW.TITLE',
    summaryKey: 'TECHNICAL_DOCS.SECTIONS.PROJECT_FLOW.SUMMARY',
    items: [
      'TECHNICAL_DOCS.SECTIONS.PROJECT_FLOW.ITEMS.COMPONENT',
      'TECHNICAL_DOCS.SECTIONS.PROJECT_FLOW.ITEMS.REGISTRY',
      'TECHNICAL_DOCS.SECTIONS.PROJECT_FLOW.ITEMS.COVER'
    ],
    codeRefs: ['src/app/features/projects', 'src/app/features/projects/project-registry.ts', 'src/assets/project-covers']
  },
  {
    id: 'i18n',
    icon: 'pi pi-language',
    tone: 'amber',
    titleKey: 'TECHNICAL_DOCS.SECTIONS.I18N.TITLE',
    summaryKey: 'TECHNICAL_DOCS.SECTIONS.I18N.SUMMARY',
    items: [
      'TECHNICAL_DOCS.SECTIONS.I18N.ITEMS.KEYS',
      'TECHNICAL_DOCS.SECTIONS.I18N.ITEMS.MACEDONIAN',
      'TECHNICAL_DOCS.SECTIONS.I18N.ITEMS.LENGTH'
    ],
    codeRefs: ['src/assets/i18n/en.json', 'src/assets/i18n/mk.json', 'src/app/core/services/language.service.ts']
  },
  {
    id: 'quality',
    icon: 'pi pi-verified',
    tone: 'rose',
    titleKey: 'TECHNICAL_DOCS.SECTIONS.QUALITY.TITLE',
    summaryKey: 'TECHNICAL_DOCS.SECTIONS.QUALITY.SUMMARY',
    items: [
      'TECHNICAL_DOCS.SECTIONS.QUALITY.ITEMS.UNIT',
      'TECHNICAL_DOCS.SECTIONS.QUALITY.ITEMS.E2E',
      'TECHNICAL_DOCS.SECTIONS.QUALITY.ITEMS.BUILD'
    ],
    codeRefs: ['*.spec.ts', 'e2e/app-smoke.spec.ts', 'npm run build']
  }
];

@Component({
  selector: 'app-technical-documentation',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './technical-documentation.component.html',
  styleUrl: './technical-documentation.component.scss'
})
export class TechnicalDocumentationComponent {
  private readonly languageService = inject(LanguageService);
  private readonly translate = inject(TranslateService);

  readonly sections = DOCUMENTATION_SECTIONS;
  readonly query = signal('');
  readonly selectedSectionId = signal(DOCUMENTATION_SECTIONS[0].id);

  readonly filteredSections = computed(() => {
    this.languageService.activeLanguage();

    const query = this.query().trim().toLowerCase();

    if (!query) {
      return this.sections;
    }

    return this.sections.filter((section) => this.searchText(section).includes(query));
  });

  readonly selectedSection = computed(() => {
    const filteredSections = this.filteredSections();
    const selectedSectionId = this.selectedSectionId();

    return filteredSections.find((section) => section.id === selectedSectionId) ?? filteredSections[0] ?? null;
  });
  readonly activeSectionId = computed(() => this.selectedSection()?.id ?? null);

  updateQuery(value: string): void {
    this.query.set(value);
  }

  selectSection(sectionId: string): void {
    this.selectedSectionId.set(sectionId);
  }

  clearSearch(): void {
    this.query.set('');
    this.selectedSectionId.set(DOCUMENTATION_SECTIONS[0].id);
  }

  private searchText(section: DocumentationSection): string {
    return [
      this.translateKey(section.titleKey),
      this.translateKey(section.summaryKey),
      ...section.items.map((item) => this.translateKey(item)),
      ...section.codeRefs
    ]
      .join(' ')
      .toLowerCase();
  }

  private translateKey(key: string): string {
    return String(this.translate.instant(key));
  }
}
