import type { AccessibilityActionEvent, LayoutChangeEvent } from 'react-native';
import { createGestureEvent } from './gestures';

/** Synthetic-event fields every React Native event shares, without a payload. */
function baseEvent() {
  const { nativeEvent: _touch, touchHistory: _history, ...base } = createGestureEvent();

  return base;
}

export function createLayoutEvent(width: number, height = 0): LayoutChangeEvent {
  return { ...baseEvent(), nativeEvent: { layout: { x: 0, y: 0, width, height } } };
}

export function createAccessibilityActionEvent(actionName: string): AccessibilityActionEvent {
  return { ...baseEvent(), nativeEvent: { actionName } };
}

/** A touch that lands `locationX` points from the leading edge of its view. */
export function createTouchAt(locationX: number) {
  const event = createGestureEvent();

  return { ...event, nativeEvent: { ...event.nativeEvent, locationX } };
}
