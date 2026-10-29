import type React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export type DatePickerMode = 'date' | 'time' | 'datetime';

export interface DatePickerInputProps {
  label?: string;
  /**
   * Current value as a formatted string.
   * - `'date'` mode: ISO date `YYYY-MM-DD`
   * - `'time'` mode: `HH:MM`
   * - `'datetime'` mode: ISO datetime `YYYY-MM-DDTHH:MM`
   *
   * Pass an empty string to indicate no selection (shows `placeholder` if set).
   */
  value: string;
  onChange: (value: string) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  containerStyle?: StyleProp<ViewStyle>;
  error?: string;
  /** @default false */
  required?: boolean;
  /** @default `NativeUIConfig.locale` */
  locale?: string;
  icon?: React.ReactNode;
  /** @default 'date' */
  mode?: DatePickerMode;
  /** @default false */
  disabled?: boolean;
  placeholder?: string;
  /** Test ID of the root; the trigger receives `{testID}-trigger`, the clear button `{testID}-clear`. */
  testID?: string;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  /** @default false */
  clearable?: boolean;
  onClear?: () => void;
  /**
   * Accessible name of the clear button.
   * @default labels.clear from `NativeUIConfig.labels`
   */
  clearAccessibilityLabel?: string;
}
