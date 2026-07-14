# Chat App Architecture

Chat App is the next backend-dependent candidate. The portfolio must stay deployable as a static Angular app, so the first implementation should be a safe local demo with a clear adapter boundary for a future realtime backend.

## Decision

- Build the first slice as a local, static-safe Angular demo.
- Persist demo rooms and messages in LocalStorage.
- Model connection state, users, rooms, messages, typing indicators, unread counts, and empty/error states without external credentials.
- Keep Firebase and Socket.io behind a future service adapter instead of wiring either one directly into the component.
- Do not add secrets, private endpoints, or real user data to the repository.

## Recommended First Slice

- Room list with selected room detail.
- Message timeline with current-user and other-user alignment.
- Send-message form with validation.
- Search or room filter.
- Demo online/offline connection toggle.
- Empty room and no-results states.
- Reset demo data action.
- LocalStorage persistence.
- English and Macedonian translations.
- Focused unit tests for filtering, sending, persistence reset, and validation.
- Playwright coverage for selecting a room, sending a message, searching, and mobile workspace fit.

## Future Backend Adapter

The later backend phase should choose one adapter only after the static demo is stable:

- Firebase: good for hosted realtime data and auth demos, but requires public config, security rules, and quota documentation.
- Socket.io: good for true realtime interaction, but requires a separate Node server and deployment target outside GitHub Pages.

Until that decision is made, the app should expose the same UI state through a local service so the backend can be swapped without rewriting the workspace.
