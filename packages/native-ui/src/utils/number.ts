/**
 * Parse a user-entered number, accepting both comma and dot as the decimal
 * separator. Many European keyboards (Polish, German, French, ...) produce a
 * comma, which plain `parseFloat` would truncate (e.g. "12,50" becomes 12).
 *
 * Returns `NaN` for empty or non-numeric input, so callers can validate with
 * `Number.isNaN(...)`.
 *
 * @example
 * ```ts
 * parseDecimalInput('12,50'); // 12.5
 * parseDecimalInput('12.50'); // 12.5
 * parseDecimalInput('abc');   // NaN
 * ```
 */
export function parseDecimalInput(input: string): number {
  return parseFloat(input.replace(',', '.'));
}
