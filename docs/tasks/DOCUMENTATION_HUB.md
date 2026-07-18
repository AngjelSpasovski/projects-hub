# Documentation Hub Tasks

This checklist tracks the migration of Technical Documentation from the mini-project catalog into a first-class Projects Hub documentation area.

## Working Rules

- Check an item only after the implementation and its relevant verification pass.
- Keep this file aligned with `TASKS.md`, `README.md`, and `PROJECT_ANALYSIS_AND_ROADMAP.md`.
- Documentation is a platform feature and is not included in the mini-project count.
- Backend integration, DevExpress, and Monaco remain deferred until they solve a demonstrated need.

## Phase 1: Foundation And Migration

- [x] Add the top-level `/admin/documentation` route.
- [x] Add Documentation to the sidebar above All projects.
- [x] Remove Technical Documentation from the project registry and Beginner group.
- [x] Redirect `/admin/projects/technical-documentation` to `/admin/documentation`.
- [x] Update project totals from 29 to 28.
- [x] Move the component from `features/projects` to `features/documentation`.
- [x] Rename the user-facing feature from Technical Documentation to Documentation.
- [x] Preserve English and Macedonian navigation and page translations.

## Phase 2: Documentation Shell

- [x] Add searchable documentation navigation.
- [x] Add Overview, User Guide, Technical Guide, Projects, and Status Matrix sections.
- [x] Add active, empty-search, and clear-search states.
- [x] Keep the layout usable without horizontal overflow on desktop and mobile.
- [x] Keep all four application themes visually consistent.

## Phase 3: Content Architecture

- [x] Define a typed documentation data model for sections, guides, project pages, and code references.
- [x] Document the application purpose, current release scope, and navigation model.
- [x] Document the user workflows for the dashboard, catalog, themes, language, and mini projects.
- [x] Document routing, standalone components, signals, translations, shared UI, storage, and testing.
- [x] Add maintenance, contribution, release, and deferred-work guidance.

## Phase 4: Project Documentation

- [x] Define one reusable project-documentation template.
- [x] Document purpose, features, state/storage, tests, limitations, and future notes for all 28 mini projects.
- [x] Start with Chat App, Client Panel, Photo Book, Music Player, Math 4 Kids, Memory Game, and Tip Calculator.
- [x] Complete the remaining project pages in catalog order.
- [x] Verify that project names and statuses match the project registry.

## Phase 5: Status Matrix

- [x] Build a compact responsive status table without DevExpress.
- [x] Show project, category, difficulty, status, storage/API, tests, and notes.
- [x] Add search and filters for project, category, and status.
- [x] Use a desktop table and mobile stacked rows/cards.
- [x] Add clear Ready, Static demo, LocalStorage, API-style, and Deferred badges.

## Phase 6: Code Examples

- [x] Build a lightweight `<pre><code>` code-block component without Monaco.
- [x] Add filename, language badge, copy action, and wrapping controls.
- [x] Add optional line numbers only if they improve readability.
- [x] Verify code blocks in all themes and on mobile.

## Phase 7: Quality And Release Alignment

- [x] Add unit tests for search, selection, and empty state.
- [x] Add tests for status-matrix data and filters.
- [x] Add Playwright coverage for sidebar navigation and the legacy redirect.
- [x] Verify the catalog count is 28 and Technical Documentation is absent from Beginner.
- [x] Verify mobile layout without horizontal overflow.
- [x] Run production build, focused unit tests, and focused end-to-end tests.
- [x] Align `TASKS.md`, `README.md`, and `PROJECT_ANALYSIS_AND_ROADMAP.md`.

## Deferred Decisions

- [x] Defer DevExpress until the status matrix needs enterprise table behavior.
- [x] Defer Monaco until editable or advanced code exploration is required.
- [x] Defer backend-powered documentation until the static documentation model becomes limiting.

## Release Audit

- [x] Production build passes without warnings.
- [x] Full unit suite passes with 226 tests.
- [x] Full Playwright suite passes with 37 tests.
- [x] Root tasks, README, roadmap, and translated release guidance describe the same final state.
- [x] Documentation Hub release wording uses completed, present-tense behavior instead of planned-phase wording.

Release status: completed and verified on 2026-07-18. Future work is limited to targeted stabilization, UI refinements, and the explicitly deferred decisions above.

Post-release UI stabilization on 2026-07-18 compacted guidance and reference panels, added a controlled internal scroll for long technical content, and made all project groups start collapsed in the main sidebar.

## Completion Definition

The Documentation Hub is complete when it is a top-level bilingual application feature, all 28 projects are documented, the status matrix reflects registry data, desktop/mobile/theme checks pass, and the project documentation files agree on the final release state.
