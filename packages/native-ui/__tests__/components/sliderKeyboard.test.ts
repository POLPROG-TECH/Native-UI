import { renderHook } from '@testing-library/react';
import { I18nManager, Platform } from 'react-native';
import { valueForKey, type SliderKeyContext } from '../../src/components/slider/sliderKeys';
import {
  useSliderKeyboard,
  type SliderKeyEvent,
} from '../../src/components/slider/useSliderKeyboard';
import { accessibilityValueProps } from '../../src/utils/accessibilityValueProps';
import { defined } from '../test-utils';

const PERCENT = { min: 0, max: 100, step: 10 };
const AT_FORTY: SliderKeyContext = {
  value: 40,
  range: PERCENT,
  continuousStepRatio: 0.1,
  isRTL: false,
};

function keyEvent(key: string): SliderKeyEvent & { preventDefault: jest.Mock } {
  return { nativeEvent: { key }, preventDefault: jest.fn() };
}

function setupKeyboard(value: number, disabled = false) {
  const onValueChange = jest.fn();
  const onSlidingComplete = jest.fn();
  const { result } = renderHook(() =>
    useSliderKeyboard(
      { value, range: PERCENT, continuousStepRatio: 0.1, onValueChange, onSlidingComplete },
      disabled,
    ),
  );

  return { handlers: result.current, onValueChange, onSlidingComplete };
}

describe('slider keys', () => {
  describe('GIVEN a slider at 40 of 100 in a left-to-right layout', () => {
    describe('WHEN each supported key is pressed', () => {
      it('THEN arrows move one step, Home and End jump to the bounds', () => {
        expect(valueForKey('ArrowRight', AT_FORTY)).toBe(50);
        expect(valueForKey('ArrowUp', AT_FORTY)).toBe(50);
        expect(valueForKey('ArrowLeft', AT_FORTY)).toBe(30);
        expect(valueForKey('ArrowDown', AT_FORTY)).toBe(30);
        expect(valueForKey('Home', AT_FORTY)).toBe(0);
        expect(valueForKey('End', AT_FORTY)).toBe(100);
      });
    });

    describe('WHEN an unrelated key is pressed', () => {
      it('THEN the slider ignores it', () => {
        expect(valueForKey('Enter', AT_FORTY)).toBeNull();
      });
    });
  });

  describe('GIVEN a right-to-left layout', () => {
    describe('WHEN the horizontal arrows are pressed', () => {
      it('THEN they are mirrored while Up still increases', () => {
        const mirrored = { ...AT_FORTY, isRTL: true };

        expect(valueForKey('ArrowLeft', mirrored)).toBe(50);
        expect(valueForKey('ArrowRight', mirrored)).toBe(30);
        expect(valueForKey('ArrowUp', mirrored)).toBe(50);
      });
    });
  });
});

describe('useSliderKeyboard', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    I18nManager.isRTL = false;
  });

  describe('GIVEN a native platform', () => {
    describe('WHEN the keyboard props are built', () => {
      it('THEN no key handler is attached', () => {
        expect(setupKeyboard(40).handlers).toEqual({});
      });
    });
  });

  describe('GIVEN a focused slider on web', () => {
    beforeEach(() => {
      jest.replaceProperty(Platform, 'OS', 'web');
    });

    describe('WHEN the right arrow is pressed', () => {
      it('THEN the value moves one step, the change completes and the page does not scroll', () => {
        const { handlers, onValueChange, onSlidingComplete } = setupKeyboard(40);
        const event = keyEvent('ArrowRight');

        defined(handlers.onKeyDown)(event);

        expect(onValueChange).toHaveBeenCalledWith(50);
        expect(onSlidingComplete).toHaveBeenCalledWith(50);
        expect(event.preventDefault).toHaveBeenCalledTimes(1);
      });
    });

    describe('WHEN the right arrow is pressed at the maximum', () => {
      it('THEN nothing is reported but the key is still consumed', () => {
        const { handlers, onValueChange } = setupKeyboard(100);
        const event = keyEvent('ArrowRight');

        defined(handlers.onKeyDown)(event);

        expect(onValueChange).not.toHaveBeenCalled();
        expect(event.preventDefault).toHaveBeenCalledTimes(1);
      });
    });

    describe('WHEN a key the slider does not use is pressed', () => {
      it('THEN the browser keeps its default behavior', () => {
        const { handlers, onValueChange } = setupKeyboard(40);
        const event = keyEvent('Tab');

        defined(handlers.onKeyDown)(event);

        expect(onValueChange).not.toHaveBeenCalled();
        expect(event.preventDefault).not.toHaveBeenCalled();
      });
    });

    describe('WHEN the slider is disabled', () => {
      it('THEN no key handler is attached', () => {
        expect(setupKeyboard(40, true).handlers).toEqual({});
      });
    });
  });
});

describe('accessibilityValueProps', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GIVEN a native platform', () => {
    describe('WHEN value props are built', () => {
      it('THEN only accessibilityValue is returned', () => {
        expect(accessibilityValueProps({ text: '50%' })).toEqual({
          accessibilityValue: { text: '50%' },
        });
      });
    });
  });

  describe('GIVEN React Native Web', () => {
    describe('WHEN a text-only native value has exact numbers for the browser', () => {
      it('THEN the ARIA attributes carry the numbers', () => {
        jest.replaceProperty(Platform, 'OS', 'web');

        const props = accessibilityValueProps(
          { text: '50%' },
          { min: 0, max: 1, now: 0.5, text: '50%' },
        );

        expect(props).toEqual({
          accessibilityValue: { text: '50%' },
          'aria-valuemin': 0,
          'aria-valuemax': 1,
          'aria-valuenow': 0.5,
          'aria-valuetext': '50%',
        });
      });
    });
  });
});
