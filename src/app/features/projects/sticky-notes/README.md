# Sticky Notes

Standalone Angular mini project for creating, editing, pinning, deleting, coloring, searching, and persisting sticky notes.

## Scope

- LocalStorage-backed notes.
- Title/body validation and character limits.
- Color swatches and pinned sorting.
- Search by title and body.
- English and Macedonian labels through `ngx-translate`.

## Verification

Run the focused unit spec:

```bash
npm run test -- --watch=false --browsers=ChromeHeadless --include src/app/features/projects/sticky-notes/sticky-notes.component.spec.ts
```
