import { IconButton } from '../../src/components/IconButton';
import { SystemIcon } from '../../src/primitives/SystemIcon';
import { renderWithTheme, screen, userEvent } from './test-utils';

describe('IconButton (real React Native renderer)', () => {
  describe('GIVEN an icon-only button', () => {
    describe('WHEN the accessibility tree is queried', () => {
      it('THEN it is a button named by its label, with the glyph hidden', async () => {
        await renderWithTheme(
          <IconButton
            icon={<SystemIcon name="close" testID="glyph" />}
            accessibilityLabel="Close"
            onPress={() => {}}
          />,
        );

        expect(screen.getByRole('button', { name: 'Close' })).toBeOnTheScreen();
        expect(screen.queryByTestId('glyph')).toBeNull();
      });
    });

    describe('WHEN the user presses it', () => {
      it('THEN onPress is called once', async () => {
        const onPress = jest.fn();
        const user = userEvent.setup();
        await renderWithTheme(
          <IconButton
            icon={<SystemIcon name="close" />}
            accessibilityLabel="Close"
            onPress={onPress}
          />,
        );

        await user.press(screen.getByRole('button', { name: 'Close' }));

        expect(onPress).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('GIVEN a disabled icon button', () => {
    describe('WHEN the user presses it', () => {
      it('THEN the press is blocked and it is announced as disabled', async () => {
        const onPress = jest.fn();
        const user = userEvent.setup();
        await renderWithTheme(
          <IconButton
            icon={<SystemIcon name="close" />}
            accessibilityLabel="Close"
            onPress={onPress}
            disabled
          />,
        );
        const button = screen.getByRole('button', { name: 'Close' });

        await user.press(button);

        expect(onPress).not.toHaveBeenCalled();
        expect(button).toBeDisabled();
      });
    });
  });
});
