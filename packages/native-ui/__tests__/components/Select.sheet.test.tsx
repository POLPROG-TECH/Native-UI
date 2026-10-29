import { fireEvent, screen, within } from '@testing-library/react';
import { Select } from '../../src/components/Select';
import { captureTheme, renderWithTheme } from '../test-utils';

const OPTIONS = [
  { value: 'usd', label: 'USD' },
  { value: 'eur', label: 'EUR' },
];

describe('Select option sheet', () => {
  describe('GIVEN a Select with a testID', () => {
    describe('WHEN the trigger is pressed', () => {
      it('THEN the options open inside the BottomSheet identified by `${testID}-sheet`', () => {
        renderWithTheme(<Select options={OPTIONS} label="Currency" testID="currency" />);

        fireEvent.click(screen.getByRole('button', { name: 'Currency' }));

        const sheet = screen.getByTestId('currency-sheet');
        expect(within(sheet).getByRole('radio', { name: 'EUR' })).toBeInTheDocument();
        expect(within(sheet).getByRole('header')).toHaveTextContent('Currency');
      });
    });
  });

  describe('GIVEN an open Select with an onChange spy', () => {
    describe('WHEN the Cancel action is pressed', () => {
      it('THEN the sheet closes and onChange is not called', () => {
        const onChange = jest.fn();
        renderWithTheme(
          <Select options={OPTIONS} label="Currency" onChange={onChange} testID="currency" />,
        );
        fireEvent.click(screen.getByRole('button', { name: 'Currency' }));

        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

        expect(screen.queryByTestId('currency-sheet')).not.toBeInTheDocument();
        expect(onChange).not.toHaveBeenCalled();
      });
    });
  });

  describe('GIVEN a custom cancelLabel', () => {
    describe('WHEN the sheet is opened', () => {
      it('THEN the Cancel action uses that caption as its accessible name', () => {
        renderWithTheme(<Select options={OPTIONS} label="Waluta" cancelLabel="Anuluj" />);

        fireEvent.click(screen.getByRole('button', { name: 'Waluta' }));

        expect(screen.getByRole('button', { name: 'Anuluj' })).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN options whose icon is a render function and USD is selected', () => {
    describe('WHEN the sheet is opened', () => {
      it('THEN each icon gets the themed color for its state and the option icon size', () => {
        const theme = captureTheme();
        const renderIcon = jest.fn(() => null);
        const options = OPTIONS.map((option) => ({ ...option, icon: renderIcon }));
        renderWithTheme(<Select options={options} value="usd" label="Currency" />);

        fireEvent.click(screen.getByRole('button', { name: 'Currency' }));

        const size = theme.components.select.optionIconSize;
        expect(renderIcon).toHaveBeenCalledWith({ color: theme.colors.primaryText, size });
        expect(renderIcon).toHaveBeenCalledWith({ color: theme.colors.textSecondary, size });
      });
    });
  });

  describe('GIVEN an option with an emoji string icon', () => {
    describe('WHEN the sheet is opened', () => {
      it('THEN the emoji is shown and the radio is named by its label alone', () => {
        const options = [{ value: 'usd', label: 'USD', icon: '💵' }];
        renderWithTheme(<Select options={options} label="Currency" />);

        fireEvent.click(screen.getByRole('button', { name: 'Currency' }));

        expect(screen.getByText('💵')).toBeInTheDocument();
        expect(screen.getByRole('radio', { name: 'USD' })).toBeInTheDocument();
      });
    });
  });
});
