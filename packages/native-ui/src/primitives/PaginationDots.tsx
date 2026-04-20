import React from 'react';
import { View, StyleSheet, type ViewStyle, type StyleProp } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme } from '../theme';

export interface PaginationDotsProps {
  /** Total number of dots (typically number of pages or steps). */
  count: number;
  /** Zero-based index of the currently active dot. */
  current: number;
  /** Width of inactive dots. @default 5 */
  dotWidth?: number;
  /** Width of the active (elongated) dot. @default 16 */
  activeWidth?: number;
  /** Height (and inactive radius) of each dot. @default 5 */
  height?: number;
  /** Gap between dots. @default 6 */
  gap?: number;
  /** Inactive dot color. Defaults to `theme.colors.borderStrong`. */
  color?: string;
  /** Active dot color. Defaults to `theme.colors.primary`. */
  activeColor?: string;
  /** Animate the width/color transitions. @default true */
  animated?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Accessibility label for the whole dots group. */
  accessibilityLabel?: string;
}

/**
 * Row of dots indicating progress or current page in a paginated view.
 * The active dot expands horizontally and uses the accent color.
 *
 * Respects `theme.reduceAnimations` - animation is disabled automatically when
 * the user has reduce-motion enabled, or when `animated={false}`.
 *
 * @example
 * ```tsx
 * <PaginationDots count={pages.length} current={pageIndex} />
 * ```
 */
export function PaginationDots({
  count,
  current,
  dotWidth = 5,
  activeWidth = 16,
  height = 5,
  gap = 6,
  color,
  activeColor,
  animated = true,
  style,
  accessibilityLabel,
}: PaginationDotsProps) {
  const theme = useTheme();
  const inactiveColor = color ?? theme.colors.border;
  const activeFill = activeColor ?? theme.colors.primary;

  return (
    <View
      style={[styles.row, { gap }, style]}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel ?? `Step ${Math.min(current + 1, count)} of ${count}`}
      accessibilityValue={{ min: 0, max: Math.max(count - 1, 0), now: current }}
    >
      {Array.from({ length: count }, (_, i) => (
        <Dot
          key={i}
          isActive={i === current}
          dotWidth={dotWidth}
          activeWidth={activeWidth}
          height={height}
          color={inactiveColor}
          activeColor={activeFill}
          animated={animated && !theme.reduceAnimations}
        />
      ))}
    </View>
  );
}

function Dot({
  isActive,
  dotWidth,
  activeWidth,
  height,
  color,
  activeColor,
  animated,
}: {
  isActive: boolean;
  dotWidth: number;
  activeWidth: number;
  height: number;
  color: string;
  activeColor: string;
  animated: boolean;
}) {
  const progress = useSharedValue(isActive ? 1 : 0);

  React.useEffect(() => {
    const target = isActive ? 1 : 0;
    progress.value = animated ? withTiming(target, { duration: 220 }) : target;
  }, [isActive, animated, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: dotWidth + (activeWidth - dotWidth) * progress.value,
  }));

  return (
    <Animated.View
      style={[
        {
          height,
          borderRadius: height / 2,
          backgroundColor: isActive ? activeColor : color,
        },
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
