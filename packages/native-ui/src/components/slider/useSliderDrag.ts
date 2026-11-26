import { useCallback, useMemo, useRef, type RefObject } from 'react';
import {
  I18nManager,
  PanResponder,
  type GestureResponderHandlers,
  type LayoutChangeEvent,
  type PanResponderGestureState,
} from 'react-native';
import { valueAtFraction, type SliderRange } from './sliderMath';

export interface SliderDragOptions {
  value: number;
  range: SliderRange;
  disabled: boolean;
  /** Diameter of the thumb; its center, not its edge, follows the finger. */
  thumbSize: number;
  onValueChange: (value: number) => void;
  onSlidingComplete: ((value: number) => void) | undefined;
}

/** Track position 0..1 of a touch at `x`, mirrored in right-to-left layouts. */
function fractionAt(x: number, width: number, thumbSize: number): number {
  const travel = width - thumbSize;

  if (travel <= 0) {
    return 0;
  }

  const fraction = (x - thumbSize / 2) / travel;

  return I18nManager.isRTL ? 1 - fraction : fraction;
}

interface DragState {
  touchStart: number;
  /** True once the finger moved sideways; from then on the slider keeps the gesture. */
  dragging: boolean;
}

/** A move that is more vertical than horizontal belongs to a scroll view, not to the slider. */
function isHorizontal(gesture: PanResponderGestureState): boolean {
  return Math.abs(gesture.dx) >= Math.abs(gesture.dy);
}

function createReporter(latest: RefObject<SliderDragOptions>, width: RefObject<number>) {
  const valueAt = (x: number) =>
    valueAtFraction(fractionAt(x, width.current, latest.current.thumbSize), latest.current.range);
  const report = (x: number) => {
    const next = valueAt(x);

    if (next !== latest.current.value) {
      latest.current.onValueChange(next);
    }
  };

  return { valueAt, report };
}

/**
 * The handlers read the newest props through `latest`, so the responder is
 * created once and a drag is never interrupted by a re-render.
 *
 * Touching the row changes nothing yet: the value moves when the finger
 * drags sideways, or on release for a tap. A vertical swipe that starts on
 * the slider therefore scrolls the page without changing the value, and once
 * a sideways drag has begun the scroll view can no longer take it over.
 */
function createDragHandlers(
  latest: RefObject<SliderDragOptions>,
  width: RefObject<number>,
): GestureResponderHandlers {
  const state: DragState = { touchStart: 0, dragging: false };
  const { valueAt, report } = createReporter(latest, width);

  return PanResponder.create({
    onStartShouldSetPanResponder: () => !latest.current.disabled,
    onMoveShouldSetPanResponder: () => !latest.current.disabled,
    onPanResponderGrant: (event) => {
      state.touchStart = event.nativeEvent.locationX;
      state.dragging = false;
    },
    onPanResponderMove: (_event, gesture) => {
      state.dragging = state.dragging || isHorizontal(gesture);

      if (state.dragging) {
        report(state.touchStart + gesture.dx);
      }
    },
    onPanResponderTerminationRequest: () => !state.dragging,
    onPanResponderRelease: (_event, gesture) => {
      report(state.touchStart + gesture.dx);
      latest.current.onSlidingComplete?.(valueAt(state.touchStart + gesture.dx));
    },
  }).panHandlers;
}

/**
 * Drag gesture of the slider row: a tap moves the value to that point and a
 * sideways drag follows the finger. Uses core `PanResponder`, so no
 * gesture-handler dependency is needed.
 */
export function useSliderDrag(options: SliderDragOptions) {
  const latest = useRef(options);
  const width = useRef(0);

  latest.current = options;

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    width.current = event.nativeEvent.layout.width;
  }, []);
  const panHandlers = useMemo(() => createDragHandlers(latest, width), []);

  return { onLayout, panHandlers };
}
