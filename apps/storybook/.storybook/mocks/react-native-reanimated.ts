/**
 * Lightweight web mock for react-native-reanimated.
 * Provides the subset of APIs used by native-ui components
 * with CSS-transition-based fallbacks for web rendering.
 */

import { useRef, useCallback, useMemo } from 'react';

// ─── Shared Values ──────────────────────────────────────────────
export function useSharedValue<T>(initialValue: T) {
  const ref = useRef({ value: initialValue });
  return ref.current;
}

// ─── Animated Style ─────────────────────────────────────────────
export function useAnimatedStyle(updater: () => any, deps?: any[]) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => updater(), deps ?? []);
}

// ─── Timing / Spring ────────────────────────────────────────────
export function withTiming(toValue: number, config?: any, callback?: any) {
  if (callback) callback(true);
  return toValue;
}

export function withSpring(toValue: number, config?: any, callback?: any) {
  if (callback) callback(true);
  return toValue;
}

export function withDelay(delay: number, animation: any) {
  return animation;
}

export function withSequence(...animations: any[]) {
  return animations[animations.length - 1];
}

export function withRepeat(animation: any, _count?: number, _reverse?: boolean) {
  return animation;
}

// ─── Interpolation ──────────────────────────────────────────────
export function interpolate(value: number, inputRange: number[], outputRange: number[]) {
  if (inputRange.length < 2 || outputRange.length < 2) return outputRange[0] ?? 0;
  const ratio = (value - inputRange[0]) / (inputRange[inputRange.length - 1] - inputRange[0]);
  const clamped = Math.max(0, Math.min(1, ratio));
  return outputRange[0] + clamped * (outputRange[outputRange.length - 1] - outputRange[0]);
}

export const Extrapolation = {
  CLAMP: 'clamp',
  EXTEND: 'extend',
  IDENTITY: 'identity',
} as const;

// ─── Easing ─────────────────────────────────────────────────────
export const Easing = {
  linear: (t: number) => t,
  ease: (t: number) => t,
  quad: (t: number) => t * t,
  cubic: (t: number) => t * t * t,
  bezier: () => (t: number) => t,
  bezierFn: () => (t: number) => t,
  in: (fn: (t: number) => number) => fn,
  out: (fn: (t: number) => number) => fn,
  inOut: (fn: (t: number) => number) => fn,
};

// ─── Animated Components ────────────────────────────────────────
// For web, just use regular HTML/RN-web elements
import { View, Text, ScrollView, Image, FlatList } from 'react-native';

const Animated = {
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  createAnimatedComponent: (component: any) => component,
};

export default Animated;

// ─── Layout Animations ──────────────────────────────────────────
export class FadeIn {
  static duration() {
    return new FadeIn();
  }
  static delay() {
    return new FadeIn();
  }
  static springify() {
    return new FadeIn();
  }
}
export class FadeInDown {
  static duration() {
    return new FadeInDown();
  }
  static delay() {
    return new FadeInDown();
  }
  static springify() {
    return new FadeInDown();
  }
}
export class FadeInUp {
  static duration() {
    return new FadeInUp();
  }
  static delay() {
    return new FadeInUp();
  }
  static springify() {
    return new FadeInUp();
  }
}
export class FadeOut {
  static duration() {
    return new FadeOut();
  }
  static delay() {
    return new FadeOut();
  }
}
export class FadeOutDown {
  static duration() {
    return new FadeOutDown();
  }
  static delay() {
    return new FadeOutDown();
  }
}
export class FadeOutUp {
  static duration() {
    return new FadeOutUp();
  }
  static delay() {
    return new FadeOutUp();
  }
}
export class SlideInDown {
  static duration() {
    return new SlideInDown();
  }
  static springify() {
    return new SlideInDown();
  }
}
export class SlideOutDown {
  static duration() {
    return new SlideOutDown();
  }
}
export class Layout {
  static duration() {
    return new Layout();
  }
  static springify() {
    return new Layout();
  }
}

// ─── Gesture Callbacks ──────────────────────────────────────────
export function runOnJS(fn: Function) {
  return fn;
}

export function runOnUI(fn: Function) {
  return fn;
}

// ─── Misc ───────────────────────────────────────────────────────
export function cancelAnimation(_sv: any) {}
export function makeMutable<T>(value: T) {
  return { value };
}
export const useAnimatedRef = () => useRef(null);
export const useAnimatedScrollHandler = () => ({});
export const useAnimatedGestureHandler = () => ({});
export const useDerivedValue = (fn: () => any, deps?: any[]) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const val = useMemo(() => fn(), deps ?? []);
  return { value: val };
};
