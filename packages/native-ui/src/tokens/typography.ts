import { systemFontFamilies, type FontFamilies } from './fonts';
import { compactTypography } from './typeScales/compact';
import { buildTypography } from './typeScales/regular';
import type { Typography } from './typeScales/types';

/*
 * The two scale builders and the shared style contracts live in
 * `./typeScales`; this module picks between them and keeps the public
 * import path `tokens/typography` unchanged.
 */
export { buildTypography } from './typeScales/regular';
export { compactTypography } from './typeScales/compact';
export type { Typography, TypographyStyle } from './typeScales/types';

/** Default (system-font) typography scale. Use `buildTypography()` with custom families
 * to opt into Space Grotesk via the NativeUIProvider `fontFamilies` config. */
export const typography: Typography = buildTypography(systemFontFamilies);

/**
 * Typography density presets.
 *
 * - `'compact'` - editorial 15-pt body scale, larger display sizes. **Default**
 *   for Native-UI. Designed as a branded, editorial type scale that reads
 *   comfortably across dense content-heavy screens.
 * - `'regular'` - iOS 17-native scale (17-pt body). Closer to stock Apple
 *   system UI. Opt in via `<NativeUIProvider config={{ typography: 'regular' }} />`.
 */
export type TypographyDensity = 'regular' | 'compact';

/** Default density applied when `NativeUIProvider.config.typography` is omitted. */
export const DEFAULT_TYPOGRAPHY_DENSITY: TypographyDensity = 'compact';

/**
 * Resolve a typography scale for a given density + font families.
 * Exposed as a convenience so app code can pick presets declaratively.
 */
export function resolveTypography(density: TypographyDensity, families: FontFamilies): Typography {
  return density === 'compact' ? compactTypography(families) : buildTypography(families);
}

/** Font size scaling multipliers for accessibility */
export const FONT_SCALE: Record<FontSize, number> = {
  default: 0,
  medium: 2,
  large: 4,
};

export type TypographyVariant = keyof Typography;
export type FontSize = 'default' | 'medium' | 'large';
