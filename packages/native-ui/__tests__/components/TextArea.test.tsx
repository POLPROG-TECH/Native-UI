import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TextArea } from '../../src/components/TextArea';
import { NativeUIProvider } from '../../src/theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(
    <NativeUIProvider config={{ colorMode: 'light' }}>{ui}</NativeUIProvider>,
  );
}

describe('TextArea', () => {
  it('should_be_exported_as_a_function_component', () => {
    // GIVEN the TextArea export from the components module

    // WHEN its runtime type is inspected
    const actualType = typeof TextArea;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should_render_the_label_when_a_label_prop_is_provided', () => {
    // GIVEN a TextArea with a "Bio" label

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<TextArea label="Bio" />);

    // THEN the label text is present in the document
    expect(screen.getByText('Bio')).toBeInTheDocument();
  });

  it('should_render_a_required_asterisk_when_required_is_true', () => {
    // GIVEN a TextArea with a label and required={true}

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<TextArea label="Bio" required />);

    // THEN the asterisk glyph is present beside the label
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should_render_the_error_message_with_alert_role_when_provided', () => {
    // GIVEN a TextArea with an error message

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<TextArea label="Bio" error="Too short" />);

    // THEN the error appears with role="alert"
    expect(screen.getByRole('alert')).toHaveTextContent('Too short');
  });

  it('should_forward_onChangeText_updates_from_the_underlying_textarea', () => {
    // GIVEN a TextArea with a mocked onChangeText
    const onChangeText = jest.fn();
    renderWithTheme(<TextArea label="Bio" onChangeText={onChangeText} />);

    // WHEN the user types into the field
    fireEvent.change(screen.getByLabelText('Bio'), { target: { value: 'hi' } });

    // THEN onChangeText is called with the new value
    expect(onChangeText).toHaveBeenCalledWith('hi');
  });

  it('should_invoke_onFocus_and_onBlur_handlers_when_the_field_is_focused_and_blurred', () => {
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
