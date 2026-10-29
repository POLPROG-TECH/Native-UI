import { screen, fireEvent } from '@testing-library/react';
import { DatePickerInput } from '../../src/components/DatePickerInput';
import { renderWithTheme } from '../test-utils';

describe('DatePickerInput', () => {
  describe('GIVEN the DatePickerInput export from the components module', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a function component', () => {
        const actualType = typeof DatePickerInput;

        expect(actualType).toBe('function');
      });
    });
  });

  describe('GIVEN a DatePickerInput configured with a "Start date" label', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the label text is present in the document', () => {
        renderWithTheme(
          <DatePickerInput label="Start date" value="2025-01-15" onChange={() => {}} />,
        );

        expect(screen.getByText('Start date')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a DatePickerInput marked as required', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the asterisk is present', () => {
        renderWithTheme(
          <DatePickerInput label="Due date" value="2025-01-15" onChange={() => {}} required />,
        );

        expect(screen.getByText('*')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a DatePickerInput that has a validation error', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the error is exposed via the alert role', () => {
        renderWithTheme(
          <DatePickerInput
            label="Date"
            value="2025-01-15"
            onChange={() => {}}
            error="Date is required"
          />,
        );

        const alert = screen.getByRole('alert');

        expect(alert).toHaveTextContent('Date is required');
      });
    });
  });

  describe('GIVEN a DatePickerInput with a date value', () => {
    describe('WHEN the component is rendered with en-US locale', () => {
      it('THEN the formatted month abbreviation is visible', () => {
        renderWithTheme(<DatePickerInput value="2025-06-20" onChange={() => {}} locale="en-US" />);

        expect(screen.getByText(/Jun/)).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a DatePickerInput with a "Start" label', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the button is accessible by its label', () => {
        renderWithTheme(<DatePickerInput label="Start" value="2025-01-15" onChange={() => {}} />);

        expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a DatePickerInput with an empty value and a placeholder', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the placeholder text is visible', () => {
        renderWithTheme(<DatePickerInput value="" onChange={() => {}} placeholder="Pick a date" />);

        expect(screen.getByText('Pick a date')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a DatePickerInput with a value AND a placeholder', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the placeholder is hidden and the formatted date is shown', () => {
        renderWithTheme(
          <DatePickerInput
            value="2025-03-10"
            onChange={() => {}}
            placeholder="Pick a date"
            locale="en-US"
          />,
        );

        expect(screen.queryByText('Pick a date')).not.toBeInTheDocument();
        expect(screen.getByText(/Mar/)).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a DatePickerInput with a testID prop', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the testID attribute is present on a DOM element', () => {
        const { container } = renderWithTheme(
          <DatePickerInput value="2025-01-15" onChange={() => {}} testID="my-picker" />,
        );

        expect(container.querySelector('[data-testid="my-picker"]')).toBeTruthy();
      });
    });
  });

  describe('GIVEN a disabled DatePickerInput with a testID for querying', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the outer container has opacity 0.5', () => {
        const { container } = renderWithTheme(
          <DatePickerInput
            label="Date"
            value="2025-01-15"
            onChange={() => {}}
            disabled
            testID="disabled-picker"
          />,
        );

        const outerView = container.querySelector('[data-testid="disabled-picker"]') as HTMLElement;

        expect(outerView).toBeTruthy();
        expect(outerView.style.opacity).toBe('0.5');
      });
    });
  });

  describe('GIVEN a disabled DatePickerInput', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the button exposes aria-disabled', () => {
        renderWithTheme(
          <DatePickerInput label="Date" value="2025-01-15" onChange={() => {}} disabled />,
        );

        const button = screen.getByRole('button');

        expect(button).toHaveAttribute('aria-disabled', 'true');
      });
    });
  });

  describe('GIVEN a DatePickerInput in time mode with an HH:MM value', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the button is present (time is rendered as text)', () => {
        renderWithTheme(
          <DatePickerInput mode="time" value="14:30" onChange={() => {}} locale="en-US" />,
        );

        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a DatePickerInput in datetime mode', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the formatted month appears in the output', () => {
        renderWithTheme(
          <DatePickerInput
            mode="datetime"
            value="2025-06-15T14:00"
            onChange={() => {}}
            locale="en-US"
          />,
        );

        expect(screen.getByText(/Jun/)).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a DatePickerInput without an explicit mode', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN it renders in date mode (showing month abbreviation)', () => {
        renderWithTheme(<DatePickerInput value="2025-01-15" onChange={() => {}} locale="en-US" />);

        expect(screen.getByText(/Jan/)).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a clearable DatePickerInput with a value', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN a clear button with the drawn close icon is present', () => {
        renderWithTheme(
          <DatePickerInput value="2025-01-15" onChange={() => {}} clearable testID="date" />,
        );

        expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
        expect(screen.getByTestId('date-clear-icon')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a clearable DatePickerInput without a value', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN no clear button is shown', () => {
        renderWithTheme(
          <DatePickerInput value="" onChange={() => {}} clearable placeholder="Select" />,
        );

        expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a clearable but disabled DatePickerInput with a value', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN no clear button is shown', () => {
        renderWithTheme(
          <DatePickerInput value="2025-01-15" onChange={() => {}} clearable disabled />,
        );

        expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a clearable DatePickerInput with an onChange spy', () => {
    describe('WHEN the clear button is clicked', () => {
      it('THEN onChange is called with an empty string', () => {
        const onChange = jest.fn();

        renderWithTheme(<DatePickerInput value="2025-01-15" onChange={onChange} clearable />);
        fireEvent.click(screen.getByRole('button', { name: 'Clear' }));

        expect(onChange).toHaveBeenCalledWith('');
      });
    });
  });

  describe('GIVEN a clearable DatePickerInput with both onChange and onClear', () => {
    describe('WHEN the clear button is clicked', () => {
      it('THEN onClear is called and onChange is not', () => {
        const onChange = jest.fn();
        const onClear = jest.fn();

        renderWithTheme(
          <DatePickerInput value="2025-01-15" onChange={onChange} clearable onClear={onClear} />,
        );
        fireEvent.click(screen.getByRole('button', { name: 'Clear' }));

        expect(onClear).toHaveBeenCalledTimes(1);
        expect(onChange).not.toHaveBeenCalled();
      });
    });
  });

  describe("GIVEN a DatePickerInput with onOpen and onClose callbacks (native picker is not available in this test environment, so callbacks won't fire - this test verifies the props are accepted gracefully)", () => {
    describe('WHEN the component is rendered', () => {
      it('THEN it renders without throwing', () => {
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

        expect(renderFn).not.toThrow();
      });
    });
  });

  describe('GIVEN a DatePickerInput with controlled isOpen state', () => {
    describe('WHEN the component is rendered with isOpen=true', () => {
      it('THEN it renders without throwing', () => {
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

        expect(renderFn).not.toThrow();
      });
    });
  });
});
