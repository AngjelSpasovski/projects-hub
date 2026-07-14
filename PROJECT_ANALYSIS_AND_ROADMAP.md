# Projects Hub - Analysis And Roadmap

Last reviewed: 2026-07-14

## 1. Purpose

`Projects Hub` is an Angular portfolio application that collects small JavaScript, Angular, and TypeScript projects into one maintainable workspace.

The goal is to use one public portfolio link where companies can inspect real code quality, frontend architecture, UI decisions, internationalization, testing practice, and migrations from older mini projects.

The application intentionally opens directly into an admin-style dashboard instead of a landing page. The first screen is the usable product: sidebar navigation, project catalog, filters, project detail pages, and live mini project workspaces.

## 2. Current Product State

The project is in a stable portfolio-ready phase.

- The Angular app builds successfully.
- Unit tests pass.
- Playwright end-to-end smoke tests pass.
- The repository has a clean project structure.
- The catalog currently contains 27 ready mini projects.
- Shared layout, themes, translations, metadata, covers, routing, tests, and docs are in place.

Latest local verification from the stabilization pass:

- `npm run build` passed.
- `npm run test -- --watch=false --browsers=ChromeHeadless` passed with `199 SUCCESS`.
- `npm run test:e2e -- --workers=1` passed with `33 passed`.
- Tip Calculator, Memory Game, Math 4 Kids, Music Player, and Photo Book were added from the recommended backlog order.
- Photo Book was polished with optimized local Macedonia photo assets, People category coverage, and start/stop autoplay controls.
- Client Panel was migrated as a safe local demo workflow with list, detail, create, edit, delete, validation, totals, and LocalStorage persistence.
- Chat App architecture was scoped as a static-safe local demo first, with Firebase or Socket.io deferred behind a future adapter.

## 3. Core Architecture

The app uses a shared shell and isolated mini project components.

Core flow:

1. `/` redirects to `/admin/dashboard`.
2. `/admin/dashboard` renders the project catalog.
3. `/admin/projects/:projectId` renders the shared project detail workspace.
4. `project-detail.component.ts` lazy-loads the matching standalone mini project component.
5. `project-registry.ts` is the central metadata source for catalog order, title keys, categories, tags, status, difficulty, cover image, routes, dates, and repository links.

Important architecture files:

- `src/app/app.routes.ts`
- `src/app/app.config.ts`
- `src/app/features/projects/project-registry.ts`
- `src/app/features/projects/project-detail/project-detail.component.ts`
- `src/app/layout/admin-shell/admin-shell.component.*`
- `src/app/layout/admin-shell/sidebar/sidebar.component.*`
- `src/assets/i18n/en.json`
- `src/assets/i18n/mk.json`
- `src/styles.scss`

## 4. Technologies Used

Runtime and UI:

- Angular 21
- TypeScript
- Angular standalone components
- Angular Router
- Angular Signals and computed state
- RxJS
- SCSS
- Bootstrap 5
- PrimeNG
- PrimeIcons
- ngx-translate
- Chart.js
- LocalStorage

Testing and tooling:

- Angular CLI
- Karma
- Jasmine
- Playwright
- TypeScript compiler
- GitHub Pages build support through `build:pages`

Documentation:

- `README.md`
- `TASKS.md`
- `DEPENDENCIES.md`
- `docs/tasks/*`
- Mini project `README.md` files

## 5. Implemented Platform Features

Foundation:

- Clean Angular workspace.
- Admin shell with header, sidebar, main content area, and footer.
- Fixed shell chrome with scrollable catalog/workspace areas.
- Responsive mobile sidebar behavior.
- Central project registry.
- Lazy-loaded dashboard and project detail views.
- Lazy-loaded mini project components.

Catalog:

- Big, list, and detailed card views.
- Search by project name, summary, category, difficulty, and tags.
- Category filtering.
- PrimeNG tag multiselect filtering.
- Sorting by stable order, title, category, difficulty, and last updated date.
- Reset filters flow.
- Persisted catalog view mode.
- Standardized card summaries.
- `Show more` dialog for long summaries.

Themes and design:

- Realm theme.
- White/light theme.
- Dark theme.
- Blue theme.
- Theme persistence in LocalStorage.
- Shared project card, badge, page header, async panel, and preview dialog components.
- Standardized modal backdrop blur.
- Illustrated project covers.
- Separate project screenshots for documentation/future gallery use.

Internationalization:

- English and Macedonian language support.
- Macedonian content uses Cyrillic.
- `ngx-translate` configured with JSON translation files.
- Language persistence in LocalStorage.
- Language change guards for projects where switching language would interrupt active state.

Testing:

- Unit coverage for app shell, dashboard behavior, registry metadata, shared services, validation helpers, and mini project behavior.
- Playwright smoke coverage for catalog navigation, view switching, language switching, theme switching, responsive layout, workspace fit, and primary workflows.

## 6. Ready Mini Projects

The catalog currently contains these ready projects:

