import { useEffect } from 'react';
import { useTheme } from '../theme';
import { FieldFrame } from './field/FieldFrame';
import { emitPeerWarning } from './datePicker/datePickerNative';
import { useDatePickerModel } from './datePicker/useDatePickerModel';
import { DatePickerControl } from './datePicker/datePickerVariants';
import type { DatePickerInputProps } from './datePicker/types';
export type { DatePickerMode, DatePickerInputProps } from './datePicker/types';

/**
 * Date, time or date-time field backed by `@react-native-community/datetimepicker`
 * (an optional peer). iOS shows the inline compact picker, Android opens the
 * system dialogs; without the peer it renders the formatted value read-only.
 *
 * @example
 * ```tsx
 * <DatePickerInput label="Due" value={due} onChange={setDue} placeholder="Pick a day" clearable />
 * ```
 */
export function DatePickerInput(props: DatePickerInputProps) {
  const theme = useTheme();
  const model = useDatePickerModel(props);

  useEffect(emitPeerWarning, []);

  return (
    <FieldFrame
      label={props.label}
      required={props.required}
      error={props.error}
      style={[
        { marginBottom: theme.components.datePicker.containerMarginBottom },
        model.disabled ? { opacity: theme.opacity.disabled } : undefined,
        props.containerStyle,
      ]}
      testID={props.testID}
    >
      <DatePickerControl model={model} />
    </FieldFrame>
  );
}
