import { useLocalized, type DocsLanguage } from '../../../shared/docsGlobals';
import {
  coverageLines,
  documentedExports,
  statValue,
  testsPassed,
  type LibraryStats,
} from './stats';

/** What a tile shows when the number was not measured (no stats file or Jest report). */
const NOT_MEASURED: Record<DocsLanguage, string> = { en: 'n/a', pl: 'b.d.' };

function Measured({ value }: { value: string | null }) {
  const fallback = useLocalized(NOT_MEASURED);

  return <>{value ?? fallback}</>;
}

type CountKey = {
  [Key in keyof LibraryStats]: LibraryStats[Key] extends number ? Key : never;
}[keyof LibraryStats];

/** One count from stats.json, e.g. `<StatCount of="components" />`. */
export function StatCount({ of }: { of: CountKey }) {
  return <Measured value={statValue((stats) => stats[of])} />;
}

export function TestsPassed() {
  return <Measured value={testsPassed()} />;
}

export function CoverageLines() {
  return <Measured value={coverageLines()} />;
}

export function DocumentedExports() {
  return <Measured value={documentedExports()} />;
}
