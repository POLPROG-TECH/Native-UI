import { useCallback } from 'react';
import { Platform } from 'react-native';
import type { DatePickerMode } from './types';
import { formatValue } from './datePickerUtils';
import {
  dispatchAndroidPickerChange,
  getNativePicker,
  type DatetimeFlowState,
  type PickerEvent,
  type PickerVisibility,
} from './datePickerNative';

type PickerChangeHandler = (event: PickerEvent, selectedDate?: Date) => void;

export interface DatePickerHandlerDeps {
  mode: DatePickerMode;
  disabled: boolean;
  picker: PickerVisibility;
  flow: DatetimeFlowState;
  onChange: (value: string) => void;
  onClear?: () => void;
}

export interface DatePickerHandlers {
  /** Android dialogs, including the two-step `datetime` flow. */
  androidChange: PickerChangeHandler;
  /** Inline picker: Android dialog routing, or the iOS compact picker. */
  nativeChange: PickerChangeHandler;
  /** iOS picker opened from the placeholder trigger; closes after a pick. */
  placeholderChange: PickerChangeHandler;
  open: () => void;
  clear: () => void;
}

/**
 * The flow is passed field by field so the callback only changes when the
 * flow state does, not on every render of the hook that owns it.
 */
function useAndroidChange({ mode, picker, flow, onChange }: DatePickerHandlerDeps) {
  const { isDateStep, isTimeStep, pendingDate, reset, advanceToTimeStep } = flow;

  return useCallback<PickerChangeHandler>(
    (event, selectedDate) =>
      dispatchAndroidPickerChange(event, selectedDate, {
        mode,
        datetimeFlow: { isDateStep, isTimeStep, pendingDate, reset, advanceToTimeStep },
        onChange,
        closePicker: picker.close,
      }),
    [mode, isDateStep, isTimeStep, pendingDate, reset, advanceToTimeStep, onChange, picker.close],
  );
}

function useIOSPlaceholderChange({ mode, picker, onChange }: DatePickerHandlerDeps) {
  const close = picker.close;

  return useCallback<PickerChangeHandler>(
    (event, selectedDate) => {
      if (event.type === 'dismissed') {
        close();

        return;
      }

      if (!selectedDate) {
        return;
      }

      onChange(formatValue(selectedDate, mode));
      close();
    },
    [onChange, mode, close],
  );
}

function useNativeChange(deps: DatePickerHandlerDeps, androidChange: PickerChangeHandler) {
  const { mode, onChange } = deps;

  return useCallback<PickerChangeHandler>(
    (event, selectedDate) => {
      if (Platform.OS === 'android') {
        androidChange(event, selectedDate);

        return;
      }

      if (selectedDate) {
        onChange(formatValue(selectedDate, mode));
      }
    },
    [androidChange, onChange, mode],
  );
}

/** Opening is a no-op while disabled or without the optional native picker. */
function useTriggerActions({ disabled, picker, flow, onChange, onClear }: DatePickerHandlerDeps) {
  const { reset } = flow;
  const openPicker = picker.open;

  const open = useCallback(() => {
    if (disabled || !getNativePicker()) {
      return;
    }

    reset();
    openPicker();
  }, [disabled, reset, openPicker]);

  const clear = useCallback(() => {
    if (onClear) {
      onClear();

      return;
    }

    onChange('');
  }, [onChange, onClear]);

  return { open, clear };
}

export function useDatePickerHandlers(deps: DatePickerHandlerDeps): DatePickerHandlers {
  const androidChange = useAndroidChange(deps);
  const nativeChange = useNativeChange(deps, androidChange);
  const placeholderChange = useIOSPlaceholderChange(deps);
  const { open, clear } = useTriggerActions(deps);

  return { androidChange, nativeChange, placeholderChange, open, clear };
}
