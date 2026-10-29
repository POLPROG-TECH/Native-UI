import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import type { Theme } from '../../theme/types';
import type { SelectTokens } from '../../tokens/components';

/** Token-driven paddings shared by the built-in rows and compound parts. */
export function buildSelectRowStyles(tokens: SelectTokens) {
  return {
    trigger: {
      paddingHorizontal: tokens.triggerPaddingHorizontal,
      paddingVertical: tokens.triggerPaddingVertical,
      minHeight: tokens.triggerMinHeight,
      gap: tokens.triggerGap,
    } satisfies ViewStyle,
    option: {
      paddingHorizontal: tokens.optionPaddingHorizontal,
      paddingVertical: tokens.optionPaddingVertical,
      gap: tokens.optionGap,
      minHeight: tokens.optionMinHeight,
    } satisfies ViewStyle,
  };
}

/** The monolithic Select's trigger: field surface with an error-aware border. */
export function buildSelectTriggerStyle(
  theme: Theme,
  hasError: boolean,
  disabled: boolean,
): StyleProp<ViewStyle> {
  const tokens = theme.components.select;

  return [
    selectStyles.trigger,
    buildSelectRowStyles(tokens).trigger,
    {
      backgroundColor: theme.colors.surfaceSecondary,
      borderColor: hasError ? theme.colors.error : theme.colors.controlBorder,
      borderRadius: tokens.triggerRadius,
    },
    disabled && { opacity: theme.opacity.disabled },
  ];
}

export const selectStyles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
  },
  /* Rows paint their own padding so the selected fill spans the sheet. */
  flushBody: {
    paddingHorizontal: 0,
  },
});
