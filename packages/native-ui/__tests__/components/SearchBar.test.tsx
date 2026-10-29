import { screen, fireEvent, act } from '@testing-library/react';
import { Text } from 'react-native';
import { SearchBar } from '../../src/components/SearchBar';
import { NativeUIProvider } from '../../src/theme';
import { renderWithTheme } from '../test-utils';

describe('SearchBar', () => {
  describe('GIVEN the SearchBar export from the components module', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a function component', () => {
        const actualType = typeof SearchBar;

        expect(actualType).toBe('function');
      });
    });
  });

  describe('GIVEN a SearchBar with an initial value of "hello"', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the text input reflects the initial value', () => {
        renderWithTheme(<SearchBar value="hello" onChangeText={() => {}} placeholder="Search" />);

        expect(screen.getByLabelText('Search')).toHaveValue('hello');
      });
    });
  });

  describe('GIVEN a SearchBar with a mocked onChangeText and a 300 ms debounce', () => {
    describe('WHEN the user types three characters in quick succession', () => {
      it('THEN no call fires before the debounce window elapses', () => {
        jest.useFakeTimers();
        const onChangeText = jest.fn();
        renderWithTheme(<SearchBar value="" onChangeText={onChangeText} placeholder="Search" />);

        const input = screen.getByLabelText('Search');
        fireEvent.change(input, { target: { value: 'a' } });
        fireEvent.change(input, { target: { value: 'ab' } });
        fireEvent.change(input, { target: { value: 'abc' } });

        expect(onChangeText).not.toHaveBeenCalled();

        /* AND only the final value is emitted after the debounce window */
        act(() => {
          jest.advanceTimersByTime(300);
        });
        expect(onChangeText).toHaveBeenCalledTimes(1);
        expect(onChangeText).toHaveBeenCalledWith('abc');
        jest.useRealTimers();
      });
    });
  });

  describe('GIVEN a SearchBar pre-populated with "abc"', () => {
    describe('WHEN the clear button is clicked', () => {
      it('THEN onChangeText is invoked with an empty string', () => {
        jest.useFakeTimers();
        const onChangeText = jest.fn();
        renderWithTheme(<SearchBar value="abc" onChangeText={onChangeText} placeholder="Search" />);

        fireEvent.click(screen.getByLabelText('Clear search'));

        expect(onChangeText).toHaveBeenCalledWith('');
        jest.useRealTimers();
      });
    });
  });

  describe('GIVEN a SearchBar with a renderLeft render prop', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the leading slot content is present', () => {
        renderWithTheme(
          <SearchBar
            value=""
            onChangeText={() => {}}
            placeholder="S"
            renderLeft={() => <Text>LEFT</Text>}
          />,
        );

        expect(screen.getByText('LEFT')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a SearchBar with a renderRight render prop', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the trailing slot content is present', () => {
        renderWithTheme(
          <SearchBar
            value=""
            onChangeText={() => {}}
            placeholder="S"
            renderRight={() => <Text>RIGHT</Text>}
          />,
        );

        expect(screen.getByText('RIGHT')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a SearchBar where the user typed "abc" and the parent later resets', () => {
    describe('WHEN the user types', () => {
      it('THEN the input reflects the parent-driven reset (prop-sync is not blocked)', () => {
        jest.useFakeTimers();
        const onChangeText = jest.fn();
        const { rerender } = renderWithTheme(
          <SearchBar value="" onChangeText={onChangeText} placeholder="Search" />,
        );

        const input = screen.getByLabelText('Search');
        fireEvent.change(input, { target: { value: 'abc' } });

        /* AND the parent mirrors the typed value into its controlled `value` prop */
        rerender(
          <NativeUIProvider config={{ colorMode: 'light' }}>
            <SearchBar value="abc" onChangeText={onChangeText} placeholder="Search" />
          </NativeUIProvider>,
        );

        /* AND the debounce timer elapses */
        act(() => {
          jest.advanceTimersByTime(300);
        });
        expect(onChangeText).toHaveBeenCalledWith('abc');

        /* AND the parent then resets `value` back to '' */
        rerender(
          <NativeUIProvider config={{ colorMode: 'light' }}>
            <SearchBar value="" onChangeText={onChangeText} placeholder="Search" />
          </NativeUIProvider>,
        );

        expect(screen.getByLabelText('Search')).toHaveValue('');
        jest.useRealTimers();
      });
    });
  });
});
