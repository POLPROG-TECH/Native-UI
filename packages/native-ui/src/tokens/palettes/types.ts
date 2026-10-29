/*
 * Palette contracts live in this leaf module so the data modules, the
 * resolver and `textTokens` can share them without importing each other.
 */

export interface ThemePresetConfig {
  id: string;
  accent: string;
  dark: {
    bg: string;
    secondary: string;
    tertiary: string;
    elevated: string;
    accent: string;
    accentLight: string;
    accentDark: string;
  };
  light: {
    bg: string;
    secondary: string;
    tertiary: string;
    accent: string;
    accentLight: string;
    accentDark: string;
  };
}

export type FontColor = 'default' | 'warm' | 'cool';

/** Text colour ramp (primary/secondary/tertiary) for one mode. */
export interface TextRamp {
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
}

/** Feedback colours, each with a tinted `*Light` background, for one mode. */
export interface SemanticRamp {
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  error: string;
  errorLight: string;
}

/** Chrome colours that are neither accent, text, nor a surface tier. */
export interface NeutralRamp {
  border: string;
  borderLight: string;
  divider: string;
  shadow: string;
  overlay: string;
  info: string;
}

/**
 * The colour foundation a theme variant resolves against. Bundles the accent
 * presets with the neutral, text, and feedback ramps that `resolveColorScheme`
 * maps into a `ColorScheme`. `defaultColorPalette` reproduces the library's
 * original values; a different palette (e.g. `bloomColorPalette`) swaps the
 * whole set without touching the resolver or any component.
 */
export interface ColorPalette {
  id: string;
  /** Accent presets selectable via `preset`. */
  presets: readonly ThemePresetConfig[];
  /** Preset applied when the consumer doesn't pass one. */
  defaultPreset: string;
  /** Text ramps per `fontColor` variant. */
  fontColors: Record<FontColor, { dark: TextRamp; light: TextRamp }>;
  /** Text ramps used when `highContrast` is enabled. */
  highContrastText: { dark: TextRamp; light: TextRamp };
  /** Feedback ramps in normal contrast. */
  semantic: { dark: SemanticRamp; light: SemanticRamp };
  /** Feedback ramps when `highContrast` is enabled. */
  highContrastSemantic: { dark: SemanticRamp; light: SemanticRamp };
  /** Border / divider / shadow / overlay / info chrome per mode. */
  neutrals: { dark: NeutralRamp; light: NeutralRamp };
  /** Flat light-mode card surfaces (dark surfaces come from the preset tiers). */
  lightSurface: string;
  lightSurfaceElevated: string;
  /**
   * Preferred text colour on accent and feedback fills in light mode. The
   * resolver keeps it only where it meets WCAG AA on the fill.
   */
  lightTextInverse: string;
  /** Chart series palette per mode. */
  chart: { dark: readonly string[]; light: readonly string[] };
  /**
   * Optional override for the preferred on-fill text colour. When omitted,
   * dark mode prefers the preset background and light mode prefers
   * `lightTextInverse`. Either way the preferred ink is replaced by the
   * best-contrast ink on any fill where it would fall below WCAG AA.
   */
  textInverse?: { dark?: string; light?: string };
}
