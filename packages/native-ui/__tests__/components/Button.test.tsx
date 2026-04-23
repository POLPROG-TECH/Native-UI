import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Button } from '../../src/components/Button';
import { NativeUIProvider } from '../../src/theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(<NativeUIProvider config={{ colorMode: 'light' }}>{ui}</NativeUIProvider>);
}

describe('Button', () => {
  it('should be exported as a function component', () => {
    // GIVEN the Button export from the components module

    // WHEN its runtime type is inspected
    const actualType = typeof Button;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should render without crashing when mounted with title and onPress', () => {
    // GIVEN a Button configured with a "Test" title and a noop onPress

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Button title="Test" onPress={() => {}} />);

    // THEN the title text appears in the document
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should render the title text when title prop is provided', () => {
    // GIVEN a Button configured with the "Submit" title

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Button title="Submit" onPress={() => {}} />);

    // THEN the "Submit" text is present in the document
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('should render every button variant without crashing', () => {
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

  it('should render every button size without crashing', () => {
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

  it('should hide title and show progressbar when loading is true', () => {
    // GIVEN a Button configured with loading enabled

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Button title="Loading" onPress={() => {}} loading />);

    // THEN the title is hidden and a progressbar is shown
    expect(screen.queryByText('Loading')).not.toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should set accessibilityRole to button when rendered', () => {
    // GIVEN a Button configured with a title and noop onPress

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Button title="Test" onPress={() => {}} />);

    // THEN it exposes the button accessibility role
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should set aria label from the title when rendered', () => {
    // GIVEN a Button configured with a "Save Changes" title

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Button title="Save Changes" onPress={() => {}} />);

    // THEN the aria-label matches the title text
    expect(screen.getByLabelText('Save Changes')).toBeInTheDocument();
  });

  it('should mark button aria disabled when disabled prop is true', () => {
    // GIVEN a Button configured with disabled={true}

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Button title="Test" onPress={() => {}} disabled />);

    // THEN aria-disabled is set to "true"
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('should mark button aria disabled when loading prop is true', () => {
    // GIVEN a Button configured with loading={true}

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Button title="Test" onPress={() => {}} loading />);

    // THEN aria-disabled is set to "true" on the loading button
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('should render fullWidth variant without crashing', () => {
    // GIVEN a Button configured with the fullWidth prop

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Button title="Full" onPress={() => {}} fullWidth />);

    // THEN the title text appears in the document
    expect(screen.getByText('Full')).toBeInTheDocument();
  });

  it('should render both icon and title when icon prop is provided', () => {
    // GIVEN a Button configured with a span icon and a "With Icon" title
    const icon = <span data-testid="icon">★</span>;

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Button title="With Icon" onPress={() => {}} icon={icon} />);

    // THEN both the icon and the title text are present in the document
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('With Icon')).toBeInTheDocument();
  });

  it('should render the destructive variant without crashing', () => {
    // GIVEN a Button configured with the destructive variant
    // WHEN the component is rendered
    renderWithTheme(<Button title="Delete" variant="destructive" onPress={() => {}} />);

    // THEN the title text appears in the document
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('should render renderLeft and renderRight slots alongside the title', () => {
    // GIVEN a Button with both `renderLeft` and `renderRight` render props
    // WHEN the component is rendered
    renderWithTheme(
      <Button
        title="Go"
        onPress={() => {}}
        renderLeft={() => <span data-testid="left">L</span>}
        renderRight={() => <span data-testid="right">R</span>}
      />,
    );

    // THEN both custom slots and the title are present
    expect(screen.getByTestId('left')).toBeInTheDocument();
    expect(screen.getByTestId('right')).toBeInTheDocument();
    expect(screen.getByText('Go')).toBeInTheDocument();
  });

  it('should apply the glow decoration when `glow` is provided', () => {
    // GIVEN a Button configured with a semantic glow accent
    // WHEN the component is rendered
    const renderGlow = () =>
      renderWithTheme(<Button title="Shiny" onPress={() => {}} glow="primary" />);

    // THEN rendering does not throw
    expect(renderGlow).not.toThrow();
  });

  it('should use an explicit color when `glow` is passed as a hex string', () => {
    // GIVEN a Button with an explicit hex glow color
    // WHEN the component is rendered
    renderWithTheme(<Button title="Glow" onPress={() => {}} glow="#ff00ff" />);

    // THEN the title text still appears and no error occurs
    expect(screen.getByText('Glow')).toBeInTheDocument();
  });

  it('should call onPress when the button is clicked', () => {
    // GIVEN a Button with an onPress spy
    const onPress = jest.fn();

    // WHEN the button is clicked
    renderWithTheme(<Button title="Click" onPress={onPress} />);
    fireEvent.click(screen.getByRole('button'));

    // THEN onPress is fired exactly once
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should guard against a double-click within the re-press window', () => {
    // GIVEN a Button with onPress spy under fake timers
    jest.useFakeTimers();
    try {
      const onPress = jest.fn();
      renderWithTheme(<Button title="Click" onPress={onPress} />);
      const button = screen.getByRole('button');

      // WHEN the button is clicked twice in rapid succession
      fireEvent.click(button);
      fireEvent.click(button);

      // THEN only the first click is forwarded to onPress
      expect(onPress).toHaveBeenCalledTimes(1);

      // AND after the re-press window elapses the next click is accepted
      act(() => {
        jest.advanceTimersByTime(401);
      });
      fireEvent.click(button);
      expect(onPress).toHaveBeenCalledTimes(2);
    } finally {
      jest.useRealTimers();
    }
  });
});
