import { resolveDotAppearance } from '../../src/primitives/paginationDots/PaginationDot';
import { captureTheme } from '../test-utils';

describe('resolveDotAppearance', () => {
  describe('GIVEN no overrides', () => {
    describe('WHEN the appearance is resolved', () => {
      it('THEN token sizes, theme colors and animation are used', () => {
        const theme = captureTheme({ colorMode: 'light' });
        const tokens = theme.components.paginationDots;

        const appearance = resolveDotAppearance(theme, {});

        expect(appearance).toEqual({
          dotWidth: tokens.dotWidth,
          activeWidth: tokens.activeWidth,
          height: tokens.height,
          color: theme.colors.border,
          activeColor: theme.colors.primary,
          durationMs: tokens.durationMs,
          animated: true,
        });
      });
    });
  });

  describe('GIVEN a theme that reduces animations', () => {
    describe('WHEN the caller asks for animation', () => {
      it('THEN animation stays off', () => {
        const theme = captureTheme({ colorMode: 'light', reduceAnimations: true });

        expect(resolveDotAppearance(theme, { animated: true }).animated).toBe(false);
      });
    });
  });
});
