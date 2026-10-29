import type React from 'react';
import { Pressable, Text } from 'react-native';
import { useFocusRing } from '../../hooks/useFocusRing';
import { useTheme } from '../../theme';
import { SystemIcon } from '../../primitives/SystemIcon';
import { buildTriggerRowStyle, datePickerStyles, uniformHitSlop } from './datePickerStyles';

export interface TriggerRowProps {
  icon?: React.ReactNode;
  text: string;
  isPlaceholder: boolean;
  borderColor: string;
  disabled: boolean;
  label?: string;
  onPress: () => void;
  clearButton: React.ReactNode;
  testID?: string;
}

/** Pressable field that shows the formatted value (or placeholder) and opens the picker. */
export function TriggerRow(props: TriggerRowProps) {
  const { text, isPlaceholder, disabled } = props;
  const theme = useTheme();
  const textColor = isPlaceholder ? theme.colors.textTertiary : theme.colors.textPrimary;
  const { focusProps, focusRingStyle } = useFocusRing();

  return (
    <Pressable
      testID={props.testID}
      style={[buildTriggerRowStyle(theme, props.borderColor), focusRingStyle]}
      onPress={props.onPress}
      {...focusProps}
      disabled={disabled}
      hitSlop={uniformHitSlop(theme.components.datePicker.triggerHitSlop)}
      accessibilityRole="button"
      accessibilityLabel={props.label}
      accessibilityState={{ disabled }}
    >
      {props.icon}
      <Text style={[theme.typography.body, datePickerStyles.fill, { color: textColor }]}>
        {text}
      </Text>
      {props.clearButton}
    </Pressable>
  );
}

export interface ClearButtonProps {
  onPress: () => void;
  accessibilityLabel: string;
  /** The icon receives `{testID}-icon`. */
  testID?: string;
}

export function ClearButton({ onPress, accessibilityLabel, testID }: ClearButtonProps) {
  const theme = useTheme();
  const tokens = theme.components.datePicker;
  const { focusProps, focusRingStyle } = useFocusRing();

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      {...focusProps}
      hitSlop={uniformHitSlop(tokens.clearHitSlop)}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[datePickerStyles.center, { padding: tokens.clearPadding }, focusRingStyle]}
    >
      <SystemIcon
        name="close"
        size={tokens.clearIconSize}
        color={theme.colors.textTertiary}
        testID={testID ? `${testID}-icon` : undefined}
      />
    </Pressable>
  );
}
