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

// Mock the native picker module BEFORE importing DatePickerInput.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MockDateTimePicker: jest.Mock<any, any> = jest.fn((props: Record<string, unknown>) => {
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

  it('should render the native picker inline when value is set on iOS', () => {
    // GIVEN a DatePickerInput with a value on iOS (compact mode)

    // WHEN rendered
    renderWithTheme(<DatePickerInput label="Date" value="2025-01-15" onChange={() => {}} />);

    // THEN the native picker is rendered immediately (no trigger press needed)
    expect(screen.getByTestId('native-picker')).toBeInTheDocument();
    expect(screen.getByTestId('native-picker')).toHaveAttribute('data-display', 'compact');
  });

  it('should call onChange with formatted date when iOS picker selects a value', () => {
    // GIVEN a DatePickerInput with a value on iOS
    const onChange = jest.fn();

    // WHEN rendered and the native picker fires onChange
    renderWithTheme(<DatePickerInput label="Date" value="2025-01-15" onChange={onChange} />);
    fireEvent.click(screen.getByTestId('native-picker'));

    // THEN onChange is called with the formatted date
    expect(onChange).toHaveBeenCalledWith('2025-06-15');
  });

  it('should pass mode=time to native picker in time mode', () => {
    // GIVEN a DatePickerInput in time mode on iOS

    // WHEN rendered
    renderWithTheme(<DatePickerInput label="Time" value="14:30" onChange={() => {}} mode="time" />);

    // THEN the native picker has mode=time
    expect(screen.getByTestId('native-picker')).toHaveAttribute('data-mode', 'time');
  });

  it('should pass mode=datetime to native picker in datetime mode on iOS', () => {
    // GIVEN a DatePickerInput in datetime mode on iOS (iOS supports native datetime)

    // WHEN rendered
    renderWithTheme(
      <DatePickerInput
        label="Event"
        value="2025-06-15T14:00"
        onChange={() => {}}
        mode="datetime"
      />,
    );

    // THEN the native picker has mode=datetime
    expect(screen.getByTestId('native-picker')).toHaveAttribute('data-mode', 'datetime');
  });

  it('should render clear button alongside compact picker when clearable', () => {
    // GIVEN a clearable DatePickerInput with a value on iOS

    // WHEN rendered
    renderWithTheme(
      <DatePickerInput label="Date" value="2025-01-15" onChange={() => {}} clearable />,
    );

    // THEN the clear button is present
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
  });

  it('should call onClear when clear button is pressed in compact mode', () => {
    // GIVEN a clearable DatePickerInput with onClear callback
    const onClear = jest.fn();

    // WHEN the clear button is pressed
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

    // THEN onClear is called
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('should block pointer events when disabled on iOS compact mode', () => {
    // GIVEN a disabled DatePickerInput on iOS

    // WHEN rendered
    const { container } = renderWithTheme(
      <DatePickerInput
        label="Date"
        value="2025-01-15"
        onChange={() => {}}
        disabled
        testID="disabled-ios"
      />,
    );

    // THEN the outer container has reduced opacity
    const outer = container.querySelector('[testid="disabled-ios"]') as HTMLElement;

    expect(outer.style.opacity).toBe('0.5');
  });
});

