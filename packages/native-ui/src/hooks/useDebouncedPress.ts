import { useCallback, useEffect, useRef } from 'react';

/**
 * Returns a press handler that ignores repeat invocations for `delay` ms after
 * the first call, preventing accidental double-taps on action controls.
 *
 * The returned handler keeps a **stable identity** across renders (the latest
 * `onPress` is read from a ref), so it can be passed to memoized children
 * without invalidating their props. The pending timer is cleared on unmount.
 *
 * @param onPress Callback invoked on the leading edge of a press.
 * @param delay   Lock-out window in milliseconds. @default 400
 *
 * @example
 * ```tsx
 * const handlePress = useDebouncedPress(() => {
 *   getHaptics().medium();
 *   onPress();
 * });
 * ```
 */
export function useDebouncedPress(onPress: () => void, delay = 400): () => void {
  const pressedRef = useRef(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onPressRef = useRef(onPress);
  onPressRef.current = onPress;

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  return useCallback(() => {
    if (pressedRef.current) return;

    pressedRef.current = true;

    try {
      onPressRef.current();
    } finally {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);

      resetTimerRef.current = setTimeout(() => {
        pressedRef.current = false;
        resetTimerRef.current = null;
      }, delay);
    }
  }, [delay]);
}
