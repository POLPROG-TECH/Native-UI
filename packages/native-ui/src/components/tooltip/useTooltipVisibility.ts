import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ViewProps } from 'react-native';

type Timer = ReturnType<typeof setTimeout>;

export interface TooltipVisibilityOptions {
  longPressDelayMs: number;
  visibleDurationMs: number;
  disabled: boolean;
}

export type TooltipHandlers = Required<
  Pick<
    ViewProps,
    | 'onPointerEnter'
    | 'onPointerLeave'
    | 'onFocus'
    | 'onBlur'
    | 'onTouchStart'
    | 'onTouchEnd'
    | 'onTouchCancel'
  >
>;

/** One pending timeout at a time; a new one replaces it and unmount clears it. */
function useSingleTimer() {
  const timer = useRef<Timer | null>(null);
  const clear = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = null;
  }, []);
  const schedule = useCallback(
    (run: () => void, delayMs: number) => {
      clear();
      timer.current = setTimeout(run, delayMs);
    },
    [clear],
  );

  useEffect(() => clear, [clear]);

  return { clear, schedule };
}

/**
 * When the tooltip is shown. A pointer (mouse) or keyboard focus shows it at
 * once and hides it on leave or blur. A touch shows it after a long press and
 * keeps it for a moment after release, since there is no hover to end it.
 */
export function useTooltipVisibility(options: TooltipVisibilityOptions) {
  const { longPressDelayMs, visibleDurationMs, disabled } = options;
  const [visible, setVisible] = useState(false);
  const { clear, schedule } = useSingleTimer();

  const handlers = useMemo((): TooltipHandlers => {
    const set = (next: boolean) => () => {
      clear();
      setVisible(next);
    };

    return {
      onPointerEnter: set(true),
      onPointerLeave: set(false),
      onFocus: set(true),
      onBlur: set(false),
      onTouchStart: () => schedule(() => setVisible(true), longPressDelayMs),
      onTouchEnd: () => schedule(() => setVisible(false), visibleDurationMs),
      onTouchCancel: set(false),
    };
  }, [clear, schedule, longPressDelayMs, visibleDurationMs]);

  return { visible: visible && !disabled, handlers };
}