1. `Tic Tac Toe`
   - Local two-player game.
   - Signal-based board state.
   - Winner and draw detection.
   - Score tracking.
   - Reset and result dialogs.

2. `Calculator`
   - Basic arithmetic.
   - Decimal input.
   - Percentage conversion.
   - Sign toggle.
   - Square and square root behavior.
   - Keyboard support.
   - Invalid-operation handling.

3. `Hang Man`
   - Word guessing game.
   - English and Macedonian word banks.
   - On-screen and physical keyboard support.
   - Win/loss state.
   - Language-change confirmation during active rounds.

4. `Weather App`
   - API-style weather dashboard.
   - Simulated loading, error, retry, stale, and empty states.
   - Condition filters.
   - Local weather data without external API secrets.

5. `Music Event App`
   - Event catalog.
   - Category and tag filtering.
   - PrimeNG dialog details.
   - Seat and result summaries.

6. `JavaScript Quiz`
   - Randomized six-question rounds.
   - Typed 26-question bank.
   - Timer.
   - Score and answer review.
   - Translated explanations.

7. `To-Do List`
   - Task creation, editing, completion, deletion.
   - Priority labels.
   - Filters.
   - Validation.
   - LocalStorage persistence.

8. `Expense Tracker`
   - Income and expense entries.
   - Totals and balance.
   - Filters.
   - Validation.
   - LocalStorage persistence.
   - Chart.js doughnut summary.

9. `Technical Documentation`
   - Searchable in-app documentation.
   - Architecture, contribution, i18n, and quality guidance.

10. `Movie Search`
    - Search and pagination.
    - Selected movie details.
    - Loading, empty, error, and retry states.

11. `REST Countries`
    - Search and region filtering.
    - Country detail display.
    - Favorites.
    - LocalStorage persistence.

12. `Currency Converter`
    - Amount validation.
    - Currency selection and swap.
    - Stale-data state.
    - Error and retry states.

13. `Quotes API`
    - Quote loading.
    - Next quote flow.
    - Favorites.
    - Retry state.
    - Reduced-motion-aware typewriter behavior.

14. `Sticky Notes`
    - Create, edit, delete, search, pin, and color notes.
    - LocalStorage persistence.

15. `Grocery List`
    - Quantities.
    - Categories.
    - Purchased state.
    - Filtering.
    - LocalStorage persistence.

16. `Project Planner`
    - Migrated from a legacy JavaScript project board.
    - Active and finished lanes.
    - Project creation with validation.
    - Button and drag-and-drop movement.
    - Contextual project details.

17. `Odd/Even Counter`
    - Migrated compact Angular interaction demo.
    - Timed and manual number generation.
    - Computed odd/even lanes.
    - Pause and reset controls.

18. `Dev Logger`
    - Migrated CRUD logger.
    - Severity levels.
    - Search and filters.
    - Validated log creation and editing.
    - Signal-based state.

19. `Recipe Book`
    - Migrated recipe and shopping-list workflow.
    - Recipe search and selection.
    - Reactive recipe creation form.
    - Ingredient transfer to shopping list.
    - Manual shopping item creation and deletion.

20. `Flashcards`
    - Study deck filters.
    - Reveal answer flow.
    - Known/study-again review tracking.
    - Card creation, editing, deletion, shuffle, and reset actions.
    - LocalStorage persistence.

21. `Timer`
    - Countdown presets.
    - Custom minutes and seconds.
    - Start, pause, resume, reset, and restart controls.
    - Completion state and completed-session count.
    - LocalStorage persistence for selected duration.

22. `Digital Clock`
    - Live ticking time display.
    - Full date display.
    - 12-hour and 24-hour modes.
    - Timezone selection and UTC offset display.
    - LocalStorage persistence for selected settings.

## 7. Important Resolved Problems

Layout and scrolling:

- Header, sidebar, and footer were stabilized.
- Main dashboard/catalog area became the controlled scroll region.
- Project workspaces were adjusted to avoid broken nested surfaces.
- Data-heavy mini projects now fit better inside the available live workspace.
- Wide project live containers use full height and width constraints.

Project detail:

- Duplicated project headers were removed.
- Project metadata, cover, action links, and live app were consolidated into one workspace.
- Mini project components are loaded dynamically from the shared detail route.

Catalog UI:

- Big, list, and detailed views were normalized.
- Long summaries no longer break card rhythm.
- `Show more` dialog handles long descriptions.
- Category/status/title layout was cleaned up.
- PrimeNG overlays were adjusted so dropdowns appear above cards.

Sidebar:

- Project navigation is grouped by difficulty.
- Active item behavior and sidebar scrolling were improved.
- Mobile sidebar opens and closes correctly after navigation.

Themes:

- Realm became the custom/default theme direction.
- White, dark, and blue themes remain available.
- Theme behavior is covered by e2e layout checks.

Mini projects:

