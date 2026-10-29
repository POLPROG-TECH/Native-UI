import { screen } from '@testing-library/react';
import { DateRangePickerInput } from '../../src/components/DateRangePickerInput';
import { renderWithTheme } from '../test-utils';

describe('DateRangePickerInput', () => {
  describe('GIVEN the DateRangePickerInput export from the components module', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a function component', () => {
        const actualType = typeof DateRangePickerInput;

        expect(actualType).toBe('function');
      });
    });
  });

  describe('GIVEN a DateRangePickerInput with a "Booking period" label', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the label text is present in the document', () => {
        renderWithTheme(
          <DateRangePickerInput
            label="Booking period"
            value={{ start: '2025-06-01', end: '2025-06-14' }}
            onChange={() => {}}
          />,
        );

        expect(screen.getByText('Booking period')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a DateRangePickerInput without custom labels', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the default "Start" and "End" labels are shown', () => {
        renderWithTheme(
          <DateRangePickerInput
            value={{ start: '2025-06-01', end: '2025-06-14' }}
            onChange={() => {}}
          />,
        );

        expect(screen.getByText('Start')).toBeInTheDocument();
        expect(screen.getByText('End')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a DateRangePickerInput with custom sub-labels', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the custom labels are visible', () => {
        renderWithTheme(
          <DateRangePickerInput
            value={{ start: '2025-06-01', end: '2025-06-14' }}
            onChange={() => {}}
            startLabel="Check-in"
            endLabel="Check-out"
          />,
        );

        expect(screen.getByText('Check-in')).toBeInTheDocument();
        expect(screen.getByText('Check-out')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a DateRangePickerInput with values', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the en-dash separator is present', () => {
        renderWithTheme(
          <DateRangePickerInput
            value={{ start: '2025-06-01', end: '2025-06-14' }}
            onChange={() => {}}
          />,
        );

        expect(screen.getByText('-')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a DateRangePickerInput with custom sub-labels', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN both buttons are accessible by their respective labels', () => {
        renderWithTheme(
          <DateRangePickerInput
            value={{ start: '2025-06-01', end: '2025-06-14' }}
            onChange={() => {}}
            startLabel="From"
            endLabel="To"
          />,
        );

        expect(screen.getByRole('button', { name: 'From' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'To' })).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a DateRangePickerInput with both start and end errors', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN both errors are exposed via the alert role', () => {
        renderWithTheme(
          <DateRangePickerInput
            value={{ start: '', end: '' }}
            onChange={() => {}}
            startError="Start is required"
            endError="End is required"
          />,
        );

        const alerts = screen.getAllByRole('alert');

        expect(alerts).toHaveLength(2);
        expect(alerts[0]).toHaveTextContent('Start is required');
        expect(alerts[1]).toHaveTextContent('End is required');
      });
    });
  });

  describe('GIVEN a DateRangePickerInput with empty values and placeholders', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the placeholder texts are visible', () => {
        renderWithTheme(
          <DateRangePickerInput
            value={{ start: '', end: '' }}
            onChange={() => {}}
            startPlaceholder="Check-in"
            endPlaceholder="Check-out"
          />,
        );

        expect(screen.getByText('Check-in')).toBeInTheDocument();
        expect(screen.getByText('Check-out')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a DateRangePickerInput with a testID', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the root and both child pickers carry the expected testIDs', () => {
        const { container } = renderWithTheme(
          <DateRangePickerInput
            value={{ start: '2025-06-01', end: '2025-06-14' }}
            onChange={() => {}}
            testID="range"
          />,
        );

        expect(container.querySelector('[data-testid="range"]')).toBeTruthy();
        expect(container.querySelector('[data-testid="range-start"]')).toBeTruthy();
        expect(container.querySelector('[data-testid="range-end"]')).toBeTruthy();
      });
    });
  });

  describe('GIVEN a disabled DateRangePickerInput', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN both buttons expose aria-disabled', () => {
        renderWithTheme(
          <DateRangePickerInput
            value={{ start: '2025-06-01', end: '2025-06-14' }}
            onChange={() => {}}
            startLabel="From"
            endLabel="To"
            disabled
          />,
        );

        const fromButton = screen.getByRole('button', { name: 'From' });
        const toButton = screen.getByRole('button', { name: 'To' });

        expect(fromButton).toHaveAttribute('aria-disabled', 'true');
        expect(toButton).toHaveAttribute('aria-disabled', 'true');
      });
    });
  });

  describe('GIVEN a required DateRangePickerInput with a label', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the asterisk is present', () => {
        renderWithTheme(
          <DateRangePickerInput
            label="Period"
            value={{ start: '', end: '' }}
            onChange={() => {}}
            required
          />,
        );

        expect(screen.getByText('*')).toBeInTheDocument();
      });
    });
  });
});
