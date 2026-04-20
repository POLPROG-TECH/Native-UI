import { useState, useCallback } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../theme';

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
 * Wraps React Native `TextInput` and forwards all standard props.
 *
 * @example
 * ```tsx
 * <Input label="Email" placeholder="you@example.com" value={email} onChangeText={setEmail} />
 * <Input label="Password" secureTextEntry required error={errors.password} />
 * <Input label="Bio" multiline numberOfLines={4} />
 * ```
 */
export function Input({
  label,
  error,
  required,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(
    (e: Parameters<NonNullable<TextInputProps['onFocus']>>[0]) => {
      setIsFocused(true);
      onFocus?.(e);
    },
    [onFocus],
  );

  const handleBlur = useCallback(
    (e: Parameters<NonNullable<TextInputProps['onBlur']>>[0]) => {
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

  // Strip lineHeight - it causes uneven placeholder alignment on TextInput
  const { lineHeight: _lh, ...inputTypography } = theme.typography.body;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={[
            theme.typography.labelSmall,
            {
              color: theme.colors.textSecondary,
              marginBottom: 6,
              textTransform: 'uppercase',
              letterSpacing: 0.6,
            },
          ]}
        >
          {label}
          {required && <Text style={{ color: theme.colors.error }}> *</Text>}
        </Text>
      )}
      <TextInput
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
        accessibilityLabel={label}
        accessibilityState={{ disabled: props.editable === false }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      {error && (
        <Text
          style={[theme.typography.caption, { color: theme.colors.error, marginTop: 4 }]}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
        >
          {error}
        </Text>
      )}
    </View>
  );
}

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
