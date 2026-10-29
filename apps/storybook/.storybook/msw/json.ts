/**
 * Readers for JSON from the mock network. A response or request body is
 * `unknown` until a field is checked, so stories never trust its shape.
 */

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function stringField(value: unknown, key: string): string | undefined {
  const field = isRecord(value) ? value[key] : undefined;

  return typeof field === 'string' ? field : undefined;
}

export function numberField(value: unknown, key: string): number | undefined {
  const field = isRecord(value) ? value[key] : undefined;

  return typeof field === 'number' ? field : undefined;
}

/** Parses a body into `T`, or returns null when its shape does not match. */
export type JsonParser<T> = (value: unknown) => T | null;
