import { typedKeys } from '../../utils/typedKeys';
import { familyForWeight, type FontFamilies } from '../fonts';
import type { Typography } from './types';

/**
 * Variants routed through the optional `display` font family (headings,
 * numerals). Everything else keeps the base text family. Mirrors the
 * Outfit-for-headings / Plus-Jakarta-for-body split that defines the Bloom look.
 */
const DISPLAY_VARIANTS = new Set<keyof Typography>([
  'displayLarge',
  'displayMedium',
  'h1',
  'h2',
  'h3',
  'heading',
  'title',
  'mono',
  'monoLarge',
  'monoSmall',
]);

/**
 * Re-route display variants onto `families.display` when a consumer supplies a
 * separate display family. A no-op for single-family presets, so existing
 * scales are byte-identical.
 */
export function applyDisplayFamily(scale: Typography, families: FontFamilies): Typography {
  if (!families.display) {
    return scale;
  }

  const result: Typography = { ...scale };

  for (const key of typedKeys(scale)) {
    const variant = scale[key];

    result[key] = DISPLAY_VARIANTS.has(key)
      ? { ...variant, fontFamily: familyForWeight(families, variant.fontWeight, 'display') }
      : variant;
  }

  return result;
}
