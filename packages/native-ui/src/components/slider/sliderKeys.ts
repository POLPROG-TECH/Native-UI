import { SLIDER_DIRECTION, nudgeValue, type SliderDirection, type SliderRange } from './sliderMath';

/** Keys a focused slider answers to, as in the ARIA slider pattern. */
const SLIDER_KEY = {
  right: 'ArrowRight',
  left: 'ArrowLeft',
  up: 'ArrowUp',
  down: 'ArrowDown',
  home: 'Home',
  end: 'End',
} as const;

/** Up always increases; the horizontal arrows follow the reading direction. */
function keyDirection(key: string, isRTL: boolean): SliderDirection | null {
  const forward = isRTL ? SLIDER_KEY.left : SLIDER_KEY.right;
  const backward = isRTL ? SLIDER_KEY.right : SLIDER_KEY.left;

  if (key === forward || key === SLIDER_KEY.up) {
    return SLIDER_DIRECTION.up;
  }

  if (key === backward || key === SLIDER_KEY.down) {
    return SLIDER_DIRECTION.down;
  }

  return null;
}

export interface SliderKeyContext {
  value: number;
  range: SliderRange;
  continuousStepRatio: number;
  isRTL: boolean;
}

export function valueForKey(key: string, context: SliderKeyContext): number | null {
  const { value, range, continuousStepRatio, isRTL } = context;

  if (key === SLIDER_KEY.home) {
    return range.min;
  }

  if (key === SLIDER_KEY.end) {
    return range.max;
  }

  const direction = keyDirection(key, isRTL);

  return direction === null ? null : nudgeValue(value, direction, range, continuousStepRatio);
}
