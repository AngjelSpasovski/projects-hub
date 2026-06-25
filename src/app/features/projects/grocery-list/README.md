# Grocery List

Standalone Angular mini project for grocery planning with quantities, categories, purchased state, filters, and LocalStorage persistence.

## Scope

- Add, edit, delete, and mark items as purchased.
- Filter by all, active, purchased, and category.
- Track total items, active items, purchased items, and total quantity.
- Persist the list in LocalStorage.
- English and Macedonian labels through `ngx-translate`.

## Verification

Run the focused unit spec:

```bash
npm run test -- --watch=false --browsers=ChromeHeadless --include src/app/features/projects/grocery-list/grocery-list.component.spec.ts
```
