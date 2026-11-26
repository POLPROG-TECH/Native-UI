/**
 * Shape of `generated/stats.json`. The file is published at `/stats.json`
 * next to the Storybook, and the marketing site reads it from there, so it is
 * a public contract: bump `STATS_SCHEMA_VERSION` whenever a field is removed,
 * renamed or changes meaning. Adding a field is not a breaking change.
 */
export const STATS_SCHEMA_VERSION = 1;

const INVENTORY_FIELDS = [
  'components',
  'primitives',
  'documented',
  'presets',
  'typeVariants',
  'stories',
  'patterns',
];
const TEST_FIELDS = ['total', 'passed', 'suites'];
const COVERAGE_FIELDS = ['lines', 'branches', 'functions', 'statements'];

const isCount = (value) => Number.isInteger(value) && value >= 0;
const isPercent = (value) => typeof value === 'number' && value >= 0 && value <= 100;

function fieldProblems(owner, record, fields, isValid) {
  return fields
    .filter((field) => !isValid(record[field]))
    .map((field) => `${owner}${field}: unexpected value ${JSON.stringify(record[field])}`);
}

/** A group that is `null` when it was not measured (no Jest report on disk). */
function optionalGroupProblems(name, group, fields, isValid) {
  if (group === null) {
    return [];
  }

  if (typeof group !== 'object') {
    return [`${name}: expected an object or null`];
  }

  return fieldProblems(`${name}.`, group, fields, isValid);
}

export function findStatsProblems(stats) {
  const header = [
    stats.schemaVersion === STATS_SCHEMA_VERSION ? null : 'schemaVersion: missing or outdated',
    typeof stats.version === 'string' && stats.version.length > 0 ? null : 'version: missing',
    Number.isNaN(Date.parse(stats.generatedAt)) ? 'generatedAt: not an ISO date' : null,
  ].filter(Boolean);

  return [
    ...header,
    ...fieldProblems('', stats, INVENTORY_FIELDS, isCount),
    ...optionalGroupProblems('tests', stats.tests, TEST_FIELDS, isCount),
    ...optionalGroupProblems('coverage', stats.coverage, COVERAGE_FIELDS, isPercent),
  ];
}

export function buildStats({ version, generatedAt, inventory, tests, coverage }) {
  const stats = {
    schemaVersion: STATS_SCHEMA_VERSION,
    version,
    generatedAt,
    ...inventory,
    tests,
    coverage,
  };
  const problems = findStatsProblems(stats);

  if (problems.length > 0) {
    throw new Error(`stats.json would break its contract:\n  ${problems.join('\n  ')}`);
  }

  return stats;
}
