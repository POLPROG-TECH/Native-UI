/**
 * `Object.keys` typed as the object's own keys. TypeScript widens the result
 * to `string[]` because objects may carry extra keys at runtime; the type
 * guard keeps that narrowing checked instead of asserted. Used on closed,
 * library-owned records (token scales).
 */
export function typedKeys<T extends object>(value: T): Array<Extract<keyof T, string>> {
  return Object.keys(value).filter((key): key is Extract<keyof T, string> => key in value);
}
