import js from '@eslint/js';
import globals from 'globals';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import reactHooks from 'eslint-plugin-react-hooks';

// Note: eslint-plugin-react 7.x is not yet compatible with ESLint 10's
// rule context API (fails with "contextOrFilename.getFilename is not a function").
// Dropped from the config until upstream releases an ESLint 10-compatible version.
// React hooks rules remain via eslint-plugin-react-hooks 7.x which is compatible.

export default [
  {
    ignores: [
      'dist/**',
      'lib/**',
      'node_modules/**',
      'coverage/**',
      'scripts/**',
      '__mocks__/**',
      '__tests__/**',
      'stories/**',
      'jest.config.js',
      'jest.setup.js',
    ],
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
      // react-hooks 7.x adds stricter rules that flag legitimate RN Animated.Value
      // usage and mutation-via-ref patterns. Keep them off until we refactor those
      // primitives; the critical rules-of-hooks and exhaustive-deps remain active.
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-render': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/unsupported-syntax': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
];

