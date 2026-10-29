import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import { typeAwareRules, untypedTsHouseStyle } from '../../eslint/house-style.mjs';

/**
 * Storybook config, mocks, stories and tooling. Parsed without type
 * information: `tsc -p tsconfig.json` already type-checks them, and the
 * tsconfig also pulls in library sources that are linted by their own package.
 */
export default [
  {
    ignores: ['storybook-static/**', 'public/**', 'node_modules/**'],
  },
  js.configs.recommended,
  untypedTsHouseStyle({
    files: [
      '.storybook/**/*.{ts,tsx}',
      'stories/**/*.{ts,tsx}',
      'docs/**/*.{ts,tsx}',
      'shared/**/*.{ts,tsx}',
      'scripts/**/*.mjs',
      '*.{mjs,ts}',
    ],
    globals: { ...globals.browser, ...globals.node },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...(reactHooks.configs['recommended-latest']?.rules ?? reactHooks.configs.recommended.rules),
    },
  }),
  {
    /*
     * Type-aware checks on the TypeScript sources, matching the library:
     * conditions and comparisons the types prove constant, unhandled union
     * members in switches, casts that hide a mismatch and leaked `any`.
     */
    files: [
      '.storybook/**/*.{ts,tsx}',
      'stories/**/*.{ts,tsx}',
      'docs/**/*.{ts,tsx}',
      'shared/**/*.{ts,tsx}',
      '*.ts',
    ],
    /* `fonts.d.ts` sits next to `fonts.ts`, so TypeScript leaves it out of the program. */
    ignores: ['**/*.d.ts'],
    languageOptions: {
      parserOptions: { project: './tsconfig.json', tsconfigRootDir: import.meta.dirname },
    },
    rules: typeAwareRules,
  },
  {
    /*
     * The demo fetch hook resets to `loading` when its request key changes,
     * the plain un-cached fetch pattern the MSW stories are meant to show.
     * Deriving that state during render instead would change the states the
     * hook reports (no initial `idle` render). The library turns this rule
     * off for a similar reason; here it stays on everywhere else.
     */
    files: ['.storybook/msw/hooks.ts'],
    rules: { 'react-hooks/set-state-in-effect': 'off' },
  },
];
