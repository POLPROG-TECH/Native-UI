import { Keyboard, type KeyboardEvent, type KeyboardEventName } from 'react-native';

export type KeyboardListener = (event: KeyboardEvent) => void;

/**
 * Records the listeners code under test registers (so a test can fire them)
 * while still registering them for real, which keeps the returned
 * subscription typed. Undo with `jest.restoreAllMocks()`.
 */
export function captureKeyboardListeners(): Map<KeyboardEventName, KeyboardListener> {
  const listeners = new Map<KeyboardEventName, KeyboardListener>();
  const register = Keyboard.addListener.bind(Keyboard);
  jest.spyOn(Keyboard, 'addListener').mockImplementation((eventName, listener) => {
    listeners.set(eventName, listener);

    return register(eventName, listener);
  });

  return listeners;
}

/** A keyboard event whose top edge sits at `screenY`. */
export function keyboardAt(screenY: number): KeyboardEvent {
  return {
    duration: 0,
    easing: 'keyboard',
    endCoordinates: { screenX: 0, screenY, width: 320, height: 300 },
  };
}
