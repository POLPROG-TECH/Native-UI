import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Switch } from '../../src/components/Switch';
import { NativeUIProvider } from '../../src/theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(
    <NativeUIProvider config={{ colorMode: 'light' }}>{ui}</NativeUIProvider>,
  );
}

describe('Switch', () => {
  it('should_be_exported_as_a_function_component', () => {
    // GIVEN the Switch export from the components module

    // WHEN its runtime type is inspected
    const actualType = typeof Switch;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should_render_the_label_when_provided', () => {
    // GIVEN a Switch with a "Notifications" label

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Switch value={false} onValueChange={() => {}} label="Notifications" />);

    // THEN the label text is present
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  it('should_render_the_subtitle_when_provided', () => {
    // GIVEN a Switch with a subtitle

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(
      <Switch
        value
        onValueChange={() => {}}
        label="Sounds"
        subtitle="Play a chirp on tap"
      />,
    );

    // THEN the subtitle text is present
    expect(screen.getByText('Play a chirp on tap')).toBeInTheDocument();
  });

  it('should_invoke_onValueChange_with_the_opposite_value_when_the_toggle_is_clicked', () => {
    // GIVEN a Switch with value={false} and a mocked onValueChange
    const onValueChange = jest.fn();
    renderWithTheme(<Switch value={false} onValueChange={onValueChange} label="S" />);

    // WHEN the switch element is clicked
    fireEvent.click(screen.getByRole('switch'));

    // THEN onValueChange is invoked with true
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it('should_not_invoke_onValueChange_when_the_switch_is_disabled', () => {
    // GIVEN a disabled Switch with a mocked onValueChange
    const onValueChange = jest.fn();
    renderWithTheme(
      <Switch value={false} onValueChange={onValueChange} label="S" disabled />,
    );

    // WHEN the switch element is clicked
    fireEvent.click(screen.getByRole('switch'));

    // THEN onValueChange is never invoked
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('should_render_without_label_or_subtitle_when_neither_is_provided', () => {
    // GIVEN a Switch with no label nor subtitle

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Switch value onValueChange={() => {}} />);

    // THEN the switch element is still present
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });
});
