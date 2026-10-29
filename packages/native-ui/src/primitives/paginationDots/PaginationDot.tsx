import { useEffect } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import type { Theme } from '../../theme/types';

/** Resolved look shared by every dot in a row. */
export interface DotAppearance {
  dotWidth: number;
  activeWidth: number;
  height: number;
  color: string;
  activeColor: string;
  durationMs: number;
  animated: boolean;
}

/** Caller overrides; anything unset falls back to theme tokens and colors. */
export interface DotAppearanceOverrides {
  dotWidth?: number;
  activeWidth?: number;
  height?: number;
  color?: string;
  activeColor?: string;
  animated?: boolean;
}

/** Applies token defaults; animation is off when the theme reduces motion. */
export function resolveDotAppearance(
  theme: Theme,
  overrides: DotAppearanceOverrides,
): DotAppearance {
  const tokens = theme.components.paginationDots;

  return {
    dotWidth: overrides.dotWidth ?? tokens.dotWidth,
    activeWidth: overrides.activeWidth ?? tokens.activeWidth,
    height: overrides.height ?? tokens.height,
    color: overrides.color ?? theme.colors.border,
    activeColor: overrides.activeColor ?? theme.colors.primary,
    durationMs: tokens.durationMs,
    animated: (overrides.animated ?? true) && !theme.reduceAnimations,
  };
}

/** 0 for an inactive dot, 1 for the active one; animated between the two. */
function useDotProgress(isActive: boolean, appearance: DotAppearance) {
  const { animated, durationMs } = appearance;
  const progress = useSharedValue(isActive ? 1 : 0);

  useEffect(() => {
    const target = isActive ? 1 : 0;
    progress.value = animated ? withTiming(target, { duration: durationMs }) : target;
  }, [isActive, animated, durationMs, progress]);

  return progress;
}

export interface PaginationDotProps {
  isActive: boolean;
  appearance: DotAppearance;
}

/** One dot; the active dot stretches from `dotWidth` to `activeWidth`. */
export function PaginationDot({ isActive, appearance }: PaginationDotProps) {
  const { dotWidth, activeWidth, height } = appearance;
  const progress = useDotProgress(isActive, appearance);
  const animatedStyle = useAnimatedStyle(() => ({
    width: dotWidth + (activeWidth - dotWidth) * progress.value,
  }));

  return (
    <Animated.View
      style={[
        {
          height,
          borderRadius: height / 2,
          backgroundColor: isActive ? appearance.activeColor : appearance.color,
        },
        animatedStyle,
      ]}
    />
  );
}
