# Technical Documentation

Technical Documentation is a searchable guide for how Projects Hub is structured and how new mini projects should be added.

## Features

- Search across architecture, contribution flow, translation, and quality sections.
- Section navigation with compact cards and relevant code references.
- Fully translated English and Macedonian UI.
- Standalone Angular component with signal-based state.

## Architecture

- `technical-documentation.component.ts` stores typed documentation sections and search state.
- The component uses `LanguageService` and `TranslateService` so filtering follows the active language.
- No external API or storage is required.

## Future Work

- Link each code reference to repository files after public GitHub URLs are finalized.
- Add a richer contribution checklist when deployment and PR flow are decided.
