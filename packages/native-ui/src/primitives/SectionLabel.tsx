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
  /** Test ID forwarded to the wrapper. */
  testID?: string;
}

/**
 * Small uppercase label used above grouped list items (e.g. "ACCOUNT",
 * "NOTIFICATIONS" on a settings screen). Uses the `overline` typography
 * variant by default, which is tighter and tracks wider than `labelSmall`.
 *
 * Pair with `ListSection` (`<SectionLabel>Account</SectionLabel>` above the
 * section) for an iOS-style grouped settings layout. Spacing comes from
 * `theme.components.sectionLabel`.
 */
export function SectionLabel(props: SectionLabelProps) {
  const { transform = 'uppercase', color } = props;
  const theme = useTheme();
  const tokens = theme.components.sectionLabel;
  const textAppearance: TextStyle = {
    color: color ?? theme.colors.textTertiary,
    textTransform: transform === 'none' ? undefined : transform,
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: tokens.paddingHorizontal,
          marginTop: tokens.marginTop,
          marginBottom: tokens.marginBottom,
        },
        props.style,
      ]}
      testID={props.testID}
      accessibilityRole="header"
    >
      <Text style={[theme.typography.overline, textAppearance, props.textStyle]}>
        {props.children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
