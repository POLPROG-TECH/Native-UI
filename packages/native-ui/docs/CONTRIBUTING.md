# Contributing to native-ui

Thank you for your interest in contributing to `@polprog/native-ui`. This guide covers everything you need to know - from proposing a new component to getting your PR merged.

---

## Table of Contents

1. [Proposing New Components (RFC Process)](#proposing-new-components)
2. [Development Setup](#development-setup)
3. [Component Standards](#component-standards)
4. [Adding Tokens](#adding-tokens)
5. [Adding Primitives](#adding-primitives)
6. [Adding Components](#adding-components)
7. [PR Checklist](#pr-checklist)
8. [Versioning (Changesets)](#versioning)

---

## Proposing New Components

Every new component starts with an **RFC** (Request for Comments).

1. Copy `docs/RFC_TEMPLATE.md` into a new file: `docs/rfcs/YYYY-MM-DD-component-name.md`
2. Fill out every section - especially **Motivation** (which apps need this?) and **API Proposal**
3. Open a PR with the RFC and tag at least **2 consumer-app maintainers** for review
4. Discussion happens on the PR. Once approved, the RFC is merged and implementation can begin
5. Implementation PR references the RFC file

> **Rule of thumb:** If a component is used by only one app, it belongs in that app. If two or more apps need it, it belongs in native-ui.

---

## Development Setup

```bash
# Clone the monorepo
git clone https://github.com/POLPROG-TECH/native-ui.git
cd native-ui

# Install dependencies (from repo root)
npm install

# Navigate to native-ui
cd packages/native-ui

# Run type checking
npm run typecheck

# Run linting
npm run lint

# Check stories are up to date
npm run stories:check

# Generate missing story stubs
npm run stories:generate
```

### Storybook Development

Stories live in the `stories/` directory, mirroring the `src/` structure:

```
stories/
├── components/
│   ├── Button.stories.tsx
│   └── Card.stories.tsx
└── primitives/
    ├── Box.stories.tsx
    └── Text.stories.tsx
```

Run `npm run stories:generate` to scaffold stubs for new components automatically.

---

## Component Standards

Every component in native-ui **must** meet these requirements:

### 1. Use Primitives - No Raw React Native

```tsx
// ❌ Don't
import { View, Text } from 'react-native';

// ✅ Do
import { Box, Text, VStack, HStack } from '../primitives';
```

Components must be built on top of native-ui primitives (`Box`, `VStack`, `HStack`, `Text`, `Heading`, `Divider`, `PressableScale`). This ensures consistent token usage and theming throughout the library.

### 2. Accept a `style` Prop (Escape Hatch)

Every component must accept an optional `style` prop on its root element so consumers can apply one-off overrides without forking:

```tsx
interface MyComponentProps {
  style?: StyleProp<ViewStyle>;
  // ...
}
```

### 3. JSDoc with `@example`

All exported components must include a JSDoc comment with at least one usage example:

```tsx
/**
 * A card container with elevation and optional press behavior.
 *
 * @example
 * <Card onPress={() => navigate('Detail')}>
 *   <Text variant="body">Hello</Text>
 * </Card>
 */
export function Card({ children, onPress, style }: CardProps) { ... }
```

### 4. Strict TypeScript

- All props must have explicit types (no `any`)
- Enable `strict: true` in tsconfig
- Export the props interface: `export interface CardProps { ... }`

### 5. Storybook Story

Every component needs a corresponding `.stories.tsx` file. Run `npm run stories:generate` to create stubs, then flesh them out with realistic examples and control knobs.

### 6. Unit Tests

Write tests that cover:
- Default rendering
- All visual variants
- User interaction (press, input, toggle)
- Edge cases (empty state, long text, disabled)

### 7. Light/Dark Theme Support

- Use `useTheme()` or `useColors()` for all colors - never hardcode hex values
- Test both light and dark modes in Storybook stories

### 8. Platform-Agnostic (or Explicitly Platform-Aware)

Components should work on iOS, Android, and (where applicable) Web. If platform-specific behavior is needed, use `Platform.select()` and document it clearly.

---

## Adding Tokens

Tokens live in `src/tokens/` and follow a strict hierarchy:

| File | What Goes Here |
|---|---|
| `colors.ts` | Color palettes, light/dark schemes, presets |
| `typography.ts` | Font sizes, weights, line heights, variant definitions |
| `spacing.ts` | Spacing scale, border radius, icon sizes, elevation, duration, z-index, opacity, border widths, easing |
| `semantic.ts` | Intent-based aliases that map to primitive tokens |

**Steps:**
1. Add the primitive value in the appropriate file
2. If it represents an intent (e.g., `actionDanger`), add a semantic alias in `semantic.ts`
3. Update the `Theme` type in `src/theme/types.ts` if the token category is new
4. Export from `src/tokens/index.ts`
5. Export from `src/index.ts`

---

## Adding Primitives

Primitives are the lowest-level building blocks (`Box`, `Text`, etc.). Adding a new one is rare and requires careful consideration.

1. File an RFC - primitives affect the entire component tree
2. Create `src/primitives/NewPrimitive.tsx`
3. Accept token-based shorthand props (e.g., `p`, `m`, `gap`, `bg`, `radius`)
4. Accept a `style` escape hatch
5. Export from `src/primitives/index.ts` and `src/index.ts`
6. Create a Storybook story and unit tests

---

## Adding Components

1. File an RFC (see above)
2. Create `src/components/ComponentName.tsx`
3. Build on primitives - no raw `<View>` or `<Text>` from react-native
4. Follow all [component standards](#component-standards)
5. Export from `src/components/index.ts` and `src/index.ts`
6. Run `npm run stories:generate` and flesh out the story
7. Write unit tests

**File naming:** PascalCase matching the component name (`Button.tsx`, `ListItem.tsx`).

---

## PR Checklist

Before opening a PR, verify:

- [ ] RFC approved (for new components/primitives)
- [ ] Built on primitives - no raw React Native `View`/`Text`
- [ ] `style` escape-hatch prop present
- [ ] JSDoc with `@example` on all exports
- [ ] TypeScript strict - no `any`, all props typed
- [ ] Storybook story created/updated
- [ ] Unit tests passing
- [ ] Light and dark theme tested
- [ ] Works on iOS, Android (and Web if applicable)
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run stories:check` passes
- [ ] Changeset added (see below)

---

## Versioning

We use [Changesets](https://github.com/changesets/changesets) for versioning and changelogs.

### Adding a changeset

After making your changes:

```bash
npx changeset
```

You'll be prompted to:
1. Select the package (`@polprog/native-ui`)
2. Choose a bump type:
   - **patch** - bug fixes, documentation, internal refactors
   - **minor** - new components, new props, new tokens
   - **major** - breaking API changes, removed components, renamed props
3. Write a human-readable summary of the change

This creates a markdown file in `.changeset/` that will be consumed during release.

### Release flow

1. Changesets accumulate on `main`
2. A "Version Packages" PR is auto-created
3. Merging that PR bumps versions and publishes to the registry
