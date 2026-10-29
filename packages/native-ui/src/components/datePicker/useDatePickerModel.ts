import type React from 'react';
import { Platform } from 'react-native';
import { useTheme } from '../../theme';
import type { Theme } from '../../theme/types';
import type { DatePickerInputProps, DatePickerMode } from './types';
import { formatDisplay, parseValue } from './datePickerUtils';
import { useDatetimeFlow, usePickerVisibility } from './datePickerNative';
import { useDatePickerHandlers, type DatePickerHandlers } from './useDatePickerHandlers';
import type { ClearButtonProps } from './DatePickerTrigger';

/** Props after defaults, plus theme-derived values every picker variant needs. */
export interface DatePickerFieldConfig {
  mode: DatePickerMode;
  locale: string;
  disabled: boolean;
  label?: string;
  icon?: React.ReactNode;
  borderColor: string;
  themeVariant: 'dark' | 'light';
  /** Empty in `time` mode, where date bounds do not apply. */
  constraints: { minimumDate?: Date; maximumDate?: Date };
  triggerTestID?: string;
}

/** What the trigger shows for the current `value`. */
export interface DateValueView {
  /** Parsed value, or now when empty. */
  date: Date;
  hasValue: boolean;
  /** Empty value with a placeholder to show instead. */
  showPlaceholder: boolean;
  placeholderText: string;
  displayText: string;
}

export interface DatePickerModel extends DatePickerFieldConfig {
  view: DateValueView;
  handlers: DatePickerHandlers;
  isPickerVisible: boolean;
  /** Mode of the Android dialog currently shown (date step, then time step). */
  dialogMode: DatePickerMode;
  /** Value of the Android dialog; the time step starts from the picked day. */
  dialogValue: Date;
  /** Present when the clear button should render. */
  clear: ClearButtonProps | null;
}

function resolveFieldConfig(props: DatePickerInputProps, theme: Theme): DatePickerFieldConfig {
  const mode = props.mode ?? 'date';
  const { minimumDate, maximumDate, testID } = props;

  return {
    mode,
    locale: props.locale ?? theme.locale,
    disabled: props.disabled ?? false,
    label: props.label,
    icon: props.icon,
    borderColor: props.error ? theme.colors.error : theme.colors.controlBorder,
    themeVariant: theme.isDark ? 'dark' : 'light',
    constraints: mode === 'time' ? {} : { minimumDate, maximumDate },
    triggerTestID: testID ? `${testID}-trigger` : undefined,
  };
}

function describeDateValue(props: DatePickerInputProps, config: DatePickerFieldConfig) {
  const { value, placeholder } = props;
  const date = value ? parseValue(value, config.mode) : new Date();
  const hasValue = Boolean(value);
  const showPlaceholder = !hasValue && Boolean(placeholder);
  const placeholderText = placeholder ?? '';
  const displayText = showPlaceholder
    ? placeholderText
    : formatDisplay(date, config.locale, config.mode);

  return { date, hasValue, showPlaceholder, placeholderText, displayText };
}

/** Android has no combined dialog, so `datetime` alternates between date and time. */
function resolveDialogMode(mode: DatePickerMode, isDateStep: boolean): DatePickerMode {
  if (Platform.OS !== 'android' || mode !== 'datetime') {
    return mode;
  }

  return isDateStep ? 'date' : 'time';
}

function resolveClearButton(
  props: DatePickerInputProps,
  showClear: boolean,
  onPress: () => void,
  theme: Theme,
): ClearButtonProps | null {
  if (!showClear) {
    return null;
  }

  return {
    onPress,
    accessibilityLabel: props.clearAccessibilityLabel ?? theme.labels.clear,
    testID: props.testID ? `${props.testID}-clear` : undefined,
  };
}

/** Everything the DatePickerInput variants render from, derived from props and picker state. */
export function useDatePickerModel(props: DatePickerInputProps): DatePickerModel {
  const theme = useTheme();
  const config = resolveFieldConfig(props, theme);
  const picker = usePickerVisibility(props.isOpen, props.onOpen, props.onClose);
  const flow = useDatetimeFlow();
  const { mode, disabled } = config;
  const { onChange, onClear } = props;
  const handlers = useDatePickerHandlers({ mode, disabled, picker, flow, onChange, onClear });
  const view = describeDateValue(props, config);
  const showClear = Boolean(props.clearable) && view.hasValue && !config.disabled;

  return {
    ...config,
    view,
    handlers,
    isPickerVisible: picker.isVisible,
    dialogMode: resolveDialogMode(config.mode, flow.isDateStep),
    dialogValue: flow.isTimeStep && flow.pendingDate ? flow.pendingDate : view.date,
    clear: resolveClearButton(props, showClear, handlers.clear, theme),
  };
}
