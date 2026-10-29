import { devWarn } from '../utils/devWarn';
import {
  darkenHex,
  getContrastText,
  lightenHex,
  normaliseHex,
  resolveOnColor,
  WCAG_AA_TEXT_CONTRAST,
} from './colorUtils';

import { resolveReadableText } from './textTokens';
import { resolveControlColors } from './controlColors';

export {
  contrastRatio,
  ensureReadable,
  getContrastText,
  resolveOnColor,
  isValidHex,
  normaliseHex,
  withAlpha,
  WCAG_AA_TEXT_CONTRAST,
} from './colorUtils';

export type { ColorScheme } from './colorScheme';
import type { ColorScheme } from './colorScheme';
import { defaultColorPalette } from './palettes/aurora';
import type { ColorPalette, FontColor, ThemePresetConfig } from './palettes/types';

/*
 * Palette data and contracts live in `./palettes`; this module keeps the
 * resolver and re-exports them so the public import path stays `tokens/colors`.
 */
export { defaultColorPalette } from './palettes/aurora';
export { THEME_PRESETS } from './palettes/presets';
export type {
  ColorPalette,
  FontColor,
  NeutralRamp,
  SemanticRamp,
  TextRamp,
  ThemePresetConfig,
} from './palettes/types';

export type SemanticColor = 'primary' | 'success' | 'warning' | 'error' | 'info';

/** Union of all ColorScheme keys - useful for type-safe color lookups */
export type ThemeColors = keyof ColorScheme;

export type ThemePreset =
  'default' | 'midnight' | 'ocean' | 'forest' | 'sunset' | 'rose' | 'amoled';

/** Accent presets shipped with the Bloom theme variant. */
export type BloomPreset = 'violet' | 'grape' | 'coral' | 'ocean';

export interface ResolveColorOptions {
  isDark: boolean;
  preset: string;
  fontColor: FontColor;
  highContrast: boolean;
  customAccent: string | null;
  /**
   * Minimum contrast ratio for text on solid fills (`on*` tokens).
   * @default WCAG_AA_TEXT_CONTRAST (4.5)
   */
  minContrast?: number;
}

/** Mode-specific values the resolver derives before building the scheme. */
interface ModeTiers {
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceSecondary: string;
  accentLight: string;
  accentDark: string;
  /** Ink the palette designed for accent fills, before the contrast check. */
  preferredInk: string;
}

function resolveModeTiers(
  isDark: boolean,
  preset: ThemePresetConfig,
  palette: ColorPalette,
  accent: string,
  hasCustom: boolean,
): ModeTiers {
  if (isDark) {
    const p = preset.dark;

    return {
      background: p.bg,
      surface: p.secondary,
      surfaceElevated: p.elevated,
      surfaceSecondary: p.tertiary,
      accentLight: hasCustom ? darkenHex(accent, 0.7) : p.accentLight,
      accentDark: hasCustom ? lightenHex(accent, 0.3) : p.accentDark,
      preferredInk: palette.textInverse?.dark ?? p.bg,
    };
  }

  const p = preset.light;

  return {
    background: p.bg,
    surface: palette.lightSurface,
    surfaceElevated: palette.lightSurfaceElevated,
    surfaceSecondary: p.secondary,
    accentLight: hasCustom ? lightenHex(accent, 0.85) : p.accentLight,
    accentDark: hasCustom ? darkenHex(accent, 0.3) : p.accentDark,
    preferredInk: palette.textInverse?.light ?? palette.lightTextInverse,
  };
}

