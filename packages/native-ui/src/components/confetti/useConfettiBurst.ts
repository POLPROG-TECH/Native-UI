import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../theme';

/** Ref that always holds the latest value, so timers never call a stale callback. */
function useLatestRef<T>(value: T) {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
}

interface ConfettiBurstOptions {
  visible: boolean;
  forceAnimation: boolean;
  duration: number;
  onComplete?: () => void;
}

/**
 * Shows a burst for `duration` ms each time `visible` turns on. Under
 * `theme.reduceAnimations` (unless forced) it skips the burst but still
 * reports completion, so callers resetting `visible` keep working.
 * `burstKey` changes per burst to remount fresh pieces.
 */
export function useConfettiBurst({
  visible,
  forceAnimation,
  duration,
  onComplete,
}: ConfettiBurstOptions) {
  const { reduceAnimations } = useTheme();
  const [show, setShow] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const onCompleteRef = useLatestRef(onComplete);

  useEffect(() => {
    if (!visible) {
      return;
    }

    if (reduceAnimations && !forceAnimation) {
      onCompleteRef.current?.();

      return;
    }

    setBurstKey((k) => k + 1);
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
      onCompleteRef.current?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [visible, reduceAnimations, forceAnimation, duration, onCompleteRef]);

  return { show, burstKey };
}
