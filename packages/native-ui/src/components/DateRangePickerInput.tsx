import React, { useCallback, useRef } from 'react';
import { StyleSheet, View, Text, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { FieldLabel } from './FieldLabel';
import { DatePickerInput, type DatePickerInputProps } from './DatePickerInput';
import { resolveRangeBounds, type DateRangeBounds } from './datePicker/rangeBounds';

/**
 * Value tuple for {@link DateRangePickerInput}.
 * Both fields use the ISO date format `YYYY-MM-DD`.
 */
export interface DateRangeValue {
  start: string;
  end: string;
}

export interface DateRangePickerInputProps {
  /** Label displayed above the range picker in uppercase. */
  label?: string;
  /** Current range value with `start` and `end` as ISO date strings (`YYYY-MM-DD`). */
  value: DateRangeValue;
  /** Called with the updated range when either date changes. */
  onChange: (range: DateRangeValue) => void;
  /** Earliest selectable date for both pickers. */
  minimumDate?: Date;
  /** Latest selectable date for both pickers. */
  maximumDate?: Date;
  /** Additional styles applied to the outer wrapper. */
  containerStyle?: StyleProp<ViewStyle>;
  /** Error message for the start date picker. */
  startError?: string;
  /** Error message for the end date picker. */
  endError?: string;
  /** Shows a required asterisk next to the label. @default false */
  required?: boolean;
  /**
   * Locale string forwarded to both date pickers.
   * @default `NativeUIConfig.locale`
   */
  locale?: string;
  /** Icon rendered inside the start date picker. */
  startIcon?: React.ReactNode;
  /** Icon rendered inside the end date picker. */
  endIcon?: React.ReactNode;
  /**
   * Label for the start date picker.
   * @default labels.rangeStart
   */
  startLabel?: string;
  /**
   * Label for the end date picker.
   * @default labels.rangeEnd
   */
  endLabel?: string;
  /** Placeholder for the start date picker when its value is empty. */
  startPlaceholder?: string;
  /** Placeholder for the end date picker when its value is empty. */
  endPlaceholder?: string;
  /**
   * Disables both pickers.
   * @default false
   */
  disabled?: boolean;
  /** Test ID - individual pickers receive `{testID}-start` and `{testID}-end`. */
  testID?: string;
  /**
   * Shows a clear button on each picker when a value is present.
   * @default false
   */
  clearable?: boolean;
}

type RangeEndpoint = 'start' | 'end';
type EndpointProps = Record<RangeEndpoint, DatePickerInputProps>;

/**
 * Change handlers read the latest range from a ref so each keeps a stable
 * identity while still merging into the current value of the other endpoint.
 */
function useEndpointChangeHandlers(
  value: DateRangeValue,
  onChange: (range: DateRangeValue) => void,
): Record<RangeEndpoint, (date: string) => void> {
  const valueRef = useRef(value);
  valueRef.current = value;

  const start = useCallback(
    (date: string) => onChange({ ...valueRef.current, start: date }),
    [onChange],
  );
  const end = useCallback(
    (date: string) => onChange({ ...valueRef.current, end: date }),
    [onChange],
  );

  return { start, end };
}

function childTestID(testID: string | undefined, endpoint: RangeEndpoint): string | undefined {
  return testID ? `${testID}-${endpoint}` : undefined;
}

/** Props both endpoint pickers receive unchanged. */
function sharedEndpointProps(props: DateRangePickerInputProps) {
  return {
    locale: props.locale,
    disabled: props.disabled,
    clearable: props.clearable,
    containerStyle: styles.innerPicker,
  };
}

/** Start picker: bounded above by the end date. */
function startEndpointProps(
  props: DateRangePickerInputProps,
  bounds: DateRangeBounds,
  label: string,
) {
  return {
    label: props.startLabel ?? label,
    value: props.value.start,
    minimumDate: props.minimumDate,
    maximumDate: bounds.startMax,
    error: props.startError,
    icon: props.startIcon,
    placeholder: props.startPlaceholder,
    testID: childTestID(props.testID, 'start'),
  };
}

/** End picker: bounded below by the start date. */
function endEndpointProps(
  props: DateRangePickerInputProps,
  bounds: DateRangeBounds,
  label: string,
) {
  return {
    label: props.endLabel ?? label,
    value: props.value.end,
    minimumDate: bounds.endMin,
    maximumDate: props.maximumDate,
    error: props.endError,
    icon: props.endIcon,
    placeholder: props.endPlaceholder,
    testID: childTestID(props.testID, 'end'),
  };
}

function useEndpointProps(props: DateRangePickerInputProps): EndpointProps {
  const labels = useTheme().labels;
  const handlers = useEndpointChangeHandlers(props.value, props.onChange);
  const bounds = resolveRangeBounds(props.value, props.minimumDate, props.maximumDate);
  const shared = sharedEndpointProps(props);

  return {
    start: {
      ...shared,
      ...startEndpointProps(props, bounds, labels.rangeStart),
      onChange: handlers.start,
    },
    end: { ...shared, ...endEndpointProps(props, bounds, labels.rangeEnd), onChange: handlers.end },
  };
}

function RangeSeparator() {
  const theme = useTheme();
  const tokens = theme.components.dateRangePicker;

  return (
    <View
      style={[
        styles.separator,
        {
          paddingHorizontal: tokens.separatorPaddingHorizontal,
          paddingTop: tokens.separatorOffsetTop,
        },
      ]}
    >
      <Text
        style={[theme.typography.body, { color: theme.colors.textTertiary }]}
        accessibilityElementsHidden
        importantForAccessibility="no"
      >
        {theme.labels.rangeSeparator}
      </Text>
    </View>
  );
}

/**
 * A date-range input composed of two {@link DatePickerInput} pickers displayed
 * side-by-side.
 *
 * The start date automatically constrains the end picker's minimum, and the
 * end date constrains the start picker's maximum - preventing the user from
 * selecting an invalid range.
 *
 * @example
 * ```tsx
 * <DateRangePickerInput
 *   label="Booking period"
 *   value={{ start: '2025-06-01', end: '2025-06-14' }}
 *   onChange={setRange}
 *   startPlaceholder="Check-in"
 *   endPlaceholder="Check-out"
 * />
 * ```
 */
export function DateRangePickerInput(props: DateRangePickerInputProps) {
  const { label, required, containerStyle, testID } = props;
  const theme = useTheme();
  const endpoints = useEndpointProps(props);

  return (
    <View
      style={[
        { marginBottom: theme.components.dateRangePicker.containerMarginBottom },
        containerStyle,
      ]}
      testID={testID}
    >
      {label && <FieldLabel label={label} required={required} />}
      <View style={styles.row}>
        <View style={styles.half}>
          <DatePickerInput {...endpoints.start} />
        </View>
        <RangeSeparator />
        <View style={styles.half}>
          <DatePickerInput {...endpoints.end} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  half: {
    flex: 1,
  },
  separator: {
    justifyContent: 'center',
  },
  innerPicker: {
    marginBottom: 0,
  },
});
