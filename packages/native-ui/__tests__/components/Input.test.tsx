import { screen, fireEvent } from '@testing-library/react';
import { Input } from '../../src/components/Input';
import { renderWithTheme } from '../test-utils';

describe('Input', () => {
  describe('GIVEN the Input export from the components module', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a React.forwardRef exotic component', () => {
        expect(Input).toHaveProperty('$$typeof', Symbol.for('react.forward_ref'));
      });
    });
  });

  describe('GIVEN an Input with a "Email" label', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the label text is present in the document', () => {
        renderWithTheme(<Input label="Email" />);

        expect(screen.getByText('Email')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN an Input with a label and required={true}', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN an asterisk appears beside the label', () => {
        renderWithTheme(<Input label="Email" required />);

        expect(screen.getByText('*')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN an Input whose error prop is "Invalid email"', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the error text is exposed as an alert role', () => {
        renderWithTheme(<Input label="Email" error="Invalid email" />);

        const alert = screen.getByRole('alert');
        expect(alert).toHaveTextContent('Invalid email');
      });
    });
  });

  describe('GIVEN an Input with a mocked onChangeText', () => {
    describe('WHEN the user types into the field', () => {
      it('THEN onChangeText is called with the new value', () => {
        const onChangeText = jest.fn();
        renderWithTheme(<Input label="Name" onChangeText={onChangeText} />);

        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'abc' } });

        expect(onChangeText).toHaveBeenCalledWith('abc');
      });
    });
  });

  describe('GIVEN an Input with mocked focus and blur handlers', () => {
    describe('WHEN the field receives and then loses focus', () => {
      it('THEN both handlers are invoked exactly once', () => {
        const onFocus = jest.fn();
        const onBlur = jest.fn();
        renderWithTheme(<Input label="Name" onFocus={onFocus} onBlur={onBlur} />);
        const input = screen.getByLabelText('Name');

        fireEvent.focus(input);
        fireEvent.blur(input);

        expect(onFocus).toHaveBeenCalledTimes(1);
        expect(onBlur).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('GIVEN a non-editable Input', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the underlying element is marked disabled', () => {
        renderWithTheme(<Input label="Locked" editable={false} />);

        expect(screen.getByLabelText('Locked')).toBeDisabled();
      });
    });
  });
});
