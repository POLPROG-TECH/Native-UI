/**
 * Lightweight web mock for react-native-reanimated.
 * Provides the subset of APIs used by native-ui components
 * with CSS-transition-based fallbacks for web rendering.
 */

import { useReducer, useRef, useState } from 'react';
import { View, Text, ScrollView, Image, FlatList } from 'react-native';
import type {
  AnimationCallback,
  WithSpringConfig,
  WithTimingConfig,
} from 'react-native-reanimated';

interface SharedValue<T> {
  value: T;
}

function createSharedValue<T>(initialValue: T, onChange: () => void): SharedValue<T> {
  let current = initialValue;

  return {
    get value() {
      return current;
    },
    set value(next: T) {
      if (Object.is(next, current)) {
        return;
      }

      current = next;
      onChange();
    },
  };
}

/**
 * Assigning `.value` re-renders the owner, so `useAnimatedStyle` (computed on
 * every render) reflects the new value. Animations jump to their end value:
 * the preview shows end states (active tab pill, dragged sheet) correctly
 * without simulating timing.
 */
export function useSharedValue<T>(initialValue: T): SharedValue<T> {
  const [, rerender] = useReducer((count: number) => count + 1, 0);
  const [sharedValue] = useState(() => createSharedValue(initialValue, rerender));

  return sharedValue;
}

export function useAnimatedStyle<T>(updater: () => T): T {
  return updater();
}

export function withTiming<T>(
  toValue: T,
  _config?: WithTimingConfig,
  callback?: AnimationCallback,
): T {
  if (callback) {
    callback(true);
  }

  return toValue;
}

export function withSpring<T>(
  toValue: T,
  _config?: WithSpringConfig,
  callback?: AnimationCallback,
): T {
  if (callback) {
    callback(true);
  }

  return toValue;
}

export function withDelay<T>(_delay: number, animation: T): T {
  return animation;
}

export function withSequence<T>(first: T, ...rest: T[]): T {
  return rest[rest.length - 1] ?? first;
}

export function withRepeat<T>(animation: T, _count?: number, _reverse?: boolean): T {
  return animation;
}

/** First and last entries of a range, or null when it cannot span two points. */
function rangeEnds(range: number[]): [number, number] | null {
  const first = range[0];
  const last = range[range.length - 1];

  return range.length < 2 || first === undefined || last === undefined ? null : [first, last];
}

export function interpolate(value: number, inputRange: number[], outputRange: number[]) {
  const input = rangeEnds(inputRange);
  const output = rangeEnds(outputRange);

  if (input === null || output === null) {
    return outputRange[0] ?? 0;
  }

  const ratio = (value - input[0]) / (input[1] - input[0]);
  const clamped = Math.max(0, Math.min(1, ratio));

  return output[0] + clamped * (output[1] - output[0]);
}

export const Extrapolation = {
  CLAMP: 'clamp',
  EXTEND: 'extend',
  IDENTITY: 'identity',
} as const;

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

const Animated = {
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  createAnimatedComponent: <C>(component: C): C => component,
};

export default Animated;

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

export function runOnJS<F extends (...args: never[]) => unknown>(fn: F): F {
  return fn;
}

export function runOnUI<F extends (...args: never[]) => unknown>(fn: F): F {
  return fn;
}

export function cancelAnimation<T>(_sharedValue: SharedValue<T>): void {}

export function makeMutable<T>(value: T): SharedValue<T> {
  return { value };
}

export const useAnimatedRef = () => useRef(null);
export const useAnimatedScrollHandler = () => ({});
export const useAnimatedGestureHandler = () => ({});
/* Recomputed every render, like `useAnimatedStyle` above. */
export function useDerivedValue<T>(fn: () => T): SharedValue<T> {
  return { value: fn() };
}
