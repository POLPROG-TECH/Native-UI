# @polprog/native-ui

## 1.2.0

### Minor Changes

- c7ac7bb: Add new components and full unit-test coverage.

  **New components**

  - `BottomTabBar` - iOS-style bottom tab rail with badges, safe-area insets, accessibility roles (`tab`/`tablist`) and `accessibilityState.selected`.
  - `Countdown` - self-ticking countdown with `hms`/`hm`/`ms`/`auto` format variants, `expiredLabel`, `onExpire` callback and `renderLabel` transform.
  - `StatTile` - compact metric tile with `label` / `value` / optional `caption`, supporting tones (`neutral`/`primary`/`success`/`warning`/`error`), sizes (`sm`/`md`/`lg`), `mono` digits and `align`.

  **Tests & infrastructure**

  - Added Jest + React Testing Library coverage for every component that can render in jsdom (Badge, BottomTabBar, Button, Card, Checkbox, Chip, Countdown, EmptyState, ErrorBoundary, HeaderBar, IconButton, Input, ListHeader, ListItem, ListSection, ListSwitchItem, ProgressBar, Radio, SearchBar, Section, SettingsRow, Spinner, StatTile, Switch, TextArea) plus export-shape tests for native-only components (Avatar, BottomSheet, ConfettiOverlay, InputPrompt, Modal, ScreenContainer, Select, Skeleton, Toast).
  - Raised the Jest coverage threshold to 50% across branches, functions, lines and statements (previously 25% for branches/functions).
  - Extended the `react-native` jsdom mock to expose `aria-label` / `aria-selected` / `aria-disabled` on `TouchableOpacity` and `Pressable`, and to suppress `onValueChange` on a disabled `Switch`.

  **Storybook**

  - Added stories for `BottomTabBar`, `Countdown` and `StatTile` with play-tests for interaction flows.
  - Fixed play-tests for `BottomTabBar` (use `role="tab"`) and `IconButton` (honour the 300 ms press debounce, allow `pointer-events: none` clicks on the disabled-state assertion).
  - Enabled MSW integration in the Storybook preview.
  -

## 1.1.0

### Minor Changes

- 1dc6ab5: Added semantic tokens layer, strict TypeScript, ESLint a11y rules, and changesets for automated versioning.

All notable changes to this package will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Releases are managed via [Changesets](https://github.com/changesets/changesets).
To add a changelog entry, run `npx changeset` from the monorepo root.

## 1.0.0 - Stable release

### Added

- Optional `react-native-reanimated` peer dependency: `PressableScale`
  gracefully falls back to an animated `Animated.View` when reanimated
  is not installed.
- `usePressableScale` headless hook for building custom pressables that
  reuse the library's press-scale animation curve.
- `toast` singleton facade so toasts can be triggered from anywhere
  without threading the `useToast` hook through the component tree.
- Monorepo tooling: husky pre-commit + pre-push hooks, lint-staged,
  jest `coverageThreshold`, Changesets-powered release flow.
- `CONTRIBUTING.md`, expanded README theming guide, documented
  tree-shaking and subpath import guarantees.
- Additional unit tests (Badge, Toast facade, `usePressableScale`,
  exports surface) - suite now at 188 tests.

### Changed

- `package.json` declares `"sideEffects": false` and ships per-component
  subpath exports (`@polprog/native-ui/components/Button`, etc.) to
  guarantee tree-shakeability.
- README logo uses the compact Bracket-N logotype with dark-mode variant
  via `<picture>`.

## 0.1.0 - Initial release

### Added

- Complete design system aligned 1:1 with platform-native metrics (platform defaults on Android).
- Typography scale tuned to the iOS system text styles (largeTitle 34/41, headline 17/22,
  body 17/22, footnote 13/18, caption2 11/13) with accurate letter-spacing.
- Primitive components: `Box`, `VStack`, `HStack`, `Text`, `Heading`,
  `Divider`, `PressableScale`.
- Component library: `Button`, `Card`, `Checkbox`, `Chip`, `HeaderBar`,
  `IconButton`, `Input`, `InputPrompt`, `ListItem`, `ListSection`,
  `ListSwitchItem`, `Radio`, `ScreenContainer`, `SearchBar`, `Section`,
  `SettingsRow`, `Select`, `Skeleton`, `Spinner`, `Switch`, `TextArea`,
  `Toast`, `Avatar`.
- Theme engine with `NativeUIProvider`, colour presets, dark/light mode,
  high-contrast mode, font-scale tiers.
- Full ESM + CJS + `.d.ts` output via `tsup`.
- 178 unit tests covering tokens, primitives, components, and exports.
