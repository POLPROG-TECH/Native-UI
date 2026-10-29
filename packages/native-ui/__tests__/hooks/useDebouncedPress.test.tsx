import { act, renderHook } from '@testing-library/react';
import { useDebouncedPress } from '../../src/hooks/useDebouncedPress';

describe('useDebouncedPress', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('GIVEN a debounced handler wrapping a mocked onPress', () => {
    describe('WHEN the handler is invoked once', () => {
      it('THEN the callback fires immediately on the leading edge', () => {
        const onPress = jest.fn();
        const { result } = renderHook(() => useDebouncedPress(onPress, 400));

        act(() => result.current());

        expect(onPress).toHaveBeenCalledTimes(1);
      });
    });

    describe('WHEN the handler is invoked several times within the window', () => {
      it('THEN only the first press is honoured', () => {
        const onPress = jest.fn();
        const { result } = renderHook(() => useDebouncedPress(onPress, 400));

        act(() => result.current());
        act(() => result.current());
        act(() => result.current());

        expect(onPress).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('GIVEN a debounced handler that has already fired once', () => {
    describe('WHEN the debounce window elapses and the handler is invoked again', () => {
      it('THEN the callback fires a second time', () => {
        const onPress = jest.fn();
        const { result } = renderHook(() => useDebouncedPress(onPress, 400));
        act(() => result.current());

        act(() => {
          jest.advanceTimersByTime(400);
        });
        act(() => result.current());

        expect(onPress).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('GIVEN a debounced handler rendered with an initial callback', () => {
    describe('WHEN the hook re-renders with a new callback', () => {
      it('THEN the returned handler keeps the same identity', () => {
        const { result, rerender } = renderHook(
          ({ cb }: { cb: () => void }) => useDebouncedPress(cb, 400),
          { initialProps: { cb: jest.fn() } },
        );
        const first = result.current;

        rerender({ cb: jest.fn() });

        expect(result.current).toBe(first);
      });
    });

    describe('WHEN the callback is replaced and the handler is invoked', () => {
      it('THEN the most recent callback runs instead of the stale one', () => {
        const first = jest.fn();
        const second = jest.fn();
        const { result, rerender } = renderHook(
          ({ cb }: { cb: () => void }) => useDebouncedPress(cb, 400),
          { initialProps: { cb: first } },
        );

        rerender({ cb: second });
        act(() => result.current());

        expect(first).not.toHaveBeenCalled();
        expect(second).toHaveBeenCalledTimes(1);
      });
    });
  });
});
