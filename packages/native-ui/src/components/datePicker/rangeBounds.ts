import { parseValue } from './datePickerUtils';

export interface DateRangeBounds {
  /** Latest selectable start: the end date, clamped to the global maximum. */
  startMax?: Date;
  /** Earliest selectable end: the start date, clamped to the global minimum. */
  endMin?: Date;
}

function parseDateSafe(str: string): Date | undefined {
  if (!str) {
    return undefined;
  }

  const date = parseValue(str, 'date');

  return isNaN(date.getTime()) ? undefined : date;
}

function laterDate(a: Date | undefined, b: Date | undefined): Date | undefined {
  if (!a) {
    return b;
  }

  if (!b) {
    return a;
  }

  return a > b ? a : b;
}

function earlierDate(a: Date | undefined, b: Date | undefined): Date | undefined {
  if (!a) {
    return b;
  }

  if (!b) {
    return a;
  }

  return a < b ? a : b;
}

/**
 * Cross-constraints of a date range: each endpoint bounds the other, so the
 * user cannot pick an end before the start, and neither escapes the global
 * `minimumDate` / `maximumDate`.
 */
export function resolveRangeBounds(
  range: { start: string; end: string },
  minimumDate?: Date,
  maximumDate?: Date,
): DateRangeBounds {
  return {
    startMax: earlierDate(parseDateSafe(range.end), maximumDate),
    endMin: laterDate(parseDateSafe(range.start), minimumDate),
  };
}
