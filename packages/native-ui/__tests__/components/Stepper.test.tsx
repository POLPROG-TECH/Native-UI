import { fireEvent, screen } from '@testing-library/react';
import { Stepper } from '../../src/components/Stepper';
import { configureHaptics } from '../../src/utils/haptics';
import { captureTheme, createHapticsMock, renderWithTheme } from '../test-utils';

/*
 * Stepping, bounds, formatting and labels. The disabled state of the buttons
 * as a screen reader sees it is proven in `__tests__/native/Stepper.test.tsx`.
 */
describe('Stepper', () => {
  describe('GIVEN a stepper at 2 with bounds 1 to 3', () => {
    describe('WHEN the increase button is pressed', () => {
      it('THEN onChange receives 3 and the light haptic fires', () => {
        const haptics = createHapticsMock();
        configureHaptics(haptics);
        const onChange = jest.fn();
        const { increase } = captureTheme().labels;
        renderWithTheme(
          <Stepper accessibilityLabel="Guests" value={2} onChange={onChange} min={1} max={3} />,
        );

        fireEvent.click(screen.getByRole('button', { name: increase }));

        expect(onChange).toHaveBeenCalledWith(3);
        expect(haptics.light).toHaveBeenCalledTimes(1);
      });
    });

    describe('WHEN the decrease button is pressed', () => {
      it('THEN onChange receives 1', () => {
        const onChange = jest.fn();
        const { decrease } = captureTheme().labels;
        renderWithTheme(
          <Stepper accessibilityLabel="Guests" value={2} onChange={onChange} min={1} max={3} />,
        );

        fireEvent.click(screen.getByRole('button', { name: decrease }));

        expect(onChange).toHaveBeenCalledWith(1);
      });
    });
  });

  describe('GIVEN a stepper at its maximum', () => {
    describe('WHEN the increase button is pressed', () => {
      it('THEN the button is disabled and nothing is reported', () => {
        const onChange = jest.fn();
        const { increase } = captureTheme().labels;
        renderWithTheme(
          <Stepper accessibilityLabel="Guests" value={3} onChange={onChange} min={1} max={3} />,
        );
        const button = screen.getByRole('button', { name: increase });

        fireEvent.click(button);

        expect(button).toHaveAttribute('aria-disabled', 'true');
        expect(onChange).not.toHaveBeenCalled();
      });
    });
  });

  describe('GIVEN a stepper at the default minimum of 0', () => {
    describe('WHEN the decrease button is pressed', () => {
      it('THEN nothing is reported', () => {
        const onChange = jest.fn();
        const { decrease } = captureTheme().labels;
        renderWithTheme(<Stepper accessibilityLabel="Items" value={0} onChange={onChange} />);

        fireEvent.click(screen.getByRole('button', { name: decrease }));

        expect(onChange).not.toHaveBeenCalled();
      });
    });
  });

  describe('GIVEN a decimal step', () => {
    describe('WHEN the value is increased from 0.2 by 0.1', () => {
      it('THEN the result is exactly 0.3', () => {
        const onChange = jest.fn();
        const { increase } = captureTheme().labels;
        renderWithTheme(
          <Stepper accessibilityLabel="Rate" value={0.2} onChange={onChange} step={0.1} max={1} />,
        );

        fireEvent.click(screen.getByRole('button', { name: increase }));

        expect(onChange).toHaveBeenCalledWith(0.3);
      });
    });
  });

  describe('GIVEN a value formatter', () => {
    describe('WHEN the stepper is rendered', () => {
      it('THEN the formatted value is shown and announced with the name', () => {
        renderWithTheme(
          <Stepper
            accessibilityLabel="Weight"
            value={5}
            onChange={() => {}}
            formatValue={(value) => `${value} kg`}
          />,
        );

        expect(screen.getByText('5 kg')).toBeInTheDocument();
        expect(screen.getByLabelText('Weight: 5 kg')).toHaveAttribute('aria-live', 'polite');
      });
    });
  });

  describe('GIVEN a disabled stepper', () => {
    describe('WHEN either button is pressed', () => {
      it('THEN nothing is reported', () => {
        const onChange = jest.fn();
        const { increase, decrease } = captureTheme().labels;
        renderWithTheme(
          <Stepper accessibilityLabel="Guests" value={2} onChange={onChange} disabled />,
        );

        fireEvent.click(screen.getByRole('button', { name: increase }));
        fireEvent.click(screen.getByRole('button', { name: decrease }));

        expect(onChange).not.toHaveBeenCalled();
      });
    });
  });

  describe('GIVEN translated and per-instance button labels', () => {
    describe('WHEN the stepper is rendered', () => {
      it('THEN the instance label wins and the other comes from the config', () => {
        renderWithTheme(
          <Stepper
            accessibilityLabel="Goście"
            value={2}
            onChange={() => {}}
            increaseAccessibilityLabel="Dodaj gościa"
            haptic={false}
          />,
          { config: { colorMode: 'light', labels: { decrease: 'Zmniejsz' } } },
        );

        expect(screen.getByRole('button', { name: 'Dodaj gościa' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Zmniejsz' })).toBeInTheDocument();
      });
    });
  });
});
