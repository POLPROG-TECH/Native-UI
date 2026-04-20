<p align="center">
  <img alt="native-ui" src="https://raw.githubusercontent.com/POLPROG-TECH/native-ui/master/docs/assets/logo-full.svg" width="520">
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@polprog/native-ui"><img src="https://img.shields.io/npm/v/@polprog/native-ui.svg?style=flat-square&color=0A84FF" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@polprog/native-ui"><img src="https://img.shields.io/npm/dm/@polprog/native-ui.svg?style=flat-square&color=6366f1" alt="npm downloads"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-6366f1?style=flat-square" alt="License: MIT"></a>
  <img src="https://img.shields.io/badge/TypeScript-strict-0A84FF?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript strict">
  <img src="https://img.shields.io/badge/tests-188%20passed-22c55e?style=flat-square&logo=jest&logoColor=white" alt="Tests: 188 passed">
  <a href="https://github.com/POLPROG-TECH/native-ui/actions"><img src="https://img.shields.io/github/actions/workflow/status/POLPROG-TECH/native-ui/ci.yml?branch=master&style=flat-square" alt="CI"></a>
  <a href="https://POLPROG-TECH.github.io/native-ui"><img src="https://img.shields.io/badge/Storybook-ff4785?style=flat-square&logo=storybook&logoColor=white" alt="Storybook"></a>
  <img src="https://img.shields.io/badge/React%20Native-0.74%2B-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React Native 0.74+">
</p>

<p align="center">
  <b>Production-grade React Native design system with native-feeling components on iOS and Android.</b><br>
  <sub>Design tokens · Primitives · 24+ components · Dark mode · A11y-first · Zero-config theming</sub>
</p>

<p align="center">
  <a href="#highlights">Highlights</a> ·
  <a href="#installation">Installation</a> ·
  <a href="#quick-start">Quick Start</a> ·
  <a href="#theme-configuration">Theming</a> ·
  <a href="#component-reference">Components</a> ·
  <a href="#design-tokens">Tokens</a> ·
  <a href="#migration-from-legacy-ui">Migration</a>
</p>

---

## Highlights

- 📐 **Native-accurate metrics** - platform-native typography scale
  (largeTitle 34/41, headline 17/22, body 17/22, footnote 13/18) with correct
  letter-spacing and line heights.
- 🧩 **24+ production components** built on a small primitive layer
  (`Box`, `VStack`, `HStack`, `Text`, `PressableScale`, …).
- 🎨 **Theme engine** - colour presets, dark/light/system mode, high contrast
  and font-scale tiers - all driven by tokens.
- 🧪 **Tested** - 188 unit tests (GIVEN/WHEN/THEN) covering tokens,
  primitives, components, and public exports.
- 📦 **Tree-shakeable** ESM + CJS build with full `.d.ts` (via `tsup`).
- ♿ **Accessible by default** - screen-reader labels, roles, reduced motion
  and keyboard support out of the box.
- 🤖 **iOS + Android parity** - every component is rendered and tested on
  both platforms; `Platform.select` is used internally for per-OS tweaks.
- 🌐 **Web-compatible** via `react-native-web`.

---

## Installation

```bash
# Install the library
npm install @polprog/native-ui

# Peer dependencies (required)
npm install react-native-reanimated react-native-safe-area-context
```

> **Monorepo users:** prefer linking the workspace package instead of
> pulling from npm.

### Optional: Haptic Feedback

Haptics are pluggable - no native dependency is required by default.
To enable, install and configure:

```bash
npm install react-native-haptic-feedback
```

```ts
import { configureHaptics } from '@polprog/native-ui';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

configureHaptics({
  light:   () => ReactNativeHapticFeedback.trigger('impactLight'),
  medium:  () => ReactNativeHapticFeedback.trigger('impactMedium'),
  success: () => ReactNativeHapticFeedback.trigger('notificationSuccess'),
  warning: () => ReactNativeHapticFeedback.trigger('notificationWarning'),
  error:   () => ReactNativeHapticFeedback.trigger('notificationError'),
});
```

---

## Quick Start

