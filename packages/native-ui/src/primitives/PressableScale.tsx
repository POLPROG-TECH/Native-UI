import React from 'react';
import {
  Pressable,
  Animated,
  Platform,
  type PressableProps,
  type ViewStyle,
  type StyleProp,
} from 'react-native';
import { useTheme } from '../theme';

// ─── Optional reanimated integration ──────────────────────────────
// If `react-native-reanimated` is installed, we use its spring-based
// animation for richer feel. Otherwise we fall back to core RN's
// `Animated` API so consumers don't need to pull in reanimated.
type ReanimatedModule = {
  default: typeof import('react-native-reanimated').default;
  useSharedValue: typeof import('react-native-reanimated').useSharedValue;
  useAnimatedStyle: typeof import('react-native-reanimated').useAnimatedStyle;
  withSpring: typeof import('react-native-reanimated').withSpring;
};

let reanimated: ReanimatedModule | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const rn = require('react-native-reanimated') as ReanimatedModule;
  if (rn && rn.default && typeof rn.useSharedValue === 'function') reanimated = rn;
} catch {
  reanimated = null;
}

export interface PressableScaleProps extends Omit<PressableProps, 'style' | 'children'> {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Scale factor on press (default: 0.97) */
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

/**
 * Headless primitive exposing the press-scale animation logic used by
 * `PressableScale`. Returns the handlers and an animated style that consumers
 * can apply to any custom element. Uses `react-native-reanimated` when
 * available, and falls back to core RN `Animated` otherwise.
 */
type PressableScaleHookResult = {
  animatedStyle: StyleProp<ViewStyle>;
  handlers: { onPressIn: () => void; onPressOut: () => void };
  isReanimated: boolean;
};

export interface UsePressableScaleOptions {
  /** @see PressableScaleProps.respectReduceAnimations */
  respectReduceAnimations?: boolean;
}

function usePressableScaleReanimated(
  scaleTo: number,
  options?: UsePressableScaleOptions,
): PressableScaleHookResult {
  const { reduceAnimations } = useTheme();
  const respectReduce = options?.respectReduceAnimations ?? true;
  const effectiveReduce = respectReduce && reduceAnimations;
  const rn = reanimated!;
  const scale = rn.useSharedValue(1);
  const animatedStyle = rn.useAnimatedStyle(() => {
    if (effectiveReduce) return {};
    return { transform: [{ scale: scale.value }] };
  });
  return {
    animatedStyle: animatedStyle as unknown as StyleProp<ViewStyle>,
    handlers: {
      onPressIn: () => {
        if (!effectiveReduce) {
          scale.value = rn.withSpring(scaleTo, { damping: 15, stiffness: 400 });
        }
      },
      onPressOut: () => {
        if (!effectiveReduce) {
          scale.value = rn.withSpring(1, { damping: 15, stiffness: 400 });
        }
      },
    },
    isReanimated: true,
  };
}

function usePressableScaleFallback(
  scaleTo: number,
  options?: UsePressableScaleOptions,
): PressableScaleHookResult {
  const { reduceAnimations } = useTheme();
  const respectReduce = options?.respectReduceAnimations ?? true;
  const effectiveReduce = respectReduce && reduceAnimations;
  // Lazy-init pattern: `useRef(new Animated.Value(1))` would allocate a
  // fresh `Animated.Value` on every render and throw away all but the
  // first. `Animated.Value` registers a native-driver listener, so the
  // thrown-away instances still create bridge traffic until GC. This
  // creates the value exactly once per component instance.
  const scaleRef = React.useRef<Animated.Value | null>(null);
  if (scaleRef.current === null) scaleRef.current = new Animated.Value(1);
  const scale = scaleRef.current;
  const animatedStyle: StyleProp<ViewStyle> = effectiveReduce
    ? undefined
    : { transform: [{ scale }] };
  return {
    animatedStyle,
    handlers: {
      onPressIn: () => {
        if (!effectiveReduce) {
          Animated.spring(scale, {
            toValue: scaleTo,
            useNativeDriver: Platform.OS !== 'web',
            damping: 15,
            stiffness: 400,
          }).start();
        }
      },
      onPressOut: () => {
        if (!effectiveReduce) {
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: Platform.OS !== 'web',
            damping: 15,
            stiffness: 400,
          }).start();
        }
      },
    },
    isReanimated: false,
  };
}

/**
 * Headless primitive exposing the press-scale animation logic used by
 * `PressableScale`. Returns the handlers and an animated style that consumers
 * can apply to any custom element. Uses `react-native-reanimated` when
 * available, and falls back to core RN `Animated` otherwise.
 *
 * The implementation is selected at module load time, so hook order remains
 * stable across renders regardless of which backend is used.
 */
export const usePressableScale: (
  scaleTo?: number,
  options?: UsePressableScaleOptions,
) => PressableScaleHookResult = reanimated
  ? (scaleTo = 0.97, options) => usePressableScaleReanimated(scaleTo, options)
  : (scaleTo = 0.97, options) => usePressableScaleFallback(scaleTo, options);

const AnimatedPressableReanimated = reanimated
  ? reanimated.default.createAnimatedComponent(Pressable)
  : null;
const AnimatedPressableFallback = Animated.createAnimatedComponent(Pressable);

/**
 * A pressable wrapper that applies a spring scale animation on press.
 * Respects the `reduceAnimations` theme preference by default - opt out with
 * `respectReduceAnimations={false}` when the scale is critical feedback.
 *
 * Works with or without `react-native-reanimated` installed.
 *
 * Ref forwarding: uses `React.forwardRef` so the ref prop is honoured on
 * both React 18 and React 19. Declaring `ref` as a plain prop (React 19
 * API) would silently drop the ref on React 18 consumers.
 */
export const PressableScale = React.forwardRef<PressableRef, PressableScaleProps>(
  function PressableScale(
    {
      children,
      style,
      onPress,
      onPressIn,
      onPressOut,
      scaleTo = 0.97,
      respectReduceAnimations = true,
      ...rest
    },
    ref,
  ) {
    const { animatedStyle, handlers, isReanimated } = usePressableScale(scaleTo, {
      respectReduceAnimations,
    });
    const AnimatedPressable =
      (isReanimated && AnimatedPressableReanimated) || AnimatedPressableFallback;

    return (
      <AnimatedPressable
        ref={ref as React.Ref<PressableRef>}
        {...rest}
        onPress={onPress}
        onPressIn={(e) => {
          handlers.onPressIn();
          onPressIn?.(e);
        }}
        onPressOut={(e) => {
          handlers.onPressOut();
          onPressOut?.(e);
        }}
        style={[...(Array.isArray(style) ? style : style ? [style] : []), animatedStyle]}
      >
        {children}
      </AnimatedPressable>
    );
  },
);
