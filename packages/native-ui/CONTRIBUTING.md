# Contributing to `@polprog/native-ui`

Thanks for taking the time to improve the library! This guide covers the
package-local workflow. For repository-wide rules see the [root
CONTRIBUTING.md](../../CONTRIBUTING.md).

## Local setup

```bash
npm ci
npm run typecheck   --workspace=@polprog/native-ui
npm run lint        --workspace=@polprog/native-ui
npm test            --workspace=@polprog/native-ui
npm run build       --workspace=@polprog/native-ui
```

Storybook is the main development surface:

```bash
npm run storybook           # dev server (port 6006)
npm run build-storybook     # static build
```

## Proposing a component

Every new component or primitive starts with an RFC:

1. Copy `docs/RFC_TEMPLATE.md` to `docs/rfcs/YYYY-MM-DD-component-name.md`.
2. Fill in every section, above all **Motivation** (which apps need it) and
   **API Proposal**.
3. Open a PR with the RFC and ask at least two consumer-app maintainers to
   review it. Implementation starts once it is merged, and the implementation
   PR links the RFC.

Rule of thumb: a component only one app uses belongs in that app. Once two or
more apps need it, it belongs here.

## Adding a new component

Every new component must ship with these artifacts in the same PR:

1. **Source** - `src/components/<Name>.tsx`
   - Typed props interface `export interface <Name>Props`.
   - Theme-token driven styling (never hard-coded colors/sizes). Pull tokens
     via `useTheme()`.
   - Respect `reduceAnimations` and accessibility props (`accessibilityRole`,
     `accessibilityLabel`, `accessibilityState`).
   - Support `ref` forwarding for focusable/pressable components (React 19
     accepts `ref` as a normal prop - no `forwardRef` wrapper needed).
2. **Exports** - add to `src/components/index.ts` **and** `src/index.ts`
   (value + type export).
3. **Story** - `stories/components/<Name>.stories.tsx` with at least:
   `Default`, `Variants`, and `Disabled` or a realistic edge case.
