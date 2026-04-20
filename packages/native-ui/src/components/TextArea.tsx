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
 */
export function TextArea({
  label,
  error,
  required,
  lines = 4,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...props
}: TextAreaProps) {
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

  const { lineHeight: _lh, ...inputTypography } = theme.typography.body;
  const minHeight = lines * (theme.typography.body.lineHeight ?? 22);

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
        accessibilityLabel={label}
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
    paddingVertical: 12,
  },
});
