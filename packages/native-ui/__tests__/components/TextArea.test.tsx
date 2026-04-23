import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TextArea } from '../../src/components/TextArea';
import { NativeUIProvider } from '../../src/theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(<NativeUIProvider config={{ colorMode: 'light' }}>{ui}</NativeUIProvider>);
}

describe('TextArea', () => {
  it('should be exported as a function component', () => {
    // GIVEN the TextArea export from the components module

    // WHEN its runtime type is inspected
    const actualType = typeof TextArea;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should render the label when a label prop is provided', () => {
    // GIVEN a TextArea with a "Bio" label

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<TextArea label="Bio" />);

    // THEN the label text is present in the document
    expect(screen.getByText('Bio')).toBeInTheDocument();
  });

  it('should render a required asterisk when required is true', () => {
    // GIVEN a TextArea with a label and required={true}

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<TextArea label="Bio" required />);

    // THEN the asterisk glyph is present beside the label
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should render the error message with alert role when provided', () => {
    // GIVEN a TextArea with an error message

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<TextArea label="Bio" error="Too short" />);

    // THEN the error appears with role="alert"
    expect(screen.getByRole('alert')).toHaveTextContent('Too short');
  });

  it('should forward onChangeText updates from the underlying textarea', () => {
    // GIVEN a TextArea with a mocked onChangeText
    const onChangeText = jest.fn();
    renderWithTheme(<TextArea label="Bio" onChangeText={onChangeText} />);

    // WHEN the user types into the field
    fireEvent.change(screen.getByLabelText('Bio'), { target: { value: 'hi' } });

    // THEN onChangeText is called with the new value
    expect(onChangeText).toHaveBeenCalledWith('hi');
  });

  it('should invoke onFocus and onBlur handlers when the field is focused and blurred', () => {
    // GIVEN a TextArea with mocked focus and blur handlers
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    renderWithTheme(<TextArea label="Bio" onFocus={onFocus} onBlur={onBlur} />);
    const input = screen.getByLabelText('Bio');

    // WHEN the field receives and then loses focus
    fireEvent.focus(input);
    fireEvent.blur(input);

    // THEN both handlers are invoked exactly once
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});
