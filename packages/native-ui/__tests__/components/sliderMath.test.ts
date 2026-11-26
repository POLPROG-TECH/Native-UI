import {
  SLIDER_DIRECTION,
  fractionOf,
  nudgeValue,
  sliderAccessibilityValue,
  snapToStep,
  valueAtFraction,
  type SliderRange,
} from '../../src/components/slider/sliderMath';

const PERCENT: SliderRange = { min: 0, max: 100, step: 5 };
const UNIT: SliderRange = { min: 0, max: 1, step: 0 };
const TENTHS: SliderRange = { min: 0, max: 1, step: 0.1 };
const CONTINUOUS_STEP_RATIO = 0.1;

describe('sliderMath', () => {
  describe('GIVEN a range with a step of 5', () => {
    describe('WHEN a value between two steps is snapped', () => {
      it('THEN it lands on the nearest step', () => {
        expect(snapToStep(42, PERCENT)).toBe(40);
        expect(snapToStep(43, PERCENT)).toBe(45);
      });
    });

    describe('WHEN a value outside the range is snapped', () => {
      it('THEN it is clamped to the nearest bound', () => {
        expect(snapToStep(-20, PERCENT)).toBe(0);
        expect(snapToStep(140, PERCENT)).toBe(100);
      });
    });

    describe('WHEN the value is nudged up at the maximum', () => {
      it('THEN it stays at the maximum', () => {
        expect(nudgeValue(100, SLIDER_DIRECTION.up, PERCENT, CONTINUOUS_STEP_RATIO)).toBe(100);
      });
    });

    describe('WHEN the value is nudged down', () => {
      it('THEN it moves by one step', () => {
        expect(nudgeValue(50, SLIDER_DIRECTION.down, PERCENT, CONTINUOUS_STEP_RATIO)).toBe(45);
      });
    });
  });

  describe('GIVEN a decimal step', () => {
    describe('WHEN values are snapped', () => {
      it('THEN the result carries no floating point noise', () => {
        expect(snapToStep(0.30000000000000004, TENTHS)).toBe(0.3);
        expect(valueAtFraction(0.7, TENTHS)).toBe(0.7);
      });
    });
  });

  describe('GIVEN a continuous range', () => {
    describe('WHEN a value is snapped', () => {
      it('THEN it is only clamped', () => {
        expect(snapToStep(0.4321, UNIT)).toBe(0.4321);
      });
    });

    describe('WHEN the value is nudged up', () => {
      it('THEN it moves by the configured share of the range', () => {
        expect(nudgeValue(0.5, SLIDER_DIRECTION.up, UNIT, CONTINUOUS_STEP_RATIO)).toBeCloseTo(0.6);
      });
    });

    describe('WHEN the accessibility value is built', () => {
      it('THEN only the text is sent, because Android reads the numbers as integers', () => {
        const value = sliderAccessibilityValue(0.5, UNIT, (v) => `${v * 100}%`);

        expect(value).toEqual({ text: '50%' });
      });
    });
  });

  describe('GIVEN a whole-number range', () => {
    describe('WHEN the accessibility value is built', () => {
      it('THEN min, max and now are sent with the text', () => {
        const value = sliderAccessibilityValue(40, PERCENT, String);

        expect(value).toEqual({ min: 0, max: 100, now: 40, text: '40' });
      });
    });

    describe('WHEN a position is converted to a fraction and back', () => {
      it('THEN the value round-trips', () => {
        expect(fractionOf(25, PERCENT)).toBe(0.25);
        expect(valueAtFraction(0.25, PERCENT)).toBe(25);
      });
    });
  });

  describe('GIVEN an empty range', () => {
    describe('WHEN the fraction is computed', () => {
      it('THEN it is 0 instead of a division by zero', () => {
        expect(fractionOf(5, { min: 5, max: 5, step: 0 })).toBe(0);
      });
    });
  });
});
