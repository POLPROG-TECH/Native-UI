/**
 * The value when it is present, otherwise a thrown error naming what was
 * missing. Tests use it instead of the non-null `!` so an unexpected gap
 * fails with a clear message rather than a later `undefined` error.
 */
export function defined<T>(value: T | null | undefined, what = 'value'): T {
  if (value == null) {
    throw new Error(`Expected ${what} to be defined.`);
  }

  return value;
}
