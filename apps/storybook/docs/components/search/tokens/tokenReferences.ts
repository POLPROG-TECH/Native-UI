import type { TokenKind } from '../searchTypes';

/** One token reference found in source: its family and key, not yet checked against the catalog. */
export type RawTokenRef = readonly [kind: TokenKind, key: string];

interface ReferencePattern {
  kind: TokenKind;
  /** Global pattern; the token key is the first or second capture group. */
  pattern: RegExp;
}

/*
 * Components read tokens as `colors.x`, `theme.spacing.md`, `spacing['2xl']`
 * or, for type, through the Text `variant` prop. Keys are checked against the
 * live catalog later, so a Button `variant="primary"` never counts as a
 * typography reference.
 */
const REFERENCE_PATTERNS: readonly ReferencePattern[] = [
  { kind: 'color', pattern: /\bcolors\.([A-Za-z0-9]+)/g },
  { kind: 'spacing', pattern: /\bspacing(?:\.([A-Za-z0-9]+)|\[['"]([A-Za-z0-9]+)['"]\])/g },
  { kind: 'radius', pattern: /\bborderRadius(?:\.([A-Za-z0-9]+)|\[['"]([A-Za-z0-9]+)['"]\])/g },
  { kind: 'typography', pattern: /\btypography(?:\.([A-Za-z0-9]+)|\[['"]([A-Za-z0-9]+)['"]\])/g },
  { kind: 'typography', pattern: /\bvariant=["']([A-Za-z0-9]+)["']/g },
];

function refsFor(source: string, { kind, pattern }: ReferencePattern): RawTokenRef[] {
  return [...source.matchAll(pattern)].flatMap((match) => {
    const key = match[1] ?? match[2];

    return key === undefined ? [] : [[kind, key] as const];
  });
}

/**
 * Every token-shaped reference in a source file, deduplicated. Runs both at
 * build time (the Storybook Vite plugin, so the browser never downloads the
 * library sources) and in tests.
 */
export function extractRawRefs(source: string): RawTokenRef[] {
  const seen = new Map<string, RawTokenRef>();

  REFERENCE_PATTERNS.flatMap((reference) => refsFor(source, reference)).forEach((ref) => {
    seen.set(`${ref[0]}:${ref[1]}`, ref);
  });

  return [...seen.values()];
}
