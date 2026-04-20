import React from 'react';
import { renderHook } from '@testing-library/react';
import { usePressableScale } from '../../src/primitives/PressableScale';
import { NativeUIProvider } from '../../src/theme';

function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <NativeUIProvider config={{ colorMode: 'light' }}>
      {children}
    </NativeUIProvider>
  );
}

describe('usePressableScale', () => {
  it('should_expose_onPressIn_and_onPressOut_handlers_when_mounted_with_a_custom_scale', () => {
    // GIVEN the hook mounted inside a theme provider with a custom scale factor

    // WHEN the hook is rendered with 0.95 as scale factor
    const { result } = renderHook(() => usePressableScale(0.95), { wrapper });

    // THEN both onPressIn and onPressOut handlers are exposed as functions
    expect(result.current.handlers.onPressIn).toBeInstanceOf(Function);
    expect(result.current.handlers.onPressOut).toBeInstanceOf(Function);
  });

  it('should_invoke_press_handlers_without_throwing_when_called_directly', () => {
    // GIVEN a mounted hook using its default scale
    const { result } = renderHook(() => usePressableScale(), { wrapper });

    // WHEN onPressIn and onPressOut are invoked directly
    const invokeHandlers = () => {
      result.current.handlers.onPressIn();
      result.current.handlers.onPressOut();
    };

    // THEN neither handler throws
    expect(invokeHandlers).not.toThrow();
  });

  it('should_expose_isReanimated_as_a_boolean_reflecting_runtime_detection', () => {
    // GIVEN a mounted hook

    // WHEN isReanimated is inspected
    const { result } = renderHook(() => usePressableScale(), { wrapper });

    // THEN the flag is a boolean
    expect(typeof result.current.isReanimated).toBe('boolean');
  });
});
