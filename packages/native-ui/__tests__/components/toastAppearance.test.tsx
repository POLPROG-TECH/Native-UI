import { resolveToastColors } from '../../src/components/toast/toastAppearance';
import { captureTheme } from '../test-utils';

describe('resolveToastColors', () => {
  describe('GIVEN the default toast appearance', () => {
    describe('WHEN the toast colors are resolved', () => {
      it('THEN the toast uses the inverse surface so it stands out from content', () => {
        const theme = captureTheme({ colorMode: 'light' });

        const colors = resolveToastColors(theme);

        expect(colors).toEqual({
          surface: theme.colors.inverseSurface,
          text: theme.colors.onInverseSurface,
        });
      });
    });
  });

  describe('GIVEN the surface appearance token', () => {
    describe('WHEN the toast colors are resolved', () => {
      it('THEN the elevated card colors are used', () => {
        const theme = captureTheme({
          colorMode: 'light',
          components: { toast: { appearance: 'surface' } },
        });

        const colors = resolveToastColors(theme);

        expect(colors).toEqual({
          surface: theme.colors.surfaceElevated,
          text: theme.colors.textPrimary,
        });
      });
    });
  });
});
