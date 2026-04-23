import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ListSwitchItem } from '../../src/components/ListSwitchItem';
import { NativeUIProvider } from '../../src/theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(<NativeUIProvider config={{ colorMode: 'light' }}>{ui}</NativeUIProvider>);
}

describe('ListSwitchItem', () => {
  it('should be exported as a function component', () => {
    // GIVEN the ListSwitchItem export from the components module

    // WHEN its runtime type is inspected
    const actualType = typeof ListSwitchItem;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should render the label and subtitle when both are provided', () => {
    // GIVEN a ListSwitchItem with a label and a subtitle

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(
      <ListSwitchItem
        label="Dark Mode"
        subtitle="Use the dark theme"
        value={false}
        onValueChange={() => {}}
      />,
    );

    // THEN both label and subtitle are present
    expect(screen.getByText('Dark Mode')).toBeInTheDocument();
    expect(screen.getByText('Use the dark theme')).toBeInTheDocument();
  });

  it('should invoke onValueChange with the opposite value when the switch is toggled', () => {
    // GIVEN a ListSwitchItem with value={false} and a mocked onValueChange
    const onValueChange = jest.fn();
    renderWithTheme(
      <ListSwitchItem label="Dark Mode" value={false} onValueChange={onValueChange} />,
    );

    // WHEN the underlying switch is clicked
    fireEvent.click(screen.getByRole('switch'));

    // THEN onValueChange is invoked once with true
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it('should reflect the value prop on the underlying switch', () => {
    // GIVEN a ListSwitchItem rendered with value={true}

    // WHEN the switch element is inspected
    renderWithTheme(<ListSwitchItem label="On" value onValueChange={() => {}} />);

    // THEN the switch is checked
    expect(screen.getByRole('switch')).toBeChecked();
  });
});
