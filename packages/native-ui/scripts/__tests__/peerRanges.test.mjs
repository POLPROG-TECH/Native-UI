import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { minimumPeerSpecs, minimumVersion } from '../shared/peerRanges.mjs';

describe('minimumVersion', () => {
  describe('GIVEN a plain lower bound', () => {
    describe('WHEN the minimum is read', () => {
      it('THEN the version after the operator is returned', () => {
        assert.equal(minimumVersion('>=0.84.0'), '0.84.0');
        assert.equal(minimumVersion(' >= 19.2.3 '), '19.2.3');
      });
    });
  });

  describe('GIVEN a range with no single lower bound', () => {
    describe('WHEN the minimum is read', () => {
      it('THEN it throws instead of guessing a version', () => {
        assert.throws(() => minimumVersion('^19.0.0 || ^20.0.0'), /not a plain ">=x.y.z"/);
        assert.throws(() => minimumVersion('*'), /not a plain ">=x.y.z"/);
      });
    });
  });
});

describe('minimumPeerSpecs', () => {
  describe('GIVEN required and optional peers', () => {
    describe('WHEN the install specs are built', () => {
      it('THEN only required peers are listed at their minimum version', () => {
        const specs = minimumPeerSpecs(
          { react: '>=19.2.3', 'react-native': '>=0.84.0', picker: '>=9.0.0' },
          { picker: { optional: true }, react: { optional: false } },
        );

        assert.deepEqual(specs, ['react@19.2.3', 'react-native@0.84.0']);
      });
    });
  });

  describe('GIVEN peers without any meta', () => {
    describe('WHEN the install specs are built', () => {
      it('THEN every peer is treated as required', () => {
        assert.deepEqual(minimumPeerSpecs({ react: '>=19.2.3' }), ['react@19.2.3']);
      });
    });
  });
});
