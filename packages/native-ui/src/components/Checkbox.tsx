import React, { useCallback } from 'react';
import { StyleSheet, View, Pressable, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { SystemIcon } from '../primitives/SystemIcon';
import { getHaptics } from '../utils/haptics';
import { SelectionLabel, useSelectionRow } from './selection/selectionRow';

export interface CheckboxProps {
  /** Whether the checkbox is checked */
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Label displayed next to the checkbox */
  label?: string;
  /** Accessible name; defaults to `label`. Use it for a checkbox without a visible label. */
  accessibilityLabel?: string;
  disabled?: boolean;
  /** Size (default: 'md') */
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
  /** Test ID of the row; the box receives `{testID}-box`, the check mark `{testID}-check`. */
  testID?: string;
}

interface CheckboxBoxProps {
  checked: boolean;
  size: 'sm' | 'md';
  testID?: string;
}

/**
 * The visual box. Hidden from assistive tech because the row already carries
 * the checkbox role, state and name.
 */
function CheckboxBox({ checked, size, testID }: CheckboxBoxProps) {
  const theme = useTheme();
  const tokens = theme.components.checkbox;
  const sizeTokens = tokens[size];

  return (
    <View
      testID={testID ? `${testID}-box` : undefined}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
      style={[
        styles.box,
        {
          width: sizeTokens.size,
          height: sizeTokens.size,
          borderRadius: sizeTokens.radius,
          borderColor: checked ? theme.colors.primary : theme.colors.controlBorder,
          backgroundColor: checked ? theme.colors.primary : 'transparent',
          borderWidth: checked ? 0 : tokens.borderWidth,
        },
      ]}
    >
      {checked && <CheckMark size={sizeTokens.iconSize} testID={testID} />}
    </View>
  );
}

function CheckMark({ size, testID }: { size: number; testID?: string }) {
  const theme = useTheme();

  return (
    <SystemIcon
      name="check"
      size={size}
      color={theme.colors.onPrimary}
      testID={testID ? `${testID}-check` : undefined}
    />
  );
}

/**
 * A checkbox with optional label. Accessible and theme-aware.
 */
export const Checkbox = React.memo(function Checkbox({
  checked,
  onChange,
  label,
  accessibilityLabel,
  disabled = false,
  size = 'md',
  style,
  testID,
}: CheckboxProps) {
  const { focusProps, rowStyle } = useSelectionRow('checkbox', disabled, style);
  const handlePress = useHapticToggle(checked, onChange);

  return (
    <Pressable
      testID={testID}
      onPress={handlePress}
      {...focusProps}
      disabled={disabled}
      style={rowStyle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={accessibilityLabel ?? label}
    >
      <CheckboxBox checked={checked} size={size} testID={testID} />
      {label && <SelectionLabel label={label} />}
    </Pressable>
  );
});

/** Light haptic tick, then reports the inverted value. */
function useHapticToggle(checked: boolean, onChange: (checked: boolean) => void): () => void {
  return useCallback(() => {
    getHaptics().light();
    onChange(!checked);
  }, [checked, onChange]);
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
