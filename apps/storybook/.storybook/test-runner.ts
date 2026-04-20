import type { TestRunnerConfig } from '@storybook/test-runner';
import { getStoryContext } from '@storybook/test-runner';
import { injectAxe, checkA11y } from 'axe-playwright';

/**
 * CI-facing accessibility enforcement.
 *
 * The Storybook a11y addon only surfaces violations interactively. This
 * test-runner hook injects axe-core into every story at `preVisit`, reads
 * per-story `parameters.a11y` overrides at `postVisit`, and fails the CI
 * job on any detected violation. Stories that legitimately need to opt
 * out can set `parameters: { a11y: { disable: true } }` in their file.
 *
 * Rules disabled by default (react-native-web false positives):
 *   - color-contrast: rn-web's color math differs from native; contrast is
 *     validated on-device, not by axe.
 *   - region: rn-web frequently portals overlays outside #storybook-root,
 *     which axe flags as "landmarkless" content.
 *
 * These are passed via `axeOptions.rules` on `axe.run` (the correct path);
 * `configureAxe`/`axe.configure` cannot disable built-in rules by id alone.
 */
const DEFAULT_DISABLED_RULES = {
  'color-contrast': { enabled: false },
  region: { enabled: false },
};

const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page);
  },
  async postVisit(page, context) {
    const storyContext = await getStoryContext(page, context);
    const a11yParams = (storyContext.parameters?.a11y ?? {}) as {
      disable?: boolean;
      options?: Parameters<typeof checkA11y>[2];
    };

    if (a11yParams.disable) return;

    const userOptions = a11yParams.options ?? {};
    const userAxeOptions = (userOptions as { axeOptions?: { rules?: Record<string, { enabled: boolean }> } }).axeOptions ?? {};

    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: { html: true },
      ...userOptions,
      axeOptions: {
        ...userAxeOptions,
        rules: {
          ...DEFAULT_DISABLED_RULES,
          ...(userAxeOptions.rules ?? {}),
        },
      },
    });
  },
};

export default config;
