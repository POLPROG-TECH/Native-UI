import { useState, useCallback, useEffect, useRef } from 'react';
import { Alert, Modal, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import { Box } from '../primitives/Box';
import { HStack } from '../primitives/Stack';
import { Text } from '../primitives/Text';
import { Heading } from '../primitives/Heading';
import { PressableScale } from '../primitives/PressableScale';
import { useTheme } from '../theme';

export interface InputPromptProps {
  /** Whether the prompt dialog is visible. */
  visible: boolean;
  /** Dialog title. */
  title: string;
  /** Optional descriptive message displayed below the title. */
  message?: string;
  /** Placeholder text for the input field. */
  placeholder?: string;
  /** Keyboard type forwarded to the underlying `TextInput`. */
  keyboardType?: 'default' | 'decimal-pad' | 'numeric';
  /** Label for the submit button. @default 'OK' */
  submitLabel?: string;
  /** Label for the cancel button. @default 'Cancel' */
  cancelLabel?: string;
  /** Called with the entered text when the user submits. */
  onSubmit: (value: string) => void;
  /** Called when the user dismisses the prompt. */
  onCancel: () => void;
}

/**
 * Cross-platform text input prompt.
 *
 * - **iOS** - delegates to the native `Alert.prompt` for a platform-native experience.
 * - **Android** - renders a custom modal dialog built with native-ui primitives.
 *
 * @example
 * ```tsx
 * <InputPrompt
 *   visible={showPrompt}
 *   title="Rename"
 *   message="Enter a new name for this item."
 *   onSubmit={(name) => rename(name)}
 *   onCancel={() => setShowPrompt(false)}
 * />
 * ```
 */
export function InputPrompt({
  visible,
  title,
  message,
  placeholder,
  keyboardType = 'default',
  submitLabel = 'OK',
  cancelLabel = 'Cancel',
  onSubmit,
  onCancel,
}: InputPromptProps) {
  const theme = useTheme();
  const [value, setValue] = useState('');
  const wasVisibleRef = useRef(false);

  // Latest callbacks accessed via refs so the iOS effect only depends on
  // `visible` - this prevents stacking multiple Alert.prompt invocations when
  // parent-provided props change identity while the prompt is already open.
  const onSubmitRef = useRef(onSubmit);
  const onCancelRef = useRef(onCancel);
  useEffect(() => {
    onSubmitRef.current = onSubmit;
    onCancelRef.current = onCancel;
  }, [onSubmit, onCancel]);

  useEffect(() => {
    if (Platform.OS !== 'ios') return;

    const wasVisible = wasVisibleRef.current;
    wasVisibleRef.current = visible;
    if (!visible || wasVisible) return;

    Alert.prompt(
      title,
      message,
      [
        { text: cancelLabel, style: 'cancel', onPress: () => onCancelRef.current() },
        { text: submitLabel, onPress: (text?: string) => onSubmitRef.current(text ?? '') },
      ],
      'plain-text',
      '',
      keyboardType,
    );
  }, [visible, title, message, cancelLabel, submitLabel, keyboardType]);

  const handleSubmit = useCallback(() => {
    onSubmit(value);
    setValue('');
  }, [value, onSubmit]);

  const handleCancel = useCallback(() => {
    onCancel();
    setValue('');
  }, [onCancel]);

  if (Platform.OS === 'ios') return null;

  // Android: custom modal built with native-ui primitives
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleCancel}>
      <KeyboardAvoidingView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: theme.spacing['3xl'],
          backgroundColor: theme.colors.overlay,
        }}
      >
        <Box bg="surface" radius="lg" p="xl" style={{ width: '100%' }}>
          <Heading level={3} style={{ marginBottom: theme.spacing['2xs'] }}>
            {title}
          </Heading>

          {message && (
            <Text variant="body" color="textSecondary" style={{ marginBottom: theme.spacing.lg }}>
              {message}
            </Text>
          )}

          <TextInput
            style={{
              ...theme.typography.body,
              backgroundColor: theme.colors.surfaceSecondary,
              borderRadius: theme.borderRadius.lg,
              color: theme.colors.textPrimary,
              paddingHorizontal: theme.spacing.lg,
              paddingVertical: theme.spacing.sm,
              marginBottom: theme.spacing.lg,
              textAlignVertical: 'center',
            }}
            value={value}
            onChangeText={setValue}
            keyboardType={keyboardType}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.textTertiary}
            autoFocus
            accessibilityLabel={message ?? title}
          />

          <HStack justify="flex-end" gap="lg">
            <PressableScale
              onPress={handleCancel}
              style={{
                paddingVertical: theme.spacing.sm,
                paddingHorizontal: theme.spacing.md,
              }}
            >
              <Text variant="label" color="textSecondary">
                {cancelLabel}
              </Text>
            </PressableScale>

            <PressableScale
              onPress={handleSubmit}
              style={{
                paddingVertical: theme.spacing.sm,
                paddingHorizontal: theme.spacing.md,
              }}
            >
              <Text variant="label" color="primary">
                {submitLabel}
              </Text>
            </PressableScale>
          </HStack>
        </Box>
      </KeyboardAvoidingView>
    </Modal>
  );
}
