# Projects Hub

Projects Hub is an Angular portfolio workspace for collecting small frontend projects in one maintainable application.

[Live application](https://angjelspasovski.github.io/projects-hub/) | [Source repository](https://github.com/AngjelSpasovski/projects-hub)

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
- Distinctive illustrated catalog covers with separate live-project screenshots for documentation
- Unified project workspace containing metadata and the interactive application
- Lazy-loaded Calculator, Tic Tac Toe, Hang Man, Weather, Music Event, and JavaScript Quiz mini projects
- Unit tests for app shell, dashboard logic, registry metadata, shared services, and mini project behavior
- Playwright smoke tests for catalog navigation, view switching, and language switching

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
| Hang Man | Ready | Migrated as a standalone Angular component with word-guessing state and tests. |
| Weather App | Ready | Migrated as a standalone Angular component with simulated API states and tests. |
| Music Event App | Ready | Migrated as a standalone Angular component with PrimeNG filters, dialog details, and tests. |
| JavaScript Quiz | Ready | Six randomized questions per round from a reviewed 26-question bank, with timer, review, translations, and tests. |

The master roadmap is tracked in [TASKS.md](./TASKS.md). Detailed batches, project backlogs, and completion rules live in [docs/tasks](./docs/tasks/README.md).

## Next Work

The next product priority is the To-Do List with LocalStorage, followed by Expense Tracker and Technical Documentation. Legacy migrations start with Project Planner, Odd/Even, and Dev Logger.

## Migrated Projects

### Calculator

Folder: [`src/app/features/projects/calculator`](./src/app/features/projects/calculator)

Calculator is a compact utility project focused on component-local state, keyboard input, and safe arithmetic behavior. It supports basic arithmetic, decimal input, percentage conversion, sign toggling, reset, keyboard shortcuts, and a visible error state for invalid operations such as division by zero.

Angular coverage: standalone component, host keyboard listener, template-driven button rendering, component-local state, and unit tests for calculator behavior.

### Tic Tac Toe

Folder: [`src/app/features/projects/tic-tac-toe`](./src/app/features/projects/tic-tac-toe)

Tic Tac Toe is a local two-player game built to demonstrate signal-based state and derived game outcomes. It includes alternating turns, winner detection for rows, columns, and diagonals, draw detection, winning-cell highlighting, reset flow, and responsive board layout.

Angular coverage: standalone component, signals, computed state, template control flow, button grid rendering, and unit tests for game rules.

### Hang Man

Folder: [`src/app/features/projects/hang-man`](./src/app/features/projects/hang-man)

Hang Man is a word-guessing game focused on derived UI state and keyboard interactions. It includes hidden word rendering, on-screen letter keyboard, physical keyboard support, wrong guess tracking, remaining attempts, win/loss states, and reset with a new word.

Angular coverage: standalone component, signals, computed state, host keyboard listener, template control flow, and unit tests for game behavior.

### Weather App

Folder: [`src/app/features/projects/weather`](./src/app/features/projects/weather)

Weather App is an API-style dashboard that demonstrates async-like frontend states without requiring an external API key. It includes simulated loading, local weather data, condition filters, average temperature summary, last updated metadata, manual error state, retry flow, and empty states.

Angular coverage: standalone component, signals, computed filters, template-driven form control, conditional loading/error/empty rendering, and unit tests with fake timers.

### Music Event App

Folder: [`src/app/features/projects/music-event`](./src/app/features/projects/music-event)

Music Event App is an event catalog focused on richer UI controls and detail views. It includes category filtering, PrimeNG MultiSelect tag filtering, result and seat summaries, detailed list rows, PrimeNG Dialog event details, empty state, and filter reset flow.

Angular coverage: standalone component, signals, computed filters, template-driven forms, PrimeNG MultiSelect, PrimeNG Dialog, and unit tests for filtering and modal state.

### JavaScript Quiz

Folder: [`src/app/features/projects/javascript-quiz`](./src/app/features/projects/javascript-quiz)

JavaScript Quiz is a timed multiple-choice challenge built from reviewed JavaScript learning material. Every round draws six questions from a typed bank of 26 and randomizes the answer positions. It includes a per-question countdown, automatic timeout progression, score calculation, translated explanations, answer review, and restart flow.

Angular coverage: standalone component, signals, computed score and progress, timer cleanup, translated typed question data, lazy loading, unit tests, and an end-to-end completion workflow.

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

Run end-to-end smoke tests:

```bash
npm run test:e2e
```

Regenerate live project screenshots for documentation and the future gallery:

```bash
npm run covers
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
      hang-man/
      javascript-quiz/
      tic-tac-toe/
      weather/
      music-event/
      project-detail/
      project-registry.ts
  layout/
    admin-shell/
  shared/
    ui/
    validation/
src/assets/
  i18n/
  project-covers/
  project-screenshots/
docs/
  tasks/
    DASHBOARD_WIDGETS.md
    DEFINITION_OF_DONE.md
    LEGACY_MIGRATIONS.md
    NEW_PROJECTS_BACKLOG.md
    UI_REFINEMENTS.md
  GITHUB_REPOSITORY_SETTINGS.md
  I18N.md
  MINI_PROJECT_TEMPLATE.md
  NEXT_MIGRATION_BATCH.md
  PORTFOLIO_ENTRY.md
```

## Adding A Mini Project

Use [docs/MINI_PROJECT_TEMPLATE.md](./docs/MINI_PROJECT_TEMPLATE.md) as the checklist for every new mini project.

Minimum flow:

1. Create `src/app/features/projects/<project-id>/`.
2. Add the standalone component files.
3. Add project metadata in `project-registry.ts`.
4. Add Macedonian and English translation keys.
5. Add a distinctive illustrated catalog cover in `src/assets/project-covers/`.
6. Add tests for the project logic.
7. Run `npm run build` and `npm run test -- --watch=false`.

The full work order is documented in [docs/tasks](./docs/tasks/README.md). Legacy sources are mapped in [LEGACY_MIGRATIONS.md](./docs/tasks/LEGACY_MIGRATIONS.md), while new ideas are prioritized in [NEW_PROJECTS_BACKLOG.md](./docs/tasks/NEW_PROJECTS_BACKLOG.md).

## Quality Rules

- Keep visible UI text in translation files.
- Macedonian translations use Cyrillic.
- Do not use `eval` for project logic.
- Keep each mini project isolated unless logic is truly shared.
- Update `TASKS.md` when a task is completed.
- Complete [Definition of Done](./docs/tasks/DEFINITION_OF_DONE.md) before changing a project status to `ready`.
- Update `DEPENDENCIES.md` when dependencies change.

## Purpose

This repository is intended to be linked from a developer portfolio so companies can inspect code quality, Angular structure, UI decisions, testing practices, and the evolution of multiple small frontend projects over time.
