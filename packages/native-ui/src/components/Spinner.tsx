import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../theme';

export interface SpinnerProps {
  /** Optional loading label shown below the spinner */
  label?: string;
  /** Spinner size (default: 'large') */
  size?: 'small' | 'large';
  /** Accessible name; defaults to `label`, then to "Loading". */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

function SpinnerLabel({ label }: { label: string }) {
  const theme = useTheme();

  return (
    <Text
      style={[
        theme.typography.body,
        {
          color: theme.colors.textSecondary,
          marginTop: theme.components.spinner.labelMarginTop,
        },
      ]}
    >
      {label}
    </Text>
  );
}

/**
 * Full-screen centered loading spinner with optional label.
 */
export function Spinner({
  label,
  size = 'large',
  accessibilityLabel,
  style,
  testID,
}: SpinnerProps) {
  const theme = useTheme();

  return (
    <View
      testID={testID}
      style={[styles.container, { backgroundColor: theme.colors.background }, style]}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel ?? label ?? theme.labels.loadingIndicator}
      accessibilityLiveRegion="polite"
    >
      <ActivityIndicator size={size} color={theme.colors.primary} />
      {label && <SpinnerLabel label={label} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
