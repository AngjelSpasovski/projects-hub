# Odd/Even Counter

Odd/Even Counter is a compact migration from `AllMyProjectsInONE/www_ClientPanelApp/oddEvenDatabinding`.

## Goal

Preserve the original Angular exercise behavior while rebuilding it as a modern standalone component with typed state, translated UI, and theme-aware layout.

## Current Scope

- Start, pause, step, and reset controls.
- Timed number generation with cleanup on component destroy.
- Derived odd and even lanes.
- Empty states and summary counters.
- Focused unit tests for state transitions and interval behavior.

## Migration Notes

- The old child-component event emitter pattern is replaced with local signal state.
- Direct interval cleanup is handled through `DestroyRef`.
- The example remains intentionally small because the legacy source was an Angular binding exercise.

## Future Work

- Add speed presets if this evolves into a timing or event-stream demo.
