import {
  Text,
  View,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
  type StyleProp,
} from 'react-native';
import { useTheme } from '../theme';

export interface SectionLabelProps {
  /** Label text. By default rendered uppercased via `textTransform`. */
  children: string;
  /**
   * Override the default uppercase transform.
   * @default 'uppercase'
   */
  transform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
  /** Override the color; defaults to `theme.colors.textTertiary`. */
  color?: string;
  /** Wrapper style. */
  style?: StyleProp<ViewStyle>;
  /** Text style override. */
  textStyle?: StyleProp<TextStyle>;
}

/**
 * Small uppercase label used above grouped list items (e.g. "ACCOUNT",
 * "NOTIFICATIONS" on a settings screen). Uses the `overline` typography
 * variant by default, which is tighter and tracks wider than `labelSmall`.
 *
 * Pair with `ListSection` (`<SectionLabel>Account</SectionLabel>` above the
 * section) for an iOS-style grouped settings layout.
 */
export function SectionLabel({
  children,
  transform = 'uppercase',
  color,
  style,
  textStyle,
}: SectionLabelProps) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: theme.spacing.md,
          marginTop: theme.spacing.lg,
          marginBottom: theme.spacing.xs,
        },
        style,
      ]}
      accessibilityRole="header"
    >
      <Text
        style={[
          theme.typography.overline,
          {
            color: color ?? theme.colors.textTertiary,
            textTransform: transform === 'none' ? undefined : transform,
          },
          textStyle,
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
