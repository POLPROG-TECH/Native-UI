import { TextArea } from '../../src/components/TextArea';
import { renderWithTheme, screen, userEvent } from './test-utils';

describe('TextArea (real React Native renderer)', () => {
  describe('GIVEN a labelled text area', () => {
    describe('WHEN the user types into it', () => {
      it('THEN the field is named by its label and reports the text', async () => {
        const onChangeText = jest.fn();
        const user = userEvent.setup();
        await renderWithTheme(<TextArea label="Notes" onChangeText={onChangeText} />);

        await user.type(screen.getByLabelText('Notes'), 'Call back');

        expect(onChangeText).toHaveBeenLastCalledWith('Call back');
      });
    });
  });

  describe('GIVEN a text area with an error', () => {
    describe('WHEN the accessibility tree is queried', () => {
      it('THEN the error is part of the accessible name and visible', async () => {
        await renderWithTheme(<TextArea label="Notes" error="Too long" />);

        expect(screen.getByLabelText('Notes, Too long')).toBeOnTheScreen();
        expect(screen.getByText('Too long')).toBeOnTheScreen();
      });
    });
  });
});
