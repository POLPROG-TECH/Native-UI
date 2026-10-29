import { Dimensions } from 'react-native';
import { BREAKPOINTS, getBreakpoint, getResponsiveSpacing } from '../../src/tokens/responsive';
import { spacing } from '../../src/tokens/spacing';

describe('responsive tokens', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  function mockWidth(width: number) {
    jest.spyOn(Dimensions, 'get').mockReturnValue({ width, height: 800, scale: 2, fontScale: 1 });
  }

  describe('GIVEN a viewport narrower than the regular breakpoint', () => {
    describe('WHEN the breakpoint is resolved', () => {
      it('THEN it is classified as compact', () => {
        mockWidth(380);

        const bp = getBreakpoint();

        expect(bp).toBe('compact');
      });
    });
  });

  describe('GIVEN a viewport exactly at the regular breakpoint', () => {
    describe('WHEN the breakpoint is resolved', () => {
      it('THEN it is classified as regular', () => {
        mockWidth(BREAKPOINTS.regular);

        const bp = getBreakpoint();

        expect(bp).toBe('regular');
      });
    });
  });

  describe('GIVEN a viewport at or above the expanded breakpoint', () => {
    describe('WHEN the breakpoint is resolved', () => {
      it('THEN it is classified as expanded', () => {
        mockWidth(BREAKPOINTS.expanded);

        const bp = getBreakpoint();

        expect(bp).toBe('expanded');
      });
    });
  });

  describe('GIVEN a compact viewport', () => {
    describe('WHEN the responsive spacing is resolved', () => {
      it('THEN it matches the compact preset mapping', () => {
        mockWidth(380);

        const rs = getResponsiveSpacing();

        expect(rs).toEqual({
          pageHorizontal: spacing.lg,
          pageVertical: spacing.xl,
          sectionGap: spacing['2xl'],
          cardPadding: spacing.lg,
        });
      });
    });
  });

  describe('GIVEN a regular-sized viewport', () => {
    describe('WHEN the responsive spacing is resolved', () => {
      it('THEN it matches the regular preset mapping', () => {
        mockWidth(700);

        const rs = getResponsiveSpacing();

        expect(rs).toEqual({
          pageHorizontal: spacing.xl,
          pageVertical: spacing['2xl'],
          sectionGap: spacing['3xl'],
          cardPadding: spacing.xl,
        });
      });
    });
  });

  describe('GIVEN an expanded-sized viewport', () => {
    describe('WHEN the responsive spacing is resolved', () => {
      it('THEN it matches the expanded preset mapping', () => {
        mockWidth(900);

        const rs = getResponsiveSpacing();

        expect(rs).toEqual({
          pageHorizontal: spacing['3xl'],
          pageVertical: spacing['3xl'],
          sectionGap: spacing['2xl'],
          cardPadding: spacing['2xl'],
        });
      });
    });
  });
});
