import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../theme';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  /** Debounce delay in ms (default: 300) */
  debounceMs?: number;
  accessibilityLabel?: string;
  style?: ViewStyle;
  /**
   * Render prop for a leading element (e.g. search icon) placed inside the bar.
   * Takes priority over any default leading content.
   * @example
   * ```tsx
   * <SearchBar renderLeft={() => <SearchIcon />} value={q} onChangeText={setQ} />
   * ```
   */
  renderLeft?: () => React.ReactNode;
  /**
   * Render prop for a trailing element (e.g. filter button) placed at the end of the bar.
   * When provided, the built-in clear button is still rendered but this element appears after it.
   * @example
   * ```tsx
   * <SearchBar renderRight={() => <FilterButton />} value={q} onChangeText={setQ} />
   * ```
   */
  renderRight?: () => React.ReactNode;
}

const DEFAULT_DEBOUNCE_MS = 300;
const LEFT_SLOT_PADDING = 36;
const RIGHT_SLOT_PADDING = 56;
const CLEAR_WITH_RIGHT_OFFSET = 36;
const CLEAR_HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 } as const;

/**
 * Controls the lifecycle of a debounced emit timer. Returns `schedule` to
 * queue the next emit and `cancel` to drop any pending emit. `pendingRef`
 * exposes a read-only probe (truthy while a timer is queued) so callers can
 * guard against mid-flight prop echoes clobbering local state.
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
    if (timerRef.current === null) return;

    clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const schedule = useCallback(
    (value: T) => {
      cancel();
      timerRef.current = setTimeout(() => {
        // Null the ref *before* emitting so any prop-sync effects re-enabled
        // by this emit see a clean slate and cannot observe a stale timer id.
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
 * Search input with built-in debounce and clear button.
 *
 * Accepts `renderLeft` and `renderRight` render props for custom leading/trailing elements.
 *
 * @example
 * ```tsx
 * <SearchBar value={q} onChangeText={setQ} placeholder="Search..." />
 * <SearchBar
 *   value={q}
 *   onChangeText={setQ}
 *   renderLeft={() => <SearchIcon />}
 *   renderRight={() => <FilterButton />}
 * />
 * ```
 */
export function SearchBar({
  value,
  onChangeText,
  placeholder,
  debounceMs = DEFAULT_DEBOUNCE_MS,
  accessibilityLabel,
  style,
  renderLeft,
  renderRight,
}: SearchBarProps) {
  const theme = useTheme();
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<TextInput>(null);
  const { schedule, cancel, isPending } = useDebouncedEmit(onChangeText, debounceMs);

  // Sync from the controlled `value` prop only when no local edit is in flight.
  // Without this guard, a rapid-type + debounce echo cycle would clobber
  // newly-typed characters:
  //   user types "ab" → debounce fires → parent setState → prop re-enters as
  //   "ab" → effect resets `localValue`, erasing the "c" the user just typed
  //   while the echo was in flight.
  useEffect(() => {
    if (isPending()) return;

    setLocalValue(value);
  }, [value, isPending]);

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

  const inputStyle = useMemo(() => {
    const { lineHeight: _lh, ...inputTypography } = theme.typography.body;

    return [
      styles.input,
      inputTypography,
      {
        backgroundColor: theme.colors.surfaceSecondary,
        borderRadius: theme.borderRadius.lg,
        color: theme.colors.textPrimary,
        textAlignVertical: 'center' as const,
      },
      renderLeft ? { paddingLeft: LEFT_SLOT_PADDING } : undefined,
      renderRight ? { paddingRight: RIGHT_SLOT_PADDING } : undefined,
    ];
  }, [
    theme.typography.body,
    theme.colors.surfaceSecondary,
    theme.borderRadius.lg,
    theme.colors.textPrimary,
    renderLeft,
    renderRight,
  ]);

  const clearTextStyle: TextStyle = { color: theme.colors.textTertiary };
  const clearButtonStyle = renderRight
    ? [styles.clearButton, { right: CLEAR_WITH_RIGHT_OFFSET }]
    : styles.clearButton;

  return (
    <View style={[styles.container, style]}>
      {renderLeft && <View style={styles.leftSlot}>{renderLeft()}</View>}

      <TextInput
        ref={inputRef}
        style={inputStyle}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textTertiary}
        value={localValue}
        onChangeText={handleChangeText}
        returnKeyType="search"
        accessibilityLabel={accessibilityLabel ?? placeholder}
      />

      {localValue.length > 0 && (
        <TouchableOpacity
          style={clearButtonStyle}
          onPress={handleClear}
          hitSlop={CLEAR_HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <Text style={[styles.clearText, clearTextStyle]}>✕</Text>
        </TouchableOpacity>
      )}

      {renderRight && <View style={styles.rightSlot}>{renderRight()}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingRight: 36,
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearText: {
    fontSize: 14,
    fontWeight: '600',
  },
  leftSlot: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
    justifyContent: 'center',
  },
  rightSlot: {
    position: 'absolute',
    right: 12,
    zIndex: 1,
    justifyContent: 'center',
  },
});
