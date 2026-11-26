import { ListItem } from '../../src/components/ListItem';
import { renderWithTheme, screen, userEvent } from './test-utils';

describe('ListItem (real React Native renderer)', () => {
  describe('GIVEN a pressable row', () => {
    describe('WHEN the user presses it', () => {
      it('THEN it is a button named by its title and onPress is called', async () => {
        const onPress = jest.fn();
        const user = userEvent.setup();
        await renderWithTheme(
          <ListItem title="Profile" subtitle="Name and photo" onPress={onPress} />,
        );

        await user.press(screen.getByRole('button', { name: 'Profile' }));

        expect(onPress).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('GIVEN a row without onPress', () => {
    describe('WHEN the accessibility tree is queried', () => {
      it('THEN it is plain content, not a button', async () => {
        await renderWithTheme(<ListItem title="Version" value="2.0.0" />);

        expect(screen.queryByRole('button')).toBeNull();
        expect(screen.getByText('Version')).toBeOnTheScreen();
        expect(screen.getByText('2.0.0')).toBeOnTheScreen();
      });
    });
  });

  describe('GIVEN a disabled pressable row', () => {
    describe('WHEN the user presses it', () => {
      it('THEN the press is blocked', async () => {
        const onPress = jest.fn();
        const user = userEvent.setup();
        await renderWithTheme(<ListItem title="Profile" onPress={onPress} disabled />);

        await user.press(screen.getByText('Profile'));

        expect(onPress).not.toHaveBeenCalled();
      });
    });
  });
});
