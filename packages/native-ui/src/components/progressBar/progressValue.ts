const PERCENT = 100;

/** Clamps a progress fraction to the 0..1 range the bar can draw. */
export function clampProgress(fraction: number): number {
  return Math.min(Math.max(fraction, 0), 1);
}

/** Whole-number percentage announced to assistive technology. */
export function progressPercent(fraction: number): number {
  return Math.round(fraction * PERCENT);
}

/** CSS-style width of the fill for a clamped fraction, e.g. `'40%'`. */
export function progressWidth(fraction: number): `${number}%` {
  return `${fraction * PERCENT}%`;
}

/** Screen-reader value in whole percent (0..100). */
export function progressAccessibilityValue(fraction: number) {
  return { min: 0, max: PERCENT, now: progressPercent(fraction) };
}
