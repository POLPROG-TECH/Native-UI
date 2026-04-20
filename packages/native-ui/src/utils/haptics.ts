/** Pluggable haptics interface. Consumers register their own implementation. */
export interface HapticsInterface {
  light(): void;
  medium(): void;
  success(): void;
  warning(): void;
  error(): void;
}

const noopHaptics: HapticsInterface = {
  light() {},
  medium() {},
  success() {},
  warning() {},
  error() {},
};

let _haptics: HapticsInterface = noopHaptics;

/** Per-method throttle window. ~50ms swallows rapid taps without feeling sluggish. */
const THROTTLE_MS = 50;

/**
 * Register a haptic feedback implementation.
 *
 * Calls are automatically throttled per-method (50 ms window) so rapid
 * taps don't queue up a burst of vibrations.
 *
 * @example
 * ```ts
 * import { configureHaptics } from '@polprog/native-ui';
 * import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
 *
 * configureHaptics({
 *   light: () => ReactNativeHapticFeedback.trigger('impactLight'),
 *   medium: () => ReactNativeHapticFeedback.trigger('impactMedium'),
 *   success: () => ReactNativeHapticFeedback.trigger('notificationSuccess'),
 *   warning: () => ReactNativeHapticFeedback.trigger('notificationWarning'),
 *   error: () => ReactNativeHapticFeedback.trigger('notificationError'),
 * });
 * ```
 */
export function configureHaptics(impl: HapticsInterface): void {
  const lastInvoked: Record<keyof HapticsInterface, number> = {
    light: 0,
    medium: 0,
    success: 0,
    warning: 0,
    error: 0,
  };

  const throttle =
    <K extends keyof HapticsInterface>(key: K) =>
    (): void => {
      const now = Date.now();
      if (now - lastInvoked[key] < THROTTLE_MS) return;
      lastInvoked[key] = now;
      impl[key]();
    };

  _haptics = {
    light: throttle('light'),
    medium: throttle('medium'),
    success: throttle('success'),
    warning: throttle('warning'),
    error: throttle('error'),
  };
}

/** @internal Used by library components to trigger haptic feedback. */
export function getHaptics(): HapticsInterface {
  return _haptics;
}

/** @internal Reset to noop - exposed for tests only. */
export function _resetHapticsForTest(): void {
  _haptics = noopHaptics;
}
