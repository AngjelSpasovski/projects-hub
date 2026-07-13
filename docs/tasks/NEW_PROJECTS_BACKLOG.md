# New Project Backlog

Duplicate ideas are consolidated. `To-Do List` appears once, and `Find the Word` must be differentiated from Hang Man before implementation.

## Recommended Build Order

Use this order for a stable pace: small, well-scoped projects first; richer interaction projects after the utility baseline is consistent; large migrations only after the smaller backlog stays green.

1. [x] Tip Calculator: utility form with bill amount, percentage, people count, validation, split totals, reset, and polished empty/error states.
2. [x] Memory Game: interactive game with shuffled board, matched pairs, moves, timer, reset, difficulty, and completed-state summary.
3. [ ] Math 4 Kids: learning game with operation and difficulty selection, score, streak, timer, feedback, and restart.
4. [ ] Music Player: media-style UI with safe playlist handling, current item, search, favorites, and external YouTube link behavior.
5. [ ] Photo Book: visual gallery with grid/slider views, keyboard navigation, responsive images, and selected-photo detail.
6. [ ] Client Panel migration: larger workflow migration with list, detail, create, edit, delete, safe demo auth replacement, and full state handling.
7. [ ] Chat App: backend-dependent project after Firebase or Socket.io architecture is selected.

## Scope Before Build

- [ ] Find the Word: define behavior that is clearly different from Hang Man before implementation.
- [ ] Square Cards: build only if it demonstrates a reusable playground beyond the existing shared card UI.
- [ ] Recipe Book variant: do not create a second project unless its scope is meaningfully different from the migrated Recipe Book.

## Batch 1: Core Portfolio Apps

- [x] JavaScript Quiz: multiple-choice questions, timer, progress, score, review, and restart.
- [x] Convert JavaScript fundamentals, ES6, objects, prototypes, and Weird Parts material into a 26-question typed bank.
- [x] Randomize six questions and their answer positions on every quiz start.
- [x] To-Do List: add, edit, complete, delete, filter, and LocalStorage persistence.
- [x] Expense Tracker: income/expense entries, totals, categories, validation, persistence, and Chart.js summaries.
- [x] Technical Documentation: searchable documentation for Projects Hub architecture and contribution flow.

## Batch 2: API Projects

- [x] Upgrade Weather App with OpenWeather-ready state, search, filters, loading, retry, empty, stale, and error states.
- [x] Movie Search: API search, filters, pagination, details, loading, empty, and error states.
- [x] REST Countries: search, region filters, details, favorites, and theme integration.
- [x] Currency Converter: rates API, amount validation, swap currencies, loading, and stale-data handling.
- [x] Quotes API: quote loading, retry, favorites, and typewriter animation with reduced-motion support.

## Batch 3: LocalStorage And Productivity

- [x] Sticky Notes: create, edit, color, pin, delete, search, and LocalStorage persistence.
- [x] Grocery List: quantities, categories, purchased state, filtering, and persistence.
- [x] Flashcards: decks, cards, reveal, progress, shuffle, and LocalStorage persistence.
- [x] Timer: countdown, presets, pause/resume, reset, and completion notification.
- [x] Digital Clock: time, date, 12/24-hour mode, timezone selection, and persistence.

## Batch 4: Utilities And Games

- [x] Tip Calculator: bill, percentage, people count, validation, and split totals.
- [x] Memory Game: shuffled board, matched pairs, moves, timer, reset, and difficulty.
- [ ] Math 4 Kids: operation and difficulty selection, score, streak, timer, and feedback.
- [ ] Find the Word: scope before build.
- [ ] Square Cards: scope before build.

## Batch 5: Media And Rich UI

- [ ] Music Player: YouTube-link playlist, current item, search, favorites, and safe external embedding.
- [ ] Photo Book: gallery, slider, grid/list views, keyboard navigation, and responsive images.
- [ ] Recipe Book variant: scope before build.

## Batch 6: Backend-Dependent

- [ ] Chat App: select Firebase or Socket.io architecture before implementation.
- [ ] Add demo authentication, room list, messages, connection state, and safe environment configuration.
- [ ] Document backend setup, limits, security rules, and deployment requirements.

Backend-dependent projects stay last so the static Angular portfolio remains deployable without secrets.
