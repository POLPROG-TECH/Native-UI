/** Decimal separators a user-entered number may use. */
export type DecimalSeparator = '.' | ',';

export interface ParseDecimalOptions {
  /**
   * The decimal separator of the input's locale, when known (e.g. `','` for
   * `pl-PL`, `'.'` for `en-US`). Every other `.`, `,` or apostrophe is then
   * treated as a thousands separator, which resolves inputs such as `1,234`
   * that are ambiguous without a locale. When omitted, the separator is
   * inferred from the input (see {@link parseDecimalInput}).
   */
  decimalSeparator?: DecimalSeparator;
}

/*
 * JS `\s` covers regular, tab, non-breaking (U+00A0) and thin / narrow
 * (U+2009 / U+202F) spaces, which `Intl.NumberFormat` emits as grouping.
 */
const WHITESPACE_RE = /\s/g;
/* Apostrophes group thousands in de-CH / it-CH ("1'234.50"). */
const APOSTROPHE_RE = /['’]/g;
const ALL_COMMAS_RE = /,/g;
const ALL_DOTS_RE = /\./g;

function separatorPattern(separator: DecimalSeparator): RegExp {
  return separator === ',' ? ALL_COMMAS_RE : ALL_DOTS_RE;
}

/** Normalises input whose decimal separator is known up front. */
function normaliseWithSeparator(raw: string, decimal: DecimalSeparator): string {
  const grouping: DecimalSeparator = decimal === ',' ? '.' : ',';
  const withoutGrouping = raw.replace(separatorPattern(grouping), '');

  return decimal === ',' ? withoutGrouping.replace(',', '.') : withoutGrouping;
}

/** Infers the decimal separator from the input itself. */
function normaliseInferred(raw: string): string {
  const lastComma = raw.lastIndexOf(',');
  const lastDot = raw.lastIndexOf('.');

  if (lastComma !== -1 && lastDot !== -1) {
    /* Both present: the LAST one is the decimal point, the other groups. */
    return normaliseWithSeparator(raw, lastComma > lastDot ? ',' : '.');
  }

  if (lastComma === -1 && lastDot === -1) {
    return raw;
  }

  /*
   * One separator kind only: a single occurrence is the decimal point
   * ("12,50", "12.50"); repeated occurrences are thousands grouping
   * ("1,234,567", "1.234.567").
   */
  const separator: DecimalSeparator = lastComma !== -1 ? ',' : '.';
  const occurrences = raw.split(separator).length - 1;

  if (occurrences > 1) {
    return raw.replace(separatorPattern(separator), '');
  }

  return separator === ',' ? raw.replace(',', '.') : raw;
}

/**
 * Parse a user-entered number, accepting both comma and dot as the decimal
 * separator and ignoring thousands grouping (spaces, non-breaking spaces,
 * apostrophes, or the non-decimal separator). Many European keyboards
 * produce a comma, which plain `parseFloat` would truncate ("12,50" becomes
 * 12), and pasted amounts often carry grouping ("1 234,56").
 *
 * Without `options.decimalSeparator` the separator is inferred: when both
 * appear the last one is decimal; a single comma or dot is decimal; a
 * repeated one is grouping. Pass the locale's separator to remove the remaining
 * ambiguity (`"1,234"` is 1.234 inferred, 1234 with `decimalSeparator: '.'`).
 *
 * Returns `NaN` for empty or non-numeric input (including trailing garbage
 * such as `"12abc"`), so callers can validate with `Number.isNaN(...)`.
 *
 * @example
 * ```ts
 * parseDecimalInput('12,50');     // 12.5
 * parseDecimalInput('1 234,56');  // 1234.56
 * parseDecimalInput('1,234.56');  // 1234.56
 * parseDecimalInput('1,234', { decimalSeparator: '.' }); // 1234
 * parseDecimalInput('abc');       // NaN
 * ```
 */
export function parseDecimalInput(input: string, options: ParseDecimalOptions = {}): number {
  const raw = input.trim().replace(WHITESPACE_RE, '').replace(APOSTROPHE_RE, '');

  if (!raw) {
    return NaN;
  }

  const normalised = options.decimalSeparator
    ? normaliseWithSeparator(raw, options.decimalSeparator)
    : normaliseInferred(raw);

  return Number(normalised);
}
