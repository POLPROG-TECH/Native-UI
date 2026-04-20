<p align="center">
  <img alt="native-ui" src="../../docs/assets/logo-full.svg" width="520">
</p>

<p align="center">
  <b>Documentation portal for <code>@polprog/native-ui</code> - powered by Storybook 8.</b>
</p>

---

# native-ui - Documentation Portal

Design system documentation for `@polprog/native-ui`, powered by Storybook.

## Architecture

```
Native-UI/
├── packages/
│   └── native-ui/               ← Published library (components, tokens, themes)
│       ├── src/                 ← Source code
│       └── stories/             ← Stories (colocated with library)
│           ├── tokens/
│           ├── primitives/
│           ├── components/
│           └── patterns/
└── apps/
    └── storybook/               ← Documentation host (NOT published)
        ├── .storybook/          ← Storybook runtime config, mocks, branding
        ├── docs/                ← MDX documentation pages
        └── storybook-static/    ← Built output
```

**Why this structure?**
- Stories stay close to the component source for maintainability
- The docs host is a separate app - keeps the published package clean
- Root workspace scripts make it easy to run from anywhere

## Quick Start

```bash
# From the repository root:
npm install --legacy-peer-deps
npm run storybook
# → http://localhost:6006

# Or from the docs app directly:
cd apps/storybook
npm run dev

# Build static docs for sharing:
npm run build-storybook
# → apps/storybook/storybook-static/
```

## What's Inside

| Section | Description |
|---------|-------------|
| **Introduction** | Overview, design principles, quick start |
| **Getting Started** | Installation, provider setup, imports |
| **Theming** | Light/dark modes, 7 color presets, custom themes |
| **Tokens** | Colors, typography, spacing, elevation visualization |
| **Primitives** | Box, Stack, Text, Heading, Divider, PressableScale |
| **Components** | 26 components with interactive controls |
| **Patterns** | Forms, settings, dialogs, loading states |
| **Migration** | CostBoard → native-ui mapping guide |
| **Accessibility** | Guidelines, roles, contrast, touch targets |

## Sharing the Static Build

```bash
# Build once:
cd apps/storybook && npm run build

# Serve locally:
npx serve storybook-static -p 6006

# Deploy to any static host (Vercel, Netlify, GitHub Pages, S3)
```
