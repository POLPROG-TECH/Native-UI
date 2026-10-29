import { useCallback, useEffect, useRef, useState, type ComponentRef, type RefObject } from 'react';
import type { TextInput } from 'react-native';
import { useTheme } from '../../theme';

/** Since React Native 0.87 `TextInput` as a type is the component, not its instance. */
type TextInputRef = ComponentRef<typeof TextInput>;

/**
 * Controls the lifecycle of a debounced emit timer. Returns `schedule` to
 * queue the next emit and `cancel` to drop any pending emit. `isPending` is a
 * read-only probe (true while a timer is queued) so callers can guard against
 * mid-flight prop echoes clobbering local state.
 */
function useDebouncedEmit<T>(
  emit: (value: T) => void,
  delayMs: number,
): {
  schedule: (value: T) => void;
  cancel: () => void;
  isPending: () => boolean;
} {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancel = useCallback(() => {
    if (timerRef.current === null) {
      return;
    }

    clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const schedule = useCallback(
    (value: T) => {
      cancel();
      timerRef.current = setTimeout(() => {
        /*
         * Null the ref *before* emitting so any prop-sync effects re-enabled
         * by this emit see a clean slate and cannot observe a stale timer id.
         */
        timerRef.current = null;
        emit(value);
      }, delayMs);
    },
    [cancel, delayMs, emit],
  );

  const isPending = useCallback(() => timerRef.current !== null, []);

  useEffect(() => cancel, [cancel]);

  return { schedule, cancel, isPending };
}

/**
 * Sync from the controlled `value` prop only when no local edit is in flight.
 * Without this guard, a rapid-type + debounce echo cycle would clobber
 * newly-typed characters:
 *   user types "ab" -> debounce fires -> parent setState -> prop re-enters as
 *   "ab" -> effect resets `localValue`, erasing the "c" the user just typed
 *   while the echo was in flight.
 */
function useSyncFromProp(
  value: string,
  isPending: () => boolean,
  setLocalValue: (value: string) => void,
): void {
  useEffect(() => {
    if (isPending()) {
      return;
    }

    setLocalValue(value);
  }, [value, isPending, setLocalValue]);
}

export interface SearchBarState {
  localValue: string;
  inputRef: RefObject<TextInputRef | null>;
  handleChangeText: (text: string) => void;
  handleClear: () => void;
}

/**
 * Local text state of the SearchBar: typing updates the field immediately and
 * emits `onChangeText` after the debounce, while clearing emits at once.
 * `debounceMs` defaults to `theme.components.searchBar.debounceMs`.
 */
export function useSearchBarState(
  value: string,
  onChangeText: (text: string) => void,
  debounceMs: number | undefined,
): SearchBarState {
  const defaultDelay = useTheme().components.searchBar.debounceMs;
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<TextInputRef>(null);
  const { schedule, cancel, isPending } = useDebouncedEmit(
    onChangeText,
    debounceMs ?? defaultDelay,
  );

  useSyncFromProp(value, isPending, setLocalValue);

  const handleChangeText = useCallback(
    (text: string) => {
      setLocalValue(text);
      schedule(text);
    },
    [schedule],
  );

  const handleClear = useCallback(() => {
    cancel();
    setLocalValue('');
    onChangeText('');
    inputRef.current?.blur();
  }, [cancel, onChangeText]);

  return { localValue, inputRef, handleChangeText, handleClear };
}
