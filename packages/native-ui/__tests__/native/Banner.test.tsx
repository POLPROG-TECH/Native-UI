import { Banner } from '../../src/components/Banner';
import { captureTheme, renderWithTheme, screen, userEvent } from './test-utils';

describe('Banner (real React Native renderer)', () => {
  describe('GIVEN a banner with a title, an action and a close button', () => {
    describe('WHEN the accessibility tree is queried', () => {
      it('THEN the text is one alert and both buttons stay reachable on their own', async () => {
        const { dismiss } = (await captureTheme()).labels;
        await renderWithTheme(
          <Banner
            variant="error"
            title="Payment failed"
            message="Card declined."
            action={{ label: 'Retry', onPress: () => {} }}
            onDismiss={() => {}}
          />,
        );

        expect(
          screen.getByRole('alert', { name: 'Payment failed. Card declined.' }),
        ).toBeOnTheScreen();
        expect(screen.getByRole('button', { name: 'Retry' })).toBeOnTheScreen();
        expect(screen.getByRole('button', { name: dismiss })).toBeOnTheScreen();
      });
    });

    describe('WHEN the close button is pressed', () => {
      it('THEN onDismiss is called once', async () => {
        const onDismiss = jest.fn();
        const { dismiss } = (await captureTheme()).labels;
        const user = userEvent.setup();
        await renderWithTheme(<Banner message="Saved." onDismiss={onDismiss} />);

        await user.press(screen.getByRole('button', { name: dismiss }));

        expect(onDismiss).toHaveBeenCalledTimes(1);
      });
    });
  });
});
