import {
  statTileValueColor,
  statTileValueVariant,
} from '../../src/components/statTile/statTileValue';

describe('statTileValueVariant', () => {
  describe('GIVEN mono figures', () => {
    describe('WHEN each size is resolved', () => {
      it('THEN the mono typography scale is used', () => {
        const variants = (['sm', 'md', 'lg'] as const).map((size) =>
          statTileValueVariant(size, true),
        );

        expect(variants).toEqual(['monoSmall', 'mono', 'monoLarge']);
      });
    });
  });

  describe('GIVEN proportional figures', () => {
    describe('WHEN each size is resolved', () => {
      it('THEN the heading typography scale is used', () => {
        const variants = (['sm', 'md', 'lg'] as const).map((size) =>
          statTileValueVariant(size, false),
        );

        expect(variants).toEqual(['title', 'h3', 'h2']);
      });
    });
  });
});

describe('statTileValueColor', () => {
  describe('GIVEN the neutral tone', () => {
    describe('WHEN its color is resolved', () => {
      it('THEN the primary text color is used', () => {
        expect(statTileValueColor('neutral')).toBe('textPrimary');
      });
    });
  });

  describe('GIVEN a semantic tone', () => {
    describe('WHEN its color is resolved', () => {
      it('THEN the readable text variant of the semantic color is used', () => {
        expect(statTileValueColor('warning')).toBe('warningText');
      });
    });
  });
});
