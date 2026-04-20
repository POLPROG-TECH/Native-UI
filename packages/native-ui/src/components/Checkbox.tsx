import { useCallback } from 'react';
import { StyleSheet, View, Text, Pressable, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { getHaptics } from '../utils/haptics';

export interface CheckboxProps {
  /** Whether the checkbox is checked */
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Label displayed next to the checkbox */
  label?: string;
  disabled?: boolean;
  /** Size (default: 'md') */
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

/**
 * A checkbox with optional label. Accessible and theme-aware.
 */
export function Checkbox({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
  style,
}: CheckboxProps) {
  const theme = useTheme();

  const handlePress = useCallback(() => {
    getHaptics().light();
    onChange(!checked);
  }, [checked, onChange]);

  const dim = size === 'sm' ? 18 : 20;
  const radius = size === 'sm' ? 4 : 5;

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.row,
        pressed && { opacity: theme.opacity.pressed },
        disabled && { opacity: theme.opacity.disabled },
        style,
      ]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={label}
    >
      <View
        style={[
          styles.box,
          {
            width: dim,
            height: dim,
            borderRadius: radius,
            borderColor: checked ? theme.colors.primary : theme.colors.border,
            backgroundColor: checked ? theme.colors.primary : 'transparent',
            borderWidth: checked ? 0 : 1.5,
          },
        ]}
      >
        {checked && (
          <Text
            style={{
              color: theme.colors.textInverse,
              fontSize: dim * 0.72,
              lineHeight: dim,
              fontWeight: '700',
            }}
          >
            ✓
          </Text>
        )}
      </View>
      {label && (
        <Text style={[theme.typography.body, { color: theme.colors.textPrimary, flex: 1 }]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 44,
  },
  box: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
