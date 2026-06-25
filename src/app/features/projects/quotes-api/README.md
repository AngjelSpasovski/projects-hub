# Quotes API

Standalone Angular mini project that simulates a quotes API workflow with loading, retry, favorites, LocalStorage persistence, and a typewriter text reveal.

## Scope

- Local quote data with API-style state handling.
- Random next quote selection without immediately repeating the current quote.
- Favorite quotes persisted in LocalStorage.
- Typewriter animation with reduced-motion fallback.
- English and Macedonian labels through `ngx-translate`.

## Verification

Run the focused unit spec:

```bash
npm run test -- --watch=false --browsers=ChromeHeadless --include src/app/features/projects/quotes-api/quotes-api.component.spec.ts
```
