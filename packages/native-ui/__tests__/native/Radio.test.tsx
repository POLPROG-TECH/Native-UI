import { Pressable } from 'react-native';
import { Radio } from '../../src/components/Radio';
import { renderWithTheme, screen, userEvent } from './test-utils';

describe('Radio (real React Native renderer)', () => {
  /*
   * A passive Radio is not an accessibility element of its own: the row that
   * hosts it owns the role, state and name, so it must not add a focus stop.
   */
  describe('GIVEN a passive Radio with only the selected prop inside a selectable row', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the indicator is drawn and the row is the only radio announced', () => {
        renderWithTheme(
          <Pressable
            accessibilityRole="radio"
            accessibilityState={{ selected: true }}
            accessibilityLabel="Express shipping"
          >
            <Radio selected testID="express" />
          </Pressable>,
        );

        expect(screen.getByTestId('express-indicator')).toBeVisible();
        expect(screen.getAllByRole('radio')).toHaveLength(1);
      });
    });
  });

  describe('GIVEN a Radio with a "Option A" label', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the label is on screen and names an unselected radio', () => {
        renderWithTheme(<Radio selected={false} label="Option A" onPress={() => {}} />);

        expect(screen.getByText('Option A')).toBeOnTheScreen();
        expect(screen.getByRole('radio', { name: 'Option A' })).not.toBeSelected();
      });
    });
  });

  describe('GIVEN a disabled Radio with a mocked onPress', () => {
    describe('WHEN the user presses the row', () => {
      it('THEN it is announced as disabled and onPress is never invoked', async () => {
        const onPress = jest.fn();
        const user = userEvent.setup();
        renderWithTheme(<Radio selected={false} label="A" onPress={onPress} disabled />);
        const radio = screen.getByRole('radio', { name: 'A' });

        await user.press(radio);

        expect(radio).toBeDisabled();
        expect(onPress).not.toHaveBeenCalled();
      });
    });
  });

  describe('GIVEN a Radio with an explicit accessibility label', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN assistive technology names the row by the custom label', () => {
        renderWithTheme(
          <Radio selected label="Visible" accessibilityLabel="Custom label" onPress={() => {}} />,
        );

        expect(screen.getByRole('radio', { name: 'Custom label' })).toBeSelected();
      });
    });
  });
});
