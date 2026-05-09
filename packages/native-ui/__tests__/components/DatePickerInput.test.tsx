import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { DatePickerInput } from '../../src/components/DatePickerInput';
import { renderWithTheme } from '../test-utils';

describe('DatePickerInput', () => {
  it('should be exported as a function component', () => {
    // GIVEN the DatePickerInput export from the components module

    // WHEN its runtime type is inspected
    const actualType = typeof DatePickerInput;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should render the label when a label prop is provided', () => {
    // GIVEN a DatePickerInput configured with a "Start date" label

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<DatePickerInput label="Start date" value="2025-01-15" onChange={() => {}} />);

    // THEN the label text is present in the document
    expect(screen.getByText('Start date')).toBeInTheDocument();
  });

  it('should render a required asterisk next to the label when required', () => {
    // GIVEN a DatePickerInput marked as required

    // WHEN the component is rendered
    renderWithTheme(
      <DatePickerInput label="Due date" value="2025-01-15" onChange={() => {}} required />,
    );

    // THEN the asterisk is present
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should render the error message with the alert role when error is set', () => {
    // GIVEN a DatePickerInput that has a validation error

    // WHEN the component is rendered
    renderWithTheme(
      <DatePickerInput
        label="Date"
        value="2025-01-15"
        onChange={() => {}}
        error="Date is required"
      />,
    );

    // THEN the error is exposed via the alert role
    const alert = screen.getByRole('alert');

    expect(alert).toHaveTextContent('Date is required');
  });

  it('should display the formatted date value in date mode', () => {
    // GIVEN a DatePickerInput with a date value

    // WHEN the component is rendered with en-US locale
    renderWithTheme(<DatePickerInput value="2025-06-20" onChange={() => {}} locale="en-US" />);

    // THEN the formatted month abbreviation is visible
    expect(screen.getByText(/Jun/)).toBeInTheDocument();
  });

  it('should render a pressable button with the label as accessibility label', () => {
    // GIVEN a DatePickerInput with a "Start" label

    // WHEN the component is rendered
    renderWithTheme(<DatePickerInput label="Start" value="2025-01-15" onChange={() => {}} />);

    // THEN the button is accessible by its label
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
  });

  it('should render placeholder text when value is empty and placeholder is set', () => {
    // GIVEN a DatePickerInput with an empty value and a placeholder

    // WHEN the component is rendered
    renderWithTheme(<DatePickerInput value="" onChange={() => {}} placeholder="Pick a date" />);

    // THEN the placeholder text is visible
    expect(screen.getByText('Pick a date')).toBeInTheDocument();
  });

  it('should render the formatted date instead of placeholder when value is set', () => {
    // GIVEN a DatePickerInput with a value AND a placeholder

    // WHEN the component is rendered
    renderWithTheme(
      <DatePickerInput
        value="2025-03-10"
        onChange={() => {}}
        placeholder="Pick a date"
        locale="en-US"
      />,
    );

    // THEN the placeholder is hidden and the formatted date is shown
    expect(screen.queryByText('Pick a date')).not.toBeInTheDocument();
    expect(screen.getByText(/Mar/)).toBeInTheDocument();
  });

  it('should forward testID to the outermost View', () => {
    // GIVEN a DatePickerInput with a testID prop

    // WHEN the component is rendered
    const { container } = renderWithTheme(
      <DatePickerInput value="2025-01-15" onChange={() => {}} testID="my-picker" />,
    );

    // THEN the testID attribute is present on a DOM element
    expect(container.querySelector('[testid="my-picker"]')).toBeTruthy();
  });

  it('should apply reduced opacity when disabled', () => {
    // GIVEN a disabled DatePickerInput with a testID for querying

    // WHEN the component is rendered
    const { container } = renderWithTheme(
      <DatePickerInput
        label="Date"
        value="2025-01-15"
        onChange={() => {}}
        disabled
        testID="disabled-picker"
      />,
    );

    // THEN the outer container has opacity 0.5
    const outerView = container.querySelector('[testid="disabled-picker"]') as HTMLElement;

    expect(outerView).toBeTruthy();
    expect(outerView.style.opacity).toBe('0.5');
  });

  it('should set aria-disabled on the pressable when disabled', () => {
    // GIVEN a disabled DatePickerInput

    // WHEN the component is rendered
    renderWithTheme(
      <DatePickerInput label="Date" value="2025-01-15" onChange={() => {}} disabled />,
    );

    // THEN the button exposes aria-disabled
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('should render a time value in time mode', () => {
    // GIVEN a DatePickerInput in time mode with an HH:MM value

    // WHEN the component is rendered
    renderWithTheme(
      <DatePickerInput mode="time" value="14:30" onChange={() => {}} locale="en-US" />,
    );

    // THEN the button is present (time is rendered as text)
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should render a datetime value in datetime mode', () => {
    // GIVEN a DatePickerInput in datetime mode

    // WHEN the component is rendered
    renderWithTheme(
      <DatePickerInput
        mode="datetime"
        value="2025-06-15T14:00"
        onChange={() => {}}
        locale="en-US"
      />,
    );

    // THEN the formatted month appears in the output
    expect(screen.getByText(/Jun/)).toBeInTheDocument();
  });

  it('should default mode to date when not specified', () => {
    // GIVEN a DatePickerInput without an explicit mode

    // WHEN the component is rendered
    renderWithTheme(<DatePickerInput value="2025-01-15" onChange={() => {}} locale="en-US" />);

    // THEN it renders in date mode (showing month abbreviation)
    expect(screen.getByText(/Jan/)).toBeInTheDocument();
  });

  it('should render a clear button when clearable is true and value is set', () => {
    // GIVEN a clearable DatePickerInput with a value

    // WHEN the component is rendered
    renderWithTheme(<DatePickerInput value="2025-01-15" onChange={() => {}} clearable />);

    // THEN a clear button with the ✕ icon is present
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
    expect(screen.getByText('✕')).toBeInTheDocument();
  });

  it('should NOT render a clear button when value is empty', () => {
    // GIVEN a clearable DatePickerInput without a value

    // WHEN the component is rendered
    renderWithTheme(
      <DatePickerInput value="" onChange={() => {}} clearable placeholder="Select" />,
    );

    // THEN no clear button is shown
    expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
  });

  it('should NOT render a clear button when disabled', () => {
    // GIVEN a clearable but disabled DatePickerInput with a value

    // WHEN the component is rendered
    renderWithTheme(<DatePickerInput value="2025-01-15" onChange={() => {}} clearable disabled />);

    // THEN no clear button is shown
    expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
  });

  it('should call onChange with empty string when clear button is pressed', () => {
    // GIVEN a clearable DatePickerInput with an onChange spy
    const onChange = jest.fn();

    // WHEN the clear button is clicked
    renderWithTheme(<DatePickerInput value="2025-01-15" onChange={onChange} clearable />);
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));

    // THEN onChange is called with an empty string
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('should call onClear instead of onChange when onClear is provided', () => {
    // GIVEN a clearable DatePickerInput with both onChange and onClear
    const onChange = jest.fn();
    const onClear = jest.fn();

    // WHEN the clear button is clicked
    renderWithTheme(
      <DatePickerInput value="2025-01-15" onChange={onChange} clearable onClear={onClear} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));

    // THEN onClear is called and onChange is not
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should accept onOpen and onClose without crashing', () => {
    // GIVEN a DatePickerInput with onOpen and onClose callbacks
    // (native picker is not available in this test environment, so callbacks
    // won't fire - this test verifies the props are accepted gracefully)

    // WHEN the component is rendered
    const onOpen = jest.fn();
    const onClose = jest.fn();
    const renderFn = () =>
      renderWithTheme(
        <DatePickerInput
          label="Date"
          value="2025-01-15"
          onChange={() => {}}
          onOpen={onOpen}
          onClose={onClose}
        />,
      );

    // THEN it renders without throwing
    expect(renderFn).not.toThrow();
  });

  it('should accept isOpen controlled prop without crashing', () => {
    // GIVEN a DatePickerInput with controlled isOpen state

    // WHEN the component is rendered with isOpen=true
    const renderFn = () =>
      renderWithTheme(
        <DatePickerInput
          label="Date"
          value="2025-01-15"
          onChange={() => {}}
          isOpen={true}
          onOpen={() => {}}
          onClose={() => {}}
        />,
      );

    // THEN it renders without throwing
    expect(renderFn).not.toThrow();
  });
});
