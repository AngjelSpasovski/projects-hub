# Mini Project Template

Use this checklist whenever a new mini project is added to Projects Hub.

## Folder Structure

Each project should live under `src/app/features/projects/<project-id>/`.

Recommended structure:

```text
src/app/features/projects/<project-id>/
  <project-id>.component.ts
  <project-id>.component.html
  <project-id>.component.scss
  <project-id>.component.spec.ts
  README.md
```

Use kebab-case for folder and file names:

```text
tic-tac-toe
calculator
hang-man
weather
music-event
```

## Component Rules

- Build each mini project as a standalone Angular component.
- Keep project state inside the project folder unless it is shared by multiple projects.
- Use Reactive Forms for non-trivial forms and validation.
- Use Bootstrap utilities for layout and spacing.
- Use PrimeNG only for richer UI controls such as dialogs, multiselects, dropdowns, tables, and toasts.
- Keep all visible text in `src/assets/i18n/en.json` and `src/assets/i18n/mk.json`.
- Keep styles scoped in the component SCSS unless the styling is shared across multiple projects.

Example component shell:

```ts
import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-project-id',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './project-id.component.html',
  styleUrl: './project-id.component.scss'
})
export class ProjectIdComponent {}
```

## Registry Entry

Add the project to `src/app/features/projects/project-registry.ts`.

```ts
{
  id: 'project-id',
  titleKey: 'PROJECTS.PROJECT_ID.TITLE',
  summaryKey: 'PROJECTS.PROJECT_ID.SUMMARY',
  categoryKey: 'CATEGORIES.UTILITIES',
  tags: ['Angular', 'TypeScript'],
  status: 'migration',
  image: 'assets/project-covers/project-id.svg',
  route: '/admin/projects/project-id',
  updatedAt: '2026-06-17',
  createdAt: '2026-06-17',
  difficulty: 'beginner',
  repositoryUrl: null,
  demoUrl: null
}
```

Allowed values:

- `status`: `planned`, `migration`, `ready`
- `difficulty`: `beginner`, `intermediate`, `advanced`

## Translation Keys

Add matching keys in both language files:

```json
{
  "PROJECTS": {
    "PROJECT_ID": {
      "TITLE": "Project name",
      "SUMMARY": "Short project summary."
    }
  }
}
```

Macedonian translations must use Cyrillic.

## Routing

Until route-level lazy loading is added, the generic project detail page uses `project-registry.ts`.

When a project is migrated to a real component, add a child route for it and render the standalone component from:

```text
/admin/projects/<project-id>
```

## Cover Asset

Add a cover image in:

```text
src/assets/project-covers/<project-id>.svg
```

Temporary SVG covers are acceptable during migration. Replace them with project screenshots before final portfolio release.

## Project README

Each migrated project should include a small `README.md` with:

- Project goal
- Features
- Angular concepts used
- Validation rules, if any
- Known limitations
- Future improvements

## Verification

Run these commands after adding or changing a project:

```bash
npm run build
npm run test -- --watch=false
```

Before pushing, manually check:

- English and Macedonian language views
- Light, dark, and blue themes
- Big, list, and detailed catalog modes
- Mobile-width layout
- Project detail route
