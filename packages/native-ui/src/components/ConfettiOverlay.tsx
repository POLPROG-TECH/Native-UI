import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../theme';

const DEFAULT_COLORS = [
  '#FF6B6B',
  '#FECA57',
  '#4DA6FF',
  '#34D399',
  '#C084FC',
  '#FF9F43',
  '#F472B6',
  '#2DD4BF',
];

export interface ConfettiOverlayProps {
  /** Triggers the burst when it transitions from `false` to `true`. */
  visible: boolean;
  /**
   * Total number of confetti pieces rendered.
   * @default 40
   */
  particleCount?: number;
  /**
   * How long the overlay remains visible before auto-hiding (ms).
   * @default 3000
   */
  duration?: number;
  /**
   * Color palette; pieces are picked round-robin.
   * @default ['#FF6B6B','#FECA57','#4DA6FF','#34D399','#C084FC','#FF9F43','#F472B6','#2DD4BF']
   */
  colors?: readonly string[];
  /** Called when the overlay auto-hides. */
  onComplete?: () => void;
  /**
   * When `true`, overrides `theme.reduceAnimations` and forces the burst to
   * render. Useful for celebration moments where motion is the point; leave
   * `false` (default) to honor the accessibility preference.
   * @default false
   */
  forceAnimation?: boolean;
}

function ConfettiPiece({
  index,
  screenW,
  screenH,
  colors,
}: {
  index: number;
  screenW: number;
  screenH: number;
  colors: readonly string[];
}) {
  const x = useSharedValue(Math.random() * screenW);
  const y = useSharedValue(-20 - Math.random() * 100);
  const rotate = useSharedValue(Math.random() * 360);
  const opacity = useSharedValue(1);
  const size = 6 + Math.random() * 8;
  const color = colors[index % colors.length];
  const isCircle = index % 3 === 0;
  const drift = (Math.random() - 0.5) * screenW * 0.5;
  const delay = Math.random() * 600;

  useEffect(() => {
    y.value = withDelay(
      delay,
      withTiming(screenH + 50, {
        duration: 2200 + Math.random() * 1000,
        easing: Easing.in(Easing.quad),
      }),
    );
    x.value = withDelay(
      delay,
      withTiming(x.value + drift, { duration: 2200 + Math.random() * 1000 }),
    );
    rotate.value = withDelay(
      delay,
      withTiming(rotate.value + 360 + Math.random() * 720, { duration: 2500 }),
    );
    opacity.value = withDelay(delay + 1800, withTiming(0, { duration: 400 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    left: x.value,
    top: y.value,
    width: size,
    height: isCircle ? size : size * 1.5,
    borderRadius: isCircle ? size / 2 : 2,
    backgroundColor: color,
    transform: [{ rotate: `${rotate.value}deg` }],
    opacity: opacity.value,
  }));

  return <Animated.View style={style} />;
}

/**
 * Celebratory confetti burst overlay. Mount once near the root of a screen and
 * toggle `visible` to fire it. The overlay ignores pointer events so it never
 * blocks user interaction.
 *
 * Honors `theme.reduceAnimations` by default - pass `forceAnimation` to opt
 * out when the animation is essential to the moment being celebrated.
 *
 * @example
 * ```tsx
 * <ConfettiOverlay
 *   visible={justCompletedGoal}
 *   duration={2500}
 *   onComplete={() => setJustCompletedGoal(false)}
 * />
 * ```
 */
export function ConfettiOverlay({
  visible,
  particleCount = 40,
  duration = 3000,
  colors = DEFAULT_COLORS,
  onComplete,
  forceAnimation = false,
}: ConfettiOverlayProps) {
  const { width: screenW, height: screenH } = useWindowDimensions();
  const { reduceAnimations } = useTheme();
  const [show, setShow] = useState(false);
  const [burstKey, setBurstKey] = useState(0);

  const pieces = useMemo(() => Array.from({ length: particleCount }, (_, i) => i), [particleCount]);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!visible) return;
    if (reduceAnimations && !forceAnimation) {
      onCompleteRef.current?.();
      return;
    }
    setBurstKey((k) => k + 1);
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
      onCompleteRef.current?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [visible, reduceAnimations, forceAnimation, duration]);

  if (!show) return null;

  return (
    <Animated.View style={styles.container} pointerEvents="none">
      {pieces.map((i) => (
        <ConfettiPiece
          key={`${burstKey}-${i}`}
          index={i}
          screenW={screenW}
          screenH={screenH}
          colors={colors}
        />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
});
