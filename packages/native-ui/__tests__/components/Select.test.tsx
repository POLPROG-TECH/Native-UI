import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { Select } from '../../src/components/Select';
import { renderWithTheme } from '../test-utils';

const OPTIONS = [
  { value: 'usd', label: 'USD' },
  { value: 'eur', label: 'EUR' },
  { value: 'gbp', label: 'GBP' },
];

describe('Select', () => {
  it('should be exported as a callable compound component', () => {
    // GIVEN the Select export

    // WHEN its runtime type is inspected
    const actualType = typeof Select;

    // THEN it is callable at runtime (function or object with call signature)
    expect(['function', 'object']).toContain(actualType);
  });

  it('should render the placeholder when no value is selected', () => {
    // GIVEN a Select with a placeholder and no selected value
    // WHEN the component is rendered
    renderWithTheme(<Select options={OPTIONS} placeholder="Pick one" />);

    // THEN the placeholder text is visible
    expect(screen.getByText('Pick one')).toBeInTheDocument();
  });

  it('should render the label of the currently selected value', () => {
    // GIVEN a Select pre-populated with a value
    // WHEN the component is rendered
    renderWithTheme(<Select options={OPTIONS} value="eur" />);

    // THEN the corresponding option label is shown
    expect(screen.getByText('EUR')).toBeInTheDocument();
  });

  it('should treat `selectedValue` as a fallback for `value`', () => {
    // GIVEN a Select passed a legacy `selectedValue` prop
    // WHEN the component is rendered
    renderWithTheme(<Select options={OPTIONS} selectedValue="gbp" />);

    // THEN the corresponding option label is shown
    expect(screen.getByText('GBP')).toBeInTheDocument();
  });

  it('should render the label and a required asterisk when `required` is true', () => {
    // GIVEN a Select labelled and marked as required
    // WHEN the component is rendered
    renderWithTheme(<Select options={OPTIONS} label="Currency" required />);

    // THEN the label text and asterisk are both present
    expect(screen.getByText(/Currency/)).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should render an error message with the `alert` role when `error` is set', () => {
    // GIVEN a Select that has a validation error
    // WHEN the component is rendered
    renderWithTheme(<Select options={OPTIONS} error="Required field" />);

    // THEN the error is exposed via the alert role
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('Required field');
  });

  it('should open the options modal when the trigger is pressed', () => {
    // GIVEN a collapsed Select
    renderWithTheme(<Select options={OPTIONS} label="Currency" />);

    // WHEN the trigger is pressed
    fireEvent.click(screen.getByRole('button', { name: 'Currency' }));

    // THEN the option labels become visible
    expect(screen.getByText('USD')).toBeInTheDocument();
    expect(screen.getByText('EUR')).toBeInTheDocument();
  });

  it('should invoke `onChange` with the picked value when an option is selected', () => {
    // GIVEN a Select with an onChange spy
    const onChange = jest.fn();

    // WHEN the user opens the modal and picks an option
    renderWithTheme(<Select options={OPTIONS} label="Currency" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Currency' }));
    fireEvent.click(screen.getByText('EUR'));

    // THEN onChange receives the picked value
    expect(onChange).toHaveBeenCalledWith('eur');
  });

  it('should invoke `onValueChange` alongside `onChange` when both are provided', () => {
    // GIVEN a Select listening on both callbacks
    const onChange = jest.fn();
    const onValueChange = jest.fn();

    // WHEN the user picks an option
    renderWithTheme(
      <Select
        options={OPTIONS}
        label="Currency"
        onChange={onChange}
        onValueChange={onValueChange}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Currency' }));
    fireEvent.click(screen.getByText('USD'));

    // THEN both callbacks receive the same value
    expect(onChange).toHaveBeenCalledWith('usd');
    expect(onValueChange).toHaveBeenCalledWith('usd');
  });

  it('should NOT open the modal when `disabled` is true', () => {
    // GIVEN a disabled Select
    renderWithTheme(<Select options={OPTIONS} label="Currency" disabled />);

    // WHEN the trigger is clicked
    fireEvent.click(screen.getByRole('button', { name: 'Currency' }));

    // THEN the option list is not rendered
    expect(screen.queryByText('USD')).not.toBeInTheDocument();
  });

  it('should close the options modal when the backdrop is pressed', () => {
    // GIVEN an open Select modal
    renderWithTheme(<Select options={OPTIONS} label="Currency" />);
    fireEvent.click(screen.getByRole('button', { name: 'Currency' }));
    expect(screen.getByText('USD')).toBeInTheDocument();

    // WHEN the backdrop close button is pressed
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    // THEN the option list is hidden
    expect(screen.queryByText('USD')).not.toBeInTheDocument();
  });

  it('should close the options modal when the Cancel button is pressed', () => {
    // GIVEN an open Select modal
    renderWithTheme(<Select options={OPTIONS} label="Currency" />);
    fireEvent.click(screen.getByRole('button', { name: 'Currency' }));
    expect(screen.getByText('USD')).toBeInTheDocument();

    // WHEN the Cancel button is pressed
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    // THEN the option list is hidden
    expect(screen.queryByText('USD')).not.toBeInTheDocument();
  });

  it('should render Select.Trigger with its children and fire onPress when not disabled', () => {
    // GIVEN a Select.Trigger with onPress spy
    const onPress = jest.fn();

    // WHEN the trigger is rendered and clicked
    renderWithTheme(
      <Select.Trigger onPress={onPress}>
        <span>Custom trigger</span>
      </Select.Trigger>,
    );
    fireEvent.click(screen.getByRole('button'));

    // THEN onPress is fired and children are visible
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Custom trigger')).toBeInTheDocument();
  });

  it('should NOT fire onPress when Select.Trigger is disabled', () => {
    // GIVEN a disabled Select.Trigger
    const onPress = jest.fn();

    // WHEN the trigger is clicked
    renderWithTheme(
      <Select.Trigger onPress={onPress} disabled>
        <span>Locked trigger</span>
      </Select.Trigger>,
    );
    fireEvent.click(screen.getByRole('button'));

    // THEN onPress is not invoked
    expect(onPress).not.toHaveBeenCalled();
  });

  it('should render Select.Option with the radio role and expose selection state', () => {
    // GIVEN a selected Select.Option
    // WHEN the component is rendered
    renderWithTheme(
      <Select.Option selected onPress={() => {}}>
        <span>Opt A</span>
      </Select.Option>,
    );

    // THEN the node uses role=radio and is marked as selected
    const option = screen.getByRole('radio');
    expect(option).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Opt A')).toBeInTheDocument();
  });
});
