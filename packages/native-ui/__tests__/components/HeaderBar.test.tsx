import React from 'react';
import { Text } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react';
import { HeaderBar } from '../../src/components/HeaderBar';
import { NativeUIProvider } from '../../src/theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(
    <NativeUIProvider config={{ colorMode: 'light' }}>
      {ui}
    </NativeUIProvider>,
  );
}

describe('HeaderBar', () => {
  it('should_be_exported_as_a_function_component', () => {
    // GIVEN the HeaderBar export from the components module

    // WHEN its runtime type is inspected
    const actualType = typeof HeaderBar;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should_render_the_title_when_a_title_prop_is_provided', () => {
    // GIVEN a HeaderBar configured with a "Settings" title

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<HeaderBar title="Settings" />);

    // THEN the title text appears in the document
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should_render_a_back_button_and_invoke_onBack_when_the_back_button_is_clicked', () => {
    // GIVEN a HeaderBar with a mocked onBack callback
    const onBack = jest.fn();
    renderWithTheme(<HeaderBar title="Profile" onBack={onBack} />);
    const back = screen.getByLabelText('Go back');

    // WHEN the back button is clicked
    fireEvent.click(back);

    // THEN the back button was rendered and the callback was invoked once
    expect(back).toBeInTheDocument();
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('should_not_render_a_back_button_when_onBack_is_not_provided', () => {
    // GIVEN a HeaderBar without an onBack prop

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<HeaderBar title="Home" />);

    // THEN no back button is present in the document
    expect(screen.queryByLabelText('Go back')).not.toBeInTheDocument();
  });

  it('should_use_a_custom_back_accessibility_label_when_backAccessibilityLabel_is_provided', () => {
    // GIVEN a HeaderBar configured with a custom back accessibility label

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(
      <HeaderBar title="X" onBack={() => {}} backAccessibilityLabel="Wstecz" />,
    );

    // THEN the back button uses the custom label
    expect(screen.getByLabelText('Wstecz')).toBeInTheDocument();
  });

  it('should_render_the_right_slot_content_when_the_right_prop_is_provided', () => {
    // GIVEN a HeaderBar with a right slot element

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(
      <HeaderBar title="X" right={<Text>RIGHT</Text>} />,
    );

    // THEN the right slot content appears in the document
    expect(screen.getByText('RIGHT')).toBeInTheDocument();
  });

  it('should_render_without_crashing_when_no_title_is_provided', () => {
    // GIVEN a HeaderBar without a title prop

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(<HeaderBar onBack={() => {}} />);

    // THEN the component renders DOM output without crashing
    expect(container).toBeTruthy();
  });
});
