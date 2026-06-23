# Project Definition of Done

A mini project can be marked `ready` only when every applicable item is complete.

## Product

- [ ] Primary workflow is complete and usable without developer tools.
- [ ] Loading, empty, error, validation, and disabled states are implemented where applicable.
- [ ] Keyboard interaction and focus order are usable.
- [ ] Reduced-motion behavior is respected for significant animations.

## Angular

- [ ] Project uses a standalone component and typed models.
- [ ] State and business logic are testable and do not depend on direct DOM manipulation.
- [ ] Shared UI and validation helpers are reused where appropriate.
- [ ] External APIs and storage access are isolated behind a service when complexity requires it.

## Integration

- [ ] Registry order, metadata, route, status, difficulty, dates, tags, and links are correct.
- [ ] Illustrated cover is added without overwriting another project asset.
- [ ] Sidebar and catalog navigation reach the project.
- [ ] Project workspace contains no duplicated header or nested surface panel.

## Internationalization

- [ ] All visible text uses translation keys.
- [ ] English and Macedonian keys match.
- [ ] Macedonian text is complete and written in Cyrillic.
- [ ] Longer Macedonian labels fit at supported breakpoints.

## Testing And Quality

- [ ] Focused unit tests cover important behavior and edge cases.
- [ ] The primary workflow has an E2E test when it adds a new interaction pattern.
- [ ] `npm run build` passes.
- [ ] `npm run test -- --watch=false --browsers=ChromeHeadless` passes.
- [ ] `npm run test:e2e -- --workers=1` passes.
- [ ] Light, dark, and blue themes are manually checked.
- [ ] Desktop and mobile layouts are manually checked.

## Documentation

- [ ] Project folder contains a README with goal, features, architecture, limitations, and future work.
- [ ] Root README project table and migrated-project section are updated.
- [ ] Relevant task checkboxes are updated.
- [ ] `DEPENDENCIES.md` is updated when libraries change.