- Tic Tac Toe gained score tracking, result dialogs, reset score flow, and match winner behavior.
- Hang Man gained language-aware word banks and restart confirmations.
- Calculator gained richer operations and keyboard support.
- Weather became a deliberate API-state demo without requiring secrets.
- Dev Logger was brought closer to shared project theme styling.

## 8. Known Gaps And Risks

Documentation consistency:

- `TASKS.md`, `README.md`, and `docs/tasks/DASHBOARD_WIDGETS.md` now distinguish current fixed dashboard widgets from future configurable widget enhancements.
- Continue updating the roadmap documents in the same change set whenever a new project or major polish cycle is completed.

Dependency documentation:

- `DEPENDENCIES.md` says it was last updated on 2026-06-24.
- Newer work happened after that date, so the file should be reviewed when dependencies change.

Repo and demo links:

- Repository links point to project source paths.
- `demoUrl` values are currently `null`.
- The UI should either expose useful route-based live demo links or hide demo actions when no external demo exists.

Design polish:

- A first shared polish pass is complete for button variants, disabled states, dropdown selected states, MultiSelect chips, and project repo/demo actions.
- Realm is accepted as the custom visual direction, but it still needs visual QA across all components after each larger feature addition.

Encoding:

- The handoff text from the previous chat arrived with mojibake in the pasted attachment.
- The content was still understandable, but future handoffs should be copied as UTF-8 plain text where possible.

## 9. Current Roadmap

### Priority 1: Documentation Alignment

- Keep `TASKS.md`, `README.md`, `PROJECT_ANALYSIS_AND_ROADMAP.md`, and `docs/tasks/*` aligned as work progresses.
- Update the relevant task document in the same change set as each new mini project, migration, or polish cycle.
- Treat the current dashboard clock and weather summary as fixed widgets; track configurable widget behavior separately as future enhancement work.

### Priority 2: UI Polish Cycle

- Continue visual QA for Realm, white, dark, and blue themes after each larger feature addition.
- Continue component-level polish when a mini project still looks inconsistent with the shared shell.
- Verify all themes across catalog and every mini project.
- Review logo/favicon usage.
- Keep repo/demo actions consistent: local live workspaces stay in-app, external demo links render only when `demoUrl` exists, and repository links stay separate.

### Priority 3: Next Small Mini Project

The low-risk LocalStorage/productivity batch is complete through `Digital Clock`.

Continue with a stable smaller-project sequence before the next large migration:

1. `Tip Calculator` - complete.
2. `Memory Game` - complete.
3. `Math 4 Kids`.
4. `Music Player`.
5. `Photo Book`.

Each project should be implemented as a complete portfolio entry: polished UI, validation, empty/error states where relevant, translations, cover, registry entry, README update, unit coverage where useful, Playwright workflow coverage, and full verification.

### Priority 4: Next Backend-Dependent Project

The next larger candidate is `Chat App`, but the first implementation should remain static-safe so the portfolio continues to deploy on GitHub Pages without secrets or a server.

Expected first slice:

- Local demo rooms and messages.
- Selected room detail.
- Message timeline.
- Send-message form with validation.
- Search or room filter.
- Demo connection state.
- Empty and no-results states.
- Reset demo data action.
- LocalStorage persistence.
- Future backend adapter boundary for Firebase or Socket.io.
- Unit tests and at least one Playwright primary workflow.

See `docs/tasks/CHAT_APP_ARCHITECTURE.md` for the implementation decision.

### Priority 5: Larger Backlog

Future mini project candidates:

- `Chat App`, as a static-safe local demo first.
- `Find the Word`, only if it is clearly different from Hang Man.
- `Square Cards`, only if it demonstrates more than the existing shared cards.
- `Recipe Book variant`, only if it is meaningfully different from the migrated Recipe Book.

Backend-dependent work should remain last so the static portfolio stays deployable without secrets.

## 10. New Project Checklist

When adding any new mini project:

1. Create `src/app/features/projects/<project-id>/`.
2. Build a standalone component.
3. Add a registry entry in `project-registry.ts`.
4. Add a lazy loader in `project-detail.component.ts`.
5. Add English and Macedonian translation keys.
6. Add an illustrated cover in `src/assets/project-covers/`.
7. Add a project README.
8. Add focused unit tests.
9. Add Playwright coverage for new workflow patterns.
10. Update `README.md`.
11. Update `TASKS.md` and relevant `docs/tasks/*` files.
12. Run `npm run build`.
13. Run `npm run test -- --watch=false --browsers=ChromeHeadless`.
14. Run `npm run test:e2e -- --workers=1`.

## 11. Practical Recommendation

The documentation alignment, first UI polish pass, smaller-project sequence, Photo Book cycle, and Client Panel migration are complete.

Continue with the next controlled backend-dependent candidate:

1. Build `Chat App` as a static-safe LocalStorage demo.
2. Keep Firebase or Socket.io behind a future adapter decision.
3. Add backend setup, limits, security rules, and deployment notes only when a real backend is selected.
