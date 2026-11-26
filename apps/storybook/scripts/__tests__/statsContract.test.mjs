import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { STATS_SCHEMA_VERSION, buildStats, findStatsProblems } from '../shared/statsContract.mjs';

const inventory = {
  components: 44,
  primitives: 11,
  documented: 50,
  presets: 11,
  typeVariants: 18,
  stories: 317,
  patterns: 7,
};

const measured = {
  version: '2.0.0',
  generatedAt: '2026-10-29T19:48:21.624Z',
  inventory,
  tests: { total: 1022, passed: 1022, suites: 119 },
  coverage: { lines: 98.11, branches: 92.76, functions: 95.74, statements: 97.98 },
};

describe('buildStats', () => {
  describe('GIVEN a Jest report is available', () => {
    describe('WHEN the stats are built', () => {
      it('THEN the object carries the schema version and every measured number', () => {
        const stats = buildStats(measured);

        assert.equal(stats.schemaVersion, STATS_SCHEMA_VERSION);
        assert.equal(stats.components, inventory.components);
        assert.deepEqual(stats.tests, measured.tests);
        assert.deepEqual(stats.coverage, measured.coverage);
      });
    });
  });

  describe('GIVEN no Jest report was produced', () => {
    describe('WHEN the stats are built', () => {
      it('THEN tests and coverage are null instead of an estimate', () => {
        const stats = buildStats({ ...measured, tests: null, coverage: null });

        assert.equal(stats.tests, null);
        assert.equal(stats.coverage, null);
      });
    });
  });

  describe('GIVEN the inventory scan returned a broken number', () => {
    describe('WHEN the stats are built', () => {
      it('THEN it throws and names the field', () => {
        const broken = { ...measured, inventory: { ...inventory, stories: Number.NaN } };

        assert.throws(() => buildStats(broken), /stories: unexpected value/);
      });
    });
  });
});

describe('findStatsProblems', () => {
  describe('GIVEN a file written before the schema version existed', () => {
    describe('WHEN it is validated', () => {
      it('THEN the missing schema version is reported', () => {
        const { schemaVersion: _dropped, ...legacy } = buildStats(measured);

        assert.deepEqual(findStatsProblems(legacy), ['schemaVersion: missing or outdated']);
      });
    });
  });

  describe('GIVEN coverage outside the percent range', () => {
    describe('WHEN it is validated', () => {
      it('THEN the coverage field is reported', () => {
        const stats = { ...buildStats(measured), coverage: { ...measured.coverage, lines: 140 } };

        assert.deepEqual(findStatsProblems(stats), ['coverage.lines: unexpected value 140']);
      });
    });
  });
});
