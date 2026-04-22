import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Text } from 'react-native';
import { SearchBar } from '../../src/components/SearchBar';
import { NativeUIProvider } from '../../src/theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(
    <NativeUIProvider config={{ colorMode: 'light' }}>{ui}</NativeUIProvider>,
  );
}

describe('SearchBar', () => {
  it('should_be_exported_as_a_function_component', () => {
    // GIVEN the SearchBar export from the components module

    // WHEN its runtime type is inspected
    const actualType = typeof SearchBar;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should_render_the_initial_value_in_the_text_input_when_mounted', () => {
    // GIVEN a SearchBar with an initial value of "hello"

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<SearchBar value="hello" onChangeText={() => {}} placeholder="Search" />);

    // THEN the text input reflects the initial value
    expect(screen.getByLabelText('Search')).toHaveValue('hello');
  });

  it('should_debounce_onChangeText_until_the_delay_elapses', () => {
    // GIVEN a SearchBar with a mocked onChangeText and a 300 ms debounce
    jest.useFakeTimers();
    const onChangeText = jest.fn();
    renderWithTheme(
      <SearchBar value="" onChangeText={onChangeText} placeholder="Search" />,
    );

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

  it('should_render_a_clear_button_when_the_input_has_a_value_and_clear_it_when_pressed', () => {
    // GIVEN a SearchBar pre-populated with "abc"
    jest.useFakeTimers();
    const onChangeText = jest.fn();
    renderWithTheme(
      <SearchBar value="abc" onChangeText={onChangeText} placeholder="Search" />,
    );

    // WHEN the clear button is clicked
    fireEvent.click(screen.getByLabelText('Clear search'));

    // THEN onChangeText is invoked with an empty string
    expect(onChangeText).toHaveBeenCalledWith('');
    jest.useRealTimers();
  });

  it('should_render_renderLeft_content_in_the_leading_slot_when_provided', () => {
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

  it('should_render_renderRight_content_in_the_trailing_slot_when_provided', () => {
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
});
