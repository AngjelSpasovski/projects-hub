# Projects Hub

Projects Hub is an Angular portfolio workspace for collecting small frontend projects in one maintainable application.

The app opens directly into an admin-style dashboard where projects are browsed from the sidebar and catalog. Each mini project can be migrated into its own standalone Angular component while keeping shared layout, themes, translations, metadata, and tests consistent.

## Current Features

- Admin shell with header, sidebar, main content, and footer
- Project catalog with big, list, and detailed views
- Search by project name, description, category, status, and tags
- Category filter
- PrimeNG MultiSelect tag filter
- Sorting by name, category, status, and last updated date
- Light, dark, and blue themes
- Macedonian and English translations with `ngx-translate`
- Project metadata: status, difficulty, dates, repository link, live demo link
- Lazy-loaded Calculator and Tic Tac Toe mini projects
- Unit tests for app shell, dashboard logic, registry metadata, shared services, and mini project behavior

## Tech Stack

- Angular 21
- TypeScript
- Bootstrap 5
- SCSS
- PrimeNG
- PrimeIcons
- ngx-translate
- Karma and Jasmine

Exact installed versions are tracked in [DEPENDENCIES.md](./DEPENDENCIES.md).

## Project Status

| Project | Status | Notes |
| --- | --- | --- |
| Calculator | Ready | Migrated as a standalone Angular component with keyboard support and tests. |
| Tic Tac Toe | Ready | Migrated as a standalone Angular component with signal-based game state and tests. |
| Hang Man | Planned | Pending migration. |
| Weather App | Planned | Pending migration. |
| Music Event App | Planned | Pending migration. |

The implementation roadmap is tracked in [TASKS.md](./TASKS.md).

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm start
```

Open:

```text
http://localhost:4200/
```

Build the application:

```bash
npm run build
```

Run unit tests once:

```bash
npm run test -- --watch=false
```

## Folder Structure

```text
src/app/
  core/
    models/
    services/
  features/
    dashboard/
    projects/
      calculator/
      tic-tac-toe/
      project-detail/
      project-registry.ts
  layout/
    admin-shell/
src/assets/
  i18n/
  project-covers/
docs/
  MINI_PROJECT_TEMPLATE.md
```

## Adding A Mini Project

Use [docs/MINI_PROJECT_TEMPLATE.md](./docs/MINI_PROJECT_TEMPLATE.md) as the checklist for every new mini project.

Minimum flow:

1. Create `src/app/features/projects/<project-id>/`.
2. Add the standalone component files.
3. Add project metadata in `project-registry.ts`.
4. Add Macedonian and English translation keys.
5. Add a cover asset in `src/assets/project-covers/`.
6. Add tests for the project logic.
7. Run `npm run build` and `npm run test -- --watch=false`.

## Quality Rules

- Keep visible UI text in translation files.
- Macedonian translations use Cyrillic.
- Do not use `eval` for project logic.
- Keep each mini project isolated unless logic is truly shared.
- Update `TASKS.md` when a task is completed.
- Update `DEPENDENCIES.md` when dependencies change.

## Purpose

This repository is intended to be linked from a developer portfolio so companies can inspect code quality, Angular structure, UI decisions, testing practices, and the evolution of multiple small frontend projects over time.