export function resolveColorScheme(
  options: ResolveColorOptions,
  palette: ColorPalette = defaultColorPalette,
): ColorScheme {
  const {
    isDark,
    preset,
    fontColor,
    highContrast,
    customAccent,
    minContrast = WCAG_AA_TEXT_CONTRAST,
  } = options;
  const found = palette.presets.find((p) => p.id === preset);

  if (!found) {
    devWarn(
      `Unknown preset "${preset}" for palette "${palette.id}" - falling back to "${palette.defaultPreset}".`,
    );
  }

  const presetConfig =
    found ?? palette.presets.find((p) => p.id === palette.defaultPreset) ?? palette.presets[0];

  if (!presetConfig) {
    throw new Error(`[native-ui] Palette "${palette.id}" defines no presets.`);
  }

  const mode = isDark ? 'dark' : 'light';
  /* Like `preset`, `fontColor` may come from persisted settings, so a lookup can miss. */
  const fontColors: Partial<Record<string, ColorPalette['fontColors'][FontColor]>> =
    palette.fontColors;
  const fc = fontColors[fontColor] ?? palette.fontColors.default;
  const text = highContrast ? palette.highContrastText[mode] : fc[mode];
  const semantic = highContrast ? palette.highContrastSemantic[mode] : palette.semantic[mode];
  const neutrals = palette.neutrals[mode];

  const presetAccent = isDark ? presetConfig.dark.accent : presetConfig.light.accent;
  const accentColor = resolveCustomAccent(customAccent, presetAccent);
  const hasCustom = customAccent != null && normaliseHex(customAccent) != null;
  const tiers = resolveModeTiers(isDark, presetConfig, palette, accentColor, hasCustom);

  /*
   * A custom accent has no designed ink, so pick the best-contrast one.
   * Feedback fills keep the palette's ink when it is legible on them.
   */
  const onPrimary = hasCustom
    ? getContrastText(accentColor)
    : resolveOnColor(accentColor, tiers.preferredInk, minContrast);
  const onFill = (fill: string) => resolveOnColor(fill, tiers.preferredInk, minContrast);
  const controls = resolveControlColors({
    isDark,
    border: neutrals.border,
    accent: accentColor,
    background: tiers.background,
    surface: tiers.surface,
    surfaceElevated: tiers.surfaceElevated,
    surfaceSecondary: tiers.surfaceSecondary,
    lightModeText: fc.light.textPrimary,
    darkModeText: fc.dark.textPrimary,
    lightModeSurface: presetConfig.light.secondary,
  });
  const readable = resolveReadableText(
    text,
    {
      primary: accentColor,
      success: semantic.success,
      warning: semantic.warning,
      error: semantic.error,
      info: neutrals.info,
    },
    tiers,
    minContrast,
  );

  return {
    background: tiers.background,
    surface: tiers.surface,
    surfaceElevated: tiers.surfaceElevated,
    surfaceSecondary: tiers.surfaceSecondary,
    textPrimary: readable.textPrimary,
    textSecondary: readable.textSecondary,
    textTertiary: readable.textTertiary,
    textInverse: onPrimary,
    primary: accentColor,
    primaryText: readable.primaryText,
    successText: readable.successText,
    warningText: readable.warningText,
    errorText: readable.errorText,
    infoText: readable.infoText,
    primaryLight: tiers.accentLight,
    primaryDark: tiers.accentDark,
    onPrimary,
    success: semantic.success,
    successLight: semantic.successLight,
    onSuccess: onFill(semantic.success),
    warning: semantic.warning,
    warningLight: semantic.warningLight,
    onWarning: onFill(semantic.warning),
    error: semantic.error,
    errorLight: semantic.errorLight,
    onError: onFill(semantic.error),
    info: neutrals.info,
    onInfo: onFill(neutrals.info),
    border: neutrals.border,
    borderLight: neutrals.borderLight,
    divider: neutrals.divider,
    shadow: neutrals.shadow,
    overlay: neutrals.overlay,
    ...controls,
    chart: palette.chart[mode],
  };
}

function resolveCustomAccent(value: string | null | undefined, fallback: string): string {
  if (value == null) {
    return fallback;
  }

  const n = normaliseHex(value);

  if (n) {
    return n;
  }

  devWarn(
    `Invalid customAccent "${value}" - expected #RGB or #RRGGBB. Falling back to preset accent.`,
  );

  return fallback;
}

/** Pre-resolved default colors for use outside ThemeProvider (e.g. ErrorBoundary) */
export const colors = {
  light: resolveColorScheme({
    isDark: false,
    preset: 'default',
    fontColor: 'default',
    highContrast: false,
    customAccent: null,
  }),
  dark: resolveColorScheme({
    isDark: true,
    preset: 'default',
    fontColor: 'default',
    highContrast: false,
    customAccent: null,
  }),
};
