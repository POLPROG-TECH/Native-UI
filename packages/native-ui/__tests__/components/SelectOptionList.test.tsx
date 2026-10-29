import { StyleSheet, useWindowDimensions } from 'react-native';
import { SelectOptionList } from '../../src/components/select/SelectOptionList';
import { captureTheme, fireEvent, renderHook, renderWithTheme, screen } from '../test-utils';

type Currency = 'usd' | 'eur' | 'pln';

const OPTIONS: { value: Currency; label: string }[] = [
  { value: 'usd', label: 'USD' },
  { value: 'eur', label: 'EUR' },
  { value: 'pln', label: 'PLN' },
];

/** Children of the list that are not options: the hairlines between rows. */
function separatorsIn(list: HTMLElement): Element[] {
  return Array.from(list.children).filter((child) => child.getAttribute('role') !== 'radio');
}

describe('SelectOptionList', () => {
  describe('GIVEN three options with EUR selected', () => {
    describe('WHEN the list is rendered', () => {
      it('THEN it is a radiogroup capped to its share of the window height', () => {
        const tokens = captureTheme().components.select;
        const windowHeight = renderHook(() => useWindowDimensions()).result.current.height;

        renderWithTheme(
          <SelectOptionList<Currency> options={OPTIONS} selectedValue="eur" onSelect={jest.fn()} />,
        );

        expect(screen.getByRole('radiogroup')).toHaveStyle({
          maxHeight: `${windowHeight * tokens.listMaxHeightRatio}px`,
        });
        expect(screen.getAllByRole('radio')).toHaveLength(OPTIONS.length);
      });
    });

    describe('WHEN the rows are laid out', () => {
      it('THEN a divider-colored hairline, inset to the row padding, sits between each pair', () => {
        const theme = captureTheme();
        const inset = `${theme.components.select.optionPaddingHorizontal}px`;

        renderWithTheme(
          <SelectOptionList<Currency> options={OPTIONS} selectedValue="eur" onSelect={jest.fn()} />,
        );
        const separators = separatorsIn(screen.getByRole('radiogroup'));

        expect(separators).toHaveLength(OPTIONS.length - 1);
        separators.forEach((separator) => {
          expect(separator).toHaveStyle({
            height: `${StyleSheet.hairlineWidth}px`,
            backgroundColor: theme.colors.divider,
            marginLeft: inset,
            marginRight: inset,
          });
        });
      });
    });

    describe('WHEN the user picks PLN', () => {
      it('THEN onSelect receives the typed value of that option', () => {
        const onSelect = jest.fn<void, [Currency]>();
        renderWithTheme(
          <SelectOptionList<Currency> options={OPTIONS} selectedValue="eur" onSelect={onSelect} />,
        );

        fireEvent.click(screen.getByRole('radio', { name: 'PLN' }));

        expect(onSelect).toHaveBeenCalledWith('pln');
      });
    });
  });
});
