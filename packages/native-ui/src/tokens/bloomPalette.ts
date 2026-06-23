import {
  defaultColorPalette,
  type ColorPalette,
  type ThemePresetConfig,
  type BloomPreset,
} from './colors';

/**
 * Bloom colour foundation - a soft, rounded look: violet/pink accents on
 * purple-tinted neutrals, light or dark. The four presets share one set of
 * neutrals and differ only in their accent pair (a small accent-picker).
 * Reuses the default palette's feedback ramps, high-contrast
 * ramps, and chart series, which read well on the purple surfaces.
 */

const DARK_BG = '#16111b';
const DARK_SURFACE = '#221c29';
const DARK_ELEVATED = '#2c2534';
const DARK_TIER = '#1f1a26';

const LIGHT_BG = '#fdf9fe';
const LIGHT_SURFACE_SECONDARY = '#f8f1f9';
const LIGHT_TIER = '#ece5ed';

/** Per-mode accent tints for one Bloom preset (mirrors `ThemePresetConfig`). */
interface BloomAccentRamp {
  dark: { accentLight: string; accentDark: string };
  light: { accentLight: string; accentDark: string };
}

function bloomPreset(id: BloomPreset, accent: string, ramp: BloomAccentRamp): ThemePresetConfig {
  return {
    id,
    accent,
    dark: {
      bg: DARK_BG,
      secondary: DARK_SURFACE,
      tertiary: DARK_TIER,
      elevated: DARK_ELEVATED,
      accent,
      accentLight: ramp.dark.accentLight,
      accentDark: ramp.dark.accentDark,
    },
    light: {
      bg: LIGHT_BG,
      secondary: LIGHT_SURFACE_SECONDARY,
      tertiary: LIGHT_TIER,
      accent,
      accentLight: ramp.light.accentLight,
      accentDark: ramp.light.accentDark,
    },
  };
}

export const BLOOM_PRESETS: readonly ThemePresetConfig[] = [
  bloomPreset('violet', '#7c5cff', {
    dark: { accentLight: '#2a2150', accentDark: '#a594ff' },
    light: { accentLight: '#ece8ff', accentDark: '#5b3fd6' },
  }),
  bloomPreset('grape', '#8b54e8', {
    dark: { accentLight: '#2e1f52', accentDark: '#b18cf2' },
    light: { accentLight: '#f0e7fd', accentDark: '#6a35c4' },
  }),
  bloomPreset('coral', '#ff5d7d', {
    dark: { accentLight: '#4d1f2e', accentDark: '#ff9bb0' },
    light: { accentLight: '#ffe4ea', accentDark: '#e23a5e' },
  }),
  bloomPreset('ocean', '#2f9bff', {
    dark: { accentLight: '#102f4d', accentDark: '#82c4ff' },
    light: { accentLight: '#e2f1ff', accentDark: '#1574d6' },
  }),
];

export const bloomColorPalette: ColorPalette = {
  ...defaultColorPalette,
  id: 'bloom',
  presets: BLOOM_PRESETS,
  defaultPreset: 'violet',
  fontColors: {
    default: {
      dark: { textPrimary: '#f6eff7', textSecondary: '#c0b7c3', textTertiary: '#8c828f' },
      light: { textPrimary: '#241d2d', textSecondary: '#5e5767', textTertiary: '#8c8693' },
    },
    warm: {
      dark: { textPrimary: '#fbf2ee', textSecondary: '#c6b3aa', textTertiary: '#94817a' },
      light: { textPrimary: '#2e2018', textSecondary: '#6b5848', textTertiary: '#9a8b7d' },
    },
    cool: {
      dark: { textPrimary: '#eef1fb', textSecondary: '#b3bbcf', textTertiary: '#7e879c' },
      light: { textPrimary: '#1d2438', textSecondary: '#515d75', textTertiary: '#828ca6' },
    },
  },
  neutrals: {
    dark: {
      border: '#393242',
      borderLight: '#2c2534',
      divider: '#393242',
      shadow: 'rgba(0, 0, 0, 0.45)',
      overlay: 'rgba(8, 5, 12, 0.7)',
      info: '#6f9cff',
    },
    light: {
      border: '#ece5ed',
      borderLight: '#f0e8f1',
      divider: '#ece5ed',
      shadow: 'rgba(80, 40, 160, 0.1)',
      overlay: 'rgba(36, 29, 45, 0.45)',
      info: '#4f8cf0',
    },
  },
  textInverse: { dark: '#FFFFFF' },
};
