import { StyleSheet, View, Text, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';

export type BadgeVariant = 'primary' | 'error' | 'warning' | 'success' | 'info';

export interface BadgeProps {
  /** Number to display. If omitted (and no `label`), renders as a dot. */
  count?: number;
  /** Text label to display instead of a numeric count. Takes priority over `count`. */
  label?: string;
  variant?: BadgeVariant;
  /** Maximum count to display (shows "N+" above) */
  max?: number;
  /** Hide when count is 0 (default: true) */
  hideZero?: boolean;
  style?: ViewStyle;
}

/**
 * Numeric badge, text label, or status dot indicator.
 */
export function Badge({
  count,
  label,
  variant = 'error',
  max = 99,
  hideZero = true,
  style,
}: BadgeProps) {
  const theme = useTheme();

  if (label === undefined && count !== undefined && count <= 0 && hideZero) return null;

  const bgColor = theme.colors[variant];
  const isDot = label === undefined && count === undefined;

  if (isDot) {
    return (
      <View style={[styles.dot, { backgroundColor: bgColor }, style]} accessibilityElementsHidden />
    );
  }

  const displayText = label !== undefined ? label : count! > max ? `${max}+` : String(count);

  return (
    <View
      style={[styles.badge, { backgroundColor: bgColor }, style]}
      accessibilityLabel={displayText}
    >
      <Text style={[styles.text, { color: theme.colors.textInverse }]}>{displayText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 14,
  },
});
