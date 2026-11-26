/**
 * Mocks @react-native-community/datetimepicker to exercise the native picker
 * branches that are unreachable when the peer dependency is absent (the
 * standard test environment). Android lives in
 * `DatePickerInput.android.test.tsx`.
 *
 * Platform.OS is 'ios' by default in our mock. On iOS:
 *  - With a value → compact picker renders inline (no trigger button)
 *  - With empty value + placeholder → TriggerRow renders, pressing opens picker
 */
import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithTheme } from '../test-utils';
import { MockDateTimePicker } from '../shared/dateTimePickerMock';

/* Mock the native picker module BEFORE importing DatePickerInput. */
jest.mock(
  '@react-native-community/datetimepicker',
  () => ({
    __esModule: true,
    default: jest.requireActual('../shared/dateTimePickerMock').MockDateTimePicker,
  }),
  { virtual: true },
);

import { DatePickerInput } from '../../src/components/DatePickerInput';

describe('DatePickerInput (native picker - iOS compact mode)', () => {
  beforeEach(() => {
    MockDateTimePicker.mockClear();
  });

  describe('GIVEN a DatePickerInput with a value on iOS (compact mode)', () => {
    describe('WHEN rendered', () => {
      it('THEN the native picker is rendered immediately (no trigger press needed)', () => {
        renderWithTheme(<DatePickerInput label="Date" value="2025-01-15" onChange={() => {}} />);

        expect(screen.getByTestId('native-picker')).toBeInTheDocument();
        expect(screen.getByTestId('native-picker')).toHaveAttribute('data-display', 'compact');
      });
    });
  });

  describe('GIVEN a DatePickerInput with a value on iOS', () => {
    describe('WHEN rendered and the native picker fires onChange', () => {
      it('THEN onChange is called with the formatted date', () => {
        const onChange = jest.fn();

        renderWithTheme(<DatePickerInput label="Date" value="2025-01-15" onChange={onChange} />);
        fireEvent.click(screen.getByTestId('native-picker'));

        expect(onChange).toHaveBeenCalledWith('2025-06-15');
      });
    });
  });

  describe('GIVEN a DatePickerInput in time mode on iOS', () => {
    describe('WHEN rendered', () => {
      it('THEN the native picker has mode=time', () => {
        renderWithTheme(
          <DatePickerInput label="Time" value="14:30" onChange={() => {}} mode="time" />,
        );

        expect(screen.getByTestId('native-picker')).toHaveAttribute('data-mode', 'time');
      });
    });
  });

  describe('GIVEN a DatePickerInput in datetime mode on iOS (iOS supports native datetime)', () => {
    describe('WHEN rendered', () => {
      it('THEN the native picker has mode=datetime', () => {
        renderWithTheme(
          <DatePickerInput
            label="Event"
            value="2025-06-15T14:00"
            onChange={() => {}}
            mode="datetime"
          />,
        );

        expect(screen.getByTestId('native-picker')).toHaveAttribute('data-mode', 'datetime');
      });
    });
  });

  describe('GIVEN a clearable DatePickerInput with a value on iOS', () => {
    describe('WHEN rendered', () => {
      it('THEN the clear button is present', () => {
        renderWithTheme(
          <DatePickerInput label="Date" value="2025-01-15" onChange={() => {}} clearable />,
        );

        expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a clearable DatePickerInput with onClear callback', () => {
    describe('WHEN the clear button is pressed', () => {
      it('THEN onClear is called', () => {
        const onClear = jest.fn();

        renderWithTheme(
          <DatePickerInput
            label="Date"
            value="2025-01-15"
            onChange={() => {}}
            clearable
            onClear={onClear}
          />,
        );
        fireEvent.click(screen.getByRole('button', { name: 'Clear' }));

        expect(onClear).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('GIVEN a disabled DatePickerInput on iOS', () => {
    describe('WHEN rendered', () => {
      it('THEN the outer container has reduced opacity', () => {
        const { container } = renderWithTheme(
          <DatePickerInput
            label="Date"
            value="2025-01-15"
            onChange={() => {}}
            disabled
            testID="disabled-ios"
          />,
        );

        const outer = container.querySelector('[data-testid="disabled-ios"]') as HTMLElement;

        expect(outer.style.opacity).toBe('0.5');
      });
    });
  });
});

describe('DatePickerInput (native picker - iOS placeholder mode)', () => {
  beforeEach(() => {
    MockDateTimePicker.mockClear();
  });

  describe('GIVEN a DatePickerInput with empty value and a placeholder on iOS', () => {
    describe('WHEN rendered', () => {
      it('THEN the placeholder text is shown in a pressable trigger', () => {
        renderWithTheme(
          <DatePickerInput label="Date" value="" onChange={() => {}} placeholder="Select a date" />,
        );

        expect(screen.getByText('Select a date')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Date' })).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a DatePickerInput with placeholder on iOS', () => {
    describe('WHEN rendered (before interaction)', () => {
      it('THEN the native picker is NOT yet visible', () => {
        renderWithTheme(
          <DatePickerInput label="Date" value="" onChange={() => {}} placeholder="Select a date" />,
        );

        expect(screen.queryByTestId('native-picker')).not.toBeInTheDocument();
      });
    });

    describe('WHEN the trigger is pressed', () => {
      it('THEN the native picker appears with display=default', () => {
        renderWithTheme(
          <DatePickerInput label="Date" value="" onChange={() => {}} placeholder="Select a date" />,
        );
        fireEvent.click(screen.getByRole('button', { name: 'Date' }));

        expect(screen.getByTestId('native-picker')).toBeInTheDocument();
        expect(screen.getByTestId('native-picker')).toHaveAttribute('data-display', 'default');
      });
    });
  });

  describe('GIVEN a DatePickerInput with placeholder and onOpen', () => {
    describe('WHEN the trigger is pressed', () => {
      it('THEN onOpen is called', () => {
        const onOpen = jest.fn();

        renderWithTheme(
          <DatePickerInput
            label="Date"
            value=""
            onChange={() => {}}
            placeholder="Select a date"
            onOpen={onOpen}
          />,
        );
        fireEvent.click(screen.getByRole('button', { name: 'Date' }));

        expect(onOpen).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('GIVEN a DatePickerInput with placeholder and callbacks', () => {
    describe('WHEN the trigger is pressed and a date is selected', () => {
      it('THEN onChange is called with the selected date', () => {
        const onChange = jest.fn();
        const onClose = jest.fn();

        renderWithTheme(
          <DatePickerInput
            label="Date"
            value=""
            onChange={onChange}
            onClose={onClose}
            placeholder="Select a date"
          />,
        );
        fireEvent.click(screen.getByRole('button', { name: 'Date' }));
        fireEvent.click(screen.getByTestId('native-picker'));

        expect(onChange).toHaveBeenCalledWith('2025-06-15');
        /* AND onClose is called */
        expect(onClose).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('GIVEN a DatePickerInput with placeholder', () => {
    describe('WHEN the trigger is pressed and the picker is dismissed', () => {
      it('THEN onClose is called but onChange is NOT', () => {
        const onChange = jest.fn();
        const onClose = jest.fn();

        /* Override mock to simulate dismiss */
        MockDateTimePicker.mockImplementationOnce((props: Record<string, unknown>) =>
          React.createElement('button', {
            'data-testid': 'native-picker',
            onClick: () => {
              if (typeof props.onChange === 'function') {
                props.onChange({ type: 'dismissed' }, undefined);
              }
            },
          }),
        );

        renderWithTheme(
          <DatePickerInput
            label="Date"
            value=""
            onChange={onChange}
            onClose={onClose}
            placeholder="Select a date"
          />,
        );
        fireEvent.click(screen.getByRole('button', { name: 'Date' }));
        fireEvent.click(screen.getByTestId('native-picker'));

        expect(onClose).toHaveBeenCalledTimes(1);
        expect(onChange).not.toHaveBeenCalled();
      });
    });
  });

  describe('GIVEN a disabled DatePickerInput with placeholder', () => {
    describe('WHEN the trigger is pressed', () => {
      it('THEN onOpen is NOT called', () => {
        const onOpen = jest.fn();

        renderWithTheme(
          <DatePickerInput
            label="Date"
            value=""
            onChange={() => {}}
            placeholder="Select a date"
            onOpen={onOpen}
            disabled
          />,
        );
        const button = screen.getByRole('button', { name: 'Date' });

        fireEvent.click(button);

        expect(onOpen).not.toHaveBeenCalled();
      });
    });
  });
});

describe('DatePickerInput (controlled open state)', () => {
  beforeEach(() => {
    MockDateTimePicker.mockClear();
  });

  describe('GIVEN a controlled DatePickerInput with isOpen=true and placeholder', () => {
    describe('WHEN rendered', () => {
      it('THEN the native picker is visible without user interaction', () => {
        renderWithTheme(
          <DatePickerInput
            label="Date"
            value=""
            onChange={() => {}}
            placeholder="Select a date"
            isOpen={true}
            onOpen={() => {}}
            onClose={() => {}}
          />,
        );

        expect(screen.getByTestId('native-picker')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a controlled DatePickerInput with isOpen=false', () => {
    describe('WHEN rendered', () => {
      it('THEN the native picker is NOT visible', () => {
        renderWithTheme(
          <DatePickerInput
            label="Date"
            value=""
            onChange={() => {}}
            placeholder="Select a date"
            isOpen={false}
            onOpen={() => {}}
            onClose={() => {}}
          />,
        );

        expect(screen.queryByTestId('native-picker')).not.toBeInTheDocument();
      });
    });
  });
});
