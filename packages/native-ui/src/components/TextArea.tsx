import { forwardRef } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { useTextField } from '../hooks/useTextField';
import { FieldLabel } from './FieldLabel';
import { FieldError } from './FieldError';

export interface TextAreaProps extends Omit<TextInputProps, 'multiline'> {
  label?: string;
  error?: string;
  required?: boolean;
  /** Number of visible lines (default: 4) */
  lines?: number;
  containerStyle?: ViewStyle;
}

/**
 * Multiline text input (textarea equivalent) with label and error support.
 * The `ref` is forwarded to the underlying `TextInput` so consumers can call
 * `.focus()` / `.blur()` imperatively.
 */
export const TextArea = forwardRef<TextInput, TextAreaProps>(function TextArea(
  { label, error, required, lines = 4, containerStyle, style, onFocus, onBlur, ...props },
  ref,
) {
  const theme = useTheme();
  const { handleFocus, handleBlur, borderColor, inputTypography } = useTextField({
    error,
    onFocus,
    onBlur,
  });

  const accessibilityLabel = [label, error].filter(Boolean).join(', ') || undefined;
  const minHeight = lines * (theme.typography.body.lineHeight ?? 22);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <FieldLabel label={label} required={required} />}
      <TextInput
        ref={ref}
        multiline
        textAlignVertical="top"
        style={[
          styles.input,
          inputTypography,
          {
            backgroundColor: theme.colors.surfaceSecondary,
            borderColor,
            borderRadius: theme.borderRadius.lg,
            color: theme.colors.textPrimary,
            minHeight,
          },
          style,
        ]}
        placeholderTextColor={theme.colors.textTertiary}
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled: props.editable === false }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      {error && <FieldError error={error} />}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