### 1. Wrap your app with the provider

```tsx
import { NativeUIProvider } from '@polprog/native-ui';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <NativeUIProvider
        config={{
          colorMode: 'system',   // 'light' | 'dark' | 'system'
          preset: 'default',     // 'default' | 'midnight' | 'ocean' | ...
          highContrast: false,
          reduceAnimations: false,
        }}>
        <YourApp />
      </NativeUIProvider>
    </SafeAreaProvider>
  );
}
```

### 2. Use components

```tsx
import {
  ScreenContainer,
  Heading,
  Button,
  Card,
  Input,
  VStack,
  useTheme,
} from '@polprog/native-ui';

function ProfileScreen() {
  const theme = useTheme();

  return (
    <ScreenContainer edges={['top']}>
      <VStack gap="lg">
        <Heading level={1}>Profile</Heading>
        <Card>
          <Input label="Name" placeholder="Enter your name" />
          <Input label="Email" placeholder="you@company.com" keyboardType="email-address" />
        </Card>
        <Button title="Save"   onPress={() => {}} variant="primary" />
        <Button title="Cancel" onPress={() => {}} variant="ghost"   />
      </VStack>
    </ScreenContainer>
  );
}
```

---

## Theme Configuration

The `NativeUIProvider` accepts a `config` prop:

| Property            | Type                                   | Default     | Description                         |
|---------------------|----------------------------------------|-------------|-------------------------------------|
| `colorMode`         | `'light' \| 'dark' \| 'system'`        | `'system'`  | Color mode                          |
| `preset`            | `ThemePreset`                          | `'default'` | Theme preset (7 available)          |
| `fontColor`         | `'default' \| 'warm' \| 'cool'`        | `'default'` | Font color variant                  |
| `fontSize`          | `'default' \| 'medium' \| 'large'`     | `'default'` | Font size tier                      |
| `highContrast`      | `boolean`                              | `false`     | High contrast mode                  |
| `reduceAnimations`  | `boolean`                              | `false`     | Reduce motion                       |
| `customAccent`      | `string \| null`                       | `null`      | Custom accent color (hex)           |

### Available Presets

`default` · `midnight` · `ocean` · `forest` · `sunset` · `rose` · `amoled`

### Accessing the theme

```tsx
import { useTheme, useColors } from '@polprog/native-ui';

function MyComponent() {
  const theme  = useTheme();    // Full theme object
  const colors = useColors();   // Just the resolved colors

  return (
    <View style={{ backgroundColor: colors.surface, padding: theme.spacing.lg }}>
      <Text style={[theme.typography.h2, { color: colors.textPrimary }]}>Hello</Text>
    </View>
  );
}
```

### Dynamic color mode switching

Color mode lives in the `NativeUIProvider` `config` prop - control it with
React state:

```tsx
import { NativeUIProvider } from '@polprog/native-ui';

function App() {
  const [mode, setMode] = useState<'light' | 'dark' | 'system'>('system');
  return (
    <NativeUIProvider config={{ colorMode: mode, preset: 'ocean' }}>
      <Root onToggle={() => setMode((m) => (m === 'dark' ? 'light' : 'dark'))} />
    </NativeUIProvider>
  );
}
```

### Overriding semantic tokens

Pass `semanticTokens` inside `config` to merge custom semantic color / spacing
/ typography tokens on top of the active preset:

```tsx
<NativeUIProvider
  config={{
    preset: 'ocean',
    colorMode: 'dark',
    semanticTokens: {
      colors: { brand: { primary: '#FF0080' } },
      spacing: { section: 24 },
    },
  }}>
  <App />
</NativeUIProvider>
```

### Subpath imports and tree-shaking

The package is marked `"sideEffects": false`, so any bundler capable of
tree-shaking (Metro 0.76+, Webpack, Rollup, ESBuild) will drop unused
components from the barrel import:

```ts
import { Button, Card } from '@polprog/native-ui'; // only those ship
```

Heavier components (`Toast`, `BottomSheet`, `Skeleton`) rely on
`react-native-reanimated`. If you don't import them, you don't need the
peer dependency installed - it is declared optional.

