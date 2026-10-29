import React from 'react';
import { renderHook } from '@testing-library/react';
import { withSpring } from 'react-native-reanimated';
import { usePressableScale } from '../../src/primitives/PressableScale';
import { NativeUIProvider } from '../../src/theme';

function wrapper({ children }: { children: React.ReactNode }) {
  return <NativeUIProvider config={{ colorMode: 'light' }}>{children}</NativeUIProvider>;
}

describe('usePressableScale', () => {
  describe('GIVEN the hook mounted inside a theme provider with a custom scale factor', () => {
    describe('WHEN the hook is rendered with 0.95 as scale factor', () => {
      it('THEN both onPressIn and onPressOut handlers are exposed as functions', () => {
        const { result } = renderHook(() => usePressableScale(0.95), { wrapper });

        expect(result.current.handlers.onPressIn).toBeInstanceOf(Function);
        expect(result.current.handlers.onPressOut).toBeInstanceOf(Function);
      });
    });
  });

  describe('GIVEN a mounted hook using its default scale', () => {
    describe('WHEN onPressIn and onPressOut are invoked directly', () => {
      it('THEN neither handler throws', () => {
        const { result } = renderHook(() => usePressableScale(), { wrapper });

        const invokeHandlers = () => {
          result.current.handlers.onPressIn();
          result.current.handlers.onPressOut();
        };

        expect(invokeHandlers).not.toThrow();
      });
    });
  });

  describe('GIVEN a mounted hook with a custom scale', () => {
    describe('WHEN the press-in handler runs', () => {
      it('THEN a spring toward that scale is started', () => {
        const spring = jest.mocked(withSpring);
        spring.mockClear();
        const { result } = renderHook(() => usePressableScale(0.9), { wrapper });

        result.current.handlers.onPressIn();

        expect(spring).toHaveBeenCalledWith(0.9, expect.objectContaining({ damping: 15 }));
      });
    });
  });
});
