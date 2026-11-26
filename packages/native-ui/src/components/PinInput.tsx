import { useState } from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../theme';
import { PinCell } from './pinInput/PinCell';
import { pinCellState, sanitizePin } from './pinInput/pinValue';

export interface PinInputProps {
  value: string;
  /** Receives digits only, never more than `length`. */
  onChangeText: (value: string) => void;
  /** Called once when the last digit is entered. */
  onComplete?: (value: string) => void;
  /** Number of digits. @default theme.components.pinInput.defaultLength (6) */
  length?: number;
  /** Hides the digits behind dots, for a PIN rather than a one-time code. @default false */
  secure?: boolean;
  /** Marks every cell with the error color. @default false */
  invalid?: boolean;
  /** @default false */
  disabled?: boolean;
  /** @default false */
  autoFocus?: boolean;
  /** Accessible name of the field (e.g. "Verification code"). */
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
  /** Test ID of the text field; the cell row receives `{testID}-cells`. */
  testID?: string;
}

/** iOS offers the code from an SMS above the keyboard; Android fills it in. */
const ONE_TIME_CODE: TextInputProps['autoComplete'] = Platform.select({
  android: 'sms-otp',
  default: 'one-time-code',
});

const HIDDEN_SELECTION_COLOR = 'transparent';

/**
 * The field's own text must not show through the cells, and each platform
 * needs a different way to hide it:
 * - iOS delivers no touches to a view with zero opacity, so the field stays
 *   opaque and only its text is transparent.
 * - Android ignores a fully transparent text color and draws the default one,
 *   but still delivers touches to a view with zero opacity.
 * - Web also keeps a faded element clickable, and out of contrast checks.
 */
function hiddenTextStyle(): TextStyle {
  return Platform.select<TextStyle>({
    ios: { color: 'transparent' },
    default: { opacity: 0 },
  });
}

interface PinCellsProps {
  value: string;
  length: number;
  focused: boolean;
  secure: boolean;
  invalid: boolean;
  testID: string | undefined;
}

function PinCells({ value, length, focused, secure, invalid, testID }: PinCellsProps) {
  const gap = useTheme().components.pinInput.gap;

  return (
    <View
      testID={testID}
      style={[styles.cells, { gap }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {Array.from({ length }, (_unused, index) => (
        <PinCell
          key={index}
          digit={value.charAt(index)}
          state={pinCellState(index, value, length, focused)}
          secure={secure}
          invalid={invalid}
        />
      ))}
    </View>
  );
}

interface PinFieldProps {
  props: PinInputProps;
  length: number;
  onFocusChange: (focused: boolean) => void;
}

/** `onComplete` fires only when the final digit arrives, not on every later edit. */
function usePinChange(props: PinInputProps, length: number) {
  return (text: string) => {
    const next = sanitizePin(text, length);

    props.onChangeText(next);

    if (next.length === length && next !== props.value) {
      props.onComplete?.(next);
    }
  };
}

function PinField({ props, length, onFocusChange }: PinFieldProps) {
  const { value, disabled = false } = props;
  const labels = useTheme().labels;
  const change = usePinChange(props, length);

  return (
    <TextInput
      testID={props.testID}
      value={value}
      onChangeText={change}
      onFocus={() => onFocusChange(true)}
      onBlur={() => onFocusChange(false)}
      maxLength={length}
      editable={!disabled}
      autoFocus={props.autoFocus}
      secureTextEntry={props.secure}
      keyboardType="number-pad"
      textContentType="oneTimeCode"
      autoComplete={ONE_TIME_CODE}
      caretHidden
      selectionColor={HIDDEN_SELECTION_COLOR}
      accessibilityLabel={props.accessibilityLabel}
      accessibilityValue={{ text: labels.pinProgress(value.length, length) }}
      accessibilityState={{ disabled }}
      style={[styles.input, hiddenTextStyle()]}
    />
  );
}

/**
 * Fixed-length numeric code entry (one-time code or PIN) drawn as separate
 * cells. A single transparent text field sits over the cells, so paste, SMS
 * autofill, the hardware keyboard and screen readers all work as for any
 * text field. Dimensions come from `theme.components.pinInput`.
 *
 * @example
 * ```tsx
 * <PinInput
 *   accessibilityLabel="Verification code"
 *   value={code}
 *   onChangeText={setCode}
 *   onComplete={verify}
 * />
 * ```
 */
export function PinInput(props: PinInputProps) {
  const { value, secure = false, invalid = false, disabled = false, testID } = props;
  const theme = useTheme();
  const length = props.length ?? theme.components.pinInput.defaultLength;
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.root, disabled && { opacity: theme.opacity.disabled }, props.style]}>
      <PinCells
        value={value}
        length={length}
        focused={focused}
        secure={secure}
        invalid={invalid}
        testID={testID ? `${testID}-cells` : undefined}
      />
      <PinField props={props} length={length} onFocusChange={setFocused} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: 'flex-start',
  },
  cells: {
    flexDirection: 'row',
  },
  /* Covers the cells so a tap anywhere on them focuses the field. */
  input: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
});
