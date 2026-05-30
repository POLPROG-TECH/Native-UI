import React from 'react';
import type { TextInput } from 'react-native';
import { render } from '@testing-library/react';
import { Input } from '../../src/components/Input';
import { TextArea } from '../../src/components/TextArea';
import { NativeUIProvider } from '../../src/theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(<NativeUIProvider config={{ colorMode: 'light' }}>{ui}</NativeUIProvider>);
}

describe('text field ref forwarding', () => {
  it('should forward a ref to the underlying TextInput for Input', () => {
    // GIVEN a ref passed to an Input
    const ref = React.createRef<TextInput>();

    // WHEN the Input is rendered inside a theme provider
    renderWithTheme(<Input ref={ref} label="Email" />);

    // THEN the ref resolves to the underlying focusable TextInput
    expect(ref.current).not.toBeNull();
    expect(typeof ref.current?.focus).toBe('function');
  });

  it('should forward a ref to the underlying TextInput for TextArea', () => {
    // GIVEN a ref passed to a TextArea
    const ref = React.createRef<TextInput>();

    // WHEN the TextArea is rendered inside a theme provider
    renderWithTheme(<TextArea ref={ref} label="Bio" />);

    // THEN the ref resolves to the underlying focusable TextInput
    expect(ref.current).not.toBeNull();
    expect(typeof ref.current?.focus).toBe('function');
  });

  it('should append the error message to the accessible label', () => {
    // GIVEN an Input with a label and an error message

    // WHEN the Input is rendered inside a theme provider
    const { getByLabelText } = renderWithTheme(<Input label="Email" error="Required" />);

    // THEN the accessible label combines the label and error text
    expect(getByLabelText('Email, Required')).toBeInTheDocument();
  });
});
