import type { NativeUIConfig } from '@polprog/native-ui';
import type { ResultKind, TokenKind } from './searchTypes';

/** Order of the result groups on the page. */
export const RESULT_GROUP_ORDER: readonly ResultKind[] = [
  'color',
  'spacing',
  'radius',
  'typography',
  'component',
];

/** Theme object each token family is read from, which is also its path prefix in code. */
export const TOKEN_PATH_PREFIX: Record<TokenKind, string> = {
  color: 'colors',
  spacing: 'spacing',
  radius: 'borderRadius',
  typography: 'typography',
};

/**
 * Storybook titles of the token reference pages, most specific first. The
 * first title present in the index wins, so renaming one page only needs an
 * entry here.
 */
export const TOKEN_DOCS_TITLES: Record<TokenKind, readonly string[]> = {
  color: ['Tokens/Colors'],
  spacing: ['Tokens/Spacing', 'Tokens/Spacing & Radii'],
  radius: ['Tokens/Radius & Elevation', 'Tokens/Spacing & Radii'],
  typography: ['Tokens/Typography'],
};

/** Sidebar sections whose docs pages are listed as components. */
export const COMPONENT_SECTIONS: readonly string[] = ['Components', 'Primitives'];

/**
 * Providers the token values are resolved through: the library defaults
 * (Aurora variant, default preset) in each color mode.
 */
export const THEME_CONFIG: Record<'light' | 'dark', NativeUIConfig> = {
  light: { colorMode: 'light' },
  dark: { colorMode: 'dark' },
};

/** Storybook endpoints, relative to the preview iframe so a sub-path deploy keeps working. */
export const STORYBOOK_URLS = {
  index: './index.json',
  /* Resolved against the iframe URL, then opened in the manager (target _top). */
  docsPage: (id: string): string => `./?path=/docs/${id}`,
} as const;

/** Queries offered as one-click starting points in the empty state. */
export const SUGGESTED_QUERIES: readonly string[] = [
  'primary',
  'surface',
  'error',
  'md',
  'body',
  'Button',
];

export const SEARCH_LIMITS = {
  /** Results shown per group before the "refine your query" note. */
  maxHitsPerGroup: 24,
  /** Matched-token chips shown on a component row before the "+N" chip. */
  maxTokenChips: 4,
  /** How long a copy button shows its confirmation. */
  copyFeedbackMs: 1600,
} as const;

/** Upper bounds for the visual previews, so large tokens do not stretch the row. */
export const PREVIEW_LIMITS = {
  spacingBarPx: 56,
  radiusPx: 16,
  typeSamplePx: 30,
} as const;

/**
 * Relevance weights. A name match always outranks a value match, and a
 * component matched by name outranks one matched through a token it uses.
 */
export const SCORE_WEIGHTS = {
  exact: 100,
  prefix: 80,
  wordStart: 60,
  substring: 30,
  valueExact: 70,
  valuePrefix: 40,
  componentViaToken: 20,
} as const;
