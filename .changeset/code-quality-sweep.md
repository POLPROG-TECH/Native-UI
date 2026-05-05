---
'@polprog/native-ui': patch
---

Code quality sweep: performance, accessibility, and DRY improvements across 10 components.

**Performance**
- `ListItem` - wrapped in `React.memo`
- `Chip` - `handlePress` stabilised with `useCallback`.
- `SettingsRow` / `SettingsSwitchRow` - merged `iconColorMap` memoised with `useMemo`.
- `Select` - `SelectRow.onPress` closure replaced with stable `value` + `onSelect` props, eliminating per-option re-renders.
- `Countdown` - `onExpire` moved to a ref to avoid unnecessary effect re-runs.

**Accessibility**
- `Modal` - replaced incorrect `accessibilityRole="alert"` with `accessibilityViewIsModal`.
- `BottomSheet` / `Select` sheet - replaced hardcoded `paddingBottom: 34` with `useSafeAreaInsets().bottom`.
- `Select` - replaced hardcoded `maxHeight: 320` with `40%` of window height for better scaling with large text sizes.

**DRY / Maintainability**
- Extracted shared `FieldLabel` and `FieldError` components; refactored `Input`, `TextArea`, and `Select` to use them.
