import React, { useState, useCallback, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Platform, Pressable, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { FieldLabel } from './FieldLabel';
import { FieldError } from './FieldError';
import { parseValue, formatValue, formatDisplay } from './datePickerUtils';

// ---------------------------------------------------------------------------
// Native picker resolution (optional peer dependency)
// ---------------------------------------------------------------------------

type NativePickerComponent = React.ComponentType<Record<string, unknown>>;

type PickerEvent = { type: string };

let _nativePicker: NativePickerComponent | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  _nativePicker = require('@react-native-community/datetimepicker').default;
} catch {
  // Optional dependency - will render a read-only text fallback if missing.
}

let _peerWarningEmitted = false;

function shouldEmitPeerWarning(): boolean {
  return __DEV__ && !_nativePicker && !_peerWarningEmitted;
}

function emitPeerWarning(): void {
  if (!shouldEmitPeerWarning()) return;

  _peerWarningEmitted = true;

  // eslint-disable-next-line no-console
  console.warn(
    '[DatePickerInput] @react-native-community/datetimepicker is not installed. ' +
      'The component will render a read-only text fallback. ' +
      'Install it with: npx expo install @react-native-community/datetimepicker',
  );
}

function getNativePicker(): NativePickerComponent | null {
  return _nativePicker;
}

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

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
  containerStyle?: ViewStyle;
  error?: string;
  /** @default false */
  required?: boolean;
  /** @default 'en-US' */
  locale?: string;
  icon?: React.ReactNode;
  /** @default 'date' */
  mode?: DatePickerMode;
  /** @default false */
  disabled?: boolean;
  placeholder?: string;
  testID?: string;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  /** @default false */
  clearable?: boolean;
  onClear?: () => void;
}

// ---------------------------------------------------------------------------
// Sub-components (Single Responsibility)
// ---------------------------------------------------------------------------

interface TriggerRowProps {
  icon?: React.ReactNode;
  text: string;
  isPlaceholder: boolean;
  borderColor: string;
  disabled: boolean;
  label?: string;
  onPress: () => void;
  clearButton: React.ReactNode;
}

