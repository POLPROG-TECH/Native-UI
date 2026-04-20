export { colors, resolveColorScheme, getContrastText, THEME_PRESETS } from './colors';
export type {
  ColorScheme,
  SemanticColor,
  ThemeColors,
  ThemePreset,
  ThemePresetConfig,
  FontColor,
  ResolveColorOptions,
} from './colors';

export {
  typography,
  FONT_SCALE,
  buildTypography,
  compactTypography,
  resolveTypography,
  DEFAULT_TYPOGRAPHY_DENSITY,
} from './typography';
export type {
  TypographyVariant,
  FontSize,
  Typography,
  TypographyStyle,
  TypographyDensity,
} from './typography';

export {
  systemFontFamilies,
  spaceGroteskFontFamilies,
  familyForWeight,
  familiesForLocale,
} from './fonts';
export type { FontFamilies } from './fonts';

export {
  spacing,
  borderRadius,
  iconSize,
  hitSlop,
  elevation,
  duration,
  zIndex,
  opacity,
  borderWidth,
  easing,
  glowShadow,
} from './spacing';
export type { Spacing, BorderRadius, IconSize, Elevation } from './spacing';

export {
  defaultSemanticTokens,
  defaultSemanticColors,
  defaultSemanticSpacing,
  defaultSemanticTypography,
} from './semantic';
export type {
  SemanticTokens,
  SemanticColorTokens,
  SemanticSpacingTokens,
  SemanticTypographyTokens,
} from './semantic';

export { getResponsiveSpacing, getBreakpoint, BREAKPOINTS } from './responsive';
export type { ResponsiveSpacing, Breakpoint } from './responsive';
