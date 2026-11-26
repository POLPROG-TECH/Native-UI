import { Input } from '../../src/components/Input';
import { renderWithTheme, screen, userEvent } from './test-utils';

describe('Input (real React Native renderer)', () => {
  describe('GIVEN a labelled input with an error', () => {
    describe('WHEN the accessibility tree is queried', () => {
      it('THEN the field is named by its label together with the error', async () => {
        await renderWithTheme(<Input label="Email" error="Enter a valid address" />);

        expect(screen.getByLabelText('Email, Enter a valid address')).toBeOnTheScreen();
      });
    });
  });

  describe('GIVEN an editable input', () => {
    describe('WHEN the user types into it', () => {
      it('THEN onChangeText receives the text', async () => {
        const onChangeText = jest.fn();
        const user = userEvent.setup();
        await renderWithTheme(<Input label="Name" onChangeText={onChangeText} />);

        await user.type(screen.getByLabelText('Name'), 'Ada');

        expect(onChangeText).toHaveBeenLastCalledWith('Ada');
      });
    });
  });

  describe('GIVEN a read-only input', () => {
    describe('WHEN the user tries to type into it', () => {
      it('THEN it is announced as disabled and nothing is entered', async () => {
        const onChangeText = jest.fn();
        const user = userEvent.setup();
        await renderWithTheme(<Input label="Name" editable={false} onChangeText={onChangeText} />);
        const field = screen.getByLabelText('Name');

        await user.type(field, 'Ada');

        expect(field).toBeDisabled();
        expect(onChangeText).not.toHaveBeenCalled();
      });
    });
  });
});
