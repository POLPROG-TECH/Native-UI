import {
  resolveColorScheme,
  getContrastText,
  colors,
  THEME_PRESETS,
} from '../../src/tokens/colors';
import type { ColorScheme, ThemePreset, ResolveColorOptions } from '../../src/tokens/colors';
import { defined } from '../shared/defined';

const defaultOptions: ResolveColorOptions = {
  isDark: false,
  preset: 'default',
  fontColor: 'default',
  highContrast: false,
  customAccent: null,
};

describe('resolveColorScheme', () => {
  describe('GIVEN the default light color options', () => {
    describe('WHEN the color scheme is resolved', () => {
      it('THEN the scheme exposes background, textPrimary, primary and 10 chart colors', () => {
        const options = defaultOptions;

        const scheme = resolveColorScheme(options);

        expect(scheme.background).toBeDefined();
        expect(scheme.textPrimary).toBeDefined();
        expect(scheme.primary).toBeDefined();
        expect(scheme.chart).toHaveLength(10);
      });
    });
  });

  describe('GIVEN default options switched to dark mode', () => {
    describe('WHEN the color scheme is resolved', () => {
      it('THEN the dark scheme exposes background, textPrimary, primary and 10 chart colors', () => {
        const options = { ...defaultOptions, isDark: true };

        const scheme = resolveColorScheme(options);

        expect(scheme.background).toBeDefined();
        expect(scheme.textPrimary).toBeDefined();
        expect(scheme.primary).toBeDefined();
        expect(scheme.chart).toHaveLength(10);
      });
    });
  });

  describe('GIVEN matching option sets for light and dark modes', () => {
    describe('WHEN both schemes are resolved and their backgrounds are compared', () => {
      it('THEN the light and dark background colors differ', () => {
        const lightOptions = defaultOptions;
        const darkOptions = { ...defaultOptions, isDark: true };

        const light = resolveColorScheme(lightOptions);
        const dark = resolveColorScheme(darkOptions);

        expect(light.background).not.toBe(dark.background);
      });
    });
  });

  describe('GIVEN the full list of required ColorScheme keys', () => {
    describe('WHEN the default color scheme is resolved', () => {
      it('THEN every required key is present on the resolved scheme', () => {
        const requiredKeys: (keyof ColorScheme)[] = [
          'background',
          'surface',
          'surfaceElevated',
          'surfaceSecondary',
          'textPrimary',
          'textSecondary',
          'textTertiary',
          'textInverse',
          'primary',
          'primaryLight',
          'primaryDark',
          'success',
          'successLight',
          'warning',
          'warningLight',
          'error',
          'errorLight',
          'info',
          'border',
          'borderLight',
          'divider',
          'shadow',
          'overlay',
          'chart',
        ];

        const scheme = resolveColorScheme(defaultOptions);

        requiredKeys.forEach((key) => {
          expect(scheme).toHaveProperty(key);
        });
      });
    });
  });

  describe('GIVEN options containing a custom accent hex color', () => {
    describe('WHEN the color scheme is resolved', () => {
      it('THEN the primary color equals the provided accent', () => {
        const options = { ...defaultOptions, customAccent: '#FF5733' };

        const scheme = resolveColorScheme(options);

        expect(scheme.primary).toBe('#FF5733');
      });
    });
  });

  describe('GIVEN the full list of theme preset identifiers', () => {
    describe('WHEN each preset is resolved in both light and dark modes', () => {
      it('THEN resolving any preset does not throw', () => {
        const presetIds: ThemePreset[] = [
          'default',
          'midnight',
          'ocean',
          'forest',
          'sunset',
          'rose',
          'amoled',
        ];

        const resolveAll = () => {
          presetIds.forEach((preset) => {
            resolveColorScheme({ ...defaultOptions, preset });
            resolveColorScheme({ ...defaultOptions, preset, isDark: true });
          });
        };

        expect(resolveAll).not.toThrow();
      });
    });
  });

  describe('GIVEN a normal scheme and a high-contrast scheme built from the same options', () => {
    describe('WHEN the scheme is resolved with highContrast enabled', () => {
      it('THEN the high-contrast textPrimary differs from the normal one', () => {
        const normal = resolveColorScheme(defaultOptions);

        const highContrast = resolveColorScheme({ ...defaultOptions, highContrast: true });

        expect(highContrast.textPrimary).not.toBe(normal.textPrimary);
      });
    });
  });

  describe('GIVEN the default font color scheme used as baseline', () => {
    describe('WHEN warm and cool font color variants are resolved', () => {
      it('THEN both warm and cool textPrimary colors differ from the default', () => {
        const defaultColors = resolveColorScheme(defaultOptions);

        const warm = resolveColorScheme({ ...defaultOptions, fontColor: 'warm' });
        const cool = resolveColorScheme({ ...defaultOptions, fontColor: 'cool' });

        expect(warm.textPrimary).not.toBe(defaultColors.textPrimary);
        expect(cool.textPrimary).not.toBe(defaultColors.textPrimary);
      });
    });
  });
});

