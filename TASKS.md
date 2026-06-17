# Project Tasks

This checklist tracks the path from the current skeleton to a portfolio-ready product.

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

- [ ] Refine responsive behavior for mobile and tablet sidebar navigation.
- [ ] Add polished active, hover, loading, and empty states.
- [ ] Decide final typography, spacing scale, and color tokens.
- [ ] Replace temporary SVG covers with final project screenshots or generated covers.
- [ ] Add PrimeNG modal/dialog pattern for project previews.

## Project Catalog

- [ ] Add search by project name, technology, and category.
- [ ] Add category filters.
- [ ] Add tag filters using PrimeNG MultiSelect.
- [ ] Add sort options for name, status, category, and last updated.
- [ ] Add metadata fields for GitHub link, live demo link, difficulty, and date.
- [ ] Persist selected catalog view mode in localStorage.

## Project Migration

- [ ] Define a repeatable folder template for each mini project.
- [ ] Migrate Tic Tac Toe.
- [ ] Migrate Calculator.
- [ ] Migrate Hang Man.
- [ ] Migrate Weather App.
- [ ] Migrate Music Event App.
- [ ] Review older JavaScript projects and choose the next migration batch.
- [ ] Add a README section per migrated project.

## Angular Quality

- [ ] Add shared UI components for page headers, project cards, badges, and modals.
- [ ] Add shared form validation helpers.
- [ ] Add route-level lazy loading for project components when the catalog grows.
- [ ] Add project detail routes with real project components.
- [ ] Add error boundaries or fallback states for API-based projects.
- [ ] Review bundle size and optimize Bootstrap/PrimeNG imports.

## Internationalization

- [x] Convert Macedonian translation to Cyrillic.
- [x] Move visible project catalog text into translation files.
- [ ] Add translation keys for every new component as it is created.
- [ ] Add a missing-translation review before release.

## Testing

- [x] Keep the root app unit test passing.
- [ ] Add dashboard catalog unit tests.
- [ ] Add theme service unit tests.
- [ ] Add language service unit tests.
- [ ] Add project registry validation tests.
- [ ] Add basic end-to-end smoke test for navigation and view switching.

## Git And Release

- [ ] Make the initial commit.
- [ ] Create the remote GitHub repository.
- [ ] Push the main branch.
- [ ] Add repository description and topics on GitHub.
- [ ] Add a polished root README.
- [ ] Add deployment workflow when hosting is chosen.
- [ ] Add the final repository link to the portfolio.
