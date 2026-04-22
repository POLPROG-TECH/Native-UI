import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { IconButton } from '../../src/components/IconButton';
import { NativeUIProvider } from '../../src/theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(
    <NativeUIProvider config={{ colorMode: 'light' }}>{ui}</NativeUIProvider>,
  );
}

describe('IconButton', () => {
  it('should_be_exported_as_a_function_component', () => {
    // GIVEN the IconButton export from the components module

    // WHEN its runtime type is inspected
    const actualType = typeof IconButton;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should_render_its_icon_child_when_mounted', () => {
    // GIVEN an IconButton with a span icon child
    renderWithTheme(
      <IconButton
        icon={<span data-testid="icon-child">★</span>}
        accessibilityLabel="Star"
        onPress={() => {}}
      />,
    );

    // WHEN the icon is queried THEN it is present in the document
    expect(screen.getByTestId('icon-child')).toBeInTheDocument();
  });

  it('should_set_the_button_accessibility_label_from_the_prop', () => {
    // GIVEN an IconButton with a custom accessibility label
    renderWithTheme(
      <IconButton icon={<span>★</span>} accessibilityLabel="Favourite" onPress={() => {}} />,
    );

    // WHEN the element is queried by its label THEN it is discoverable
    expect(screen.getByLabelText('Favourite')).toBeInTheDocument();
  });

  it('should_invoke_onPress_exactly_once_per_click_despite_the_internal_debounce', () => {
    // GIVEN an IconButton with a mocked onPress
    jest.useFakeTimers();
    const onPress = jest.fn();
    renderWithTheme(
      <IconButton icon={<span>★</span>} accessibilityLabel="Click" onPress={onPress} />,
    );

    // WHEN the button is clicked three times in quick succession
    const btn = screen.getByLabelText('Click');
    fireEvent.click(btn);
    fireEvent.click(btn);
    fireEvent.click(btn);

    // THEN only the first click is forwarded to onPress
    expect(onPress).toHaveBeenCalledTimes(1);

    // AND after the debounce window elapses a second click is accepted again
    act(() => {
      jest.advanceTimersByTime(400);
    });
    fireEvent.click(btn);
    expect(onPress).toHaveBeenCalledTimes(2);
    jest.useRealTimers();
  });

  it('should_not_invoke_onPress_when_disabled', () => {
    // GIVEN a disabled IconButton with a mocked onPress
    const onPress = jest.fn();
    renderWithTheme(
      <IconButton
        icon={<span>★</span>}
        accessibilityLabel="Nope"
        onPress={onPress}
        disabled
      />,
    );

    // WHEN the button is clicked
    fireEvent.click(screen.getByLabelText('Nope'));

    // THEN onPress is never invoked
    expect(onPress).not.toHaveBeenCalled();
  });

  it('should_expose_aria_disabled_true_when_disabled', () => {
    // GIVEN a disabled IconButton
    renderWithTheme(
      <IconButton
        icon={<span>★</span>}
        accessibilityLabel="Nope"
        onPress={() => {}}
        disabled
      />,
    );

    // WHEN the button element is inspected THEN aria-disabled is "true"
    expect(screen.getByLabelText('Nope')).toHaveAttribute('aria-disabled', 'true');
  });

  it('should_render_every_variant_without_crashing', () => {
    // GIVEN the full list of IconButton variants
    const variants = ['default', 'primary', 'ghost', 'danger'] as const;

    // WHEN each variant is rendered with a matching accessibility label
    const renderAll = () => {
      variants.forEach((variant) => {
        const { unmount } = renderWithTheme(
          <IconButton
            icon={<span>★</span>}
            accessibilityLabel={`variant-${variant}`}
            onPress={() => {}}
            variant={variant}
          />,
        );
        expect(screen.getByLabelText(`variant-${variant}`)).toBeInTheDocument();
        unmount();
      });
    };

    // THEN every variant renders without crashing
    expect(renderAll).not.toThrow();
  });

  it('should_render_every_size_without_crashing', () => {
    // GIVEN the full list of IconButton sizes
    const sizes = ['sm', 'md', 'lg'] as const;

    // WHEN each size is rendered with a matching accessibility label
    const renderAll = () => {
      sizes.forEach((size) => {
        const { unmount } = renderWithTheme(
          <IconButton
            icon={<span>★</span>}
            accessibilityLabel={`size-${size}`}
            onPress={() => {}}
            size={size}
          />,
        );
        expect(screen.getByLabelText(`size-${size}`)).toBeInTheDocument();
        unmount();
      });
    };

    // THEN every size renders without crashing
    expect(renderAll).not.toThrow();
  });
});
