# Task Roadmap

This folder contains the active product roadmap for Projects Hub. The root [`TASKS.md`](../../TASKS.md) remains the master checklist; detailed work is tracked here.

## Work Order

1. [UI refinements](./UI_REFINEMENTS.md)
2. [Legacy project migrations](./LEGACY_MIGRATIONS.md)
3. [New project backlog](./NEW_PROJECTS_BACKLOG.md)
4. [Dashboard widgets](./DASHBOARD_WIDGETS.md)
5. [Chat App architecture](./CHAT_APP_ARCHITECTURE.md)

Every project must satisfy the [Definition of Done](./DEFINITION_OF_DONE.md) before its registry status changes to `ready`.

## Status Rules

- `[ ]`: not started.
- `[x]`: implemented and verified.
- `planned`: visible in the catalog only when a placeholder is intentionally useful.
- `migration`: implementation is active but does not yet satisfy the Definition of Done.
- `ready`: feature, translations, tests, documentation, and responsive checks are complete.

## Working Method

1. Select one batch and keep unrelated projects out of the change.
2. Mark the project as `migration` when implementation starts.
3. Complete and check each project-specific task.
4. Run the required verification commands.
5. Update the project README, root README, registry dates, and task files.
6. Change the registry status to `ready` only after all checks pass.
