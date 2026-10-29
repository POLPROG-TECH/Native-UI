import { ensureReadable, worstContrast } from './colorUtils';
import type { ColorScheme } from './colorScheme';
import type { TextRamp } from './palettes/types';

/** Minimum contrast ratio between adjacent text levels (secondary over tertiary). */
const HIERARCHY_STEP = 1.4;

/** Surfaces text is drawn on, plus the accent tint used behind accent text. */
export interface TextSurfaces {
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceSecondary: string;
  accentLight: string;
}

/** Fill colors that also appear as text, in the order of their `*Text` tokens. */
export interface TextAccents {
  primary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface ReadableTextTokens extends TextRamp {
  /** Accent as a text / icon color (links, ghost buttons, active tabs). */
  primaryText: string;
  successText: string;
  warningText: string;
  errorText: string;
  infoText: string;
}

/**
 * Makes every text color meet `minContrast` on every surface it can sit on.
 * Palette values that already pass are returned untouched; failing ones
 * (a bright accent or a pale tertiary gray on white) are shaded just far
 * enough to pass, so the palette keeps its character.
 */
export function resolveReadableText(
  text: TextRamp,
  accents: TextAccents,
  surfaces: TextSurfaces,
  minContrast: number,
): ReadableTextTokens {
  const base = [
    surfaces.background,
    surfaces.surface,
    surfaces.surfaceElevated,
    surfaces.surfaceSecondary,
  ];
  const readable = (color: string) => ensureReadable(color, base, minContrast);
  const textTertiary = readable(text.textTertiary);
  /*
   * Lifting tertiary to AA can land it next to secondary; keep secondary a
   * visible step above it so the three levels still read as a hierarchy.
   */
  const secondaryMinimum = Math.max(
    minContrast,
    worstContrast(textTertiary, base) * HIERARCHY_STEP,
  );

  return {
    textPrimary: readable(text.textPrimary),
    textSecondary: ensureReadable(text.textSecondary, base, secondaryMinimum),
    textTertiary,
    primaryText: ensureReadable(accents.primary, [...base, surfaces.accentLight], minContrast),
    successText: readable(accents.success),
    warningText: readable(accents.warning),
    errorText: readable(accents.error),
    infoText: readable(accents.info),
  };
}

/** Text-safe color keys (`chart` is a list, not a color). */
export type TextColorToken = Exclude<keyof ColorScheme, 'chart'>;

/** Fill colors whose readable `*Text` variant is used when they color text. */
const READABLE_VARIANT: Partial<Record<TextColorToken, TextColorToken>> = {
  primary: 'primaryText',
  success: 'successText',
  warning: 'warningText',
  error: 'errorText',
  info: 'infoText',
};

/**
 * Resolves a color key for use as text: accent and feedback keys map to
 * their readable variants, so `<Text color="primary">` stays legible even
 * when the raw accent is too light for text.
 */
export function textColorOf(colors: ColorScheme, token: TextColorToken): string {
  return colors[READABLE_VARIANT[token] ?? token];
}
