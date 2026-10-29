import { Platform } from 'react-native';
import { useTheme } from '../theme';
import { useIOSAlertPrompt } from './inputPrompt/useIOSAlertPrompt';
import {
  AndroidPromptDialog,
  type AndroidPromptDialogProps,
} from './inputPrompt/AndroidPromptDialog';
import type { InputPromptProps } from './inputPrompt/types';
export type { InputPromptProps } from './inputPrompt/types';

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
export function InputPrompt(props: InputPromptProps) {
  const theme = useTheme();
  const options = {
    ...props,
    submitLabel: props.submitLabel ?? theme.labels.confirm,
    cancelLabel: props.cancelLabel ?? theme.labels.cancel,
    keyboardType: props.keyboardType ?? 'default',
  } satisfies AndroidPromptDialogProps;

  useIOSAlertPrompt(options);

  if (Platform.OS === 'ios') {
    return null;
  }

  return <AndroidPromptDialog {...options} />;
}
