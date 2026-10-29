import React from 'react';
import {
  Pressable,
  type GestureResponderEvent,
  type PressableProps,
  type ViewStyle,
  type StyleProp,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '../theme';
import { useFocusRing } from '../hooks/useFocusRing';

export interface PressableScaleProps extends Omit<PressableProps, 'style' | 'children'> {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /**
   * Scale factor on press.
   * @default theme.components.pressable.scaleTo (0.97)
   */
  scaleTo?: number;
  /**
   * When `true` (default), the scale animation is skipped while
   * `theme.reduceAnimations` is on. Set to `false` to keep the scale animation
   * regardless of the accessibility preference - useful for truly essential
   * affordance cues (e.g. large hero CTAs where the scale provides critical
   * "pressed" feedback).
   * @default true
   */
  respectReduceAnimations?: boolean;
}

type PressableRef = React.ComponentRef<typeof Pressable>;

/** Explicit type keeps the emitted declaration portable across React Native versions. */
type PressableScaleType = React.ForwardRefExoticComponent<
  PressableScaleProps & React.RefAttributes<PressableRef>
>;

/** Style produced by Reanimated's `useAnimatedStyle` for the press scale. */
export type PressScaleStyle = ReturnType<typeof useAnimatedStyle<ViewStyle>>;

/** What `usePressableScale` returns. */
export interface PressableScaleHookResult {
  /** Apply to an `Animated` (Reanimated) component's style. */
  animatedStyle: PressScaleStyle;
  handlers: { onPressIn: () => void; onPressOut: () => void };
}

export interface UsePressableScaleOptions {
  /** @see PressableScaleProps.respectReduceAnimations */
  respectReduceAnimations?: boolean;
}

interface PressScaleConfig {
  scaleTo: number;
  /** True when the scale animation must be skipped for reduced motion. */
  reduceMotion: boolean;
  damping: number;
  stiffness: number;
}

function usePressScaleConfig(
  scaleToProp: number | undefined,
  options?: UsePressableScaleOptions,
): PressScaleConfig {
  const { reduceAnimations, components } = useTheme();
  const tokens = components.pressable;
  const respectReduce = options?.respectReduceAnimations ?? true;

  return {
    scaleTo: scaleToProp ?? tokens.scaleTo,
    reduceMotion: respectReduce && reduceAnimations,
    damping: tokens.springDamping,
    stiffness: tokens.springStiffness,
  };
}

/**
 * Headless primitive exposing the press-scale animation used by
 * `PressableScale`: handlers plus an animated style to apply to any
 * Reanimated component.
 */
export function usePressableScale(
  scaleToProp?: number,
  options?: UsePressableScaleOptions,
): PressableScaleHookResult {
  const { scaleTo, reduceMotion, damping, stiffness } = usePressScaleConfig(scaleToProp, options);
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle<ViewStyle>(() =>
    reduceMotion ? {} : { transform: [{ scale: scale.value }] },
  );
  const springTo = (target: number) => {
    if (!reduceMotion) {
      scale.value = withSpring(target, { damping, stiffness });
    }
  };

  return {
    animatedStyle,
    handlers: { onPressIn: () => springTo(scaleTo), onPressOut: () => springTo(1) },
  };
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Runs the scale handler first, then the consumer's own press callback. */
function chainPressHandler(
  scaleHandler: () => void,
  consumerHandler: ((event: GestureResponderEvent) => void) | null | undefined,
) {
  return (event: GestureResponderEvent) => {
    scaleHandler();
    consumerHandler?.(event);
  };
}

/**
 * A pressable wrapper that applies a spring scale animation on press.
 * Respects the `reduceAnimations` theme preference by default - opt out with
 * `respectReduceAnimations={false}` when the scale is critical feedback.
 *
 * The ref reaches the underlying `Pressable`.
 */
export const PressableScale: PressableScaleType = React.forwardRef<
  PressableRef,
  PressableScaleProps
>(function PressableScale(props, ref) {
  const { children, style, onPressIn, onPressOut, onFocus, onBlur, scaleTo, ...rest } = props;
  const { respectReduceAnimations, ...pressableProps } = rest;
  const { focusProps, focusRingStyle } = useFocusRing(onFocus, onBlur);
  const { animatedStyle, handlers } = usePressableScale(scaleTo, {
    respectReduceAnimations: respectReduceAnimations ?? true,
  });

  return (
    <AnimatedPressable
      ref={ref}
      {...pressableProps}
      {...focusProps}
      onPressIn={chainPressHandler(handlers.onPressIn, onPressIn)}
      onPressOut={chainPressHandler(handlers.onPressOut, onPressOut)}
      style={[style, focusRingStyle, animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
});
