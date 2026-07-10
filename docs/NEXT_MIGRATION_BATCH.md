# Next Migration Batch

> Historical source review. The active migration order is maintained in [`docs/tasks/LEGACY_MIGRATIONS.md`](./tasks/LEGACY_MIGRATIONS.md).

The older workspace was reviewed by source files, feature scope, and migration value. Generated admin templates, course lecture snippets, duplicate Angular shells, and vendor code are not migration targets.

## Selected Projects

| Priority | Project | Source | Migration value |
| --- | --- | --- | --- |
| 1 | Project Planner | `../JAVASCRIPT/javaScriptTutorialApps/02 - Project Planner/events-14-finished` | Convert imperative DOM events and project movement into typed Angular state, reusable cards, and drag-and-drop interactions. |
| 2 | Recipe Book | `../AllMyProjectsInONE/www_ClientPanelApp/recipeBook` | Completed as a standalone recipe and shopping list workflow with reactive forms and typed signal state. |
| 3 | Client Panel | `../AllMyProjectsInONE/www_ClientPanelApp/clientPanel` | Demonstrate CRUD workflows, validation, route guards, list/detail views, and API fallback handling. |

## Migration Order

1. Project Planner: smallest boundary and best next proof of a JavaScript-to-Angular migration.
2. Recipe Book: completed as one feature package, replacing obsolete Angular patterns.
3. Client Panel: migrate only after the shared forms and async-state APIs have been exercised by the first two projects.

## Acceptance Criteria

- Use a standalone project component and a route registered in `project-registry.ts`.
- Preserve useful behavior, not legacy framework structure or vendor templates.
- Keep all visible text in English and Macedonian translation files.
- Add loading, empty, error, and validation states where the workflow requires them.
- Add focused unit tests and one Playwright path for the primary workflow.
- Add a project README and generated cover before marking the migration ready.

## Deferred Sources

- `ADMIN PAGES`: third-party templates and vendor bundles, useful only as visual reference.
- `typescript-udemy-course` and quiz materials: learning snippets, not complete portfolio projects.
- `myBigONE`, translation demos, and duplicate shells: architectural experiments already superseded by Projects Hub.
