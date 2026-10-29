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

## Testing and add-ons

| Add-on                       | What it gives you                                                                                                                                                                                                                                  |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@storybook/addon-vitest`    | Every story runs as a Vitest test in headless Chromium: render, `play` function and an axe scan. Run `npm run test` here (or `npm run test:storybook` from the root), `npm run test:watch` while developing, or the testing widget in the sidebar. |
| `@storybook/addon-a11y`      | Axe panel per story. `parameters.a11y.test` is `'error'` project-wide; rule toggles live in `parameters.a11y.options.rules` (an object, so story overrides merge instead of replacing the defaults).                                               |
| `@chromatic-com/storybook`   | Visual Tests panel: run Chromatic snapshots and review diffs without leaving Storybook (sign in to Chromatic once).                                                                                                                                |
| `@storybook/addon-mcp`       | MCP server at `http://localhost:6006/mcp` while `npm run dev` runs, so AI agents can read component docs and run story tests. Connect Claude Code with `claude mcp add --transport http storybook http://localhost:6006/mcp`. Experimental.        |
| `storybook-addon-tag-badges` | Sidebar and toolbar badges from story tags: `new`, `deprecated`, `beta` (defaults) and `native-only` (behavior needs a device; the web preview shows a fallback).                                                                                  |

Tag a story file with `tags: ['new']` or `tags: ['native-only']` on its `meta` to show a badge.

## Theme runs, device frames and docs data

- **Appearance menu.** One toolbar menu holds every preview global (mode, variant, preset, device frame, font size, contrast, motion, locale). Globals are defined once in `.storybook/globals/definitions.ts`; the preview, the menu and the tests read that file.
- **Device frame.** Pick iPhone, Pixel or iPad to render any story inside a drawn device at the device's logical width (`shared/device/`, also used by the Introduction hero).
- **Light and dark everywhere.** Mode in the Appearance menu switches the manager, the Docs pages and the custom MDX pages as well as the stories; the default, System, follows the OS (`.storybook/schemeSync.ts`, `brand.ts`, `theme.ts`).
- **Language.** Locale passes translated library strings and a BCP 47 locale to `NativeUIProvider` (`.storybook/globals/libraryLocales.ts`), so Cancel, Close, placeholders, required markers, Countdown units and dates change in every story. Guide text in the MDX pages stays in English.
- **Theme matrix.** `npm run test` runs the light project; `npm run test:themes` runs every project in `.storybook/globals/themeMatrix.ts` (light, dark, RTL, large text + high contrast). CI runs one job per project, and Chromatic snapshots the same runs as modes.
- **Docs numbers.** `npm run stats` (run automatically before `dev` and `build`) writes `generated/stats.json` from the sources and the last Jest report (`npm run test:report -w @polprog/native-ui`). Without a report the pages print "n/a".
- **Production usage.** `npm run scan-usage` scans the CostBoard and PhotoToPuzzle sources next to this repo and refreshes the committed `docs/data/production-usage.json`, shown as "Part of the UI kit of" on component pages.
- **Component pages.** `.storybook/docs/ComponentDocsPage.tsx` renders every autodocs page: status badges, production usage, copyable import, source link, primary story, props, `parameters.guidelines` (Do / Don't cards) and the remaining stories.

## AI agents

`.storybook/main.ts` turns on `features.componentsManifest` (component and
docs manifests for agents) and the experimental `features.experimentalDocgenServer`
(props extracted on the server by React Component Meta and shared by MCP,
Docs and Controls). The MCP addon exposes its `dev`, `docs` and `test`
toolsets.

- **MCP:** run `npm run dev`, then point the agent at
  `http://localhost:6006/mcp`, for example
  `claude mcp add --transport http storybook http://localhost:6006/mcp` or
  `npx mcp-add --type http --url "http://localhost:6006/mcp" --scope project`.
  Tools: `docs-list`, `docs-show`, `docs-show-story`, `stories-preview`,
  `stories-changed`, `stories-find-by-component`,
  `get-storybook-story-instructions` and `test-run`.
- **CLI:** the same tools without MCP, from this folder:
  `npx storybook tools --help`, for example
  `npx storybook tools docs show --id components-button`. Docs and test tools
  run without a dev server; `stories preview` needs one.
- **Storybook skills:** `npx storybook skills` lists the built-in workflows
  (`stories`, `write-story`, `setup`); print one with
  `npx storybook skills <id>`.
- **Project skill:** `.claude/skills/native-ui/SKILL.md` at the repository
  root tells agents how to build UI with the library: provider setup,
  token-first styling, the `IconSlot` convention, accessibility and test
  structure.

With the docgen server on, the dev server answers 404 for
`/manifests/*.json`; read them through MCP or from a static build
(`storybook-static/manifests/`). Inspect generation errors at
`http://localhost:6006/manifests/components.html`.

## What's Inside

| Section             | Description                                          |
| ------------------- | ---------------------------------------------------- |
| **Introduction**    | Overview, design principles, quick start             |
| **Getting Started** | Installation, provider setup, imports                |
| **Theming**         | Light/dark modes, 7 color presets, custom themes     |
| **Tokens**          | Colors, typography, spacing, elevation visualization |
| **Primitives**      | Box, Stack, Text, Heading, Divider, PressableScale   |
| **Components**      | Every component with interactive controls            |
| **Patterns**        | Forms, settings, dialogs, loading states             |
| **Migration**       | CostBoard → native-ui mapping guide                  |
| **Accessibility**   | Guidelines, roles, contrast, touch targets           |

## Sharing the Static Build

```bash
# Build once:
cd apps/storybook && npm run build

# Serve locally:
npx serve storybook-static -p 6006

# Deploy to any static host (Vercel, Netlify, GitHub Pages, S3)
```
