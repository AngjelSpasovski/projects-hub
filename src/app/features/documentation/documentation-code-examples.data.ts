import type { DocumentationCodeExample } from './documentation.models';

export const DOCUMENTATION_CODE_EXAMPLES: readonly DocumentationCodeExample[] = [
  {
    id: 'lazy-route',
    titleKey: 'DOCUMENTATION.CODE_EXAMPLES.ITEMS.ROUTE.TITLE',
    descriptionKey: 'DOCUMENTATION.CODE_EXAMPLES.ITEMS.ROUTE.DESCRIPTION',
    filename: 'src/app/app.routes.ts',
    language: 'typescript',
    code: `{
  path: 'documentation',
  loadComponent: () =>
    import('./features/documentation/documentation.component').then(
      (component) => component.DocumentationComponent
    )
}`
  },
  {
    id: 'signal-filter',
    titleKey: 'DOCUMENTATION.CODE_EXAMPLES.ITEMS.SIGNALS.TITLE',
    descriptionKey: 'DOCUMENTATION.CODE_EXAMPLES.ITEMS.SIGNALS.DESCRIPTION',
    filename: 'project-status-matrix.component.ts',
    language: 'typescript',
    code: `readonly query = signal('');

readonly filteredRows = computed(() => {
  const query = this.query().trim().toLowerCase();
  return this.rows.filter((entry) =>
    this.searchText(entry).includes(query)
  );
});`
  },
  {
    id: 'translated-template',
    titleKey: 'DOCUMENTATION.CODE_EXAMPLES.ITEMS.TRANSLATION.TITLE',
    descriptionKey: 'DOCUMENTATION.CODE_EXAMPLES.ITEMS.TRANSLATION.DESCRIPTION',
    filename: 'documentation.component.html',
    language: 'html',
    code: `<button
  type="button"
  class="section-button"
  [class.active]="activeSectionId() === section.id"
  (click)="selectSection(section.id)"
>
  <i [class]="section.icon"></i>
  <span>{{ section.titleKey | translate }}</span>
</button>`
  }
];
