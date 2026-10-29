import type { duration } from '../spacing';
import { typedKeys } from '../../utils/typedKeys';
import type { BorderRadiusScale, SpacingScale } from '../spacing';

/** Scales the component token builders derive their defaults from. */
export interface ComponentTokenContext {
  spacing: SpacingScale;
  borderRadius: BorderRadiusScale;
  duration: typeof duration;
}

/** Each component's tokens may be overridden partially and independently. */
export type TokenGroupOverrides<T> = { [K in keyof T]?: Partial<T[K]> };

/**
 * Shallow-merges per-component overrides one level deep: `{ toast: { offset } }`
 * replaces only `toast.offset`, keeping every other toast and component token.
 */
export function mergeTokenGroup<T extends { [K in keyof T]: object }>(
  base: T,
  overrides?: TokenGroupOverrides<T>,
): T {
  if (!overrides) {
    return base;
  }

  const merged: T = { ...base };
  for (const key of typedKeys(overrides)) {
    const patch = overrides[key];

    if (patch) {
      merged[key] = { ...base[key], ...patch };
    }
  }

  return merged;
}
