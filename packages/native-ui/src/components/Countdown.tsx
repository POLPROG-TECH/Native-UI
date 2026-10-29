import { useMemo } from 'react';
import { Text, type TextProps } from '../primitives/Text';
import { useTheme } from '../theme';
import { formatCountdown, toEpochMs } from './countdown/formatCountdown';
import { useCountdown, useCountdownUnits } from './countdown/useCountdown';
import type { CountdownUnits, CountdownFormat } from './countdown/types';
export type { CountdownUnits, CountdownFormat } from './countdown/types';

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
  /**
   * Tick interval in ms. Use 30_000 for low-priority UI.
   * @default theme.components.countdown.tickMs (1000)
   */
  tickMs?: number;
  /** Rendered when the deadline is reached. @default the zero value, e.g. "0m 00s" */
  expiredLabel?: string;
  /**
   * Unit suffixes, e.g. `{ hours: ' godz.', minutes: ' min', seconds: ' s' }`.
   * @default labels.countdownUnits from `NativeUIConfig.labels`
   */
  units?: Partial<CountdownUnits>;
  /** Called once when the deadline passes (useful to trigger refresh). */
  onExpire?: () => void;
  /**
   * Optional transform applied to the formatted string - e.g. to prepend
   * "Ends in " or wrap in brackets.
   */
  renderLabel?: (formatted: string) => string;
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
  tickMs: tickMsProp,
  expiredLabel,
  onExpire,
  renderLabel,
  units: unitOverrides,
  ...textProps
}: CountdownProps) {
  const { labels, components } = useTheme();
  const units = useCountdownUnits(labels.countdownUnits, unitOverrides);
  const target = useMemo(() => toEpochMs(to), [to]);
  const remaining = useCountdown(target, tickMsProp ?? components.countdown.tickMs, onExpire);
  const display =
    remaining <= 0
      ? (expiredLabel ?? formatCountdown(0, 'ms', units))
      : formatCountdown(remaining, fmt, units);

  return <Text {...textProps}>{renderLabel ? renderLabel(display) : display}</Text>;
}
