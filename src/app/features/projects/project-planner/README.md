# Project Planner

Project Planner is the first legacy JavaScript migration from `JAVASCRIPT/javaScriptTutorialApps/02 - Project Planner/events-14-finished`.

## Goal

Preserve the useful behavior from the old imperative DOM project board while rebuilding it as a standalone Angular component with typed state and theme-aware UI.

## Current Scope

- Active and finished project lanes.
- Move actions and drag-and-drop behavior between lanes.
- Project creation with required title validation.
- Lane empty states when no projects are available.
- Context panel for project details.
- Translation-ready labels.

## Migration Notes

- The original HTML and DOM event code are used as behavior reference only.
- Direct DOM manipulation is intentionally replaced with Angular signals and template state.
- Drag-and-drop is handled through typed lane state and guarded browser events.
- Form state and validation are signal-based to keep the migration compact.

## Future Work

- Add persistence only if the planner evolves from a migration demo into a real planning tool.
