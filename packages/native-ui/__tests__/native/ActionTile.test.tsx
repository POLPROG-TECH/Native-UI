import { ActionTile } from '../../src/components/ActionTile';
import { renderWithTheme, screen, userEvent } from './test-utils';

describe('ActionTile (real React Native renderer)', () => {
  describe('GIVEN an action tile', () => {
    describe('WHEN the user presses it', () => {
      it('THEN it is a button named by its label and onPress is called', async () => {
        const onPress = jest.fn();
        const user = userEvent.setup();
        await renderWithTheme(
          <ActionTile icon={() => null} label="Scan receipt" onPress={onPress} />,
        );

        await user.press(screen.getByRole('button', { name: 'Scan receipt' }));

        expect(onPress).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('GIVEN a disabled action tile', () => {
    describe('WHEN the user presses it', () => {
      it('THEN the press is blocked and it is announced as disabled', async () => {
        const onPress = jest.fn();
        const user = userEvent.setup();
        await renderWithTheme(
          <ActionTile icon={() => null} label="Scan receipt" onPress={onPress} disabled />,
        );
        const tile = screen.getByRole('button', { name: 'Scan receipt' });

        await user.press(tile);

        expect(onPress).not.toHaveBeenCalled();
        expect(tile).toBeDisabled();
      });
    });
  });
});
