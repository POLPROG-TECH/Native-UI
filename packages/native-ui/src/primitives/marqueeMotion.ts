const MS_PER_SECOND = 1000;

/** One leg of the marquee loop: how far the text travels and for how long. */
export interface MarqueeScrollPlan {
  /** Points the text moves left before it scrolls back. */
  distance: number;
  /** Duration of one leg, derived from the distance and the speed. */
  durationMs: number;
}

/**
 * Plans one scroll leg. The text travels its overflow plus `gap`, so the end
 * of the text clears the container edge before the return leg starts.
 *
 * @param overflow Intrinsic text width minus the container width (points).
 * @param gap Extra travel past the end of the text (points).
 * @param speed Scroll speed in points per second; must be positive.
 */
export function planMarqueeScroll(overflow: number, gap: number, speed: number): MarqueeScrollPlan {
  const distance = overflow + gap;

  return { distance, durationMs: (distance / speed) * MS_PER_SECOND };
}

/** Whether the text overflows its container enough to scroll. */
export function shouldMarqueeScroll(
  textWidth: number,
  containerWidth: number,
  overflowTolerance: number,
): boolean {
  return containerWidth > 0 && textWidth > 0 && textWidth - containerWidth > overflowTolerance;
}
