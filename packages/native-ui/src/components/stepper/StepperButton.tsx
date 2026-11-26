import { Pressable, StyleSheet } from 'react-native';
import { useFocusRing } from '../../hooks/useFocusRing';
import { SystemIcon, type SystemIconName } from '../../primitives/SystemIcon';
import { useTheme } from '../../theme';
import type { Theme } from '../../theme/types';
import { accessibilityStateProps } from '../../utils/accessibilityStateProps';

export interface StepperButtonProps {
  glyph: Extract<SystemIconName, 'plus' | 'minus'>;
  accessibilityLabel: string;
  disabled: boolean;
  onPress: () => void;
  testID: string | undefined;
}

function buttonStyle(theme: Theme, disabled: boolean) {
  const tokens = theme.components.stepper;

  return [
    styles.button,
    { width: tokens.buttonSize, height: tokens.buttonSize },
    disabled && { opacity: theme.opacity.disabled },
  ];
}

export function StepperButton(props: StepperButtonProps) {
  const { disabled } = props;
  const theme = useTheme();
  const { focusProps, focusRingStyle } = useFocusRing();

  return (
    <Pressable
      testID={props.testID}
      onPress={props.onPress}
      {...focusProps}
      disabled={disabled}
      accessibilityLabel={props.accessibilityLabel}
      {...accessibilityStateProps('button', { disabled })}
      style={[buttonStyle(theme, disabled), focusRingStyle]}
    >
      <SystemIcon
        name={props.glyph}
        color={theme.colors.textPrimary}
        size={theme.components.stepper.iconSize}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
