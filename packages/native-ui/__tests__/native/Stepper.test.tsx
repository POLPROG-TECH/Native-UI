import { Stepper } from '../../src/components/Stepper';
import { captureTheme, renderWithTheme, screen, userEvent } from './test-utils';

describe('Stepper (real React Native renderer)', () => {
  describe('GIVEN a stepper at its minimum', () => {
    describe('WHEN the accessibility tree is queried', () => {
      it('THEN decrease is disabled, increase is enabled and the value is named', async () => {
        const { increase, decrease } = (await captureTheme()).labels;
        await renderWithTheme(
          <Stepper accessibilityLabel="Guests" value={1} onChange={() => {}} min={1} max={8} />,
        );

        expect(screen.getByRole('button', { name: decrease })).toBeDisabled();
        expect(screen.getByRole('button', { name: increase })).toBeEnabled();
        expect(screen.getByLabelText('Guests: 1')).toBeOnTheScreen();
      });
    });

    describe('WHEN the user presses increase', () => {
      it('THEN onChange receives the next value', async () => {
        const onChange = jest.fn();
        const { increase } = (await captureTheme()).labels;
        const user = userEvent.setup();
        await renderWithTheme(
          <Stepper accessibilityLabel="Guests" value={1} onChange={onChange} min={1} max={8} />,
        );

        await user.press(screen.getByRole('button', { name: increase }));

        expect(onChange).toHaveBeenCalledWith(2);
      });
    });

    describe('WHEN the user presses the disabled decrease button', () => {
      it('THEN nothing is reported', async () => {
        const onChange = jest.fn();
        const { decrease } = (await captureTheme()).labels;
        const user = userEvent.setup();
        await renderWithTheme(
          <Stepper accessibilityLabel="Guests" value={1} onChange={onChange} min={1} max={8} />,
        );

        await user.press(screen.getByRole('button', { name: decrease }));

        expect(onChange).not.toHaveBeenCalled();
      });
    });
  });
});
