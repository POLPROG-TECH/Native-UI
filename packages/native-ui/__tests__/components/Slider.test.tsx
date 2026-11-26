import { act, renderHook, screen } from '@testing-library/react';
import { I18nManager, PanResponder, type PanResponderCallbacks } from 'react-native';
import { Slider } from '../../src/components/Slider';
import { ADJUST_ACTIONS, useSliderAdjust } from '../../src/components/slider/useSliderAdjust';
import { useSliderDrag, type SliderDragOptions } from '../../src/components/slider/useSliderDrag';
import { createAccessibilityActionEvent, createLayoutEvent, createTouchAt } from '../shared/events';
import { createGestureState } from '../shared/gestures';
import { defined, renderWithTheme } from '../test-utils';

const PERCENT = { min: 0, max: 100, step: 10 };
/* A 224pt row with a 24pt thumb leaves exactly 200pt of travel: 2pt per unit. */
const ROW_WIDTH = 224;
const THUMB_SIZE = 24;
const ROW_START = THUMB_SIZE / 2;

function lastCreateConfig(create: jest.SpyInstance<unknown, [PanResponderCallbacks]>) {
  return defined(create.mock.calls[create.mock.calls.length - 1])[0];
}

function setupDrag(overrides: Partial<SliderDragOptions> = {}) {
  const create = jest.spyOn(PanResponder, 'create');
  const options: SliderDragOptions = {
    value: 0,
    range: PERCENT,
    disabled: false,
    thumbSize: THUMB_SIZE,
    onValueChange: jest.fn(),
    onSlidingComplete: jest.fn(),
    ...overrides,
  };
  const { result } = renderHook(() => useSliderDrag(options));
  const callbacks: PanResponderCallbacks = lastCreateConfig(create);

  act(() => result.current.onLayout(createLayoutEvent(ROW_WIDTH)));

  return { options, callbacks };
}

/*
 * Drag math, accessibility adjustments and tokens. That a device exposes the
 * slider as adjustable with its value is proven in
 * `__tests__/native/Slider.test.tsx`.
 */
