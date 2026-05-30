---
'@polprog/native-ui': minor
---

Code-quality audit fixes across the component library.

**Accessibility**

- `Input` / `TextArea` now append their error message to the accessible label and `TextArea` exposes a `disabled` accessibility state.
- `Switch` makes the entire label/subtitle row tappable and exposes the subtitle in the accessible name; the inner native switch is hidden from assistive tech when wrapped.
- `Modal` and `BottomSheet` backdrops are now exposed as a dismiss button (or hidden when non-dismissable), and decorative handles/glyphs in `BottomSheet`, `Select`, `ListItem` and `Checkbox` are hidden from screen readers.

**API**

- `Input` and `TextArea` now forward refs to the underlying `TextInput`.
- `Radio` accepts a `style` prop and triggers light haptics on press, matching `Checkbox`/`Switch`.
- `Box` now extends `ViewProps`, fixing the previously mistyped `accessibilityRole` and untyped passthrough props.
- The `selectedValue` / `onValueChange` aliases on `Select` are marked `@deprecated`.

**Performance**

- `Button`, `IconButton`, `Switch`, `Checkbox` and `Radio` are wrapped in `React.memo`, with memoized styles and a shared `useDebouncedPress` hook for press handling.
- `Select` uses `useWindowDimensions` and memoized callbacks instead of inline closures.

**Types**

- `elevation` tokens are now strongly typed via the exported `Elevation` type, removing `as ViewStyle` casts throughout the library.

A new public `useDebouncedPress` hook is exported for consumers.

**Docs**

- The Storybook dashboard now documents PhotoToPuzzle, the first production app built on Native-UI, with a production-usage card linking to https://polprog.pl/apps/PhotoToPuzzle/.
