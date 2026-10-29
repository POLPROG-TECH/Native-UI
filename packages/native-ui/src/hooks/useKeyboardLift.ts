import { useEffect, useRef, useState, type ComponentRef, type RefObject } from 'react';
import { Keyboard, Platform, type View } from 'react-native';

/** Instance type of a mounted `View` (the object exposing `measure`). */
export type ViewRef = ComponentRef<typeof View>;

/** The part of a host view the hook needs; any mounted `View` satisfies it. */
export interface MeasurableView {
  measure: ViewRef['measure'];
}

/**
 * Returns how far (points) a bottom-anchored view must move up so the
 * software keyboard does not cover it, or `0` while the keyboard is hidden.
 *
 * Needed on Android with edge-to-edge (targetSdk 35+): the window no longer
 * resizes for the keyboard, so a footer in normal flow ends up underneath it.
 * The view's bottom edge is measured once per keyboard session (in screen
 * coordinates, the space of `endCoordinates.screenY`) and cached while the
 * keyboard switches layouts; re-measuring with the lift applied would report
 * the shifted position. The cache resets on hide because layout may change
 * meanwhile (rotation, font scale).
 */
/** Bottom edge of the view in screen coordinates, measured after layout settles. */
function measureBottomEdge(ref: RefObject<MeasurableView | null>, onMeasured: (y: number) => void) {
  requestAnimationFrame(() => {
    ref.current?.measure((_x, _y, _width, height, _pageX, pageY) => onMeasured(pageY + height));
  });
}

export function useKeyboardLift(ref: RefObject<MeasurableView | null>, enabled: boolean): number {
  const baseBottomRef = useRef<number | null>(null);
  const [lift, setLift] = useState(0);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const show = Keyboard.addListener('keyboardDidShow', (event) => {
      const applyLift = (baseBottom: number) => {
        baseBottomRef.current = baseBottom;
        setLift(Math.max(0, baseBottom - event.endCoordinates.screenY));
      };

      if (baseBottomRef.current != null) {
        applyLift(baseBottomRef.current);

        return;
      }

      measureBottomEdge(ref, applyLift);
    });
    const hide = Keyboard.addListener('keyboardDidHide', () => {
      baseBottomRef.current = null;
      setLift(0);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, [enabled, ref]);

  return enabled ? lift : 0;
}

/** Platforms where the lift is needed by default (see `useKeyboardLift`). */
export const KEYBOARD_LIFT_DEFAULT_ENABLED = Platform.OS === 'android';
