import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Text, type ViewStyle } from 'react-native';
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
  debounceMs = 300,
  accessibilityLabel,
  style,
  renderLeft,
  renderRight,
}: SearchBarProps) {
  const theme = useTheme();
  const [localValue, setLocalValue] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Only sync from prop when there's no pending local edit in flight.
    // Without this guard a rapid-type + debounce echo cycle would clobber
    // newly-typed characters: user types "ab" → debounce fires → parent
    // setState → prop re-enters as "ab" → effect resets localValue,
    // erasing the "c" the user just typed while the echo was in flight.
    if (timerRef.current) return;
    setLocalValue(value);
  }, [value]);

  const handleChangeText = useCallback(
    (text: string) => {
      setLocalValue(text);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onChangeText(text), debounceMs);
    },
    [onChangeText, debounceMs],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleClear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setLocalValue('');
    onChangeText('');
    inputRef.current?.blur();
  }, [onChangeText]);

  const { lineHeight: _lh, ...inputTypography } = theme.typography.body;

  return (
    <View style={[styles.container, style]}>
      {renderLeft && <View style={styles.leftSlot}>{renderLeft()}</View>}
      <TextInput
        ref={inputRef}
        style={[
          styles.input,
          inputTypography,
          {
            backgroundColor: theme.colors.surfaceSecondary,
            borderRadius: theme.borderRadius.lg,
            color: theme.colors.textPrimary,
            textAlignVertical: 'center',
          },
          renderLeft ? { paddingLeft: 36 } : undefined,
          renderRight ? { paddingRight: 56 } : undefined,
        ]}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textTertiary}
        value={localValue}
        onChangeText={handleChangeText}
        returnKeyType="search"
        accessibilityLabel={accessibilityLabel ?? placeholder}
      />
      {localValue.length > 0 && (
        <TouchableOpacity
          style={[styles.clearButton, renderRight ? { right: 36 } : undefined]}
          onPress={handleClear}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <Text style={[styles.clearText, { color: theme.colors.textTertiary }]}>✕</Text>
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
