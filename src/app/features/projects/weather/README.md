# Weather App

## Goal

Create an API-style weather dashboard that demonstrates loading, search, filtering, forecast summaries, empty, stale, and error states without requiring an external API key.

## Features

- Simulated weather data fetch
- Loading skeletons
- City search
- Condition filter
- Average temperature summary
- Average humidity and warmest-city summaries
- Featured city panel with feels-like temperature
- Four-step local forecast preview
- Pressure and visibility details
- Last updated timestamp
- Manual test error state
- Retry action

## Angular Concepts

- Standalone component
- Signals and computed state
- Template-driven form control
- Conditional rendering for async-like states
- Unit tests with fake timers
- OpenWeather-ready state shape

## Known Limitations

- Data is mocked locally until a public weather API and API-key strategy are chosen.
- Forecast data is local demo data, not live OpenWeather data.
