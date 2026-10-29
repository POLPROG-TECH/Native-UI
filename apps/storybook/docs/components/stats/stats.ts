/**
 * Library numbers for the docs pages, generated from the repository by
 * scripts/generate-stats.mjs (run before `storybook dev` and `build`).
 * `import.meta.glob` keeps a missing file from breaking the build or the
 * type check; every number then reads "n/a" instead of a guess.
 */
export interface TestStats {
  total: number;
  passed: number;
  suites: number;
}

export interface CoverageStats {
  lines: number;
  branches: number;
  functions: number;
  statements: number;
}

export interface LibraryStats {
  version: string;
  generatedAt: string;
  components: number;
  primitives: number;
  documented: number;
  presets: number;
  typeVariants: number;
  stories: number;
  patterns: number;
  tests: TestStats | null;
  coverage: CoverageStats | null;
}

const files = import.meta.glob<{ default: unknown }>('../../../generated/stats.json', {
  eager: true,
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isLibraryStats(value: unknown): value is LibraryStats {
  const numeric = [
    'components',
    'primitives',
    'documented',
    'presets',
    'typeVariants',
    'stories',
    'patterns',
  ];

  return (
    isRecord(value) &&
    typeof value.version === 'string' &&
    numeric.every((key) => typeof value[key] === 'number')
  );
}

function loadStats(): LibraryStats | null {
  const raw = Object.values(files)[0]?.default;

  return isLibraryStats(raw) ? raw : null;
}

export const STATS = loadStats();

/*
 * The text helpers return null when a number was not measured; StatText.tsx
 * turns that into "n/a" / "b.d." in the docs language.
 */

/** A whole number from the stats, or null when the stats file is missing. */
export function statValue(pick: (stats: LibraryStats) => number): string | null {
  return STATS ? String(pick(STATS)) : null;
}

export function testsPassed(): string | null {
  return STATS?.tests ? `${STATS.tests.passed} / ${STATS.tests.total}` : null;
}

/** Health line under the test count; wording comes from the caller's language. */
export type TestsHealth =
  { kind: 'not-measured' } | { kind: 'green' } | { kind: 'failing'; count: number };

export function testsHealth(): TestsHealth {
  const tests = STATS?.tests;

  if (!tests) {
    return { kind: 'not-measured' };
  }

  return tests.passed === tests.total
    ? { kind: 'green' }
    : { kind: 'failing', count: tests.total - tests.passed };
}

export function coverageLines(): string | null {
  return STATS?.coverage ? `${STATS.coverage.lines.toFixed(1)}%` : null;
}

export function documentedExports(): string | null {
  return STATS ? `${STATS.documented} / ${STATS.components + STATS.primitives}` : null;
}

/** Line coverage as a CSS width, for the coverage bar; empty when not measured. */
export function coverageWidth(): string {
  return STATS?.coverage ? `${STATS.coverage.lines}%` : '0%';
}
