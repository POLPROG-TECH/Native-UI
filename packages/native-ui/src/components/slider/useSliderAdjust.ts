import { useCallback } from 'react';
import type { AccessibilityActionEvent } from 'react-native';
import { SLIDER_DIRECTION, nudgeValue, type SliderRange } from './sliderMath';

export const ADJUST_ACTIONS = { increment: 'increment', decrement: 'decrement' } as const;

export const ADJUST_ACCESSIBILITY_ACTIONS = [
  { name: ADJUST_ACTIONS.increment },
  { name: ADJUST_ACTIONS.decrement },
];

export interface SliderAdjustOptions {
  value: number;
  range: SliderRange;
  continuousStepRatio: number;
  onValueChange: (value: number) => void;
  onSlidingComplete: ((value: number) => void) | undefined;
}

/**
 * Handler of the screen reader's increment and decrement gestures. One
 * gesture is a complete change, so it also reports `onSlidingComplete`.
 */
export function useSliderAdjust(options: SliderAdjustOptions) {
  const { value, range, continuousStepRatio, onValueChange, onSlidingComplete } = options;

  return useCallback(
    (event: AccessibilityActionEvent) => {
      const up = event.nativeEvent.actionName === ADJUST_ACTIONS.increment;
      const direction = up ? SLIDER_DIRECTION.up : SLIDER_DIRECTION.down;
      const next = nudgeValue(value, direction, range, continuousStepRatio);

      onValueChange(next);
      onSlidingComplete?.(next);
    },
    [value, range, continuousStepRatio, onValueChange, onSlidingComplete],
  );
}
