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
  /** Label for the submit button. @default labels.confirm */
  submitLabel?: string;
  /** Label for the cancel button. @default labels.cancel */
  cancelLabel?: string;
  /** Called with the entered text when the user submits. */
  onSubmit: (value: string) => void;
  /** Called when the user dismisses the prompt. */
  onCancel: () => void;
}
