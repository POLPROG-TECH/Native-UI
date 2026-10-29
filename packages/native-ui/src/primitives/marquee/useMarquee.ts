import { useCallback, useEffect, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';
import { planMarqueeScroll, shouldMarqueeScroll, type MarqueeScrollPlan } from '../marqueeMotion';

/** Caller overrides for the `theme.components.marqueeText` tokens. */
export interface MarqueeOptions {
  speed?: number;
  pauseDuration?: number;
  gap?: number;
  overflowTolerance?: number;
}

interface MarqueeScrollOptions {
  enabled: boolean;
  overflow: number;
  gap: number;
  speed: number;
  pauseDuration: number;
}

function useMarqueeMeasurements() {
  const [containerWidth, setContainerWidth] = useState(0);
  const [textWidth, setTextWidth] = useState(0);

  const onContainerLayout = useCallback((event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  }, []);

  const onMeasureLayout = useCallback((event: LayoutChangeEvent) => {
    setTextWidth(event.nativeEvent.layout.width);
  }, []);

  return { containerWidth, textWidth, onContainerLayout, onMeasureLayout };
}

/** Endless loop: pause, scroll left, pause, scroll back. */
function buildMarqueeLoop(plan: MarqueeScrollPlan, pauseDuration: number) {
  const scrollTo = (offset: number) =>
    withTiming(offset, { duration: plan.durationMs, easing: Easing.linear });

  return withDelay(
    pauseDuration,
    withRepeat(withSequence(scrollTo(-plan.distance), withDelay(pauseDuration, scrollTo(0))), -1),
  );
}

/** Drives the horizontal offset; resets to the start whenever the inputs change. */
function useMarqueeScroll({ enabled, overflow, gap, speed, pauseDuration }: MarqueeScrollOptions) {
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = 0;

    if (!enabled) {
      return;
    }

    translateX.value = buildMarqueeLoop(planMarqueeScroll(overflow, gap, speed), pauseDuration);
  }, [enabled, overflow, speed, pauseDuration, gap, translateX]);

  return useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
}

/**
 * Measures the text against its container and scrolls it only when it
 * overflows and the theme does not reduce animations.
 */
export function useMarquee(options: MarqueeOptions) {
  const { reduceAnimations, components } = useTheme();
  const tokens = components.marqueeText;
  const measurements = useMarqueeMeasurements();
  const { textWidth, containerWidth } = measurements;
  const overflowTolerance = options.overflowTolerance ?? tokens.overflowTolerance;
  const shouldScroll =
    !reduceAnimations && shouldMarqueeScroll(textWidth, containerWidth, overflowTolerance);
  const animatedStyle = useMarqueeScroll({
    enabled: shouldScroll,
    overflow: textWidth - containerWidth,
    gap: options.gap ?? tokens.gap,
    speed: options.speed ?? tokens.speed,
    pauseDuration: options.pauseDuration ?? tokens.pauseDurationMs,
  });

  return { ...measurements, shouldScroll, animatedStyle };
}
