import { Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { useTheme } from '../theme';
import { MarqueeMeasureLayer } from './marquee/MarqueeMeasureLayer';
import { useMarquee } from './marquee/useMarquee';

export interface MarqueeTextProps {
  /** The text to render; scrolls automatically when it overflows. */
  text: string;
  /** Applied to both the hidden measurement `Text` and the visible one. */
  style?: StyleProp<TextStyle>;
  /** Applied to the outer clipping container. */
  containerStyle?: StyleProp<ViewStyle>;
  /** Scrolling speed in pixels per second. @default theme.components.marqueeText.speed (30) */
  speed?: number;
  /** Pause at the start and end of each cycle (ms). @default theme.components.marqueeText.pauseDurationMs (2000) */
  pauseDuration?: number;
  /** Gap between the end of text and the restart position (px). @default theme.components.marqueeText.gap (40) */
  gap?: number;
  /**
   * Tolerance in px; overflow smaller than this won't trigger scrolling.
   * @default theme.components.marqueeText.overflowTolerance (2)
   */
  overflowTolerance?: number;
  accessibilityLabel?: string;
  /** Test ID forwarded to the clipping container. */
  testID?: string;
}

/**
 * A text component that auto-scrolls horizontally when the text overflows
 * its container. Falls back to static, single-line truncated text when the
 * content fits or when `reduceAnimations` is enabled in the theme.
 *
 * Measurement strategy:
 * - A hidden, unconstrained wrapper renders the text without any width
 *   constraint so its `onLayout` reports the true intrinsic text width.
 * - The visible container's `onLayout` gives the available width.
 * - Scrolling activates only when intrinsic width > container width.
 *
 * @example
 * ```tsx
 * <MarqueeText text={veryLongTitle} style={{ fontSize: 18 }} speed={40} />
 * ```
 */
export function MarqueeText(props: MarqueeTextProps) {
  const { text } = props;
  const { colors } = useTheme();
  const marquee = useMarquee(props);
  /* Theme ink first, so dark mode stays readable; the caller's style still wins. */
  const style = [{ color: colors.textPrimary }, props.style];

  return (
    <View
      style={[{ overflow: 'hidden' }, props.containerStyle]}
      onLayout={marquee.onContainerLayout}
      testID={props.testID}
      accessibilityLabel={props.accessibilityLabel ?? text}
      accessibilityRole="text"
    >
      <MarqueeMeasureLayer text={text} style={style} onLayout={marquee.onMeasureLayout} />
      {marquee.shouldScroll ? (
        <Animated.Text
          style={[style, marquee.animatedStyle, { width: marquee.textWidth }]}
          numberOfLines={1}
        >
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
