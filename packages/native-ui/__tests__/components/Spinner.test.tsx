import React from 'react';
import { render, screen } from '@testing-library/react';
import { Spinner } from '../../src/components/Spinner';
import { NativeUIProvider } from '../../src/theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(
    <NativeUIProvider config={{ colorMode: 'light' }}>{ui}</NativeUIProvider>,
  );
}

describe('Spinner', () => {
  it('should_be_exported_as_a_function_component', () => {
    // GIVEN the Spinner export from the components module

    // WHEN its runtime type is inspected
    const actualType = typeof Spinner;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should_expose_the_default_Loading_accessibility_label_when_no_label_is_provided', () => {
    // GIVEN a Spinner with no explicit label

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Spinner />);

    // THEN the default "Loading" accessibility label is present
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });

  it('should_render_the_supplied_label_when_provided', () => {
    // GIVEN a Spinner with a custom label

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Spinner label="Fetching..." />);

    // THEN the label text is present and also used as the a11y label
    expect(screen.getByText('Fetching...')).toBeInTheDocument();
    expect(screen.getByLabelText('Fetching...')).toBeInTheDocument();
  });

  it('should_render_both_supported_sizes_without_crashing', () => {
    // GIVEN both supported spinner sizes
    const sizes = ['small', 'large'] as const;

    // WHEN each size is rendered with a matching label
    const renderAll = () => {
      sizes.forEach((size) => {
        const { unmount } = renderWithTheme(
          <Spinner label={`size-${size}`} size={size} />,
        );
        expect(screen.getByLabelText(`size-${size}`)).toBeInTheDocument();
        unmount();
      });
    };

    // THEN every size renders without crashing
    expect(renderAll).not.toThrow();
  });
});
