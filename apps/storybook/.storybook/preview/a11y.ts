import type { A11yParameters } from '@storybook/addon-a11y';

/** Project-wide addon-a11y parameters. */
export const A11Y_PARAMETERS: A11yParameters = {
  /**
   * `error` fails the Vitest run (locally and in CI) on any violation;
   * a story or file can opt down to `'todo'` (warning only) or `'off'`.
   */
  test: 'error',
  /*
   * Rule toggles live in `options.rules` as an object, not in
   * `config.rules`: Storybook merges parameter objects per story but
   * replaces arrays, so a story's own array would drop every rule below.
   *
   * Disabled for react-native-web false positives; component unit tests
   * cover the labels and roles these would check:
   * - region: rn-web portals overlays outside the story root.
   * - aria-required-attr / aria-prohibited-attr / aria-allowed-role:
   *   rn-web maps accessibilityRole to ARIA heuristically.
   * - aria-progressbar-name / aria-toggle-field-name / label: rn-web
   *   does not always forward accessibilityLabel to the attribute axe
   *   reads for these roles.
   * - nested-interactive: a Pressable inside a Pressable (list rows
   *   with trailing actions) becomes nested buttons in the DOM.
   */
  options: {
    rules: {
      region: { enabled: false },
      'aria-required-attr': { enabled: false },
      'aria-prohibited-attr': { enabled: false },
      'aria-allowed-role': { enabled: false },
      'aria-progressbar-name': { enabled: false },
      'aria-toggle-field-name': { enabled: false },
      label: { enabled: false },
      'nested-interactive': { enabled: false },
    },
  },
};
