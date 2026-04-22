import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Radio } from '../../src/components/Radio';
import { NativeUIProvider } from '../../src/theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(
    <NativeUIProvider config={{ colorMode: 'light' }}>{ui}</NativeUIProvider>,
  );
}

describe('Radio', () => {
  it('should_be_exported_as_a_function_component', () => {
    // GIVEN the Radio export from the components module

    // WHEN its runtime type is inspected
    const actualType = typeof Radio;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should_render_only_the_indicator_when_no_onPress_and_no_label_are_provided', () => {
    // GIVEN a Radio with only the selected prop

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Radio selected />);

    // THEN the indicator exposes the radio role
    expect(screen.getByRole('radio')).toBeInTheDocument();
  });

  it('should_render_the_label_when_a_label_is_provided', () => {
    // GIVEN a Radio with a "Option A" label

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Radio selected={false} label="Option A" onPress={() => {}} />);

    // THEN the label text is present
    expect(screen.getByText('Option A')).toBeInTheDocument();
  });

  it('should_invoke_onPress_when_the_row_is_clicked', () => {
    // GIVEN a Radio with a mocked onPress
    const onPress = jest.fn();
    renderWithTheme(<Radio selected={false} label="A" onPress={onPress} />);

    // WHEN the row is clicked
    fireEvent.click(screen.getByLabelText('A'));

    // THEN onPress is invoked exactly once
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should_not_invoke_onPress_when_disabled', () => {
    // GIVEN a disabled Radio with a mocked onPress
    const onPress = jest.fn();
    renderWithTheme(<Radio selected={false} label="A" onPress={onPress} disabled />);

    // WHEN the row is clicked
    fireEvent.click(screen.getByLabelText('A'));

    // THEN onPress is never invoked
    expect(onPress).not.toHaveBeenCalled();
  });

  it('should_use_the_custom_accessibilityLabel_when_provided', () => {
    // GIVEN a Radio with an explicit accessibility label

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(
      <Radio selected label="Visible" accessibilityLabel="Custom label" onPress={() => {}} />,
    );

    // THEN the row is queryable via the custom label
    expect(screen.getByLabelText('Custom label')).toBeInTheDocument();
  });
});
