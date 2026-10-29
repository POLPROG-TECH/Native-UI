import type { StyleProp, ViewStyle } from 'react-native';
import type { IconSlot } from '../../primitives/iconSlot';

export interface SelectOption<T extends string = string> {
  /** Human-readable label shown in the dropdown list. */
  label: string;
  /** Unique value representing this option. */
  value: T;
  /**
   * Optional leading icon. Pass a render function `({ color, size }) => node`
   * to follow the theme (`textSecondary`, or `primaryText` when selected, at
   * `select.optionIconSize`); a React node or an emoji string also works.
   */
  icon?: IconSlot;
}

export interface SelectProps<T extends string = string> {
  /** Label displayed above the trigger in uppercase. */
  label?: string;
  /** The currently selected value, or `null` when nothing is selected. */
  value?: T | null;
  /** Array of options displayed in the dropdown list. */
  options: SelectOption<T>[];
  /** Callback fired when the user picks an option. Receives the selected `value`. */
  onChange?: (value: T) => void;
  /**
   * Placeholder text shown when no value is selected.
   * @default labels.selectPlaceholder from `NativeUIConfig.labels`
   */
  placeholder?: string;
  /**
   * Caption of the cancel row at the bottom of the option sheet.
   * @default labels.cancel
   */
  cancelLabel?: string;
  /**
   * Accessible name of the sheet backdrop.
   * @default labels.close
   */
  closeAccessibilityLabel?: string;
  /** Error message displayed below the trigger in the theme's error color. */
  error?: string;
  /**
   * Marks the field as required by appending a red asterisk to the label.
   * @default false
   */
  required?: boolean;
  /**
   * When `true`, dims the trigger and prevents opening the dropdown.
   * @default false
   */
  disabled?: boolean;
  /** Additional styles applied to the outer wrapper `View`. */
  containerStyle?: StyleProp<ViewStyle>;
  /** Identifies the field; the option sheet gets `${testID}-sheet`. */
  testID?: string;
}
