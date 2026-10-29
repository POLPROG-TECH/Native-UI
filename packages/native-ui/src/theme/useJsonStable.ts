import { useRef } from 'react';

/**
 * Returns the previous reference while `value` serialises to the same JSON,
 * so inline config objects (`config={{ spacing: { md: 18 } }}`) don't rebuild
 * memoised theme values every render. Only for plain data: JSON drops
 * functions, which is why labels use `useShallowStable` instead.
 */
export function useJsonStable<T>(value: T): T {
  const key = value === undefined ? '' : JSON.stringify(value);
  const ref = useRef({ key, value });

  if (ref.current.key !== key) {
    ref.current = { key, value };
  }

  return ref.current.value;
}