---

## Component Reference

> Browse the full catalogue with live examples, accessibility notes and code
> snippets in **[Storybook](https://POLPROG-TECH.github.io/native-ui)**.

### Primitives

| Component         | Description |
|-------------------|-------------|
| `Box`             | View wrapper with token-based `p`, `m`, `bg`, `radius`, `elevation` props |
| `VStack`          | Vertical flexbox container with `gap` |
| `HStack`          | Horizontal flexbox container with `gap` |
| `Text`            | Typography primitive with `variant` and `color` token props |
| `Heading`         | Heading with `level` (1/2/3/display) and accessible header role |
| `Divider`         | Thin horizontal separator |
| `PressableScale`  | Pressable with spring-scale animation |

### Form Controls

| Component             | Description |
|-----------------------|-------------|
| `Button`              | Primary action button - `primary` / `secondary` / `outline` / `ghost` / `danger` |
| `IconButton`          | Circular icon-only button |
| `Input`               | Text input with label, error, focus state |
| `TextArea`            | Multiline text input |
| `Select`              | Modal-based picker (no native dependencies) |
| `Checkbox`            | Checkbox with optional label |
| `Switch`              | Toggle switch with label/subtitle |
| `Radio`               | Radio button with optional label |
| `Chip` / `ChipGroup`  | Selectable filter chips |
| `SearchBar`           | Search input with debounce and clear |

### Display

| Component     | Description |
|---------------|-------------|
| `Card`        | Surface container with elevation. Pressable when `onPress` given |
| `Badge`       | Count badge or status dot |
| `Avatar`      | Circular image or initials avatar |
| `ProgressBar` | Horizontal progress bar with semantic colors |
| `Skeleton`    | Animated loading placeholder |
| `Spinner`     | Full-screen loading indicator |
| `EmptyState`  | Zero-state placeholder with icon, title, action |

### Overlay

| Component            | Description |
|----------------------|-------------|
| `Modal`              | Centered dialog with title, content, footer |
| `BottomSheet`        | Slide-up bottom sheet |
| `Toast` / `useToast` | Snackbar notification |

### Layout

| Component          | Description |
|--------------------|-------------|
| `ScreenContainer`  | Full-screen layout with safe area, background, tablet constraint |
| `Section`          | Content section with title header |
| `ListItem`         | Configurable list row (settings, menus, navigation) |

---

## Design Tokens

All tokens are exported and available for custom styling:

```tsx
import { spacing, borderRadius, typography, elevation } from '@polprog/native-ui';

const myStyle = {
  padding:      spacing.lg,       // 16
  borderRadius: borderRadius.md,  // 14
  ...typography.body,             // { fontSize: 15, lineHeight: 22, ... }
  ...elevation.md,                // platform-specific shadow
};
```

### Token Categories

- **spacing** - `2xs` (2) → `6xl` (64), 4-pt grid
- **borderRadius** - `xs` (6) → `full` (9999)
- **typography** - 14 variants (display, headings, body, labels, caption, mono)
- **elevation** - `none` / `sm` / `md` / `lg` / `xl` (platform-specific shadows)
- **iconSize** - `sm` (16) / `md` (20) / `lg` (24) / `xl` (32)
- **duration** - `instant` (100 ms) / `fast` (200 ms) / `normal` (300 ms) / `slow` (500 ms)
- **zIndex** - `base` (0) → `toast` (200)
- **opacity** - `disabled` / `pressed` / `inactive` / `overlay`
- **borderWidth** - `none` / `hairline` / `thin` / `thick`

---

## Migration from Legacy UI

If you're migrating from an app-local `@shared/ui` + `@shared/theme`
implementation, the steps below cover the most common cases.

### 1. Replace imports

```diff
- import { useTheme } from '@shared/theme';
+ import { useTheme } from '@polprog/native-ui';

- import { Button, Card, Input } from '@shared/ui';
+ import { Button, Card, Input } from '@polprog/native-ui';
```

### 2. Replace ThemeProvider

```diff
- import { ThemeProvider } from '@shared/theme';
+ import { NativeUIProvider } from '@polprog/native-ui';

- <ThemeProvider>
+ <NativeUIProvider config={{
+   colorMode: themeMode,
+   preset: preset,
+   fontColor: fontColor,
+   highContrast: highContrast,
+   reduceAnimations: reduceAnimations,
+   customAccent: globalAccent,
+ }}>
    <App />
- </ThemeProvider>
+ </NativeUIProvider>
```

### 3. Replace SettingsRow → ListItem

```diff
- import { SettingsRow, SettingsSwitchRow } from '@shared/ui';
+ import { ListItem, Switch } from '@polprog/native-ui';

- <SettingsRow label="Theme" value="Dark" onPress={...} icon="🎨" />
+ <ListItem title="Theme" value="Dark" onPress={...} icon={<Text>🎨</Text>} />

- <SettingsSwitchRow label="Dark Mode" value={isDark} onValueChange={...} />
+ <Switch label="Dark Mode" value={isDark} onValueChange={...} />
```

### 4. Replace LoadingScreen → Spinner

```diff
- import { LoadingScreen } from '@shared/ui';
+ import { Spinner } from '@polprog/native-ui';

- <LoadingScreen label="Loading..." />
+ <Spinner label="Loading..." />
```

### 5. Configure haptics

```tsx
// In your app entry point (index.js or App.tsx):
import { configureHaptics } from '@polprog/native-ui';
import { haptics } from './utils/haptics'; // Your existing haptics module

configureHaptics(haptics);
```

---

## Publishing

### For monorepo consumption (recommended for internal use)

Add to your root `package.json` workspaces:

```json
{
  "workspaces": ["packages/*", "apps/*"]
}
```

Then reference in consuming apps:

```json
{
  "dependencies": {
    "@polprog/native-ui": "workspace:*"
  }
}
```

### For the npm registry

```bash
cd packages/native-ui
npm publish --access public
```

---

## Folder Structure

```
packages/native-ui/
├── src/
│   ├── tokens/      # Design tokens (colors, spacing, typography)
│   ├── theme/       # ThemeProvider, useTheme, types
│   ├── primitives/  # Low-level: Box, Stack, Text, Heading, Divider, PressableScale
│   ├── components/  # Higher-level UI components
│   ├── utils/       # Haptics, helpers
│   └── index.ts     # Barrel export
├── __tests__/       # Jest + @testing-library/react (188 tests)
├── stories/         # Storybook stories (source of truth for docs)
├── package.json
├── tsconfig.json
└── README.md
```

---

## Assumptions & Notes

1. **No native build step required** - ships TypeScript source for Metro bundling.
   Apps using `react-native-builder-bob` can add a build step later.
2. **react-native-reanimated** is a required peer dependency for `PressableScale`,
   `Skeleton`, `Toast`, and `BottomSheet` animations.
3. **react-native-safe-area-context** is required for `ScreenContainer` and `Toast` positioning.
4. **Haptics are opt-in** - no-op by default, configure with `configureHaptics()`.
5. **Select** uses a native `Modal` (no native picker dependency). For platform-native
   pickers, consider wrapping `@react-native-picker/picker`.
6. **BottomSheet** is a basic modal-based implementation. For gesture-driven sheets,
   consider `@gorhom/bottom-sheet` and compose with the theme.
7. **ErrorBoundary** and **DatePickerInput** are deferred - they require app-specific dependencies.
8. **App-specific branding components** (e.g. `BrandIcon`, `BrandWordmark`) are
   intentionally out of scope - add them in your application layer.

## Deferred Components

| Component                 | Reason |
|---------------------------|--------|
| DatePickerInput           | Requires `@react-native-community/datetimepicker` + locale config |
| ErrorBoundary             | Requires app-specific error reporting integration |
| InputPrompt               | Cross-platform prompt - can be added when needed |
| Tabs / TabBar             | Navigation-coupled, best handled by app's navigation library |
| BrandIcon / BrandWordmark | App-specific branding assets (belong in the consuming app) |

---

## License

[MIT](./LICENSE) © [POLPROG](https://polprog.pl/)
