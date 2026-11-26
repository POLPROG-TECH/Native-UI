import { HeaderBar } from '../../src/components/HeaderBar';
import { captureTheme, renderWithTheme, screen, userEvent } from './test-utils';

describe('HeaderBar (real React Native renderer)', () => {
  describe('GIVEN a header with a title and a back handler', () => {
    describe('WHEN the accessibility tree is queried', () => {
      it('THEN the title is a header and the back button carries the library label', async () => {
        const { goBack } = (await captureTheme()).labels;
        await renderWithTheme(<HeaderBar title="Settings" onBack={() => {}} />);

        expect(screen.getByRole('header', { name: 'Settings' })).toBeOnTheScreen();
        expect(screen.getByRole('button', { name: goBack })).toBeOnTheScreen();
      });
    });

    describe('WHEN the user presses the back button', () => {
      it('THEN onBack is called once', async () => {
        const onBack = jest.fn();
        const { goBack } = (await captureTheme()).labels;
        const user = userEvent.setup();
        await renderWithTheme(<HeaderBar title="Settings" onBack={onBack} />);

        await user.press(screen.getByRole('button', { name: goBack }));

        expect(onBack).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('GIVEN a header without a back handler', () => {
    describe('WHEN the accessibility tree is queried', () => {
      it('THEN there is no back button', async () => {
        await renderWithTheme(<HeaderBar title="Settings" />);

        expect(screen.queryByRole('button')).toBeNull();
      });
    });
  });
});
