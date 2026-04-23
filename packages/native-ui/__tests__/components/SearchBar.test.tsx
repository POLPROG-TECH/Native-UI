import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Text } from 'react-native';
import { SearchBar } from '../../src/components/SearchBar';
import { NativeUIProvider } from '../../src/theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(<NativeUIProvider config={{ colorMode: 'light' }}>{ui}</NativeUIProvider>);
}

describe('SearchBar', () => {
  it('should be exported as a function component', () => {
    // GIVEN the SearchBar export from the components module

    // WHEN its runtime type is inspected
    const actualType = typeof SearchBar;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should render the initial value in the text input when mounted', () => {
    // GIVEN a SearchBar with an initial value of "hello"

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<SearchBar value="hello" onChangeText={() => {}} placeholder="Search" />);

    // THEN the text input reflects the initial value
    expect(screen.getByLabelText('Search')).toHaveValue('hello');
  });

  it('should debounce onChangeText until the delay elapses', () => {
    // GIVEN a SearchBar with a mocked onChangeText and a 300 ms debounce
    jest.useFakeTimers();
    const onChangeText = jest.fn();
    renderWithTheme(<SearchBar value="" onChangeText={onChangeText} placeholder="Search" />);

    // WHEN the user types three characters in quick succession
    const input = screen.getByLabelText('Search');
    fireEvent.change(input, { target: { value: 'a' } });
    fireEvent.change(input, { target: { value: 'ab' } });
    fireEvent.change(input, { target: { value: 'abc' } });

    // THEN no call fires before the debounce window elapses
    expect(onChangeText).not.toHaveBeenCalled();

    // AND only the final value is emitted after the debounce window
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(onChangeText).toHaveBeenCalledTimes(1);
    expect(onChangeText).toHaveBeenCalledWith('abc');
    jest.useRealTimers();
  });

  it('should render a clear button when the input has a value and clear it when pressed', () => {
    // GIVEN a SearchBar pre-populated with "abc"
    jest.useFakeTimers();
    const onChangeText = jest.fn();
    renderWithTheme(<SearchBar value="abc" onChangeText={onChangeText} placeholder="Search" />);

    // WHEN the clear button is clicked
    fireEvent.click(screen.getByLabelText('Clear search'));

    // THEN onChangeText is invoked with an empty string
    expect(onChangeText).toHaveBeenCalledWith('');
    jest.useRealTimers();
  });

  it('should render renderLeft content in the leading slot when provided', () => {
    // GIVEN a SearchBar with a renderLeft render prop

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(
      <SearchBar
        value=""
        onChangeText={() => {}}
        placeholder="S"
        renderLeft={() => <Text>LEFT</Text>}
      />,
    );

    // THEN the leading slot content is present
    expect(screen.getByText('LEFT')).toBeInTheDocument();
  });

  it('should render renderRight content in the trailing slot when provided', () => {
    // GIVEN a SearchBar with a renderRight render prop

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(
      <SearchBar
        value=""
        onChangeText={() => {}}
        placeholder="S"
        renderRight={() => <Text>RIGHT</Text>}
      />,
    );

    // THEN the trailing slot content is present
    expect(screen.getByText('RIGHT')).toBeInTheDocument();
  });

  it('should sync from prop after debounce fires when parent resets value', () => {
    // GIVEN a SearchBar where the user typed "abc" and the parent later resets
    jest.useFakeTimers();
    const onChangeText = jest.fn();
    const { rerender } = renderWithTheme(
      <SearchBar value="" onChangeText={onChangeText} placeholder="Search" />,
    );

    // WHEN the user types
    const input = screen.getByLabelText('Search');
    fireEvent.change(input, { target: { value: 'abc' } });

    // AND the parent mirrors the typed value into its controlled `value` prop
    rerender(
      <NativeUIProvider config={{ colorMode: 'light' }}>
        <SearchBar value="abc" onChangeText={onChangeText} placeholder="Search" />
      </NativeUIProvider>,
    );

    // AND the debounce timer elapses
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(onChangeText).toHaveBeenCalledWith('abc');

    // AND the parent then resets `value` back to ''
    rerender(
      <NativeUIProvider config={{ colorMode: 'light' }}>
        <SearchBar value="" onChangeText={onChangeText} placeholder="Search" />
      </NativeUIProvider>,
    );

    // THEN the input reflects the parent-driven reset (prop-sync is not blocked)
    expect(screen.getByLabelText('Search')).toHaveValue('');
    jest.useRealTimers();
  });
});
