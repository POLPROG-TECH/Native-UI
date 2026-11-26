import React from 'react';

type PickerProps = Record<string, unknown>;

export const PICKED_DATE = new Date(2025, 5, 15, 10, 30);

/**
 * Stand-in for `@react-native-community/datetimepicker`, which is an optional
 * peer and absent from the test environment. It renders a button that carries
 * the `mode` and `display` it was given and, when clicked, reports
 * `PICKED_DATE` the way the native picker does.
 */
export const MockDateTimePicker = jest.fn<React.ReactElement, [PickerProps]>((props) => {
  return React.createElement('button', {
    'data-testid': 'native-picker',
    'data-mode': props.mode,
    'data-display': props.display,
    onClick: () => {
      if (typeof props.onChange === 'function') {
        props.onChange({ type: 'set' }, PICKED_DATE);
      }
    },
  });
});
