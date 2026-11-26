import js from '@eslint/js';
import globals from 'globals';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import reactHooks from 'eslint-plugin-react-hooks';
import { houseStyle, typeAwareRules, untypedTsHouseStyle } from '../../eslint/house-style.mjs';

/**
 * Note: eslint-plugin-react 7.x and eslint-plugin-react-native 5.x are not
 * compatible with ESLint 10 (their peer ranges stop at ESLint 9, and the
 * former fails with "contextOrFilename.getFilename is not a function"). They
 * are out of the config and of the dependencies; add them back once a release
 * supports ESLint 10. React hooks rules remain via eslint-plugin-react-hooks.
 */

export default [
  {
    ignores: ['dist/**', 'lib/**', 'node_modules/**', 'coverage/**'],
  },
  js.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        __DEV__: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'react-hooks': reactHooks,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...(reactHooks.configs['recommended-latest']?.rules ?? reactHooks.configs.recommended.rules),
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-console': 'warn',
      /**
       * react-hooks 7.x adds stricter rules that flag legitimate RN Animated.Value
       * usage and mutation-via-ref patterns. Keep them off until we refactor those
       * primitives; the critical rules-of-hooks and exhaustive-deps remain active.
       */
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-render': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/unsupported-syntax': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'max-lines-per-function': [
        'error',
        { max: 30, skipBlankLines: true, skipComments: true, IIFEs: true },
      ],
      '@typescript-eslint/no-non-null-assertion': 'error',
      ...typeAwareRules,
    },
  },
  { files: ['src/**/*.{ts,tsx}'], ...houseStyle },
  /*
   * Tests, mocks, stories and tooling follow the same house style. They are
   * parsed without type information (they are outside tsconfig.build).
   */
  untypedTsHouseStyle({
    files: [
      '__tests__/**/*.{ts,tsx,js}',
      '__mocks__/**/*.js',
      'stories/**/*.{ts,tsx}',
      'scripts/**/*.mjs',
      '*.{js,mjs,ts}',
    ],
    globals: { ...globals.node, ...globals.jest, ...globals.browser, __DEV__: 'readonly' },
  }),
  {
    /* Token builders are data tables, not logic: their length is the token list. */
    files: ['src/tokens/**/*.ts'],
    rules: { 'max-lines-per-function': 'off' },
  },
];
