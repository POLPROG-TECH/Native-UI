import { useCallback } from 'react';
import { StyleSheet, View, Text, Switch as RNSwitch, type ViewStyle } from 'react-native';
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
 * A toggle switch with optional label and subtitle.
 */
export function Switch({
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

  return (
    <View style={[styles.row, disabled && { opacity: theme.opacity.disabled }, style]}>
      {(label || subtitle) && (
        <View style={styles.labelContainer}>
          {label && (
            <Text style={[theme.typography.body, { color: theme.colors.textPrimary }]}>
              {label}
            </Text>
          )}
          {subtitle && (
            <Text
              style={[theme.typography.caption, { color: theme.colors.textTertiary, marginTop: 2 }]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      )}
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
        accessibilityRole="switch"
        accessibilityState={{ checked: value, disabled }}
        accessibilityLabel={label}
      />
    </View>
  );
}

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
