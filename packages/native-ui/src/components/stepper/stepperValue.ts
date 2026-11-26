import { roundToStepPrecision } from '../../utils/stepPrecision';

export const STEP_DIRECTION = { increase: 1, decrease: -1 } as const;

export type StepDirection = (typeof STEP_DIRECTION)[keyof typeof STEP_DIRECTION];

export interface StepperBounds {
  min: number;
  max: number;
  step: number;
}

export function stepValue(value: number, direction: StepDirection, bounds: StepperBounds): number {
  const next = roundToStepPrecision(value + direction * bounds.step, bounds.step);

  return Math.min(Math.max(next, bounds.min), bounds.max);
}

export function canStep(value: number, direction: StepDirection, bounds: StepperBounds): boolean {
  return stepValue(value, direction, bounds) !== value;
}
