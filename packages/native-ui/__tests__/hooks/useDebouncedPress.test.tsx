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

  it('should invoke the callback on the leading edge of the first press', () => {
    // GIVEN a debounced handler wrapping a mocked onPress
    const onPress = jest.fn();
    const { result } = renderHook(() => useDebouncedPress(onPress, 400));

    // WHEN the handler is invoked once
    act(() => result.current());

    // THEN the callback fires immediately on the leading edge
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should ignore repeat presses within the debounce window', () => {
    // GIVEN a debounced handler wrapping a mocked onPress
    const onPress = jest.fn();
    const { result } = renderHook(() => useDebouncedPress(onPress, 400));

    // WHEN the handler is invoked several times within the window
    act(() => result.current());
    act(() => result.current());
    act(() => result.current());

    // THEN only the first press is honoured
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should allow another press after the window elapses', () => {
    // GIVEN a debounced handler that has already fired once
    const onPress = jest.fn();
    const { result } = renderHook(() => useDebouncedPress(onPress, 400));
    act(() => result.current());

    // WHEN the debounce window elapses and the handler is invoked again
    act(() => {
      jest.advanceTimersByTime(400);
    });
    act(() => result.current());

    // THEN the callback fires a second time
    expect(onPress).toHaveBeenCalledTimes(2);
  });

  it('should keep a stable handler identity across renders', () => {
    // GIVEN a debounced handler rendered with an initial callback
    const { result, rerender } = renderHook(
      ({ cb }: { cb: () => void }) => useDebouncedPress(cb, 400),
      { initialProps: { cb: jest.fn() } },
    );
    const first = result.current;

    // WHEN the hook re-renders with a new callback
    rerender({ cb: jest.fn() });

    // THEN the returned handler keeps the same identity
    expect(result.current).toBe(first);
  });

  it('should read the latest callback without changing identity', () => {
    // GIVEN a debounced handler rendered with an initial callback
    const first = jest.fn();
    const second = jest.fn();
    const { result, rerender } = renderHook(
      ({ cb }: { cb: () => void }) => useDebouncedPress(cb, 400),
      { initialProps: { cb: first } },
    );

    // WHEN the callback is replaced and the handler is invoked
    rerender({ cb: second });
    act(() => result.current());

    // THEN the most recent callback runs instead of the stale one
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });
});
