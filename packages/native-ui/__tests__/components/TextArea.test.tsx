import { screen, fireEvent } from '@testing-library/react';
import { TextArea } from '../../src/components/TextArea';
import { renderWithTheme } from '../test-utils';

describe('TextArea', () => {
  describe('GIVEN the TextArea export from the components module', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a React.forwardRef exotic component', () => {
        expect(TextArea).toHaveProperty('$$typeof', Symbol.for('react.forward_ref'));
      });
    });
  });

  describe('GIVEN a TextArea with a "Bio" label', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the label text is present in the document', () => {
        renderWithTheme(<TextArea label="Bio" />);

        expect(screen.getByText('Bio')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a TextArea with a label and required={true}', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the asterisk glyph is present beside the label', () => {
        renderWithTheme(<TextArea label="Bio" required />);

        expect(screen.getByText('*')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a TextArea with an error message', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the error appears with role="alert"', () => {
        renderWithTheme(<TextArea label="Bio" error="Too short" />);

        expect(screen.getByRole('alert')).toHaveTextContent('Too short');
      });
    });
  });

  describe('GIVEN a TextArea with a mocked onChangeText', () => {
    describe('WHEN the user types into the field', () => {
      it('THEN onChangeText is called with the new value', () => {
        const onChangeText = jest.fn();
        renderWithTheme(<TextArea label="Bio" onChangeText={onChangeText} />);

        fireEvent.change(screen.getByLabelText('Bio'), { target: { value: 'hi' } });

        expect(onChangeText).toHaveBeenCalledWith('hi');
      });
    });
  });

  describe('GIVEN a TextArea with mocked focus and blur handlers', () => {
    describe('WHEN the field receives and then loses focus', () => {
      it('THEN both handlers are invoked exactly once', () => {
        const onFocus = jest.fn();
        const onBlur = jest.fn();
        renderWithTheme(<TextArea label="Bio" onFocus={onFocus} onBlur={onBlur} />);
        const input = screen.getByLabelText('Bio');

        fireEvent.focus(input);
        fireEvent.blur(input);

        expect(onFocus).toHaveBeenCalledTimes(1);
        expect(onBlur).toHaveBeenCalledTimes(1);
      });
    });
  });
});
