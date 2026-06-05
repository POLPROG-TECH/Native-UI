---
'@polprog/native-ui': minor
---

Add the `ActionTile` component, a decimal input parser, and a long-value fix for `StatTile`.

**New components**

- `ActionTile` - compact tappable tile with a tinted icon chip and a label below, built for quick-action grids on dashboards and home screens. Supports tones (`primary`/`success`/`warning`/`error`/`neutral`), a `disabled` state, `accessibilityLabel` override, debounced press handling and light haptics, matching the other interactive controls.

**New utilities**

- `parseDecimalInput` - parses a user-entered number accepting both comma and dot as the decimal separator (European keyboards), returning `NaN` for empty or non-numeric input so callers can validate.

**Fixes**

- `StatTile` now renders long values on a single shrink-to-fit line (`numberOfLines={1}`, `adjustsFontSizeToFit`, `minimumFontScale={0.7}`) instead of overflowing.

**Tests & Storybook**

- Added unit coverage for `ActionTile` and `parseDecimalInput`, a long-value test for `StatTile`, and an `ActionTile` Storybook page with a quick-actions grid.
