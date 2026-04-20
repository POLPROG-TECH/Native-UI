import { Platform, StyleSheet } from 'react-native';

/** Spacing scale - 4-pt base grid, aligned to native iOS / Material conventions. */
export const spacing = {
  '2xs': 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 56,
} as const;

/** Border radius - rounded, modern */
export const borderRadius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  '2xl': 32,
  full: 9999,
} as const;

export const iconSize = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

/** Minimum touch target sizes per platform guidelines */
export const hitSlop = {
  ios: { top: 8, bottom: 8, left: 8, right: 8 },
  android: { top: 10, bottom: 10, left: 10, right: 10 },
} as const;

/** Elevation / shadow presets - subtle, platform-specific */
export const elevation = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 3,
    },
    android: { elevation: 1 },
    default: {},
  })!,
  md: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    android: { elevation: 2 },
    default: {},
  })!,
  lg: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
    },
    android: { elevation: 4 },
    default: {},
  })!,
  xl: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
    },
    android: { elevation: 6 },
    default: {},
  })!,
} as const;

/** Color-parameterized glow shadow (accent glow effect) */
export function glowShadow(color: string) {
  return Platform.select({
    ios: {
      shadowColor: color,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
    },
    android: { elevation: 4 },
    default: {},
  });
}

/** Animation / motion timing tokens */
export const duration = {
  instant: 100,
  fast: 200,
  normal: 300,
  slow: 500,
} as const;

/** Z-index layering tokens */
export const zIndex = {
  base: 0,
  card: 1,
  stickyHeader: 10,
  overlay: 50,
  modal: 100,
  toast: 200,
} as const;

/** Opacity tokens for interactive states */
export const opacity = {
  disabled: 0.5,
  pressed: 0.8,
  inactive: 0.7,
  overlay: 0.5,
  overlayDark: 0.7,
} as const;

/** Border width tokens */
export const borderWidth = {
  none: 0,
  hairline: StyleSheet.hairlineWidth,
  thin: 1,
  thick: 2,
} as const;

/** Easing presets (cubic bezier values for Reanimated) */
export const easing = {
  standard: [0.4, 0.0, 0.2, 1] as const,
  decelerate: [0.0, 0.0, 0.2, 1] as const,
  accelerate: [0.4, 0.0, 1, 1] as const,
} as const;

export type Spacing = keyof typeof spacing;
export type BorderRadius = keyof typeof borderRadius;
export type IconSize = keyof typeof iconSize;
export type Elevation = keyof typeof elevation;
