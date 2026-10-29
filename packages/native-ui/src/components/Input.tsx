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

/** Since React Native 0.87 `TextInput` as a type is the component, not its instance. */
type TextInputRef = ComponentRef<typeof TextInput>;

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
  containerStyle?: StyleProp<ViewStyle>;
}

/** Explicit type keeps the emitted declaration portable across React Native versions. */
type InputType = ForwardRefExoticComponent<InputProps & RefAttributes<TextInputRef>>;

/**
 * Themed text input with label, error state, and a border that follows focus.
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
export const Input: InputType = forwardRef<TextInputRef, InputProps>(function Input(
  { label, error, required, containerStyle, style, onFocus, onBlur, testID, ...props },
  ref,
) {
  const tokens = useTheme().components.input;
  const field = useTextField({ label, error, editable: props.editable, tokens, onFocus, onBlur });
  const textAlignVertical = props.multiline ? 'top' : 'center';

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
        style={[field.inputTypography, { ...field.boxStyle, textAlignVertical }, style]}
        {...field.inputProps}
        {...props}
      />
    </FieldFrame>
  );
});
