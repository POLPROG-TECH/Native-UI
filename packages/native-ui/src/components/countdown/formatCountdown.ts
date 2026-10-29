import type { CountdownFormat, CountdownUnits } from './types';

const MS_PER_SECOND = 1000;
const SECONDS_PER_HOUR = 3600;
const SECONDS_PER_MINUTE = 60;

/** Normalizes a Countdown target (Date, ms epoch, or ISO string) to ms epoch. */
export function toEpochMs(value: Date | number | string): number {
  if (value instanceof Date) {
    return value.getTime();
  }

  if (typeof value === 'number') {
    return value;
  }

  return new Date(value).getTime();
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/**
 * Formats the remaining time. Negative input clamps to zero. The leading
 * segment is unpadded ("5m 09s") and only trailing segments are zero-padded.
 */
export function formatCountdown(
  msRemaining: number,
  format: CountdownFormat,
  units: CountdownUnits,
): string {
  const total = Math.max(0, Math.floor(msRemaining / MS_PER_SECOND));
  const minutes = Math.floor((total % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);
  const h = `${Math.floor(total / SECONDS_PER_HOUR)}${units.hours}`;
  const mm = `${pad(minutes)}${units.minutes}`;
  const ss = `${pad(total % SECONDS_PER_MINUTE)}${units.seconds}`;
  const minutesOnly = `${minutes}${units.minutes}`;

  switch (format) {
    case 'hms':
      return `${h} ${mm} ${ss}`;
    case 'hm':
      return `${h} ${mm}`;
    case 'ms':
      return `${minutesOnly} ${ss}`;
    case 'auto':
    default:
      return total >= SECONDS_PER_HOUR ? `${h} ${mm}` : `${minutesOnly} ${ss}`;
  }
}
