import { StyleSheet, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import type { Theme } from '../../theme/types';

/** Track container: themed inset and fill, dimmed as a whole when disabled. */
export function buildTrackStyle(
  theme: Theme,
  disabled: boolean,
  style: StyleProp<ViewStyle>,
): StyleProp<ViewStyle> {
  const tokens = theme.components.segmentedControl;

  return [
    styles.track,
    {
      padding: tokens.trackPadding,
      borderRadius: tokens.trackRadius,
      backgroundColor: tokens.trackColor ?? theme.colors.surfaceSecondary,
    },
    disabled && { opacity: theme.opacity.disabled },
    style,
  ];
}

/** One segment; the selected one is raised on the thumb fill and elevation. */
export function buildSegmentStyle(
  theme: Theme,
  selected: boolean,
  segmentStyle: StyleProp<ViewStyle>,
): StyleProp<ViewStyle> {
  const tokens = theme.components.segmentedControl;

  return [
    styles.segment,
    {
      gap: tokens.segmentGap,
      minHeight: tokens.segmentMinHeight,
      paddingVertical: tokens.segmentPaddingVertical,
      paddingHorizontal: tokens.segmentPaddingHorizontal,
      borderRadius: tokens.thumbRadius,
    },
    selected && [
      { backgroundColor: tokens.thumbColor ?? theme.colors.surfaceSelected },
      theme.elevation[tokens.thumbElevation],
    ],
    segmentStyle,
  ];
}

export function buildSegmentLabelStyle(
  theme: Theme,
  selected: boolean,
  labelStyle: StyleProp<TextStyle>,
): StyleProp<TextStyle> {
  return [
    theme.typography[theme.components.segmentedControl.labelVariant],
    { color: selected ? theme.colors.textPrimary : theme.colors.textSecondary },
    labelStyle,
  ];
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
