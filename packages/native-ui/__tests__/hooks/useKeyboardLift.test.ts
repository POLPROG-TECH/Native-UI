import { act, renderHook } from '@testing-library/react';
import { useKeyboardLift, type MeasurableView } from '../../src/hooks/useKeyboardLift';
import { captureKeyboardListeners, keyboardAt } from '../shared/keyboard';

/** A view whose bottom edge sits at y = 600 + 40 = 640. */
function viewEndingAt640(): { current: MeasurableView } {
  return {
    current: {
      measure: jest.fn((callback) => callback(0, 0, 320, 40, 0, 600)),
    },
  };
}

describe('useKeyboardLift', () => {
  beforeEach(() => {
    jest.spyOn(global, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0);

      return 0;
    });
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GIVEN an enabled hook watching a view that ends at y = 640', () => {
    describe('WHEN the keyboard shows with its top at y = 400, then switches layout', () => {
      it('THEN the lift follows the overlap and the view is measured only once', () => {
        const listeners = captureKeyboardListeners();
        const ref = viewEndingAt640();
        const { result } = renderHook(() => useKeyboardLift(ref, true));

        act(() => listeners.get('keyboardDidShow')?.(keyboardAt(400)));
        const firstLift = result.current;
        act(() => listeners.get('keyboardDidShow')?.(keyboardAt(440)));

        expect(firstLift).toBe(240);
        expect(result.current).toBe(200);
        expect(ref.current.measure).toHaveBeenCalledTimes(1);

        /* AND hiding the keyboard drops the lift */
        act(() => listeners.get('keyboardDidHide')?.(keyboardAt(640)));
        expect(result.current).toBe(0);
      });
    });
  });

  describe('GIVEN a keyboard whose top edge is under the view', () => {
    describe('WHEN it shows', () => {
      it('THEN nothing moves', () => {
        const listeners = captureKeyboardListeners();
        const { result } = renderHook(() => useKeyboardLift(viewEndingAt640(), true));

        act(() => listeners.get('keyboardDidShow')?.(keyboardAt(700)));

        expect(result.current).toBe(0);
      });
    });
  });

  describe('GIVEN a disabled hook', () => {
    describe('WHEN it mounts', () => {
      it('THEN no listener is registered and the lift is zero', () => {
        const listeners = captureKeyboardListeners();

        const { result } = renderHook(() => useKeyboardLift(viewEndingAt640(), false));

        expect(listeners.size).toBe(0);
        expect(result.current).toBe(0);
      });
    });
  });
});
