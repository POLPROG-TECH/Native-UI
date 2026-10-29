import type { Theme } from '../../theme/types';
import type { ChipVariant } from './types';

export interface ChipColors {
  background: string;
  border: string;
  label: string;
}

/**
 * Resolves the chip palette for a variant and selection state. Unselected
 * chips look the same in every variant; only the selected state differs.
 */
export function resolveChipColors(
  theme: Theme,
  variant: ChipVariant,
  selected: boolean,
): ChipColors {
  const { colors } = theme;

  if (!selected) {
    return {
      background: colors.surfaceSecondary,
      border: 'transparent',
      label: colors.textPrimary,
    };
  }

  if (variant === 'soft') {
    return { background: colors.primaryLight, border: 'transparent', label: colors.primaryText };
  }

  if (variant === 'outline') {
    return { background: 'transparent', border: colors.primaryText, label: colors.primaryText };
  }

  return {
    background: colors.primary,
    border: 'transparent',
    label: colors.onPrimary,
  };
}
