import { forwardRef } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { useTextField } from '../hooks/useTextField';
import { FieldLabel } from './FieldLabel';
import { FieldError } from './FieldError';

export interface InputProps extends TextInputProps {
  /** Label displayed above the input in uppercase. */
  label?: string;
  /** Error message displayed below the input in the theme's error color. */
  error?: string;
  /**
   * Marks the field as required by appending a red asterisk to the label.
   * @default false
   */
  required?: boolean;
  /** Additional styles applied to the outer wrapper `View`. */
  containerStyle?: ViewStyle;
}

/**
 * Themed text input with label, error state, and animated focus border.
 * Wraps React Native `TextInput` and forwards all standard props. The `ref` is
 * forwarded to the underlying `TextInput`, so consumers can call `.focus()` /
 * `.blur()` imperatively.
 *
 * @example
 * ```tsx
 * <Input label="Email" placeholder="you@example.com" value={email} onChangeText={setEmail} />
 * <Input label="Password" secureTextEntry required error={errors.password} />
 * <Input label="Bio" multiline numberOfLines={4} />
 * ```
 */
export const Input = forwardRef<TextInput, InputProps>(function Input(
  { label, error, required, containerStyle, style, onFocus, onBlur, ...props },
  ref,
) {
  const theme = useTheme();
  const { handleFocus, handleBlur, borderColor, inputTypography } = useTextField({
    error,
    onFocus,
    onBlur,
  });

  const accessibilityLabel = [label, error].filter(Boolean).join(', ') || undefined;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <FieldLabel label={label} required={required} />}
      <TextInput
        ref={ref}
        style={[
          styles.input,
          inputTypography,
          {
            backgroundColor: theme.colors.surfaceSecondary,
            borderColor,
            borderRadius: theme.borderRadius.lg,
            color: theme.colors.textPrimary,
            textAlignVertical: props.multiline ? 'top' : 'center',
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
    paddingVertical: 10,
  },
});
