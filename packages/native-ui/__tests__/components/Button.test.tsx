import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '../../src/components/Button';
import { NativeUIProvider } from '../../src/theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(
    <NativeUIProvider config={{ colorMode: 'light' }}>
      {ui}
    </NativeUIProvider>,
  );
}

describe('Button', () => {
  it('should_be_exported_as_a_function_component', () => {
    // GIVEN the Button export from the components module

    // WHEN its runtime type is inspected
    const actualType = typeof Button;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should_render_without_crashing_when_mounted_with_title_and_onPress', () => {
    // GIVEN a Button configured with a "Test" title and a noop onPress

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Button title="Test" onPress={() => {}} />);

    // THEN the title text appears in the document
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should_render_the_title_text_when_title_prop_is_provided', () => {
    // GIVEN a Button configured with the "Submit" title

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Button title="Submit" onPress={() => {}} />);

    // THEN the "Submit" text is present in the document
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('should_render_every_button_variant_without_crashing', () => {
    // GIVEN the full list of Button variants
    const variants = ['primary', 'secondary', 'outline', 'ghost', 'danger'] as const;

    // WHEN each variant is rendered with its name as the title
    const renderAll = () => {
      variants.forEach((variant) => {
        const { unmount } = renderWithTheme(
          <Button title={variant} variant={variant} onPress={() => {}} />,
        );
        expect(screen.getByText(variant)).toBeInTheDocument();
        unmount();
      });
    };

    // THEN every variant renders its title without crashing
    expect(renderAll).not.toThrow();
  });

  it('should_render_every_button_size_without_crashing', () => {
    // GIVEN the full list of Button sizes
    const sizes = ['sm', 'md', 'lg'] as const;

    // WHEN each size is rendered with a matching title
    const renderAll = () => {
      sizes.forEach((size) => {
        const { unmount } = renderWithTheme(
          <Button title={`Size ${size}`} size={size} onPress={() => {}} />,
        );
        expect(screen.getByText(`Size ${size}`)).toBeInTheDocument();
        unmount();
      });
    };

    // THEN every size renders its title without crashing
    expect(renderAll).not.toThrow();
  });

  it('should_hide_title_and_show_progressbar_when_loading_is_true', () => {
    // GIVEN a Button configured with loading enabled

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Button title="Loading" onPress={() => {}} loading />);

    // THEN the title is hidden and a progressbar is shown
    expect(screen.queryByText('Loading')).not.toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should_set_accessibilityRole_to_button_when_rendered', () => {
    // GIVEN a Button configured with a title and noop onPress

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Button title="Test" onPress={() => {}} />);

    // THEN it exposes the button accessibility role
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should_set_aria_label_from_the_title_when_rendered', () => {
    // GIVEN a Button configured with a "Save Changes" title

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Button title="Save Changes" onPress={() => {}} />);

    // THEN the aria-label matches the title text
    expect(screen.getByLabelText('Save Changes')).toBeInTheDocument();
  });

  it('should_mark_button_aria_disabled_when_disabled_prop_is_true', () => {
    // GIVEN a Button configured with disabled={true}

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Button title="Test" onPress={() => {}} disabled />);

    // THEN aria-disabled is set to "true"
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('should_mark_button_aria_disabled_when_loading_prop_is_true', () => {
    // GIVEN a Button configured with loading={true}

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Button title="Test" onPress={() => {}} loading />);

    // THEN aria-disabled is set to "true" on the loading button
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('should_render_fullWidth_variant_without_crashing', () => {
    // GIVEN a Button configured with the fullWidth prop

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Button title="Full" onPress={() => {}} fullWidth />);

    // THEN the title text appears in the document
    expect(screen.getByText('Full')).toBeInTheDocument();
  });

  it('should_render_both_icon_and_title_when_icon_prop_is_provided', () => {
    // GIVEN a Button configured with a span icon and a "With Icon" title
    const icon = <span data-testid="icon">★</span>;

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Button title="With Icon" onPress={() => {}} icon={icon} />);

    // THEN both the icon and the title text are present in the document
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('With Icon')).toBeInTheDocument();
  });
});
