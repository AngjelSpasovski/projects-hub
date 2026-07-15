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
- Realm, light, dark, and blue themes
- Macedonian and English translations with `ngx-translate`
- Project metadata: status, difficulty, dates, repository link, live demo link
- Fixed dashboard clock and weather summary widgets
- Distinctive illustrated catalog covers with separate live-project screenshots for documentation
- Unified project workspace containing metadata and the interactive application
- Lazy-loaded Calculator, Tic Tac Toe, Hang Man, Weather, Music Event, JavaScript Quiz, To-Do List, Expense Tracker, Technical Documentation, Movie Search, REST Countries, Currency Converter, Quotes API, Sticky Notes, Grocery List, Project Planner, Odd/Even Counter, Dev Logger, Recipe Book, Flashcards, Timer, Digital Clock, Tip Calculator, Memory Game, Math 4 Kids, Music Player, Photo Book, Client Panel, and Chat App mini projects
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
- Chart.js
- Karma and Jasmine
- Playwright

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
| To-Do List | Ready | Migrated as a standalone Angular component with task CRUD, validation, filters, priority labels, and LocalStorage persistence. |
| Expense Tracker | Ready | Migrated as a standalone Angular component with income/expense entries, totals, validation, LocalStorage persistence, and Chart.js summaries. |
| Technical Documentation | Ready | Added as a searchable standalone documentation component for architecture, contribution flow, translations, and quality checks. |
| Movie Search | Ready | Added as an API-style movie catalog with search, pagination, selected details, and retry states. |
| REST Countries | Ready | Added as a country explorer with search, region filters, detail cards, favorites, and persistence. |
| Currency Converter | Ready | Added as an exchange-rate demo with validation, currency swap, stale-data handling, and retry states. |
| Quotes API | Ready | Added as a quote loader with favorites, retry behavior, and reduced-motion-aware typewriter effects. |
| Sticky Notes | Ready | Added as a LocalStorage note board with create, edit, color, pin, delete, and search flows. |
| Grocery List | Ready | Added as a persisted grocery workflow with quantities, categories, purchased state, and filters. |
| Project Planner | Ready | Migrated as the first legacy JavaScript project board with typed lanes, project creation, drag-and-drop movement, and contextual details. |
| Odd/Even Counter | Ready | Migrated as a compact Angular timing and data-binding demo with signal-derived odd/even lanes. |
| Dev Logger | Ready | Migrated as a CRUD logger with validated entries, level filters, search, and typed signal state. |
| Recipe Book | Ready | Migrated as a recipe list, detail, and shopping list workflow with reactive forms and typed signal state. |
| Flashcards | Ready | Added as a study deck manager with reveal/review flow, editing, shuffle, and LocalStorage persistence. |
| Timer | Ready | Added as a countdown timer with presets, custom duration, pause/resume controls, completion state, and persistence. |
| Digital Clock | Ready | Added as a live clock with date display, 12/24-hour mode, timezone selection, and persisted settings. |
| Tip Calculator | Ready | Added as a split-bill utility with tip presets, custom percentage, people count validation, and per-person totals. |
| Memory Game | Ready | Added as a card matching game with shuffled pairs, difficulty levels, moves, timer, reset, and completion summary. |
| Math 4 Kids | Ready | Added as an arithmetic practice game with operation and difficulty selection, score, streak, timer, feedback, and restart. |
| Music Player | Ready | Added as a media-style playlist UI with current track, search, favorites, playback state, and safe YouTube links. |
| Photo Book | Ready | Added as a visual gallery with optimized local Macedonia assets, People category photo, grid/list views, filtering, selected-photo detail, slider controls, autoplay, and keyboard navigation. |
| Client Panel | Ready | Migrated as a safe local demo workflow with client list, detail, create, edit, delete, validation, totals, and LocalStorage persistence. |
| Chat App | Ready | Added as a static-safe local chat demo with rooms, messages, search, connection state, validation, and LocalStorage persistence. |

The master roadmap is tracked in [TASKS.md](./TASKS.md). Detailed batches, project backlogs, and completion rules live in [docs/tasks](./docs/tasks/README.md). A consolidated project analysis and forward plan is tracked in [PROJECT_ANALYSIS_AND_ROADMAP.md](./PROJECT_ANALYSIS_AND_ROADMAP.md).

## Next Work

The target project list for the current static portfolio release is complete. Documentation alignment, the shared UI polish pass, and the planned mini project sequence are complete.

Next work should stay in stabilization mode: final QA, GitHub repository metadata, deployment checks, UI polish, and bug fixes as they are found. Backend integration remains deferred until Firebase or Socket.io is deliberately selected.

## Migrated Projects

### Calculator

Folder: [`src/app/features/projects/calculator`](./src/app/features/projects/calculator)

