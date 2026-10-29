import { FONT_COLORS } from './fontColors';
import { HIGH_CONTRAST_COLORS, HIGH_CONTRAST_SEMANTIC } from './highContrast';
import { THEME_PRESETS } from './presets';
import type { ColorPalette } from './types';

/** Palette reproducing the library's original (Aurora) colour values. */
export const defaultColorPalette: ColorPalette = {
  id: 'default',
  presets: THEME_PRESETS,
  defaultPreset: 'default',
  fontColors: FONT_COLORS,
  highContrastText: HIGH_CONTRAST_COLORS,
  highContrastSemantic: HIGH_CONTRAST_SEMANTIC,
  semantic: {
    dark: {
      success: '#34D399',
      successLight: '#064E3B',
      warning: '#FBBF24',
      warningLight: '#78350F',
      error: '#EF4444',
      errorLight: '#7F1D1D',
    },
    light: {
      success: '#34D399',
      successLight: '#D1FAE5',
      warning: '#FBBF24',
      warningLight: '#FEF3C7',
      /**
       * #DC2626 rather than #EF4444: white on #EF4444 is 3.8:1, below WCAG
       * AA for button labels, and #EF4444 as error text on white fails too.
       */
      error: '#DC2626',
      errorLight: '#FEE2E2',
    },
  },
  neutrals: {
    dark: {
      border: '#2C2C2E',
      borderLight: '#1E1E23',
      divider: '#1E1E23',
      shadow: 'rgba(0, 0, 0, 0.3)',
      overlay: 'rgba(0, 0, 0, 0.7)',
      info: '#60A5FA',
    },
    light: {
      border: '#D1D1D6',
      borderLight: '#E5E5EA',
      divider: '#E5E5EA',
      shadow: 'rgba(0, 0, 0, 0.04)',
      overlay: 'rgba(0, 0, 0, 0.5)',
      info: '#60A5FA',
    },
  },
  lightSurface: '#FFFFFF',
  lightSurfaceElevated: '#FFFFFF',
  lightTextInverse: '#FFFFFF',
  chart: {
    dark: [
      '#60A5FA',
      '#34D399',
      '#FBBF24',
      '#F87171',
      '#A78BFA',
      '#F472B6',
      '#22D3EE',
      '#A3E635',
      '#FB923C',
      '#818CF8',
    ],
    light: [
      '#3B82F6',
      '#10B981',
      '#F59E0B',
      '#EF4444',
      '#8B5CF6',
      '#EC4899',
      '#06B6D4',
      '#84CC16',
      '#F97316',
      '#6366F1',
    ],
  },
};
