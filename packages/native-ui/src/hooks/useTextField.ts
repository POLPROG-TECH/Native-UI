import { useState, useCallback } from 'react';
import type { TextInputProps, TextStyle } from 'react-native';
import { useTheme } from '../theme';
import type { Theme } from '../theme/types';
import type { TextFieldTokens } from '../tokens/components';

export interface UseTextFieldOptions {
  /** Visible label; combined with `error` into the accessible name. */
  label?: string;
  /** Current error message, if any. Drives the resting border color. */
  error?: string;
  /** Consumer `editable` prop; `false` is announced as disabled. */
  editable?: boolean;
  /** Box geometry of the field (`theme.components.input` or `textArea`). */
  tokens: TextFieldTokens;
  /** Consumer-supplied focus handler, invoked after internal state updates. */
  onFocus?: TextInputProps['onFocus'];
  /** Consumer-supplied blur handler, invoked after internal state updates. */
  onBlur?: TextInputProps['onBlur'];
}

/** Props every themed `TextInput` receives; consumer props spread after them win. */
export type TextFieldInputProps = Required<
  Pick<TextInputProps, 'placeholderTextColor' | 'accessibilityState' | 'onFocus' | 'onBlur'>
> &
  Pick<TextInputProps, 'accessibilityLabel'>;

export interface UseTextFieldResult {
  /** Whether the field currently has focus. */
  isFocused: boolean;
  /** Border color resolved from error / focus / resting state. */
  borderColor: string;
  /**
   * `theme.typography.body` with `lineHeight` stripped - it causes uneven
   * placeholder alignment on `TextInput`.
   */
  inputTypography: Omit<TextStyle, 'lineHeight'>;
  /** Border, padding, background and text color of the field box. */
  boxStyle: TextStyle;
  inputProps: TextFieldInputProps;
}

function useFocusState(onFocus: TextInputProps['onFocus'], onBlur: TextInputProps['onBlur']) {
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

  return { isFocused, handleFocus, handleBlur };
}

function buildBoxStyle(theme: Theme, tokens: TextFieldTokens, borderColor: string): TextStyle {
  return {
    borderWidth: tokens.borderWidth,
    paddingHorizontal: tokens.paddingHorizontal,
    paddingVertical: tokens.paddingVertical,
    backgroundColor: theme.colors.surfaceSecondary,
    borderColor,
    borderRadius: tokens.radius,
    color: theme.colors.textPrimary,
  };
}

/**
 * Shared focus/blur, border-color, box style and accessibility wiring for
 * text-entry fields (`Input`, `TextArea`). Keeps the two components in
 * lockstep so a fix in one place applies to both.
 */
export function useTextField(options: UseTextFieldOptions): UseTextFieldResult {
  const theme = useTheme();
  const { isFocused, handleFocus, handleBlur } = useFocusState(options.onFocus, options.onBlur);
  const borderColor = options.error
    ? theme.colors.error
    : isFocused
      ? theme.colors.primaryText
      : theme.colors.controlBorder;
  const { lineHeight: _lineHeight, ...inputTypography } = theme.typography.body;

  return {
    isFocused,
    borderColor,
    inputTypography,
    boxStyle: buildBoxStyle(theme, options.tokens, borderColor),
    inputProps: {
      placeholderTextColor: theme.colors.textTertiary,
      accessibilityLabel: [options.label, options.error].filter(Boolean).join(', ') || undefined,
      accessibilityState: { disabled: options.editable === false },
      onFocus: handleFocus,
      onBlur: handleBlur,
    },
  };
}
