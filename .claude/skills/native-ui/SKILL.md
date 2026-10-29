---
name: native-ui
description: Build React Native screens and components with the @polprog/native-ui design system. Use when writing or reviewing UI that imports @polprog/native-ui, adding a component or story to packages/native-ui, or styling with its theme tokens.
---

# Building UI with @polprog/native-ui

## 1. Look components up, do not guess

The Storybook in `apps/storybook` serves a component catalog generated from
the real prop types and stories. Read it before you use a component or prop.

- **MCP** (Storybook dev server running, `npm run storybook` from the repo
  root): `http://localhost:6006/mcp`. Call `docs-list`, then
  `docs-show` with an id such as `components-button`, and `docs-show-story`
  for one variant.
- **CLI** (no server needed), from `apps/storybook`:
  `npx storybook tools docs list`, `npx storybook tools docs show --id components-button`.
- **Storybook's own skills** for story work: `npx storybook skills stories`
  (workflow for UI changes) and `npx storybook skills write-story`.

`packages/native-ui/api/native-ui.api.md` lists every public export with its
type. Import from the package root only: `import { Button } from '@polprog/native-ui'`.

## 2. Wrap the app once

```tsx
import { NativeUIProvider } from '@polprog/native-ui';
import { SafeAreaProvider } from 'react-native-safe-area-context';

<SafeAreaProvider>
  <NativeUIProvider config={{ colorMode: 'system', theme: 'default' }}>
    <App />
  </NativeUIProvider>
</SafeAreaProvider>;
```

- Required peers: `react-native-reanimated` and `react-native-safe-area-context`.
- `config` options: `theme` (`'default'` Aurora or `'bloom'`), `colorMode`,
  `preset`, `customAccent`, `highContrast`, `reduceAnimations`, `fontSize`,
  `labels`, `locale`, `spacing`, `borderRadius`, `components` (per-component
  tokens). The README table is the reference.
- `useTheme()` and the hooks built on it (`useColors`, `useLabels`,
  `useSemantic`) throw outside the provider, so tests and stories render
  inside it too.

## 3. Style with tokens, never literals

- Colors: `useColors()` (resolved `ColorScheme`: `surface`, `textPrimary`,
  `primary`, `onPrimary`, `border`, ...) or `useTheme().colors`. No hex,
  `rgb()` or named colors in components or screens.
- Text on a solid fill uses the matching `on*` token (`onPrimary`,
  `onError`, ...); colored text on a surface uses the `*Text` token
  (`primaryText`, `errorText`, ...). These keep WCAG contrast.
- Spacing, radius, elevation, type: `theme.spacing`, `theme.borderRadius`,
  `theme.elevation`, `theme.typography`, `theme.iconSize`, `theme.duration`.
- Prefer token props over styles: `<Box p="lg" bg="surface" radius="md">`,
  `<VStack gap="md">`, `<Text variant="body" color="textSecondary">`.
- Component dimensions live in `theme.components.<name>`. Change them through
  `config.components`, not style overrides.
- User-facing strings the library renders come from `useLabels()`
  (`config.labels`); do not hardcode them in library code.

## 4. Icons: the IconSlot convention

`IconSlot` props (`ListItem`, `ListSwitchItem`, `SettingsRow`,
`SettingsSwitchRow`, `Chip`, `EmptyState`, `ActionTile`, `SelectOption`,
`ToastConfig`, `ErrorBoundary.fallbackIcon`) take a render function so the
icon follows theme and state:

```tsx
<ListItem title="Profile" icon={({ color, size }) => <UserIcon color={color} size={size} />} />
```

A React node also works; a string (emoji) is kept only for compatibility. In
your own components accept `IconSlot` and call
`renderIconSlot(slot, { color, size })` with theme colors and
`theme.iconSize`. `Button.icon` and `IconButton.icon` are plain React nodes
(`Button` also has `renderLeft` / `renderRight`); check the prop type with
`docs-show` before passing a function.

## 5. Accessibility rules

- Every pressable has `accessibilityRole` and an `accessibilityLabel`
  (icon-only controls such as `IconButton` always need the label).
- Reflect state with `accessibilityState` (`disabled`, `selected`, `checked`,
  `busy`).
- Keep touch targets at least 44pt (use the component tokens and `hitSlop`).
- Honor `theme.reduceAnimations`; use `useFocusRing()` for custom pressables
  so keyboard and D-pad focus stays visible.
- Storybook runs axe on every story (`parameters.a11y.test: 'error'`); a
  violation fails `npm run test` in `apps/storybook`.

## 6. Tests

Jest in `packages/native-ui/__tests__`, nested Given / When / Then with the
keyword in uppercase:

```tsx
describe('Button', () => {
  describe('GIVEN a disabled button', () => {
    describe('WHEN the user presses it', () => {
      it('THEN onPress is not called', () => {
        const onPress = jest.fn();
        renderWithTheme(<Button title="Save" disabled onPress={onPress} />);

        fireEvent.click(screen.getByRole('button', { name: 'Save' }));

        expect(onPress).not.toHaveBeenCalled();
      });
    });
  });
});
```

- Render with `renderWithTheme` and derive expected colors with
  `captureTheme()` from `__tests__/test-utils.tsx`; never hardcode a color.
- Roles, accessible names and real React Native behavior go in
  `__tests__/native/` (`npm run test:native`); logic and styling stay in the
  `dom` project. See `packages/native-ui/CONTRIBUTING.md`.

## 7. Before you finish

1. From `packages/native-ui`: `npm run typecheck`, `npm run lint`, `npm test`,
   and `npm run api:check` when exports changed.
2. New component: story in `packages/native-ui/stories/components/`, export
   from `src/components/index.ts` and `src/index.ts`, a changeset.
3. With Storybook running, call the MCP `stories-preview` tool for the stories
   you touched and `test-run` to run their render, play and axe checks
   (CLI: `npx storybook tools test run` from `apps/storybook`).
