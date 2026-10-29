import { Platform } from 'react-native';

/** The slice of the DOM `document` this module needs (the package has no DOM lib). */
interface ListenerTarget {
  addEventListener(type: string, listener: () => void, capture: boolean): void;
}

let keyboardInput = false;
let installed = false;

function isListenerTarget(value: unknown): value is ListenerTarget {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof Reflect.get(value, 'addEventListener') === 'function'
  );
}

/**
 * Records whether the latest interaction on web was a key press or a
 * pointer, so a focus ring is drawn only for keyboard focus (the
 * `:focus-visible` rule, which React Native Web styles cannot express).
 * Native platforms focus controls only from a keyboard or D-pad.
 */
export function trackInputModality(): void {
  const target: unknown = Reflect.get(globalThis, 'document');

  if (installed || Platform.OS !== 'web' || !isListenerTarget(target)) {
    return;
  }

  installed = true;
  target.addEventListener(
    'keydown',
    () => {
      keyboardInput = true;
    },
    true,
  );
  target.addEventListener(
    'pointerdown',
    () => {
      keyboardInput = false;
    },
    true,
  );
}

export function lastInputWasKeyboard(): boolean {
  return Platform.OS !== 'web' || keyboardInput;
}
