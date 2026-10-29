import { useEffect, useRef } from 'react';
import { Alert, Platform } from 'react-native';
import type { InputPromptProps } from './types';

export interface IOSAlertPromptOptions extends Pick<
  InputPromptProps,
  'visible' | 'title' | 'message' | 'onSubmit' | 'onCancel'
> {
  submitLabel: string;
  cancelLabel: string;
  keyboardType: NonNullable<InputPromptProps['keyboardType']>;
}

/**
 * Latest callbacks accessed via refs so the prompt effect only re-runs on
 * content changes - this prevents stacking multiple Alert.prompt invocations
 * when parent-provided callbacks change identity while the prompt is open.
 */
function useLatestCallbacks(onSubmit: (value: string) => void, onCancel: () => void) {
  const onSubmitRef = useRef(onSubmit);
  const onCancelRef = useRef(onCancel);

  useEffect(() => {
    onSubmitRef.current = onSubmit;
    onCancelRef.current = onCancel;
  }, [onSubmit, onCancel]);

  return { onSubmitRef, onCancelRef };
}

/** Shows the native `Alert.prompt` on iOS each time `visible` turns true. */
export function useIOSAlertPrompt(options: IOSAlertPromptOptions): void {
  const { visible, title, message, cancelLabel, submitLabel, keyboardType } = options;
  const { onSubmitRef, onCancelRef } = useLatestCallbacks(options.onSubmit, options.onCancel);
  const wasVisibleRef = useRef(false);

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }

    const wasVisible = wasVisibleRef.current;
    wasVisibleRef.current = visible;

    if (!visible || wasVisible) {
      return;
    }

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
  }, [visible, title, message, cancelLabel, submitLabel, keyboardType, onCancelRef, onSubmitRef]);
}
