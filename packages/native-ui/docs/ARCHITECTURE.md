# native-ui Architecture

React Native design system providing tokens, primitives, and components for enterprise mobile applications.

---

## Layer Diagram

```
┌─────────────────────────────────────────────────────┐
│                   Consumer Apps                     │
│          (CostBoard, Invoicer, etc.)                │
├─────────────────────────────────────────────────────┤
│                    Patterns                         │
│       (ScreenContainer, Section, Settings*)         │
├─────────────────────────────────────────────────────┤
│                   Components                        │
│   Button, Card, Input, Modal, Toast, Badge, ...     │
├─────────────────────────────────────────────────────┤
│                   Primitives                        │
│   Box, VStack, HStack, Text, Heading, Divider,      │
│   PressableScale                                    │
├─────────────────────────────────────────────────────┤
│                  Design Tokens                      │
│   Colors, Spacing, Typography, BorderRadius,        │
│   Elevation, Duration, Opacity, Semantic Tokens     │
└─────────────────────────────────────────────────────┘
```

Each layer depends only on the layers below it:

- **Tokens** - Raw design values (colors, spacing scales, typography definitions). No React code.
- **Primitives** - Thin wrappers around React Native views that consume tokens via shorthand props (`p`, `m`, `bg`, `gap`). These replace raw `View`, `Text`, etc.
- **Components** - Feature-rich UI elements built exclusively from primitives and tokens. Never import from `react-native` directly.
- **Patterns** - Layout-level compositions (screen containers, sections, settings rows) that combine multiple components into recurring UI patterns.
- **Consumer Apps** - Import from `@polprog/native-ui` and compose screens.

---

## How Theming Works

```
NativeUIProvider (config)
        │
        ├── Resolves color scheme (light/dark/system)
        ├── Applies preset (default, midnight, ocean, ...)
        ├── Applies font scale & color overrides
        ├── Merges semantic token overrides
        │
        └── Provides Theme object via React Context
                │
                ├── useTheme()        → full theme object
                ├── useColors()       → color scheme only
                ├── useThemeColors()  → alias for useColors()
                └── useSemantic()     → semantic tokens only
```

### Provider Configuration

```tsx
<NativeUIProvider config={{
  colorMode: 'system',            // 'light' | 'dark' | 'system'
  preset: 'default',              // 7 built-in presets
  fontColor: 'default',           // 'default' | 'warm' | 'cool'
  fontSize: 'default',            // 'default' | 'medium' | 'large'
  highContrast: false,
  reduceAnimations: false,
  customAccent: null,             // Optional hex override
  semanticTokens: {},             // Partial overrides
}}>
```

### Theme Object

The `Theme` object provided by context contains:

| Property           | Description                                                         |
| ------------------ | ------------------------------------------------------------------- |
| `colors`           | Resolved `ColorScheme` (background, surface, primary, text\*, etc.) |
| `typography`       | Font variant definitions (displayLarge → captionSmall)              |
| `spacing`          | Named scale: `2xs` (2) → `6xl` (64)                                 |
| `borderRadius`     | Named radii: `xs` (6) → `full` (9999)                               |
| `iconSize`         | `sm` (16), `md` (20), `lg` (24), `xl` (32)                          |
| `elevation`        | Platform-specific shadow definitions                                |
| `duration`         | Animation durations: `instant` → `slow`                             |
| `zIndex`           | Layer ordering: `base`, `dropdown`, `modal`, `toast`                |
| `opacity`          | `disabled`, `pressed`, `inactive`, `overlay`                        |
| `borderWidth`      | `none`, `hairline`, `thin`, `thick`                                 |
| `easing`           | Reanimated easing functions                                         |
| `glowShadow`       | Glow shadow presets                                                 |
| `semantic`         | Intent-based token aliases                                          |
| `isDark`           | Current dark mode state                                             |
| `reduceAnimations` | Motion preference                                                   |
| `fontScale`        | Current font scale multiplier                                       |

---

## Semantic Tokens vs Primitive Tokens

### Primitive Tokens

Concrete, context-free values:

```ts
spacing.lg; // 16
colors.primary; // '#3B82F6'
typography.h1; // { fontSize: 28, fontWeight: '700', lineHeight: 34 }
```

