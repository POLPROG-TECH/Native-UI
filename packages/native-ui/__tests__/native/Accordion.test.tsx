import { Text } from 'react-native';
import { Accordion } from '../../src/components/Accordion';
import { renderWithTheme, screen, userEvent } from './test-utils';

const CONTENT = 'Orders placed before noon ship the same day.';

describe('Accordion (real React Native renderer)', () => {
  describe('GIVEN a collapsed item', () => {
    describe('WHEN the user presses the header', () => {
      it('THEN the header goes from collapsed to expanded and the content appears', async () => {
        const user = userEvent.setup();
        await renderWithTheme(
          <Accordion title="Shipping" subtitle="2 to 4 business days">
            <Text>{CONTENT}</Text>
          </Accordion>,
        );
        const header = screen.getByRole('button', { name: 'Shipping' });

        expect(header).toBeCollapsed();

        await user.press(header);

        expect(header).toBeExpanded();
        expect(screen.getByText(CONTENT)).toBeOnTheScreen();
      });
    });
  });

  describe('GIVEN a disabled item', () => {
    describe('WHEN the user presses the header', () => {
      it('THEN it is announced as disabled and stays collapsed', async () => {
        const user = userEvent.setup();
        await renderWithTheme(
          <Accordion title="Shipping" disabled>
            <Text>{CONTENT}</Text>
          </Accordion>,
        );
        const header = screen.getByRole('button', { name: 'Shipping' });

        await user.press(header);

        expect(header).toBeDisabled();
        expect(screen.queryByText(CONTENT)).not.toBeOnTheScreen();
      });
    });
  });
});
