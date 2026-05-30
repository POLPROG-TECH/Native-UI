import { useState, useCallback } from 'react';
import type { TextInputProps, TextStyle } from 'react-native';
import { useTheme } from '../theme';

export interface UseTextFieldOptions {
  /** Current error message, if any. Drives the resting border color. */
  error?: string;
  /** Consumer-supplied focus handler, invoked after internal state updates. */
  onFocus?: TextInputProps['onFocus'];
  /** Consumer-supplied blur handler, invoked after internal state updates. */
  onBlur?: TextInputProps['onBlur'];
}

export interface UseTextFieldResult {
  /** Whether the field currently has focus. */
  isFocused: boolean;
  handleFocus: NonNullable<TextInputProps['onFocus']>;
  handleBlur: NonNullable<TextInputProps['onBlur']>;
  /** Border color resolved from error / focus / resting state. */
  borderColor: string;
  /**
   * `theme.typography.body` with `lineHeight` stripped - it causes uneven
   * placeholder alignment on `TextInput`.
   */
  inputTypography: Omit<TextStyle, 'lineHeight'>;
}

/**
 * Shared focus/blur, border-color, and typography logic for text-entry fields
 * (`Input`, `TextArea`). Keeps the two components in lockstep so a fix in one
 * place applies to both.
 */
export function useTextField({ error, onFocus, onBlur }: UseTextFieldOptions): UseTextFieldResult {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback<NonNullable<TextInputProps['onFocus']>>(
    (e) => {
      setIsFocused(true);
      onFocus?.(e);
    },
    [onFocus],
  );

  const handleBlur = useCallback<NonNullable<TextInputProps['onBlur']>>(
    (e) => {
      setIsFocused(false);
      onBlur?.(e);
    },
    [onBlur],
  );

  const borderColor = error
    ? theme.colors.error
    : isFocused
      ? theme.colors.primary
      : theme.colors.border;

  const { lineHeight: _lineHeight, ...inputTypography } = theme.typography.body;

  return { isFocused, handleFocus, handleBlur, borderColor, inputTypography };
}
