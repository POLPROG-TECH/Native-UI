import {
  forwardRef,
  type ComponentRef,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from 'react';
import { TextInput, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { useTextField } from '../hooks/useTextField';
import { FieldFrame } from './field/FieldFrame';
import type { TypographyStyle } from '../tokens/typography';

/** Since React Native 0.87 `TextInput` as a type is the component, not its instance. */
type TextInputRef = ComponentRef<typeof TextInput>;

export interface TextAreaProps extends Omit<TextInputProps, 'multiline'> {
  label?: string;
  error?: string;
  required?: boolean;
  /** Number of visible lines. @default theme.components.textArea.defaultLines (4) */
  lines?: number;
  containerStyle?: StyleProp<ViewStyle>;
}

/** Explicit type keeps the emitted declaration portable across React Native versions. */
type TextAreaType = ForwardRefExoticComponent<TextAreaProps & RefAttributes<TextInputRef>>;

/**
 * Multiline text input (textarea equivalent) with label and error support.
 * The `ref` is forwarded to the underlying `TextInput` so consumers can call
 * `.focus()` / `.blur()` imperatively.
 */
export const TextArea: TextAreaType = forwardRef<TextInputRef, TextAreaProps>(function TextArea(
  { label, error, required, lines, containerStyle, style, onFocus, onBlur, testID, ...props },
  ref,
) {
  const theme = useTheme();
  const tokens = theme.components.textArea;
  const field = useTextField({ label, error, editable: props.editable, tokens, onFocus, onBlur });
  /* A typography object built in plain JS may leave the body line height out. */
  const body: Partial<TypographyStyle> = theme.typography.body;
  const lineHeight = body.lineHeight ?? tokens.fallbackLineHeight;
  const minHeight = (lines ?? tokens.defaultLines) * lineHeight;

  return (
    <FieldFrame
      label={label}
      required={required}
      error={error}
      style={[{ marginBottom: tokens.containerMarginBottom }, containerStyle]}
      testID={testID ? `${testID}-container` : undefined}
    >
      <TextInput
        ref={ref}
        testID={testID}
        multiline
        textAlignVertical="top"
        style={[field.inputTypography, { ...field.boxStyle, minHeight }, style]}
        {...field.inputProps}
        {...props}
      />
    </FieldFrame>
  );
});
