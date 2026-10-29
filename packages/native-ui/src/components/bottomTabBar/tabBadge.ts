import type { BottomTabBarItem } from './types';

/**
 * Whether a tab badge should render. Hides `null` / `undefined` (no badge),
 * numeric `0` and negatives (common "no unread" state, mirroring `Badge.hideZero`),
 * and empty strings.
 */
export function shouldRenderBadge(badge: BottomTabBarItem['badge']): badge is number | string {
  if (badge == null) {
    return false;
  }

  if (typeof badge === 'number') {
    return badge > 0;
  }

  return badge.length > 0;
}

/** Badge text; numbers above `maxNumericBadge` collapse to the overflow label (e.g. "99+"). */
export function formatBadge(
  badge: number | string,
  maxNumericBadge: number,
  countOverflow: (max: number) => string,
): string {
  if (typeof badge === 'number' && badge > maxNumericBadge) {
    return countOverflow(maxNumericBadge);
  }

  return String(badge);
}
