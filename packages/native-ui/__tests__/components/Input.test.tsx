import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../../src/components/Input';
import { NativeUIProvider } from '../../src/theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(<NativeUIProvider config={{ colorMode: 'light' }}>{ui}</NativeUIProvider>);
}

describe('Input', () => {
  it('should be exported as a function component', () => {
    // GIVEN the Input export from the components module

    // WHEN its runtime type is inspected
    const actualType = typeof Input;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should render the label when a label prop is provided', () => {
    // GIVEN an Input with a "Email" label

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Input label="Email" />);

    // THEN the label text is present in the document
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('should render a required asterisk next to the label when required', () => {
    // GIVEN an Input with a label and required={true}

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Input label="Email" required />);

    // THEN an asterisk appears beside the label
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should render the error message with alert role when an error prop is provided', () => {
    // GIVEN an Input whose error prop is "Invalid email"

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Input label="Email" error="Invalid email" />);

    // THEN the error text is exposed as an alert role
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Invalid email');
  });

  it('should forward onChangeText updates from the underlying input', () => {
    // GIVEN an Input with a mocked onChangeText
    const onChangeText = jest.fn();
    renderWithTheme(<Input label="Name" onChangeText={onChangeText} />);

    // WHEN the user types into the field
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'abc' } });

    // THEN onChangeText is called with the new value
    expect(onChangeText).toHaveBeenCalledWith('abc');
  });

  it('should invoke onFocus and onBlur handlers when the field is focused and blurred', () => {
    // GIVEN an Input with mocked focus and blur handlers
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    renderWithTheme(<Input label="Name" onFocus={onFocus} onBlur={onBlur} />);
    const input = screen.getByLabelText('Name');

    // WHEN the field receives and then loses focus
    fireEvent.focus(input);
    fireEvent.blur(input);

    // THEN both handlers are invoked exactly once
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('should set aria disabled when editable is false', () => {
    // GIVEN a non-editable Input

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Input label="Locked" editable={false} />);

    // THEN the underlying element is marked disabled
    expect(screen.getByLabelText('Locked')).toBeDisabled();
  });
});
