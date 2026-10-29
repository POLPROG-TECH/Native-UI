import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { ProgressFill } from './progressBar/ProgressFill';
import { clampProgress, progressAccessibilityValue } from './progressBar/progressValue';

export type ProgressBarColor = 'primary' | 'success' | 'warning' | 'error';

export interface ProgressBarProps {
  /** Progress value from 0 to 1 */
  value?: number;
  /** Alias for `value`. When both are provided, `value` wins. */
  progress?: number;
  /** Semantic color token or direct color string */
  color?: ProgressBarColor | string;
  /** Height in points. @default theme.components.progressBar.height (8) */
  height?: number;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  /** Test ID of the track; the fill receives `{testID}-fill`. */
  testID?: string;
}

const SEMANTIC_COLORS: readonly ProgressBarColor[] = ['primary', 'success', 'warning', 'error'];

function isSemanticColor(color: string): color is ProgressBarColor {
  return (SEMANTIC_COLORS as readonly string[]).includes(color);
}

/** Pill-shaped track: the radius is half the height. */
function trackStyle(height: number, backgroundColor: string): ViewStyle {
  return { height, borderRadius: height / 2, backgroundColor };
}

/**
 * Horizontal progress bar with semantic color support.
 */
export function ProgressBar({
  value,
  progress,
  color = 'primary',
  height: heightProp,
  accessibilityLabel,
  style,
  testID,
}: ProgressBarProps) {
  const theme = useTheme();
  const height = heightProp ?? theme.components.progressBar.height;
  const fraction = clampProgress(value ?? progress ?? 0);

  return (
    <View
      testID={testID}
      style={[styles.track, trackStyle(height, theme.colors.controlTrack), style]}
      accessibilityRole="progressbar"
      accessibilityValue={progressAccessibilityValue(fraction)}
      accessibilityLabel={accessibilityLabel}
    >
      <ProgressFill
        fraction={fraction}
        color={isSemanticColor(color) ? theme.colors[color] : color}
        height={height}
        testID={testID ? `${testID}-fill` : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    overflow: 'hidden',
  },
});
