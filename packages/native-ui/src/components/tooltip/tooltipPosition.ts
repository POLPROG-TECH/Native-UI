export const TOOLTIP_PLACEMENT = { top: 'top', bottom: 'bottom' } as const;

export type TooltipPlacement = (typeof TOOLTIP_PLACEMENT)[keyof typeof TOOLTIP_PLACEMENT];

/** A box in window coordinates. */
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface TooltipPositionInput {
  placement: TooltipPlacement;
  trigger: Rect;
  bubble: Size;
  window: Size;
  offset: number;
  edgeInset: number;
}

export interface TooltipPosition {
  placement: TooltipPlacement;
  shiftX: number;
}

function fitsAbove(input: TooltipPositionInput): boolean {
  return input.trigger.y - input.offset - input.bubble.height >= input.edgeInset;
}

function fitsBelow(input: TooltipPositionInput): boolean {
  const bottom = input.trigger.y + input.trigger.height + input.offset + input.bubble.height;

  return bottom <= input.window.height - input.edgeInset;
}

/** The requested side wins unless only the other one has room. */
function resolvePlacement(input: TooltipPositionInput): TooltipPlacement {
  const above = fitsAbove(input);
  const below = fitsBelow(input);

  if (input.placement === TOOLTIP_PLACEMENT.top) {
    return above || !below ? TOOLTIP_PLACEMENT.top : TOOLTIP_PLACEMENT.bottom;
  }

  return below || !above ? TOOLTIP_PLACEMENT.bottom : TOOLTIP_PLACEMENT.top;
}

/** A bubble wider than the window is pinned to the leading inset. */
function resolveShift(input: TooltipPositionInput): number {
  const { trigger, bubble, window, edgeInset } = input;
  const centeredLeft = trigger.x + trigger.width / 2 - bubble.width / 2;
  const maxLeft = Math.max(window.width - edgeInset - bubble.width, edgeInset);
  const left = Math.min(Math.max(centeredLeft, edgeInset), maxLeft);

  return left - centeredLeft;
}

/**
 * Where the bubble goes once the trigger and the bubble are measured: it
 * flips to the other side when the requested one has no room, and slides
 * sideways so it never leaves the window.
 */
export function resolveTooltipPosition(input: TooltipPositionInput): TooltipPosition {
  return { placement: resolvePlacement(input), shiftX: resolveShift(input) };
}
