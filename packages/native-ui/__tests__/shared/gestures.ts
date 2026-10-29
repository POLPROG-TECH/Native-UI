import type { GestureResponderEvent, PanResponderGestureState } from 'react-native';

/**
 * Fully typed PanResponder inputs for invoking captured gesture callbacks
 * directly. Only the fields a test cares about need overriding; the rest
 * describe a single finger at rest at the origin.
 */
export function createGestureState(
  overrides: Partial<PanResponderGestureState> = {},
): PanResponderGestureState {
  return {
    stateID: 1,
    moveX: 0,
    moveY: 0,
    x0: 0,
    y0: 0,
    dx: 0,
    dy: 0,
    vx: 0,
    vy: 0,
    numberActiveTouches: 1,
    ...overrides,
  };
}

/** A touch event with no meaningful payload, for callbacks that ignore it. */
export function createGestureEvent(): GestureResponderEvent {
  const touch = {
    changedTouches: [],
    identifier: 1,
    locationX: 0,
    locationY: 0,
    pageX: 0,
    pageY: 0,
    target: undefined,
    timestamp: 0,
    touches: [],
  };

  return {
    bubbles: false,
    cancelable: false,
    currentTarget: 0,
    defaultPrevented: false,
    dispatchConfig: { registrationName: 'onResponderMove' },
    eventPhase: 0,
    preventDefault: () => {},
    isDefaultPrevented: () => false,
    stopPropagation: () => {},
    isPropagationStopped: () => false,
    isTrusted: true,
    nativeEvent: touch,
    persist: () => {},
    target: undefined,
    timeStamp: 0,
    type: 'touch',
    touchHistory: {
      indexOfSingleActiveTouch: 0,
      mostRecentTimeStamp: 0,
      numberActiveTouches: 1,
      touchBank: [],
    },
  };
}
