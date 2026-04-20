import { useEffect, useState, useCallback } from 'react';
import {
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
  type LayoutChangeEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../theme';

export interface MarqueeTextProps {
  /** The text to render; scrolls automatically when it overflows. */
  text: string;
  /** Applied to both the hidden measurement `Text` and the visible one. */
  style?: StyleProp<TextStyle>;
  /** Applied to the outer clipping container. */
  containerStyle?: StyleProp<ViewStyle>;
  /** Scrolling speed in pixels per second. @default 30 */
  speed?: number;
  /** Pause at the start and end of each cycle (ms). @default 2000 */
  pauseDuration?: number;
  /** Gap between the end of text and the restart position (px). @default 40 */
  gap?: number;
  /** Tolerance in px; overflow smaller than this won't trigger scrolling. @default 2 */
  overflowTolerance?: number;
  accessibilityLabel?: string;
}

/**
 * A text component that auto-scrolls horizontally when the text overflows
 * its container. Falls back to static, single-line truncated text when the
 * content fits or when `reduceAnimations` is enabled in the theme.
 *
 * Measurement strategy:
 * - A hidden wrapper (width: 99999) renders the text without any width
 *   constraint so its `onLayout` reports the true intrinsic text width.
 * - The visible container's `onLayout` gives the available width.
 * - Scrolling activates only when intrinsic width > container width.
 *
 * @example
 * ```tsx
 * <MarqueeText text={veryLongTitle} style={{ fontSize: 18 }} speed={40} />
 * ```
 */
export function MarqueeText({
  text,
  style,
  containerStyle,
  speed = 30,
  pauseDuration = 2000,
  gap = 40,
  overflowTolerance = 2,
  accessibilityLabel,
}: MarqueeTextProps) {
  const { reduceAnimations } = useTheme();
  const [containerWidth, setContainerWidth] = useState(0);
  const [textWidth, setTextWidth] = useState(0);
  const translateX = useSharedValue(0);

  const overflow = textWidth - containerWidth;
  const shouldScroll =
    !reduceAnimations && containerWidth > 0 && textWidth > 0 && overflow > overflowTolerance;

  useEffect(() => {
    translateX.value = 0;

    if (!shouldScroll) return;

    const scrollDistance = overflow + gap;
    const scrollDuration = (scrollDistance / speed) * 1000;

    translateX.value = withDelay(
      pauseDuration,
      withRepeat(
        withSequence(
          withTiming(-scrollDistance, {
            duration: scrollDuration,
            easing: Easing.linear,
          }),
          withDelay(
            pauseDuration,
            withTiming(0, {
              duration: scrollDuration,
              easing: Easing.linear,
            }),
          ),
        ),
        -1,
      ),
    );
  }, [shouldScroll, overflow, speed, pauseDuration, gap, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const onContainerLayout = useCallback((e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  }, []);

  const onMeasureLayout = useCallback((e: LayoutChangeEvent) => {
    setTextWidth(e.nativeEvent.layout.width);
  }, []);

  return (
    <View
      style={[{ overflow: 'hidden' }, containerStyle]}
      onLayout={onContainerLayout}
      accessibilityLabel={accessibilityLabel ?? text}
      accessibilityRole="text"
    >
      {/* Hidden measurement layer - rendered off-visible-layout so it reports
          the intrinsic text width regardless of the container's constraints. */}
      <View
        style={{
          position: 'absolute',
          opacity: 0,
          width: 99999,
          alignItems: 'flex-start',
        }}
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <Text key={text} style={style} onLayout={onMeasureLayout}>
          {text}
        </Text>
      </View>

      {shouldScroll ? (
        <Animated.Text style={[style, animatedStyle, { width: textWidth }]} numberOfLines={1}>
          {text}
        </Animated.Text>
      ) : (
        <Text style={style} numberOfLines={1}>
          {text}
        </Text>
      )}
    </View>
  );
}
