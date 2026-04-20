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
5. **Changeset** - `npx changeset` (choose `patch`, `minor`, or `major`).
6. **Docs** - update `README.md` component table if applicable.

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
