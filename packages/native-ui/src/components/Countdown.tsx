import { useEffect, useMemo, useRef, useState } from 'react';
import { Text, type TextProps } from '../primitives/Text';

export type CountdownFormat = 'auto' | 'hm' | 'hms' | 'ms';

const DEFAULT_TICK_MS = 1000;
const DEFAULT_EXPIRED_LABEL = '0m 00s';
const SECONDS_PER_HOUR = 3600;
const SECONDS_PER_MINUTE = 60;

export interface CountdownProps extends Omit<TextProps, 'children'> {
  /** Target date / timestamp. Accepts Date, ms epoch, or ISO string. */
  to: Date | number | string;
  /**
   * Output format.
   * - `auto` (default): shows `Hh MMm` when ≥1h, otherwise `MMm SSs`.
   * - `hm`:  `Hh MMm`
   * - `hms`: `Hh MMm SSs`
   * - `ms`:  `MMm SSs`
   */
  format?: CountdownFormat;
  /** Tick interval in ms. @default 1000 (1s). Use 30_000 for low-priority UI. */
  tickMs?: number;
  /** Rendered when the deadline is reached. @default "0m 00s" */
  expiredLabel?: string;
  /** Called once when the deadline passes (useful to trigger refresh). */
  onExpire?: () => void;
  /**
   * Optional transform applied to the formatted string - e.g. to prepend
   * "Ends in " or wrap in brackets.
   */
  renderLabel?: (formatted: string) => string;
}

function toMs(v: Date | number | string): number {
  if (v instanceof Date) return v.getTime();

  if (typeof v === 'number') return v;

  return new Date(v).getTime();
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function format(msRemaining: number, fmt: CountdownFormat): string {
  const total = Math.max(0, Math.floor(msRemaining / 1000));
  const h = Math.floor(total / SECONDS_PER_HOUR);
  const m = Math.floor((total % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);
  const s = total % SECONDS_PER_MINUTE;

  switch (fmt) {
    case 'hms':
      return `${h}h ${pad(m)}m ${pad(s)}s`;
    case 'hm':
      return `${h}h ${pad(m)}m`;
    case 'ms':
      return `${m}m ${pad(s)}s`;
    case 'auto':
    default:
      return h > 0 ? `${h}h ${pad(m)}m` : `${m}m ${pad(s)}s`;
  }
}

/**
 * Self-ticking countdown text to a fixed deadline. Safely clears its
 * interval on unmount and when the target changes.
 *
 * @example
 * ```tsx
 * <Countdown to={nextMidnight} variant="caption" color="textSecondary"
 *   renderLabel={s => `Ends in ${s}`} />
 * ```
 */
export function Countdown({
  to,
  format: fmt = 'auto',
  tickMs = DEFAULT_TICK_MS,
  expiredLabel = DEFAULT_EXPIRED_LABEL,
  onExpire,
  renderLabel,
  ...textProps
}: CountdownProps) {
  const target = useMemo(() => toMs(to), [to]);
  const [, setTick] = useState(0);
  const firedExpiry = useRef(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    firedExpiry.current = false;
    // Stop ticking once the deadline has passed - keeping a 1 s `setInterval`
    // running forever post-expiry is a battery/CPU leak on long-lived screens.
    if (target - Date.now() <= 0) return;

    const id = setInterval(() => {
      setTick((t) => t + 1);

      if (target - Date.now() <= 0) {
        clearInterval(id);
      }
    }, tickMs);

    return () => clearInterval(id);
  }, [target, tickMs]);

  const remaining = target - Date.now();
  const expired = remaining <= 0;

  useEffect(() => {
    if (!expired || firedExpiry.current) return;

    firedExpiry.current = true;
    onExpireRef.current?.();
  }, [expired]);

  const display = expired ? expiredLabel : format(remaining, fmt);
  const out = renderLabel ? renderLabel(display) : display;

  return <Text {...textProps}>{out}</Text>;
}
