import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme } from '../../theme';

interface TabIndicatorProps {
  readonly active: boolean;
  readonly testID?: string;
}

/** 0 while the tab is inactive, 1 while active; eased between the two unless motion is reduced. */
function useIndicatorProgress(active: boolean) {
  const theme = useTheme();
  const durationMs = theme.components.bottomTabBar.indicatorDurationMs;
  const animated = !theme.reduceAnimations;
  const progress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    const target = active ? 1 : 0;
    progress.value = animated ? withTiming(target, { duration: durationMs }) : target;
  }, [active, animated, durationMs, progress]);

  return progress;
}

/**
 * Pill behind the icon of the active tab. Every tab keeps one mounted so the
 * outgoing pill can shrink and fade while the incoming one grows from the
 * icon centre, as in Material 3 navigation bars.
 */
export function TabIndicator({ active, testID }: TabIndicatorProps) {
  const theme = useTheme();
  const tokens = theme.components.bottomTabBar;
  const progress = useIndicatorProgress(active);
  const fullWidth = tokens.indicatorWidth;
  const animatedStyle = useAnimatedStyle(() => ({
    width: fullWidth * progress.value,
    opacity: progress.value,
  }));
  const shapeStyle = {
    height: tokens.indicatorHeight,
    borderRadius: tokens.indicatorRadius,
    backgroundColor: tokens.indicatorColor ?? theme.colors.primaryLight,
  };

  return (
    <Animated.View
      testID={testID}
      pointerEvents="none"
      style={[styles.pill, shapeStyle, animatedStyle]}
    />
  );
}

const styles = StyleSheet.create({
  /*
   * No insets: the icon box centres absolutely positioned children on both
   * axes, so the pill stays centred while its width animates.
   */
  pill: {
    position: 'absolute',
  },
});
