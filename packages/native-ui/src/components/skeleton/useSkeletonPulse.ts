import { useEffect } from 'react';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';

/**
 * Opacity pulse shared by every skeleton block. With `reduceAnimations` it
 * holds the static `reducedOpacity` instead of animating.
 */
export function useSkeletonPulse() {
  const theme = useTheme();
  const { opacityFrom, opacityTo, reducedOpacity, pulseDurationMs } = theme.components.skeleton;
  const shimmerOpacity = useSharedValue(opacityFrom);

  useEffect(() => {
    if (theme.reduceAnimations) {
      shimmerOpacity.value = reducedOpacity;

      return;
    }

    /*
     * The reverse leg returns to the value the animation started from, so start
     * at `opacityFrom` (also after `reduceAnimations` turns off) to keep the range.
     */
    shimmerOpacity.value = opacityFrom;
    shimmerOpacity.value = withRepeat(
      withTiming(opacityTo, { duration: pulseDurationMs, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [
    shimmerOpacity,
    theme.reduceAnimations,
    opacityFrom,
    opacityTo,
    reducedOpacity,
    pulseDurationMs,
  ]);

  return useAnimatedStyle(() => ({
    opacity: shimmerOpacity.value,
  }));
}
