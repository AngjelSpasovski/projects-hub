# UI Refinements

Complete this batch before adding a large number of new projects.

## Catalog Covers

- [x] Replace component screenshots with distinctive illustrated covers for Calculator, Hang Man, Tic Tac Toe, Weather, and Music Event.
- [x] Define one cover aspect ratio, safe area, and export size.
- [x] Keep project names and important symbols readable in light, dark, and blue themes.
- [x] Update the cover-generation workflow so it does not overwrite illustrated covers.
- [x] Verify big, list, and detailed catalog modes on desktop and mobile.
- [x] Standardize catalog summary height and add a scrollable `Show more` dialog for longer text.

## Project Workspace

- [x] Merge `project-detail surface-panel` and `project-live` into one `project-workspace surface-panel`.
- [x] Add a clear divider between project metadata and the interactive application.
- [x] Remove duplicated title, description, and feature copy from mini-project components.
- [x] Remove nested `surface-panel` styling from mini-project root elements.
- [x] Keep repository/demo actions, tags, status, difficulty, and dates in the workspace header.
- [x] Make data-heavy project components fill the live workspace and scroll only their internal lists.
- [x] Add a compact responsive layout for mobile project routes.
- [x] Update project-detail unit tests.
- [x] Update Playwright navigation and visual layout checks.

## Current Polish Pass

- [x] Add shared `btn-secondary` styling and tighten disabled button states.
- [x] Improve PrimeNG dropdown selected states and MultiSelect chip styling across themes.
- [x] Clarify project detail actions: local live workspace focus stays in-app, external demos render only when a project has `demoUrl`, and repository links remain separate.
- [x] Apply the same external demo rule in the project preview dialog.
- [x] Add missing shared radius token used by dialog styling.
- [x] Normalize Flashcards, Timer, and Digital Clock layouts for shared spacing, stat cards, mobile overflow, and desktop fit.

## Existing Project Review

- [x] Check Calculator keyboard symbols and encoding.
- [x] Check Tic Tac Toe board sizing and winning-state contrast in all themes.
- [x] Add Tic Tac Toe score reset separation and confirmation/result modals.
- [x] Check Hang Man physical and on-screen keyboard behavior.
- [x] Keep Weather as a simulated API-state demo until the OpenWeather upgrade in the API backlog.
- [x] Check Music Event modal, tag filters, and mobile overflow.
- [x] Fix Recipe Book sidebar grid so filtered results remain clickable and the recipe form scrolls without overlapping the list.
- [x] Add e2e smoke coverage for Calculator, Weather, Music Event, Hang Man, and Tic Tac Toe refinement flows.
