import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import { untypedTsHouseStyle } from '../../eslint/house-style.mjs';

/**
 * Example app sources and config. Parsed without type information:
 * `tsc -p tsconfig.json` already type-checks them.
 */
export default [
  {
    ignores: ['ios/**', 'android/**', '.expo/**', 'node_modules/**'],
  },
  js.configs.recommended,
  untypedTsHouseStyle({
    files: ['src/**/*.{ts,tsx}', '*.{ts,js,mjs}'],
    globals: { ...globals.node, __DEV__: 'readonly' },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...(reactHooks.configs['recommended-latest']?.rules ?? reactHooks.configs.recommended.rules),
    },
  }),
];
