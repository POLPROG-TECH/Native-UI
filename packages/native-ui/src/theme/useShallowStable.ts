import { useRef } from 'react';
import { typedKeys } from '../utils/typedKeys';

function shallowEqual<T extends object>(a: T, b: T): boolean {
  const aKeys = typedKeys(a);

  if (aKeys.length !== Object.keys(b).length) {
    return false;
  }

  return aKeys.every((key) => Object.is(a[key], b[key]));
}

/**
 * Returns the previous reference while `value` stays shallow-equal to it, so
 * config objects written inline (`config={{ labels: { ... } }}`) don't
 * invalidate memoised theme values on every render.
 */
export function useShallowStable<T extends object>(value: T | undefined): T | undefined {
  const ref = useRef(value);
  const prev = ref.current;

  const unchanged =
    prev === value || (prev !== undefined && value !== undefined && shallowEqual(prev, value));

  if (!unchanged) {
    ref.current = value;
  }

  return ref.current;
}
