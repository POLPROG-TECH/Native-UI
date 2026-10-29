export type BadgeContent = { kind: 'hidden' } | { kind: 'dot' } | { kind: 'text'; text: string };

export interface BadgeContentInput {
  count?: number;
  label?: string;
  max: number;
  hideZero: boolean;
}

/**
 * What a badge shows. A `label` always renders as text; otherwise a missing
 * `count` is a status dot, a non-positive count is hidden under `hideZero`,
 * and counts above `max` collapse to the overflow label (e.g. "99+").
 */
export function resolveBadgeContent(
  { count, label, max, hideZero }: BadgeContentInput,
  countOverflow: (max: number) => string,
): BadgeContent {
  if (label !== undefined) {
    return { kind: 'text', text: label };
  }

  if (count === undefined) {
    return { kind: 'dot' };
  }

  if (count <= 0 && hideZero) {
    return { kind: 'hidden' };
  }

  return { kind: 'text', text: count > max ? countOverflow(max) : String(count) };
}
