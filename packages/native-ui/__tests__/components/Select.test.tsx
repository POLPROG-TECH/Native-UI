import { fireEvent, screen } from '@testing-library/react';
import { Select } from '../../src/components/Select';
import { renderWithTheme } from '../test-utils';

const OPTIONS = [
  { value: 'usd', label: 'USD' },
  { value: 'eur', label: 'EUR' },
  { value: 'gbp', label: 'GBP' },
];

describe('Select', () => {
  describe('GIVEN the Select export', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is callable at runtime (function or object with call signature)', () => {
        const actualType = typeof Select;

        expect(['function', 'object']).toContain(actualType);
      });
    });
  });

  describe('GIVEN a Select with a placeholder and no selected value', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the placeholder text is visible', () => {
        renderWithTheme(<Select options={OPTIONS} placeholder="Pick one" />);

        expect(screen.getByText('Pick one')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a Select pre-populated with a value', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the corresponding option label is shown', () => {
        renderWithTheme(<Select options={OPTIONS} value="eur" />);

        expect(screen.getByText('EUR')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a Select labelled and marked as required', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the label text and asterisk are both present', () => {
        renderWithTheme(<Select options={OPTIONS} label="Currency" required />);

        expect(screen.getByText(/Currency/)).toBeInTheDocument();
        expect(screen.getByText('*')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a Select that has a validation error', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the error is exposed via the alert role', () => {
        renderWithTheme(<Select options={OPTIONS} error="Required field" />);

        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
        expect(alert).toHaveTextContent('Required field');
      });
    });
  });

  describe('GIVEN a collapsed Select', () => {
    describe('WHEN the trigger is pressed', () => {
      it('THEN the option labels become visible', () => {
        renderWithTheme(<Select options={OPTIONS} label="Currency" />);

        fireEvent.click(screen.getByRole('button', { name: 'Currency' }));

        expect(screen.getByText('USD')).toBeInTheDocument();
        expect(screen.getByText('EUR')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a Select with an onChange spy', () => {
    describe('WHEN the user opens the modal and picks an option', () => {
      it('THEN onChange receives the picked value', () => {
        const onChange = jest.fn();

        renderWithTheme(<Select options={OPTIONS} label="Currency" onChange={onChange} />);
        fireEvent.click(screen.getByRole('button', { name: 'Currency' }));
        fireEvent.click(screen.getByText('EUR'));

        expect(onChange).toHaveBeenCalledWith('eur');
      });
    });
  });

  describe('GIVEN a disabled Select', () => {
    describe('WHEN the trigger is clicked', () => {
      it('THEN the option list is not rendered', () => {
        renderWithTheme(<Select options={OPTIONS} label="Currency" disabled />);

        fireEvent.click(screen.getByRole('button', { name: 'Currency' }));

        expect(screen.queryByText('USD')).not.toBeInTheDocument();
      });
    });
  });

  describe('GIVEN an open Select modal', () => {
    describe('WHEN the backdrop close button is pressed', () => {
      it('THEN the option list is hidden', () => {
        renderWithTheme(<Select options={OPTIONS} label="Currency" />);
        fireEvent.click(screen.getByRole('button', { name: 'Currency' }));
        expect(screen.getByText('USD')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Close' }));

        expect(screen.queryByText('USD')).not.toBeInTheDocument();
      });
    });

    describe('WHEN the Cancel button is pressed', () => {
      it('THEN the option list is hidden', () => {
        renderWithTheme(<Select options={OPTIONS} label="Currency" />);
        fireEvent.click(screen.getByRole('button', { name: 'Currency' }));
        expect(screen.getByText('USD')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

        expect(screen.queryByText('USD')).not.toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a Select.Trigger with onPress spy', () => {
    describe('WHEN the trigger is rendered and clicked', () => {
      it('THEN onPress is fired and children are visible', () => {
        const onPress = jest.fn();

        renderWithTheme(
          <Select.Trigger onPress={onPress}>
            <span>Custom trigger</span>
          </Select.Trigger>,
        );
        fireEvent.click(screen.getByRole('button'));

        expect(onPress).toHaveBeenCalledTimes(1);
        expect(screen.getByText('Custom trigger')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a disabled Select.Trigger', () => {
    describe('WHEN the trigger is clicked', () => {
      it('THEN onPress is not invoked', () => {
        const onPress = jest.fn();

        renderWithTheme(
          <Select.Trigger onPress={onPress} disabled>
            <span>Locked trigger</span>
          </Select.Trigger>,
        );
        fireEvent.click(screen.getByRole('button'));

        expect(onPress).not.toHaveBeenCalled();
      });
    });
  });

  describe('GIVEN a selected Select.Option', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the node uses role=radio and is marked as selected', () => {
        renderWithTheme(
          <Select.Option selected onPress={() => {}}>
            <span>Opt A</span>
          </Select.Option>,
        );

        const option = screen.getByRole('radio');
        expect(option).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByText('Opt A')).toBeInTheDocument();
      });
    });
  });
});
