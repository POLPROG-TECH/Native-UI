import type { AccessibilityValue } from 'react-native';
import { roundToStepPrecision } from '../../utils/stepPrecision';

/** Bounds and granularity of a slider. `step` 0 means continuous. */
export interface SliderRange {
  min: number;
  max: number;
  step: number;
}

export const SLIDER_DIRECTION = { up: 1, down: -1 } as const;

export type SliderDirection = (typeof SLIDER_DIRECTION)[keyof typeof SLIDER_DIRECTION];

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function snapToStep(value: number, range: SliderRange): number {
  const clamped = clamp(value, range.min, range.max);

  if (range.step <= 0) {
    return clamped;
  }

  const steps = Math.round((clamped - range.min) / range.step);
  const snapped = roundToStepPrecision(range.min + steps * range.step, range.step);

  return clamp(snapped, range.min, range.max);
}

/** Position of `value` in the range as 0..1; an empty range reads as 0. */
export function fractionOf(value: number, range: SliderRange): number {
  const span = range.max - range.min;

  if (span <= 0) {
    return 0;
  }

  return clamp((value - range.min) / span, 0, 1);
}

export function valueAtFraction(fraction: number, range: SliderRange): number {
  return snapToStep(range.min + clamp(fraction, 0, 1) * (range.max - range.min), range);
}

/**
 * One accessibility increment or decrement: a full `step`, or for a
 * continuous slider the given share of the range.
 */
export function nudgeValue(
  value: number,
  direction: SliderDirection,
  range: SliderRange,
  continuousStepRatio: number,
): number {
  const delta = range.step > 0 ? range.step : (range.max - range.min) * continuousStepRatio;

  return snapToStep(value + direction * delta, range);
}

/**
 * Android reads `min` / `max` / `now` as integers, so they are only sent for
 * whole-number ranges; every slider also sends the value as text.
 */
export function sliderAccessibilityValue(
  value: number,
  range: SliderRange,
  formatValue: (value: number) => string,
): AccessibilityValue {
  const text = formatValue(value);
  const wholeNumbers = [range.min, range.max, value].every(Number.isInteger);

  return wholeNumbers ? { min: range.min, max: range.max, now: value, text } : { text };
}

/** The browser takes decimals, so on web the numbers are always sent. */
export function sliderWebValue(
  value: number,
  range: SliderRange,
  formatValue: (value: number) => string,
): AccessibilityValue {
  return { min: range.min, max: range.max, now: value, text: formatValue(value) };
}
