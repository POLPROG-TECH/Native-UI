import { StyleSheet, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import type { Theme } from '../../theme/types';

export interface SearchBarSlotStyles {
  left: ViewStyle[];
  right: ViewStyle[];
  clear: ViewStyle[];
}

/** Input padding leaves room for whichever slots are present. */
export function buildSearchInputStyle(
  theme: Theme,
  hasLeft: boolean,
  hasRight: boolean,
): StyleProp<TextStyle> {
  const tokens = theme.components.searchBar;
  const { lineHeight: _lh, ...inputTypography } = theme.typography.body;

  return [
    inputTypography,
    {
      paddingHorizontal: tokens.paddingHorizontal,
      paddingVertical: tokens.paddingVertical,
      paddingRight: tokens.clearButtonPadding,
      backgroundColor: theme.colors.surfaceSecondary,
      borderRadius: tokens.radius,
      color: theme.colors.textPrimary,
      textAlignVertical: 'center',
    },
    hasLeft ? { paddingLeft: tokens.leftSlotPadding } : {},
    hasRight ? { paddingRight: tokens.rightSlotPadding } : {},
  ];
}

/** Absolutely positioned slots; the clear button shifts left of a trailing slot. */
export function buildSearchSlotStyles(theme: Theme, hasRight: boolean): SearchBarSlotStyles {
  const tokens = theme.components.searchBar;
  const inset = tokens.slotInset;

  return {
    left: [searchBarStyles.slot, { left: inset }],
    right: [searchBarStyles.slot, { right: inset }],
    clear: [
      searchBarStyles.clearButton,
      {
        right: hasRight ? tokens.clearOffsetWithRightSlot : inset,
        width: tokens.clearButtonSize,
        height: tokens.clearButtonSize,
      },
    ],
  };
}

export const searchBarStyles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
  },
  clearButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slot: {
    position: 'absolute',
    zIndex: 1,
    justifyContent: 'center',
  },
});
