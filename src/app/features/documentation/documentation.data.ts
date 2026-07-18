import { DocumentationSection } from './documentation.models';

export const DOCUMENTATION_SECTIONS: readonly DocumentationSection[] = [
  {
    id: 'overview',
    icon: 'pi pi-home',
    titleKey: 'DOCUMENTATION.SECTIONS.OVERVIEW.TITLE',
    summaryKey: 'DOCUMENTATION.SECTIONS.OVERVIEW.SUMMARY',
    topics: [
      {
        id: 'purpose',
        titleKey: 'DOCUMENTATION.SECTIONS.OVERVIEW.TOPICS.PURPOSE.TITLE',
        bodyKey: 'DOCUMENTATION.SECTIONS.OVERVIEW.TOPICS.PURPOSE.BODY'
      },
      {
        id: 'release-scope',
        titleKey: 'DOCUMENTATION.SECTIONS.OVERVIEW.TOPICS.SCOPE.TITLE',
        bodyKey: 'DOCUMENTATION.SECTIONS.OVERVIEW.TOPICS.SCOPE.BODY'
      },
      {
        id: 'navigation-model',
        titleKey: 'DOCUMENTATION.SECTIONS.OVERVIEW.TOPICS.NAVIGATION.TITLE',
        bodyKey: 'DOCUMENTATION.SECTIONS.OVERVIEW.TOPICS.NAVIGATION.BODY'
      }
    ],
    codeRefs: [
      { path: 'README.md', kind: 'documentation' },
      { path: 'PROJECT_ANALYSIS_AND_ROADMAP.md', kind: 'documentation' },
      { path: 'src/app/app.routes.ts', kind: 'source' }
    ]
  },
  {
    id: 'user-guide',
    icon: 'pi pi-compass',
    titleKey: 'DOCUMENTATION.SECTIONS.USER_GUIDE.TITLE',
    summaryKey: 'DOCUMENTATION.SECTIONS.USER_GUIDE.SUMMARY',
    topics: [
      {
        id: 'catalog',
        titleKey: 'DOCUMENTATION.SECTIONS.USER_GUIDE.TOPICS.CATALOG.TITLE',
        bodyKey: 'DOCUMENTATION.SECTIONS.USER_GUIDE.TOPICS.CATALOG.BODY'
      },
      {
        id: 'preferences',
        titleKey: 'DOCUMENTATION.SECTIONS.USER_GUIDE.TOPICS.PREFERENCES.TITLE',
        bodyKey: 'DOCUMENTATION.SECTIONS.USER_GUIDE.TOPICS.PREFERENCES.BODY'
      },
      {
        id: 'workspaces',
        titleKey: 'DOCUMENTATION.SECTIONS.USER_GUIDE.TOPICS.WORKSPACES.TITLE',
        bodyKey: 'DOCUMENTATION.SECTIONS.USER_GUIDE.TOPICS.WORKSPACES.BODY'
      }
    ],
    codeRefs: [
      { path: 'src/app/features/dashboard', kind: 'source' },
      { path: 'src/app/layout/admin-shell', kind: 'source' },
      { path: 'src/app/features/projects/project-detail', kind: 'source' }
    ]
  },
  {
    id: 'technical-guide',
    icon: 'pi pi-sitemap',
    titleKey: 'DOCUMENTATION.SECTIONS.TECHNICAL_GUIDE.TITLE',
    summaryKey: 'DOCUMENTATION.SECTIONS.TECHNICAL_GUIDE.SUMMARY',
    topics: [
      {
        id: 'architecture',
        titleKey: 'DOCUMENTATION.SECTIONS.TECHNICAL_GUIDE.TOPICS.ARCHITECTURE.TITLE',
        bodyKey: 'DOCUMENTATION.SECTIONS.TECHNICAL_GUIDE.TOPICS.ARCHITECTURE.BODY'
      },
      {
        id: 'state-storage',
        titleKey: 'DOCUMENTATION.SECTIONS.TECHNICAL_GUIDE.TOPICS.STATE.TITLE',
        bodyKey: 'DOCUMENTATION.SECTIONS.TECHNICAL_GUIDE.TOPICS.STATE.BODY'
      },
      {
        id: 'translations-quality',
        titleKey: 'DOCUMENTATION.SECTIONS.TECHNICAL_GUIDE.TOPICS.QUALITY.TITLE',
        bodyKey: 'DOCUMENTATION.SECTIONS.TECHNICAL_GUIDE.TOPICS.QUALITY.BODY'
      }
    ],
    codeRefs: [
      { path: 'src/app/app.routes.ts', kind: 'source' },
      { path: 'src/assets/i18n', kind: 'source' },
      { path: 'e2e/app-smoke.spec.ts', kind: 'test' }
    ]
  },
  {
    id: 'projects',
    icon: 'pi pi-folder-open',
    titleKey: 'DOCUMENTATION.SECTIONS.PROJECTS.TITLE',
    summaryKey: 'DOCUMENTATION.SECTIONS.PROJECTS.SUMMARY',
    topics: [
      {
        id: 'registry',
        titleKey: 'DOCUMENTATION.SECTIONS.PROJECTS.TOPICS.REGISTRY.TITLE',
        bodyKey: 'DOCUMENTATION.SECTIONS.PROJECTS.TOPICS.REGISTRY.BODY'
      },
      {
        id: 'page-template',
        titleKey: 'DOCUMENTATION.SECTIONS.PROJECTS.TOPICS.TEMPLATE.TITLE',
        bodyKey: 'DOCUMENTATION.SECTIONS.PROJECTS.TOPICS.TEMPLATE.BODY'
      },
      {
        id: 'definition-of-done',
        titleKey: 'DOCUMENTATION.SECTIONS.PROJECTS.TOPICS.DONE.TITLE',
        bodyKey: 'DOCUMENTATION.SECTIONS.PROJECTS.TOPICS.DONE.BODY'
      }
    ],
    codeRefs: [
      { path: 'src/app/features/projects/project-registry.ts', kind: 'source' },
      { path: 'docs/tasks/DEFINITION_OF_DONE.md', kind: 'documentation' },
      { path: 'docs/MINI_PROJECT_TEMPLATE.md', kind: 'documentation' }
    ]
  },
  {
    id: 'status-matrix',
    icon: 'pi pi-table',
    titleKey: 'DOCUMENTATION.SECTIONS.STATUS_MATRIX.TITLE',
    summaryKey: 'DOCUMENTATION.SECTIONS.STATUS_MATRIX.SUMMARY',
    topics: [
      {
        id: 'current-state',
        titleKey: 'DOCUMENTATION.SECTIONS.STATUS_MATRIX.TOPICS.CURRENT.TITLE',
        bodyKey: 'DOCUMENTATION.SECTIONS.STATUS_MATRIX.TOPICS.CURRENT.BODY'
      },
      {
        id: 'tracked-fields',
        titleKey: 'DOCUMENTATION.SECTIONS.STATUS_MATRIX.TOPICS.FIELDS.TITLE',
        bodyKey: 'DOCUMENTATION.SECTIONS.STATUS_MATRIX.TOPICS.FIELDS.BODY'
      },
      {
        id: 'matrix-plan',
        titleKey: 'DOCUMENTATION.SECTIONS.STATUS_MATRIX.TOPICS.NEXT.TITLE',
        bodyKey: 'DOCUMENTATION.SECTIONS.STATUS_MATRIX.TOPICS.NEXT.BODY'
      }
    ],
    codeRefs: [
      { path: 'src/app/features/projects/project-registry.ts', kind: 'source' },
      { path: 'docs/tasks/DOCUMENTATION_HUB.md', kind: 'documentation' },
      { path: 'docs/tasks/NEW_PROJECTS_BACKLOG.md', kind: 'documentation' }
    ]
  },
  {
    id: 'maintenance',
    icon: 'pi pi-wrench',
    titleKey: 'DOCUMENTATION.SECTIONS.MAINTENANCE.TITLE',
    summaryKey: 'DOCUMENTATION.SECTIONS.MAINTENANCE.SUMMARY',
    topics: [
      {
        id: 'change-flow',
        titleKey: 'DOCUMENTATION.SECTIONS.MAINTENANCE.TOPICS.CHANGES.TITLE',
        bodyKey: 'DOCUMENTATION.SECTIONS.MAINTENANCE.TOPICS.CHANGES.BODY'
      },
      {
        id: 'verification',
        titleKey: 'DOCUMENTATION.SECTIONS.MAINTENANCE.TOPICS.VERIFICATION.TITLE',
        bodyKey: 'DOCUMENTATION.SECTIONS.MAINTENANCE.TOPICS.VERIFICATION.BODY'
      },
      {
        id: 'documentation-alignment',
        titleKey: 'DOCUMENTATION.SECTIONS.MAINTENANCE.TOPICS.ALIGNMENT.TITLE',
        bodyKey: 'DOCUMENTATION.SECTIONS.MAINTENANCE.TOPICS.ALIGNMENT.BODY'
      }
    ],
    codeRefs: [
      { path: 'TASKS.md', kind: 'documentation' },
      { path: 'docs/tasks/README.md', kind: 'documentation' },
      { path: 'docs/tasks/DEFINITION_OF_DONE.md', kind: 'documentation' }
    ]
  },
  {
    id: 'release',
    icon: 'pi pi-flag',
    titleKey: 'DOCUMENTATION.SECTIONS.RELEASE.TITLE',
    summaryKey: 'DOCUMENTATION.SECTIONS.RELEASE.SUMMARY',
    topics: [
      {
        id: 'release-state',
        titleKey: 'DOCUMENTATION.SECTIONS.RELEASE.TOPICS.STATE.TITLE',
        bodyKey: 'DOCUMENTATION.SECTIONS.RELEASE.TOPICS.STATE.BODY'
      },
      {
        id: 'deferred-work',
        titleKey: 'DOCUMENTATION.SECTIONS.RELEASE.TOPICS.DEFERRED.TITLE',
        bodyKey: 'DOCUMENTATION.SECTIONS.RELEASE.TOPICS.DEFERRED.BODY'
      },
      {
        id: 'future-decisions',
        titleKey: 'DOCUMENTATION.SECTIONS.RELEASE.TOPICS.DECISIONS.TITLE',
        bodyKey: 'DOCUMENTATION.SECTIONS.RELEASE.TOPICS.DECISIONS.BODY'
      }
    ],
    codeRefs: [
      { path: 'PROJECT_ANALYSIS_AND_ROADMAP.md', kind: 'documentation' },
      { path: 'docs/tasks/NEW_PROJECTS_BACKLOG.md', kind: 'documentation' },
      { path: '.github/workflows/deploy-pages.yml', kind: 'source' }
    ]
  }
];
