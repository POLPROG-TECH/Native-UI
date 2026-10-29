import type { DatePickerMode } from './types';

/**
 * A parsed date or time part, or `fallback` when the part is missing, zero or
 * not a number (`Number('')` is 0 and `Number('x')` is NaN).
 */
function partOr(part: number | undefined, fallback: number): number {
  if (part === undefined || Number.isNaN(part) || part === 0) {
    return fallback;
  }

  return part;
}

/** `HH:MM` applied to today's date; missing parts default to zero. */
function parseTime(str: string): Date {
  const [h, m] = str.split(':').map(Number);
  const d = new Date();

  d.setHours(partOr(h, 0), partOr(m, 0), 0, 0);

  return d;
}

/**
 * `YYYY-MM-DD` built from local components rather than `new Date(str)`, which
 * would parse it as UTC midnight and shift the day in negative-offset zones.
 */
function parseDate(str: string): Date {
  const parts = str.split('-').map(Number);
  const y = partOr(parts[0], new Date().getFullYear());
  const m = partOr(parts[1], 1) - 1;
  const d = partOr(parts[2], 1);

  return new Date(y, m, d);
}

/** `YYYY-MM-DDTHH:MM`; anything without a `T` or with non-numeric parts is invalid. */
function parseDateTime(str: string): Date {
  const tIndex = str.indexOf('T');

  if (tIndex === -1) {
    return new Date();
  }

  const dp = str.substring(0, tIndex).split('-').map(Number);
  const tp = str
    .substring(tIndex + 1)
    .split(':')
    .map(Number);

  if (dp.some(isNaN) || tp.some(isNaN)) {
    return new Date();
  }

  const y = partOr(dp[0], new Date().getFullYear());
  const mo = partOr(dp[1], 1) - 1;
  const d = partOr(dp[2], 1);

  return new Date(y, mo, d, partOr(tp[0], 0), partOr(tp[1], 0));
}

/**
 * Parses a value string into a Date based on the picker mode.
 *
 * - `'date'` - expects `YYYY-MM-DD` (parsed without timezone)
 * - `'time'` - expects `HH:MM` (applied to today's date)
 * - `'datetime'` - expects `YYYY-MM-DDTHH:MM`
 *
 * Empty input, and `datetime` input that is not well formed, returns the
 * current date/time. Missing date parts default to the current year, January
 * and day 1; missing time parts default to zero.
 */
export function parseValue(str: string, mode: DatePickerMode): Date {
  if (!str) {
    return new Date();
  }

  if (mode === 'time') {
    return parseTime(str);
  }

  if (mode === 'datetime') {
    return parseDateTime(str);
  }

  return parseDate(str);
}

/**
 * Formats a Date into a value string based on the picker mode.
 *
 * - `'date'` → `YYYY-MM-DD`
 * - `'time'` → `HH:MM`
 * - `'datetime'` → `YYYY-MM-DDTHH:MM`
 */
export function formatValue(date: Date, mode: DatePickerMode): string {
  const pad = (n: number) => String(n).padStart(2, '0');

  if (mode === 'time') {
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  const y = date.getFullYear();
  const mo = pad(date.getMonth() + 1);
  const d = pad(date.getDate());

  if (mode === 'datetime') {
    return `${y}-${mo}-${d}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  return `${y}-${mo}-${d}`;
}

/**
 * Formats a Date into a human-readable display string using `Intl` formatting.
 * Falls back to the machine-readable format on environments without `Intl`.
 */
export function formatDisplay(date: Date, locale: string, mode: DatePickerMode): string {
  try {
    if (mode === 'time') {
      return date.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    if (mode === 'datetime') {
      return date.toLocaleString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return formatValue(date, mode);
  }
}
