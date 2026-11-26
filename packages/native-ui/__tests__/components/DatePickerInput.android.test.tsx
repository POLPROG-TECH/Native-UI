/**
 * Android branches of the native date picker, with
 * @react-native-community/datetimepicker mocked (it is an optional peer and
 * absent from the test environment). iOS lives in
 * `DatePickerInput.native.test.tsx`.
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
