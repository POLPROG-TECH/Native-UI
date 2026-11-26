# native-ui Architecture

React Native design system: tokens, primitives and components for iOS and
Android apps, with a web preview through `react-native-web` in Storybook.

The component catalogue, every prop and every token live in Storybook and in
[`api/native-ui.api.md`](../api/native-ui.api.md). This document explains how
the parts fit together and why, and deliberately lists no counts or values
that the code can change.

---

## Layers

```
┌─────────────────────────────────────────────────────┐
│                   Consumer apps                     │
├─────────────────────────────────────────────────────┤
│                    Components                       │
│  actions, form controls, feedback, overlays,        │
│  navigation, lists and layout                       │
├─────────────────────────────────────────────────────┤
│                    Primitives                       │
│  Box, VStack, HStack, Text, Heading, Divider,       │
│  PressableScale, SystemIcon, PaginationDots, ...    │
├─────────────────────────────────────────────────────┤
│          Theme (provider, labels, variants)         │
├─────────────────────────────────────────────────────┤
│                   Design tokens                     │
│  colors, typography, spacing, radius, elevation,    │
│  motion, semantic aliases, per-component tokens     │
└─────────────────────────────────────────────────────┘
```

Each layer imports only from the layers below it. `npm run check:cycles`
fails CI on a circular import.

- **Tokens** (`src/tokens`): plain values and the functions that derive them
  (contrast-safe text colors, type scales). No React.
- **Theme** (`src/theme`): `NativeUIProvider` resolves a `NativeUIConfig` into
  one `Theme` object and serves it through context.
- **Primitives** (`src/primitives`): thin wrappers over React Native views
  with token shorthand props (`p`, `gap`, `bg`, `radius`).
- **Components** (`src/components`): one file per public component, with its
  hooks, parts and style builders in a folder of the same name
  (`Button.tsx` and `button/`). Components read every dimension from
  `theme.components.<name>`. They use primitives where that helps and React
  Native host views directly where they need full control (pressables, text
  inputs, animated views).
- **Hooks and utils** (`src/hooks`, `src/utils`): cross-component behavior
  such as the keyboard focus ring, haptics and the accessibility prop helpers.

---

## Theming

```
NativeUIProvider (config)
        │
        ├── picks the variant (Aurora or Bloom) and the color mode
        ├── applies the accent preset or a custom accent
        ├── computes readable text and `on*` colors (WCAG contrast)
        ├── builds the type scale, spacing and radius scales
        ├── builds per-component tokens and merges app overrides
        ├── resolves labels and the locale
        │
        └── provides one Theme object through React context
                │
                ├── useTheme()     the whole theme
                ├── useColors()    the color scheme
                ├── useSemantic()  semantic aliases
                └── useLabels()    strings the library renders
```

The hooks throw outside the provider, so tests and stories render inside it.

### What the config controls

| Group         | Keys                                                              |
| ------------- | ----------------------------------------------------------------- |
| Look          | `theme`, `colorMode`, `preset`, `customAccent`, `fontColor`       |
| Accessibility | `highContrast`, `reduceAnimations`, `fontSize`, `minTextContrast` |
| Type          | `typography`, `fontFamilies`                                      |
| Scales        | `spacing`, `borderRadius`, `semanticTokens`                       |
| Components    | `components` (partial overrides, merged one component at a time)  |
| Language      | `labels` (or a shipped pack such as `plLabels`), `locale`         |

The README has the full table with types and defaults.

### Why per-component tokens

A padding, a duration or a threshold that lives in a component file can only
be changed by forking the component. Putting it in `theme.components.<name>`
lets an app tune one component through `config.components` while every other
token keeps its default, and lets defaults follow the global scales
(`config.spacing`, `config.borderRadius`).

### Semantic tokens

Semantic tokens name an intent and point at a primitive token:
`actionPrimary` is `primary`, `surfaceCard` is `surface`, `pageHorizontal` is
the `lg` spacing step. Changing "card padding" for a whole app is then one
override in `config.semanticTokens`, not an edit in every screen.

---

## Accessibility model

- Every pressable has a role, an accessible name and its state.
- Role and state go through `accessibilityStateProps(role, state)`. iOS and
  Android read `accessibilityState`; React Native Web ignores it, so on web
  the helper also writes the ARIA attributes that are valid for the role
  (`aria-selected` for tabs, `aria-checked` for radios, checkboxes and
  switches, `aria-pressed` for toggle buttons). Range values go through
  `accessibilityValueProps` in the same way.
- Text colors are derived, not picked: `primaryText`, `errorText` and the
  `on*` colors are computed to meet `minTextContrast` on their background.
- Strings the library renders come from `labels`, never from literals.
- `theme.reduceAnimations` turns motion off; `useFocusRing()` draws the
  keyboard focus indicator.

---

## Package layout and resolution

```
src/
├── index.ts            public entry; each area's barrel decides what it exposes
├── theme/              provider, types, labels, locales/, variants
├── tokens/             colors, palettes/, typeScales/, spacing, semantic,
│                       components/ (per-component tokens)
├── primitives/         Box, Stack, Text, ... plus a folder per complex primitive
├── components/         <Name>.tsx plus <name>/ for hooks, parts and styles
├── hooks/              useFocusRing, useKeyboardLift, useTextField, ...
└── utils/              haptics, number parsing, accessibility prop helpers
```

The package ships both `src` and `dist`:

- Metro (the `react-native` export condition) resolves every entry to the
  TypeScript sources, so the app's Babel setup compiles the library.
- Node, bundlers and type checkers resolve to `dist` (ESM and CJS, each with
  its own declarations).

Every subpath (`/components/<Name>`, `/primitives/<Name>`, `/tokens`,
`/theme`) follows the same rule as the root entry. If one subpath served
`dist` while the root served `src`, an app would load two copies of the theme
context. Subfolders are closed with `null` targets, so internal files cannot
be imported. `npm run exports:sync` generates the map and
`npm run verify-tarball` checks it against the published files.

---

## Verification

| Check                                    | What it proves                                                               |
| ---------------------------------------- | ---------------------------------------------------------------------------- |
| `dom` Jest project                       | Logic, styles and tokens on a hand-written React Native mock; coverage       |
| `native` Jest project                    | Roles, names, state and press handling on the real React Native renderer     |
| Storybook stories as Vitest tests        | Every story renders, plays and passes axe in light, dark, RTL and large text |
| `npm run test:scripts`                   | The tooling scripts (exports map, peer ranges, docs stats)                   |
| `api:check`, `exports:check`             | Public API and exports map changes are reviewed diffs                        |
| `verify-tarball`, `package:lint`, `size` | The published package: files, types for ESM and CJS, bundle budgets          |
| `peers:min` then `typecheck`             | The library compiles against the lowest peer versions it declares            |
| Example app (`apps/example`)             | The library on an iOS or Android runtime, through the real exports map       |

The mock cannot stand in for a device: a view with zero opacity takes clicks
in jsdom and in a browser but not on iOS. Behavior that depends on the
platform is checked in the example app.

---

## Haptics

The library has no haptics dependency. An app registers its own
implementation once with `configureHaptics({ light, medium, success, warning,
error })`; until then every call is a no-op. Calls are throttled per method.
