import {
  clampProgress,
  progressPercent,
  progressWidth,
} from '../../src/components/progressBar/progressValue';

describe('clampProgress', () => {
  describe('GIVEN values outside the 0..1 range', () => {
    describe('WHEN they are clamped', () => {
      it('THEN they are pinned to the nearest bound', () => {
        expect([clampProgress(-0.5), clampProgress(0.4), clampProgress(2)]).toEqual([0, 0.4, 1]);
      });
    });
  });
});

describe('progressPercent', () => {
  describe('GIVEN a fractional progress', () => {
    describe('WHEN it is converted', () => {
      it('THEN a rounded whole percentage is returned', () => {
        expect(progressPercent(0.426)).toBe(43);
      });
    });
  });
});

describe('progressWidth', () => {
  describe('GIVEN a fraction', () => {
    describe('WHEN it is converted', () => {
      it('THEN a percentage width string is returned', () => {
        expect(progressWidth(0.5)).toBe('50%');
      });
    });
  });
});
