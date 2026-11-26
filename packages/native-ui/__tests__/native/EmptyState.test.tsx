import { Button } from '../../src/components/Button';
import { EmptyState } from '../../src/components/EmptyState';
import { renderWithTheme, screen, userEvent } from './test-utils';

describe('EmptyState (real React Native renderer)', () => {
  describe('GIVEN an empty state with a message and an action', () => {
    describe('WHEN the user presses the action', () => {
      it('THEN the title is a header, the message is shown and the action runs', async () => {
        const onPress = jest.fn();
        const user = userEvent.setup();
        await renderWithTheme(
          <EmptyState
            title="No invoices yet"
            message="Create the first one to see it here."
            action={<Button title="New invoice" onPress={onPress} />}
          />,
        );

        await user.press(screen.getByRole('button', { name: 'New invoice' }));

        expect(screen.getByRole('header', { name: 'No invoices yet' })).toBeOnTheScreen();
        expect(screen.getByText('Create the first one to see it here.')).toBeOnTheScreen();
        expect(onPress).toHaveBeenCalledTimes(1);
      });
    });
  });
});
