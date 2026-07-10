# Project Tasks

This checklist tracks the path from the current skeleton to a portfolio-ready product.

Detailed active work is tracked in [`docs/tasks/`](./docs/tasks/README.md). A project is marked ready only after completing the shared [Definition of Done](./docs/tasks/DEFINITION_OF_DONE.md).

## Next Product Cycle

- [x] Complete the catalog cover redesign.
- [x] Merge project detail and live application into one workspace surface.
- [x] Remove duplicated project headers and nested surfaces.
- [x] Build the JavaScript Quiz from the reviewed question material.
- [x] Build the To-Do List with LocalStorage.
- [x] Build the Expense Tracker with Chart.js.
- [x] Add fixed Digital Clock and weather summary dashboard widgets.
- [x] Start legacy migrations with Project Planner, Odd/Even, and Dev Logger.
- [x] Add consolidated project analysis and roadmap documentation.
- [x] Add Flashcards as the first new LocalStorage productivity mini project.
- [x] Add Timer as a countdown productivity mini project.
- [x] Add Digital Clock as a live timezone utility mini project.

## Foundation

- [x] Create a clean Angular project.
- [x] Add Bootstrap, PrimeNG, PrimeIcons, and ngx-translate.
- [x] Create the admin shell with header, sidebar, main content, and footer.
- [x] Add theme switching for light, dark, and blue themes.
- [x] Add language switching for Macedonian and English.
- [x] Create the project catalog with big, list, and detailed list views.
- [x] Initialize Git for the repository.
- [x] Add dependency version documentation.
- [x] Add project task checklist.

## Design And Layout

- [x] Refine responsive behavior for mobile and tablet sidebar navigation.
- [x] Group the sidebar project navigation by difficulty with matching visual badges.
- [x] Add the first shared design-system pass for themes, buttons, inputs, and browser tab branding.
- [x] Normalize project action buttons so primary, secondary, and destructive actions have distinct visual weight.
- [x] Add theme QA coverage for Realm, White, Dark, and Blue without shell overflow.
- [x] Polish shared search controls with consistent icons, clear actions, focus states, and theme-aware styling.
- [x] Compact project detail workspaces with clearer back navigation, live layout modes, and repository links.
- [x] Add polished active, hover, loading, and empty states.
- [x] Decide final typography, spacing scale, and color tokens.
- [x] Replace temporary SVG covers with generated component covers. Superseded by the illustrated-cover redesign in the next product cycle.
- [x] Add PrimeNG modal/dialog pattern for project previews.

## Project Catalog

- [x] Add search by project name, technology, and category.
- [x] Add category filters.
- [x] Add tag filters using PrimeNG MultiSelect.
- [x] Add sort options for name, status, category, and last updated.
- [x] Add metadata fields for GitHub link, live demo link, difficulty, and date.
- [x] Persist selected catalog view mode in localStorage.

## Project Migration

- [x] Define a repeatable folder template for each mini project.
- [x] Migrate Tic Tac Toe.
- [x] Migrate Calculator.
- [x] Migrate Hang Man.
- [x] Migrate Weather App.
- [x] Migrate Music Event App.
- [x] Review older JavaScript projects and choose the next migration batch.
- [x] Add a README section per migrated project.

## Angular Quality

- [x] Add shared UI components for page headers, project cards, badges, and modals.
- [x] Add shared form validation helpers.
- [x] Add route-level lazy loading for project components when the catalog grows.
- [x] Add project detail routes with real project components.
- [x] Add error boundaries or fallback states for API-based projects.
- [x] Review bundle size and optimize Bootstrap/PrimeNG imports.

## Internationalization

- [x] Convert Macedonian translation to Cyrillic.
- [x] Move visible project catalog text into translation files.
- [x] Add translation keys for every new component as it is created.
- [x] Add a missing-translation review before release.

## Testing

- [x] Keep the root app unit test passing.
- [x] Add dashboard catalog unit tests.
- [x] Add theme service unit tests.
- [x] Add language service unit tests.
- [x] Add project registry validation tests.
- [x] Add basic end-to-end smoke test for navigation and view switching.

## Git And Release

- [x] Make the initial commit.
- [x] Create the remote GitHub repository.
- [x] Push the main branch.
- [ ] Add repository description and topics on GitHub.
- [x] Add a polished root README.
- [x] Add deployment workflow when hosting is chosen.
- [x] Add the final repository link to the portfolio.
