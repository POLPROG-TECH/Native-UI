import { StyleSheet, type Insets, type StyleProp, type ViewStyle } from 'react-native';
import type { Theme } from '../../theme/types';

export function uniformHitSlop(slop: number): Insets {
  return { top: slop, bottom: slop, left: slop, right: slop };
}

/** Field-styled row of the pressable trigger (placeholder and fallback variants). */
export function buildTriggerRowStyle(theme: Theme, borderColor: string): StyleProp<ViewStyle> {
  const tokens = theme.components.datePicker;

  return [
    datePickerStyles.row,
    {
      borderWidth: tokens.borderWidth,
      paddingHorizontal: tokens.triggerPaddingHorizontal,
      paddingVertical: tokens.triggerPaddingVertical,
      gap: tokens.triggerGap,
      minHeight: tokens.triggerMinHeight,
      backgroundColor: theme.colors.surfaceSecondary,
      borderColor,
      borderRadius: tokens.radius,
    },
  ];
}

/** Field-styled row hosting the inline iOS compact picker. */
export function buildCompactRowStyle(theme: Theme, borderColor: string): StyleProp<ViewStyle> {
  const tokens = theme.components.datePicker;

  return [
    datePickerStyles.row,
    {
      borderWidth: tokens.borderWidth,
      paddingLeft: tokens.compactPaddingLeft,
      paddingRight: tokens.compactPaddingRight,
      paddingVertical: tokens.compactPaddingVertical,
      gap: tokens.compactGap,
      backgroundColor: theme.colors.surfaceSecondary,
      borderColor,
      borderRadius: tokens.radius,
    },
  ];
}

export const datePickerStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fill: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
