/**
 * This test file mocks @react-native-community/datetimepicker to exercise
 * the native picker branches that are unreachable when the peer dependency
 * is absent (the standard test environment).
 *
 * Platform.OS is 'ios' by default in our mock. On iOS:
 *  - With a value → compact picker renders inline (no trigger button)
 *  - With empty value + placeholder → TriggerRow renders, pressing opens picker
 */
import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithTheme } from '../test-utils';

/* Mock the native picker module BEFORE importing DatePickerInput. */
type PickerProps = Record<string, unknown>;

const MockDateTimePicker = jest.fn<React.ReactElement, [PickerProps]>((props) => {
  return React.createElement('button', {
    'data-testid': 'native-picker',
    'data-mode': props.mode,
    'data-display': props.display,
    onClick: () => {
      if (typeof props.onChange === 'function') {
        props.onChange({ type: 'set' }, new Date(2025, 5, 15, 10, 30));
      }
    },
  });
});

jest.mock(
  '@react-native-community/datetimepicker',
  () => ({
    __esModule: true,
    default: MockDateTimePicker,
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

describe('DatePickerInput (Android-specific behavior)', () => {
  const originalPlatform = require('react-native').Platform;

  beforeEach(() => {
    MockDateTimePicker.mockClear();
    require('react-native').Platform.OS = 'android';
  });

  afterEach(() => {
    require('react-native').Platform.OS = originalPlatform.OS;
  });

  describe('GIVEN a DatePickerInput with a value on Android', () => {
    describe('WHEN rendered', () => {
      it('THEN a button trigger row is rendered (not inline picker)', () => {
        renderWithTheme(<DatePickerInput label="Date" value="2025-01-15" onChange={() => {}} />);

        expect(screen.getByRole('button', { name: 'Date' })).toBeInTheDocument();
        /* AND native picker is NOT shown until opened */
        expect(screen.queryByTestId('native-picker')).not.toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a DatePickerInput on Android', () => {
    describe('WHEN the trigger is pressed', () => {
      it('THEN the native picker dialog appears', () => {
        renderWithTheme(<DatePickerInput label="Date" value="2025-01-15" onChange={() => {}} />);
        fireEvent.click(screen.getByRole('button', { name: 'Date' }));

        expect(screen.getByTestId('native-picker')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a DatePickerInput in date mode on Android', () => {
    describe('WHEN the trigger is pressed and a date is selected', () => {
      it('THEN onChange is called with the formatted date', () => {
        const onChange = jest.fn();

        renderWithTheme(<DatePickerInput label="Date" value="2025-01-15" onChange={onChange} />);
        fireEvent.click(screen.getByRole('button', { name: 'Date' }));
        fireEvent.click(screen.getByTestId('native-picker'));

        expect(onChange).toHaveBeenCalledWith('2025-06-15');
      });
    });
  });

  describe('GIVEN a DatePickerInput with onClose on Android', () => {
    describe('WHEN the trigger is pressed and a selection is made', () => {
      it('THEN onClose is called', () => {
        const onClose = jest.fn();

        renderWithTheme(
          <DatePickerInput label="Date" value="2025-01-15" onChange={() => {}} onClose={onClose} />,
        );
        fireEvent.click(screen.getByRole('button', { name: 'Date' }));
        fireEvent.click(screen.getByTestId('native-picker'));

        expect(onClose).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('GIVEN a DatePickerInput on Android', () => {
    describe('WHEN the picker is opened and then dismissed', () => {
      it('THEN onClose is called but onChange is NOT', () => {
        const onChange = jest.fn();
        const onClose = jest.fn();

        /* Mock picker to simulate dismiss */
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
          <DatePickerInput label="Date" value="2025-01-15" onChange={onChange} onClose={onClose} />,
        );
        fireEvent.click(screen.getByRole('button', { name: 'Date' }));
        fireEvent.click(screen.getByTestId('native-picker'));

        expect(onClose).toHaveBeenCalledTimes(1);
        expect(onChange).not.toHaveBeenCalled();
      });
    });
  });

  describe('GIVEN a DatePickerInput in datetime mode on Android', () => {
    describe('WHEN the trigger is pressed to start the flow step 1 is completed (user picks a date) step 2 is completed (user picks a time)', () => {
      it('THEN step 1: date picker is shown onChange is NOT yet called (waiting for time step) onChange is called with the full datetime', () => {
        const onChange = jest.fn();
        let callCount = 0;

        /* Mock picker to simulate two-step: first returns a date, second returns a time */
        MockDateTimePicker.mockImplementation((props: Record<string, unknown>) =>
          React.createElement('button', {
            'data-testid': 'native-picker',
            'data-mode': props.mode,
            onClick: () => {
              callCount++;

              if (typeof props.onChange !== 'function') {
                return;
              }

              /* The first press picks the date, the second one the time. */
              const isDateStep = callCount === 1;
              const picked = isDateStep
                ? new Date(2025, 5, 20, 0, 0)
                : new Date(2025, 5, 20, 16, 45);
              props.onChange({ type: 'set' }, picked);
            },
          }),
        );

        renderWithTheme(
          <DatePickerInput
            label="Event"
            value="2025-01-01T09:00"
            onChange={onChange}
            mode="datetime"
          />,
        );
        fireEvent.click(screen.getByRole('button', { name: 'Event' }));

        const picker1 = screen.getByTestId('native-picker');

        expect(picker1).toHaveAttribute('data-mode', 'date');

        fireEvent.click(picker1);

        expect(onChange).not.toHaveBeenCalled();

        /* AND step 2: time picker is shown */
        const picker2 = screen.getByTestId('native-picker');

        expect(picker2).toHaveAttribute('data-mode', 'time');

        fireEvent.click(picker2);

        expect(onChange).toHaveBeenCalledWith('2025-06-20T16:45');
      });
    });

    describe('WHEN the datetime flow starts', () => {
      it('THEN onChange is called with date + midnight (fallback)', () => {
        const onChange = jest.fn();
        let callCount = 0;

        /* Mock picker: first call picks date, second call dismisses time */
        MockDateTimePicker.mockImplementation((props: Record<string, unknown>) =>
          React.createElement('button', {
            'data-testid': 'native-picker',
            'data-mode': props.mode,
            onClick: () => {
              callCount++;

              if (typeof props.onChange !== 'function') {
                return;
              }

              /* The first press picks the date, the second one dismisses the time picker. */
              if (callCount === 1) {
                props.onChange({ type: 'set' }, new Date(2025, 5, 20, 14, 0));

                return;
              }

              props.onChange({ type: 'dismissed' }, undefined);
            },
          }),
        );

        renderWithTheme(
          <DatePickerInput
            label="Event"
            value="2025-01-01T09:00"
            onChange={onChange}
            mode="datetime"
          />,
        );
        fireEvent.click(screen.getByRole('button', { name: 'Event' }));

        /* Step 1: select date */
        fireEvent.click(screen.getByTestId('native-picker'));
        expect(onChange).not.toHaveBeenCalled();

        /* Step 2: dismiss time */
        fireEvent.click(screen.getByTestId('native-picker'));

        expect(onChange).toHaveBeenCalledWith('2025-06-20T00:00');
      });
    });
  });
});
