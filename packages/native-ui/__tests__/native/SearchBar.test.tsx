import { useState } from 'react';
import { SearchBar } from '../../src/components/SearchBar';
import { captureTheme, renderWithTheme, screen, userEvent } from './test-utils';

function ControlledSearch({ onChangeText }: { onChangeText: (text: string) => void }) {
  const [query, setQuery] = useState('milk');

  return (
    <SearchBar
      value={query}
      placeholder="Search products"
      debounceMs={0}
      onChangeText={(text) => {
        setQuery(text);
        onChangeText(text);
      }}
    />
  );
}

describe('SearchBar (real React Native renderer)', () => {
  describe('GIVEN a search bar that holds a query', () => {
    describe('WHEN the accessibility tree is queried', () => {
      it('THEN the field is named by its placeholder and has a named clear button', async () => {
        const { clearSearch } = (await captureTheme()).labels;
        await renderWithTheme(<ControlledSearch onChangeText={() => {}} />);

        expect(screen.getByLabelText('Search products')).toHaveDisplayValue('milk');
        expect(screen.getByRole('button', { name: clearSearch })).toBeOnTheScreen();
      });
    });

    describe('WHEN the user presses the clear button', () => {
      it('THEN the query is emptied and reported', async () => {
        const onChangeText = jest.fn();
        const { clearSearch } = (await captureTheme()).labels;
        const user = userEvent.setup();
        await renderWithTheme(<ControlledSearch onChangeText={onChangeText} />);

        await user.press(screen.getByRole('button', { name: clearSearch }));

        expect(onChangeText).toHaveBeenLastCalledWith('');
        expect(screen.getByLabelText('Search products')).toHaveDisplayValue('');
      });
    });
  });
});
