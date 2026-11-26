import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import type { Theme } from '../theme/types';
import { getHaptics, type HapticsInterface } from '../utils/haptics';
import { StepperButton } from './stepper/StepperButton';
import {
  STEP_DIRECTION,
  canStep,
  stepValue,
  type StepDirection,
  type StepperBounds,
} from './stepper/stepperValue';

export interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  /** @default 0 */
  min?: number;
  /** @default Number.MAX_SAFE_INTEGER */
  max?: number;
  /** @default 1 */
  step?: number;
  /** @default false */
  disabled?: boolean;
  /** What is being counted (e.g. "Guests"); read together with the value. */
  accessibilityLabel: string;
  /** Displayed and spoken form of the value. @default String */
  formatValue?: (value: number) => string;
  /** @default labels.increase from `NativeUIConfig.labels` */
  increaseAccessibilityLabel?: string;
  /** @default labels.decrease from `NativeUIConfig.labels` */
  decreaseAccessibilityLabel?: string;
  /** Haptic played on change, or `false`. @default 'light' */
  haptic?: keyof HapticsInterface | false;
  style?: StyleProp<ViewStyle>;
  /** Test ID of the root; the buttons receive `{testID}-decrease` and `{testID}-increase`. */
  testID?: string;
}

function frameStyle(theme: Theme, style: StyleProp<ViewStyle>): StyleProp<ViewStyle> {
  const tokens = theme.components.stepper;

  return [
    styles.frame,
    {
      borderRadius: tokens.radius,
      borderWidth: tokens.borderWidth,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    style,
  ];
}

interface StepperValueProps {
  text: string;
  accessibilityLabel: string;
}

/** The number between the buttons; a live region, so each change is announced. */
function StepperValue({ text, accessibilityLabel }: StepperValueProps) {
  const theme = useTheme();
  const tokens = theme.components.stepper;

  return (
    <Text
      accessibilityLabel={`${accessibilityLabel}: ${text}`}
      accessibilityLiveRegion="polite"
      style={[
        theme.typography[tokens.valueVariant],
        styles.value,
        {
          minWidth: tokens.valueMinWidth,
          paddingHorizontal: tokens.valuePaddingHorizontal,
          color: theme.colors.textPrimary,
        },
      ]}
    >
      {text}
    </Text>
  );
}

function useStepper(props: StepperProps) {
  const { value, min = 0, max = Number.MAX_SAFE_INTEGER, step = 1, haptic = 'light' } = props;
  const bounds: StepperBounds = { min, max, step };
  const change = (direction: StepDirection) => {
    if (haptic) {
      getHaptics()[haptic]();
    }

    props.onChange(stepValue(value, direction, bounds));
  };

  return { bounds, change };
}

/**
 * Small number input with a decrease and an increase button, for counts the
 * user changes by a few steps (guests, quantity). Each button is disabled at
 * its bound, and the value is announced after every change. Dimensions come
 * from `theme.components.stepper`.
 *
 * @example
 * ```tsx
 * <Stepper accessibilityLabel="Guests" value={guests} onChange={setGuests} min={1} max={8} />
 * ```
 */
export function Stepper(props: StepperProps) {
  const { value, disabled = false, testID } = props;
  const theme = useTheme();
  const { bounds, change } = useStepper(props);
  const text = (props.formatValue ?? String)(value);

  return (
    <View testID={testID} style={frameStyle(theme, props.style)}>
      <StepperButton
        glyph="minus"
        accessibilityLabel={props.decreaseAccessibilityLabel ?? theme.labels.decrease}
        disabled={disabled || !canStep(value, STEP_DIRECTION.decrease, bounds)}
        onPress={() => change(STEP_DIRECTION.decrease)}
        testID={testID ? `${testID}-decrease` : undefined}
      />
      <StepperValue text={text} accessibilityLabel={props.accessibilityLabel} />
      <StepperButton
        glyph="plus"
        accessibilityLabel={props.increaseAccessibilityLabel ?? theme.labels.increase}
        disabled={disabled || !canStep(value, STEP_DIRECTION.increase, bounds)}
        onPress={() => change(STEP_DIRECTION.increase)}
        testID={testID ? `${testID}-increase` : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  value: {
    textAlign: 'center',
  },
});