function TriggerRow({
  icon,
  text,
  isPlaceholder,
  borderColor,
  disabled,
  label,
  onPress,
  clearButton,
}: TriggerRowProps) {
  const theme = useTheme();

  const textColor = isPlaceholder ? theme.colors.textTertiary : theme.colors.textPrimary;

  return (
    <Pressable
      style={[
        styles.triggerRow,
        {
          backgroundColor: theme.colors.surfaceSecondary,
          borderColor,
          borderRadius: theme.borderRadius.md,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
      hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
    >
      {icon}
      <Text style={[theme.typography.body, { color: textColor, flex: 1 }]}>{text}</Text>
      {clearButton}
    </Pressable>
  );
}

interface ClearButtonProps {
  onPress: () => void;
}

function ClearButton({ onPress }: ClearButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel="Clear"
      style={styles.clearButton}
    >
      <Text style={[styles.clearIcon, { color: theme.colors.textTertiary }]}>✕</Text>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

function usePickerVisibility(
  controlledOpen: boolean | undefined,
  onOpen?: () => void,
  onClose?: () => void,
) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isVisible = isControlled ? controlledOpen : internalOpen;

  const open = useCallback(() => {
    if (!isControlled) setInternalOpen(true);

    onOpen?.();
  }, [isControlled, onOpen]);

  const close = useCallback(() => {
    if (!isControlled) setInternalOpen(false);

    onClose?.();
  }, [isControlled, onClose]);

  return { isVisible, open, close } as const;
}

function useDatetimeFlow() {
  const [step, setStep] = useState<'date' | 'time'>('date');
  const pendingDateRef = useRef<Date | null>(null);

  const reset = useCallback(() => {
    setStep('date');
    pendingDateRef.current = null;
  }, []);

  const advanceToTimeStep = useCallback((date: Date) => {
    pendingDateRef.current = date;
    setStep('time');
  }, []);

  const isDateStep = step === 'date';
  const isTimeStep = step === 'time';
  const pendingDate = pendingDateRef.current;

  return { step, isDateStep, isTimeStep, pendingDate, reset, advanceToTimeStep } as const;
}

// ---------------------------------------------------------------------------
// Android change handler helpers (flat guard-clause style)
// ---------------------------------------------------------------------------

interface DatetimeFlowState {
  isDateStep: boolean;
  isTimeStep: boolean;
  pendingDate: Date | null;
  reset: () => void;
  advanceToTimeStep: (date: Date) => void;
}

interface AndroidHandlerDeps {
  mode: DatePickerMode;
  datetimeFlow: DatetimeFlowState;
  onChange: (value: string) => void;
  closePicker: () => void;
}

function isPickerDismissed(event: PickerEvent, selectedDate?: Date): boolean {
  return event.type !== 'set' || !selectedDate;
}

function buildFallbackDatetime(pendingDate: Date): string {
  const fallback = new Date(pendingDate);

  fallback.setHours(0, 0, 0, 0);

  return formatValue(fallback, 'datetime');
}

function mergeDateAndTime(date: Date, time: Date): Date {
  const merged = new Date(date);

  merged.setHours(time.getHours(), time.getMinutes(), 0, 0);

  return merged;
}

function handleAndroidDismiss(deps: AndroidHandlerDeps): void {
  const { mode, datetimeFlow, onChange, closePicker } = deps;

  const shouldEmitFallback =
    mode === 'datetime' && datetimeFlow.isTimeStep && datetimeFlow.pendingDate;

  if (shouldEmitFallback) {
    onChange(buildFallbackDatetime(datetimeFlow.pendingDate!));
  }

  closePicker();
  datetimeFlow.reset();
}

function handleDatetimeDateStep(selectedDate: Date, datetimeFlow: DatetimeFlowState): void {
  datetimeFlow.advanceToTimeStep(selectedDate);
}

function handleDatetimeTimeStep(selectedTime: Date, deps: AndroidHandlerDeps): void {
  const { datetimeFlow, onChange, closePicker } = deps;
  const baseDate = datetimeFlow.pendingDate || selectedTime;
  const merged = mergeDateAndTime(baseDate, selectedTime);

  onChange(formatValue(merged, 'datetime'));
  closePicker();
  datetimeFlow.reset();
}

function handleSingleModeSelection(
  selectedDate: Date,
  mode: DatePickerMode,
  onChange: (value: string) => void,
  closePicker: () => void,
): void {
  onChange(formatValue(selectedDate, mode));
  closePicker();
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function DatePickerInput({
  label,
  value,
  onChange,
  minimumDate,
  maximumDate,
  containerStyle,
  error,
  required,
  locale = 'en-US',
  icon,
  mode = 'date',
  disabled = false,
  placeholder,
  testID,
  isOpen: controlledOpen,
  onOpen,
  onClose,
  clearable = false,
  onClear,
}: DatePickerInputProps) {
  const theme = useTheme();
  const NativePicker = getNativePicker();

  useEffect(emitPeerWarning, []);

  const picker = usePickerVisibility(controlledOpen, onOpen, onClose);
  const datetimeFlow = useDatetimeFlow();
  const { isDateStep, isTimeStep, pendingDate, reset: resetFlow, advanceToTimeStep } = datetimeFlow;

  const dateValue = value ? parseValue(value, mode) : new Date();
  const hasValue = Boolean(value);
  const showPlaceholder = !hasValue && Boolean(placeholder);

  // --- Android change dispatcher (flat guard clauses, no nesting) ---

  const dispatchAndroidChange = useCallback(
    (event: PickerEvent, selectedDate?: Date) => {
      const flowState: DatetimeFlowState = {
        isDateStep,
        isTimeStep,
        pendingDate,
        reset: resetFlow,
        advanceToTimeStep,
      };

      const deps: AndroidHandlerDeps = {
        mode,
        datetimeFlow: flowState,
        onChange,
        closePicker: picker.close,
      };

      if (isPickerDismissed(event, selectedDate)) {
        handleAndroidDismiss(deps);
        return;
      }

      const date = selectedDate!;

      if (mode === 'datetime' && isDateStep) {
        handleDatetimeDateStep(date, flowState);
        return;
      }

      if (mode === 'datetime' && isTimeStep) {
        handleDatetimeTimeStep(date, deps);
        return;
      }

      handleSingleModeSelection(date, mode, onChange, picker.close);
    },
    [
      mode,
      isDateStep,
      isTimeStep,
      pendingDate,
      resetFlow,
      advanceToTimeStep,
      onChange,
      picker.close,
    ],
  );

  // --- iOS compact change handler ---

  const handleIOSCompactChange = useCallback(
    (_event: PickerEvent, selectedDate?: Date) => {
      if (!selectedDate) return;

      onChange(formatValue(selectedDate, mode));
    },
    [onChange, mode],
  );

  // --- iOS placeholder change handler ---

  const handleIOSPlaceholderChange = useCallback(
    (event: PickerEvent, selectedDate?: Date) => {
      if (event.type === 'dismissed') {
        picker.close();
        return;
      }

      if (!selectedDate) return;

      onChange(formatValue(selectedDate, mode));
      picker.close();
    },
    [onChange, mode, picker],
  );

  // --- Platform-aware native change router ---

  const handleNativeChange = useCallback(
    (event: PickerEvent, selectedDate?: Date) => {
      if (Platform.OS === 'android') {
        dispatchAndroidChange(event, selectedDate);
        return;
      }

      handleIOSCompactChange(event, selectedDate);
    },
    [dispatchAndroidChange, handleIOSCompactChange],
  );

  // --- Trigger press handler ---

  const handleOpen = useCallback(() => {
    if (disabled) return;
    if (!NativePicker) return;

    resetFlow();
    picker.open();
  }, [disabled, NativePicker, resetFlow, picker]);

  // --- Clear handler ---

  const handleClear = useCallback(() => {
    const clearFn = onClear ?? (() => onChange(''));

    clearFn();
  }, [onChange, onClear]);

  // --- Computed values ---

  const borderColor = error ? theme.colors.error : theme.colors.border;
  const disabledStyle = disabled ? { opacity: theme.opacity.disabled } : undefined;
  const dateConstraints = mode === 'time' ? {} : { minimumDate, maximumDate };
  const themeVariant = theme.isDark ? 'dark' : 'light';

  const displayText = showPlaceholder
    ? (placeholder as string)
    : formatDisplay(dateValue, locale, mode);

  const clearButtonElement =
    clearable && hasValue && !disabled ? <ClearButton onPress={handleClear} /> : null;

  const nativeMode: 'date' | 'time' | 'datetime' =
    Platform.OS === 'android' && mode === 'datetime' ? (isDateStep ? 'date' : 'time') : mode;

  const pickerValue = isTimeStep && pendingDate ? pendingDate : dateValue;

  // --- Rendering strategy (early returns, no nesting) ---

  const isIOSWithNativePicker = NativePicker && Platform.OS === 'ios';
  const shouldShowIOSCompact = isIOSWithNativePicker && (hasValue || !placeholder);
  const shouldShowIOSPlaceholder = isIOSWithNativePicker && !hasValue && Boolean(placeholder);

  const renderIOSCompactPicker = (Picker: NativePickerComponent) => (
    <View
      style={[
        styles.iosRow,
        {
          backgroundColor: theme.colors.surfaceSecondary,
          borderColor,
          borderRadius: theme.borderRadius.md,
        },
      ]}
      pointerEvents={disabled ? 'none' : 'auto'}
    >
      {icon}
      <Picker
        value={dateValue}
        mode={mode}
        display="compact"
        locale={locale}
        {...dateConstraints}
        onChange={handleNativeChange}
        themeVariant={themeVariant}
        style={styles.iosPicker}
      />
      {clearButtonElement}
    </View>
  );

  const renderIOSPlaceholderPicker = (Picker: NativePickerComponent) => (
    <>
      <TriggerRow
        icon={icon}
        text={placeholder as string}
        isPlaceholder
        borderColor={borderColor}
        disabled={disabled}
        label={label}
        onPress={handleOpen}
        clearButton={null}
      />
      {picker.isVisible && (
        <Picker
          value={dateValue}
          mode={mode}
          display="default"
          locale={locale}
          {...dateConstraints}
          onChange={handleIOSPlaceholderChange}
          themeVariant={themeVariant}
        />
      )}
    </>
  );

  const renderFallbackPicker = (Picker: NativePickerComponent | null) => (
    <>
      <TriggerRow
        icon={icon}
        text={displayText}
        isPlaceholder={showPlaceholder}
        borderColor={borderColor}
        disabled={disabled}
        label={label}
        onPress={handleOpen}
        clearButton={clearButtonElement}
      />
      {Picker && picker.isVisible && (
        <Picker
          value={pickerValue}
          mode={nativeMode}
          display="default"
          {...dateConstraints}
          onChange={dispatchAndroidChange}
        />
      )}
    </>
  );

  const renderPickerContent = () => {
    if (shouldShowIOSCompact) return renderIOSCompactPicker(NativePicker!);
    if (shouldShowIOSPlaceholder) return renderIOSPlaceholderPicker(NativePicker!);

    return renderFallbackPicker(NativePicker);
  };

  return (
    <View style={[styles.container, disabledStyle, containerStyle]} testID={testID}>
      {label && <FieldLabel label={label} required={required} />}
      {renderPickerContent()}
      {error && <FieldError error={error} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  iosRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingLeft: 14,
    paddingRight: 8,
    paddingVertical: 4,
    gap: 8,
  },
  iosPicker: {
    flex: 1,
    height: 40,
  },
  triggerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    minHeight: 44,
  },
  clearButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearIcon: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 16,
  },
});
