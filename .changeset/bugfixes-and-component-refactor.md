---
'@polprog/native-ui': minor
---

Component bug fixes, single-responsibility refactors, and a test-coverage push past 90%.

**Fixes**
- `SearchBar` - honour parent-driven resets even when the debounce timer is in flight.
- `BottomTabBar` - hide the badge for `0`, negative, and empty-string counts.
- `Countdown` - clear the interval the moment the counter expires instead of leaking timers.
- `BottomSheet` - respect `theme.reduceAnimations` on exit, not only on enter.
- `Toast` - treat `duration: 0` as sticky rather than collapsing to the default 3 s timeout.
- `ErrorBoundary` - treat `resetKeys` transitioning between defined and `undefined` (and back) as a reset trigger.

**Refactor**
- Extracted helpers, hooks, and subcomponents across `SearchBar`, `BottomTabBar`, `Countdown`, `BottomSheet`, `Toast`, and `ErrorBoundary` for clearer single-responsibility boundaries.

**Tests & infrastructure**
- Added suites for `Avatar`, `Skeleton`, `ScreenContainer`, `Modal`, `BottomSheet`, `ConfettiOverlay`, `Select`, `InputPrompt`, `Divider`, `Heading`, `SectionLabel`, `PaginationDots`, `MarqueeText`, `PressableScale`, responsive tokens, `useResponsiveSpacing`, and `ThemeProvider`.
- Centralised React Native and Reanimated jest mocks, injected `__DEV__` globally.
