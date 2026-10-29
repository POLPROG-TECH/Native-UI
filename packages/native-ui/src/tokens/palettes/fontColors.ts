import type { FontColor, TextRamp } from './types';

/** Text ramps per `fontColor` variant of the default (Aurora) palette. */
export const FONT_COLORS: Record<FontColor, { dark: TextRamp; light: TextRamp }> = {
  default: {
    dark: {
      textPrimary: '#F5F5F7',
      textSecondary: '#8E8E93',
      textTertiary: '#636366',
    },
    light: {
      textPrimary: '#1C1C1E',
      textSecondary: '#636366',
      textTertiary: '#AEAEB2',
    },
  },
  warm: {
    dark: {
      textPrimary: '#FFF8F0',
      textSecondary: '#B0956E',
      textTertiary: '#8A7055',
    },
    light: {
      textPrimary: '#3D2E1C',
      textSecondary: '#7A6548',
      textTertiary: '#B8A88E',
    },
  },
  cool: {
    dark: {
      textPrimary: '#F0F4FF',
      textSecondary: '#7E99B8',
      textTertiary: '#5A7694',
    },
    light: {
      textPrimary: '#1A2A3D',
      textSecondary: '#4A6580',
      textTertiary: '#8EA8BF',
    },
  },
};
