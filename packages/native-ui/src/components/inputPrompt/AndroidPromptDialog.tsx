import { useCallback, useState } from 'react';
import { KeyboardAvoidingView, Modal, StyleSheet, TextInput } from 'react-native';
import { Box } from '../../primitives/Box';
import { HStack } from '../../primitives/Stack';
import { Text } from '../../primitives/Text';
import { Heading } from '../../primitives/Heading';
import { PressableScale } from '../../primitives/PressableScale';
import { useTheme } from '../../theme';
import type { IOSAlertPromptOptions } from './useIOSAlertPrompt';

export type AndroidPromptDialogProps = IOSAlertPromptOptions & { placeholder?: string };

/** The typed text; cleared after both submit and cancel so the next open starts empty. */
function usePromptDraft(onSubmit: (value: string) => void, onCancel: () => void) {
  const [value, setValue] = useState('');

  const handleSubmit = useCallback(() => {
    onSubmit(value);
    setValue('');
  }, [value, onSubmit]);

  const handleCancel = useCallback(() => {
    onCancel();
    setValue('');
  }, [onCancel]);

  return { value, setValue, handleSubmit, handleCancel };
}

interface PromptActionProps {
  label: string;
  color: 'primary' | 'textSecondary';
  onPress: () => void;
}

function PromptAction({ label, color, onPress }: PromptActionProps) {
  const theme = useTheme();

  return (
    <PressableScale
      onPress={onPress}
      style={{ paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.md }}
    >
      <Text variant="label" color={color}>
        {label}
      </Text>
    </PressableScale>
  );
}

interface PromptInputProps extends Pick<AndroidPromptDialogProps, 'keyboardType' | 'placeholder'> {
  value: string;
  onChangeText: (value: string) => void;
  accessibilityLabel: string;
}

function PromptInput({
  value,
  onChangeText,
  keyboardType,
  placeholder,
  accessibilityLabel,
}: PromptInputProps) {
  const theme = useTheme();

  return (
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
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      placeholder={placeholder}
      placeholderTextColor={theme.colors.textTertiary}
      autoFocus
      accessibilityLabel={accessibilityLabel}
    />
  );
}

function PromptHeader({ title, message }: Pick<AndroidPromptDialogProps, 'title' | 'message'>) {
  const theme = useTheme();

  return (
    <>
      <Heading level={3} style={{ marginBottom: theme.spacing['2xs'] }}>
        {title}
      </Heading>
      {message && (
        <Text variant="body" color="textSecondary" style={{ marginBottom: theme.spacing.lg }}>
          {message}
        </Text>
      )}
    </>
  );
}

/** Android has no native text prompt, so the dialog is built from native-ui primitives. */
export function AndroidPromptDialog(props: AndroidPromptDialogProps) {
  const { visible, title, message, cancelLabel, submitLabel } = props;
  const theme = useTheme();
  const draft = usePromptDraft(props.onSubmit, props.onCancel);
  const backdrop = { padding: theme.spacing['3xl'], backgroundColor: theme.colors.overlay };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={draft.handleCancel}>
      <KeyboardAvoidingView style={[styles.backdrop, backdrop]}>
        <Box bg="surface" radius="lg" p="xl" style={styles.card}>
          <PromptHeader title={title} message={message} />
          <PromptInput
            value={draft.value}
            onChangeText={draft.setValue}
            keyboardType={props.keyboardType}
            placeholder={props.placeholder}
            accessibilityLabel={message ?? title}
          />
          <HStack justify="flex-end" gap="lg">
            <PromptAction label={cancelLabel} color="textSecondary" onPress={draft.handleCancel} />
            <PromptAction label={submitLabel} color="primary" onPress={draft.handleSubmit} />
          </HStack>
        </Box>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
  },
});
