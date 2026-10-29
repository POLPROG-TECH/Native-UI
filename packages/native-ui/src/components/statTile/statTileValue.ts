import type { ColorScheme } from '../../tokens/colors';
import type { StatTileSize, StatTileTone } from './types';

export type StatTileValueVariant = 'monoLarge' | 'mono' | 'monoSmall' | 'h2' | 'h3' | 'title';

const TONE_COLOR = {
  neutral: 'textPrimary',
  primary: 'primaryText',
  success: 'successText',
  warning: 'warningText',
  error: 'errorText',
} as const satisfies Record<StatTileTone, keyof ColorScheme>;

/** Mono variants keep figures tabular so changing values do not jitter. */
const VALUE_VARIANT: Record<'mono' | 'proportional', Record<StatTileSize, StatTileValueVariant>> = {
  mono: { sm: 'monoSmall', md: 'mono', lg: 'monoLarge' },
  proportional: { sm: 'title', md: 'h3', lg: 'h2' },
};

export type StatTileValueColor = (typeof TONE_COLOR)[StatTileTone];

/** Color-scheme key for the value text of a tone. */
export function statTileValueColor(tone: StatTileTone): StatTileValueColor {
  return TONE_COLOR[tone];
}

/** Typography variant for the value text at a size, mono or proportional. */
export function statTileValueVariant(size: StatTileSize, mono: boolean): StatTileValueVariant {
  return VALUE_VARIANT[mono ? 'mono' : 'proportional'][size];
}