describe('Slider', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    I18nManager.isRTL = false;
  });

  describe('GIVEN a slider row that has been measured', () => {
    describe('WHEN the row is touched in the middle and nothing else happens', () => {
      it('THEN the value does not change yet, so a scroll can still begin', () => {
        const { options, callbacks } = setupDrag();

        callbacks.onPanResponderGrant?.(createTouchAt(ROW_START + 100), createGestureState());

        expect(options.onValueChange).not.toHaveBeenCalled();
      });
    });

    describe('WHEN the row is tapped in the middle', () => {
      it('THEN on release the value moves to the step under the finger and completes', () => {
        const { options, callbacks } = setupDrag();

        callbacks.onPanResponderGrant?.(createTouchAt(ROW_START + 100), createGestureState());
        callbacks.onPanResponderRelease?.(createTouchAt(0), createGestureState());

        expect(options.onValueChange).toHaveBeenCalledWith(50);
        expect(options.onSlidingComplete).toHaveBeenCalledWith(50);
      });
    });

    describe('WHEN the finger drags sideways from the touch point', () => {
      it('THEN the value follows the finger and snaps to steps', () => {
        const { options, callbacks } = setupDrag();

        callbacks.onPanResponderGrant?.(createTouchAt(ROW_START + 100), createGestureState());
        callbacks.onPanResponderMove?.(createTouchAt(0), createGestureState({ dx: 61 }));

        expect(options.onValueChange).toHaveBeenLastCalledWith(80);
      });
    });

    describe('WHEN the finger moves mostly up or down', () => {
      it('THEN the value stays and the scroll view may take the gesture', () => {
        const { options, callbacks } = setupDrag();

        callbacks.onPanResponderGrant?.(createTouchAt(ROW_START + 100), createGestureState());
        callbacks.onPanResponderMove?.(createTouchAt(0), createGestureState({ dx: 8, dy: 60 }));
        const released = callbacks.onPanResponderTerminationRequest?.(
          createTouchAt(0),
          createGestureState({ dx: 8, dy: 60 }),
        );

        expect(options.onValueChange).not.toHaveBeenCalled();
        expect(released).toBe(true);
      });
    });

    describe('WHEN a sideways drag is under way', () => {
      it('THEN the slider keeps the gesture even if the finger drifts vertically', () => {
        const { options, callbacks } = setupDrag();

        callbacks.onPanResponderGrant?.(createTouchAt(ROW_START + 100), createGestureState());
        callbacks.onPanResponderMove?.(createTouchAt(0), createGestureState({ dx: 40 }));
        const released = callbacks.onPanResponderTerminationRequest?.(
          createTouchAt(0),
          createGestureState({ dx: 40, dy: 90 }),
        );
        callbacks.onPanResponderMove?.(createTouchAt(0), createGestureState({ dx: 60, dy: 90 }));

        expect(released).toBe(false);
        expect(options.onValueChange).toHaveBeenLastCalledWith(80);
      });
    });

    describe('WHEN the finger is dragged past the end of the track', () => {
      it('THEN the value stops at the maximum', () => {
        const { options, callbacks } = setupDrag();

        callbacks.onPanResponderGrant?.(createTouchAt(ROW_START + 100), createGestureState());
        callbacks.onPanResponderMove?.(createTouchAt(0), createGestureState({ dx: 900 }));

        expect(options.onValueChange).toHaveBeenLastCalledWith(100);
      });
    });

    describe('WHEN the finger lifts after a drag', () => {
      it('THEN onSlidingComplete receives the final value once', () => {
        const { options, callbacks } = setupDrag();

        callbacks.onPanResponderGrant?.(createTouchAt(ROW_START + 100), createGestureState());
        callbacks.onPanResponderRelease?.(createTouchAt(0), createGestureState({ dx: 40 }));

        expect(options.onSlidingComplete).toHaveBeenCalledTimes(1);
        expect(options.onSlidingComplete).toHaveBeenCalledWith(70);
      });
    });

    describe('WHEN the tap lands on the value the slider already has', () => {
      it('THEN no change is reported', () => {
        const { options, callbacks } = setupDrag({ value: 50 });

        callbacks.onPanResponderGrant?.(createTouchAt(ROW_START + 100), createGestureState());
        callbacks.onPanResponderRelease?.(createTouchAt(0), createGestureState());

        expect(options.onValueChange).not.toHaveBeenCalled();
      });
    });
  });

  describe('GIVEN a right-to-left layout', () => {
    describe('WHEN the row is touched a quarter of the way from the left', () => {
      it('THEN the value is measured from the right edge', () => {
        I18nManager.isRTL = true;
        const { options, callbacks } = setupDrag();

        callbacks.onPanResponderGrant?.(createTouchAt(ROW_START + 50), createGestureState());
        callbacks.onPanResponderRelease?.(createTouchAt(0), createGestureState());

        expect(options.onValueChange).toHaveBeenCalledWith(80);
      });
    });
  });

  describe('GIVEN a disabled slider', () => {
    describe('WHEN a touch starts on it', () => {
      it('THEN it refuses to become the responder', () => {
        const { callbacks } = setupDrag({ disabled: true });

        const claimed = callbacks.onStartShouldSetPanResponder?.(
          createTouchAt(ROW_START),
          createGestureState(),
        );

        expect(claimed).toBe(false);
      });
    });
  });

  describe('GIVEN a row that has not been measured yet', () => {
    describe('WHEN it is touched', () => {
      it('THEN the value falls back to the minimum instead of NaN', () => {
        const create = jest.spyOn(PanResponder, 'create');
        const onValueChange = jest.fn();
        renderHook(() =>
          useSliderDrag({
            value: 30,
            range: PERCENT,
            disabled: false,
            thumbSize: THUMB_SIZE,
            onValueChange,
            onSlidingComplete: undefined,
          }),
        );
        const callbacks: PanResponderCallbacks = lastCreateConfig(create);

        callbacks.onPanResponderGrant?.(createTouchAt(80), createGestureState());
        callbacks.onPanResponderRelease?.(createTouchAt(0), createGestureState());

        expect(onValueChange).toHaveBeenCalledWith(0);
      });
    });
  });

  describe('GIVEN a screen reader adjusting the slider', () => {
    describe('WHEN the increment action arrives', () => {
      it('THEN the value moves one step up and the change is completed', () => {
        const onValueChange = jest.fn();
        const onSlidingComplete = jest.fn();
        const { result } = renderHook(() =>
          useSliderAdjust({
            value: 40,
            range: PERCENT,
            continuousStepRatio: 0.1,
            onValueChange,
            onSlidingComplete,
          }),
        );

        result.current(createAccessibilityActionEvent(ADJUST_ACTIONS.increment));

        expect(onValueChange).toHaveBeenCalledWith(50);
        expect(onSlidingComplete).toHaveBeenCalledWith(50);
      });
    });

    describe('WHEN the decrement action arrives', () => {
      it('THEN the value moves one step down', () => {
        const onValueChange = jest.fn();
        const { result } = renderHook(() =>
          useSliderAdjust({
            value: 40,
            range: PERCENT,
            continuousStepRatio: 0.1,
            onValueChange,
            onSlidingComplete: undefined,
          }),
        );

        result.current(createAccessibilityActionEvent(ADJUST_ACTIONS.decrement));

        expect(onValueChange).toHaveBeenCalledWith(30);
      });
    });
  });

  describe('GIVEN a rendered slider at 40 of 100', () => {
    describe('WHEN its accessibility value is read', () => {
      it('THEN the range, the value and the formatted text are exposed', () => {
        renderWithTheme(
          <Slider
            accessibilityLabel="Volume"
            value={40}
            onValueChange={() => {}}
            maximumValue={100}
            step={10}
            formatValue={(value) => `${value}%`}
          />,
        );

        const slider = screen.getByLabelText('Volume');

        expect(slider).toHaveAttribute('aria-valuenow', '40');
        expect(slider).toHaveAttribute('aria-valuemax', '100');
        expect(slider).toHaveAttribute('aria-valuetext', '40%');
      });
    });

    describe('WHEN the fill is inspected', () => {
      it('THEN it covers the same share of the track as the value', () => {
        renderWithTheme(
          <Slider
            accessibilityLabel="Volume"
            value={40}
            onValueChange={() => {}}
            maximumValue={100}
            color="#112233"
            testID="volume"
          />,
        );

        const fill = defined(screen.getByTestId('volume').firstElementChild?.firstElementChild);

        expect(fill).toHaveStyle({ width: '40%', backgroundColor: '#112233' });
      });
    });
  });
});
