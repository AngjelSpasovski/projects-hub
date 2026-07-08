# Dev Logger

Dev Logger is a migration from `AllMyProjectsInONE/theBigProject/src/app/components/myProjects/dev-logger`.

The legacy version split the project into a parent component, log form, log list, and shared service. The migrated version keeps the behavior in a standalone Angular workspace and replaces the service coupling with typed signal state.

## Features

- Add log entries with required text validation.
- Edit and delete existing log entries.
- Filter logs by level and search text.
- Derived totals for info, warning, and error logs.
- Translated empty, action, form, and filter labels.

## Angular Coverage

- Standalone component
- Template-driven form bindings
- Signals and computed state
- Focused unit tests for CRUD, validation, and filtering
