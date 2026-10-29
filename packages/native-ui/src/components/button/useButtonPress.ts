import { useDebouncedPress } from '../../hooks/useDebouncedPress';
import { getHaptics } from '../../utils/haptics';
import type { ButtonHaptic } from './types';

/** Debounced press handler that plays the configured haptic before `onPress`. */
export function useButtonPress(
  onPress: () => void,
  haptic: ButtonHaptic,
  debounceMs: number,
): () => void {
  return useDebouncedPress(() => {
    if (haptic) {
      getHaptics()[haptic]();
    }

    onPress();
  }, debounceMs);
}
