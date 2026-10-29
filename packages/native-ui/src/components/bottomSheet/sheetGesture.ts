import type { BottomSheetTokens } from '../../tokens/components';

type DismissThresholds = Pick<BottomSheetTokens, 'dismissDistance' | 'dismissVelocity'>;

/**
 * Decides whether releasing a downward drag should dismiss the sheet: either
 * it travelled past the distance threshold or it was flicked fast enough.
 * Upward drags never dismiss.
 */
export function shouldDismissSheet(
  dragDistance: number,
  releaseVelocity: number,
  thresholds: DismissThresholds,
): boolean {
  if (dragDistance <= 0) {
    return false;
  }

  return (
    dragDistance >= thresholds.dismissDistance || releaseVelocity >= thresholds.dismissVelocity
  );
}

/** Drag offset applied to the sheet: follows the finger down, never up. */
export function clampSheetDrag(dragDistance: number): number {
  return Math.max(0, dragDistance);
}
