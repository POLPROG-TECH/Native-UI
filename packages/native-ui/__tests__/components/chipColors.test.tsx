import { resolveChipColors } from '../../src/components/chip/chipColors';
import type { ChipVariant } from '../../src/components/Chip';
import { contrastRatio, WCAG_AA_TEXT_CONTRAST } from '../../src/tokens/colorUtils';
import { captureTheme } from '../test-utils';

describe('resolveChipColors', () => {
  describe('GIVEN an unselected chip', () => {
    describe('WHEN the colors are resolved for each variant', () => {
      it('THEN every variant uses the same neutral palette', () => {
        const theme = captureTheme();
        const variants: ChipVariant[] = ['solid', 'soft', 'outline'];

        const actual = variants.map((variant) => resolveChipColors(theme, variant, false));

        actual.forEach((colors) => {
          expect(colors).toEqual({
            background: theme.colors.surfaceSecondary,
            border: 'transparent',
            label: theme.colors.textPrimary,
          });
        });
      });
    });
  });

  describe('GIVEN a selected solid chip', () => {
    describe('WHEN the colors are resolved', () => {
      it('THEN it is filled with primary and the label contrasts with it', () => {
        const theme = captureTheme();

        const actual = resolveChipColors(theme, 'solid', true);

        expect(actual).toEqual({
          background: theme.colors.primary,
          border: 'transparent',
          label: theme.colors.onPrimary,
        });
      });
    });
  });

  describe('GIVEN a selected soft chip', () => {
    describe('WHEN the colors are resolved', () => {
      it('THEN it is tinted with primaryLight and the label is the readable accent', () => {
        const theme = captureTheme();

        const actual = resolveChipColors(theme, 'soft', true);

        expect(actual).toEqual({
          background: theme.colors.primaryLight,
          border: 'transparent',
          label: theme.colors.primaryText,
        });
        expect(contrastRatio(actual.label, actual.background)).toBeGreaterThanOrEqual(
          WCAG_AA_TEXT_CONTRAST,
        );
      });
    });
  });

  describe('GIVEN a selected outline chip', () => {
    describe('WHEN the colors are resolved', () => {
      it('THEN only the border and the label use the readable accent', () => {
        const theme = captureTheme();

        const actual = resolveChipColors(theme, 'outline', true);

        expect(actual).toEqual({
          background: 'transparent',
          border: theme.colors.primaryText,
          label: theme.colors.primaryText,
        });
      });
    });
  });
});
