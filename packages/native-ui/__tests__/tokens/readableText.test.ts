import {
  defaultColorPalette,
  resolveColorScheme,
  type ColorPalette,
  type ColorScheme,
  type FontColor,
} from '../../src/tokens/colors';
import { bloomColorPalette } from '../../src/tokens/bloomPalette';
import { contrastRatio, ensureReadable, WCAG_AA_TEXT_CONTRAST } from '../../src/tokens/colorUtils';

type TextKey = 'textPrimary' | 'textSecondary' | 'textTertiary' | 'primaryText';

const TEXT_KEYS: readonly TextKey[] = [
  'textPrimary',
  'textSecondary',
  'textTertiary',
  'primaryText',
];
const FONT_COLORS: readonly FontColor[] = ['default', 'warm', 'cool'];

function surfacesOf(scheme: ColorScheme): string[] {
  return [scheme.background, scheme.surface, scheme.surfaceElevated, scheme.surfaceSecondary];
}

function allSchemes(palette: ColorPalette): Array<{ id: string; scheme: ColorScheme }> {
  return palette.presets.flatMap((preset) =>
    [false, true].flatMap((isDark) =>
      FONT_COLORS.map((fontColor) => ({
        id: `${palette.id}/${preset.id}/${isDark ? 'dark' : 'light'}/${fontColor}`,
        scheme: resolveColorScheme(
          { isDark, preset: preset.id, fontColor, highContrast: false, customAccent: null },
          palette,
        ),
      })),
    ),
  );
}

function failuresOf(id: string, scheme: ColorScheme): string[] {
  return TEXT_KEYS.flatMap((key) =>
    surfacesOf(scheme)
      .filter((surface) => contrastRatio(scheme[key], surface) < WCAG_AA_TEXT_CONTRAST)
      .map((surface) => `${id}: ${key} ${scheme[key]} on ${surface}`),
  );
}

describe('ensureReadable', () => {
  describe('GIVEN a color that already meets the minimum on every surface', () => {
    describe('WHEN it is made readable', () => {
      it('THEN it is returned unchanged', () => {
        const color = '#1C1C1E';

        const result = ensureReadable(color, ['#FFFFFF', '#FAFAFA']);

        expect(result).toBe(color);
      });
    });
  });

  describe('GIVEN the bright default accent on white', () => {
    describe('WHEN it is made readable', () => {
      it('THEN a darker shade that reaches AA is returned', () => {
        const result = ensureReadable('#00E67A', ['#FFFFFF']);

        expect(result).not.toBe('#00E67A');
        expect(contrastRatio(result, '#FFFFFF')).toBeGreaterThanOrEqual(WCAG_AA_TEXT_CONTRAST);
      });
    });
  });

  describe('GIVEN a dim gray on a near-black surface', () => {
    describe('WHEN it is made readable', () => {
      it('THEN it is lightened rather than darkened', () => {
        const result = ensureReadable('#636366', ['#0C0C0F']);

        expect(contrastRatio(result, '#0C0C0F')).toBeGreaterThanOrEqual(WCAG_AA_TEXT_CONTRAST);
        expect(contrastRatio(result, '#FFFFFF')).toBeLessThan(contrastRatio('#636366', '#FFFFFF'));
      });
    });
  });

  describe('GIVEN a stricter configurable minimum', () => {
    describe('WHEN a color is made readable for AAA', () => {
      it('THEN the result reaches that minimum', () => {
        const aaa = 7;

        const result = ensureReadable('#636366', ['#FFFFFF'], aaa);

        expect(contrastRatio(result, '#FFFFFF')).toBeGreaterThanOrEqual(aaa);
      });
    });
  });

  describe('GIVEN input that cannot be measured', () => {
    describe('WHEN it is made readable', () => {
      it('THEN it is returned unchanged', () => {
        const result = ensureReadable('rgba(0,0,0,0.5)', ['#FFFFFF']);

        expect(result).toBe('rgba(0,0,0,0.5)');
      });
    });
  });
});

describe('readable text tokens', () => {
  describe.each([defaultColorPalette, bloomColorPalette])(
    'GIVEN every preset, mode and font color of the $id palette',
    (palette) => {
      describe('WHEN text and accent-text colors are measured on every surface', () => {
        it('THEN all of them meet WCAG AA', () => {
          const failures = allSchemes(palette).flatMap(({ id, scheme }) => failuresOf(id, scheme));

          expect(failures).toEqual([]);
        });
      });
    },
  );

  describe('GIVEN the default light scheme', () => {
    describe('WHEN the accent text is measured on the accent tint', () => {
      it('THEN secondary buttons and soft chips stay readable', () => {
        const scheme = resolveColorScheme({
          isDark: false,
          preset: 'default',
          fontColor: 'default',
          highContrast: false,
          customAccent: null,
        });

        const ratio = contrastRatio(scheme.primaryText, scheme.primaryLight);

        expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_TEXT_CONTRAST);
      });
    });
  });

  describe('GIVEN the default dark scheme where the accent is already readable', () => {
    describe('WHEN the accent text is resolved', () => {
      it('THEN it equals the accent itself', () => {
        const scheme = resolveColorScheme({
          isDark: true,
          preset: 'default',
          fontColor: 'default',
          highContrast: false,
          customAccent: null,
        });

        expect(scheme.primaryText).toBe(scheme.primary);
      });
    });
  });
});
