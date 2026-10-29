import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

/**
 * House style shared by every workspace in the monorepo. Each workspace keeps
 * its own `eslint.config.mjs` (file globs, globals, type-aware rules) and pulls
 * the formatting and structure rules from here, so the library and the
 * Storybook app cannot drift apart.
 */

const LOOP = 'ForStatement, ForOfStatement, ForInStatement, WhileStatement, DoWhileStatement';

/**
 * House rule: comments are block comments (`/** *\/` above declarations,
 * `/* *\/` inside code), never `//`. No core rule covers this.
 */
const noLineComments = {
  meta: {
    type: 'suggestion',
    messages: { line: 'Use a block comment (/* */ or /** */) instead of //.' },
    schema: [],
  },
  create(context) {
    return {
      Program() {
        for (const comment of context.sourceCode.getAllComments()) {
          if (comment.type === 'Line') {
            context.report({ loc: comment.loc, messageId: 'line' });
          }
        }
      },
    };
  },
};

export const housePlugin = { rules: { 'no-line-comments': noLineComments } };

export const houseRules = {
  'house/no-line-comments': 'error',
  curly: ['error', 'all'],
  /* Strict comparisons only; `== null` stays as the idiom for null or undefined. */
  eqeqeq: ['error', 'always', { null: 'ignore' }],
  'padding-line-between-statements': [
    'error',
    { blankLine: 'always', prev: '*', next: ['return', 'if'] },
    { blankLine: 'always', prev: 'block-like', next: '*' },
  ],
  'no-restricted-syntax': [
    'error',
    {
      selector: 'IfStatement > BlockStatement > IfStatement',
      message: 'Do not nest if inside if: use a guard clause or extract a helper.',
    },
    {
      selector: `:matches(${LOOP}) > BlockStatement > :matches(${LOOP})`,
      message: 'Do not nest loops: extract the inner loop into a helper.',
    },
  ],
};

/**
 * Rules that need type information (a block with `parserOptions.project`):
 * conditions and comparisons the types prove constant, unhandled union
 * members in switches, casts that hide a mismatch, and values that leak
 * `any` into typed code.
 */
export const typeAwareRules = {
  '@typescript-eslint/no-unnecessary-condition': 'error',
  '@typescript-eslint/switch-exhaustiveness-check': 'error',
  '@typescript-eslint/no-unnecessary-type-assertion': 'error',
  '@typescript-eslint/no-unsafe-type-assertion': 'error',
  '@typescript-eslint/no-unsafe-assignment': 'error',
  '@typescript-eslint/no-unsafe-member-access': 'error',
  '@typescript-eslint/no-unsafe-argument': 'error',
  '@typescript-eslint/no-unsafe-call': 'error',
  '@typescript-eslint/no-unsafe-return': 'error',
  '@typescript-eslint/no-floating-promises': 'error',
  '@typescript-eslint/prefer-nullish-coalescing': 'error',
  '@typescript-eslint/consistent-type-imports': 'error',
};

/** Ready-made flat config fragment: spread it into a block that sets `files`. */
export const houseStyle = { plugins: { house: housePlugin }, rules: houseRules };

/**
 * Config block for TS/JS files linted without type information (tests, mocks,
 * stories, tooling): house rules plus the TS-aware unused-vars rule, which
 * replaces the core rule because the core one misreads type-only usages.
 * `plugins` and `rules` extend the defaults; later keys win.
 */
export function untypedTsHouseStyle({ files, globals, plugins = {}, rules = {} }) {
  return {
    files,
    languageOptions: {
      parser: tsparser,
      /* The automatic JSX runtime needs no `React` in scope, so an unused import is reported. */
      parserOptions: { ecmaFeatures: { jsx: true }, jsxPragma: null },
      globals,
    },
    plugins: { house: housePlugin, '@typescript-eslint': tseslint, ...plugins },
    rules: {
      ...houseRules,
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      ...rules,
    },
  };
}
