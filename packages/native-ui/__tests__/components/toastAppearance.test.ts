import {
  buildToastSurfaceStyle,
  resolveAccent,
  resolveEdgeStyle,
  resolveToastColors,
} from '../../src/components/toast/toastAppearance';
import type { ToastVariant } from '../../src/components/toast/toastStore';
import { captureTheme } from '../test-utils';

const NO_INSETS = { top: 0, bottom: 0, left: 0, right: 0 };

describe('toastAppearance', () => {
  describe('GIVEN each toast variant', () => {
    describe('WHEN the accent is resolved', () => {
      it('THEN it is the matching theme color', () => {
        const theme = captureTheme();
        const expected: Record<ToastVariant, string> = {
          default: theme.colors.primary,
          success: theme.colors.success,
          warning: theme.colors.warning,
          error: theme.colors.error,
          info: theme.colors.info,
        };

        for (const variant of Object.keys(expected) as ToastVariant[]) {
          expect(resolveAccent(variant, theme)).toBe(expected[variant]);
        }
      });
    });

    describe('WHEN an accent override is passed', () => {
      it('THEN the override wins over the variant color', () => {
        expect(resolveAccent('error', captureTheme(), '#112233')).toBe('#112233');
      });
    });
  });

  describe('GIVEN a device without safe-area insets', () => {
    describe('WHEN a top toast is positioned', () => {
      it('THEN it keeps the minimum edge inset plus the offset', () => {
        const theme = captureTheme();
        const { minEdgeInset } = theme.components.toast;

        expect(resolveEdgeStyle('top', NO_INSETS, theme, 8)).toEqual({ top: minEdgeInset + 8 });
      });
    });
  });

  describe('GIVEN a device with a home indicator', () => {
    describe('WHEN a bottom toast is positioned', () => {
      it('THEN it clears the safe area instead of the smaller minimum', () => {
        const theme = captureTheme();
        const bottom = theme.components.toast.minEdgeInset + 18;

        expect(resolveEdgeStyle('bottom', { ...NO_INSETS, bottom }, theme, 0)).toEqual({ bottom });
      });
    });
  });

  describe('GIVEN the inverse toast appearance', () => {
    describe('WHEN the card colors are resolved', () => {
      it('THEN the card uses the inverse surface and its readable ink', () => {
        const theme = captureTheme({
          colorMode: 'light',
          components: { toast: { appearance: 'inverse' } },
        });

        expect(resolveToastColors(theme)).toEqual({
          surface: theme.colors.inverseSurface,
          text: theme.colors.onInverseSurface,
        });
      });
    });
  });

  describe('GIVEN the surface toast appearance', () => {
    describe('WHEN the card is styled', () => {
      it('THEN it sits on the elevated surface with the accent on its edge', () => {
        const theme = captureTheme({
          colorMode: 'light',
          components: { toast: { appearance: 'surface' } },
        });
        const style = buildToastSurfaceStyle(theme, theme.colors.success);

        expect(resolveToastColors(theme)).toEqual({
          surface: theme.colors.surfaceElevated,
          text: theme.colors.textPrimary,
        });
        expect(style.borderLeftColor).toBe(theme.colors.success);
        expect(style.backgroundColor).toBe(theme.colors.surfaceElevated);
      });
    });
  });
});
