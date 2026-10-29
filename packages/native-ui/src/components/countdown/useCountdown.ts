import { useEffect, useMemo, useRef, useState } from 'react';
import { useShallowStable } from '../../theme/useShallowStable';
import type { CountdownUnits } from './types';

/**
 * Starts re-rendering every `tickMs` until `target` passes, then stops on its
 * own: a 1 s interval left running after expiry is a battery/CPU leak on
 * long-lived screens. Returns the cleanup, or nothing when already expired.
 */
function startTicking(target: number, tickMs: number, onTick: () => void) {
  if (target - Date.now() <= 0) {
    return undefined;
  }

  const id = setInterval(() => {
    onTick();

    if (target - Date.now() <= 0) {
      clearInterval(id);
    }
  }, tickMs);

  return () => clearInterval(id);
}

/**
 * Milliseconds left until `target`, re-evaluated every `tickMs`. Calls the
 * latest `onExpire` once per target when the deadline is reached.
 */
export function useCountdown(target: number, tickMs: number, onExpire?: () => void): number {
  const [, setTick] = useState(0);
  const firedExpiry = useRef(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    firedExpiry.current = false;

    return startTicking(target, tickMs, () => setTick((t) => t + 1));
  }, [target, tickMs]);

  const remaining = target - Date.now();
  const expired = remaining <= 0;

  useEffect(() => {
    if (!expired || firedExpiry.current) {
      return;
    }

    firedExpiry.current = true;
    onExpireRef.current?.();
  }, [expired]);

  return remaining;
}

/** Theme unit suffixes with per-instance overrides merged on top. */
export function useCountdownUnits(
  defaults: CountdownUnits,
  overrides: Partial<CountdownUnits> | undefined,
): CountdownUnits {
  /* Callers usually pass `units` inline; compare by value so each render does not re-merge. */
  const stableOverrides = useShallowStable(overrides);

  return useMemo<CountdownUnits>(
    () => ({ ...defaults, ...stableOverrides }),
    [defaults, stableOverrides],
  );
}
