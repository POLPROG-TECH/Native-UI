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
  it('should_return_light_scheme_with_core_tokens_when_resolved_with_default_options', () => {
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

  it('should_return_dark_scheme_with_core_tokens_when_isDark_is_true', () => {
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

  it('should_produce_different_backgrounds_when_resolving_light_vs_dark_schemes', () => {
    // GIVEN matching option sets for light and dark modes
    const lightOptions = defaultOptions;
    const darkOptions = { ...defaultOptions, isDark: true };

    // WHEN both schemes are resolved and their backgrounds are compared
    const light = resolveColorScheme(lightOptions);
    const dark = resolveColorScheme(darkOptions);

    // THEN the light and dark background colors differ
    expect(light.background).not.toBe(dark.background);
  });

  it('should_include_every_required_ColorScheme_key_when_resolved', () => {
    // GIVEN the full list of required ColorScheme keys
    const requiredKeys: (keyof ColorScheme)[] = [
      'background', 'surface', 'surfaceElevated', 'surfaceSecondary',
      'textPrimary', 'textSecondary', 'textTertiary', 'textInverse',
      'primary', 'primaryLight', 'primaryDark',
      'success', 'successLight', 'warning', 'warningLight',
      'error', 'errorLight', 'info',
      'border', 'borderLight', 'divider', 'shadow', 'overlay',
      'chart',
    ];

    // WHEN the default color scheme is resolved
    const scheme = resolveColorScheme(defaultOptions);

    // THEN every required key is present on the resolved scheme
    requiredKeys.forEach((key) => {
      expect(scheme).toHaveProperty(key);
    });
  });

  it('should_apply_custom_accent_as_primary_color_when_customAccent_is_provided', () => {
    // GIVEN options containing a custom accent hex color
    const options = { ...defaultOptions, customAccent: '#FF5733' };

    // WHEN the color scheme is resolved
    const scheme = resolveColorScheme(options);

    // THEN the primary color equals the provided accent
    expect(scheme.primary).toBe('#FF5733');
  });

  it('should_resolve_every_theme_preset_without_throwing_for_both_modes', () => {
    // GIVEN the full list of theme preset identifiers
    const presetIds: ThemePreset[] = ['default', 'midnight', 'ocean', 'forest', 'sunset', 'rose', 'amoled'];

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

  it('should_produce_different_textPrimary_when_highContrast_mode_is_enabled', () => {
    // GIVEN a normal scheme and a high-contrast scheme built from the same options
    const normal = resolveColorScheme(defaultOptions);

    // WHEN the scheme is resolved with highContrast enabled
    const highContrast = resolveColorScheme({ ...defaultOptions, highContrast: true });

    // THEN the high-contrast textPrimary differs from the normal one
    expect(highContrast.textPrimary).not.toBe(normal.textPrimary);
  });

  it('should_apply_font_color_variants_when_warm_or_cool_is_selected', () => {
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
  it('should_return_dark_text_when_background_is_light', () => {
    // GIVEN two light background hex values

    // WHEN getContrastText is called for each
    const whiteResult = getContrastText('#FFFFFF');
    const nearWhiteResult = getContrastText('#FAFAFA');

    // THEN both return the dark contrast text color
    expect(whiteResult).toBe('#0C0C0F');
    expect(nearWhiteResult).toBe('#0C0C0F');
  });

  it('should_return_light_text_when_background_is_dark', () => {
    // GIVEN two dark background hex values

    // WHEN getContrastText is called for each
    const blackResult = getContrastText('#000000');
    const nearBlackResult = getContrastText('#0C0C0F');

    // THEN both return the light contrast text color
    expect(blackResult).toBe('#F5F5F7');
    expect(nearBlackResult).toBe('#F5F5F7');
  });

  it('should_return_light_text_fallback_when_hex_value_is_invalid', () => {
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
  it('should_expose_preresolved_light_and_dark_schemes_with_backgrounds', () => {
    // GIVEN the static colors export

    // WHEN its light and dark entries are inspected
    const { light, dark } = colors;

    // THEN both schemes and their backgrounds are defined
    expect(light).toBeDefined();
    expect(dark).toBeDefined();
    expect(light.background).toBeDefined();
    expect(dark.background).toBeDefined();
  });

  it('should_use_different_backgrounds_for_static_light_and_dark_schemes', () => {
    // GIVEN the static colors export

    // WHEN comparing light and dark backgrounds
    const lightBg = colors.light.background;
    const darkBg = colors.dark.background;

    // THEN the two backgrounds are not equal
    expect(lightBg).not.toBe(darkBg);
  });
});

describe('THEME_PRESETS', () => {
  it('should_contain_exactly_seven_theme_presets', () => {
    // GIVEN the exported THEME_PRESETS array

    // WHEN its length is measured
    const count = THEME_PRESETS.length;

    // THEN it contains seven entries
    expect(count).toBe(7);
  });

  it('should_define_id_accent_dark_and_light_structure_on_every_preset', () => {
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

  it('should_list_default_preset_as_the_first_entry', () => {
    // GIVEN the exported THEME_PRESETS array

    // WHEN the first preset is read
    const firstId = THEME_PRESETS[0]!.id;

    // THEN its id is "default"
    expect(firstId).toBe('default');
  });
});
