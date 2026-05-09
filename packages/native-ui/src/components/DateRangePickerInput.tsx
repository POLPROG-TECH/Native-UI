import React, { useCallback, useRef } from 'react';
import { StyleSheet, View, Text, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { FieldLabel } from './FieldLabel';
import { DatePickerInput } from './DatePickerInput';
import { parseValue } from './datePickerUtils';

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
  containerStyle?: ViewStyle;
  /** Error message for the start date picker. */
  startError?: string;
  /** Error message for the end date picker. */
  endError?: string;
  /** Shows a required asterisk next to the label. @default false */
  required?: boolean;
  /**
   * Locale string forwarded to both date pickers.
   * @default 'en-US'
   */
  locale?: string;
  /** Icon rendered inside the start date picker. */
  startIcon?: React.ReactNode;
  /** Icon rendered inside the end date picker. */
  endIcon?: React.ReactNode;
  /**
   * Label for the start date picker.
   * @default 'Start'
   */
  startLabel?: string;
  /**
   * Label for the end date picker.
   * @default 'End'
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
   * Shows a clear (✕) button on each picker when a value is present.
   * @default false
   */
  clearable?: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseDateSafe(str: string): Date | undefined {
  if (!str) return undefined;

  const date = parseValue(str, 'date');

  return isNaN(date.getTime()) ? undefined : date;
}

function laterDate(a: Date | undefined, b: Date | undefined): Date | undefined {
  if (!a) return b;
  if (!b) return a;

  return a > b ? a : b;
}

function earlierDate(a: Date | undefined, b: Date | undefined): Date | undefined {
  if (!a) return b;
  if (!b) return a;

  return a < b ? a : b;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

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
export function DateRangePickerInput({
  label,
  value,
  onChange,
  minimumDate,
  maximumDate,
  containerStyle,
  startError,
  endError,
  required,
  locale,
  startIcon,
  endIcon,
  startLabel = 'Start',
  endLabel = 'End',
  startPlaceholder,
  endPlaceholder,
  disabled,
  testID,
  clearable,
}: DateRangePickerInputProps) {
  const theme = useTheme();

  const valueRef = useRef(value);
  valueRef.current = value;

  const startDate = parseDateSafe(value.start);
  const endDate = parseDateSafe(value.end);

  // Cross-constraints clamped against the global bounds
  const startMax = earlierDate(endDate, maximumDate);
  const endMin = laterDate(startDate, minimumDate);

  const handleStartChange = useCallback(
    (start: string) => onChange({ ...valueRef.current, start }),
    [onChange],
  );

  const handleEndChange = useCallback(
    (end: string) => onChange({ ...valueRef.current, end }),
    [onChange],
  );

  return (
    <View style={[styles.container, containerStyle]} testID={testID}>
      {label && <FieldLabel label={label} required={required} />}
      <View style={styles.row}>
        <View style={styles.half}>
          <DatePickerInput
            label={startLabel}
            value={value.start}
            onChange={handleStartChange}
            minimumDate={minimumDate}
            maximumDate={startMax}
            error={startError}
            locale={locale}
            icon={startIcon}
            placeholder={startPlaceholder}
            disabled={disabled}
            clearable={clearable}
            containerStyle={styles.innerPicker}
            testID={testID ? `${testID}-start` : undefined}
          />
        </View>
        <View style={styles.separator}>
          <Text style={[theme.typography.body, { color: theme.colors.textTertiary }]}>-</Text>
        </View>
        <View style={styles.half}>
          <DatePickerInput
            label={endLabel}
            value={value.end}
            onChange={handleEndChange}
            minimumDate={endMin}
            maximumDate={maximumDate}
            error={endError}
            locale={locale}
            icon={endIcon}
            placeholder={endPlaceholder}
            disabled={disabled}
            clearable={clearable}
            containerStyle={styles.innerPicker}
            testID={testID ? `${testID}-end` : undefined}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  half: {
    flex: 1,
  },
  separator: {
    paddingHorizontal: 8,
    // Offset aligns the dash with picker inputs (below their labels)
    paddingTop: 22,
    justifyContent: 'center',
  },
  innerPicker: {
    marginBottom: 0,
  },
});
