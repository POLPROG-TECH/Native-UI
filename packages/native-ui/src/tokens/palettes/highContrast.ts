import type { SemanticRamp, TextRamp } from './types';

/** Text and feedback ramps applied when `highContrast` is enabled. */
export const HIGH_CONTRAST_COLORS: { dark: TextRamp; light: TextRamp } = {
  dark: {
    textPrimary: '#FFFFFF',
    textSecondary: '#C7C7CC',
    textTertiary: '#A1A1A6',
  },
  light: {
    textPrimary: '#000000',
    textSecondary: '#3A3A3C',
    textTertiary: '#636366',
  },
};

export const HIGH_CONTRAST_SEMANTIC: { dark: SemanticRamp; light: SemanticRamp } = {
  dark: {
    success: '#4ADE80',
    successLight: '#052E16',
    warning: '#FDE047',
    warningLight: '#713F12',
    error: '#FCA5A5',
    errorLight: '#450A0A',
  },
  light: {
    success: '#059669',
    successLight: '#D1FAE5',
    warning: '#D97706',
    warningLight: '#FEF3C7',
    error: '#DC2626',
    errorLight: '#FEE2E2',
  },
};
