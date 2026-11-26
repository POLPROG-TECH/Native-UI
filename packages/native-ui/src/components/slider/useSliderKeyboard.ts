import { useCallback } from 'react';
import { I18nManager, Platform } from 'react-native';
import { valueForKey } from './sliderKeys';
import type { SliderAdjustOptions } from './useSliderAdjust';

/** The part of a key event the slider reads; both React Native and the DOM provide it. */
export interface SliderKeyEvent {
  nativeEvent: { key: string };
  preventDefault: () => void;
}

const WEB = 'web';

/**
 * Arrow, Home and End keys for a focused slider on web. A handled key never
 * scrolls the page, even at a bound where the value cannot change. Native
 * platforms get no handler: there the screen reader actions do this job.
 */
export function useSliderKeyboard(options: SliderAdjustOptions, disabled: boolean) {
  const { value, range, continuousStepRatio, onValueChange, onSlidingComplete } = options;
  const onKeyDown = useCallback(
    (event: SliderKeyEvent) => {
      const context = { value, range, continuousStepRatio, isRTL: I18nManager.isRTL };
      const next = valueForKey(event.nativeEvent.key, context);

      if (next === null) {
        return;
      }

      event.preventDefault();

      if (next === value) {
        return;
      }

      onValueChange(next);
      onSlidingComplete?.(next);
    },
    [value, range, continuousStepRatio, onValueChange, onSlidingComplete],
  );

  return Platform.OS === WEB && !disabled ? { onKeyDown } : {};
}
