import { useEffect } from 'react';
import { View, StyleSheet, type DimensionValue, type ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../theme';

export interface SkeletonProps {
  width: DimensionValue;
  height: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
}

/**
 * Animated skeleton loading placeholder. Respects `reduceAnimations`.
 * Defaults to `borderRadius.md` (14) so it blends with typical cards.
 *
 * Also exposes `Skeleton.Card` - a bordered card-shaped preset useful while
 * list items or dashboard widgets are loading.
 */
function SkeletonBase({ width, height, borderRadius: radius, style }: SkeletonProps) {
  const theme = useTheme();
  const shimmerOpacity = useSharedValue(0.3);

  useEffect(() => {
    if (theme.reduceAnimations) {
      shimmerOpacity.value = 0.5;
      return;
    }
    shimmerOpacity.value = withRepeat(
      withTiming(0.7, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [shimmerOpacity, theme.reduceAnimations]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: shimmerOpacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: theme.colors.surfaceSecondary,
          borderRadius: radius ?? theme.borderRadius.md,
        },
        animStyle,
        style,
      ]}
      accessibilityLabel="Loading content"
      accessibilityElementsHidden
    />
  );
}

export interface SkeletonCardProps {
  /**
   * Number of body lines rendered beneath the title bar. Defaults to `2`.
   */
  lines?: number;
  /** Optional override for the card container. */
  style?: ViewStyle;
  /**
   * When `true`, renders a square avatar placeholder on the leading side
   * (useful for list-item skeletons). Defaults to `false`.
   */
  withAvatar?: boolean;
}

/**
 * Preset card-shaped skeleton - a bordered container with a title bar and a
 * configurable number of body lines. Plays well inside a `ListSection` while
 * data is loading.
 *
 * @example
 * ```tsx
 * {loading ? <SkeletonCard lines={3} /> : <RealContent />}
 * ```
 */
export function SkeletonCard({ lines = 2, style, withAvatar = false }: SkeletonCardProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        cardStyles.card,
        {
          padding: theme.spacing.md,
          borderRadius: theme.borderRadius.lg,
          backgroundColor: theme.colors.surfaceSecondary,
          gap: theme.spacing.sm,
        },
        style,
      ]}
      accessible
      accessibilityLabel="Loading content"
      accessibilityRole="progressbar"
    >
      {withAvatar ? (
        <View style={[cardStyles.row, { gap: theme.spacing.sm }]}>
          <SkeletonBase width={40} height={40} borderRadius={theme.borderRadius.full} />
          <View style={{ flex: 1, gap: theme.spacing.xs }}>
            <SkeletonBase width="60%" height={14} />
            <SkeletonBase width="40%" height={12} />
          </View>
        </View>
      ) : (
        <SkeletonBase width="55%" height={16} />
      )}
      {Array.from({ length: Math.max(0, lines) }).map((_, i) => (
        <SkeletonBase key={i} width={i === lines - 1 ? '75%' : '100%'} height={12} />
      ))}
    </View>
  );
}

/**
 * Animated skeleton placeholder. `Skeleton.Card` is attached as a static for
 * the preset card-shaped variant.
 */
export const Skeleton = Object.assign(SkeletonBase, { Card: SkeletonCard });

const cardStyles = StyleSheet.create({
  card: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
