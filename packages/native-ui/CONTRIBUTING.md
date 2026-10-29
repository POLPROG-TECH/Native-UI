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
  `__tests__/native/test-utils.tsx` and query by role or label.
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
- Extra outcomes in one test go in an `// AND ...` comment, not a second `THEN`.
- `it.each` titles keep their placeholders: `'THEN the preset applies (%s)'`.
- Coverage is collected from the `dom` project only, because merging coverage
  from two different transformers double counts statements and branches.

## Pull request checklist

- [ ] `npm run typecheck` clean
- [ ] `npm run lint` clean
- [ ] `npm test` green (no coverage regression)
- [ ] Storybook builds (`npm run build-storybook`)
- [ ] Contract test passes (`npm run audit --workspace=@polprog/native-ui`)
- [ ] Changeset added
- [ ] No new runtime `peerDependencies` without discussion

## Release

Releases are automated by `changesets` via `.github/workflows/release.yml`.
Merging a `Version Packages` PR triggers the publish with npm provenance.
