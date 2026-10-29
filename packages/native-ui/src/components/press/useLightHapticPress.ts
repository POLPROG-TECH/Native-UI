import { useDebouncedPress } from '../../hooks/useDebouncedPress';
import { getHaptics } from '../../utils/haptics';

/**
 * Debounced press handler that plays a light haptic before `onPress`, the
 * standard feedback for compact icon-led controls.
 */
export function useLightHapticPress(onPress: () => void, debounceMs: number): () => void {
  return useDebouncedPress(() => {
    getHaptics().light();
    onPress();
  }, debounceMs);
}
