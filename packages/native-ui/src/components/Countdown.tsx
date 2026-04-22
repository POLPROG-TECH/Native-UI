import { useEffect, useRef, useState } from 'react';
import { Text, type TextProps } from '../primitives/Text';

export type CountdownFormat = 'auto' | 'hm' | 'hms' | 'ms';

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
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (fmt === 'hms') return `${h}h ${pad(m)}m ${pad(s)}s`;
  if (fmt === 'hm') return `${h}h ${pad(m)}m`;
  if (fmt === 'ms') return `${m}m ${pad(s)}s`;
  return h > 0 ? `${h}h ${pad(m)}m` : `${m}m ${pad(s)}s`;
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
  tickMs = 1000,
  expiredLabel = '0m 00s',
  onExpire,
  renderLabel,
  ...textProps
}: CountdownProps) {
  const target = toMs(to);
  const [, setTick] = useState(0);
  const firedExpiry = useRef(false);

  useEffect(() => {
    firedExpiry.current = false;
    const id = setInterval(() => setTick(t => t + 1), tickMs);
    return () => clearInterval(id);
  }, [target, tickMs]);

  const remaining = target - Date.now();
  const expired = remaining <= 0;

  useEffect(() => {
    if (expired && !firedExpiry.current) {
      firedExpiry.current = true;
      onExpire?.();
    }
  }, [expired, onExpire]);

  const display = expired ? expiredLabel : format(remaining, fmt);
  const out = renderLabel ? renderLabel(display) : display;

  return <Text {...textProps}>{out}</Text>;
}
