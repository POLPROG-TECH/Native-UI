import { formatBadge, shouldRenderBadge } from '../../src/components/bottomTabBar/tabBadge';

const overflow = (max: number) => `${max}+`;

describe('shouldRenderBadge', () => {
  describe('GIVEN empty-state badge values', () => {
    describe('WHEN visibility is evaluated', () => {
      it('THEN undefined, zero, negatives and empty strings are hidden', () => {
        const visible = [undefined, 0, -1, ''].map(shouldRenderBadge);

        expect(visible).toEqual([false, false, false, false]);
      });
    });
  });

  describe('GIVEN a positive count or non-empty text', () => {
    describe('WHEN visibility is evaluated', () => {
      it('THEN the badge renders', () => {
        const visible = [1, 'new'].map(shouldRenderBadge);

        expect(visible).toEqual([true, true]);
      });
    });
  });
});

describe('formatBadge', () => {
  describe('GIVEN a count above the maximum', () => {
    describe('WHEN it is formatted', () => {
      it('THEN the overflow label is used', () => {
        expect(formatBadge(120, 99, overflow)).toBe('99+');
      });
    });
  });

  describe('GIVEN a count at the maximum or a text badge', () => {
    describe('WHEN they are formatted', () => {
      it('THEN they are shown verbatim', () => {
        expect([formatBadge(99, 99, overflow), formatBadge('new', 99, overflow)]).toEqual([
          '99',
          'new',
        ]);
      });
    });
  });
});
