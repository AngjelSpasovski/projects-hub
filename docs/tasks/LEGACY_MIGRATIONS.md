# Legacy Project Migrations

Migrate useful behavior from the old sources. Do not copy obsolete Angular modules, vendor templates, or duplicated application shells.

## Canonical Sources

- Client Panel: `../AllMyProjectsInONE/www_ClientPanelApp/clientPanel`
- Odd/Even: `../AllMyProjectsInONE/www_ClientPanelApp/oddEvenDatabinding`
- Recipe Book: `../AllMyProjectsInONE/www_ClientPanelApp/recipeBook`
- Dev Logger: `../AllMyProjectsInONE/theBigProject/src/app/components/myProjects/dev-logger`
- Project Planner: `../JAVASCRIPT/javaScriptTutorialApps/02 - Project Planner/events-14-finished`

The smaller Client Panel and Odd/Even copies inside `theBigProject` are duplicates and are not separate catalog projects.

## Batch 1

- [x] Start Batch 1 by registering Project Planner as the first migration workspace.
- [x] Add Project Planner lane movement with buttons and drag-and-drop interactions.
- [x] Add Project Planner project creation with validation and lane empty states.
- [x] Add Project Planner e2e coverage for creation, selection, movement, and workspace fit.
- [x] Migrate Project Planner with typed state and drag-and-drop behavior.
- [x] Migrate Odd/Even as a compact Angular interaction demo.
- [x] Migrate Dev Logger with validated log entry forms and filtering.

## Batch 2

- [ ] Migrate Recipe Book using standalone routes and reactive forms.
- [ ] Migrate Recipe List, Recipe Detail, and Shopping List workflows.
- [ ] Replace legacy services and mutable shared state with typed modern services/signals.

## Batch 3

- [ ] Migrate Client Panel list, detail, create, edit, and delete workflows.
- [ ] Replace obsolete authentication/guard code with a safe portfolio demo flow.
- [ ] Add loading, empty, validation, error, and confirmation states.
- [ ] Ensure the demo contains no real credentials or private client data.

Each checkbox represents a project-level implementation. The project is complete only when the shared [Definition of Done](./DEFINITION_OF_DONE.md) is also satisfied.
