# New Project Backlog

Duplicate ideas are consolidated. `To-Do List` appears once, and `Find the Word` must be differentiated from Hang Man before implementation.

Current release status: the planned mini project list is complete. Remaining ideas are deferred because they risk duplicating existing projects or require a deliberately separate backend phase.

## Recommended Build Order

Use this order for a stable pace: small, well-scoped projects first; richer interaction projects after the utility baseline is consistent; large migrations only after the smaller backlog stays green.

1. [x] Tip Calculator: utility form with bill amount, percentage, people count, validation, split totals, reset, and polished empty/error states.
2. [x] Memory Game: interactive game with shuffled board, selectable card sets, matched pairs, moves, timer, reset, difficulty, and completed-state summary.
3. [x] Math 4 Kids: learning game with operation and difficulty selection, score, streak, timer, feedback, and restart.
4. [x] Music Player: media-style UI with safe playlist handling, current item, search, favorites, and external YouTube link behavior.
5. [x] Photo Book: visual gallery with grid/slider views, keyboard navigation, responsive images, and selected-photo detail.
6. [x] Client Panel migration: larger workflow migration with list, detail, create, edit, delete, safe demo auth replacement, and full state handling.
7. [x] Chat App: static-safe local demo first, with Firebase or Socket.io deferred behind a future adapter.

## Deferred Ideas

- [x] Find the Word: deferred for the current release because it is too close to Hang Man unless a clearly different mechanic is defined.
- [x] Square Cards: deferred for the current release because it must demonstrate more than the existing shared card UI.
- [x] Recipe Book variant: deferred for the current release because the migrated Recipe Book already covers the core workflow.

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
- [x] Memory Game: shuffled board, selectable card sets, matched pairs, moves, timer, reset, and difficulty.
- [x] Math 4 Kids: operation and difficulty selection, score, streak, timer, and feedback.
- [x] Find the Word: deferred unless a non-Hang-Man mechanic is defined.
- [x] Square Cards: deferred unless it becomes a distinct reusable playground.

## Batch 5: Media And Rich UI

- [x] Music Player: YouTube-link playlist, current item, search, favorites, and safe external embedding.
- [x] Photo Book: gallery, slider, grid/list views, keyboard navigation, and responsive images.
- [x] Recipe Book variant: deferred because it overlaps the migrated Recipe Book.

## Batch 6: Backend-Dependent

- [x] Chat App: select the first architecture slice.
- [x] Build static-safe LocalStorage demo with a future Firebase/Socket.io adapter boundary.
- [x] Add demo rooms, messages, connection state, and safe environment configuration.
- [x] Document backend setup, limits, security rules, and deployment requirements as deferred until Firebase or Socket.io is deliberately selected.

Backend-dependent projects stay last so the static Angular portfolio remains deployable without secrets.

See [Chat App architecture](./CHAT_APP_ARCHITECTURE.md) for the first implementation slice.
