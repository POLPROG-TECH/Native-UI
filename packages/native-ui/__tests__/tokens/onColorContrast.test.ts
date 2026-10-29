import {
  defaultColorPalette,
  resolveColorScheme,
  type ColorPalette,
  type ColorScheme,
} from '../../src/tokens/colors';
import { bloomColorPalette } from '../../src/tokens/bloomPalette';
import { contrastRatio, WCAG_AA_TEXT_CONTRAST } from '../../src/tokens/colorUtils';

type FillKey = 'primary' | 'success' | 'warning' | 'error' | 'info';
type OnKey = 'onPrimary' | 'onSuccess' | 'onWarning' | 'onError' | 'onInfo';

const FILL_PAIRS: ReadonlyArray<readonly [FillKey, OnKey]> = [
  ['primary', 'onPrimary'],
  ['success', 'onSuccess'],
  ['warning', 'onWarning'],
  ['error', 'onError'],
  ['info', 'onInfo'],
];

function schemesFor(palette: ColorPalette): Array<{ id: string; scheme: ColorScheme }> {
  return palette.presets.flatMap((preset) =>
    [false, true].flatMap((isDark) =>
      [false, true].map((highContrast) => ({
        id: `${palette.id}/${preset.id}`,
        scheme: resolveColorScheme(
          { isDark, preset: preset.id, fontColor: 'default', highContrast, customAccent: null },
          palette,
        ),
      })),
    ),
  );
}

describe('on-fill text contrast', () => {
  describe('GIVEN every preset x mode x contrast combination of the palette', () => {
    describe('WHEN each on-color is measured against its fill', () => {
      it.each([defaultColorPalette, bloomColorPalette])(
        'THEN no combination falls below 4.5:1 ($id)',
        (palette) => {
          const schemes = schemesFor(palette);

          const failures = schemes.flatMap(({ id, scheme }) =>
            FILL_PAIRS.map(([fill, on]) => ({
              key: `${id}/${fill}`,
              ratio: contrastRatio(scheme[on], scheme[fill]),
            })).filter(({ ratio }) => ratio < WCAG_AA_TEXT_CONTRAST),
          );

          expect(failures).toEqual([]);
        },
      );
    });
  });

  describe('GIVEN the default light scheme that used to put white on bright green', () => {
    describe('WHEN the legacy and new tokens are compared', () => {
      it('THEN both carry the same, now legible, ink', () => {
        const scheme = resolveColorScheme({
          isDark: false,
          preset: 'default',
          fontColor: 'default',
          highContrast: false,
          customAccent: null,
        });

        const { textInverse, onPrimary, primary } = scheme;

        expect(textInverse).toBe(onPrimary);
        expect(contrastRatio(onPrimary, primary)).toBeGreaterThanOrEqual(WCAG_AA_TEXT_CONTRAST);
      });
    });
  });

  describe('GIVEN the default light scheme resolved with the AAA minimum', () => {
    describe('WHEN the warning on-color is measured', () => {
      it('THEN it satisfies the stricter minimum', () => {
        const aaa = 7;
        const scheme = resolveColorScheme({
          isDark: false,
          preset: 'default',
          fontColor: 'default',
          highContrast: false,
          customAccent: null,
          minContrast: aaa,
        });

        const ratio = contrastRatio(scheme.onWarning, scheme.warning);

        expect(ratio).toBeGreaterThanOrEqual(aaa);
      });
    });
  });
});