### Semantic Tokens

Intent-based aliases that map to primitive tokens. They answer "what is this for?" rather than "what value is this?":

```ts
// Color semantics (map to ColorScheme keys)
actionPrimary    → 'primary'
feedbackSuccess  → 'success'
surfaceCard      → 'surface'
textHeading      → 'textPrimary'

// Spacing semantics (map to spacing keys)
pageHorizontal   → 'lg'      // 16
cardPadding      → 'lg'      // 16
inlineGap        → 'sm'      // 8

// Typography semantics (map to typography keys)
pageTitle        → 'h1'
sectionTitle     → 'h2'
bodyDefault      → 'body'
```

**Why semantic tokens?** They allow global intent-level changes without touching components. If "card padding" needs to change from 16 to 20, update one semantic mapping - every card updates.

---

## Consumer App Integration

### 1. Install

```bash
npm install @polprog/native-ui
```

### 2. Wrap with Provider

```tsx
import { NativeUIProvider } from '@polprog/native-ui';

export default function App() {
  return (
    <NativeUIProvider config={{ colorMode: 'system', preset: 'default' }}>
      <Navigation />
    </NativeUIProvider>
  );
}
```

### 3. Use Components

```tsx
import { Button, Card, Text, useTheme } from '@polprog/native-ui';

function MyScreen() {
  const theme = useTheme();
  return (
    <Card>
      <Text variant="h2">Title</Text>
      <Button title="Action" onPress={handlePress} />
    </Card>
  );
}
```

### 4. Optional: Configure Haptics

```tsx
import { configureHaptics } from '@polprog/native-ui';

configureHaptics({
  light: () => HapticFeedback.trigger('impactLight'),
  // ...
});
```

---

## File Structure Convention

```
src/
├── index.ts                    ← Public API barrel export
├── theme/
│   ├── ThemeProvider.tsx       ← NativeUIProvider + hooks
│   ├── types.ts                ← Theme, NativeUIConfig types
│   └── index.ts
├── tokens/
│   ├── colors.ts               ← ColorScheme, presets, utilities
│   ├── typography.ts           ← Font variants, sizes, weights
│   ├── spacing.ts              ← Spacing, radius, elevation, etc.
│   ├── semantic.ts             ← Intent-based token aliases
│   └── index.ts
├── primitives/
│   ├── Box.tsx                 ← View + token shorthand props
│   ├── Stack.tsx               ← VStack, HStack
│   ├── Text.tsx                ← Typography primitive
│   ├── Heading.tsx             ← Semantic heading (h1-h3, display)
│   ├── Divider.tsx             ← Separator
│   ├── PressableScale.tsx      ← Animated pressable
│   └── index.ts
├── components/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── ... (29+ components)
│   └── index.ts
└── utils/
    ├── haptics.ts              ← Pluggable haptic feedback
    └── index.ts
```

**Naming conventions:**

- Files: PascalCase matching the default export (`Button.tsx`, `ListItem.tsx`)
- Props interfaces: `ComponentNameProps` (`ButtonProps`, `ListItemProps`)
- Variants: lowercase string unions (`'primary' | 'secondary' | 'danger'`)
- Sizes: lowercase string unions (`'sm' | 'md' | 'lg'`)
- Callbacks: `onX` pattern (`onPress`, `onValueChange`, `onSelect`)

---

## Testing Strategy

### Unit Tests

- Every component has a corresponding test file
- Cover: default render, all variants, interactions, edge cases, disabled states
- Wrap with `NativeUIProvider` in test setup for theme context

### Storybook

- Every component has a `.stories.tsx` file
- Run `npm run stories:check` in CI to enforce coverage
- Run `npm run stories:generate` to scaffold stubs
- Stories demonstrate all variants, sizes, and states

### Type Checking

- `npm run typecheck` - strict TypeScript, no `any`
- Run in CI to prevent type regressions

### Linting

- `npm run lint` - ESLint for code quality
- Enforced in CI

### Consumer Audit

- `npm run audit -- <path>` - scan a consumer app for adoption metrics
- Reports raw RN usage, hardcoded values, and adoption score
- Run periodically to track migration progress
