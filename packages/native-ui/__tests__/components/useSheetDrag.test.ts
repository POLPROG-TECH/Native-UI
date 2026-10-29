import { PanResponder, type PanResponderCallbacks } from 'react-native';
import { useSheetDrag } from '../../src/components/bottomSheet/useSheetDrag';
import type { BottomSheetTokens } from '../../src/tokens/components';
import { createGestureEvent, createGestureState } from '../shared/gestures';
import {
  act,
  animatedStyleMock,
  captureTheme,
  evaluateAnimatedStyles,
  renderHook,
} from '../test-utils';

type GestureCallbackName =
  | 'onMoveShouldSetPanResponder'
  | 'onPanResponderMove'
  | 'onPanResponderRelease'
  | 'onPanResponderTerminate';

/**
 * The dom mock's `PanResponder.create` returns inert handlers; spying on it
 * exposes the callbacks the hook registers so a test can drive the gesture.
 */
function captureResponderConfig(): () => PanResponderCallbacks {
  const create = jest.spyOn(PanResponder, 'create');

  return () => {
    const config = create.mock.lastCall?.[0];

    if (!config) {
      throw new Error('PanResponder.create was not called');
    }

    return config;
  };
}

function gestureCallback(config: PanResponderCallbacks, name: GestureCallbackName) {
  const callback = config[name];

  if (!callback) {
    throw new Error(`${name} was not registered`);
  }

  return callback;
}

function renderSheetDrag(enabled: boolean, onDismiss: () => void = jest.fn()) {
  const tokens: BottomSheetTokens = captureTheme().components.bottomSheet;
  const readConfig = captureResponderConfig();
  const hook = renderHook(() => useSheetDrag(enabled, tokens, onDismiss));

  /** Fires one gesture phase, then re-renders so the animated style re-evaluates. */
  const fire = (name: GestureCallbackName, dy: number, vy = 0) => {
    const callback = gestureCallback(readConfig(), name);
    act(() => {
      callback(createGestureEvent(), createGestureState({ dy, vy }));
    });
    hook.rerender();
  };

  return { ...hook, tokens, fire };
}

describe('useSheetDrag', () => {
  beforeEach(() => {
    evaluateAnimatedStyles();
  });
  afterEach(() => {
    animatedStyleMock().mockImplementation(() => ({}));
    jest.restoreAllMocks();
  });

  describe('GIVEN drag to dismiss is disabled', () => {
    describe('WHEN the hook mounts', () => {
      it('THEN no pan handlers are attached and no responder is created', () => {
        const create = jest.spyOn(PanResponder, 'create');
        const tokens = captureTheme().components.bottomSheet;

        const { result } = renderHook(() => useSheetDrag(false, tokens, jest.fn()));

        expect(result.current.panHandlers).toBeUndefined();
        expect(create).not.toHaveBeenCalled();
      });
    });
  });

  describe('GIVEN drag to dismiss is enabled', () => {
    describe('WHEN a move gesture starts', () => {
      it('THEN only a mostly vertical move claims the responder', () => {
        const readConfig = captureResponderConfig();
        const tokens = captureTheme().components.bottomSheet;
        renderHook(() => useSheetDrag(true, tokens, jest.fn()));
        const shouldClaim = gestureCallback(readConfig(), 'onMoveShouldSetPanResponder');

        const vertical = shouldClaim(createGestureEvent(), createGestureState({ dx: 4, dy: 20 }));
        const horizontal = shouldClaim(createGestureEvent(), createGestureState({ dx: 20, dy: 4 }));

        expect(vertical).toBe(true);
        expect(horizontal).toBe(false);
      });
    });

    describe('WHEN the finger drags the sheet down and then above its resting point', () => {
      it('THEN the sheet follows downward moves and never rises above rest', () => {
        const { result, fire } = renderSheetDrag(true);

        fire('onPanResponderMove', 120);
        const draggedDown = result.current.animatedStyle;
        fire('onPanResponderMove', -40);

        expect(draggedDown).toEqual({ transform: [{ translateY: 120 }] });
        expect(result.current.animatedStyle).toEqual({ transform: [{ translateY: 0 }] });
      });
    });

    describe('WHEN the sheet is released past the dismiss distance', () => {
      it('THEN onDismiss fires and the sheet springs back to rest', () => {
        const onDismiss = jest.fn();
        const { result, tokens, fire } = renderSheetDrag(true, onDismiss);

        fire('onPanResponderMove', tokens.dismissDistance + 10);
        fire('onPanResponderRelease', tokens.dismissDistance + 10);

        expect(onDismiss).toHaveBeenCalledTimes(1);
        expect(result.current.animatedStyle).toEqual({ transform: [{ translateY: 0 }] });
      });
    });

    describe('WHEN the sheet is released short of the distance with a slow finger', () => {
      it('THEN the sheet springs back without dismissing', () => {
        const onDismiss = jest.fn();
        const { result, tokens, fire } = renderSheetDrag(true, onDismiss);

        fire('onPanResponderMove', tokens.dismissDistance - 10);
        fire('onPanResponderRelease', tokens.dismissDistance - 10, tokens.dismissVelocity / 2);

        expect(onDismiss).not.toHaveBeenCalled();
        expect(result.current.animatedStyle).toEqual({ transform: [{ translateY: 0 }] });
      });
    });

    describe('WHEN a short drag is released with a fast downward flick', () => {
      it('THEN the flick alone dismisses the sheet', () => {
        const onDismiss = jest.fn();
        const { tokens, fire } = renderSheetDrag(true, onDismiss);

        fire('onPanResponderRelease', 10, tokens.dismissVelocity);

        expect(onDismiss).toHaveBeenCalledTimes(1);
      });
    });

    describe('WHEN another responder takes over mid-drag', () => {
      it('THEN the sheet springs back without dismissing', () => {
        const onDismiss = jest.fn();
        const { result, tokens, fire } = renderSheetDrag(true, onDismiss);

        fire('onPanResponderMove', tokens.dismissDistance + 10);
        fire('onPanResponderTerminate', tokens.dismissDistance + 10);

        expect(onDismiss).not.toHaveBeenCalled();
        expect(result.current.animatedStyle).toEqual({ transform: [{ translateY: 0 }] });
      });
    });
  });
});
