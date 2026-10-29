---
'@polprog/native-ui': major
---

Accessibility, configuration and robustness release. Breaking: see the "Upgrading to 2.0" guide in Storybook for every change that needs code edits.

- Removed (deprecated since 1.x): `useThemeColors` (use `useColors`), Button `variant="destructive"` (use `danger`), typography `amount` / `amountLarge` / `amountSmall` (use `mono*`), Card `longPressHint` (use `accessibilityHint`), Select `selectedValue` / `onValueChange` (use `value` / `onChange`), unused Select tokens (`titlePadding*`, `cancelPaddingVertical`, `cancelMarginTop`, `minBottomPadding`).
- Peer ranges now start at verified versions: React 19, React Native 0.84, Reanimated 4 (required), Safe Area Context 5, DateTimePicker 9.
- `usePressableScale` always uses Reanimated; its result no longer has `isReanimated` and `animatedStyle` is a Reanimated animated style.
- Color: new `onPrimary`, `onSuccess`, `onWarning`, `onError`, `onInfo` tokens computed with WCAG contrast (`minTextContrast`, default 4.5). Light-mode primary buttons now use dark text where white was unreadable (1.7:1 on the default green). `textInverse` is an alias of `onPrimary`. The default light `error` is now `#DC2626` (white on the old `#EF4444` was 3.8:1). `getContrastText` uses WCAG luminance. New helpers: `contrastRatio`, `resolveOnColor`, `withAlpha`.
- Config: `labels` + `locale` localise every string the library renders (`useLabels`); `spacing`, `borderRadius` and `components` override global scales and per-component tokens (`theme.components`). The spacing scale gains `smPlus` (12) and `mdPlus` (20).
- Toast: the action button is reachable by screen readers, iOS announces messages, auto-dismiss is extended (or paused for actionable toasts) while a screen reader runs, `announce` and `defaultDuration` options.
- Modal / BottomSheet: VoiceOver escape gesture closes them; BottomSheet adds drag-to-dismiss, keyboard avoidance, `Footer layout` (`row` / `fill` / `stacked`), `backgroundColor`.
- Button: `haptic`, `renderBackground` (gradients), `labelStyle`, `numberOfLines`, `accessibilityHint`, `testID`; reports `busy` and keeps its width while loading.
- HeaderBar `titleAlign`, `titleStyle`, `backButtonStyle`; EmptyState `size`, node `icon`, `fill`.
- Every component reads its dimensions from `theme.components.<name>` (badge, checkbox, radio, switch, chip, input, textArea, searchBar, datePicker, card, listItem, listHeader, settingsRow, statTile, bottomTabBar, pressable, and more), accepts `StyleProp` styles and forwards `testID`. Defaults are unchanged.
- Unicode glyphs (`✕`, `✓`, `›`, `▼`) are replaced by `SystemIcon`, which renders identically on iOS and Android and mirrors in RTL. Required field labels are announced as "<label>, required".
- New: `SegmentedControl`, `KeyboardLiftedFooter` / `useKeyboardLift`, `SystemIcon`, `useScreenReaderEnabled`.
- `parseDecimalInput` handles thousands grouping ("1 234,56", "1.234.567", "1'234.50") and accepts `{ decimalSeparator }`; trailing garbage now returns `NaN` instead of a truncated number.
- `react-native-reanimated` is now declared as a required peer dependency (it was already imported unconditionally).
- Readable text colors: new `primaryText`, `successText`, `warningText`, `errorText`, `infoText` tokens, and `textPrimary` / `textSecondary` / `textTertiary` are held to `minTextContrast` on every surface. In the default light theme accent-colored text (ghost and secondary buttons, active tabs, selected chips and options, focus borders) becomes a darker green (`#00E67A` was 1.7:1 on white) and `textTertiary` gets darker; dark-mode tertiary text gets lighter. `<Text>` / `<Heading>` resolve `color="primary"` and feedback keys to the readable variants. The Bloom violet accent moves from `#7c5cff` to `#7658f3` so white labels reach AA. New helpers `ensureReadable` and `textColorOf`.
- Storybook now runs every story as a Vitest browser test with axe, including color contrast, on every story (`@storybook/addon-vitest`, replacing the test runner).
- Visual polish: new color tokens `controlTrack`, `controlThumb`, `controlBorder` (3:1 non-text contrast for Switch off tracks, ProgressBar tracks, field and checkbox borders), `surfaceSelected` (SegmentedControl thumb, visible in dark mode), `inverseSurface` / `onInverseSurface` / `inversePrimaryText` (toasts now use the inverse surface by default, `components.toast.appearance: 'surface'` restores the old card). `textSecondary` is kept a visible step above `textTertiary`.
- BottomTabBar shows an animated pill behind the active icon (`components.bottomTabBar.indicator`). Sheets cap at `components.bottomSheet.maxWidth` (640) and center on wide screens. Select's option sheet is now a BottomSheet (handle, drag, VoiceOver escape, separators, Cancel button).
- Icons: every component accepts the shared `IconSlot` (render function `({ color, size })`, node, or emoji string; `renderIconSlot`). ErrorBoundary uses a drawn alert icon. SystemIcon gains `plus`, `minus`, `search`, `more`.
- Keyboard focus: themed focus ring (`useFocusRing`, `components.focusRing`) on all pressable controls, shown only for keyboard focus on web.
- MarqueeText defaults its text to the theme `textPrimary` (it rendered black, unreadable in dark mode); a `style` colour still wins.
- `withErrorBoundary` names wrapped anonymous components `withErrorBoundary(Component)` (it produced `withErrorBoundary()`).
