# Contributing to native-ui

Thanks for your interest in contributing! This guide covers the end-to-end
workflow: setting up the repo, making changes, writing tests, documenting,
versioning, and releasing.

## Prerequisites

- **Node.js 20+** (see `.nvmrc`)
- **npm 10+**
- Familiarity with React Native, TypeScript, and testing.

## One-time setup

```bash
git clone https://github.com/polprog-tech/native-ui.git
cd native-ui
npm install
```

## Development loop

The library lives in `packages/native-ui`. The Storybook app lives in
`apps/storybook` and renders live examples from the library's `stories/`
folder.

```bash
# Start Storybook in dev mode
npm run storybook

# Build the library (required after touching src/ when consumed via file:)
npm run build --workspace=@polprog/native-ui

# Run the library tests in watch mode
npm run test:watch --workspace=@polprog/native-ui
```

## Pull requests

1. **Fork & branch** - branch names: `feat/...`, `fix/...`, `docs/...`, `chore/...`.
2. **Code** - keep edits surgical; match the existing style.
3. **Tests** - every new component needs unit tests; every bug fix needs a
   regression test.
4. **Stories** - every new component needs a story under
   `packages/native-ui/stories/`. Run `npm run stories:check` to verify.
5. **Changeset** - run `npx changeset` and pick the semver bump
   (`patch` / `minor` / `major`). Commit the generated file.
6. **CI** - all jobs (typecheck, lint, tests, story coverage, Storybook
   build, Chromatic) must pass.

### Commit style

Commits follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(Button): add `destructive` variant
fix(Switch): correct iOS off-state track colour
docs(readme): refresh typography scale table
```

## Quality bar

Every component in `@polprog/native-ui` **must**:

- Match the iOS Human Interface Guidelines / Android Material metrics exactly (font sizes, paddings,
  corner radii, control heights). When in doubt, measure the the native platform
  counterpart.
- Be accessible: role, label, `accessibilityHint` where helpful; respect
  `reduceMotion`.
- Ship a Storybook story demonstrating every variant and state.
- Ship unit tests for core behaviour (rendering, interaction, a11y).
- Build on top of the primitive layer (`Box`, `VStack`, `HStack`, ...) rather
  than raw React Native views wherever practical.

> **Rule of thumb:** if a component is used by only one app, it belongs in
> that app. If two or more apps need it, it belongs in `native-ui`.

## Releasing

Releases are automated via [Changesets](https://github.com/changesets/changesets):

1. Contributors add `.changeset/*.md` entries in their PRs.
2. When merged, the `release` workflow opens a **Version Packages** PR that
   bumps versions and updates `CHANGELOG.md`.
3. Merging the Version Packages PR publishes to npm and pushes a tag.

Maintainers with `NPM_TOKEN` and `GITHUB_TOKEN` can trigger manual releases
with `npm run release`.

## Security

Please report security issues privately - see [`SECURITY.md`](./SECURITY.md).

## Code of conduct

Participation is governed by our [Code of Conduct](./CODE_OF_CONDUCT.md).
