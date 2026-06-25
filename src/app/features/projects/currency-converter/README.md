# Currency Converter

Standalone Angular project that models a rates API workflow with local data.

## Scope

- Convert between EUR, USD, GBP, MKD, CHF, and JPY.
- Validate the entered amount.
- Swap source and target currencies.
- Show direct and inverse exchange rates.
- Simulate refresh, stale rates, and API failure/retry states.

The component can later be connected to a real rates API by replacing the local `EUR_RATES` snapshot.