Calculator is a compact utility project focused on component-local state, keyboard input, and safe arithmetic behavior. It supports basic arithmetic, decimal input, percentage conversion, sign toggling, reset, keyboard shortcuts, and a visible error state for invalid operations such as division by zero.

Angular coverage: standalone component, host keyboard listener, template-driven button rendering, component-local state, and unit tests for calculator behavior.

### Tic Tac Toe

Folder: [`src/app/features/projects/tic-tac-toe`](./src/app/features/projects/tic-tac-toe)

Tic Tac Toe is a local two-player game built to demonstrate signal-based state and derived game outcomes. It includes alternating turns, winner detection for rows, columns, and diagonals, draw detection, winning-cell highlighting, score tracking, reset confirmations, round result modals, match winner flow, and responsive board layout.

Angular coverage: standalone component, signals, computed state, template control flow, PrimeNG Dialog, button grid rendering, and unit tests for game rules.

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

### To-Do List

Folder: [`src/app/features/projects/todo-list`](./src/app/features/projects/todo-list)

To-Do List is a productivity mini project for managing local tasks. It includes required-title validation, optional notes, priority labels, due dates, edit and delete actions, active/completed filters, completed-task cleanup, demo reset, and LocalStorage persistence.

Angular coverage: standalone component, template-driven forms, signals, computed task counts and filters, LocalStorage persistence, translated labels, lazy loading, and focused unit tests.

### Expense Tracker

Folder: [`src/app/features/projects/expense-tracker`](./src/app/features/projects/expense-tracker)

Expense Tracker is a local finance mini project for tracking income and expenses. It includes title and amount validation, entry type and category fields, date metadata, edit and delete actions, income/expense filters, balance calculation, LocalStorage persistence, and a Chart.js doughnut summary.

Angular coverage: standalone component, template-driven forms, signals, computed finance totals, Chart.js canvas integration, LocalStorage persistence, translated labels, lazy loading, and focused unit tests.

### Technical Documentation

Folder: [`src/app/features/projects/technical-documentation`](./src/app/features/projects/technical-documentation)

Technical Documentation is a searchable guide for the current Projects Hub architecture and contribution flow. It includes documentation sections for application architecture, adding a project, translation rules, and quality checks, with relevant code references for each section.

### Project Planner

Folder: [`src/app/features/projects/project-planner`](./src/app/features/projects/project-planner)

Project Planner is the first completed legacy JavaScript migration from the old project board example. It includes active and finished lanes, button and drag-and-drop project movement, project creation with validation, contextual details, empty states, and a translated Angular shell.

Angular coverage: standalone component, typed project state, signals, computed lane filters, guarded drag events, signal-based form state, lazy loading, illustrated cover, focused unit tests, and e2e workflow coverage.

### Odd/Even Counter

Folder: [`src/app/features/projects/odd-even`](./src/app/features/projects/odd-even)

Odd/Even Counter is a compact legacy migration from the old Angular data-binding exercise. It includes timed number generation, manual stepping, pause and reset controls, derived odd/even lanes, translated empty states, and a responsive workspace layout.

Angular coverage: standalone component, signals, computed odd/even lists, interval cleanup with `DestroyRef`, lazy loading, illustrated cover, focused unit tests, and e2e workflow coverage.

### Dev Logger

Folder: [`src/app/features/projects/dev-logger`](./src/app/features/projects/dev-logger)

Dev Logger is a migrated CRUD log manager from the old Angular component/service example. It includes validated log creation, edit and delete actions, severity levels, search, level filters, derived totals, and demo reset state.

Angular coverage: standalone component, template-driven form bindings, signals, computed filters and counts, lazy loading, illustrated cover, focused unit tests, and e2e workflow coverage.

### Recipe Book

Folder: [`src/app/features/projects/recipe-book`](./src/app/features/projects/recipe-book)

Recipe Book is a migrated Angular recipe workflow from the old list/detail/shopping-list example. It includes searchable recipe selection, recipe detail cards, reactive recipe creation, ingredient transfer to the shopping list, manual shopping item creation, item removal, and demo reset.

Angular coverage: standalone component, reactive forms, signals, computed recipe and shopping totals, lazy loading, illustrated cover, focused unit tests, and e2e workflow coverage.

### Flashcards

Folder: [`src/app/features/projects/flashcards`](./src/app/features/projects/flashcards)

Flashcards is a LocalStorage study deck mini project. It includes deck filters, reveal answer flow, known/study-again review actions, progress counters, card creation, edit and delete actions, shuffle, reset review, and demo reset.

Angular coverage: standalone component, template-driven forms, signals, computed deck and review state, LocalStorage persistence, lazy loading, illustrated cover, focused unit tests, and e2e workflow coverage.

