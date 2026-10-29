import { Select } from '../../src/components/Select';
import { fireEvent, renderWithTheme, screen } from './test-utils';

const OPTIONS = [
  { value: 'usd', label: 'USD' },
  { value: 'eur', label: 'EUR' },
];

describe('Select (real React Native renderer)', () => {
  describe('GIVEN an open Select inside its BottomSheet', () => {
    describe('WHEN the sheet container is inspected', () => {
      it('THEN screen readers are confined to the sheet holding the options', () => {
        renderWithTheme(<Select options={OPTIONS} label="Currency" testID="currency" />);
        fireEvent.press(screen.getByRole('button', { name: 'Currency' }));

        const sheet = screen.getByTestId('currency-sheet');

        expect(sheet).toHaveProp('accessibilityViewIsModal', true);
        expect(screen.getByRole('radio', { name: 'EUR' })).toBeOnTheScreen();
      });
    });

    describe('WHEN the two-finger escape gesture is performed on the sheet', () => {
      it('THEN the sheet closes without calling onChange', () => {
        const onChange = jest.fn();
        renderWithTheme(
          <Select options={OPTIONS} label="Currency" onChange={onChange} testID="currency" />,
        );
        fireEvent.press(screen.getByRole('button', { name: 'Currency' }));

        fireEvent(screen.getByTestId('currency-sheet'), 'accessibilityEscape');

        expect(screen.queryByTestId('currency-sheet')).not.toBeOnTheScreen();
        expect(onChange).not.toHaveBeenCalled();
      });
    });

    describe('WHEN an option is pressed', () => {
      it('THEN onChange receives its value and the sheet closes', () => {
        const onChange = jest.fn();
        renderWithTheme(
          <Select options={OPTIONS} label="Currency" onChange={onChange} testID="currency" />,
        );
        fireEvent.press(screen.getByRole('button', { name: 'Currency' }));

        fireEvent.press(screen.getByRole('radio', { name: 'EUR' }));

        expect(onChange).toHaveBeenCalledWith('eur');
        expect(screen.queryByTestId('currency-sheet')).not.toBeOnTheScreen();
      });
    });
  });
});
