# Projects Feature

This folder contains the portfolio mini projects and the registry that powers the dashboard catalog.

## Current Structure

```text
projects/
  calculator/
  hang-man/
  javascript-quiz/
  music-event/
  project-detail/
  project-registry.ts
  tic-tac-toe/
  weather/
```

The dashboard and sidebar read from `project-registry.ts`. Keep registry metadata accurate because it drives:

- Catalog cards
- Sidebar project links
- Search, filter, and sort behavior
- Project detail metadata

## Adding A Project

Follow the full checklist in `docs/MINI_PROJECT_TEMPLATE.md`.

Minimum required work:

1. Add a folder under `src/app/features/projects/<project-id>/`.
2. Add the standalone component files.
3. Add an illustrated PNG cover under `src/assets/project-covers/`.
4. Add registry metadata in `project-registry.ts`.
5. Add English and Macedonian translation keys.
6. Run `npm run covers` to capture the live component under `src/assets/project-screenshots/` for documentation.
7. Run build and tests.
