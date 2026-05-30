import React, { useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Switch as RNSwitch,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../theme';
import { getHaptics } from '../utils/haptics';

export interface SwitchProps {
  /** Whether the switch is on */
  value: boolean;
  onValueChange: (value: boolean) => void;
  /** Label displayed next to the switch */
  label?: string;
  /** Secondary text below the label */
  subtitle?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

/**
 * A toggle switch with optional label and subtitle. When a label or subtitle
 * is provided the whole row is tappable (matching native settings rows) and
 * the subtitle is announced as part of the accessible label.
 */
export const Switch = React.memo(function Switch({
  value,
  onValueChange,
  label,
  subtitle,
  disabled = false,
  style,
}: SwitchProps) {
  const theme = useTheme();

  const handleChange = useCallback(
    (newValue: boolean) => {
      getHaptics().light();
      onValueChange(newValue);
    },
    [onValueChange],
  );

  const handleToggle = useCallback(() => {
    if (!disabled) handleChange(!value);
  }, [disabled, handleChange, value]);

  const hasText = Boolean(label || subtitle);
  const accessibilityLabel = [label, subtitle].filter(Boolean).join(', ') || undefined;

  const text = hasText ? (
    <View
      style={styles.labelContainer}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
    >
      {label && (
        <Text style={[theme.typography.body, { color: theme.colors.textPrimary }]}>{label}</Text>
      )}
      {subtitle && (
        <Text
          style={[theme.typography.caption, { color: theme.colors.textTertiary, marginTop: 2 }]}
        >
          {subtitle}
        </Text>
      )}
    </View>
  ) : null;

  const control = (
    <RNSwitch
      value={value}
      onValueChange={handleChange}
      disabled={disabled}
      trackColor={{
        false: theme.colors.surfaceSecondary,
        true: theme.colors.primary,
      }}
      thumbColor={theme.colors.surface}
      ios_backgroundColor={theme.colors.surfaceSecondary}
      // When the row carries the switch semantics, hide the native control from
      // the screen reader to avoid a duplicate, unlabeled toggle announcement.
      {...(hasText
        ? { importantForAccessibility: 'no-hide-descendants' as const, accessible: false }
        : {
            accessibilityRole: 'switch' as const,
            accessibilityState: { checked: value, disabled },
            accessibilityLabel,
          })}
    />
  );

  if (!hasText) {
    return (
      <View style={[styles.row, disabled && { opacity: theme.opacity.disabled }, style]}>
        {control}
      </View>
    );
  }

  return (
    <Pressable
      onPress={handleToggle}
      disabled={disabled}
      style={[styles.row, disabled && { opacity: theme.opacity.disabled }, style]}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={accessibilityLabel}
    >
      {text}
      {control}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
    gap: 12,
  },
  labelContainer: {
    flex: 1,
  },
});
