import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig, type TestProjectInlineConfiguration } from 'vitest/config';
import { THEME_MATRIX, type ThemeRun } from './.storybook/globals/themeMatrix';

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Stories live both here and in `packages/native-ui/stories`. The addon
 * resolves story globs relative to `test.dir`, so it must be the monorepo
 * root or the library stories are silently skipped.
 */
const monorepoRoot = path.resolve(dirname, '../..');

/**
 * One Vitest project per theme run. Each pins preview globals with
 * `initialGlobals` (Storybook 10.5+), so every story renders, plays and is
 * axe-scanned in that theme: a contrast or layout bug that only shows in
 * dark mode, RTL or large text fails the run instead of slipping through.
 */
function themeProject(run: ThemeRun): TestProjectInlineConfiguration {
  return {
    plugins: [
      storybookTest({
        configDir: path.join(dirname, '.storybook'),
        storybookScript: 'npm run storybook -- --no-open',
        initialGlobals: run.globals,
      }),
    ],
    publicDir: path.join(dirname, 'public'),
    test: {
      name: run.project,
      dir: monorepoRoot,
      browser: {
        enabled: true,
        headless: true,
        provider: playwright({}),
        instances: [{ browser: 'chromium' }],
      },
      setupFiles: [path.join(dirname, '.storybook/vitest.setup.ts')],
    },
  };
}

export default defineConfig({
  test: {
    projects: THEME_MATRIX.map(themeProject),
  },
});
