# Design Tokens

The application uses CSS custom properties in `src/styles.scss` as the source of truth for visual decisions.

## Typography

- Font family: `Inter, Segoe UI, Roboto, Arial, sans-serif`
- Scale:
  - `--app-font-size-xs`: labels, metadata, badges
  - `--app-font-size-sm`: eyebrow text and secondary labels
  - `--app-font-size-md`: body text and controls
  - `--app-font-size-lg`: card titles and dialog titles
  - `--app-font-size-xl`: shell header title
  - `--app-font-size-2xl`: page titles

## Spacing

- Use `--app-space-1` through `--app-space-6` for layout and component spacing.
- Prefer the existing scale before adding one-off values.
- Keep dense admin UI spacing compact: panels usually use `--app-space-4` or `--app-space-5`.

## Shape And Controls

- Default radius: `--app-radius-md`
- Small option radius: `--app-radius-sm`
- Pills and badges: `--app-radius-pill`
- Standard control height: `--app-control-height`
- Compact button/control height: `--app-control-height-sm`

## Color

Each theme defines the same semantic variables:

- `--app-bg`
- `--app-surface`
- `--app-surface-muted`
- `--app-border`
- `--app-text`
- `--app-text-muted`
- `--app-accent`
- `--app-accent-strong`
- `--app-sidebar`
- `--app-sidebar-text`
- `--app-sidebar-muted`

New components should use semantic variables instead of fixed color values.

## Elevation And Focus

- Default panel elevation: `--app-shadow`
- Hover elevation: `--app-shadow-hover`
- Keyboard focus: `--app-focus-ring`

Focus rings should stay visible on all interactive elements.