describe('DatePickerInput (native picker - iOS placeholder mode)', () => {
  beforeEach(() => {
    MockDateTimePicker.mockClear();
  });

  it('should render a trigger row with placeholder text when value is empty', () => {
    // GIVEN a DatePickerInput with empty value and a placeholder on iOS

    // WHEN rendered
    renderWithTheme(
      <DatePickerInput label="Date" value="" onChange={() => {}} placeholder="Select a date" />,
    );

    // THEN the placeholder text is shown in a pressable trigger
    expect(screen.getByText('Select a date')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Date' })).toBeInTheDocument();
  });

  it('should NOT show native picker until trigger is pressed', () => {
    // GIVEN a DatePickerInput with placeholder on iOS

    // WHEN rendered (before interaction)
    renderWithTheme(
      <DatePickerInput label="Date" value="" onChange={() => {}} placeholder="Select a date" />,
    );

    // THEN the native picker is NOT yet visible
    expect(screen.queryByTestId('native-picker')).not.toBeInTheDocument();
  });

  it('should show native picker with display=default after pressing trigger', () => {
    // GIVEN a DatePickerInput with placeholder on iOS

    // WHEN the trigger is pressed
    renderWithTheme(
      <DatePickerInput label="Date" value="" onChange={() => {}} placeholder="Select a date" />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Date' }));

    // THEN the native picker appears with display=default
    expect(screen.getByTestId('native-picker')).toBeInTheDocument();
    expect(screen.getByTestId('native-picker')).toHaveAttribute('data-display', 'default');
  });

  it('should call onOpen when trigger is pressed in placeholder mode', () => {
    // GIVEN a DatePickerInput with placeholder and onOpen
    const onOpen = jest.fn();

    // WHEN the trigger is pressed
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

    // THEN onOpen is called
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it('should call onChange and onClose when a date is selected via placeholder picker', () => {
    // GIVEN a DatePickerInput with placeholder and callbacks
    const onChange = jest.fn();
    const onClose = jest.fn();

    // WHEN the trigger is pressed and a date is selected
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

    // THEN onChange is called with the selected date
    expect(onChange).toHaveBeenCalledWith('2025-06-15');
    // AND onClose is called
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose without onChange when iOS placeholder picker is dismissed', () => {
    // GIVEN a DatePickerInput with placeholder
    const onChange = jest.fn();
    const onClose = jest.fn();

    // Override mock to simulate dismiss
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

    // WHEN the trigger is pressed and the picker is dismissed
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

    // THEN onClose is called but onChange is NOT
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should NOT open picker when disabled in placeholder mode', () => {
    // GIVEN a disabled DatePickerInput with placeholder
    const onOpen = jest.fn();

    // WHEN the trigger is pressed
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

    // THEN onOpen is NOT called
    expect(onOpen).not.toHaveBeenCalled();
  });
});

describe('DatePickerInput (controlled open state)', () => {
  beforeEach(() => {
    MockDateTimePicker.mockClear();
  });

  it('should show native picker immediately when isOpen=true and placeholder mode', () => {
    // GIVEN a controlled DatePickerInput with isOpen=true and placeholder

    // WHEN rendered
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

    // THEN the native picker is visible without user interaction
    expect(screen.getByTestId('native-picker')).toBeInTheDocument();
  });

  it('should NOT show native picker when isOpen=false and placeholder mode', () => {
    // GIVEN a controlled DatePickerInput with isOpen=false

    // WHEN rendered
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

    // THEN the native picker is NOT visible
    expect(screen.queryByTestId('native-picker')).not.toBeInTheDocument();
  });
});

describe('DatePickerInput (Android-specific behavior)', () => {
  const originalPlatform = require('react-native').Platform;

  beforeEach(() => {
    MockDateTimePicker.mockClear();
    // Override Platform.OS to 'android' for this describe block
    require('react-native').Platform.OS = 'android';
  });

  afterEach(() => {
    // Restore Platform.OS
    require('react-native').Platform.OS = originalPlatform.OS;
  });

  it('should render a trigger row (not inline picker) on Android', () => {
    // GIVEN a DatePickerInput with a value on Android

    // WHEN rendered
    renderWithTheme(<DatePickerInput label="Date" value="2025-01-15" onChange={() => {}} />);

    // THEN a button trigger row is rendered (not inline picker)
    expect(screen.getByRole('button', { name: 'Date' })).toBeInTheDocument();
    // AND native picker is NOT shown until opened
    expect(screen.queryByTestId('native-picker')).not.toBeInTheDocument();
  });

  it('should show native picker dialog when trigger is pressed on Android', () => {
    // GIVEN a DatePickerInput on Android

    // WHEN the trigger is pressed
    renderWithTheme(<DatePickerInput label="Date" value="2025-01-15" onChange={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Date' }));

    // THEN the native picker dialog appears
    expect(screen.getByTestId('native-picker')).toBeInTheDocument();
  });

  it('should call onChange with date string when Android picker confirms selection', () => {
    // GIVEN a DatePickerInput in date mode on Android
    const onChange = jest.fn();

    // WHEN the trigger is pressed and a date is selected
    renderWithTheme(<DatePickerInput label="Date" value="2025-01-15" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Date' }));
    fireEvent.click(screen.getByTestId('native-picker'));

    // THEN onChange is called with the formatted date
    expect(onChange).toHaveBeenCalledWith('2025-06-15');
  });

  it('should call onClose when Android picker confirms selection', () => {
    // GIVEN a DatePickerInput with onClose on Android
    const onClose = jest.fn();

    // WHEN the trigger is pressed and a selection is made
    renderWithTheme(
      <DatePickerInput label="Date" value="2025-01-15" onChange={() => {}} onClose={onClose} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Date' }));
    fireEvent.click(screen.getByTestId('native-picker'));

    // THEN onClose is called
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should handle dismiss without calling onChange on Android', () => {
    // GIVEN a DatePickerInput on Android
    const onChange = jest.fn();
    const onClose = jest.fn();

    // Mock picker to simulate dismiss
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

    // WHEN the picker is opened and then dismissed
    renderWithTheme(
      <DatePickerInput label="Date" value="2025-01-15" onChange={onChange} onClose={onClose} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Date' }));
    fireEvent.click(screen.getByTestId('native-picker'));

    // THEN onClose is called but onChange is NOT
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should handle Android datetime two-step: date → time → final value', () => {
    // GIVEN a DatePickerInput in datetime mode on Android
    const onChange = jest.fn();
    let callCount = 0;

    // Mock picker to simulate two-step: first returns a date, second returns a time
    MockDateTimePicker.mockImplementation((props: Record<string, unknown>) =>
      React.createElement('button', {
        'data-testid': 'native-picker',
        'data-mode': props.mode,
        onClick: () => {
          callCount++;
          if (typeof props.onChange === 'function') {
            if (callCount === 1) {
              // Step 1: user picks a date
              props.onChange({ type: 'set' }, new Date(2025, 5, 20, 0, 0));
            } else {
              // Step 2: user picks a time
              props.onChange({ type: 'set' }, new Date(2025, 5, 20, 16, 45));
            }
          }
        },
      }),
    );

    // WHEN the trigger is pressed to start the flow
    renderWithTheme(
      <DatePickerInput
        label="Event"
        value="2025-01-01T09:00"
        onChange={onChange}
        mode="datetime"
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Event' }));

    // THEN step 1: date picker is shown
    const picker1 = screen.getByTestId('native-picker');

    expect(picker1).toHaveAttribute('data-mode', 'date');

    // WHEN step 1 is completed (user picks a date)
    fireEvent.click(picker1);

    // THEN onChange is NOT yet called (waiting for time step)
    expect(onChange).not.toHaveBeenCalled();

    // AND step 2: time picker is shown
    const picker2 = screen.getByTestId('native-picker');

    expect(picker2).toHaveAttribute('data-mode', 'time');

    // WHEN step 2 is completed (user picks a time)
    fireEvent.click(picker2);

    // THEN onChange is called with the full datetime
    expect(onChange).toHaveBeenCalledWith('2025-06-20T16:45');
  });

  it('should emit partial value (date + midnight) when time step is dismissed in datetime mode', () => {
    // GIVEN a DatePickerInput in datetime mode on Android
    const onChange = jest.fn();
    let callCount = 0;

    // Mock picker: first call picks date, second call dismisses time
    MockDateTimePicker.mockImplementation((props: Record<string, unknown>) =>
      React.createElement('button', {
        'data-testid': 'native-picker',
        'data-mode': props.mode,
        onClick: () => {
          callCount++;
          if (typeof props.onChange === 'function') {
            if (callCount === 1) {
              // Step 1: user picks a date
              props.onChange({ type: 'set' }, new Date(2025, 5, 20, 14, 0));
            } else {
              // Step 2: user dismisses the time picker
              props.onChange({ type: 'dismissed' }, undefined);
            }
          }
        },
      }),
    );

    // WHEN the datetime flow starts
    renderWithTheme(
      <DatePickerInput
        label="Event"
        value="2025-01-01T09:00"
        onChange={onChange}
        mode="datetime"
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Event' }));

    // Step 1: select date
    fireEvent.click(screen.getByTestId('native-picker'));
    expect(onChange).not.toHaveBeenCalled();

    // Step 2: dismiss time
    fireEvent.click(screen.getByTestId('native-picker'));

    // THEN onChange is called with date + midnight (fallback)
    expect(onChange).toHaveBeenCalledWith('2025-06-20T00:00');
  });
});
