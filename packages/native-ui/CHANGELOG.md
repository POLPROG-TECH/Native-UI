# @polprog/native-ui

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
