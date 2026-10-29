import type { StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import { useFocusRing, type FocusRingResult } from '../../hooks/useFocusRing';

/** Where the keyboard focus outline is drawn relative to the element's edge. */
export type SelectFocusRingPlacement = 'outside' | 'inset';

export interface SelectFocusRing {
  focusProps: FocusRingResult['focusProps'];
  /** Append to the focusable element's style. */
  focusRingStyle: StyleProp<ViewStyle>;
}

/**
 * Themed focus ring for Select's trigger and option rows. Option rows fill a
 * scrolling list that clips anything outside its bounds, so their outline is
 * pulled inside the row (`inset`) to stay fully visible.
 */
export function useSelectFocusRing(placement: SelectFocusRingPlacement): SelectFocusRing {
  const theme = useTheme();
  const { focusProps, focusRingStyle, isFocusVisible } = useFocusRing();
  const insetStyle: ViewStyle | undefined =
    isFocusVisible && placement === 'inset'
      ? { outlineOffset: -theme.components.focusRing.width }
      : undefined;

  return { focusProps, focusRingStyle: [focusRingStyle, insetStyle] };
}
