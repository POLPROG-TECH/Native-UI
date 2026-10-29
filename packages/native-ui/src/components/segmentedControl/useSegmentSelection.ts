import { useCallback } from 'react';
import { getHaptics, type HapticsInterface } from '../../utils/haptics';

/**
 * Selection handler for a segmented control. Re-selecting the current value is
 * a no-op, so neither the haptic nor `onChange` fires for it.
 */
export function useSegmentSelection<T extends string>(
  value: T,
  haptic: keyof HapticsInterface | false,
  onChange: (value: T) => void,
): (next: T) => void {
  return useCallback(
    (next: T) => {
      if (next === value) {
        return;
      }

      if (haptic) {
        getHaptics()[haptic]();
      }

      onChange(next);
    },
    [value, haptic, onChange],
  );
}
