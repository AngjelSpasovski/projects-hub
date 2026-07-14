# Client Panel

Client Panel is a migrated admin workflow mini project for the Projects Hub portfolio.

## Features

- Client list with search.
- Status filters for all, active, review, and overdue clients.
- Selected client detail panel.
- Create, edit, and delete workflows.
- Delete confirmation modal before removing a client.
- Form validation for name, email, phone, and balance.
- Summary totals for clients, active clients, total owed, and open balances.
- LocalStorage persistence with reset demo action.
- Empty states with clear filters, add client, and reset demo actions.
- Responsive stacked layout for tablet and mobile viewports.
- Safe demo data instead of Firebase credentials or private client records.

## Architecture

- Standalone Angular component with signal-based state.
- Template-driven form inputs for the CRUD form.
- Local demo data persisted through `localStorage`.
- All visible labels are translated through `en.json` and `mk.json`.

## Migration Notes

The legacy Client Panel used AngularFirestore for the `clients` collection. The portfolio migration keeps the user-facing CRUD behavior but replaces backend calls with local demo state so the static GitHub Pages build remains safe and deployable without secrets.
