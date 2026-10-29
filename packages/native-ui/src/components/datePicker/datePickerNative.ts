import type React from 'react';
import { devWarn } from '../../utils/devWarn';
import { useCallback, useRef, useState } from 'react';
import type { DatePickerMode } from './types';
import { formatValue } from './datePickerUtils';

export type NativePickerComponent = React.ComponentType<Record<string, unknown>>;

export type PickerEvent = { type: string };

/** Function and class components are functions; memo / forwardRef ones are objects. */
function isComponent(value: unknown): value is NativePickerComponent {
  return typeof value === 'function' || (typeof value === 'object' && value !== null);
}

/** The picker's default export, checked at runtime because `require` is untyped. */
function loadNativePicker(): NativePickerComponent | null {
  try {
    /* eslint-disable-next-line @typescript-eslint/no-require-imports */
    const module: unknown = require('@react-native-community/datetimepicker');

    if (typeof module !== 'object' || module === null || !('default' in module)) {
      return null;
    }

    return isComponent(module.default) ? module.default : null;
  } catch {
    /* Optional dependency - will render a read-only text fallback if missing. */
    return null;
  }
}

const _nativePicker = loadNativePicker();

let _peerWarningEmitted = false;

/** Warns once per app session (dev only) that the native picker is missing. */
export function emitPeerWarning(): void {
  if (!__DEV__ || _nativePicker || _peerWarningEmitted) {
    return;
  }

  _peerWarningEmitted = true;

  devWarn(
    'DatePickerInput: @react-native-community/datetimepicker is not installed. ' +
      'The component will render a read-only text fallback. ' +
      'Install it with: npm install @react-native-community/datetimepicker ' +
      '(or `npx expo install @react-native-community/datetimepicker` in Expo apps).',
  );
}

export function getNativePicker(): NativePickerComponent | null {
  return _nativePicker;
}

export interface PickerVisibility {
  isVisible: boolean;
  open: () => void;
  close: () => void;
}

/** Open state that is controlled when `controlledOpen` is defined. */
export function usePickerVisibility(
  controlledOpen: boolean | undefined,
  onOpen?: () => void,
  onClose?: () => void,
): PickerVisibility {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isVisible = isControlled ? controlledOpen : internalOpen;

  const open = useCallback(() => {
    if (!isControlled) {
      setInternalOpen(true);
    }

    onOpen?.();
  }, [isControlled, onOpen]);

  const close = useCallback(() => {
    if (!isControlled) {
      setInternalOpen(false);
    }

    onClose?.();
  }, [isControlled, onClose]);

  return { isVisible, open, close };
}

export interface DatetimeFlowState {
  isDateStep: boolean;
  isTimeStep: boolean;
  pendingDate: Date | null;
  reset: () => void;
  advanceToTimeStep: (date: Date) => void;
}

/**
 * Android has no combined date-time dialog, so `datetime` mode shows the date
 * dialog first, keeps the chosen day, then shows the time dialog.
 */
export function useDatetimeFlow(): DatetimeFlowState {
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

  return {
    isDateStep: step === 'date',
    isTimeStep: step === 'time',
    pendingDate: pendingDateRef.current,
    reset,
    advanceToTimeStep,
  };
}

export interface AndroidHandlerDeps {
  mode: DatePickerMode;
  datetimeFlow: DatetimeFlowState;
  onChange: (value: string) => void;
  closePicker: () => void;
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

/**
 * Dismissing the time dialog after a day was picked still commits that day
 * (at midnight) so the first step is not lost.
 */
function handleAndroidDismiss({ mode, datetimeFlow, onChange, closePicker }: AndroidHandlerDeps) {
  const { pendingDate } = datetimeFlow;

  if (mode === 'datetime' && datetimeFlow.isTimeStep && pendingDate) {
    onChange(buildFallbackDatetime(pendingDate));
  }

  closePicker();
  datetimeFlow.reset();
}

function handleDatetimeTimeStep(selectedTime: Date, deps: AndroidHandlerDeps): void {
  const { datetimeFlow, onChange, closePicker } = deps;
  const baseDate = datetimeFlow.pendingDate ?? selectedTime;

  onChange(formatValue(mergeDateAndTime(baseDate, selectedTime), 'datetime'));
  closePicker();
  datetimeFlow.reset();
}

/** Routes one Android dialog result through the single or two-step flow. */
export function dispatchAndroidPickerChange(
  event: PickerEvent,
  selectedDate: Date | undefined,
  deps: AndroidHandlerDeps,
): void {
  const { mode, datetimeFlow, onChange, closePicker } = deps;

  if (event.type !== 'set' || !selectedDate) {
    handleAndroidDismiss(deps);

    return;
  }

  if (mode === 'datetime' && datetimeFlow.isDateStep) {
    datetimeFlow.advanceToTimeStep(selectedDate);

    return;
  }

  if (mode === 'datetime' && datetimeFlow.isTimeStep) {
    handleDatetimeTimeStep(selectedDate, deps);

    return;
  }

  onChange(formatValue(selectedDate, mode));
  closePicker();
}
