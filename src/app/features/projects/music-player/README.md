# Music Player

Music Player is a media-style playlist UI for the Projects Hub portfolio.

## Features

- Safe local playlist with current track selection.
- Search by title, artist, or mood.
- Play, pause, previous, and next UI state.
- Favorite tracks with LocalStorage persistence.
- External YouTube search links opened with `noopener noreferrer`.

## Architecture

- Standalone Angular component with signal-based state.
- No audio streaming, API keys, or embedded third-party player.
- All visible labels are translated through `en.json` and `mk.json`.

## Future Work

- Add playlist grouping by mood.
- Add keyboard shortcuts for previous, next, and play/pause.
- Replace demo search links with curated public playlist URLs if needed.
