# Chat App

Chat App is a static-safe realtime-style demo. The first slice intentionally uses local state and LocalStorage so the portfolio remains deployable on GitHub Pages without Firebase keys, Socket.io servers, credentials, or private data.

## Features

- Demo room list with unread counts and online/offline room status.
- Selected-room conversation timeline.
- Current-user and team message alignment.
- Send-message form with validation.
- Room search and empty state.
- Demo online/offline connection toggle.
- Reset demo data action.
- LocalStorage persistence.

## Architecture Notes

The component keeps Firebase and Socket.io out of the first implementation. A future backend can be introduced behind a service adapter after the static UX, state model, and tests are stable.

## Verification

- Unit coverage checks demo state loading, search, sending, validation, persistence, and reset.
- Playwright coverage checks room selection, message send, search, offline validation, visual stability across Realm, White, Dark, and Blue themes, and mobile fit.
