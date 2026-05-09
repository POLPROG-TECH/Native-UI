import React from 'react';
import { screen } from '@testing-library/react';
import { DateRangePickerInput } from '../../src/components/DateRangePickerInput';
import { renderWithTheme } from '../test-utils';

describe('DateRangePickerInput', () => {
  it('should be exported as a function component', () => {
    // GIVEN the DateRangePickerInput export from the components module

    // WHEN its runtime type is inspected
    const actualType = typeof DateRangePickerInput;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should render the top-level label when provided', () => {
    // GIVEN a DateRangePickerInput with a "Booking period" label

    // WHEN the component is rendered
    renderWithTheme(
      <DateRangePickerInput
        label="Booking period"
        value={{ start: '2025-06-01', end: '2025-06-14' }}
        onChange={() => {}}
      />,
    );

    // THEN the label text is present in the document
    expect(screen.getByText('Booking period')).toBeInTheDocument();
  });

  it('should render default start and end labels', () => {
    // GIVEN a DateRangePickerInput without custom labels

    // WHEN the component is rendered
    renderWithTheme(
      <DateRangePickerInput
        value={{ start: '2025-06-01', end: '2025-06-14' }}
        onChange={() => {}}
      />,
    );

    // THEN the default "Start" and "End" labels are shown
    expect(screen.getByText('Start')).toBeInTheDocument();
    expect(screen.getByText('End')).toBeInTheDocument();
  });

  it('should render custom start and end labels', () => {
    // GIVEN a DateRangePickerInput with custom sub-labels

    // WHEN the component is rendered
    renderWithTheme(
      <DateRangePickerInput
        value={{ start: '2025-06-01', end: '2025-06-14' }}
        onChange={() => {}}
        startLabel="Check-in"
        endLabel="Check-out"
      />,
    );

    // THEN the custom labels are visible
    expect(screen.getByText('Check-in')).toBeInTheDocument();
    expect(screen.getByText('Check-out')).toBeInTheDocument();
  });

  it('should render the en-dash separator between the two pickers', () => {
    // GIVEN a DateRangePickerInput with values

    // WHEN the component is rendered
    renderWithTheme(
      <DateRangePickerInput
        value={{ start: '2025-06-01', end: '2025-06-14' }}
        onChange={() => {}}
      />,
    );

    // THEN the en-dash separator is present
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('should render two date picker buttons with their labels as accessibility labels', () => {
    // GIVEN a DateRangePickerInput with custom sub-labels

    // WHEN the component is rendered
    renderWithTheme(
      <DateRangePickerInput
        value={{ start: '2025-06-01', end: '2025-06-14' }}
        onChange={() => {}}
        startLabel="From"
        endLabel="To"
      />,
    );

    // THEN both buttons are accessible by their respective labels
    expect(screen.getByRole('button', { name: 'From' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'To' })).toBeInTheDocument();
  });

  it('should render start and end error messages independently', () => {
    // GIVEN a DateRangePickerInput with both start and end errors

    // WHEN the component is rendered
    renderWithTheme(
      <DateRangePickerInput
        value={{ start: '', end: '' }}
        onChange={() => {}}
        startError="Start is required"
        endError="End is required"
      />,
    );

    // THEN both errors are exposed via the alert role
    const alerts = screen.getAllByRole('alert');

    expect(alerts).toHaveLength(2);
    expect(alerts[0]).toHaveTextContent('Start is required');
    expect(alerts[1]).toHaveTextContent('End is required');
  });

  it('should render placeholders when values are empty', () => {
    // GIVEN a DateRangePickerInput with empty values and placeholders

    // WHEN the component is rendered
    renderWithTheme(
      <DateRangePickerInput
        value={{ start: '', end: '' }}
        onChange={() => {}}
        startPlaceholder="Check-in"
        endPlaceholder="Check-out"
      />,
    );

    // THEN the placeholder texts are visible
    expect(screen.getByText('Check-in')).toBeInTheDocument();
    expect(screen.getByText('Check-out')).toBeInTheDocument();
  });

  it('should forward testID with -start and -end suffixes to child pickers', () => {
    // GIVEN a DateRangePickerInput with a testID

    // WHEN the component is rendered
    const { container } = renderWithTheme(
      <DateRangePickerInput
        value={{ start: '2025-06-01', end: '2025-06-14' }}
        onChange={() => {}}
        testID="range"
      />,
    );

    // THEN the root and both child pickers carry the expected testIDs
    expect(container.querySelector('[testid="range"]')).toBeTruthy();
    expect(container.querySelector('[testid="range-start"]')).toBeTruthy();
    expect(container.querySelector('[testid="range-end"]')).toBeTruthy();
  });

  it('should disable both pickers when disabled prop is true', () => {
    // GIVEN a disabled DateRangePickerInput

    // WHEN the component is rendered
    renderWithTheme(
      <DateRangePickerInput
        value={{ start: '2025-06-01', end: '2025-06-14' }}
        onChange={() => {}}
        startLabel="From"
        endLabel="To"
        disabled
      />,
    );

    // THEN both buttons expose aria-disabled
    const fromButton = screen.getByRole('button', { name: 'From' });
    const toButton = screen.getByRole('button', { name: 'To' });

    expect(fromButton).toHaveAttribute('aria-disabled', 'true');
    expect(toButton).toHaveAttribute('aria-disabled', 'true');
  });

  it('should show a required asterisk next to the label', () => {
    // GIVEN a required DateRangePickerInput with a label

    // WHEN the component is rendered
    renderWithTheme(
      <DateRangePickerInput
        label="Period"
        value={{ start: '', end: '' }}
        onChange={() => {}}
        required
      />,
    );

    // THEN the asterisk is present
    expect(screen.getByText('*')).toBeInTheDocument();
  });
});
