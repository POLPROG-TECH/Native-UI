import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ActionTile } from '../../src/components/ActionTile';
import { NativeUIProvider } from '../../src/theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(<NativeUIProvider config={{ colorMode: 'light' }}>{ui}</NativeUIProvider>);
}

describe('ActionTile', () => {
  it('should be exported as a memoized React component', () => {
    // GIVEN the ActionTile export
    // WHEN its runtime type is inspected
    const componentType = (ActionTile as unknown as { $$typeof: symbol }).$$typeof;

    // THEN it is a React.memo exotic component
    expect(componentType).toBe(Symbol.for('react.memo'));
  });

  it('should render its icon child and label when mounted', () => {
    // GIVEN an ActionTile with an icon child and a label
    renderWithTheme(
      <ActionTile
        icon={<span data-testid="icon-child">+</span>}
        label="Add entry"
        onPress={() => {}}
      />,
    );

    // WHEN the icon and label are queried THEN both are present
    expect(screen.getByTestId('icon-child')).toBeInTheDocument();
    expect(screen.getByText('Add entry')).toBeInTheDocument();
  });

  it('should default the accessibility label to the label prop', () => {
    // GIVEN an ActionTile without an explicit accessibilityLabel
    renderWithTheme(<ActionTile icon={<span>+</span>} label="Budgets" onPress={() => {}} />);

    // WHEN queried by the label THEN it is discoverable
    expect(screen.getByLabelText('Budgets')).toBeInTheDocument();
  });

  it('should prefer an explicit accessibilityLabel over the label', () => {
    // GIVEN an ActionTile with a distinct accessibility label
    renderWithTheme(
      <ActionTile
        icon={<span>+</span>}
        label="Add"
        accessibilityLabel="Add a new entry"
        onPress={() => {}}
      />,
    );

    // WHEN queried by the accessible name THEN the override wins
    expect(screen.getByLabelText('Add a new entry')).toBeInTheDocument();
  });

  it('should invoke onPress exactly once per click despite the internal debounce', () => {
    // GIVEN an ActionTile with a mocked onPress
    jest.useFakeTimers();
    const onPress = jest.fn();
    renderWithTheme(<ActionTile icon={<span>+</span>} label="Click" onPress={onPress} />);

    // WHEN it is clicked three times in quick succession
    const tile = screen.getByLabelText('Click');
    fireEvent.click(tile);
    fireEvent.click(tile);
    fireEvent.click(tile);

    // THEN only the first click is forwarded
    expect(onPress).toHaveBeenCalledTimes(1);

    // AND after the debounce window a second click is accepted
    act(() => {
      jest.advanceTimersByTime(400);
    });
    fireEvent.click(tile);
    expect(onPress).toHaveBeenCalledTimes(2);
    jest.useRealTimers();
  });

  it('should not invoke onPress when disabled and expose aria-disabled', () => {
    // GIVEN a disabled ActionTile
    const onPress = jest.fn();
    renderWithTheme(<ActionTile icon={<span>+</span>} label="Nope" onPress={onPress} disabled />);

    // WHEN it is clicked
    const tile = screen.getByLabelText('Nope');
    fireEvent.click(tile);

    // THEN onPress is never invoked AND aria-disabled is true
    expect(onPress).not.toHaveBeenCalled();
    expect(tile).toHaveAttribute('aria-disabled', 'true');
  });

  it('should render every tone without crashing', () => {
    // GIVEN the full list of ActionTile tones
    const tones = ['primary', 'success', 'warning', 'error', 'neutral'] as const;

    // WHEN each tone is rendered
    const renderAll = () => {
      tones.forEach((tone) => {
        const { unmount } = renderWithTheme(
          <ActionTile
            icon={<span>+</span>}
            label={`tone-${tone}`}
            tone={tone}
            onPress={() => {}}
          />,
        );
        expect(screen.getByLabelText(`tone-${tone}`)).toBeInTheDocument();
        unmount();
      });
    };

    // THEN every tone renders without crashing
    expect(renderAll).not.toThrow();
  });
});
