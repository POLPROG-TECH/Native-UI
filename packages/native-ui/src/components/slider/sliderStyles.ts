import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import type { Theme } from '../../theme/types';

const PERCENT = 100;

export function buildRowStyle(
  theme: Theme,
  disabled: boolean,
  style: StyleProp<ViewStyle>,
): StyleProp<ViewStyle> {
  return [
    styles.row,
    { minHeight: theme.components.slider.minHeight },
    disabled && { opacity: theme.opacity.disabled },
    style,
  ];
}

/** Inset by half a thumb on each side, so the thumb center reaches both ends. */
export function buildTrackStyle(theme: Theme): ViewStyle {
  const tokens = theme.components.slider;

  return {
    height: tokens.trackHeight,
    borderRadius: tokens.trackHeight / 2,
    marginHorizontal: tokens.thumbSize / 2,
    backgroundColor: theme.colors.controlTrack,
  };
}

export function buildFillStyle(
  theme: Theme,
  fraction: number,
  color: string | undefined,
): ViewStyle {
  const tokens = theme.components.slider;

  return {
    width: `${fraction * PERCENT}%`,
    borderRadius: tokens.trackHeight / 2,
    backgroundColor: color ?? tokens.fillColor ?? theme.colors.primary,
  };
}

/**
 * The percentage places the thumb's leading edge along the full row and the
 * negative margin pulls it back by the same share of its own width, which
 * together equal `fraction * (rowWidth - thumbSize)` without measuring the row.
 */
export function buildThumbStyle(theme: Theme, fraction: number): StyleProp<ViewStyle> {
  const tokens = theme.components.slider;

  return [
    styles.thumb,
    theme.elevation[tokens.thumbElevation],
    {
      width: tokens.thumbSize,
      height: tokens.thumbSize,
      borderRadius: tokens.thumbSize / 2,
      borderWidth: tokens.thumbBorderWidth,
      borderColor: theme.colors.controlBorder,
      backgroundColor: theme.colors.controlThumb,
      start: `${fraction * PERCENT}%`,
      marginStart: -fraction * tokens.thumbSize,
    },
  ];
}

export const styles = StyleSheet.create({
  row: {
    justifyContent: 'center',
  },
  /* Touches go to the row, so `locationX` is always measured against it. */
  untouchable: {
    pointerEvents: 'none',
  },
  fill: {
    height: '100%',
  },
  thumb: {
    position: 'absolute',
    pointerEvents: 'none',
  },
});
