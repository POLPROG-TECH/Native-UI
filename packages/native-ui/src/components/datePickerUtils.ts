import type { DatePickerMode } from './DatePickerInput';

/**
 * Parses a value string into a Date based on the picker mode.
 *
 * - `'date'` - expects `YYYY-MM-DD` (parsed without timezone)
 * - `'time'` - expects `HH:MM` (applied to today's date)
 * - `'datetime'` - expects `YYYY-MM-DDTHH:MM` (ISO parsing)
 *
 * Returns current date/time as fallback for empty or invalid input.
 */
export function parseValue(str: string, mode: DatePickerMode): Date {
  if (!str) return new Date();

  if (mode === 'time') {
    const [h, m] = str.split(':').map(Number);
    const d = new Date();

    d.setHours(h || 0, m || 0, 0, 0);

    return d;
  }

  if (mode === 'datetime') {
    const tIndex = str.indexOf('T');

    if (tIndex === -1) return new Date();

    const datePart = str.substring(0, tIndex);
    const timePart = str.substring(tIndex + 1);
    const dp = datePart.split('-').map(Number);
    const tp = timePart.split(':').map(Number);

    if (dp.some(isNaN) || tp.some(isNaN)) return new Date();

    const y = dp[0] || new Date().getFullYear();
    const mo = (dp[1] || 1) - 1;
    const d = dp[2] || 1;
    const h = tp[0] || 0;
    const mi = tp[1] || 0;

    return new Date(y, mo, d, h, mi);
  }

  // date mode - manual parse to avoid timezone offset issues
  const parts = str.split('-').map(Number);
  const y = parts[0] || new Date().getFullYear();
  const m = (parts[1] || 1) - 1;
  const d = parts[2] || 1;

  return new Date(y, m, d);
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