4. **Unit tests** - `__tests__/components/<Name>.test.tsx` covering
   rendering, interactions, and accessibility roles.
   Add a test under `__tests__/native/` when the behavior depends on real
   React Native (see [Test projects](#test-projects)).
   Structure them as described in [Test structure](#test-structure).
5. **Changeset** - `npx changeset` (choose `patch`, `minor`, or `major`).
6. **Docs** - update `README.md` component table if applicable.

## Component standards

- **Tokens, not literals.** Colors come from `useTheme()` / `useColors()`,
  dimensions from `theme.components.<name>`, strings the library renders from
  `useLabels()`. A new component adds its token interface and defaults to a
  file in `src/tokens/components/` and registers it in
  `src/tokens/components/index.ts`.
- **Named vocabulary.** A closed set of values (variants, placements) is one
  `as const` object with its type derived from it; component code never
  compares against a bare string.
- **`style` escape hatch.** The root element accepts `style?: StyleProp<ViewStyle>`
  and forwards `testID`.
- **JSDoc with `@example`** on every exported component, and an exported
  `<Name>Props` interface with no `any`.
- **Light and dark.** Check both in Storybook; the theme matrix also runs RTL
  and large text with high contrast.
- **Both platforms.** Use `Platform.select()` for per-OS behavior and say why
  in a comment.
- **Small functions.** ESLint caps functions in `src/` at 30 lines; extract a
  hook, a subcomponent or a style builder into `src/components/<name>/`.

## Adding tokens

| File                         | What goes there                                                                                      |
| ---------------------------- | ---------------------------------------------------------------------------------------------------- |
| `src/tokens/colors.ts`       | Palettes, light and dark schemes, presets                                                            |
| `src/tokens/typography.ts`   | Type scales and variants                                                                             |
| `src/tokens/spacing.ts`      | Spacing, radius, icon sizes, elevation, duration, z-index, opacity, border widths, easing            |
| `src/tokens/semantic.ts`     | Intent-based aliases of the tokens above                                                             |
| `src/tokens/components/*.ts` | Per-component dimensions, durations and thresholds (`theme.components`, `NativeUIConfig.components`) |

A new global token category also needs the `Theme` type in
`src/theme/types.ts` and an export from `src/tokens/index.ts`.

## Adding a primitive

Primitives (`Box`, `Text`, `VStack`, ...) shape every component above them, so
a new one is rare and always goes through an RFC. It accepts token shorthand
props (`p`, `m`, `gap`, `bg`, `radius`) and a `style` escape hatch, is exported
from `src/primitives/index.ts`, and ships a story and tests like a component.

## Test projects

`jest.config.js` defines two Jest projects. `npm test`, `npm run test:ci` and
`npm run test:coverage` run both.

| Project  | Tests                                     | Renders with                                                                          | Use it for                                                                                                                 |
| -------- | ----------------------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `dom`    | `__tests__/**` except `__tests__/native/` | jsdom, `@testing-library/react` and the hand-written `__mocks__/react-native.js`      | Logic, rendering and interactions. Fast, and the source of the coverage thresholds.                                        |
| `native` | `__tests__/native/**`                     | `@react-native/jest-preset` (real `react-native`) and `@testing-library/react-native` | Behavior the mock cannot prove: accessibility props and state, `Modal`, `Pressable`, `AccessibilityInfo`, native `Switch`. |

Which project a test goes in:

- **`native`** when the assertion is about what assistive technology
  perceives or what only real React Native does: roles, accessible names,
  `checked` / `selected` / `disabled` state, elements hidden from
  accessibility, `Modal`, `Pressable` press handling, the native `Switch`.
  The mock maps these to ARIA by hand and can claim things a device would not
  (it gave a passive `Radio` a radio role that real RN never exposes).
- **`dom`** for logic and drawing: callbacks, haptics, timers, hooks, tokens,
  styles and theme colors. Coverage comes only from `dom`, so a hook or branch
  with real logic keeps a `dom` test even when a `native` test also reaches it.
- Gesture and keyboard logic (`PanResponder`, `Keyboard`) stays in `dom`: spy
  on the mocked API, capture the callbacks and call them with typed fakes from
  `__tests__/shared/gestures.ts` and `__tests__/shared/keyboard.ts`.
- A scenario lives in one project. When moving one to `native`, delete the
  `dom` copy unless it asserts something the `native` one does not, and leave
  a one-line pointer in the remaining `dom` suite.

Helpers:

- Both `__tests__/test-utils.tsx` (dom) and `__tests__/native/test-utils.tsx`
  export `renderWithTheme`, `captureTheme(config?)` (the resolved theme, for
  expected colors and tokens) and `createHapticsMock()`, plus everything from
  their Testing Library. Use them instead of local copies.
- The dom test-utils also export `evaluateAnimatedStyles()` and
  `animatedStyleMock()` to read the style a Reanimated updater settles on.
- The `dom` mock lives in `__mocks__/react-native/` (`styles`,
  `accessibility`, `views`, `controls`, `containers`, `apis`), re-exported by
  `__mocks__/react-native.js`. When it drifts from React Native, fix the mock
  and add the scenario to `native` too.
- Run one project with `npm run test:native` or `npx jest --selectProjects dom`.
- Native tests import `renderWithTheme`, `screen` and `userEvent` from
  `__tests__/native/test-utils.tsx` and query by role or label. React Native
  Testing Library 14 renders asynchronously: `await renderWithTheme(...)`,
  `await captureTheme()` and `await fireEvent(...)`. Call `captureTheme()`
  before rendering, because it renders a hook and rebinds `screen`.
- The `native` project uses the official `react-native-reanimated/mock` and a
  small zero-inset safe-area mock (`__tests__/native/mocks/safe-area-context.js`;
  the package's own mock re-requires itself through `moduleNameMapper`), and
  resolves modules through `jest.native-resolver.js`.

## Public API changes

`api/native-ui.api.md` lists every export of the package with its type. CI
fails (`npm run api:check`) when the source no longer matches it. After an
intended API change, run `npm run api:report`, commit the updated report and
pick the changeset level from the diff: removed or narrowed names are `major`,
added names or widened types are `minor`.

## Test structure

Every test is a Given / When / Then scenario written as nested blocks, with the
keyword in uppercase at the start of each title:

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

- The outer `describe` names the unit under test; `GIVEN` describes the
  starting state, `WHEN` the action, `THEN` the observable outcome.
- Setup (rendering, user events) stays inside the `it`, so each test reads on
  its own. Shared hooks (`beforeEach`, fake timers) go in the enclosing block.
- Scenarios that share a `GIVEN` or `WHEN` sit under the same block.
- Extra outcomes in one test go in an `/* AND ... */` comment, not a second `THEN`.
- `it.each` titles keep their placeholders: `'THEN the preset applies (%s)'`.
- Coverage is collected from the `dom` project only, because merging coverage
  from two different transformers double counts statements and branches.

## Tooling scripts and package checks

- `npm run test:scripts` runs the `node:test` suites of the scripts in
  `scripts/` (exports map, peer ranges).
- `npm run verify-tarball` (after `npm run build`) checks that every target of
  the `exports` map is in the tarball and that every subpath serves sources to
  Metro, so an app can never load two copies of the theme context.
- `npm run exports:sync` regenerates the `exports` map in `package.json`
  after a folder is added under `src/components` or `src/primitives`: each
  subfolder gets a `null` target, so internal files cannot be imported
  through the wildcard subpaths. CI runs `npm run exports:check`.
- `npm run package:lint` runs `publint` and `attw` on the packed tarball.
- `npm run size` enforces the budgets in `.size-limit.json`. Raise a limit
  only together with the change that needs it, and say why in the PR.
- `npm run peers:min` installs the lowest peer versions `package.json` allows.
  It rewrites `node_modules`, so run it in CI or a throwaway checkout, then
  `npm run typecheck`.

## Pull request checklist

- [ ] `npm run typecheck` and `npm run typecheck:all` clean
- [ ] `npm run lint` clean
- [ ] `npm test` and `npm run test:scripts` green (coverage thresholds in `jest.config.js`)
- [ ] `npm run api:check` clean, or the report regenerated for an intended change
- [ ] Storybook builds (`npm run build-storybook`)
- [ ] `npm run build`, `verify-tarball`, `package:lint` and `size` pass
- [ ] Light and dark checked; works on iOS and Android
- [ ] Changeset added
- [ ] No new runtime `peerDependencies` without discussion

The pre-push hook runs the fast part of this list. The Storybook build, the
browser tests and the minimum-peer check run in CI.

## Release

Releases are automated by `changesets` via `.github/workflows/release.yml`,
which runs only after the CI workflow passed for the same commit on `main`.
Merging a `Version Packages` PR triggers the publish with npm provenance.
