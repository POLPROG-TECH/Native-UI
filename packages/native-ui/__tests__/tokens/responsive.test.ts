import { Dimensions } from 'react-native';
import { BREAKPOINTS, getBreakpoint, getResponsiveSpacing } from '../../src/tokens/responsive';
import { spacing } from '../../src/tokens/spacing';

describe('responsive tokens', () => {
  const originalGet = Dimensions.get;

  afterEach(() => {
    // Restore the original Dimensions.get after each test to avoid leaking
    // mocked window dimensions into subsequent test suites.
    (Dimensions as unknown as { get: typeof originalGet }).get = originalGet;
  });

  function mockWidth(width: number) {
    (Dimensions as unknown as { get: (which: string) => { width: number; height: number } }).get =
      () => ({ width, height: 800 });
  }

  it('should resolve to the `compact` breakpoint for phone-portrait widths', () => {
    // GIVEN a viewport narrower than the regular breakpoint
    mockWidth(380);

    // WHEN the breakpoint is resolved
    const bp = getBreakpoint();

    // THEN it is classified as compact
    expect(bp).toBe('compact');
  });

  it('should resolve to the `regular` breakpoint at the landscape-phone threshold', () => {
    // GIVEN a viewport exactly at the regular breakpoint
    mockWidth(BREAKPOINTS.regular);

    // WHEN the breakpoint is resolved
    const bp = getBreakpoint();

    // THEN it is classified as regular
    expect(bp).toBe('regular');
  });

  it('should resolve to the `expanded` breakpoint at tablet widths', () => {
    // GIVEN a viewport at or above the expanded breakpoint
    mockWidth(BREAKPOINTS.expanded);

    // WHEN the breakpoint is resolved
    const bp = getBreakpoint();

    // THEN it is classified as expanded
    expect(bp).toBe('expanded');
  });

  it('should map compact widths to the compact responsive spacing preset', () => {
    // GIVEN a compact viewport
    mockWidth(380);

    // WHEN the responsive spacing is resolved
    const rs = getResponsiveSpacing();

    // THEN it matches the compact preset mapping
    expect(rs).toEqual({
      pageHorizontal: spacing.lg,
      pageVertical: spacing.xl,
      sectionGap: spacing['2xl'],
      cardPadding: spacing.lg,
    });
  });

  it('should map regular widths to the regular responsive spacing preset', () => {
    // GIVEN a regular-sized viewport
    mockWidth(700);

    // WHEN the responsive spacing is resolved
    const rs = getResponsiveSpacing();

    // THEN it matches the regular preset mapping
    expect(rs).toEqual({
      pageHorizontal: spacing.xl,
      pageVertical: spacing['2xl'],
      sectionGap: spacing['3xl'],
      cardPadding: spacing.xl,
    });
  });

  it('should map expanded widths to the expanded responsive spacing preset', () => {
    // GIVEN an expanded-sized viewport
    mockWidth(900);

    // WHEN the responsive spacing is resolved
    const rs = getResponsiveSpacing();

    // THEN it matches the expanded preset mapping
    expect(rs).toEqual({
      pageHorizontal: spacing['3xl'],
      pageVertical: spacing['3xl'],
      sectionGap: spacing['2xl'],
      cardPadding: spacing['2xl'],
    });
  });
});
