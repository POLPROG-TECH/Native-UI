import { Chip } from '../../src/components/Chip';
import { renderWithTheme, screen, userEvent } from './test-utils';

describe('Chip (real React Native renderer)', () => {
  describe('GIVEN a selected chip', () => {
    describe('WHEN the accessibility tree is queried', () => {
      it('THEN it is a button reported as selected', async () => {
        await renderWithTheme(<Chip label="Groceries" selected onPress={() => {}} />);

        expect(screen.getByRole('button', { name: 'Groceries' })).toBeSelected();
      });
    });

    describe('WHEN the user presses it', () => {
      it('THEN onPress is called once', async () => {
        const onPress = jest.fn();
        const user = userEvent.setup();
        await renderWithTheme(<Chip label="Groceries" selected onPress={onPress} />);

        await user.press(screen.getByRole('button', { name: 'Groceries' }));

        expect(onPress).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('GIVEN a disabled chip', () => {
    describe('WHEN the user presses it', () => {
      it('THEN the press is blocked and it is announced as disabled', async () => {
        const onPress = jest.fn();
        const user = userEvent.setup();
        await renderWithTheme(<Chip label="Travel" disabled onPress={onPress} />);
        const chip = screen.getByRole('button', { name: 'Travel' });

        await user.press(chip);

        expect(onPress).not.toHaveBeenCalled();
        expect(chip).toBeDisabled();
      });
    });
  });
});
