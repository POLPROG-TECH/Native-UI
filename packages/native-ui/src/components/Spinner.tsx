import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

export interface SpinnerProps {
  /** Optional loading label shown below the spinner */
  label?: string;
  /** Spinner size (default: 'large') */
  size?: 'small' | 'large';
}

/**
 * Full-screen centered loading spinner with optional label.
 */
export function Spinner({ label, size = 'large' }: SpinnerProps) {
  const theme = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      accessibilityRole="progressbar"
      accessibilityLabel={label ?? 'Loading'}
      accessibilityLiveRegion="polite"
    >
      <ActivityIndicator size={size} color={theme.colors.primary} />
      {label && (
        <Text style={[theme.typography.body, { color: theme.colors.textSecondary, marginTop: 12 }]}>
          {label}
        </Text>
      )}
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
