import type { ComponentProps } from 'react';
import { Slider } from '../../src/components/Slider';
import { ADJUST_ACTIONS } from '../../src/components/slider/useSliderAdjust';
import { fireEvent, renderWithTheme, screen } from './test-utils';

async function renderVolume(props: Partial<ComponentProps<typeof Slider>> = {}) {
  const onValueChange = jest.fn();
  await renderWithTheme(
    <Slider
      accessibilityLabel="Volume"
      value={40}
      onValueChange={onValueChange}
      maximumValue={100}
      step={10}
      formatValue={(value) => `${value}%`}
      {...props}
    />,
  );

  return { onValueChange, slider: screen.getByRole('adjustable', { name: 'Volume' }) };
}

describe('Slider (real React Native renderer)', () => {
  describe('GIVEN a slider at 40 of 100', () => {
    describe('WHEN the accessibility tree is queried', () => {
      it('THEN it is an adjustable with its range, value and spoken text', async () => {
        const { slider } = await renderVolume();

        expect(slider).toHaveAccessibilityValue({ min: 0, max: 100, now: 40, text: '40%' });
      });
    });

    describe('WHEN a screen reader sends the increment action', () => {
      it('THEN the value goes one step up', async () => {
        const { slider, onValueChange } = await renderVolume();

        await fireEvent(slider, 'accessibilityAction', {
          nativeEvent: { actionName: ADJUST_ACTIONS.increment },
        });

        expect(onValueChange).toHaveBeenCalledWith(50);
      });
    });
  });

  describe('GIVEN a disabled slider', () => {
    describe('WHEN the accessibility tree is queried', () => {
      it('THEN it is announced as disabled and offers no adjust actions', async () => {
        const { slider } = await renderVolume({ disabled: true });

        expect(slider).toBeDisabled();
        expect(slider.props.accessibilityActions).toBeUndefined();
      });
    });
  });
});
