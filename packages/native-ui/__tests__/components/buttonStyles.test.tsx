import { StyleSheet } from 'react-native';
import {
  buildButtonStyles,
  resolveGlowColor,
  type ButtonStyleOptions,
} from '../../src/components/button/buttonStyles';
import { captureTheme } from '../test-utils';

const baseOptions: ButtonStyleOptions = {
  variant: 'primary',
  size: 'md',
  disabled: false,
  fullWidth: false,
  glow: false,
  hasCustomBackground: false,
};

describe('buildButtonStyles', () => {
  describe('GIVEN an outline button', () => {
    describe('WHEN its styles are built', () => {
      it('THEN it has a transparent fill, a themed border and the primary text color', () => {
        const theme = captureTheme();

        const styles = buildButtonStyles(theme, { ...baseOptions, variant: 'outline' });

        expect(StyleSheet.flatten(styles.container)).toMatchObject({
          backgroundColor: 'transparent',
          borderColor: theme.colors.border,
          borderWidth: theme.components.button.outlineBorderWidth,
        });
        expect(styles.labelColor).toBe(theme.colors.textPrimary);
      });
    });
  });

  describe('GIVEN a custom background fill', () => {
    describe('WHEN its styles are built', () => {
      it('THEN the variant fill is dropped and the content is clipped', () => {
        const theme = captureTheme();

        const styles = buildButtonStyles(theme, { ...baseOptions, hasCustomBackground: true });

        expect(StyleSheet.flatten(styles.container)).toMatchObject({
          backgroundColor: 'transparent',
          overflow: 'hidden',
        });
      });
    });
  });

  describe('GIVEN a disabled glowing button', () => {
    describe('WHEN its styles are built', () => {
      it('THEN it is dimmed and the glow is suppressed', () => {
        const theme = captureTheme();

        const styles = buildButtonStyles(theme, { ...baseOptions, disabled: true, glow: true });

        expect(StyleSheet.flatten(styles.container)).toMatchObject({
          opacity: theme.opacity.disabled,
        });
        expect(styles.container).not.toContainEqual(theme.glowShadow(theme.colors.primary));
      });
    });
  });

  describe('GIVEN caller styles that clash with themed values', () => {
    describe('WHEN its styles are built', () => {
      it('THEN the caller styles win', () => {
        const theme = captureTheme();

        const styles = buildButtonStyles(theme, {
          ...baseOptions,
          style: { minHeight: 99 },
          labelStyle: { color: 'red' },
        });

        expect(StyleSheet.flatten(styles.container)).toMatchObject({ minHeight: 99 });
        expect(StyleSheet.flatten(styles.label)).toMatchObject({ color: 'red' });
      });
    });
  });
});

describe('resolveGlowColor', () => {
  describe('GIVEN an explicit glow color', () => {
    describe('WHEN the glow color is resolved', () => {
      it('THEN the explicit color is used', () => {
        const theme = captureTheme();

        expect(resolveGlowColor('#123456', 'danger', theme)).toBe('#123456');
      });
    });
  });

  describe('GIVEN glow enabled on a non-danger variant', () => {
    describe('WHEN the glow color is resolved', () => {
      it('THEN the primary color is used', () => {
        const theme = captureTheme();

        expect(resolveGlowColor(true, 'ghost', theme)).toBe(theme.colors.primary);
      });
    });
  });
});
