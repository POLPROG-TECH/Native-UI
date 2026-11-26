import { SettingsRow } from '../../src/components/SettingsRow';
import { renderWithTheme, screen, userEvent } from './test-utils';

describe('SettingsRow (real React Native renderer)', () => {
  describe('GIVEN a row with onPress', () => {
    describe('WHEN the user presses it', () => {
      it('THEN it is a button and onPress is called', async () => {
        const onPress = jest.fn();
        const user = userEvent.setup();
        await renderWithTheme(<SettingsRow label="Language" value="Polski" onPress={onPress} />);

        await user.press(screen.getByRole('button'));

        expect(screen.getByText('Language')).toBeOnTheScreen();
        expect(screen.getByText('Polski')).toBeOnTheScreen();
        expect(onPress).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('GIVEN a disabled row', () => {
    describe('WHEN the user presses it', () => {
      it('THEN the press is blocked', async () => {
        const onPress = jest.fn();
        const user = userEvent.setup();
        await renderWithTheme(<SettingsRow label="Language" onPress={onPress} disabled />);

        await user.press(screen.getByText('Language'));

        expect(onPress).not.toHaveBeenCalled();
      });
    });
  });
});
