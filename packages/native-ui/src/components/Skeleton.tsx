import {
  View,
  StyleSheet,
  type DimensionValue,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useTheme } from '../theme';
import { useSkeletonPulse } from './skeleton/useSkeletonPulse';

export interface SkeletonProps {
  width: DimensionValue;
  height: DimensionValue;
  /** @default theme.components.skeleton.radius (`borderRadius.md`) */
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  /**
   * Accessible name announced while content loads.
   * @default labels.loading from `NativeUIConfig.labels`
   */
  accessibilityLabel?: string;
}

/**
 * Animated skeleton loading placeholder. Respects `reduceAnimations`.
 * Defaults to `theme.components.skeleton.radius` (`borderRadius.md`) so it
 * blends with typical cards.
 *
 * Also exposes `Skeleton.Card` - a bordered card-shaped preset useful while
 * list items or dashboard widgets are loading.
 */
function SkeletonBase({
  width,
  height,
  borderRadius,
  style,
  testID,
  accessibilityLabel,
}: SkeletonProps) {
  const theme = useTheme();
  const pulseStyle = useSkeletonPulse();

  return (
    <Animated.View
      testID={testID}
      style={[
        {
          width,
          height,
          backgroundColor: theme.colors.surfaceSecondary,
          borderRadius: borderRadius ?? theme.components.skeleton.radius,
        },
        pulseStyle,
        style,
      ]}
      accessibilityLabel={accessibilityLabel ?? theme.labels.loading}
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
  style?: StyleProp<ViewStyle>;
  testID?: string;
  /**
   * When `true`, renders a square avatar placeholder on the leading side
   * (useful for list-item skeletons). Defaults to `false`.
   */
  withAvatar?: boolean;
  /**
   * Accessible name announced while content loads.
   * @default labels.loading from `NativeUIConfig.labels`
   */
  accessibilityLabel?: string;
}

/** Leading avatar circle with title and subtitle bars, for list-item cards. */
function SkeletonAvatarHeader() {
  const theme = useTheme();
  const tokens = theme.components.skeletonCard;

  return (
    <View style={[cardStyles.row, { gap: tokens.gap }]}>
      <SkeletonBase
        width={tokens.avatarSize}
        height={tokens.avatarSize}
        borderRadius={theme.borderRadius.full}
      />
      <View style={[cardStyles.text, { gap: tokens.avatarTextGap }]}>
        <SkeletonBase width={tokens.avatarTitleWidth} height={tokens.avatarTitleHeight} />
        <SkeletonBase width={tokens.avatarSubtitleWidth} height={tokens.avatarSubtitleHeight} />
      </View>
    </View>
  );
}

/** Full-width body lines; the last one is shorter, like a paragraph end. */
function SkeletonBodyLines({ count }: { count: number }) {
  const tokens = useTheme().components.skeletonCard;

  return Array.from({ length: Math.max(0, count) }).map((_, index) => (
    <SkeletonBase
      key={index}
      width={index === count - 1 ? tokens.lastLineWidth : '100%'}
      height={tokens.lineHeight}
    />
  ));
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
export function SkeletonCard(props: SkeletonCardProps) {
  const { lines = 2, withAvatar = false } = props;
  const theme = useTheme();
  const tokens = theme.components.skeletonCard;

  return (
    <View
      testID={props.testID}
      style={[
        cardStyles.card,
        {
          padding: tokens.padding,
          borderRadius: tokens.radius,
          backgroundColor: theme.colors.surfaceSecondary,
          gap: tokens.gap,
        },
        props.style,
      ]}
      accessible
      accessibilityLabel={props.accessibilityLabel ?? theme.labels.loading}
      accessibilityRole="progressbar"
    >
      {withAvatar ? (
        <SkeletonAvatarHeader />
      ) : (
        <SkeletonBase width={tokens.titleWidth} height={tokens.titleHeight} />
      )}
      <SkeletonBodyLines count={lines} />
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
  text: {
    flex: 1,
  },
});
