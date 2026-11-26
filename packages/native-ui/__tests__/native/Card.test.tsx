import { Text } from 'react-native';
import { Card } from '../../src/components/Card';
import { captureTheme, renderWithTheme, screen, userEvent } from './test-utils';

describe('Card (real React Native renderer)', () => {
  describe('GIVEN a card with onPress', () => {
    describe('WHEN the user presses it', () => {
      it('THEN it is a button with the library hint and onPress is called', async () => {
        const onPress = jest.fn();
        const { cardHint } = (await captureTheme()).labels;
        const user = userEvent.setup();
        await renderWithTheme(
          <Card onPress={onPress}>
            <Text>Monthly report</Text>
          </Card>,
        );
        const card = screen.getByRole('button');

        await user.press(card);

        expect(card).toHaveProp('accessibilityHint', cardHint);
        expect(onPress).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('GIVEN a card without onPress', () => {
    describe('WHEN the accessibility tree is queried', () => {
      it('THEN it is plain content, not a button', async () => {
        await renderWithTheme(
          <Card>
            <Text>Monthly report</Text>
          </Card>,
        );

        expect(screen.queryByRole('button')).toBeNull();
        expect(screen.getByText('Monthly report')).toBeOnTheScreen();
      });
    });
  });
});
