import { StyleSheet, View, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';

export type ProgressBarColor = 'primary' | 'success' | 'warning' | 'error';

export interface ProgressBarProps {
  /** Progress value from 0 to 1 */
  value?: number;
  /** Alias for `value`. When both are provided, `value` wins. */
  progress?: number;
  /** Semantic color token or direct color string */
  color?: ProgressBarColor | string;
  /** Height in pixels (default: 8) */
  height?: number;
  accessibilityLabel?: string;
  style?: ViewStyle;
}

const SEMANTIC_COLORS: ProgressBarColor[] = ['primary', 'success', 'warning', 'error'];

/**
 * Horizontal progress bar with semantic color support.
 */
export function ProgressBar({
  value,
  progress,
  color = 'primary',
  height = 8,
  accessibilityLabel,
  style,
}: ProgressBarProps) {
  const theme = useTheme();
  const resolved = value ?? progress ?? 0;
  const clampedValue = Math.min(Math.max(resolved, 0), 1);

  const barColor = SEMANTIC_COLORS.includes(color as ProgressBarColor)
    ? theme.colors[color as ProgressBarColor]
    : color;

  return (
    <View
      style={[
        styles.track,
        {
          height,
          borderRadius: height / 2,
          backgroundColor: theme.colors.surfaceSecondary,
        },
        style,
      ]}
      accessibilityRole="progressbar"
      accessibilityValue={{
        min: 0,
        max: 100,
        now: Math.round(clampedValue * 100),
      }}
      accessibilityLabel={accessibilityLabel}
    >
      <View
        style={[
          styles.fill,
          {
            backgroundColor: barColor,
            width: `${clampedValue * 100}%`,
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
