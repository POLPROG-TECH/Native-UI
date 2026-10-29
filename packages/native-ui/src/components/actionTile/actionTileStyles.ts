import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import type { Theme } from '../../theme/types';
import type { ActionTileTone } from './types';

const TONE_BG: Record<
  ActionTileTone,
  'primaryLight' | 'successLight' | 'warningLight' | 'errorLight' | 'surfaceSecondary'
> = {
  primary: 'primaryLight',
  success: 'successLight',
  warning: 'warningLight',
  error: 'errorLight',
  neutral: 'surfaceSecondary',
};

/* Foreground on each tone's chip; the `*Text` colors stay readable on `*Light`. */
const TONE_FG: Record<
  ActionTileTone,
  'primaryText' | 'successText' | 'warningText' | 'errorText' | 'textSecondary'
> = {
  primary: 'primaryText',
  success: 'successText',
  warning: 'warningText',
  error: 'errorText',
  neutral: 'textSecondary',
};

/** Color handed to the tile's icon for a tone. */
export function resolveActionTileIconColor(theme: Theme, tone: ActionTileTone): string {
  return theme.colors[TONE_FG[tone]];
}

/** Tile surface and circular icon chip tinted by tone; disabled tiles are dimmed. */
export function buildActionTileStyles(theme: Theme, tone: ActionTileTone, disabled: boolean) {
  const tokens = theme.components.actionTile;

  return StyleSheet.create({
    tile: {
      flex: 1,
      alignItems: 'center',
      gap: tokens.gap,
      paddingVertical: tokens.paddingVertical,
      paddingHorizontal: tokens.paddingHorizontal,
      borderRadius: tokens.radius,
      borderWidth: theme.borderWidth.thin,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      opacity: disabled ? theme.opacity.disabled : 1,
    },
    iconChip: {
      width: tokens.iconChipSize,
      height: tokens.iconChipSize,
      borderRadius: tokens.iconChipSize / 2,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors[TONE_BG[tone]],
    },
  });
}

/** Memoized tile styles for the current theme. */
export function useActionTileStyles(tone: ActionTileTone, disabled: boolean) {
  const theme = useTheme();

  return useMemo(() => buildActionTileStyles(theme, tone, disabled), [theme, tone, disabled]);
}
