import {
  resolveColorScheme,
  getContrastText,
  colors,
  THEME_PRESETS,
} from '../../src/tokens/colors';
import type { ColorScheme, ThemePreset, ResolveColorOptions } from '../../src/tokens/colors';

const defaultOptions: ResolveColorOptions = {
  isDark: false,
  preset: 'default',
  fontColor: 'default',
  highContrast: false,
  customAccent: null,
};

describe('resolveColorScheme', () => {
  it('should return light scheme with core tokens when resolved with default options', () => {
    // GIVEN the default light color options
    const options = defaultOptions;

    // WHEN the color scheme is resolved
    const scheme = resolveColorScheme(options);

    // THEN the scheme exposes background, textPrimary, primary and 10 chart colors
    expect(scheme.background).toBeDefined();
    expect(scheme.textPrimary).toBeDefined();
    expect(scheme.primary).toBeDefined();
    expect(scheme.chart).toHaveLength(10);
  });

  it('should return dark scheme with core tokens when isDark is true', () => {
    // GIVEN default options switched to dark mode
    const options = { ...defaultOptions, isDark: true };

    // WHEN the color scheme is resolved
    const scheme = resolveColorScheme(options);

    // THEN the dark scheme exposes background, textPrimary, primary and 10 chart colors
    expect(scheme.background).toBeDefined();
    expect(scheme.textPrimary).toBeDefined();
    expect(scheme.primary).toBeDefined();
    expect(scheme.chart).toHaveLength(10);
  });

  it('should produce different backgrounds when resolving light vs dark schemes', () => {
    // GIVEN matching option sets for light and dark modes
    const lightOptions = defaultOptions;
    const darkOptions = { ...defaultOptions, isDark: true };

    // WHEN both schemes are resolved and their backgrounds are compared
    const light = resolveColorScheme(lightOptions);
    const dark = resolveColorScheme(darkOptions);

    // THEN the light and dark background colors differ
    expect(light.background).not.toBe(dark.background);
  });

  it('should include every required ColorScheme key when resolved', () => {
    // GIVEN the full list of required ColorScheme keys
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

    // WHEN the default color scheme is resolved
    const scheme = resolveColorScheme(defaultOptions);

    // THEN every required key is present on the resolved scheme
    requiredKeys.forEach((key) => {
      expect(scheme).toHaveProperty(key);
    });
  });

  it('should apply custom accent as primary color when customAccent is provided', () => {
    // GIVEN options containing a custom accent hex color
    const options = { ...defaultOptions, customAccent: '#FF5733' };

    // WHEN the color scheme is resolved
    const scheme = resolveColorScheme(options);

    // THEN the primary color equals the provided accent
    expect(scheme.primary).toBe('#FF5733');
  });

  it('should resolve every theme preset without throwing for both modes', () => {
    // GIVEN the full list of theme preset identifiers
    const presetIds: ThemePreset[] = [
      'default',
      'midnight',
      'ocean',
      'forest',
      'sunset',
      'rose',
      'amoled',
    ];

    // WHEN each preset is resolved in both light and dark modes
    const resolveAll = () => {
      presetIds.forEach((preset) => {
        resolveColorScheme({ ...defaultOptions, preset });
        resolveColorScheme({ ...defaultOptions, preset, isDark: true });
      });
    };

    // THEN resolving any preset does not throw
    expect(resolveAll).not.toThrow();
  });

  it('should produce different textPrimary when highContrast mode is enabled', () => {
    // GIVEN a normal scheme and a high-contrast scheme built from the same options
    const normal = resolveColorScheme(defaultOptions);

    // WHEN the scheme is resolved with highContrast enabled
    const highContrast = resolveColorScheme({ ...defaultOptions, highContrast: true });

    // THEN the high-contrast textPrimary differs from the normal one
    expect(highContrast.textPrimary).not.toBe(normal.textPrimary);
  });

  it('should apply font color variants when warm or cool is selected', () => {
    // GIVEN the default font color scheme used as baseline
    const defaultColors = resolveColorScheme(defaultOptions);

    // WHEN warm and cool font color variants are resolved
    const warm = resolveColorScheme({ ...defaultOptions, fontColor: 'warm' });
    const cool = resolveColorScheme({ ...defaultOptions, fontColor: 'cool' });

    // THEN both warm and cool textPrimary colors differ from the default
    expect(warm.textPrimary).not.toBe(defaultColors.textPrimary);
    expect(cool.textPrimary).not.toBe(defaultColors.textPrimary);
  });
});

describe('getContrastText', () => {
  it('should return dark text when background is light', () => {
    // GIVEN two light background hex values

    // WHEN getContrastText is called for each
    const whiteResult = getContrastText('#FFFFFF');
    const nearWhiteResult = getContrastText('#FAFAFA');

    // THEN both return the dark contrast text color
    expect(whiteResult).toBe('#0C0C0F');
    expect(nearWhiteResult).toBe('#0C0C0F');
  });

  it('should return light text when background is dark', () => {
    // GIVEN two dark background hex values

    // WHEN getContrastText is called for each
    const blackResult = getContrastText('#000000');
    const nearBlackResult = getContrastText('#0C0C0F');

    // THEN both return the light contrast text color
    expect(blackResult).toBe('#F5F5F7');
    expect(nearBlackResult).toBe('#F5F5F7');
  });

  it('should return light text fallback when hex value is invalid', () => {
    // GIVEN invalid hex strings

    // WHEN getContrastText is called for each
    const nonHex = getContrastText('not-a-color');
    const badHex = getContrastText('#GGG');

    // THEN the fallback light contrast color is returned
    expect(nonHex).toBe('#F5F5F7');
    expect(badHex).toBe('#F5F5F7');
  });
});

describe('colors (static fallback)', () => {
  it('should expose preresolved light and dark schemes with backgrounds', () => {
    // GIVEN the static colors export

    // WHEN its light and dark entries are inspected
    const { light, dark } = colors;

    // THEN both schemes and their backgrounds are defined
    expect(light).toBeDefined();
    expect(dark).toBeDefined();
    expect(light.background).toBeDefined();
    expect(dark.background).toBeDefined();
  });

  it('should use different backgrounds for static light and dark schemes', () => {
    // GIVEN the static colors export

    // WHEN comparing light and dark backgrounds
    const lightBg = colors.light.background;
    const darkBg = colors.dark.background;

    // THEN the two backgrounds are not equal
    expect(lightBg).not.toBe(darkBg);
  });
});

describe('THEME_PRESETS', () => {
  it('should contain exactly seven theme presets', () => {
    // GIVEN the exported THEME_PRESETS array

    // WHEN its length is measured
    const count = THEME_PRESETS.length;

    // THEN it contains seven entries
    expect(count).toBe(7);
  });

  it('should define id accent dark and light structure on every preset', () => {
    // GIVEN the exported THEME_PRESETS array

    // WHEN each preset is inspected
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

    // THEN every preset exposes the required structure
    THEME_PRESETS.forEach(checkPreset);
  });

  it('should list default preset as the first entry', () => {
    // GIVEN the exported THEME_PRESETS array

    // WHEN the first preset is read
    const firstId = THEME_PRESETS[0]!.id;

    // THEN its id is "default"
    expect(firstId).toBe('default');
  });
});