### Timer

Folder: [`src/app/features/projects/timer`](./src/app/features/projects/timer)

Timer is a countdown productivity mini project. It includes preset durations, custom minutes and seconds, start, pause, resume, reset and restart actions, completion state, completed session count, and persisted selected duration.

Angular coverage: standalone component, template-driven forms, signals, computed progress and display time, interval cleanup with `DestroyRef`, LocalStorage persistence, lazy loading, illustrated cover, focused unit tests, and e2e workflow coverage.

### Digital Clock

Folder: [`src/app/features/projects/digital-clock`](./src/app/features/projects/digital-clock)

Digital Clock is a live time utility mini project. It includes a ticking digital display, full date output, 12-hour and 24-hour modes, timezone selection, UTC offset display, refresh action, and persisted settings.

### Tip Calculator

Folder: [`src/app/features/projects/tip-calculator`](./src/app/features/projects/tip-calculator)

Tip Calculator is a split-bill utility mini project. It includes bill amount validation, tip presets, a custom tip percentage, people count validation, tip totals, bill-per-person totals, and reset behavior.

### Memory Game

Folder: [`src/app/features/projects/memory-game`](./src/app/features/projects/memory-game)

Memory Game is a card matching mini project. It includes shuffled pairs, selectable letter/fruit/color/car/mixed card sets, easy/standard/hard difficulty, card flip and mismatch behavior, moves, elapsed time, matched pair count, reveal/new round controls, and completion feedback.

Angular coverage: standalone component, template-driven controls, signals, computed time/date/offset labels, interval cleanup with `DestroyRef`, `Intl.DateTimeFormat` timezone formatting, LocalStorage persistence, lazy loading, illustrated cover, focused unit tests, and e2e workflow coverage.

### Math 4 Kids

Folder: [`src/app/features/projects/math-4-kids`](./src/app/features/projects/math-4-kids)

Math 4 Kids is an arithmetic practice mini project. It includes addition, subtraction, multiplication, mixed mode, easy/standard/challenge difficulty, score, attempts, streak, accuracy, elapsed timer, instant feedback, skip, and restart behavior.

Angular coverage: standalone component, template-driven answer input, signal state, computed accuracy/time labels, interval cleanup with `DestroyRef`, lazy loading, illustrated cover, focused unit tests, and e2e workflow coverage.

### Music Player

Folder: [`src/app/features/projects/music-player`](./src/app/features/projects/music-player)

Music Player is a media-style playlist mini project. It includes a safe local playlist, current track selection, play/pause UI state, previous/next controls, search by title/artist/mood, LocalStorage favorites, and external YouTube links opened with safe link attributes.

Angular coverage: standalone component, template-driven search input, signal state, computed filtered/favorite/current track state, LocalStorage persistence, lazy loading, illustrated cover, focused unit tests, and e2e workflow coverage.

### Photo Book

Folder: [`src/app/features/projects/photo-book`](./src/app/features/projects/photo-book)

Photo Book is a visual gallery mini project. It includes optimized local Macedonia photo assets, grid and list views, search, category filtering, selected-photo detail, previous/next slider controls, start/stop autoplay, keyboard navigation, empty state, and responsive image panels.

Angular coverage: standalone component, template-driven search input, signal state, computed filtered/selected photo state, host keyboard listener, lazy loading, illustrated cover, focused unit tests, and e2e workflow coverage.

### Client Panel

Folder: [`src/app/features/projects/client-panel`](./src/app/features/projects/client-panel)

Client Panel is a migrated admin workflow mini project. It includes a client list, selected client detail, create/edit/delete workflows, validation, totals, LocalStorage persistence, reset demo action, and safe local demo data instead of Firebase credentials.

Angular coverage: standalone component, template-driven CRUD form, signal state, computed totals and filtered client state, lazy loading, illustrated cover, focused unit tests, and e2e workflow coverage.

### Chat App

Folder: [`src/app/features/projects/chat-app`](./src/app/features/projects/chat-app)

Chat App is a static-safe realtime-style demo. It includes demo rooms, unread counts, selected-room conversations, current-user message alignment, room search, send-message validation, connection state, reset demo action, and LocalStorage persistence.

Angular coverage: standalone component, template-driven message form, signal state, computed room/message filters, LocalStorage persistence, lazy loading, illustrated cover, focused unit tests, and e2e workflow coverage.

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
      chat-app/
      dev-logger/
      digital-clock/
      expense-tracker/
      flashcards/
      hang-man/
      javascript-quiz/
      memory-game/
      odd-even/
      recipe-book/
      timer/
      tip-calculator/
      tic-tac-toe/
      todo-list/
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
    CHAT_APP_ARCHITECTURE.md
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
