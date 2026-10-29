import {
  defaultColorPalette,
  resolveColorScheme,
  type ColorPalette,
  type ColorScheme,
  type FontColor,
} from '../../src/tokens/colors';
import { bloomColorPalette } from '../../src/tokens/bloomPalette';
import { contrastRatio, WCAG_AA_TEXT_CONTRAST } from '../../src/tokens/colorUtils';
import { NON_TEXT_CONTRAST } from '../../src/tokens/controlColors';

const FONT_COLORS: readonly FontColor[] = ['default', 'warm', 'cool'];
/* Matches HIERARCHY_STEP in src/tokens/textTokens.ts. */
const HIERARCHY_STEP = 1.4;

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

function below(id: string, label: string, ratio: number, minimum: number): string[] {
  return ratio < minimum ? [`${id}: ${label} ${ratio.toFixed(2)} < ${minimum}`] : [];
}

function controlFailures(id: string, s: ColorScheme): string[] {
  const surfaces = [s.background, s.surface, s.surfaceElevated];

  return [
    ...surfaces.flatMap((bg) =>
      below(id, `controlTrack on ${bg}`, contrastRatio(s.controlTrack, bg), NON_TEXT_CONTRAST),
    ),
    ...[...surfaces, s.surfaceSecondary].flatMap((bg) =>
      below(id, `controlBorder on ${bg}`, contrastRatio(s.controlBorder, bg), NON_TEXT_CONTRAST),
    ),
    ...below(
      id,
      'onInverseSurface',
      contrastRatio(s.onInverseSurface, s.inverseSurface),
      WCAG_AA_TEXT_CONTRAST,
    ),
    ...below(
      id,
      'inversePrimaryText',
      contrastRatio(s.inversePrimaryText, s.inverseSurface),
      WCAG_AA_TEXT_CONTRAST,
    ),
  ];
}

function hierarchyFailures(id: string, s: ColorScheme): string[] {
  const secondary = contrastRatio(s.textSecondary, s.background);
  const tertiary = contrastRatio(s.textTertiary, s.background);

  return below(id, 'secondary over tertiary', secondary / tertiary, HIERARCHY_STEP - 0.05);
}

describe('control colors', () => {
  describe.each([defaultColorPalette, bloomColorPalette])(
    'GIVEN every preset, mode and font color of the $id palette',
    (palette) => {
      describe('WHEN tracks, field borders and inverse surfaces are measured', () => {
        it('THEN tracks and borders reach 3:1 and inverse text reaches AA', () => {
          const failures = allSchemes(palette).flatMap(({ id, scheme }) =>
            controlFailures(id, scheme),
          );

          expect(failures).toEqual([]);
        });
      });

      describe('WHEN the text levels are compared', () => {
        it('THEN secondary text stays a visible step above tertiary text', () => {
          const failures = allSchemes(palette).flatMap(({ id, scheme }) =>
            hierarchyFailures(id, scheme),
          );

          expect(failures).toEqual([]);
        });
      });
    },
  );

  describe('GIVEN the default dark scheme', () => {
    describe('WHEN the selected segment fill is compared with its track', () => {
      it('THEN it is lighter than the track, so the selection is visible', () => {
        const scheme = resolveColorScheme({
          isDark: true,
          preset: 'default',
          fontColor: 'default',
          highContrast: false,
          customAccent: null,
        });

        const selected = contrastRatio(scheme.surfaceSelected, scheme.background);
        const track = contrastRatio(scheme.surfaceSecondary, scheme.background);

        expect(selected).toBeGreaterThan(track);
      });
    });
  });

  describe('GIVEN the default light and dark schemes', () => {
    describe('WHEN their inverse surfaces are read', () => {
      it('THEN each uses the opposite tone', () => {
        const base = {
          preset: 'default',
          fontColor: 'default',
          highContrast: false,
          customAccent: null,
        } as const;
        const light = resolveColorScheme({ ...base, isDark: false });
        const dark = resolveColorScheme({ ...base, isDark: true });

        expect(contrastRatio(light.inverseSurface, light.background)).toBeGreaterThan(10);
        expect(contrastRatio(dark.inverseSurface, dark.background)).toBeGreaterThan(10);
      });
    });
  });
});
