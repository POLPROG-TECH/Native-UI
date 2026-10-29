/*
 * Pure helpers shared by the color resolver and components. Kept apart from
 * `colors.ts` so the palette data and the math evolve (and are tested)
 * independently.
 */

const HEX_RE = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

/** Near-black ink used for text drawn on light fills. */
export const DARK_INK = '#0C0C0F';
/** Near-white ink used for text drawn on dark fills. */
export const LIGHT_INK = '#F5F5F7';

/**
 * WCAG 2.x AA minimum contrast ratio for normal-size text. Component labels
 * (buttons, badges, chips) are 11-17pt, below the "large text" threshold, so
 * the 3:1 large-text allowance does not apply to them.
 */
export const WCAG_AA_TEXT_CONTRAST = 4.5;

/** Returns true for `#RGB` or `#RRGGBB` strings only. */
export function isValidHex(value: string): boolean {
  return HEX_RE.test(value);
}

/** Normalises `#RGB` to `#RRGGBB`, preserving the original case. Returns null on invalid input. */
export function normaliseHex(value: string): string | null {
  if (!HEX_RE.test(value)) {
    return null;
  }

  if (value.length === 4) {
    const r = value[1];
    const g = value[2];
    const b = value[3];

    return `#${r}${r}${g}${g}${b}${b}`;
  }

  return value;
}

function hexToRgb(hex: string): [number, number, number] {
  const n = normaliseHex(hex);

  if (!n) {
    return [0, 0, 0];
  }

  const h = n.slice(1);

  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((v) =>
        Math.round(Math.min(255, Math.max(0, v)))
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  );
}

/** Mixes `hex` toward white by `amount` (0-1). */
export function lightenHex(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);

  return rgbToHex(r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount);
}

/** Mixes `hex` toward black by `amount` (0-1). */
export function darkenHex(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);

  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
}

/**
 * Returns `color` as an `rgba()` string with the given alpha (clamped to 0-1).
 * Non-hex input (named colors, `rgb()` strings) is returned unchanged, so the
 * helper is safe to call on any theme value.
 *
 * @example
 * ```ts
 * withAlpha('#3B82F6', 0.12); // 'rgba(59,130,246,0.12)'
 * ```
 */
export function withAlpha(color: string, alpha: number): string {
  if (!normaliseHex(color)) {
    return color;
  }

  const [r, g, b] = hexToRgb(color);
  const a = Math.min(1, Math.max(0, alpha));

  return `rgba(${r},${g},${b},${a})`;
}

/** WCAG 2.x relative luminance of a hex color (0 = black, 1 = white). */
function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);

  return 0.2126 * linearChannel(r) + 0.7152 * linearChannel(g) + 0.0722 * linearChannel(b);
}

/** sRGB channel (0-255) to linear light, per the WCAG 2.x luminance formula. */
function linearChannel(channel: number): number {
  const c = channel / 255;

  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/**
 * WCAG 2.x contrast ratio between two hex colors, from 1 (identical) to 21
 * (black on white). Order of the arguments does not matter.
 */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);

  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/**
 * Returns the ink (near-black or near-white) with the higher WCAG contrast
 * against `background`. Falls back to light ink for non-hex input.
 */
export function getContrastText(background: string): string {
  if (!HEX_RE.test(background)) {
    return LIGHT_INK;
  }

  return contrastRatio(DARK_INK, background) >= contrastRatio(LIGHT_INK, background)
    ? DARK_INK
    : LIGHT_INK;
}

/**
 * Picks the text color for content drawn on a solid `fill`. Keeps the
 * palette's `preferred` ink whenever it meets `minContrast` (WCAG AA by
 * default, pass 7 for AAA), so palettes that are
 * already accessible render exactly as designed. Otherwise switches to the
 * best-contrast ink, but only if that one actually reaches the minimum: on mid-tone
 * fills where neither ink passes, flipping the designed color would change
 * the look without making the label compliant.
 */
export function resolveOnColor(
  fill: string,
  preferred: string,
  minContrast: number = WCAG_AA_TEXT_CONTRAST,
): string {
  if (!HEX_RE.test(fill) || !HEX_RE.test(preferred)) {
    return preferred;
  }

  if (contrastRatio(preferred, fill) >= minContrast) {
    return preferred;
  }

  const best = getContrastText(fill);

  return contrastRatio(best, fill) >= minContrast ? best : preferred;
}

/** 5% mixing steps: fine enough to stay close to the designed hue. */
const READABLE_MIX_STEPS = 20;

/** Linear RGB mix of `from` toward `to` by `amount` (0-1). */
function mixHex(from: string, to: string, amount: number): string {
  const [r1, g1, b1] = hexToRgb(from);
  const [r2, g2, b2] = hexToRgb(to);

  return rgbToHex(r1 + (r2 - r1) * amount, g1 + (g2 - g1) * amount, b1 + (b2 - b1) * amount);
}

/** Lowest contrast of `color` against any of `backgrounds`. */
export function worstContrast(color: string, backgrounds: readonly string[]): number {
  return Math.min(...backgrounds.map((background) => contrastRatio(color, background)));
}

/**
 * Returns `color` unchanged when it reaches `minContrast` on every one of
 * `backgrounds`; otherwise mixes it toward the ink that contrasts with them
 * (darker on light surfaces, lighter on dark ones) in small steps and returns
 * the first shade that passes. Keeps a designed tint, such as an accent used
 * as link text, as close to the original as accessibility allows.
 */
export function ensureReadable(
  color: string,
  backgrounds: readonly string[],
  minContrast: number = WCAG_AA_TEXT_CONTRAST,
): string {
  const measurable = backgrounds.filter((background) => HEX_RE.test(background));
  const [reference] = measurable;

  if (!HEX_RE.test(color) || reference === undefined) {
    return color;
  }

  if (worstContrast(color, measurable) >= minContrast) {
    return color;
  }

  const ink = getContrastText(reference);

  for (let step = 1; step <= READABLE_MIX_STEPS; step++) {
    const candidate = mixHex(color, ink, step / READABLE_MIX_STEPS);

    if (worstContrast(candidate, measurable) >= minContrast) {
      return candidate;
    }
  }

  return ink;
}
