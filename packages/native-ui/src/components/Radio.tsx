import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useTheme } from '../theme';

export interface RadioProps {
  /** Whether this radio option is selected */
  selected: boolean;
  /** Label text */
  label?: string;
  onPress?: () => void;
  accessibilityLabel?: string;
  disabled?: boolean;
}

/**
 * Radio button with optional label. Use within a group to allow single selection.
 */
export function Radio({
  selected,
  label,
  onPress,
  accessibilityLabel: a11yLabel,
  disabled = false,
}: RadioProps) {
  const theme = useTheme();

  const indicator = selected ? (
    <View style={[styles.checkmark, { backgroundColor: theme.colors.primary }]}>
      <View style={[styles.checkmarkInner, { backgroundColor: theme.colors.textInverse }]} />
    </View>
  ) : (
    <View style={[styles.radio, { borderColor: theme.colors.border }]} />
  );

  if (!onPress && !label) {
    return (
      <View accessibilityRole="radio" accessibilityState={{ selected }}>
        {indicator}
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.row,
        pressed && { opacity: theme.opacity.pressed },
        disabled && { opacity: theme.opacity.disabled },
      ]}
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={a11yLabel ?? label}
    >
      {indicator}
      {label && (
        <Text style={[theme.typography.body, { color: theme.colors.textPrimary, flex: 1 }]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 44,
  },
});
