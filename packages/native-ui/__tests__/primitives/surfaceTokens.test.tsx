import { buildSurfaceStyle, takeSurfaceTokens } from '../../src/primitives/surfaceTokens';
import { captureTheme } from '../test-utils';

describe('buildSurfaceStyle', () => {
  describe('GIVEN spacing, color and radius shorthands', () => {
    describe('WHEN the style is built', () => {
      it('THEN each shorthand maps to its themed style value', () => {
        const theme = captureTheme();

        const style = buildSurfaceStyle(theme, { px: 'md', my: 'sm', bg: 'surface', radius: 'lg' });

        expect(style).toEqual({
          paddingHorizontal: theme.spacing.md,
          marginVertical: theme.spacing.sm,
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.lg,
        });
      });
    });
  });

  describe('GIVEN no shorthands', () => {
    describe('WHEN the style is built', () => {
      it('THEN the style is empty so it cannot override caller styles', () => {
        const theme = captureTheme();

        expect(buildSurfaceStyle(theme, {})).toEqual({});
      });
    });
  });

  describe('GIVEN flex set to zero', () => {
    describe('WHEN the style is built', () => {
      it('THEN the zero is kept', () => {
        const theme = captureTheme();

        expect(buildSurfaceStyle(theme, { flex: 0 })).toEqual({ flex: 0 });
      });
    });
  });
});

describe('takeSurfaceTokens', () => {
  describe('GIVEN shorthands mixed with View props', () => {
    describe('WHEN they are separated', () => {
      it('THEN only the View props are left to forward', () => {
        const { tokens, rest } = takeSurfaceTokens({ p: 'md', bg: 'surface', testID: 'box' });

        expect(tokens).toMatchObject({ p: 'md', bg: 'surface' });
        expect(rest).toEqual({ testID: 'box' });
      });
    });
  });
});