describe('getContrastText', () => {
  describe('GIVEN two light background hex values', () => {
    describe('WHEN getContrastText is called for each', () => {
      it('THEN both return the dark contrast text color', () => {
        const whiteResult = getContrastText('#FFFFFF');
        const nearWhiteResult = getContrastText('#FAFAFA');

        expect(whiteResult).toBe('#0C0C0F');
        expect(nearWhiteResult).toBe('#0C0C0F');
      });
    });
  });

  describe('GIVEN two dark background hex values', () => {
    describe('WHEN getContrastText is called for each', () => {
      it('THEN both return the light contrast text color', () => {
        const blackResult = getContrastText('#000000');
        const nearBlackResult = getContrastText('#0C0C0F');

        expect(blackResult).toBe('#F5F5F7');
        expect(nearBlackResult).toBe('#F5F5F7');
      });
    });
  });

  describe('GIVEN invalid hex strings', () => {
    describe('WHEN getContrastText is called for each', () => {
      it('THEN the fallback light contrast color is returned', () => {
        const nonHex = getContrastText('not-a-color');
        const badHex = getContrastText('#GGG');

        expect(nonHex).toBe('#F5F5F7');
        expect(badHex).toBe('#F5F5F7');
      });
    });
  });
});

describe('colors (static fallback)', () => {
  describe('GIVEN the static colors export', () => {
    describe('WHEN its light and dark entries are inspected', () => {
      it('THEN both schemes and their backgrounds are defined', () => {
        const { light, dark } = colors;

        expect(light).toBeDefined();
        expect(dark).toBeDefined();
        expect(light.background).toBeDefined();
        expect(dark.background).toBeDefined();
      });
    });

    describe('WHEN comparing light and dark backgrounds', () => {
      it('THEN the two backgrounds are not equal', () => {
        const lightBg = colors.light.background;
        const darkBg = colors.dark.background;

        expect(lightBg).not.toBe(darkBg);
      });
    });
  });
});

describe('THEME_PRESETS', () => {
  describe('GIVEN the exported THEME_PRESETS array', () => {
    describe('WHEN its length is measured', () => {
      it('THEN it contains seven entries', () => {
        const count = THEME_PRESETS.length;

        expect(count).toBe(7);
      });
    });

    describe('WHEN each preset is inspected', () => {
      it('THEN every preset exposes the required structure', () => {
        const checkPreset = (preset: (typeof THEME_PRESETS)[number]) => {
          expect(preset).toHaveProperty('id');
          expect(preset).toHaveProperty('accent');
          expect(preset).toHaveProperty('dark');
          expect(preset).toHaveProperty('light');
          expect(preset.dark).toHaveProperty('bg');
          expect(preset.dark).toHaveProperty('accent');
          expect(preset.light).toHaveProperty('bg');
          expect(preset.light).toHaveProperty('accent');
        };

        THEME_PRESETS.forEach(checkPreset);
      });
    });

    describe('WHEN the first preset is read', () => {
      it('THEN its id is "default"', () => {
        const firstId = defined(THEME_PRESETS[0], 'first preset').id;

        expect(firstId).toBe('default');
      });
    });
  });
});
